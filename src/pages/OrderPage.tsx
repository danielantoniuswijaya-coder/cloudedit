import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { FileUp, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const SERVICES = [
  { id: "foto", name: "Edit Foto", packages: ["Basic", "Pro", "Premium"] },
  { id: "video", name: "TikTok / Reels", packages: ["Basic", "Pro", "Premium"] },
  { id: "youtube", name: "YT Thumbnail", packages: ["Basic", "Pro", "Premium"] },
  { id: "poster", name: "Desain Poster", packages: ["Basic", "Pro", "Premium"] },
];

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    service: SERVICES[0].name,
    package: "Basic",
    notes: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      setFormData(prev => ({ 
        ...prev, 
        name: auth.currentUser?.displayName || "", 
        email: auth.currentUser?.email || "" 
      }));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Pilih file terlebih dahulu");
    
    setLoading(true);
    try {
      // 1. Upload File to Storage
      const fileRef = ref(storage, `orders/${auth.currentUser?.uid}/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(uploadResult.ref);

      // 2. Create Order in Firestore
      await addDoc(collection(db, "orders"), {
        userId: auth.currentUser?.uid,
        customerName: formData.name,
        customerEmail: formData.email,
        whatsapp: formData.whatsapp,
        serviceName: formData.service,
        packageName: formData.package,
        notes: formData.notes,
        fileUrl: fileUrl,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setStep(3); // Success step
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full glass border-accent/20 mb-8"
          >
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Operational Flow</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">New Project.</h1>
          <p className="text-text-s text-lg max-w-xl mx-auto">Selesaikan detail teknis di bawah untuk memulai sesi editing Anda.</p>
        </div>

        <div className="glass rounded-[3.5rem] shadow-2xl relative overflow-hidden p-8 md:p-16">
          {/* Progress Bar */}
          <div className="flex items-center justify-center mb-16 space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                  step >= i ? "bg-accent text-bg shadow-[0_0_20px_rgba(56,189,248,0.3)]" : "bg-white/5 text-text-s"
                }`}>
                  {step > i ? <CheckCircle2 size={18} /> : i}
                </div>
                {i < 3 && <div className={`w-12 h-1 mx-2 rounded-full ${step > i ? "bg-accent" : "bg-white/5"}`}></div>}
              </div>
            ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-1.5 h-8 bg-accent rounded-full"></div>
                <h3 className="text-2xl font-black text-white tracking-tight">Requirement Setup</h3>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-s uppercase tracking-[0.3em] ml-1">Client Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-bg border border-white/5 rounded-2xl p-5 text-white focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none font-medium transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-s uppercase tracking-[0.3em] ml-1">Telegram/WhatsApp</label>
                  <input type="text" required value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-bg border border-white/5 rounded-2xl p-5 text-white focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none font-medium transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-s uppercase tracking-[0.3em] ml-1">Workstream</label>
                  <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} className="w-full bg-bg border border-white/5 rounded-2xl p-5 text-white focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none font-medium transition-all appearance-none">
                    {SERVICES.map(s => <option key={s.id} value={s.name} className="bg-bg">{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-s uppercase tracking-[0.3em] ml-1">Tier Level</label>
                  <select value={formData.package} onChange={e => setFormData({...formData, package: e.target.value})} className="w-full bg-bg border border-white/5 rounded-2xl p-5 text-white focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none font-medium transition-all appearance-none">
                    <option value="Basic" className="bg-bg">Basic Tier</option>
                    <option value="Pro" className="bg-bg">Pro Tier</option>
                    <option value="Premium" className="bg-bg">Elite Tier</option>
                  </select>
                </div>
                <div className="md:col-span-2 pt-6">
                  <button type="submit" className="w-full py-5 bg-accent hover:bg-sky-400 text-bg font-black rounded-3xl transition-all shadow-xl shadow-accent/20 active:scale-[0.98] uppercase tracking-widest text-sm">
                    Generate Upload Node
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button onClick={() => setStep(1)} className="group flex items-center text-[10px] font-black uppercase tracking-widest text-text-s hover:text-white mb-10 transition-colors">
                <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to config
              </button>
              
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-1.5 h-8 bg-accent rounded-full"></div>
                <h3 className="text-2xl font-black text-white tracking-tight">Asset Injection</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-s uppercase tracking-[0.3em] ml-1">Creative Brief / Notes</label>
                  <textarea rows={4} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-bg border border-white/5 rounded-3xl p-6 text-white focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none font-medium transition-all resize-none" placeholder="Explain your vision..." />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-s uppercase tracking-[0.3em] ml-1 text-center block">S3 File Dropzone</label>
                  <div className="glass border-2 border-dashed border-white/10 rounded-[3rem] p-16 text-center hover:border-accent/40 hover:bg-white/5 transition-all group relative cursor-pointer">
                    <input type="file" required onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="w-20 h-20 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <FileUp size={32} />
                    </div>
                    <p className="text-white font-black text-lg mb-2">
                      {file ? file.name : "Inject Raw Master File"}
                    </p>
                    <p className="text-xs font-bold text-text-s uppercase tracking-widest">Max Load: 100MB Node</p>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-6 bg-accent hover:bg-sky-400 text-bg font-black rounded-3xl transition-all shadow-2xl shadow-accent/20 disabled:opacity-50 flex items-center justify-center uppercase tracking-widest text-sm">
                  {loading ? <><Loader2 className="animate-spin mr-3" /> Synchronizing Assets...</> : "Initialize Order Sync"}
                </button>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
              <div className="w-32 h-32 bg-emerald-500/20 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={64} />
              </div>
              <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">Sync Complete.</h2>
              <p className="text-text-s text-lg mb-12 max-w-md mx-auto leading-relaxed">
                Terminal pesanan Anda telah didaftarkan. Editor akan segera memproses aset Anda.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button onClick={() => navigate("/dashboard")} className="w-full sm:w-auto px-10 py-5 bg-accent text-bg font-black rounded-2xl hover:bg-sky-400 transition-all shadow-xl shadow-accent/20 uppercase tracking-widest text-xs">
                  Access Dashboard
                </button>
                <button onClick={() => setStep(1)} className="w-full sm:w-auto px-10 py-5 glass text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs">
                  New Sync
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
