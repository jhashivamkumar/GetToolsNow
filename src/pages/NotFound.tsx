import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you are looking for doesn't exist. Return to ToolSprint home to browse free online tools."
        canonical={location.pathname}
      />

      <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <section className="text-center px-6">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </section>
      </main>
    </>
  );
};

export default NotFound;

