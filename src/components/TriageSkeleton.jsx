export default function TriageSkeleton() {
    return (
        <div className="w-full max-w-2xl mx-auto pt-6 flex flex-col gap-5 animate-pulse">
            {/* Header shimmer */}
            <div className="text-center">
                <div className="h-8 w-64 bg-slate-200 rounded-lg mx-auto mb-2" />
                <div className="h-4 w-96 bg-slate-100 rounded mx-auto" />
            </div>

            {/* Brain animation */}
            <div className="flex flex-col items-center py-12 gap-4">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-10 h-10 text-blue-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10" />
                        </svg>
                    </div>
                    <span className="absolute inset-0 rounded-full bg-blue-200 opacity-30 animate-ping" />
                </div>
                <p className="text-blue-600 font-semibold text-sm">AI is analyzing your symptoms...</p>
                <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>

            {/* Fake result card shimmer */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between">
                    <div>
                        <div className="h-3 w-24 bg-slate-200 rounded mb-2" />
                        <div className="h-6 w-40 bg-slate-200 rounded" />
                    </div>
                    <div className="h-6 w-20 bg-slate-100 rounded-full" />
                </div>
                <div className="px-6 py-5 space-y-3">
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                    <div className="h-4 w-full bg-slate-100 rounded" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                </div>
            </div>
        </div>
    );
}
