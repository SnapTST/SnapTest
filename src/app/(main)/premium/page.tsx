import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown } from "lucide-react";
import Image from "next/image";

const freeFeatures = [
    { text: "Unlimited AI Requests", included: true },
    { text: "Unlimited PDF Downloads", included: true },
    { text: "Ad-Supported", included: true },
    { text: "SnapTest Branding on Exports", included: true },
    { text: "Includes Answer Keys", included: true },
    { text: "Faster, Full Access", included: true },
];


export default function PremiumPage() {
  return (
    <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight">Enjoy All Features for Free!</h1>
            <p className="text-lg text-muted-foreground mt-4">All features are now free for everyone, supported by ads.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="w-full flex justify-center md:col-span-2">
                <Image src="https://placehold.co/728x90.png" width={728} height={90} alt="advertisement" data-ai-hint="advertisement banner" />
            </div>
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">Free Plan <Crown className="text-yellow-500" /></CardTitle>
                    <CardDescription>Enjoy unlimited access to all our powerful features.</CardDescription>
                    <p className="text-4xl font-bold pt-4">$0 <span className="text-lg font-normal text-muted-foreground">/ month</span></p>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {freeFeatures.map(feature => (
                             <li key={feature.text} className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500"/>
                                <span>{feature.text}</span>
                             </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" disabled>You have access to all features!</Button>
                </CardFooter>
            </Card>
             <div className="w-full flex justify-center md:col-span-2">
                <Image src="https://placehold.co/728x90.png" width={728} height={90} alt="advertisement" data-ai-hint="advertisement banner" />
            </div>
        </div>
    </div>
  );
}
