import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Menu, X, LogOut, User, LayoutDashboard, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === "admin");
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const navLinks = [
    { name: "Beranda", path: "/" },
    { name: "Layanan", path: "/#layanan" },
    { name: "Harga", path: "/#harga" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-bg">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="glass rounded-full px-6 py-3 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-accent/30 group-hover:shadow-accent/50">
              <span className="text-bg font-black italic text-lg">C</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white group-hover:text-accent transition-colors">
              CloudEdit
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-xs font-bold uppercase tracking-[0.2em] text-text-s hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="h-4 w-px bg-white/10 mx-2"></div>

            {user ? (
              <div className="flex items-center space-x-6">
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className="flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.2em] text-text-s hover:text-white transition-colors"
                >
                  {isAdmin ? <LayoutDashboard size={14} /> : <User size={14} />}
                  <span>{isAdmin ? "Admin" : "Panel"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-text-s hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-[0.3em] text-text-s hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-accent hover:bg-sky-400 text-bg text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-lg shadow-accent/20 active:scale-95"
                >
                  Order Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 glass rounded-full"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mt-4 md:hidden glass rounded-[2rem] p-6 shadow-2xl"
            >
              <div className="space-y-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm font-bold uppercase tracking-widest text-text-s hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-6 border-t border-white/5 space-y-6">
                  {user ? (
                    <>
                      <Link
                        to={isAdmin ? "/admin" : "/dashboard"}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 text-sm font-bold text-text-s"
                      >
                        {isAdmin ? <LayoutDashboard size={18} /> : <User size={18} />}
                        <span>{isAdmin ? "Admin Console" : "Dashboard"}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-sm font-bold text-red-400"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-sm font-bold text-text-s uppercase tracking-widest"
                      >
                        Masuk
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-6 py-4 bg-accent text-center text-bg font-black rounded-2xl text-sm"
                      >
                        Mulai Sekarang
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-32">{children}</main>

      <footer className="relative bg-bg pt-32 pb-16 overflow-hidden mt-32">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="col-span-1 md:col-span-6">
              <Link to="/" className="flex items-center space-x-3 group mb-8">
                <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
                  <span className="text-bg font-black italic">C</span>
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">
                  CloudEdit
                </span>
              </Link>
              <p className="text-text-s text-lg max-w-md leading-relaxed">
                Menghubungkan imajinasi Anda dengan presisi cloud. 
                Platform pengolah konten visual terdepan di Indonesia.
              </p>
            </div>
            
            <div className="col-span-1 md:col-span-3">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">Ecosystem</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-s hover:text-accent transition-colors text-sm font-medium">Post Production</a></li>
                <li><a href="#" className="text-text-s hover:text-accent transition-colors text-sm font-medium">Color Grading</a></li>
                <li><a href="#" className="text-text-s hover:text-accent transition-colors text-sm font-medium">Asset Management</a></li>
                <li><a href="#" className="text-text-s hover:text-accent transition-colors text-sm font-medium">Render Cloud</a></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-3">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8">Connect</h4>
              <ul className="space-y-4">
                <li className="text-text-s text-sm font-medium">hello@cloudedit.com</li>
                <li className="text-text-s text-sm font-medium">+62 812-3456-7890</li>
                <li className="text-text-s text-sm font-medium">Grand Slipi Tower, Jakarta</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-600 mb-6 md:mb-0">
              &copy; {new Date().getFullYear()} CloudEdit. All Systems Operational.
            </p>
            <div className="flex space-x-12">
              <a href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-accent transition-colors">Privacy</a>
              <a href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-accent transition-colors">Security</a>
              <a href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-accent transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
