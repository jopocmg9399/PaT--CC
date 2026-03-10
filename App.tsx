
import React, { useState, useEffect, useMemo } from 'react';
import PlatformLayout from './components/PlatformLayout';
import StoreLayout from './components/StoreLayout';
import PlatformHome from './components/PlatformHome';
import PlatformAdmin from './components/PlatformAdmin';
import StoreFront from './components/StoreFront';
import Dashboard from './components/Dashboard';
import { 
  Product, Contact, Transaction, 
  SaleItem, StoreConfig, UserRole,
  StoreRequest, PlatformConfig, Currency
} from './types';
import { 
  Plus, Search, Trash2, Edit2, X, 
  Truck, ShoppingCart, Package,
  Download, Upload, Database, Tag, 
  Users, UserPlus, Phone, MapPin, AlertCircle,
  DollarSign, Wallet, ArrowDownCircle, History,
  TrendingUp, BarChart3, Share2, Key, ShieldCheck, Mail, CheckCircle2
} from 'lucide-react';

// --- CONSTANTS ---
const STORAGE_KEYS = {
  PLATFORM_REQUESTS: 'pati_platform_requests',
  PLATFORM_STORES: 'pati_platform_stores',
  PLATFORM_CONFIG: 'pati_platform_config',
  CURRENT_STORE_ID: 'pati_current_store_id',
  USER_ROLE: 'pati_user_role'
};

const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  name: "PaTí Platform",
  about: "Plataforma líder en alojamiento de tiendas online. Gestionamos tu inventario, ventas y red de afiliados con la máxima transparencia y profesionalismo.",
  contact: { email: "info@pati.cu", phone: "+53 5 123 4567", address: "La Habana, Cuba" },
  credentials: { adminEmail: "admin@pati.cu", adminPass: "admin123" }
};

const App: React.FC = () => {
  // --- NAVIGATION & SESSION ---
  const [view, setView] = useState<'platform' | 'store'>('platform');
  const [activeTab, setActiveTab] = useState('home');
  const [userRole, setUserRole] = useState<UserRole>('Cliente');
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);
  const [isDataReady, setIsDataReady] = useState(false);

  // --- PLATFORM DATA ---
  const [requests, setRequests] = useState<StoreRequest[]>([]);
  const [stores, setStores] = useState<StoreConfig[]>([]);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(DEFAULT_PLATFORM_CONFIG);

  // --- STORE DATA (Dynamic) ---
  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [currency, setCurrency] = useState<Currency>('CUP');

  // --- MODALS ---
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<{ storeId: string, role: UserRole } | null>(null);
  const [authError, setAuthError] = useState('');

  // --- INITIAL LOAD ---
  useEffect(() => {
    const r = localStorage.getItem(STORAGE_KEYS.PLATFORM_REQUESTS);
    const s = localStorage.getItem(STORAGE_KEYS.PLATFORM_STORES);
    const pc = localStorage.getItem(STORAGE_KEYS.PLATFORM_CONFIG);
    const sid = localStorage.getItem(STORAGE_KEYS.CURRENT_STORE_ID);
    const role = localStorage.getItem(STORAGE_KEYS.USER_ROLE);

    if (r) setRequests(JSON.parse(r));
    if (s) setStores(JSON.parse(s));
    if (pc) setPlatformConfig(JSON.parse(pc));
    if (sid) {
      setCurrentStoreId(sid);
      setView('store');
    }
    if (role) setUserRole(role as UserRole);

    setIsDataReady(true);
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => {
    if (!isDataReady) return;
    localStorage.setItem(STORAGE_KEYS.PLATFORM_REQUESTS, JSON.stringify(requests));
    localStorage.setItem(STORAGE_KEYS.PLATFORM_STORES, JSON.stringify(stores));
    localStorage.setItem(STORAGE_KEYS.PLATFORM_CONFIG, JSON.stringify(platformConfig));
    if (currentStoreId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STORE_ID, currentStoreId);
      localStorage.setItem(`store_${currentStoreId}_products`, JSON.stringify(products));
      localStorage.setItem(`store_${currentStoreId}_contacts`, JSON.stringify(contacts));
      localStorage.setItem(`store_${currentStoreId}_transactions`, JSON.stringify(transactions));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STORE_ID);
    }
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
  }, [requests, stores, platformConfig, currentStoreId, products, contacts, transactions, userRole, isDataReady]);

  // --- LOAD STORE DATA ---
  useEffect(() => {
    if (currentStoreId) {
      const p = localStorage.getItem(`store_${currentStoreId}_products`);
      const c = localStorage.getItem(`store_${currentStoreId}_contacts`);
      const t = localStorage.getItem(`store_${currentStoreId}_transactions`);
      const cfg = stores.find(s => s.id === currentStoreId);

      if (p) setProducts(JSON.parse(p)); else setProducts([]);
      if (c) setContacts(JSON.parse(c)); else setContacts([]);
      if (t) setTransactions(JSON.parse(t)); else setTransactions([]);
      if (cfg) setStoreConfig(cfg);
    }
  }, [currentStoreId, stores]);

  // --- HANDLERS ---
  const handleRequestStore = (data: any) => {
    const newRequest: StoreRequest = {
      id: Math.random().toString(36).substr(2, 9),
      storeName: data.storeName,
      ownerName: data.ownerName,
      email: data.email,
      phone: data.phone,
      description: data.description,
      status: 'pending',
      date: new Date().toLocaleDateString()
    };
    setRequests([...requests, newRequest]);
    setShowRequestModal(false);
    alert("Solicitud enviada con éxito. El Propietario revisará su petición.");
  };

  const handleApproveStore = (id: string) => {
    const authKey = Math.random().toString(36).substr(2, 8).toUpperCase();
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved', authKey } : r));
    
    const req = requests.find(r => r.id === id);
    if (req) {
      const newStore: StoreConfig = {
        id: Math.random().toString(36).substr(2, 9),
        storeName: req.storeName,
        logoUrl: "/logo.jpeg",
        aboutText: req.description,
        address: "La Habana, Cuba",
        phone: req.phone,
        email: req.email,
        facebookUrl: "", instagramUrl: "", websiteUrl: "",
        ownerId: req.id,
        status: 'active',
        commissionRate: 5,
        affiliateConfig: { enabled: true, defaultCommissionType: 'percentage', defaultCommissionValue: 10 }
      };
      setStores([...stores, newStore]);
    }
  };

  const handleEnterStore = (storeId: string, role: UserRole) => {
    if (role === 'Administrador' || role === 'Dependiente') {
      setShowAuthModal({ storeId, role });
      setShowLoginModal(false);
      return;
    }
    setCurrentStoreId(storeId);
    setUserRole(role);
    setView('store');
    setActiveTab('home');
    setShowLoginModal(false);
  };

  const handleAuthSubmit = (password: string) => {
    if (!showAuthModal) return;
    const req = requests.find(r => r.storeName === stores.find(s => s.id === showAuthModal.storeId)?.storeName);
    if (req && req.authKey === password) {
      setCurrentStoreId(showAuthModal.storeId);
      setUserRole(showAuthModal.role);
      setView('store');
      setActiveTab('home');
      setShowAuthModal(null);
      setAuthError('');
    } else {
      setAuthError('Clave de acceso incorrecta');
    }
  };

  const handleSaveProduct = (data: any) => {
    const newProduct: Product = {
      id: editingProduct?.id || Math.random().toString(36).substr(2, 9),
      name: data.name,
      sku: data.sku || `SKU-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      description: data.description,
      categoryId: data.categoryId,
      supplierId: data.supplierId || 'Gral',
      receptionType: 'Compra Directa',
      unitPrice: Number(data.unitPrice),
      unitCurrency: 'CUP',
      costPrice: Number(data.costPrice || 0),
      groupings: editingProduct?.groupings || [],
      offers: editingProduct?.offers || [],
      stock: Number(data.stock),
      minStock: Number(data.minStock || 5),
      expiryDate: data.expiryDate || '',
      receivedDate: new Date().toISOString(),
      lots: editingProduct?.lots || []
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleVerifyStore = (id: string) => {
    setStores(stores.map(s => s.id === id ? { ...s, isVerified: !s.isVerified } : s));
  };

  const handleLogout = () => {
    setCurrentStoreId(null);
    setUserRole('Cliente');
    setView('platform');
    setActiveTab('home');
  };

  const addToCart = (p: Product, groupingId?: string) => {
    if (p.stock <= 0) return alert("Stock agotado.");
    
    let price = p.unitPrice;
    let label = "Unidad";
    let units = 1;

    if (groupingId) {
      const g = p.groupings.find(x => x.id === groupingId);
      if (g) {
        price = g.price;
        label = g.label;
        units = g.quantity;
      }
    }

    const existing = cart.find(i => i.productId === p.id && i.groupingId === groupingId);
    if (existing) {
      setCart(cart.map(i => (i.productId === p.id && i.groupingId === groupingId) 
        ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * units * price, unitQuantity: (i.quantity + 1) * units } 
        : i));
    } else {
      setCart([...cart, { 
        id: Math.random().toString(), productId: p.id, productName: p.name, 
        groupingId, groupingLabel: label,
        quantity: 1, price: price, total: price * units, currency: p.unitCurrency, unitQuantity: units 
      }]);
    }
  };

  const finalizeSale = () => {
    if (cart.length === 0) return;
    const totalCup = cart.reduce((acc, i) => acc + i.total, 0);
    const newTx: Transaction = {
      id: Math.random().toString(),
      date: new Date().toISOString(),
      clientId: 'Gral',
      clientName: 'Venta Mostrador',
      items: [...cart],
      totalCup,
      totalUsd: totalCup / 250,
      paymentMethod: 'Efectivo',
      status: 'Despachado',
      invoiceNumber: `POS-${Date.now().toString().slice(-6)}`
    };

    setProducts(prev => prev.map(p => {
      const soldItems = cart.filter(i => i.productId === p.id);
      const totalSold = soldItems.reduce((acc, i) => acc + i.unitQuantity, 0);
      return totalSold > 0 ? { ...p, stock: p.stock - totalSold } : p;
    }));

    setTransactions([newTx, ...transactions]);
    setCart([]);
    setShowCartModal(false);
    alert("Operación completada.");
  };

  // --- RENDER ---
  if (!isDataReady) return null;

  if (view === 'platform') {
    return (
      <PlatformLayout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={userRole === 'Propietario'}
        onLogin={() => setShowLoginModal(true)}
      >
        {activeTab === 'home' && (
          <PlatformHome 
            onRequestStore={() => setShowRequestModal(true)} 
            onEnterStore={() => setShowLoginModal(true)} 
          />
        )}
        {activeTab === 'admin' && userRole === 'Propietario' && (
          <PlatformAdmin 
            requests={requests} 
            stores={stores} 
            onApprove={handleApproveStore}
            onReject={(id) => setRequests(requests.filter(r => r.id !== id))}
            onVerify={handleVerifyStore}
            onUpdateConfig={setPlatformConfig}
          />
        )}
        {activeTab === 'about' && (
          <div className="bg-white border-4 border-[#2B1B17] p-16 shadow-[12px_12px_0px_#B48D51]">
            <h2 className="text-6xl font-black uppercase tracking-tighter mb-8">Sobre PaTí</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">{platformConfig.about}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Nuestra Misión</h3>
                <p className="text-gray-500">Democratizar el comercio electrónico en Cuba, ofreciendo herramientas profesionales a emprendedores de todos los tamaños.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Nuestra Visión</h3>
                <p className="text-gray-500">Ser el ecosistema digital preferido por las tiendas y sus redes de afiliados para conectar con clientes finales.</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white border-4 border-[#2B1B17] p-12 shadow-[12px_12px_0px_#B48D51]">
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-8">Contáctanos</h2>
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Nombre</label>
                  <input type="text" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Email</label>
                  <input type="email" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Mensaje</label>
                  <textarea rows={4} className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold"></textarea>
                </div>
                <button type="button" className="bg-[#2B1B17] text-white px-10 py-4 font-black text-xs uppercase tracking-widest shadow-[6px_6px_0px_#B48D51] hover:translate-y-1 hover:shadow-none transition-all">
                  Enviar Mensaje
                </button>
              </form>
            </div>
            <div className="space-y-8">
              <div className="bg-[#2B1B17] text-white p-12 border-l-[12px] border-[#B48D51] shadow-2xl">
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Información</h3>
                <ul className="space-y-6">
                  <li className="flex items-center gap-4"><Phone className="text-[#B48D51]" /> {platformConfig.contact.phone}</li>
                  <li className="flex items-center gap-4"><Mail className="text-[#B48D51]" /> {platformConfig.contact.email}</li>
                  <li className="flex items-center gap-4"><MapPin className="text-[#B48D51]" /> {platformConfig.contact.address}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showRequestModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white border-8 border-[#2B1B17] p-10 max-w-2xl w-full shadow-[20px_20px_0px_#B48D51] relative">
              <button onClick={() => setShowRequestModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100"><X /></button>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Solicitar Creación de Tienda</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleRequestStore(Object.fromEntries(formData));
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Nombre de la Tienda</label>
                    <input name="storeName" required type="text" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Nombre del Propietario</label>
                    <input name="ownerName" required type="text" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Email</label>
                    <input name="email" required type="email" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Teléfono</label>
                    <input name="phone" required type="tel" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Descripción del Negocio</label>
                  <textarea name="description" required rows={3} className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#2B1B17] text-white py-6 font-black text-sm uppercase tracking-widest shadow-[8px_8px_0px_#B48D51] hover:translate-y-1 hover:shadow-none transition-all">
                  Enviar Solicitud
                </button>
              </form>
            </div>
          </div>
        )}

        {showLoginModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white border-8 border-[#2B1B17] p-10 max-w-md w-full shadow-[20px_20px_0px_#B48D51] relative">
              <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100"><X /></button>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Acceso al Sistema</h2>
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">¿Eres el Propietario de la Plataforma?</p>
                  <button 
                    onClick={() => {
                      setUserRole('Propietario');
                      setActiveTab('admin');
                      setShowLoginModal(false);
                    }}
                    className="w-full bg-[#2B1B17] text-white py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <ShieldCheck size={18} /> Entrar como Propietario
                  </button>
                </div>
                
                <div className="pt-8 border-t-4 border-dashed border-gray-100 space-y-4">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">¿Tienes una Tienda?</p>
                  <div className="space-y-4">
                    {stores.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No hay tiendas creadas todavía.</p>
                    ) : (
                      stores.map(s => (
                        <div key={s.id} className="flex flex-col gap-2">
                          <p className="text-xs font-bold text-[#2B1B17]">{s.storeName}</p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEnterStore(s.id, 'Administrador')}
                              className="flex-1 bg-[#FFF9F2] border-2 border-[#2B1B17] py-2 text-[8px] font-black uppercase hover:bg-[#B48D51] hover:text-white transition-all"
                            >
                              Admin
                            </button>
                            <button 
                              onClick={() => handleEnterStore(s.id, 'Dependiente')}
                              className="flex-1 bg-[#FFF9F2] border-2 border-[#2B1B17] py-2 text-[8px] font-black uppercase hover:bg-[#B48D51] hover:text-white transition-all"
                            >
                              Dependiente
                            </button>
                            <button 
                              onClick={() => handleEnterStore(s.id, 'Cliente')}
                              className="flex-1 bg-[#FFF9F2] border-2 border-[#2B1B17] py-2 text-[8px] font-black uppercase hover:bg-[#B48D51] hover:text-white transition-all"
                            >
                              Visitar
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </PlatformLayout>
    );
  }

  // --- STORE VIEW ---
  if (view === 'store' && storeConfig) {
    return (
      <StoreLayout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        config={storeConfig} 
        role={userRole}
        onLogout={handleLogout}
        cartCount={cart.reduce((a,b)=>a+b.quantity, 0)}
        onCartClick={() => setShowCartModal(true)}
      >
        {activeTab === 'home' && (
          <StoreFront 
            products={products} 
            config={storeConfig} 
            onAddToCart={addToCart}
            onAffiliateClick={() => setActiveTab('affiliates')}
            currency={currency}
            setCurrency={setCurrency}
          />
        )}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
             <div className="flex justify-between items-end border-b-8 border-[#2B1B17] pb-8">
                <h2 className="text-5xl font-black text-[#2B1B17] uppercase tracking-tighter">Catálogo</h2>
                {(userRole === 'Administrador' || userRole === 'Dependiente') && (
                  <button 
                    onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                    className="bg-[#2B1B17] text-white px-8 py-4 font-black text-xs uppercase shadow-[6px_6px_0px_#B48D51] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
                  >
                    <Plus size={18}/> Nuevo Producto
                  </button>
                )}
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-white border-4 border-[#2B1B17] shadow-[12px_12px_0px_#EADBC8]">
                    <Package size={64} className="mx-auto text-gray-200 mb-6" />
                    <p className="text-xl font-black uppercase text-gray-400">No hay productos en el catálogo</p>
                  </div>
                ) : (
                  products.map(p => (
                    <div key={p.id} className="bg-white border-4 border-[#2B1B17] p-6 shadow-[8px_8px_0px_#EADBC8] flex flex-col relative group">
                      {(userRole === 'Administrador' || userRole === 'Dependiente') && (
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingProduct(p); setShowProductModal(true); }} className="p-2 bg-white border-2 border-[#2B1B17] hover:bg-blue-50"><Edit2 size={14}/></button>
                          <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="p-2 bg-white border-2 border-[#2B1B17] hover:bg-red-50"><Trash2 size={14}/></button>
                        </div>
                      )}
                      <div className="aspect-square mb-4 bg-[#FFF9F2] border-2 border-[#2B1B17] overflow-hidden">
                        <img src={`https://picsum.photos/seed/${p.id}/300/300`} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-black text-xl text-[#2B1B17] uppercase truncate mb-2">{p.name}</h3>
                      <div className="mt-auto pt-6 border-t-4 border-dashed border-[#FFF9F2] flex justify-between items-end">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Precio</p>
                          <p className="text-3xl font-black text-[#2B1B17] tracking-tighter">${p.unitPrice.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Stock</p>
                          <p className={`text-2xl font-black ${p.stock <= p.minStock ? 'text-red-600' : 'text-green-700'}`}>{p.stock}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}
        {activeTab === 'inventory' && <Dashboard products={products} transactions={transactions} suppliers={contacts} />}
        {activeTab === 'affiliates' && (
          <div className="space-y-8">
            <div className="bg-[#2B1B17] text-white p-16 border-l-[16px] border-[#B48D51] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Share2 size={200} /></div>
              <h2 className="text-6xl font-black uppercase tracking-tighter mb-6 relative z-10">Programa de Afiliados</h2>
              <p className="text-xl text-white/60 max-w-2xl mb-10 relative z-10">Gana comisiones por cada venta gestionada. Únete a nuestra red y empieza a monetizar tu influencia.</p>
              <div className="flex gap-6 relative z-10">
                <button className="bg-[#B48D51] text-white px-10 py-5 font-black text-sm uppercase tracking-widest shadow-[6px_6px_0px_white] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3">
                  <UserPlus size={20} /> Registrarme como Afiliado
                </button>
                <button className="bg-white text-[#2B1B17] px-10 py-5 font-black text-sm uppercase tracking-widest shadow-[6px_6px_0px_#B48D51] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3">
                  <Key size={20} /> Tengo un Código
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Comisión Directa", desc: "Gana hasta un 15% por cada producto vendido a través de tu enlace.", icon: DollarSign },
                { title: "Pagos Semanales", desc: "Recibe tus ganancias acumuladas todos los lunes sin montos mínimos.", icon: Wallet },
                { title: "Panel de Control", desc: "Sigue tus ventas y comisiones en tiempo real con estadísticas detalladas.", icon: BarChart3 }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border-4 border-[#2B1B17] p-10 shadow-[8px_8px_0px_#EADBC8]">
                  <item.icon size={32} className="text-[#B48D51] mb-6" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'about' && (
          <div className="bg-white border-4 border-[#2B1B17] p-16 shadow-[12px_12px_0px_#B48D51]">
            <h2 className="text-6xl font-black uppercase tracking-tighter mb-8">Sobre {storeConfig.storeName}</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">{storeConfig.aboutText}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Ubicación</h3>
                <p className="text-gray-500 flex items-center gap-3"><MapPin className="text-[#B48D51]" /> {storeConfig.address}</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Contacto</h3>
                <p className="text-gray-500 flex items-center gap-3"><Phone className="text-[#B48D51]" /> {storeConfig.phone}</p>
                <p className="text-gray-500 flex items-center gap-3"><Mail className="text-[#B48D51]" /> {storeConfig.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cart Modal */}
        {showCartModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-end bg-black/80 backdrop-blur-sm">
            <div className="bg-white h-full w-full max-w-md border-l-[12px] border-[#B48D51] p-10 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Mi Carrito</h2>
                <button onClick={() => setShowCartModal(false)} className="p-2 hover:bg-gray-100"><X /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart size={64} className="mx-auto text-gray-200 mb-6" />
                    <p className="text-xl font-black uppercase text-gray-400">Carrito Vacío</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 border-b-2 border-dashed border-gray-100 pb-6">
                      <div className="w-20 h-20 bg-[#FFF9F2] border-2 border-[#2B1B17] flex-shrink-0">
                        <img src={`https://picsum.photos/seed/${item.productId}/100/100`} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black uppercase text-sm">{item.productName}</h4>
                        <p className="text-[10px] font-bold text-[#B48D51] uppercase">{item.groupingLabel}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="font-black text-lg">${item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-3 bg-[#FFF9F2] border-2 border-[#2B1B17] px-3 py-1">
                            <button onClick={() => {
                              if (item.quantity > 1) {
                                setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1, total: (i.quantity - 1) * (i.total / i.quantity), unitQuantity: (i.quantity - 1) * (i.unitQuantity / i.quantity) } : i));
                              } else {
                                setCart(cart.filter(i => i.id !== item.id));
                              }
                            }} className="font-black">-</button>
                            <span className="font-black text-xs">{item.quantity}</span>
                            <button onClick={() => {
                              setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * (i.total / i.quantity), unitQuantity: (i.quantity + 1) * (i.unitQuantity / i.quantity) } : i));
                            }} className="font-black">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-10 pt-10 border-t-8 border-[#2B1B17] space-y-6">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase text-gray-400">Total a Pagar</p>
                  <p className="text-5xl font-black tracking-tighter">${cart.reduce((a,b)=>a+b.total, 0).toLocaleString()} <span className="text-sm opacity-40">CUP</span></p>
                </div>
                <button 
                  onClick={finalizeSale}
                  disabled={cart.length === 0}
                  className="w-full bg-[#2B1B17] text-white py-6 font-black text-sm uppercase tracking-widest shadow-[8px_8px_0px_#B48D51] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                >
                  Finalizar Compra <CheckCircle2 size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
        {showAuthModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-white border-8 border-[#2B1B17] p-10 max-w-md w-full shadow-[20px_20px_0px_#B48D51] relative">
              <button onClick={() => setShowAuthModal(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100"><X /></button>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Acreditación</h2>
              <p className="text-xs font-bold text-gray-400 uppercase mb-8">Introduce la clave de acceso para {showAuthModal.role}</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const pass = new FormData(e.currentTarget).get('password') as string;
                handleAuthSubmit(pass);
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Clave de Acceso</label>
                  <input name="password" required type="password" autoFocus className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                  {authError && <p className="text-red-600 text-[10px] font-black uppercase">{authError}</p>}
                </div>
                <button type="submit" className="w-full bg-[#2B1B17] text-white py-6 font-black text-sm uppercase tracking-widest shadow-[8px_8px_0px_#B48D51] hover:translate-y-1 hover:shadow-none transition-all">
                  Verificar Clave
                </button>
              </form>
            </div>
          </div>
        )}

        {showProductModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-white border-8 border-[#2B1B17] p-10 max-w-2xl w-full shadow-[20px_20px_0px_#B48D51] relative overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100"><X /></button>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveProduct(Object.fromEntries(new FormData(e.currentTarget)));
              }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Nombre del Producto</label>
                    <input name="name" defaultValue={editingProduct?.name} required type="text" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Categoría</label>
                    <input name="categoryId" defaultValue={editingProduct?.categoryId} required type="text" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Descripción</label>
                  <textarea name="description" defaultValue={editingProduct?.description} rows={2} className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Precio Venta (CUP)</label>
                    <input name="unitPrice" defaultValue={editingProduct?.unitPrice} required type="number" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Costo (CUP)</label>
                    <input name="costPrice" defaultValue={editingProduct?.costPrice} type="number" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Stock Inicial</label>
                    <input name="stock" defaultValue={editingProduct?.stock} required type="number" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#2B1B17] text-white py-6 font-black text-sm uppercase tracking-widest shadow-[8px_8px_0px_#B48D51] hover:translate-y-1 hover:shadow-none transition-all">
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </form>
            </div>
          </div>
        )}
      </StoreLayout>
    );
  }

  return null;
};

export default App;
