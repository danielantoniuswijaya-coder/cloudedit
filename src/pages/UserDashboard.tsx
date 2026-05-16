import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { Order } from "../types";
import { Clock, CheckCircle2, AlertCircle, FileText, Plus, ExternalLink, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function UserDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        orderId: doc.id,
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 size={16} className="mr-1" />;
      case "processing": return <Clock size={16} className="mr-1" />;
      default: return <AlertCircle size={16} className="mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-bg relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 px-4">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full glass border-accent/20 mb-6"
            >
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Command Center</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">Dashboard.</h1>
            <p className="text-text-s text-lg">Pantau workflow dan manajemen aset Anda dalam satu panel.</p>
          </div>
          <Link
            to="/order"
            className="mt-8 md:mt-0 px-10 py-5 bg-accent hover:bg-sky-400 text-bg font-black rounded-3xl transition-all shadow-2xl shadow-accent/20 flex items-center justify-center active:scale-95 group uppercase tracking-widest text-xs"
          >
            <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" /> Initialize Order
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="glass rounded-[4rem] p-24 text-center border-white/5">
            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-accent">
              <Package size={48} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Node Empty.</h2>
            <p className="text-text-s mb-12 max-w-sm mx-auto">Anda belum memiliki aset yang sedang diproses. Mulai karya masterpiece Anda sekarang!</p>
            <Link to="/order" className="inline-flex items-center text-accent font-black uppercase tracking-[0.3em] text-xs hover:text-white transition-colors">
              Pesan Layanan <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3 space-y-8">
              {orders.map((order, idx) => (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass p-8 rounded-[3rem] border-white/5 hover:border-accent/20 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 glass rounded-[1.5rem] flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-bg transition-all duration-500">
                        <FileText size={28} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white tracking-tight uppercase">{order.serviceName}</h4>
                        <div className="flex items-center text-[10px] font-black text-text-s uppercase tracking-[0.2em] mt-2">
                          <span className="bg-white/5 px-2 py-0.5 rounded mr-2">{order.packageName}</span>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] flex items-center shadow-lg ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex-grow">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Trace ID</p>
                        <p className="text-xs font-mono text-text-s">{order.orderId}</p>
                    </div>
                    <div className="flex space-x-4">
                      <a href={order.fileUrl} target="_blank" className="px-6 py-3 glass rounded-full text-[10px] font-black uppercase tracking-widest text-text-s hover:text-white hover:border-accent/40 transition-all flex items-center">
                        Raw Assets <ExternalLink size={12} className="ml-2" />
                      </a>
                      {order.resultUrl && (
                        <a href={order.resultUrl} target="_blank" className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-bg transition-all flex items-center shadow-xl shadow-emerald-500/10">
                          Production Ready <CheckCircle2 size={12} className="ml-2" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="lg:col-span-1 space-y-8">
              <div className="glass p-10 rounded-[3rem] border-accent/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-5 blur-3xl rounded-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 duration-700"></div>
                <h4 className="text-xs font-black text-accent uppercase tracking-[0.4em] mb-10">Stream Metadata</h4>
                <div className="space-y-8">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <div>
                        <p className="text-[10px] font-black text-text-s uppercase tracking-widest mb-1">Aset Terdaftar</p>
                        <p className="text-3xl font-black text-white">{orders.length}</p>
                    </div>
                    <Package className="text-white/10" size={40} />
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <div>
                        <p className="text-[10px] font-black text-text-s uppercase tracking-widest mb-1">Dalam Proses</p>
                        <p className="text-3xl font-black text-accent">{orders.filter(o => o.status !== 'completed').length}</p>
                    </div>
                    <Clock className="text-accent/10" size={40} />
                  </div>
                </div>
                
                <div className="mt-12 p-6 bg-accent/5 rounded-3xl border border-accent/10">
                    <p className="text-[10px] font-medium text-text-s leading-relaxed">
                        Tim kami sedang mengoptimalkan workflow untuk aset Anda. 
                        Response time rata-rata saat ini: <span className="text-white font-bold">4.2 Jam</span>
                    </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
