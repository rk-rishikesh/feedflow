import { SourceType } from '../types';

interface SourceCardProps {
    source: any; // Using any for simplicity now, but referencing types.ts will be better once refactor is done.
    expandedSource: number | null;
    toggleExpand: (id: number) => void;
    removeSource: (id: number) => void;
    getSourceColor: (type: SourceType) => string;
    getSourceIcon: (type: SourceType) => React.ReactNode;
}

export function SourceCard({
    source,
    expandedSource,
    toggleExpand,
    removeSource,
    getSourceColor,
    getSourceIcon,
}: SourceCardProps) {
    const isExpanded = expandedSource === source.id;

    return (
        <div
            id={`source-${source.id}`}
            className={`bg-[#FFFFFF] border border-[#D4D4D4] transition-all duration-300 ease-in-out ${isExpanded
                ? 'rounded-2xl shadow-lg border-[#B3B3B3]'
                : 'rounded-full cursor-pointer hover:shadow-md hover:border-[#B3B3B3]'
                }`}
            onClick={() => !isExpanded && toggleExpand(source.id)}
        >
            {/* Compact View */}
            {!isExpanded ? (
                <div className="px-4 py-3 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${getSourceColor(source.type)}`}>
                        {getSourceIcon(source.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[#2B2B2B] truncate">{source.title}</h3>
                        <p className="text-xs text-[#B3B3B3] truncate">{source.author || source.url}</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            removeSource(source.id);
                        }}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#B3B3B3] hover:text-[#2B2B2B] hover:bg-[#D4D4D4] transition-all shrink-0"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                /* Expanded View */
                <div className="overflow-hidden rounded-2xl">
                    {/* Header */}
                    <div className="p-5 flex items-start justify-between bg-[#FFFFFF]">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getSourceColor(source.type)}`}>
                                {getSourceIcon(source.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-[#2B2B2B] mb-1">{source.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-[#B3B3B3]">
                                    {source.author && <span>{source.author}</span>}
                                    {source.date && <span>• {source.date}</span>}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(source.id);
                            }}
                            className="w-6 h-6 flex items-center justify-center text-[#B3B3B3] hover:text-[#2B2B2B] transition-colors shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-5 pb-5 bg-[#FFFFFF] space-y-4">
                        {source.description && (
                            <p className="text-sm text-[#2B2B2B] leading-relaxed">{source.description}</p>
                        )}
                        <div className="flex items-center justify-between gap-3">
                            <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-[#2B2B2B] hover:text-[#2B2B2B]/80 truncate flex-1 underline"
                            >
                                {source.url}
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
