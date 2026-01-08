import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Search } from "lucide-react"; // Icons come pre-installed with shadcn
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";

export default function Dashboard() {
  const [filter, setFilter] = useState("")
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const handleBalance = async () => {
      try {
        setIsBalanceLoading(true)

        const response = await api.get(`/account/balance`)
        setBalance(response.data.balance)
        console.log("render balance")

        setIsBalanceLoading(false)

      } catch (error) {

        setIsBalanceLoading(false)

        if (error.response?.status === 404) {
          toast.error(error.response.data.message, {
            description: "Create Account First",
          });
        }
        else {
          toast.error("Error", {
            description: "Something went wrong. Please try again.",
          });
        }
        console.log(error)
      }
    }
    handleBalance()
  }, [])

  useEffect(() => {
    const handleSearch = async () => {
      try {
        setIsUsersLoading(true)

        const response = await api.get(`/user/bulk?filter=${filter}`)
        setUsers(response.data.users)
        console.log("render")

        setIsUsersLoading(false)

      } catch (error) {

        setIsUsersLoading(false)

        if (error.response?.data) {
          toast.error("Search failed", {
            description: error.response.data.message,
          });
        }
        else {
          toast.error("Search failed", {
            description: "Something went wrong. Please try again.",
          });
        }
        console.log(error)
      }
    }
    handleSearch()
  }, [filter])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* --- App Bar --- */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center h-16 px-4">
          <h1 className="text-xl font-bold">Payments App</h1>

          {/* 2. Wrap the profile section in a Link to /profile */}
          <Link to="/profile">
            <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-100 py-2 px-4 rounded-full transition-colors duration-200">
              <span className="text-sm font-medium text-slate-700">Hello, User</span>
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarFallback className="bg-slate-200 text-slate-600 font-semibold">U</AvatarFallback>
              </Avatar>
            </div>
          </Link>
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
              <span className="text-4xl font-bold tracking-tight flex">
                {isBalanceLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : `$${balance}`}
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
                <div className="relative">
                  <Input
                    placeholder="Search users..."
                    className="pl-8 pr-10" // Add padding on both sides
                    onChange={(e) => { setFilter(e.target.value) }}
                  />
                  {isUsersLoading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin" />
                  )}
                </div>
              </div>

            </CardHeader>

            <CardContent className="grid gap-6">
              {/* Dynamic User Mapping */}
              {users.map((user) => (
                <div key={user._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">

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
                      navigate(`/send?id=${user._id}&name=${user.firstName}`);
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