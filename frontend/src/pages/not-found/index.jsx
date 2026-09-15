import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <GraduationCap className="h-12 w-12 text-primary" />
      <h1 className="text-6xl font-extrabold text-foreground">404</h1>
      <p className="max-w-sm text-muted-foreground">
        This page doesn't exist. It may have been moved or removed.
      </p>
      <Button asChild className="mt-2">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
}

export default NotFoundPage;
