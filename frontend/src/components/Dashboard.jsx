import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react"; // Icons come pre-installed with shadcn
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  // Mock Data - In a real app, you would fetch this from your backend
  const [users] = useState([
    { id: 1, firstName: "Alice", lastName: "Smith", email: "alice@example.com" },
    { id: 2, firstName: "Bob", lastName: "Johnson", email: "bob@example.com" },
    { id: 3, firstName: "Charlie", lastName: "Williams", email: "charlie@example.com" },
    { id: 4, firstName: "David", lastName: "Brown", email: "david@example.com" },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- App Bar --- */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center h-16 px-4">
          <h1 className="text-xl font-bold">Payments App</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Hello, User</span>
            <Avatar>
              {/* Fallback shows initials if image fails or doesn't exist */}
              <AvatarFallback className="bg-slate-200">U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-4xl mx-auto mt-8 px-4 space-y-8">
        
        {/* Balance Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Your Balance
              </span>
              <span className="text-4xl font-bold tracking-tight">
                $5,000
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Users Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Users</h2>
          
          <Card>
            <CardHeader>
              {/* Search Bar with Icon */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-8" // Add padding left so text doesn't hit the icon
                />
              </div>
            </CardHeader>
            
            <CardContent className="grid gap-6">
              {/* Dynamic User Mapping */}
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  
                  {/* Left side: Avatar + Name */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      {/* Logic to get first letter of name for the circle */}
                      <AvatarFallback className="bg-slate-100 text-slate-900">
                        {user.firstName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {/* Right side: Action Button */}
                  <Button 
                  className="bg-black text-white hover:bg-gray-800"
                  onClick={() => {
                      // Navigate to /send and pass the userId so you know who to pay
                      navigate(`/send?id=${user.id}&name=${user.firstName}`);
                    }}>
                    Send Money
                  </Button>
                  
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}