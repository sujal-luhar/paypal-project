import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Camera, Loader2, Save } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference to the hidden file input

  // Mock initial state (In real app, fetch this with useQuery)
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    password: "", // Password usually starts empty for security
  });

  useEffect

  const [avatarPreview, setAvatarPreview] = useState(null); // Stores the URL of selected image
  const [isLoading, setIsLoading] = useState(false);

  // Handle Text Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL to preview the image immediately
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // Trigger hidden file input click
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Simulate API Update
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile Updated", {
        description: "Your changes have been saved successfully.",
      });
      // Optional: Navigate back or stay here
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 py-12 px-4">
      <Card className="w-full max-w-lg shadow-xl">
        
        {/* --- Header --- */}
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 -ml-3"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
          </div>
          <CardDescription>
            Update your personal information and profile picture.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          
          {/* --- Avatar Upload Section --- */}
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative group cursor-pointer" 
              onClick={handleAvatarClick}
            >
              {/* The Avatar Image */}
              <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                <AvatarImage src={avatarPreview} className="object-cover" />
                <AvatarFallback className="text-2xl bg-slate-200">
                  {formData.firstName[0]}
                </AvatarFallback>
              </Avatar>

              {/* The Hover Overlay with Camera Icon */}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="text-white h-8 w-8" />
              </div>
              
              {/* Hidden Input Field */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-sm text-muted-foreground">Click to change avatar</p>
          </div>

          {/* --- Form Fields --- */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Leave blank to keep current" 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

        </CardContent>

        {/* --- Actions --- */}
        <CardFooter className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-black text-white hover:bg-gray-800 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>

      </Card>
    </div>
  );
}