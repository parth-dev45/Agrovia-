import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full space-y-6">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-10 w-10 text-destructive" />
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold">Something went wrong</h1>
                                <p className="text-muted-foreground">
                                    We encountered an unexpected error. Don't worry, your data is safe.
                                </p>
                            </div>

                            {this.state.error && (
                                <details className="text-left bg-muted p-4 rounded-lg">
                                    <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
                                    <pre className="text-xs overflow-auto">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo && `\n\n${this.state.errorInfo.componentStack}`}
                                    </pre>
                                </details>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button onClick={this.handleReset} className="flex-1" variant="default">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                            <Button onClick={this.handleGoHome} className="flex-1" variant="outline">
                                <Home className="mr-2 h-4 w-4" />
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
