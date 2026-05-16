import React, { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { collection, query, onSnapshot, orderBy, updateDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Order, OrderStatus } from "../types";
import { LayoutDashboard, Users, ShoppingBag, CheckCircle, Clock, Search, ExternalLink, Send, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) { navigate("/login"); return; }
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        navigate("/dashboard");
      } else {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ ...doc.data(), orderId: doc.id })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status, updatedAt: new Date().toISOString() });
    setSelectedOrder(prev => prev ? { ...prev, status } : null);
  };

  const submitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !resultUrl) return;
    await updateDoc(doc(db, "orders", selectedOrder.orderId), {
      resultUrl,
      status: "completed",
      updatedAt: new Date().toISOString()
    });
    setResultUrl("");
    setSelectedOrder(null);
  };

  if (loading || !isAdmin) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-blue-500" /></div>;

  const stats = [
    { name: "Total Pesanan", value: orders.length, icon: <ShoppingBag />, color: "blue" },
    { name: "Selesai", value: orders.filter(o => o.status === 'completed').length, icon: <CheckCircle />, color: "green" },
    { name: "Menunggu", value: orders.filter(o => o.status === 'pending').length, icon: <Clock />, color: "amber" },
  ];

  return (
    <div className="min-h-screen bg-bg relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 px-4">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full glass border-red-500/20 mb-6"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 mr-2 animate-pulse"></span>
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Root Terminal</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">Admin.</h1>
            <p className="text-text-s text-lg">Central control for all cloud visual operations.</p>
          </div>
          <div className="mt-8 md:mt-0 text-right hidden lg:block">
            <p className="text-[10px] font-black text-text-s uppercase tracking-[0.4em] mb-2">Systems Integrity</p>
            <div className="flex items-center justify-end text-emerald-500 text-xs font-black">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span> 
              ENCRYPTED CHANNEL
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((s, idx) => (
            <motion.div 
              key={s.name} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-10 rounded-[3rem] group hover:border-accent/30 transition-all"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg transition-all duration-500">
                  {s.icon}
                </div>
                <div className="h-10 w-px bg-white/5 mx-4"></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-text-s uppercase tracking-widest">{s.name}</p>
                </div>
              </div>
              <p className="text-5xl font-black text-white tracking-tighter">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="glass rounded-[3.5rem] overflow-hidden border-white/5">
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Order Stream</h3>
                <div className="p-3 glass rounded-2xl">
                    <Search size={18} className="text-text-s" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-bg text-[10px] font-black text-text-s uppercase tracking-[0.3em]">
                    <tr>
                      <th className="px-10 py-6">State</th>
                      <th className="px-10 py-6">Service</th>
                      <th className="px-10 py-6">Identity</th>
                      <th className="px-10 py-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map(order => (
                      <tr key={order.orderId} className={`hover:bg-white/5 transition-colors cursor-pointer group ${selectedOrder?.orderId === order.orderId ? 'bg-accent/5' : ''}`} onClick={() => setSelectedOrder(order)}>
                        <td className="px-10 py-8">
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center ${
                            order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                            order.status === 'processing' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                order.status === 'completed' ? 'bg-emerald-500' : 
                                order.status === 'processing' ? 'bg-accent' : 'bg-amber-500'
                            }`}></span>
                            {order.status}
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-sm font-black text-white block uppercase tracking-tight">{order.serviceName}</span>
                          <span className="text-[10px] font-bold text-text-s uppercase tracking-widest">{order.packageName}</span>
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-sm font-bold text-white block">{order.customerName}</span>
                          <span className="text-xs text-text-s">{order.customerEmail}</span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink size={16} className="text-accent" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedOrder ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass p-10 rounded-[3.5rem] border-accent/30 sticky top-32 shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-10">
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Order <br /> Integrity</h3>
                    <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-text-s hover:text-white transition-colors"><X size={18} /></button>
                  </div>
                  
                  <div className="space-y-10 mb-12">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-text-s uppercase tracking-[0.4em] block">State Controller</label>
                      <div className="flex gap-3">
                        <button onClick={() => updateStatus(selectedOrder.orderId, 'processing')} className="flex-grow py-3 bg-accent/10 text-accent rounded-2xl text-[10px] font-black uppercase tracking-widest border border-accent/20 hover:bg-accent hover:text-bg transition-all">Assign</button>
                        <button onClick={() => updateStatus(selectedOrder.orderId, 'pending')} className="flex-grow py-3 glass text-amber-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-amber-500/20 hover:bg-amber-500 hover:text-bg transition-colors">Hold</button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-s uppercase tracking-[0.4em] block">Resource Link</label>
                      <a href={selectedOrder.fileUrl} target="_blank" className="p-4 glass rounded-2xl flex items-center justify-between group hover:border-accent/40 transition-all">
                        <span className="text-xs font-bold text-white tracking-tight">Download Input Node</span>
                        <ExternalLink size={14} className="text-accent group-hover:scale-125 transition-transform" />
                      </a>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-s uppercase tracking-[0.4em] block">Brief Intelligence</label>
                      <div className="p-6 glass bg-black/20 rounded-3xl">
                        <p className="text-xs font-medium text-text-s leading-relaxed italic">"{selectedOrder.notes || "No metadata provided..."}"</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={submitResult} className="pt-10 border-t border-white/5 space-y-6">
                    <label className="text-[10px] font-black text-white uppercase tracking-[0.4em] block text-center">Inject Output Data</label>
                    <input 
                      type="url" 
                      required 
                      placeholder="Link Production URL" 
                      value={resultUrl} 
                      onChange={e => setResultUrl(e.target.value)} 
                      className="w-full bg-bg border border-white/5 rounded-2xl p-5 text-xs text-white focus:ring-2 focus:ring-accent/30 outline-none transition-all font-mono" 
                    />
                    <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-bg font-black rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-[0.2em] text-xs">
                        <Send size={16} className="mr-3" /> Commit & Synchronize
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass p-16 rounded-[3.5rem] border-white/5 text-center border-dashed border-2"
                >
                  <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-8 text-text-s opacity-20">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="text-xs font-black text-text-s uppercase tracking-widest leading-relaxed">Select an active node <br /> to perform operations.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
function X(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}
