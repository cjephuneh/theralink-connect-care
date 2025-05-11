
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, HomeIcon, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] text-center animation-fade-in">
      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-subtle"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full animate-pulse-subtle" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/30 rounded-full animate-pulse-subtle" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center">
          <Search className="h-10 w-10 text-primary" />
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button asChild size="lg">
          <Link to="/">
            <HomeIcon className="h-5 w-5 mr-2" /> Return Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/therapists">
            <ArrowLeft className="h-5 w-5 mr-2" /> Explore Therapists
          </Link>
        </Button>
      </div>
      
      <div className="text-muted-foreground">
        <p>
          Need assistance? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
