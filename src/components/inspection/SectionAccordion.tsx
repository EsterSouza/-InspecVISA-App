import React from 'react';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SectionAccordionProps {
  title: React.ReactNode;
  totalItems: number;
  evaluatedItems: number;
  compliesCount: number;
  notCompliesCount: number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function SectionAccordion({
  title,
  totalItems,
  evaluatedItems,
  compliesCount,
  notCompliesCount,
  children,
  defaultExpanded = false,
}: SectionAccordionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const isComplete = evaluatedItems === totalItems && totalItems > 0;
  const isCritical = notCompliesCount > 0;

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50",
          isComplete ? "bg-gray-50/50" : "bg-white"
        )}
      >
        <div className="flex-1 pr-4">
          <div className="flex items-center space-x-2">
            <h3 className={cn(
              "text-lg font-semibold",
              isComplete ? "text-gray-600" : "text-gray-900"
            )}>
              {title}
            </h3>
            {isComplete && <CheckCircle className="h-5 w-5 text-green-500" />}
            {isCritical && !isComplete && <AlertTriangle className="h-4 w-4 text-red-500" />}
          </div>
          <div className="mt-1 flex items-center space-x-3 text-sm text-gray-500">
            <span className={isComplete ? "font-medium text-green-600" : ""}>
              {evaluatedItems} / {totalItems} avaliados
            </span>
            {evaluatedItems > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span className="text-green-600 font-medium">{compliesCount} conformes</span>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span className={notCompliesCount > 0 ? "text-red-500 font-medium" : ""}>
                  {notCompliesCount} não conformes
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Expand Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {/* Content */}
      <div 
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-6 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
