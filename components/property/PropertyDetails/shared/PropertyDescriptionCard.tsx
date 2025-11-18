import { Bot, FileText, Sparkles } from "lucide-react";

type DescriptionTab = "about" | "ai";

interface PropertyDescriptionCardProps {
  description?: string | null;
  hasDescription: boolean;
  tab: DescriptionTab;
  onTabChange: (tab: DescriptionTab) => void;
  aiSummary?: {
    summary: string;
    highlights: string[];
    confidence: number;
  } | null;
}

export function PropertyDescriptionCard({ description, hasDescription, tab, onTabChange, aiSummary }: PropertyDescriptionCardProps) {
  return (
    <div className="bg-gradient-to-br from-white via-slate-50/30 to-white backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Property Description</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Detailed property overview and features</p>
          </div>
        </div>
        <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-blue-400 to-indigo-500" />
      </div>
      <div className="px-4 sm:px-6 pb-3 sm:pb-4">
        <div className="flex bg-gradient-to-r from-slate-100/80 to-slate-50/80 rounded-xl p-1 sm:p-1.5 border border-slate-200/60">
          <button
            onClick={() => onTabChange("about")}
            className={`flex-1 px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 rounded-lg ${
              tab === "about"
                ? "text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md border border-blue-400/30"
                : "text-slate-600 hover:text-slate-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-transparent hover:border-blue-200/60"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 sm:gap-3">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>About</span>
            </div>
          </button>
          <button
            onClick={() => onTabChange("ai")}
            className={`flex-1 px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 rounded-lg ${
              tab === "ai"
                ? "text-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-md border border-purple-400/30"
                : "text-slate-600 hover:text-slate-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border border-transparent hover:border-purple-200/60"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 sm:gap-3">
              <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>AI Summary</span>
            </div>
          </button>
        </div>
      </div>
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        {tab === "about" ? (
          <div className="pl-5 border-l-2 border-slate-200">
            {hasDescription ? (
              <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">{description}</p>
            ) : (
              <p className="text-slate-500 leading-relaxed text-sm italic">No description available for this property.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {aiSummary ? (
              <>
                <div className="pl-5 border-l-2 border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-r-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-purple-800 mb-2">AI Summary</h5>
                      <p className="text-sm text-purple-700 leading-relaxed mb-3">{aiSummary.summary}</p>
                      {aiSummary.highlights && aiSummary.highlights.length > 0 && (
                        <ul className="space-y-1.5">
                          {aiSummary.highlights.map((highlight, index) => (
                            <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                              <span className="text-purple-500 mt-1">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {aiSummary.confidence && (
                        <div className="mt-3 pt-3 border-t border-purple-200/50">
                          <p className="text-xs text-purple-600">
                            Confidence: {Math.round(aiSummary.confidence * 100)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {hasDescription && (
                  <div className="pl-5 border-l-2 border-slate-200 mt-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Original Description</p>
                    <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">{description}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="pl-5 border-l-2 border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-r-lg py-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-sm font-semibold text-purple-800 mb-1">AI Summary Coming Soon</h5>
                    <p className="text-sm text-purple-700 leading-relaxed">AI-powered property insights are currently in development.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


