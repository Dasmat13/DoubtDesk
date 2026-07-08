import { POST } from "@/app/api/admin/moderation/action/route";
import { NextRequest } from "next/server";

const requireAdminMock = jest.fn();
jest.mock("@/lib/auth/requireAdmin", () => ({
    requireAdmin: () => requireAdminMock(),
}));

const currentUserMock = jest.fn();
jest.mock("@clerk/nextjs/server", () => ({
    currentUser: () => currentUserMock(),
}));

const sendWarningEmailMock = jest.fn();
const sendBlockEmailMock = jest.fn();
jest.mock("@/lib/email/email", () => ({
    sendWarningEmail: (...args: any[]) => sendWarningEmailMock(...args),
    sendBlockEmail: (...args: any[]) => sendBlockEmailMock(...args),
}));

const auditLogMock = jest.fn();
jest.mock("@/lib/audit/audit", () => ({
    auditLog: (...args: any[]) => auditLogMock(...args),
    AUDIT_ACTIONS: {
        MODERATION_DISMISSED: "MODERATION_DISMISSED",
        USER_WARNED: "USER_WARNED",
        USER_BLOCKED: "USER_BLOCKED",
    },
}));

const selectResultQueue: any[] = [];
const updateMock = jest.fn().mockImplementation(() => ({
    set: jest.fn().mockImplementation(() => ({
        where: jest.fn().mockImplementation(() => Promise.resolve({})),
    })),
}));

const createQueryMock = (data: any) => ({
    from: () => createQueryMock(data),
    where: () => createQueryMock(data),
    limit: () => createQueryMock(data),
    then: (resolve: any) => Promise.resolve(resolve(data)),
});

jest.mock("@/configs/db", () => ({
    db: {
        select: jest.fn().mockImplementation(() => createQueryMock(selectResultQueue.shift() ?? [])),
        update: (...args: any[]) => updateMock(...args),
    },
}));

describe("Admin Moderation Action API Endpoint", () => {
    beforeEach(() => {
        requireAdminMock.mockReset();
        currentUserMock.mockReset();
        sendWarningEmailMock.mockReset();
        sendBlockEmailMock.mockReset();
        auditLogMock.mockReset();
        updateMock.mockClear();
        selectResultQueue.length = 0;
        jest.clearAllMocks();
    });

    it("rejects unauthorized access when requireAdmin fails", async () => {
        requireAdminMock.mockRejectedValue(new Error("NEXT_REDIRECT"));
        currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "admin@example.com" } });

        const req = new NextRequest("http://localhost/api/admin/moderation/action", {
            method: "POST",
            body: JSON.stringify({ logId: 1, userEmail: "test@example.com", action: "dismiss" }),
        });

        await expect(POST(req)).rejects.toThrow("NEXT_REDIRECT");
    });

    it("returns 400 when body parameters violate the Zod schema", async () => {
        requireAdminMock.mockResolvedValue({});
        currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "admin@example.com" } });

        const testCases = [
            // Missing all fields
            {},
            // Invalid email
            { logId: 1, userEmail: "invalid-email", action: "dismiss" },
            // Negative logId
            { logId: -1, userEmail: "test@example.com", action: "dismiss" },
            // Float logId
            { logId: 1.5, userEmail: "test@example.com", action: "dismiss" },
            // Invalid action enum
            { logId: 1, userEmail: "test@example.com", action: "invalid-action" },
        ];

        for (const testCase of testCases) {
            const req = new NextRequest("http://localhost/api/admin/moderation/action", {
                method: "POST",
                body: JSON.stringify(testCase),
            });

            const res = await POST(req);
            expect(res.status).toBe(400);
            const json = await res.json();
            expect(json.success).toBe(false);
            expect(json.error).toBe("Validation failed");
        }
    });

    it("returns 404 when the target user is not found", async () => {
        requireAdminMock.mockResolvedValue({});
        currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "admin@example.com" } });
        // Empty array for user select query
        selectResultQueue.push([]);

        const req = new NextRequest("http://localhost/api/admin/moderation/action", {
            method: "POST",
            body: JSON.stringify({ logId: 1, userEmail: "test@example.com", action: "dismiss" }),
        });

        const res = await POST(req);
        expect(res.status).toBe(404);
        const json = await res.json();
        expect(json.error).toBe("User not found");
    });

    it("successfully dismisses the moderation log", async () => {
        requireAdminMock.mockResolvedValue({});
        currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "admin@example.com" } });
        // Return existing user
        selectResultQueue.push([{ email: "test@example.com", violationCount: 0 }]);

        const req = new NextRequest("http://localhost/api/admin/moderation/action", {
            method: "POST",
            body: JSON.stringify({ logId: 1, userEmail: "test@example.com", action: "dismiss" }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.success).toBe(true);
        expect(json.message).toBe("Log dismissed");
        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(auditLogMock).toHaveBeenCalledWith(
            expect.objectContaining({
                actorEmail: "admin@example.com",
                targetEmail: "test@example.com",
                action: "MODERATION_DISMISSED",
                resourceId: 1,
            })
        );
    });

    it("successfully warns the user, increments violationCount, sends warning email, and audits", async () => {
        requireAdminMock.mockResolvedValue({});
        currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "admin@example.com" } });
        // Return existing user and then return the moderation log
        selectResultQueue.push(
            [{ email: "test@example.com", violationCount: 2 }],
            [{ id: 1, reason: "Inappropriate language" }]
        );

        const req = new NextRequest("http://localhost/api/admin/moderation/action", {
            method: "POST",
            body: JSON.stringify({ logId: 1, userEmail: "test@example.com", action: "warn" }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.success).toBe(true);
        expect(json.message).toBe("User warned successfully");
        expect(updateMock).toHaveBeenCalledTimes(2); // updates usersTable and moderationLogsTable
        expect(sendWarningEmailMock).toHaveBeenCalledWith("test@example.com", "Inappropriate language", 3);
        expect(auditLogMock).toHaveBeenCalledWith(
            expect.objectContaining({
                action: "USER_WARNED",
                metadata: {
                    violationCount: 3,
                    moderationLogId: 1,
                },
            })
        );
    });

    it("successfully blocks the user, increments blockCount, calculates duration, sends block email, and audits", async () => {
        requireAdminMock.mockResolvedValue({});
        currentUserMock.mockResolvedValue({ primaryEmailAddress: { emailAddress: "admin@example.com" } });
        // Return existing user
        selectResultQueue.push([{ email: "test@example.com", blockCount: 1 }]);

        const req = new NextRequest("http://localhost/api/admin/moderation/action", {
            method: "POST",
            body: JSON.stringify({ logId: 1, userEmail: "test@example.com", action: "block" }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.success).toBe(true);
        expect(json.message).toBe("User blocked successfully");
        expect(updateMock).toHaveBeenCalledTimes(2); // updates usersTable and moderationLogsTable
        expect(sendBlockEmailMock).toHaveBeenCalledWith("test@example.com", 7, 2); // 2nd block -> 7 days duration
        expect(auditLogMock).toHaveBeenCalledWith(
            expect.objectContaining({
                action: "USER_BLOCKED",
                metadata: {
                    durationDays: 7,
                    blockCount: 2,
                    moderationLogId: 1,
                },
            })
        );
    });
});
