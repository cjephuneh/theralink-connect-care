import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"client" | "therapist" | "friend">("client");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signIn, user, profile } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && profile) {
      console.log('User role:', profile.role);
      
      // Redirect based on user role
      switch (profile.role) {
        case "therapist":
          navigate("/therapist/dashboard");
          break;
        case "friend":
          navigate("/friend/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          // Redirect "client" to client overview
          navigate("/client/overview");
          break;
      }
    }
  }, [user, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (!error) {
        // Navigation will happen via the useEffect when user state updates
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error("Google sign in error:", error);
      }
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 bg-thera-600 text-white p-3 rounded-md inline-flex">
            <span className="font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold">Welcome back to TheraLink</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <Tabs defaultValue="client" onValueChange={(value) => setLoginType(value as "client" | "therapist" | "friend")}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="client">Client Login</TabsTrigger>
                <TabsTrigger value="therapist">Therapist Login</TabsTrigger>
                <TabsTrigger value="friend">Friend Login</TabsTrigger>
              </TabsList>
              <TabsContent value="client">
                <CardDescription>
                  Sign in to access therapy and support services
                </CardDescription>
              </TabsContent>
              <TabsContent value="therapist">
                <CardDescription>
                  Sign in to manage your therapy practice
                </CardDescription>
              </TabsContent>
              <TabsContent value="friend">
                <CardDescription>
                  Sign in to provide peer support as a Friend
                </CardDescription>
              </TabsContent>
            </Tabs>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/auth/forgot-password" className="text-sm text-thera-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled={googleLoading || isLoading}
                  onClick={handleGoogleSignIn}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {googleLoading ? "Connecting..." : "Sign in with Google"}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-thera-600 hover:underline font-medium">
                Create an account <ArrowRight className="inline h-3 w-3" />
              </Link>
            </p>
            {loginType === "friend" && (
              <p className="text-center text-sm mt-4 text-muted-foreground">
                Want to share your experience as a Friend?{" "}
                <Link to="/auth/register?role=friend" className="text-thera-600 hover:underline font-medium">
                  Apply now <ArrowRight className="inline h-3 w-3" />
                </Link>
              </p>
            )}
            {loginType === "therapist" && (
              <p className="text-center text-sm mt-4 text-muted-foreground">
                Are you a therapist looking to join TheraLink?{" "}
                <Link to="/for-therapists" className="text-thera-600 hover:underline font-medium">
                  Learn more <ArrowRight className="inline h-3 w-3" />
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
