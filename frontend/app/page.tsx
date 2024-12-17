import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  SecureCenter
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="shadow-lg border-border/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                SecureCenter GRC/RMF Platform
              </CardTitle>
              <p className="text-muted-foreground">
                Your comprehensive solution for security assessment and compliance management
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Security Notice */}
              <Alert className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="text-blue-800 dark:text-blue-300">System Access Notice</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-400">
                  <div className="space-y-2 mt-2">
                    <p>
                      Welcome to our secure platform for managing compliance and security assessments.
                    </p>
                    <div className="mt-4 space-y-1 text-sm">
                      <p className="font-medium">Access Requirements:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Valid authorization credentials required</li>
                        <li>Responsibility for data confidentiality</li>
                        <li>Activity monitoring and logging enabled</li>
                        <li>Compliance with security policies</li>
                      </ul>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Login Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4">
                <Link
                  href="/provider/login"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-md bg-primary/90 text-primary-foreground hover:bg-primary transition-colors font-medium shadow-sm"
                >
                  Service Provider Login
                </Link>
                <Link
                  href="/client/login"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-md bg-secondary/90 text-secondary-foreground hover:bg-secondary transition-colors font-medium shadow-sm"
                >
                  Client Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SecureCenter GRC/RMF. All rights reserved.</p>
            <p className="mt-1">
              A secure platform for compliance and risk management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}