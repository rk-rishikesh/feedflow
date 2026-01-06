"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Youtube, ArrowRight, Loader2, PlayCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function VideoSummaryPage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSummary("");

        try {
            const res = await fetch("/api/gemini/youtube", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to generate summary");
            }

            setSummary(data.text);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 overflow-hidden font-['DM_Sans']">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute top-[20%] left-[30%] w-[30%] h-[30%] bg-pink-600/10 blur-[100px] rounded-full mix-blend-screen animate-pulse" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20 max-w-4xl min-h-screen flex flex-col items-center justify-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-purple-200 mb-4">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span>Powered by Gemini 2.0 Flash</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 font-['Funnel_Display']">
                        Video Intelligence
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto font-light">
                        Transform hours of content into seconds of insight. Paste any YouTube URL below to get an instant AI-powered summary.
                    </p>
                </motion.div>

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-2xl relative group"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

                    <form onSubmit={handleSubmit} className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-2 shadow-2xl">
                        <div className="pl-4 text-white/40">
                            <Youtube className="w-6 h-6" />
                        </div>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste YouTube URL here..."
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/20 h-14 font-medium"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading || !url}
                            className="h-12 px-8 rounded-xl bg-white text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Scanning...</span>
                                </>
                            ) : (
                                <>
                                    <span>Analyze</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Results Area */}
                {(summary || error) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-12"
                    >
                        {error ? (
                            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 text-center backdrop-blur-md">
                                <p>Error: {error}</p>
                            </div>
                        ) : (
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-3xl blur opacity-20" />
                                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                                    <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6">
                                        <div className="p-3 bg-purple-500/20 rounded-xl">
                                            <PlayCircle className="w-6 h-6 text-purple-300" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">Video Summary</h3>
                                            <p className="text-sm text-white/40">Generated by AI • Just now</p>
                                        </div>
                                    </div>
                                    <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white/90 prose-p:text-white/70 prose-strong:text-white prose-li:text-white/70">
                                        <ReactMarkdown>{summary}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}