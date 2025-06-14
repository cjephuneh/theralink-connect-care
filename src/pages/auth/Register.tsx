import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preSelectedRole = params.get('role') as "client" | "therapist" | "friend" | null;
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<"client" | "therapist" | "friend">(
    preSelectedRole || "client"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signUp, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Direct to the appropriate onboarding or dashboard
      if (accountType === "therapist") {
        navigate("/therapist/onboarding");
      } else if (accountType === "friend") {
        navigate("/friend/onboarding");
      } else {
        navigate("/client/overview"); // Changed from "/dashboard"
      }
    }
  }, [user, navigate, accountType]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userData = {
        full_name: name,
        role: accountType
      };

      const { error } = await signUp(email, password, userData);
      
      if (!error) {
        // Navigation will happen via the useEffect when user state updates
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            // Pass account type as a custom parameter
            role: accountType,
          },
          redirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) {
        console.error("Google sign up error:", error);
      }
    } catch (error) {
      console.error("Google sign up error:", error);
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
          <h1 className="text-3xl font-bold">Create your TheraLink account</h1>
          <p className="text-muted-foreground mt-2">Join our community for better mental health</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <Tabs defaultValue={accountType} onValueChange={(value) => setAccountType(value as "client" | "therapist" | "friend")}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="client">I'm a Client</TabsTrigger>
                <TabsTrigger value="therapist">I'm a Therapist</TabsTrigger>
                <TabsTrigger value="friend">I'm a Friend</TabsTrigger>
              </TabsList>
              <TabsContent value="client">
                <CardDescription>
                  Create an account to find support for your mental health journey
                </CardDescription>
              </TabsContent>
              <TabsContent value="therapist">
                <CardDescription>
                  Create an account to offer your therapeutic services on our platform
                </CardDescription>
              </TabsContent>
              <TabsContent value="friend">
                <CardDescription>
                  Create an account to share your experiences and support others
                </CardDescription>
              </TabsContent>
            </Tabs>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
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
                <div className="text-xs text-muted-foreground mt-1">
                  Password must be at least 8 characters long
                </div>
              </div>
              
              {accountType === "therapist" && (
                <div className="border rounded-md p-4 bg-muted/30">
                  <p className="text-sm font-medium mb-2">Therapist Requirements:</p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Valid professional license
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Professional liability insurance
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Verification process after sign-up
                    </li>
                  </ul>
                </div>
              )}

              {accountType === "friend" && (
                <div className="border rounded-md p-4 bg-muted/30">
                  <p className="text-sm font-medium mb-2">Friend Requirements:</p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Personal experience with mental health challenges
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Willingness to share your story to help others
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Agree to our community guidelines
                    </li>
                  </ul>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-thera-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-thera-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
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
                  onClick={handleGoogleSignUp}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {googleLoading ? "Connecting..." : "Sign up with Google"}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-thera-600 hover:underline font-medium">
                Sign in <ArrowRight className="inline h-3 w-3" />
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
