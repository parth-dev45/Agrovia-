import { useState, ReactNode, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressSteps } from './ProgressSteps';
import { ArrowLeft, ArrowRight, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FormStep {
  id: string;
  title: string;
  description?: string;
  component: ReactNode;
  validation?: () => boolean | Promise<boolean>;
  optional?: boolean;
  onEnter?: () => void; // Called when step becomes active
  onLeave?: () => void; // Called when leaving step
}

interface MultiStepFormProps {
  steps: FormStep[];
  onSubmit: () => void | Promise<void>;
  onSave?: () => void | Promise<void>;
  onStepChange?: (stepIndex: number) => void;
  className?: string;
  showProgress?: boolean;
  allowSkip?: boolean;
  allowClickableSteps?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number; // in milliseconds
}

export function MultiStepForm({ 
  steps, 
  onSubmit, 
  onSave,
  onStepChange,
  className,
  showProgress = true,
  allowSkip = false,
  allowClickableSteps = false,
  autoSave = false,
  autoSaveDelay = 2000
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepErrors, setStepErrors] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !onSave) return;

    const autoSaveTimer = setTimeout(async () => {
      if (isSaving || isSubmitting) return;
      
      try {
        setIsSaving(true);
        await onSave();
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, autoSaveDelay);

    return () => clearTimeout(autoSaveTimer);
  }, [currentStep, autoSave, onSave, autoSaveDelay, isSaving, isSubmitting]);

  // Call onEnter when step becomes active
  useEffect(() => {
    if (currentStepData?.onEnter) {
      currentStepData.onEnter();
    }
    
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, currentStepData, onStepChange]);

  const progressSteps = steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    completed: completedSteps.has(index),
    current: index === currentStep,
    optional: step.optional,
    error: stepErrors.has(index)
  }));

  const validateCurrentStep = async (): Promise<boolean> => {
    if (!currentStepData.validation) return true;
    
    try {
      const result = await currentStepData.validation();
      
      // Update error state
      setStepErrors(prev => {
        const newErrors = new Set(prev);
        if (result) {
          newErrors.delete(currentStep);
        } else {
          newErrors.add(currentStep);
        }
        return newErrors;
      });
      
      if (!result) {
        toast({
          title: "Validation Error",
          description: "Please fix the errors in this step before continuing.",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      console.error('Step validation failed:', error);
      setStepErrors(prev => new Set([...prev, currentStep]));
      toast({
        title: "Validation Error",
        description: "An error occurred while validating this step.",
        variant: "destructive",
      });
      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid) {
      // Call onLeave for current step
      if (currentStepData?.onLeave) {
        currentStepData.onLeave();
      }
      
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      if (isLastStep) {
        await handleSubmit();
      } else {
        setCurrentStep(currentStep + 1);
        // Manual save on step completion
        if (onSave && !autoSave) {
          try {
            setIsSaving(true);
            await onSave();
            setLastSaved(new Date());
          } catch (error) {
            console.error('Save failed:', error);
          } finally {
            setIsSaving(false);
          }
        }
      }
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      if (currentStepData?.onLeave) {
        currentStepData.onLeave();
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex === currentStep) return;
    
    if (allowClickableSteps && (stepIndex <= currentStep || completedSteps.has(stepIndex - 1))) {
      if (currentStepData?.onLeave) {
        currentStepData.onLeave();
      }
      setCurrentStep(stepIndex);
    }
  }, [currentStep, completedSteps, allowClickableSteps, currentStepData]);

  const skipStep = () => {
    if (allowSkip && currentStepData.optional) {
      if (currentStepData?.onLeave) {
        currentStepData.onLeave();
      }
      
      if (isLastStep) {
        handleSubmit();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
      toast({
        title: "Success!",
        description: "Form submitted successfully.",
      });
    } catch (error) {
      console.error('Form submission failed:', error);
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSave = async () => {
    if (!onSave || isSaving) return;
    
    try {
      setIsSaving(true);
      await onSave();
      setLastSaved(new Date());
      toast({
        title: "Saved",
        description: "Your progress has been saved.",
      });
    } catch (error) {
      console.error('Manual save failed:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-6", className)}>
      {showProgress && (
        <ProgressSteps 
          steps={progressSteps} 
          currentStep={currentStep}
          onStepClick={goToStep}
          allowClickableSteps={allowClickableSteps}
          className="mb-8"
        />
      )}

      <Card className="glass-card shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                {currentStepData.optional && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Optional
                  </span>
                )}
                {stepErrors.has(currentStep) && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
              {currentStepData.description && (
                <p className="text-muted-foreground mt-2">{currentStepData.description}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>
              {lastSaved && (
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3 w-3 text-fresh" />
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step Content */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            {currentStepData.component}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
              
              {allowSkip && currentStepData.optional && (
                <Button
                  variant="ghost"
                  onClick={skipStep}
                  disabled={isSubmitting}
                  className="text-muted-foreground"
                >
                  Skip this step
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {onSave && !autoSave && (
                <Button
                  variant="outline"
                  onClick={handleManualSave}
                  disabled={isSaving || isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Draft
                    </>
                  )}
                </Button>
              )}
              
              <Button
                onClick={nextStep}
                disabled={isSubmitting || isSaving}
                className="flex items-center gap-2 min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Submitting...
                  </>
                ) : isLastStep ? (
                  <>
                    Complete
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation Pills */}
      {showProgress && steps.length > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2 p-2 bg-secondary/50 rounded-xl">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                disabled={!allowClickableSteps || (index > currentStep && !completedSteps.has(index - 1))}
                className={cn(
                  "px-3 py-1 rounded-lg text-sm font-medium transition-all relative",
                  index === currentStep && "bg-primary text-primary-foreground shadow-sm",
                  completedSteps.has(index) && index !== currentStep && "bg-fresh/20 text-fresh hover:bg-fresh/30",
                  index > currentStep && !completedSteps.has(index - 1) && "text-muted-foreground cursor-not-allowed opacity-50",
                  index < currentStep && !completedSteps.has(index) && "hover:bg-secondary text-foreground",
                  stepErrors.has(index) && "bg-destructive/20 text-destructive",
                  allowClickableSteps && (index <= currentStep || completedSteps.has(index - 1)) && "hover:scale-105 cursor-pointer"
                )}
                title={step.title}
              >
                {index + 1}
                {stepErrors.has(index) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
                {step.optional && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Auto-save indicator */}
      {autoSave && isSaving && (
        <div className="fixed bottom-4 right-4 bg-secondary/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
          Auto-saving...
        </div>
      )}
    </div>
  );
}