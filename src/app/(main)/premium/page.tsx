import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Crown } from "lucide-react";

const freeFeatures = [
    { text: "Limited AI Requests", included: true },
    { text: "Limited PDF Downloads", included: true },
    { text: "Contains Ads", included: true },
    { text: "SnapTest Branding on Exports", included: true },
    { text: "Answer Keys Not Included", included: false },
    { text: "Faster, Full Access", included: false },
];

const premiumFeatures = [
    { text: "Unlimited AI Requests", included: true },
    { text: "Unlimited PDF Downloads", included: true },
    { text: "No Ads", included: true },
    { text: "Remove Branding from Exports", included: true },
    { text: "Includes Answer Keys", included: true },
    { text: "Faster, Full Access", included: true },
];

export default function PremiumPage() {
  return (
    <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">Unlock Your Full Potential</h1>
            <p className="text-lg text-muted-foreground mt-4">Choose the plan that's right for you and supercharge your studies.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Free</CardTitle>
                    <CardDescription>Perfect for getting started and trying out our core features.</CardDescription>
                    <p className="text-4xl font-bold pt-4">$0 <span className="text-lg font-normal text-muted-foreground">/ month</span></p>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {freeFeatures.map(feature => (
                             <li key={feature.text} className="flex items-center gap-2">
                                {feature.included ? <Check className="h-5 w-5 text-green-500"/> : <X className="h-5 w-5 text-red-500" />}
                                <span className={!feature.included ? 'text-muted-foreground' : ''}>{feature.text}</span>
                             </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" disabled>Your Current Plan</Button>
                </CardFooter>
            </Card>

            <Card className="border-primary border-2 relative">
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                    </div>
                </div>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">Premium <Crown className="text-yellow-500" /></CardTitle>
                    <CardDescription>For serious students and educators who want unlimited access.</CardDescription>
                    <p className="text-4xl font-bold pt-4">$9.99 <span className="text-lg font-normal text-muted-foreground">/ month</span></p>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {premiumFeatures.map(feature => (
                             <li key={feature.text} className="flex items-center gap-2">
                                {feature.included ? <Check className="h-5 w-5 text-green-500"/> : <X className="h-5 w-5 text-red-500" />}
                                <span>{feature.text}</span>
                             </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Upgrade to Premium</Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
