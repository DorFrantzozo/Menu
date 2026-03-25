  import React from "react";
  import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

  class GlobalErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service here (like Sentry)
      this.setState({
        error: error,
        errorInfo: errorInfo
      });
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReset = () => {
      // Try to recover by resetting the ErrorBoundary state and forcing a hard refresh
      this.setState({ hasError: false, error: null, errorInfo: null });
      window.location.reload();
    };

    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
          <div className="min-h-[60vh] flex items-center justify-center p-4 bg-slate-50" dir="rtl">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-red-100">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-slate-800 mb-3">
                אופס! משהו השתבש
              </h1>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                האפליקציה נתקלה בשגיאה בלתי צפויה בעת הטעינה. אנחנו מצטערים על חוסר הנוחות.
              </p>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium shadow-md transition-all hover:shadow-lg"
              >
                רענן עמוד ונסה שוב
              </button>

              {/* Optional: Show stack trace only in development based on localhost/Vite env */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mt-8 text-left bg-red-50 p-4 rounded-lg overflow-x-auto" dir="ltr">
                  <p className="text-red-800 font-mono text-sm font-semibold mb-2">
                    {this.state.error.toString()}
                  </p>
                  <div className="text-red-600 font-mono text-xs whitespace-pre line-clamp-5 hover:line-clamp-none transition-all">
                    {this.state.errorInfo?.componentStack}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      // If there's no error, render the children normally
      return this.props.children;
    }
  }

  export default GlobalErrorBoundary;
