import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { toast } from "sonner"
import api from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export default function Signin() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()

  const handleSignin = async () => {
    try {
      setPending(true)

      const response = await api.post('/user/signin', {
        username,
        password,
      })

      localStorage.setItem("token", response.data.token);
      
      setPending(false)

      toast.success(`Sign In Successful!`, {
        description: response.data.message,
      });

      navigate("/dashboard")
    
    } catch (error) {
      

      if(error.response?.status === 400) {
        console.log(error.response.data.details)
        toast.error("Sign In failed", {
          description: error.response.data.message,
        });
      }
      else if (error.response?.status === 401) {
        toast.error("Sign In failed", {
          description: error.response.data.message,
        });
      }
      else {
        toast.error("Sign In failed", {
          description: "Something went wrong. Please try again.",
        });
      }
      
      setPending(false)
      // console.log(error)
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {/* Width constrained to 400px for a standard card look */}
      <Card className="w-[400px] shadow-md">
        
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your Username and Password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {/* Username */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="johndoe123"  onChange={(e) => setUsername( e.target.value )} />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••"  onChange={(e) => setPassword( e.target.value )} />
              </div>

            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            onClick={handleSignin}
            disabled={pending ||
              username.length === 0 ||
              password.length < 6}
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing You...
              </>
            ) : (
              <>
                Sign In
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up</a>
          </p>
        </CardFooter>

      </Card>
    </div>
  )
}