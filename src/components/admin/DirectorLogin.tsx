import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, User, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import AmolLogo from "../AmolLogo";
import { directorLogin, checkDirectorAuth } from "../../services/cmsService";

interface DirectorLoginProps {
  onNavigate: (path: string) => void;
}

export const DirectorLogin: React.FC<DirectorLoginProps> = ({ onNavigate }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    checkDirectorAuth().then((res) => {
      if (res.authenticated) {
        onNavigate("/director-dashboard");
      }
    });
  }, [onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotPasswordNotice(false);

    if (!identifier.trim()) {
      setError("Please enter your email or username.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    const result = await directorLogin(identifier.trim(), password);
    setIsLoading(false);

    if (result.success) {
      onNavigate("/director-dashboard");
    } else {
      setError(result.error || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        
        {/* Back to website button */}
        <button
          onClick={() => onNavigate("/")}
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back to Public Website
        </button>

        {/* Header with Logo */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm">
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-3">
              <AmolLogo className="h-10 w-auto" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Centre Director Login
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Amol Infotech & Maharana Typing Institute, Risod
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start space-x-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Forgot Password Helper Notice */}
          {forgotPasswordNotice && (
            <div className="mb-5 p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 leading-relaxed">
              <p className="font-semibold mb-1">Password Assistance</p>
              <p>
                Please contact the institute administrator or verify your registered email for password recovery.
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username/Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or username"
                  autoComplete="username"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input with show/hide toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordNotice(true)}
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#0062d2] hover:bg-[#0052b3] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs hover:shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default DirectorLogin;
