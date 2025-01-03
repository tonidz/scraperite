"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { login, signup } from "@/lib/supabase/actions";
import { useParams } from "next/navigation";

interface AuthFormProps {
  dict: {
    title: string;
    description: string;
  };
}

export function AuthForm({ dict }: AuthFormProps) {
  const params = useParams();
  const lang = params.lang as string;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    companyName: "",
    contactName: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
    vatNumber: "",
    businessType: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", loginData.email);
      formData.append("password", loginData.password);

      const result = await login(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      router.refresh();
      router.push(`/${lang}/welcome`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(registerData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await signup(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.message) {
        toast({
          title: "Success",
          description: result.message,
        });
        return;
      }

      toast({
        title: "Success",
        description: "Registration successful!",
      });

      router.refresh();
      router.push(`/${lang}/welcome`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="register">
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
          <Input
            name="companyName"
            placeholder="Company Name"
            value={registerData.companyName}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                companyName: e.target.value,
              }))
            }
            required
          />
          <Input
            name="contactName"
            placeholder="Contact Person Name"
            value={registerData.contactName}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                contactName: e.target.value,
              }))
            }
            required
          />
          <Input
            name="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            value={registerData.phoneNumber}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
            }
            required
          />
          <Input
            name="address"
            placeholder="Business Address"
            value={registerData.address}
            onChange={(e) =>
              setRegisterData((prev) => ({ ...prev, address: e.target.value }))
            }
            required
          />
          <Input
            name="city"
            placeholder="City"
            value={registerData.city}
            onChange={(e) =>
              setRegisterData((prev) => ({ ...prev, city: e.target.value }))
            }
            required
          />
          <Input
            name="country"
            placeholder="Country"
            value={registerData.country}
            onChange={(e) =>
              setRegisterData((prev) => ({ ...prev, country: e.target.value }))
            }
            required
          />
          <Input
            name="vatNumber"
            placeholder="VAT Number"
            value={registerData.vatNumber}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                vatNumber: e.target.value,
              }))
            }
            required
          />
          <Input
            name="businessType"
            placeholder="Business Type"
            value={registerData.businessType}
            onChange={(e) =>
              setRegisterData((prev) => ({
                ...prev,
                businessType: e.target.value,
              }))
            }
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Reseller Account"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
