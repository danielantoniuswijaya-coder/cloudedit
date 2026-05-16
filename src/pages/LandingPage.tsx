import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, Play, Image as ImageIcon, Video, Palette, Youtube, Star, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const services = [
    {
      id: "foto",
      name: "Edit Foto",
      description: "Retouch, color grading, dan manipulasi foto profesional.",
      icon: <ImageIcon className="text-blue-500" size={32} />,
      color: "blue"
    },
    {
      id: "video",
      name: "TikTok / Reels",
      description: "Edit video vertikal yang catchy dengan subtitle estetik.",
      icon: <Video className="text-purple-500" size={32} />,
      color: "purple"
    },
    {
      id: "youtube",
      name: "YT Thumbnail",
      description: "Tingkatkan CTR Anda dengan desain thumbnail yang click-worthy.",
      icon: <Youtube className="text-red-500" size={32} />,
      color: "red"
    },
    {
      id: "poster",
      name: "Desain Poster",
      description: "Poster acara, promosi produk, atau branding identitas.",
      icon: <Palette className="text-emerald-500" size={32} />,
      color: "emerald"
    }
  ];

  const packages = [
    {
      name: "Basic",
      price: "Rp 50rb",
      features: ["1 Revisi", "Pengerjaan 2 Hari", "Format Standard (JPG/MP4)", "Support Email"],
      recommended: false
    },
    {
      name: "Pro",
      price: "Rp 150rb",
      features: ["3 Revisi", "Pengerjaan 1 Hari", "HQ Export (4K/PNGLossless)", "Priority Support", "Project Files Include"],
      recommended: true
    },
    {
      name: "Premium",
      price: "Rp 350rb",
      features: ["Unlimited Revisi", "Selesai < 12 Jam", "Full Raw Files", "VVIP Support", "Custom Style Request"],
      recommended: false
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-bg">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[10%] -right-[5%] w-[400px] h-[400px] bg-sky-500/20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[20%] -left-[5%] w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full animate-float"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full glass border-accent/20 mb-8 group cursor-default"
            >
              <span className="flex h-2 w-2 rounded-full bg-accent mr-2 group-hover:scale-150 transition-transform"></span>
              <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Next-Gen Cloud Editing</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 text-white">
              Cloud-Native <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-sky-400 to-indigo-400">
                Visual Artistry.
              </span>
            </h1>
            
            <p className="text-xl text-text-s mb-12 max-w-xl leading-relaxed">
              CloudEdit merevolusi cara kerja kreator. Kirim file mentah Anda ke cloud, 
              dan biarkan tim senior editor kami menangani sisanya. 
              Hasil kelas dunia, dalam hitungan jam.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
              <Link
                to="/register"
                className="px-10 py-5 bg-accent hover:bg-sky-400 text-bg font-black rounded-full flex items-center justify-center transition-all shadow-2xl shadow-accent/20 hover:shadow-accent/40 active:scale-95 group text-lg"
              >
                Mulai Berlangganan <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#layanan"
                className="px-10 py-5 glass hover:bg-white/10 text-white font-bold rounded-full flex items-center justify-center transition-all border border-white/10 text-lg"
              >
                Pelajari Layanan
              </a>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 flex items-center space-x-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5, zIndex: 10 }}
                    className="w-12 h-12 rounded-full border-4 border-bg bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl"
                  >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=editor${i}`} alt="Avatar" />
                  </motion.div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-amber-400 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-text-s font-medium">Bekerja dengan <span className="text-white font-bold">50+ Senior Editor</span></p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative p-2 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-[0_0_100px_rgba(56,189,248,0.15)]">
              <div className="relative aspect-[4/5] bg-bg rounded-[2.5rem] overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1920&auto=format&fit=crop" 
                  alt="Editor Workspace" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[2s]"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent"></div>
                
                {/* Floating Stats Widget */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-12 left-12 p-6 glass rounded-3xl border-accent/20 shadow-2xl"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-accent/20 text-accent rounded-2xl flex items-center justify-center font-black">
                      74%
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-s uppercase tracking-widest">S3 Cloud Used</p>
                      <p className="text-sm font-bold text-white">High Efficiency</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[74%] bg-accent"></div>
                  </div>
                </motion.div>

                {/* Status Widget */}
                <div className="absolute inset-x-8 bottom-8 p-8 glass rounded-[2rem] shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-s uppercase tracking-widest">Active Order</p>
                        <p className="text-lg font-black text-white">ORD-2489 Selesai</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-slate-500">12m ago</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800"></div>)}
                    </div>
                    <button className="text-xs font-bold text-accent hover:underline">Download Master Hasil</button>
                  </div>
                </div>

                {/* Big Play Button */}
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-accent text-bg rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.5)] z-20"
                >
                  <Play size={40} fill="currentColor" className="ml-1" />
                </motion.button>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute -z-10 top-1/2 -right-12 w-64 h-64 bg-accent/20 blur-[100px] rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="layanan" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div className="max-w-2xl">
              <h2 className="text-xs font-bold text-accent uppercase tracking-[0.4em] mb-6">Expertise Kami</h2>
              <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8">
                Solusi Visual <br /> Terenkripsi & Kilat.
              </h3>
              <p className="text-lg text-text-s">
                Bukan sekadar editing. Kami mengintegrasikan kekuatan cloud untuk 
                memastikan setiap frame diproses dengan presisi tertinggi.
              </p>
            </div>
            <div className="mt-8 md:mt-0">
              <Link to="/order" className="group flex items-center space-x-4 text-white font-bold py-4 pl-6 pr-4 glass rounded-full hover:bg-white/10 transition-all border-white/20">
                <span>Pesan Custom Project</span>
                <div className="w-10 h-10 bg-accent text-bg rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowRight size={20} />
                </div>
              </Link>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="group p-10 rounded-[3rem] bg-slate-900/40 border border-white/5 hover:border-accent/30 hover:bg-slate-900 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                  {service.icon}
                </div>
                <div className="mb-8 p-5 inline-flex rounded-3xl bg-white/5 text-accent group-hover:scale-110 group-hover:bg-accent group-hover:text-bg transition-all duration-500">
                  {service.icon}
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">{service.name}</h4>
                <p className="text-text-s text-sm leading-relaxed mb-8">
                  {service.description}
                </p>
                <Link to="/register" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-accent group-hover:text-white transition-colors">
                  Pesan Sekarang <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="harga" className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-4">Paket Harga</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Investasi Konten Anda</h3>
            <p className="text-slate-400">Harga transparan tanpa biaya tersembunyi. Pilih sesuai skalabilitas proyek Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.name}
                whileHover={{ y: -10 }}
                className={`p-10 rounded-[40px] flex flex-col transition-all border ${
                  pkg.recommended 
                    ? "bg-blue-600 border-white/20 text-white shadow-2xl shadow-blue-600/20 scale-105" 
                    : "bg-slate-950 border-white/5 text-slate-100"
                }`}
              >
                {pkg.recommended && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full self-start mb-6">
                    Paling Populer
                  </span>
                )}
                <h4 className={`text-2xl font-bold mb-2 ${pkg.recommended ? "text-white" : "text-white"}`}>{pkg.name}</h4>
                <div className="flex items-baseline mb-8">
                  <span className="text-4xl font-extrabold">{pkg.price}</span>
                  <span className={`text-sm ml-2 ${pkg.recommended ? "text-blue-100" : "text-slate-500"}`}>/paket</span>
                </div>
                
                <ul className="space-y-4 mb-10 flex-grow">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <CheckCircle2 size={18} className={`mr-3 shrink-0 ${pkg.recommended ? "text-blue-200" : "text-blue-500"}`} />
                      <span className={pkg.recommended ? "text-blue-50" : "text-slate-400"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`py-4 rounded-2xl text-center font-bold transition-all shadow-lg ${
                    pkg.recommended 
                      ? "bg-white text-blue-600 hover:bg-slate-100" 
                      : "bg-slate-900 text-white hover:bg-slate-800 border border-white/10"
                  }`}
                >
                  Pilih {pkg.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[60px] bg-gradient-to-r from-blue-700 to-indigo-800 overflow-hidden px-8 py-16 md:p-20 text-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Siap Membuat Konten Viral?</h3>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                Jangan biarkan file mentah Anda menumpuk. Serahkan pada kami dan 
                fokuslah pada kreativitas konten Anda selanjutnya.
              </p>
              <Link
                to="/register"
                className="px-12 py-5 bg-white text-blue-700 font-extrabold text-lg rounded-3xl hover:bg-blue-50 transition-all shadow-2xl active:scale-95 inline-flex items-center"
              >
                Pesan Sekarang <ArrowRight className="ml-3" />
              </Link>
            </div>
            {/* Decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
