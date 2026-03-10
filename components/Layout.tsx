
import React, { useState, useEffect } from 'react';
import { 
  Home, Info, Package, ShoppingCart, 
  Database, Menu, X, Settings, Tag, ShieldAlert, Users
} from 'lucide-react';
import { Notification, StoreConfig } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: Notification[];
  onNotificationRead: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [config, setConfig] = useState<StoreConfig>({ 
    logoUrl: "logo.jpeg", 
    storeName: "PaTí",
    aboutText: "", address: "", phone: "", email: "", facebookUrl: "", instagramUrl: "", websiteUrl: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem('pati_v16_config');
    if (saved) setConfig(JSON.parse(saved));
  }, [activeTab]);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home, section: 'Control' },
    { id: 'catalog', label: 'Catálogo', icon: Tag, section: 'Gestión' },
    { id: 'inventory', label: 'Inventario', icon: Package, section: 'Gestión' },
    { id: 'sales', label: 'Caja POS', icon: ShoppingCart, section: 'Ventas' },
    { id: 'contacts', label: 'Directorio', icon: Users, section: 'Relaciones' },
    { id: 'maintenance', label: 'Bóveda', icon: Database, section: 'Sistema' },
    { id: 'config', label: 'Ajustes', icon: Settings, section: 'Sistema' },
  ];

  const sections = Array.from(new Set(menuItems.map(item => item.section)));

  return (
    <div className="flex h-screen bg-[#FFF9F2] overflow-hidden font-sans max-w-full">
      {/* Overlay móvil */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/90 z-[150] md:hidden backdrop-blur-md" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:relative z-[160] w-72 h-full bg-[#2B1B17] text-white transition-transform duration-300 shrink-0 border-r-[12px] border-[#B48D51] md:translate-x-0 shadow-2xl`}>
        <div className="flex flex-col h-full">
          <div className="p-10 border-b-8 border-white/5 flex flex-col items-center bg-black/30">
            <div className="p-2 bg-white border-4 border-[#B48D51] shadow-2xl w-32 h-32 flex items-center justify-center rotate-[-3deg] group hover:rotate-0 transition-transform">
              <img 
                src="./logo.jpeg" 
                alt="Logo PaTí" 
                className="max-h-full max-w-full object-contain"
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=PaTí")}
              />
            </div>
            <h1 className="mt-8 text-[12px] font-black uppercase tracking-[0.5em] text-[#B48D51] text-center">{config.storeName}</h1>
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
          <div className="p-8 bg-black/60 text-center border-t-4 border-white/5">
             <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#B48D51]/10 border-2 border-[#B48D51] rounded-full">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_#22c55e]"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">En Línea</span>
             </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative w-full">
        <header className="h-28 bg-white border-b-[10px] border-[#2B1B17] flex items-center justify-between px-8 md:px-16 shrink-0 z-[100] no-print shadow-2xl">
          <button className="md:hidden p-5 bg-[#2B1B17] text-white shadow-2xl active:scale-95 border-4 border-[#B48D51]" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={28} />
          </button>
          
          <div className="flex-1 px-8 md:px-0">
            <h1 className="text-3xl md:text-5xl font-black text-[#2B1B17] uppercase tracking-tighter truncate">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-10">
             <div className="hidden lg:flex items-center gap-4 bg-[#FFF9F2] border-8 border-[#2B1B17] px-8 py-3 shadow-[10px_10px_0px_#B48D51] -rotate-1">
                <ShieldAlert size={24} className="text-[#B48D51]" />
                <span className="text-[12px] font-black text-[#2B1B17] uppercase tracking-[0.3em]">Bóveda Cifrada</span>
             </div>
             <img src="./logo.jpeg" alt="PaTí" className="h-16 w-auto object-contain md:hidden border-4 border-[#2B1B17] rotate-3 shadow-lg" onError={(e) => e.currentTarget.style.display='none'} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#FFF9F2] custom-scrollbar max-w-full overflow-x-hidden">
          <div className="p-8 md:p-16 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
