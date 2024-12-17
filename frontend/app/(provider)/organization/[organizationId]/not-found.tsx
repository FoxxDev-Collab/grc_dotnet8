import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto p-6">
      <Alert>
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>The requested organization could not be found.</AlertDescription>
      </Alert>
      <div className="mt-4">
        <Button asChild>
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
