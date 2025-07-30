
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login, loading } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!name || !email) {
      toast({
        title: "Validation Error",
        description: "Please enter your name and email.",
        variant: "destructive"
      })
      return;
    }
    
    await login(name, email);
    onOpenChange(false);
    toast({
        title: "Logged In!",
        description: "Welcome back!",
    })
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log In / Sign Up</DialogTitle>
          <DialogDescription>
            Enter your details to access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Test User"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="test@example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleLogin} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
