"use client";

import { useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { login, signup } from "@/lib/supabase/actions";
import { useAuth } from "@/lib/context/auth-context";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Building2, User, Phone, MapPin, FileText, Briefcase, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface AuthFormProps {
  dict: {
    title: string;
    description: string;
  };
}

type AuthMode = "login" | "register";
type RegisterStep = 1 | 2;

export function AuthForm({ dict }: AuthFormProps) {
  const params = useParams();
  const lang = params.lang as string;
  const [mode, setMode] = useState<AuthMode>("login");
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { refreshAuth } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    contactName: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
    vatNumber: "",
    businessType: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Translations
  const t = {
    en: {
      login: "Sign In",
      register: "Create Account",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      companyName: "Company Name",
      contactName: "Contact Person",
      phone: "Phone Number",
      address: "Business Address",
      city: "City",
      country: "Country",
      vatNumber: "VAT Number",
      businessType: "Business Type",
      loginBtn: "Sign In",
      registerBtn: "Create Reseller Account",
      loggingIn: "Signing in...",
      registering: "Creating account...",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      createOne: "Create one",
      signIn: "Sign in",
      step1: "Account Details",
      step2: "Business Information",
      next: "Next",
      back: "Back",
      passwordMismatch: "Passwords do not match",
      required: "This field is required",
      invalidEmail: "Please enter a valid email",
      passwordTooShort: "Password must be at least 6 characters",
      forgotPassword: "Forgot password?",
    },
    sv: {
      login: "Logga in",
      register: "Skapa konto",
      email: "E-postadress",
      password: "Lösenord",
      confirmPassword: "Bekräfta lösenord",
      companyName: "Företagsnamn",
      contactName: "Kontaktperson",
      phone: "Telefonnummer",
      address: "Företagsadress",
      city: "Stad",
      country: "Land",
      vatNumber: "Momsnummer",
      businessType: "Verksamhetstyp",
      loginBtn: "Logga in",
      registerBtn: "Skapa återförsäljarkonto",
      loggingIn: "Loggar in...",
      registering: "Skapar konto...",
      noAccount: "Har du inget konto?",
      hasAccount: "Har du redan ett konto?",
      createOne: "Skapa ett",
      signIn: "Logga in",
      step1: "Kontouppgifter",
      step2: "Företagsinformation",
      next: "Nästa",
      back: "Tillbaka",
      passwordMismatch: "Lösenorden matchar inte",
      required: "Detta fält är obligatoriskt",
      invalidEmail: "Ange en giltig e-postadress",
      passwordTooShort: "Lösenordet måste vara minst 6 tecken",
      forgotPassword: "Glömt lösenord?",
    },
  };

  const text = t[lang as keyof typeof t] || t.en;

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!registerData.email) {
      newErrors.email = text.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = text.invalidEmail;
    }
    
    if (!registerData.password) {
      newErrors.password = text.required;
    } else if (registerData.password.length < 6) {
      newErrors.password = text.passwordTooShort;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = text.passwordMismatch;
    }
    
    if (!registerData.contactName) {
      newErrors.contactName = text.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

      await refreshAuth();

      toast({
        title: lang === "sv" ? "Lyckades" : "Success",
        description: lang === "sv" ? "Inloggad" : "Logged in successfully",
      });

      router.refresh();
      router.push(`/${lang}/welcome`);
    } catch (error: any) {
      toast({
        title: lang === "sv" ? "Fel" : "Error",
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
      formData.append("email", registerData.email);
      formData.append("password", registerData.password);
      formData.append("companyName", registerData.companyName);
      formData.append("contactName", registerData.contactName);
      formData.append("phoneNumber", registerData.phoneNumber);
      formData.append("address", registerData.address);
      formData.append("city", registerData.city);
      formData.append("country", registerData.country);
      formData.append("vatNumber", registerData.vatNumber);
      formData.append("businessType", registerData.businessType);

      const result = await signup(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.message) {
        toast({
          title: lang === "sv" ? "Lyckades" : "Success",
          description: result.message,
        });
        return;
      }

      toast({
        title: lang === "sv" ? "Lyckades" : "Success",
        description: lang === "sv" ? "Registrering lyckades!" : "Registration successful!",
      });

      router.refresh();
      router.push(`/${lang}/welcome`);
    } catch (error: any) {
      toast({
        title: lang === "sv" ? "Fel" : "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setRegisterStep(2);
    }
  };

  const InputField = ({ 
    icon: Icon, 
    label, 
    name, 
    type = "text", 
    value, 
    onChange,
    error,
    required = false,
    autoComplete,
  }: {
    icon: any;
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    autoComplete?: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-400" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className={`h-12 pl-4 pr-10 bg-white border-2 transition-colors ${
            error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-black"
          }`}
          required={required}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100">
          <button
            type="button"
            onClick={() => { setMode("login"); setRegisterStep(1); setErrors({}); }}
            className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
              mode === "login" 
                ? "text-black" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {text.login}
            {mode === "login" && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setErrors({}); }}
            className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
              mode === "register" 
                ? "text-black" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {text.register}
            {mode === "register" && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
              />
            )}
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <InputField
                  icon={Mail}
                  label={text.email}
                  name="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  autoComplete="email"
                />
                
                <InputField
                  icon={Lock}
                  label={text.password}
                  name="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />

                <div className="text-right">
                  <Link 
                    href={`/${lang}/reset-password`}
                    className="text-sm text-gray-500 hover:text-black transition-colors"
                  >
                    {text.forgotPassword}
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all hover:scale-[1.02]" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {text.loggingIn}
                    </span>
                  ) : text.loginBtn}
                </Button>

                <p className="text-center text-sm text-gray-500 mt-6">
                  {text.noAccount}{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-black font-semibold hover:underline"
                  >
                    {text.createOne}
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    registerStep >= 1 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    1
                  </div>
                  <div className={`w-12 h-1 rounded-full ${registerStep >= 2 ? "bg-black" : "bg-gray-200"}`} />
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    registerStep >= 2 ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    2
                  </div>
                </div>

                <p className="text-center text-sm text-gray-500 mb-6">
                  {registerStep === 1 ? text.step1 : text.step2}
                </p>

                <form onSubmit={handleRegister}>
                  <AnimatePresence mode="wait">
                    {registerStep === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <InputField
                          icon={User}
                          label={text.contactName}
                          name="contactName"
                          value={registerData.contactName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, contactName: e.target.value }))}
                          error={errors.contactName}
                          required
                          autoComplete="name"
                        />
                        
                        <InputField
                          icon={Mail}
                          label={text.email}
                          name="register-email"
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          error={errors.email}
                          required
                          autoComplete="email"
                        />
                        
                        <InputField
                          icon={Lock}
                          label={text.password}
                          name="register-password"
                          type="password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          error={errors.password}
                          required
                          autoComplete="new-password"
                        />
                        
                        <InputField
                          icon={Lock}
                          label={text.confirmPassword}
                          name="confirmPassword"
                          type="password"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          error={errors.confirmPassword}
                          required
                          autoComplete="new-password"
                        />

                        <Button
                          type="button"
                          onClick={handleNextStep}
                          className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                          {text.next}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        <InputField
                          icon={Building2}
                          label={text.companyName}
                          name="companyName"
                          value={registerData.companyName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, companyName: e.target.value }))}
                          autoComplete="organization"
                        />
                        
                        <InputField
                          icon={Phone}
                          label={text.phone}
                          name="phoneNumber"
                          type="tel"
                          value={registerData.phoneNumber}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          autoComplete="tel"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <InputField
                            icon={MapPin}
                            label={text.city}
                            name="city"
                            value={registerData.city}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, city: e.target.value }))}
                            autoComplete="address-level2"
                          />
                          
                          <InputField
                            icon={MapPin}
                            label={text.country}
                            name="country"
                            value={registerData.country}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, country: e.target.value }))}
                            autoComplete="country-name"
                          />
                        </div>
                        
                        <InputField
                          icon={MapPin}
                          label={text.address}
                          name="address"
                          value={registerData.address}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, address: e.target.value }))}
                          autoComplete="street-address"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <InputField
                            icon={FileText}
                            label={text.vatNumber}
                            name="vatNumber"
                            value={registerData.vatNumber}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, vatNumber: e.target.value }))}
                          />
                          
                          <InputField
                            icon={Briefcase}
                            label={text.businessType}
                            name="businessType"
                            value={registerData.businessType}
                            onChange={(e) => setRegisterData(prev => ({ ...prev, businessType: e.target.value }))}
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            onClick={() => setRegisterStep(1)}
                            variant="outline"
                            className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 font-semibold rounded-lg flex items-center justify-center gap-2"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            {text.back}
                          </Button>
                          
                          <Button
                            type="submit"
                            className="flex-1 h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all hover:scale-[1.02]"
                            disabled={loading}
                          >
                            {loading ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {text.registering}
                              </span>
                            ) : text.registerBtn}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  {text.hasAccount}{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("login"); setRegisterStep(1); }}
                    className="text-black font-semibold hover:underline"
                  >
                    {text.signIn}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
