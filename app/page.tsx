"use client";

import { useState } from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, useClerk, UserButton } from "@clerk/nextjs";
import { FileText, Map, MessageCircle, FileEdit, ArrowRight, Mail, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { Inter, Staatliches, IBM_Plex_Mono } from "next/font/google";
import ShapeGrid from "@/components/ShapeGrid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const inter = Inter({ subsets: ["latin"] });
const staatliches = Staatliches({ subsets: ["latin"], weight: "400" });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export default function Home() {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/' });
  };

  return (
    <div className={`${inter.className} min-h-screen bg-[#020617] text-slate-200 flex flex-col selection:bg-blue-500/30`}>
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 bg-[#040B1A]/88 supports-[backdrop-filter]:bg-[#040B1A]/72 backdrop-blur-xl relative overflow-visible">
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(59,130,246,0.5),rgba(168,85,247,0.45),transparent)] shadow-[0_0_12px_rgba(59,130,246,0.25)]" />
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-[clamp(24px,5vw,64px)]">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_24px_rgba(59,130,246,0.28)] ring-1 ring-white/10">
              D
            </div>
            <h1 className="text-2xl font-bold text-white transition-colors drop-shadow-[0_0_10px_rgba(59,130,246,0.18)]">
              DoubtDesk
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/rooms">
                <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold border border-white/10 transition-all hover:shadow-[0_0_16px_rgba(255,255,255,0.08)]">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-[0_0_15px_rgba(37,99,235,0.32)] transition-all">
                  Join DoubtDesk
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link href="/rooms" className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-all hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]">
                  Classrooms
                </Link>
                <Link href="/profile" className="hidden sm:block px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-all hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]">
                  Profile
                </Link>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10 border border-white/20 shadow-sm"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              You will need to log in again to access your classroom insights and doubt-solving history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hero Section */}
      <main className="flex-1 pt-[128px] relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ShapeGrid
            speed={0.45}
            squareSize={42}
            direction="diagonal"
            borderColor="rgba(118, 169, 226, 0.09)"
            hoverFillColor="rgba(56, 189, 248, 0.24)"
            shape="square"
            hoverTrailAmount={5}
            className="opacity-90"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,64,175,0.12),rgba(2,6,23,0.36)_72%)]" />
        </div>
        <section className="px-6 pb-12 relative z-10 pt-3 md:pt-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-16 items-start">
            <div className="text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.08] mb-6">
                Empower Your Learning with <br />
                <span className={`${staatliches.className} uppercase tracking-[0.08em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_14px_rgba(59,130,246,0.18)]`}>
                  Collaborative AI.
                </span>
              </h2>

              <div className="max-w-2xl mb-10">
                <div className={`${staatliches.className} mb-3 text-sm tracking-[0.16em] text-blue-300/80 uppercase`}>
                  Collaborative classrooms
                </div>
                <p className="text-xl text-slate-300/90 leading-relaxed">
                  Built for collaborative classrooms, instant doubt solving, and smarter learning.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <SignedIn>
                  <Link href="/rooms" className="w-full sm:w-auto">
                    <button className="group px-10 py-5 bg-blue-600 text-white rounded-2xl text-lg font-bold hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all w-full flex items-center justify-center gap-2">
                      <span className={`${staatliches.className} uppercase tracking-[0.08em]`}>Open</span>
                      <span>Classroom</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </SignedIn>
                <SignedOut>
                  <SignUpButton mode="modal" forceRedirectUrl="/rooms">
                    <button className="group px-10 py-5 bg-white text-slate-950 rounded-2xl text-lg font-bold hover:bg-slate-200 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                      <span className={`${staatliches.className} uppercase tracking-[0.08em]`}>Open</span>
                      <span>Classroom</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </SignUpButton>
                </SignedOut>
              </div>
            </div>

            <div className="pt-2 xl:pt-3">
              <div className={`${staatliches.className} mb-6 text-sm tracking-[0.16em] text-blue-300/80 uppercase`}>
                Live ecosystem preview
              </div>
              <div className={`${ibmPlexMono.className} space-y-4 text-base sm:text-lg text-slate-200`}>
                <div className="flex items-start gap-3">
                  <span className="text-blue-300/85 font-semibold">&gt;</span>
                  <p>23 students discussing Operating Systems</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-300/85 font-semibold">&gt;</span>
                  <p>12 new notes uploaded</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-300/85 font-semibold">&gt;</span>
                  <p>4 active placement roadmaps</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
{/*Here's Your Previous Footer. I have just commented it in case */}
      {/* Footer
      <footer className="border-t border-white/5 bg-slate-950/50 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">D</div>
            <span className="font-bold text-white">DoubtDesk</span>
          </div>
          <p className="text-sm">© 2026 DoubtDesk. Engineered for Excellence.</p>
          <div className="flex items-center gap-6">
            <a href="mailto:divysaxena2402@gmail.com" className="hover:text-blue-400 transition-colors" title="Email">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/divyasaxena24/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" title="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com/divysaxena24" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" title="GitHub">
              <Github className="w-5 h-5" />
            </a>
          </div>
          <div className="flex gap-6 text-sm">
          </div>
        </div>
      </footer> */}
    </div>
  );
}
