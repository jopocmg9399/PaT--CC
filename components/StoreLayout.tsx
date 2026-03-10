
import React, { useState, useEffect } from 'react';
import { 
  Home, Info, Package, ShoppingCart, 
  Database, Menu, X, Settings, Tag, ShieldAlert, Users,
  LogOut, UserCircle, Share2, TrendingUp
} from 'lucide-react';
import { Notification, StoreConfig, UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface StoreLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  config: StoreConfig;
  role: UserRole;
  onLogout: () => void;
  cartCount: number;
  onCartClick: () => void;
}

const StoreLayout: React.FC<StoreLayoutProps> = ({ 
  children, activeTab, setActiveTab, config, role, onLogout, cartCount, onCartClick 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const allMenuItems = [
    { id: 'home', label: 'Inicio', icon: Home, section: 'General', roles: ['Administrador', 'Dependiente', 'Cliente', 'Afiliado'] },
    { id: 'catalog', label: 'Catálogo', icon: Tag, section: 'Tienda', roles: ['Administrador', 'Dependiente', 'Cliente', 'Afiliado'] },
    { id: 'inventory', label: 'Inventario', icon: Package, section: 'Gestión', roles: ['Administrador', 'Dependiente'] },
    { id: 'sales', label: 'Ventas', icon: ShoppingCart, section: 'Gestión', roles: ['Administrador', 'Dependiente'] },
    { id: 'affiliates', label: 'Afiliados', icon: Share2, section: 'Gestión', roles: ['Administrador'] },
    { id: 'stats', label: 'Estadísticas', icon: TrendingUp, section: 'Gestión', roles: ['Administrador'] },
    { id: 'customers', label: 'Clientes', icon: Users, section: 'Relaciones', roles: ['Administrador'] },
    { id: 'config', label: 'Ajustes', icon: Settings, section: 'Sistema', roles: ['Administrador'] },
    { id: 'about', label: 'Nosotros', icon: Info, section: 'General', roles: ['Administrador', 'Dependiente', 'Cliente', 'Afiliado'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(role));
  const sections = Array.from(new Set(menuItems.map(item => item.section)));

  return (
    <div className="flex h-screen bg-[#FFF9F2] overflow-hidden font-sans max-w-full">
      {/* Overlay móvil */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[150] md:hidden backdrop-blur-md" 
            onClick={() => setIsSidebarOpen(false)}
          ></motion.div>
        )}
      </AnimatePresence>

      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:relative z-[160] w-72 h-full bg-[#2B1B17] text-white transition-transform duration-300 shrink-0 border-r-[12px] border-[#B48D51] md:translate-x-0 shadow-2xl`}>
        <div className="flex flex-col h-full">
          <div className="p-10 border-b-8 border-white/5 flex flex-col items-center bg-black/30">
            <div className="p-2 bg-white border-4 border-[#B48D51] shadow-2xl w-32 h-32 flex items-center justify-center rotate-[-3deg] group hover:rotate-0 transition-transform">
              <img 
                src={config.logoUrl || "/logo.jpeg"} 
                alt="Logo Tienda" 
                className="max-h-full max-w-full object-contain"
                onError={(e) => (e.currentTarget.src = "/logo.jpeg")}
              />
            </div>
            <h1 className="mt-8 text-[12px] font-black uppercase tracking-[0.5em] text-[#B48D51] text-center">{config.storeName}</h1>
            <div className="mt-4 px-3 py-1 bg-[#B48D51] text-white text-[8px] font-black uppercase tracking-widest rounded-full">
              {role}
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-10 px-6 space-y-12 custom-scrollbar">
            {sections.map(section => (
              <div key={section} className="space-y-3">
                <p className="px-5 text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-4">{section}</p>
                {menuItems.filter(item => item.section === section).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-6 py-5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 border-l-[10px]
                      ${activeTab === item.id 
                        ? 'bg-[#B48D51] text-white border-white translate-x-3 scale-105' 
                        : 'text-white/40 hover:text-white hover:bg-white/5 border-transparent'}
                    `}
                  >
                    <item.icon className={`w-5 h-5 mr-5 ${activeTab === item.id ? 'text-white' : 'text-[#B48D51]'}`} />
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="p-8 bg-black/60 border-t-4 border-white/5">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-red-900/20 border-2 border-red-900 text-red-500 hover:bg-red-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative w-full">
        <header className="h-28 bg-white border-b-[10px] border-[#2B1B17] flex items-center justify-between px-8 md:px-16 shrink-0 z-[100] no-print shadow-2xl">
          <div className="flex items-center gap-6">
            <button className="md:hidden p-5 bg-[#2B1B17] text-white shadow-2xl active:scale-95 border-4 border-[#B48D51]" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={28} />
            </button>
            <h1 className="text-3xl md:text-5xl font-black text-[#2B1B17] uppercase tracking-tighter truncate">
              {menuItems.find(m => m.id === activeTab)?.label || 'Tienda'}
            </h1>
          </div>

          <div className="flex items-center gap-6 md:gap-10">
             {/* Cart Button with Logo as requested */}
             <button 
                onClick={onCartClick}
                className="relative p-2 bg-white border-4 border-[#2B1B17] shadow-[6px_6px_0px_#B48D51] hover:translate-y-0.5 hover:shadow-none transition-all group"
             >
                <img src="/logo.jpeg" alt="Cart" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-black w-7 h-7 flex items-center justify-center rounded-full border-2 border-[#2B1B17] shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
             </button>

             <div className="hidden lg:flex items-center gap-4 bg-[#FFF9F2] border-8 border-[#2B1B17] px-8 py-3 shadow-[10px_10px_0px_#B48D51] -rotate-1">
                <UserCircle size={24} className="text-[#B48D51]" />
                <span className="text-[12px] font-black text-[#2B1B17] uppercase tracking-[0.3em]">{role}</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#FFF9F2] custom-scrollbar max-w-full overflow-x-hidden">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 md:p-16 h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default StoreLayout;
