import { Thought } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface ThoughtHistoryProps {
    thoughts: Thought[];
    isLoading: boolean;
    accentColor?: string;
    emptyIcon?: string;
    emptyText?: string;
}

export function ThoughtHistory({
    thoughts,
    isLoading,
    accentColor = "#1DA1F2",
    emptyIcon = "🤖",
    emptyText = "Waiting for Knowledge Context..."
}: ThoughtHistoryProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${isLoading ? 'animate-ping' : 'animate-pulse'}`} style={{ backgroundColor: accentColor }} />
                <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest">
                    {isLoading ? 'Agent is Thinking...' : 'Internal Thought Process'}
                </h3>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#F8FAFC] border border-[#E2E8F0] border-dashed rounded-[24px] p-6 text-center"
                        >
                            <div className="flex flex-col items-center justify-center p-4 animate-pulse">
                                <div className="text-4xl mb-4 grayscale italic opacity-40">{emptyIcon}</div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                    Analyzing sources & Handshaking...
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {thoughts.length > 0 ? (
                        [...thoughts].reverse().map((thought, idx) => (
                            <motion.div
                                key={thought.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative pl-6 border-l-2`}
                                style={{ borderColor: idx === 0 ? accentColor : '#E2E8F0' }}
                            >
                                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${thought.type === 'initial' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {thought.type === 'initial' ? 'Genesis' : 'Refinement'}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {new Date(thought.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        {idx === 0 && (
                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                        )}
                                    </div>

                                    {thought.instructions && (
                                        <div className="mb-3 px-3 py-2 bg-slate-100/50 rounded-xl border border-slate-200/50">
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight mb-1">Instruction:</p>
                                            <p className="text-xs text-slate-600 font-medium italic">"{thought.instructions}"</p>
                                        </div>
                                    )}

                                    <div className="text-sm text-[#475569] leading-relaxed markdown-content">
                                        <ReactMarkdown>{thought.text}</ReactMarkdown>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                            <span>Intelligence Unit 0{thoughts.length - idx}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                            <div className="w-4 h-1 rounded-full bg-green-500" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : !isLoading && (
                        <div className="pt-4 text-left">
                            <p className="text-sm text-slate-400 font-medium italic">
                                {emptyText} <br />
                                Thinking will appear here after generation.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .custom-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .markdown-content strong {
                    font-weight: 800;
                    color: #1A1A1A;
                }
                .markdown-content em {
                    font-style: italic;
                    opacity: 0.9;
                }
                .markdown-content ul, .markdown-content ol {
                    margin-left: 1rem;
                    margin-top: 0.5rem;
                }
                .markdown-content li {
                    margin-bottom: 0.25rem;
                }
            `}</style>
        </div>
    );
}
