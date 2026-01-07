import React from "react"
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

export default function Signup() {
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
                  <Input id="firstName" placeholder="John" />
                </div>
                
                <div className="flex flex-col space-y-1.5 w-full">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="johndoe123" />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>

            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">Sign Up</Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account? <a href="/signin" className="text-primary hover:underline">Log in</a>
          </p>
        </CardFooter>

      </Card>
    </div>
  )
}