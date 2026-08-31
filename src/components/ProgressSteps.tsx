import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  current?: boolean;
  optional?: boolean;
  error?: boolean;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  onStepClick?: (stepIndex: number) => void;
  allowClickableSteps?: boolean;
}

export function ProgressSteps({ 
  steps, 
  currentStep, 
  className,
  onStepClick,
  allowClickableSteps = false
}: ProgressStepsProps) {
  const handleStepClick = (index: number) => {
    if (allowClickableSteps && onStepClick && (index <= currentStep || steps[index].completed)) {
      onStepClick(index);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep || step.completed;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep && !step.completed;
          const hasError = step.error;
          const isClickable = allowClickableSteps && (index <= currentStep || step.completed);

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 relative",
                    isCompleted && !hasError && "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20",
                    isCurrent && !hasError && "bg-primary/10 border-primary text-primary animate-pulse ring-2 ring-primary/20",
                    isUpcoming && !hasError && "bg-muted border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50",
                    hasError && "bg-destructive/10 border-destructive text-destructive animate-pulse",
                    isClickable && "cursor-pointer hover:scale-105 hover:shadow-md",
                    !isClickable && allowClickableSteps && "cursor-not-allowed opacity-60"
                  )}
                  onClick={() => handleStepClick(index)}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleStepClick(index);
                    }
                  }}
                >
                  {isCompleted && !hasError ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : hasError ? (
                    <Circle className="h-5 w-5 fill-current" />
                  ) : isCurrent ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                  
                  {step.optional && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-[8px] text-white font-bold">?</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isCompleted && !hasError && "text-primary",
                      isCurrent && !hasError && "text-primary font-semibold",
                      isUpcoming && !hasError && "text-muted-foreground",
                      hasError && "text-destructive font-semibold"
                    )}
                  >
                    {step.title}
                    {step.optional && (
                      <span className="text-xs text-blue-500 ml-1">(Optional)</span>
                    )}
                  </p>
                  {step.description && (
                    <p className={cn(
                      "text-xs mt-1 max-w-[120px] truncate transition-colors",
                      hasError ? "text-destructive/70" : "text-muted-foreground"
                    )}>
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-all duration-300",
                    index < currentStep || step.completed ? "bg-primary shadow-sm" : "bg-muted",
                    hasError && "bg-destructive/30"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}