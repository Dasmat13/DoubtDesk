"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { Loader2, TrendingUp, AlertCircle, CheckCircle2, Users } from "lucide-react";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function TeacherDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/teacher/insights")
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!data) return <div className="text-slate-900 dark:text-white text-center py-10 font-bold uppercase tracking-widest text-xs">Failed to load analytics</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">
                    Classroom <span className="text-blue-500">Insights</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                    <Users className="w-3 h-3" /> Real-time Student Confusion Metrics
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Top Struggle", value: data.topTopics[0]?.topic || "N/A", icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
                    { label: "Most Active Room", value: data.subjectVolume[0]?.subject || "N/A", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Resolution Rate", value: `${Math.round((data.statusDistribution.find((s: any) => s.status === "solved")?.count || 0) / (data.statusDistribution.reduce((a: any, b: any) => a + b.count, 0) || 1) * 100)}%`, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-3xl p-6 hover:border-slate-200 dark:hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 ${stat.bg} rounded-2xl`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">{stat.label}</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart: Confusion Topics */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 px-2">Top Confusion Topics</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topTopics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="topic" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Solved vs Unsolved */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 px-2">Doubt Status</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="status"
                                >
                                    {data.statusDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.status === "solved" ? "#10b981" : "#ef4444"} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Subject Volume Table */}
            <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-slate-200 dark:border-white/5">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Doubt Volume by Subject</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-white/5 bg-white/[0.02]">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">Subject</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">Doubt Count</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">Engagement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.subjectVolume.map((item: any, i: number) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-4">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.subject}</span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="text-sm font-bold text-blue-400">{item.count}</span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="w-24 h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{ width: `${(item.count / data.subjectVolume.reduce((a: any, b: any) => a + b.count, 0)) * 100}%` }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
