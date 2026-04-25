"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Mail, Lock, Loader2, User } from "lucide-react";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isRegistering) {
        // Handle Registration
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccess("¡Cuenta creada exitosamente! Por favor, verifica tu correo o inicia sesión directamente.");
          setIsRegistering(false); // Switch back to login view after success
          setPassword(""); // Clear password
        }
      } else {
        // Handle Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          // The middleware handles role checking and redirection
          router.refresh(); 
        }
      }
    } catch (err: any) {
      setError("Failed to connect to the database. Please verify your Supabase URL in .env.local is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isRegistering ? "Crear una cuenta" : "Bienvenido a Genera"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            {isRegistering 
              ? "Ingresa tus datos para registrarte" 
              : "Ingresa tus credenciales para acceder a tu panel"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {/* Nombre field (only visible during registration) */}
          {isRegistering && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Nombre Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                  placeholder="Juan Pérez"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
            {isRegistering && (
              <p className="text-xs text-slate-500 ml-2 mt-1">Mínimo 6 caracteres</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm text-center font-medium">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-700/50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isRegistering ? (
              "Registrarse"
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-700 pt-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
                setSuccess("");
              }}
              className="ml-2 font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
            >
              {isRegistering ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
