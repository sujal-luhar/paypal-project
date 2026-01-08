import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, IndianRupee, AlertCircle, Send, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function SendMoney() {
    const [searchParams] = useSearchParams();
    const [warning, setWarning] = useState(""); // New state for warning message
    const navigate = useNavigate();

    // Get user details from the URL, with fallbacks
    const id = searchParams.get("id");
    const name = searchParams.get("name") || "Unknown User";

    const [amount, setAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Helper to get initials from a name (e.g., "Alice Smith" -> "AS")
    const getInitials = (fullName) => {
        return fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const handleTransfer = async () => {
        // 1. Basic Validation
        if (!amount || Number(amount) <= 0) {
            toast.warning("Please enter a valid amount");
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/account/transfer', {
                to: id,
                amount: Number(amount)
            })

            toast.success(response.data.message, {
                description: `You sent ₹${amount} to ${name}.`,
            });

            // Navigate after a short delay so user sees the success message
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (error) {
            if (error.response?.status === 400) {
                toast.error("Transfer failed", {
                    description: error.response.data.message,
                });
            }
            else {
                toast.error("Transfer failed", {
                    description: "Something went wrong. Please try again.",
                });
            }

            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 py-12 px-4">
            <Card className="w-full max-w-md shadow-xl">

                <CardHeader className="space-y-1 pb-2">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mr-2 -ml-3 text-muted-foreground hover:text-primary"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <CardTitle className="text-2xl font-bold">Send Money</CardTitle>
                    </div>
                    <CardDescription>
                        Instant, secure transfer to your contacts.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-8 pt-6">

                    {/* Recipient Profile Section */}
                    <div className="flex items-center p-4 bg-slate-100/80 rounded-xl border border-slate-200">
                        <Avatar className="h-14 w-14 mr-4 border-2 border-white shadow-sm">
                            {/* Try to load an avatar, fallback to initials */}
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                                {getInitials(name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-0.5">To</p>
                            <p className="text-xl font-bold tracking-tight">{name}</p>
                        </div>
                    </div>

                    {/* Amount Input Section */}
                    <div className="grid gap-3">
                        <Label htmlFor="amount" className="font-semibold pl-1">
                            Amount (in ₹)
                        </Label>
                        <div className="space-y-2"> {/* Container to hold input + warning message */}
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="amount"
                                    placeholder="Enter amount"
                                    className={`pl-12 text-lg py-6 font-medium ${warning ? "border-red-500 focus-visible:ring-red-500" : ""}`} // Add red border on error
                                    type="text" // changed to 'text' to fully control input behavior manually
                                    value={amount}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Regex: Only allow positive numbers and max 2 decimal places (optional)
                                        // If you want integers only, use /^\d*$/
                                        if (/^\d*\.?\d{0,2}$/.test(value)) {
                                            setAmount(value);
                                            setWarning(""); // Clear warning if valid
                                        } else {
                                            setWarning("Only numbers with only 2 decimals are allowed");
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleTransfer();
                                    }}
                                // Optional: Prevent typing invalid chars like 'e', '-', '+', etc. if you kept type="number"
                                // But since we switched to type="text" and regex, the onChange handles the blocking.
                                />
                            </div>

                            {/* Warning Message Area */}
                            {warning && (
                                <div className="flex items-center text-red-500 text-sm pl-1 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="h-4 w-4 mr-1.5" />
                                    {warning}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-4">
                    <Button
                        className="w-full text-lg h-12 bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        onClick={handleTransfer}
                        disabled={isLoading || !amount}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Initiate Transfer
                                <Send className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}