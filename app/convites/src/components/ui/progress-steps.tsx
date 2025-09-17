import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressStepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  steps, 
  currentStep, 
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
              index < currentStep 
                ? "bg-primary border-primary text-primary-foreground" 
                : index === currentStep
                ? "bg-wedding-cream border-primary text-primary"
                : "bg-muted border-muted-foreground/30 text-muted-foreground"
            )}>
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span className={cn(
              "mt-2 text-xs font-medium text-center max-w-20",
              index <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-0.5 mx-4 transition-colors duration-300",
              index < currentStep ? "bg-primary" : "bg-muted"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};