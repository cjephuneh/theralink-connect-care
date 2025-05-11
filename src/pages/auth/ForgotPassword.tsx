
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Check } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would connect to a password reset service
    console.log("Reset password for:", email);
    
    // Show success message
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 bg-thera-600 text-white p-3 rounded-md inline-flex">
            <span className="font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold">Forgot your password?</h1>
          <p className="text-muted-foreground mt-2">No worries, we'll help you reset it</p>
        </div>

        <Card className="w-full">
          {!submitted ? (
            <>
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Reset Link
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-center">Check your email</CardTitle>
                <CardDescription className="text-center">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your inbox and follow the instructions to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Didn't receive an email? Check your spam folder or
                  <button 
                    className="text-thera-600 hover:underline ml-1"
                    onClick={() => setSubmitted(false)}
                  >
                    try again
                  </button>.
                </p>
              </CardContent>
            </>
          )}
          <CardFooter>
            <Link 
              to="/auth/login" 
              className="flex items-center text-sm text-thera-600 hover:underline w-full justify-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
