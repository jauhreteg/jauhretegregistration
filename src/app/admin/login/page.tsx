"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AnimatedBinaryBackground from "@/components/animated-binary-background";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { activeConfig } from "@/config/website";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
    }
    setIsLoading(false);
    // On success, the server action will redirect, so no client-side navigation is needed.
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white p-4 overflow-hidden">
      {/* Back Button - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          onClick={() => router.push("/")}
          variant="outline"
          className={`px-3 py-2 text-xs font-semibold uppercase rounded-lg transition-colors ${
            activeConfig.effects.enableFastTransitions
              ? "duration-75"
              : "duration-300"
          } font-montserrat border-black text-black hover:bg-black hover:text-white flex items-center gap-2`}
        >
          <ArrowLeft className="h-3 w-3" />
          Back
        </Button>
      </div>

      {/* Animated Binary Background */}
      {activeConfig.background.enableBinaryAnimation && (
        <AnimatedBinaryBackground
          textToConvert={activeConfig.background.binaryText}
          textColor="rgba(0, 0, 0, 0.05)"
          glowColors={["rgba(245, 166, 35, 0.8)", "rgba(0, 0, 0, 0.8)"]}
          fontSize="10px"
          glowIntensity={activeConfig.background.glowIntensity}
          glowInterval={activeConfig.background.animationSpeed}
          glowDuration={800}
          enableRadialFade={activeConfig.background.enableRadialFade}
        />
      )}

      <Card className="w-full max-w-sm bg-white/95 shadow-xl relative z-10 backdrop-blur-sm border-gray-200">
        <CardHeader className="items-center text-center space-y-4 pt-8">
          <Image
            src="/jet-black.svg"
            alt="Jauhr E Teg Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
          <CardTitle
            className={`text-2xl font-bold text-black pt-2 font-montserrat uppercase ${
              activeConfig.effects.enableFastTransitions
                ? "transition-colors duration-75"
                : "transition-colors duration-300"
            }`}
          >
            Admin Login
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-6 pb-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-montserrat">
                  Login Failed
                </AlertTitle>
                <AlertDescription className="font-montserrat">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-black font-medium font-montserrat"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="example@jauhreteg.com"
                autoComplete="email"
                className={`bg-gray-50 focus:ring-black focus:border-black border-gray-300 font-montserrat transition-colors ${
                  activeConfig.effects.enableFastTransitions
                    ? "duration-75"
                    : "duration-300"
                }`}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-black font-medium font-montserrat"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`bg-gray-50 focus:ring-black focus:border-black border-gray-300 font-montserrat transition-colors pr-10 ${
                    activeConfig.effects.enableFastTransitions
                      ? "duration-75"
                      : "duration-300"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-black transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6 pb-8">
            <Button
              type="submit"
              className={`w-full bg-black hover:bg-[#F5A623] text-white font-semibold text-md py-2.5 font-montserrat uppercase transition-colors ${
                activeConfig.effects.enableFastTransitions
                  ? "duration-75"
                  : "duration-300"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
