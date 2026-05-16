import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (userDoc.exists() && userDoc.data().role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError("Email atau password salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-text-s hover:text-white mb-10 transition-colors group">
          <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to base
        </Link>

        <div className="glass p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Welcome Back</h1>
              <p className="text-text-s text-sm font-medium">Access your cloud editing suite</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center text-red-500 text-xs font-bold uppercase tracking-wider"
              >
                <AlertCircle size={18} className="mr-3 shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-s uppercase tracking-[0.3em] ml-1">Email Terminal</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-s" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm font-medium"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-s uppercase tracking-[0.3em] ml-1">Secret Key</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-s" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-bg border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-sky-400 disabled:bg-accent/50 disabled:cursor-not-allowed text-bg font-black py-5 rounded-2xl transition-all shadow-xl shadow-accent/20 flex items-center justify-center transform active:scale-[0.98] text-sm uppercase tracking-widest"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-3" size={20} /> Authorizing...
                  </>
                ) : (
                  "Identify Account"
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/5 text-center">
              <p className="text-xs font-bold text-text-s uppercase tracking-widest">
                Need an ID?{" "}
                <Link to="/register" className="text-accent hover:text-white transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
