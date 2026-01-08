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
import api from "@/lib/api"
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async () => {
    try {
      setPending(true)

      const response = await api.post('/user/signup', {
        username,
        password,
        firstName,
        lastName
      })

      localStorage.setItem("token", response.data.token);
      
      setPending(false)

      toast.success(`Sign Up Successful!`, {
        description: response.data.message,
      });

      navigate("/dashboard")
    
    } catch (error) {
      

      if(error.response?.status === 400) {
        console.log(error.response.data.details)
        toast.error("Sign Up failed", {
          description: error.response.data.message,
        });
      }
      else if (error.response?.status === 409) {
        toast.error("Sign Up failed", {
          description: error.response.data.message,
        });
      }
      else {
        toast.error("Sign Up failed", {
          description: "Something went wrong. Please try again.",
        });
      }
      
      setPending(false)
      console.log(error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {/* Width constrained to 400px for a standard card look */}
      <Card className="w-[400px] shadow-md">

        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your information to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">

              {/* Row for First Name & Last Name */}
              <div className="flex gap-4">
                <div className="flex flex-col space-y-1.5 w-full">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" onChange={(e) => setFirstName( e.target.value )} />
                </div>

                <div className="flex flex-col space-y-1.5 w-full">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" onChange={(e) => setLastName( e.target.value )} />
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="johndoe123" onChange={(e) => setUsername( e.target.value )} />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" onChange={(e) => setPassword( e.target.value )} />
              </div>

            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={pending ||
              firstName.length === 0 ||
              lastName.length === 0 ||
              username.length === 0 ||
              password.length < 6}
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing You Up...
              </>
            ) : (
              <>
                Sign Up
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account? <a href="/signin" className="text-primary hover:underline">Log in</a>
          </p>
        </CardFooter>

      </Card>
    </div>
  )
}