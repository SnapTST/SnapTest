
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
import { Loader2, MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { login, loading } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email) {
      toast({
        title: "Validation Error",
        description: "Please enter your email address.",
        variant: "destructive"
      })
      return;
    }
    
    await login(name, email);
    setEmailSent(true);
  };
  
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
        // Reset state when dialog is closed
        setTimeout(() => {
            setEmail('');
            setName('');
            setEmailSent(false);
        }, 300);
    }
    onOpenChange(isOpen);
  }


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{emailSent ? 'Check Your Email' : 'Log In / Sign Up'}</DialogTitle>
          <DialogDescription>
            {emailSent 
                ? "We've sent a magic link to your email address. Click the link to log in."
                : "Enter your email to receive a magic link to sign in."
            }
          </DialogDescription>
        </DialogHeader>
        
        {emailSent ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
                <MailCheck className="h-16 w-16 text-green-500 mb-4" />
                <p className="font-semibold">Email sent to:</p>
                <p className="text-muted-foreground">{email}</p>
            </div>
        ) : (
            <>
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
                    placeholder="Your Name (Optional)"
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
                    required
                    />
                </div>
                </div>
                <DialogFooter>
                <Button type="submit" onClick={handleLogin} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Magic Link
                </Button>
                </DialogFooter>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}

