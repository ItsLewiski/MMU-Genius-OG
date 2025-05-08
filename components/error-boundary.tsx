"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        this.props.fallback || (
          <Card className="w-full max-w-md mx-auto my-8 border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="h-5 w-5" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-red-600 dark:text-red-400">
                <p className="font-medium mb-2">An error occurred in the application:</p>
                <pre className="bg-red-100 dark:bg-red-900/20 p-2 rounded overflow-auto text-xs mb-2">
                  {this.state.error?.toString()}
                </pre>
                {process.env.NODE_ENV !== "production" && this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-medium mb-1">Stack trace</summary>
                    <pre className="bg-red-100 dark:bg-red-900/20 p-2 rounded overflow-auto text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={this.handleReset} variant="outline" className="w-full">
                Try Again
              </Button>
            </CardFooter>
          </Card>
        )
      )
    }

    return this.props.children
  }
}
