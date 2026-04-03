import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Background from "@/features/auth/components/Background";

export default function NotFound() {
  return (
    <main className="h-screen w-screen flex items-center justify-center p-4">
      <Background />
      <div className="relative z-10 text-center space-y-6 max-w-lg">
        <div className="space-y-2">
          <div className="text-7xl font-bold bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            404
          </div>
          <h1 className="text-3xl font-semibold">Page not found</h1>
          <p className="text-muted-foreground text-sm">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <Link to="/">
            <Button className="font-semibold rounded-lg px-4 h-11">
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="font-semibold rounded-lg px-4 h-11">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="pt-8 text-xs text-muted-foreground">
          <p>Arkio. — Think freely, build faster.</p>
        </div>
      </div>
    </main>
  );
}
