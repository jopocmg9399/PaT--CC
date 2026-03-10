
import React, { useState } from 'react';
import { 
  Home, Info, Phone, Shield, Menu, X, 
  Store, PlusCircle, LogIn, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlatformLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogin: () => void;
  isAdmin: boolean;
}

const PlatformLayout: React.FC<PlatformLayoutProps> = ({ 
  children, activeTab, setActiveTab, onLogin, isAdmin 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'about', label: 'Nosotros', icon: Info },
    { id: 'contact', label: 'Contactos', icon: Phone },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', label: 'Administrador', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2] font-sans text-[#2B1B17]">
      {/* Navigation */}
      <nav className="bg-white border-b-4 border-[#2B1B17] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer group"
                onClick={() => setActiveTab('home')}
              >
                <div className="p-1 bg-white border-2 border-[#B48D51] shadow-md rotate-[-3deg] group-hover:rotate-0 transition-transform mr-3">
                  <img src="/logo.jpeg" alt="PaTí Logo" className="h-10 w-auto object-contain" />
                </div>
                <span className="text-2xl font-black uppercase tracking-tighter text-[#2B1B17]">PaTí</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`inline-flex items-center px-1 pt-1 border-b-4 text-xs font-black uppercase tracking-widest transition-colors ${
                      activeTab === item.id
                        ? 'border-[#B48D51] text-[#2B1B17]'
                        : 'border-transparent text-gray-400 hover:text-[#2B1B17] hover:border-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={onLogin}
                className="bg-[#2B1B17] text-white px-6 py-2 font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_#B48D51] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2"
              >
                <LogIn size={14} /> Entrar
              </button>
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-[#2B1B17]"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t-2 border-gray-100 overflow-hidden"
            >
              <div className="pt-2 pb-3 space-y-1 px-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-4 text-sm font-black uppercase tracking-widest ${
                      activeTab === item.id
                        ? 'bg-[#FFF9F2] text-[#B48D51] border-l-4 border-[#B48D51]'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.label}
                    </div>
                  </button>
                ))}
                <button 
                  onClick={() => {
                    onLogin();
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-4 bg-[#2B1B17] text-white px-6 py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <LogIn size={18} /> Entrar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#2B1B17] text-white py-12 mt-20 border-t-[12px] border-[#B48D51]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="p-1 bg-white border-2 border-[#B48D51] rotate-[-3deg] mr-3">
                  <img src="/logo.jpeg" alt="PaTí Logo" className="h-8 w-auto object-contain" />
                </div>
                <span className="text-xl font-black uppercase tracking-tighter">PaTí</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Plataforma líder en alojamiento de tiendas online. Potenciamos tu negocio con herramientas profesionales de gestión y afiliados.
              </p>
            </div>
            <div>
              <h4 className="text-[#B48D51] font-black uppercase tracking-widest text-xs mb-6">Enlaces Rápidos</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-[#B48D51] transition-colors">Inicio</button></li>
                <li><button onClick={() => setActiveTab('about')} className="hover:text-[#B48D51] transition-colors">Nosotros</button></li>
                <li><button onClick={() => setActiveTab('contact')} className="hover:text-[#B48D51] transition-colors">Contactos</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#B48D51] font-black uppercase tracking-widest text-xs mb-6">Contacto</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li className="flex items-center gap-3"><Phone size={16} className="text-[#B48D51]" /> +53 5 123 4567</li>
                <li className="flex items-center gap-3"><Info size={16} className="text-[#B48D51]" /> info@pati.cu</li>
                <li className="flex items-center gap-3"><LayoutDashboard size={16} className="text-[#B48D51]" /> La Habana, Cuba</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            © {new Date().getFullYear()} PaTí Platform. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlatformLayout;
