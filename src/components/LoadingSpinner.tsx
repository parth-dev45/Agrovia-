import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
}

const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
};

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 p-8">
            <Loader2 className={cn('animate-spin text-primary', sizeClasses[size], className)} />
            {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
        </div>
    );
}

// Full page loading overlay
export function LoadingOverlay({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="rounded-lg bg-card p-8 shadow-lg border">
                <LoadingSpinner size="lg" text={text} />
            </div>
        </div>
    );
}

// Skeleton loader for lists
export function SkeletonLoader({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card animate-pulse">
                    <div className="h-12 w-12 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/4 bg-muted rounded" />
                        <div className="h-3 w-1/2 bg-muted rounded" />
                    </div>
                    <div className="h-8 w-20 bg-muted rounded" />
                </div>
            ))}
        </div>
    );
}
