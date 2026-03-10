
import React, { useState } from 'react';
import { 
  Store, Users, TrendingUp, Settings, 
  CheckCircle, XCircle, Key, Mail, 
  Plus, Search, Filter, Download,
  BarChart3, PieChart, Activity, Globe
} from 'lucide-react';
import { StoreRequest, StoreConfig } from '../types';
import { motion } from 'framer-motion';

interface PlatformAdminProps {
  requests: StoreRequest[];
  stores: StoreConfig[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onVerify: (id: string) => void;
  onUpdateConfig: (config: any) => void;
}

const PlatformAdmin: React.FC<PlatformAdminProps> = ({ 
  requests, stores, onApprove, onReject, onVerify, onUpdateConfig 
}) => {
  const [activeSubTab, setActiveSubTab] = useState('requests');

  const tabs = [
    { id: 'requests', label: 'Solicitudes', icon: Mail },
    { id: 'stores', label: 'Tiendas', icon: Store },
    { id: 'stats', label: 'Estadísticas', icon: TrendingUp },
    { id: 'config', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-8 border-[#2B1B17] pb-8 gap-6">
        <div>
          <h2 className="text-5xl font-black text-[#2B1B17] uppercase tracking-tighter">Panel Propietario</h2>
          <p className="text-xs font-black text-[#B48D51] uppercase tracking-[0.3em] mt-2">Control Global de la Plataforma</p>
        </div>
        <div className="flex bg-white border-4 border-[#2B1B17] p-1 shadow-[6px_6px_0px_#B48D51]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                activeSubTab === tab.id 
                  ? 'bg-[#2B1B17] text-white' 
                  : 'text-gray-400 hover:text-[#2B1B17] hover:bg-gray-50'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'requests' && (
        <div className="grid grid-cols-1 gap-6">
          {requests.length === 0 ? (
            <div className="bg-white border-4 border-[#2B1B17] p-20 text-center shadow-[12px_12px_0px_#EADBC8]">
              <Mail size={64} className="mx-auto text-gray-200 mb-6" />
              <p className="text-xl font-black uppercase text-gray-400">No hay solicitudes pendientes</p>
            </div>
          ) : (
            requests.map(req => (
              <motion.div 
                key={req.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border-4 border-[#2B1B17] p-8 shadow-[8px_8px_0px_#EADBC8] flex flex-col md:flex-row justify-between items-center gap-8"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-[#B48D51] text-white px-3 py-1 uppercase border-2 border-[#2B1B17]">
                      {req.status}
                    </span>
                    <span className="text-xs font-bold text-gray-400">{req.date}</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{req.storeName}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <p><span className="font-black uppercase text-[10px] text-gray-400 block">Solicitante</span> {req.ownerName}</p>
                    <p><span className="font-black uppercase text-[10px] text-gray-400 block">Email</span> {req.email}</p>
                  </div>
                  <p className="text-gray-500 text-sm italic">"{req.description}"</p>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                  {req.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => onApprove(req.id)}
                        className="flex-1 md:flex-none bg-green-600 text-white px-8 py-4 font-black text-xs uppercase shadow-[4px_4px_0px_#2B1B17] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} /> Aprobar
                      </button>
                      <button 
                        onClick={() => onReject(req.id)}
                        className="flex-1 md:flex-none bg-red-600 text-white px-8 py-4 font-black text-xs uppercase shadow-[4px_4px_0px_#2B1B17] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} /> Rechazar
                      </button>
                    </>
                  ) : req.status === 'approved' && (
                    <div className="bg-[#FFF9F2] border-2 border-dashed border-[#B48D51] p-4 flex items-center gap-4">
                      <Key size={20} className="text-[#B48D51]" />
                      <div>
                        <p className="text-[8px] font-black uppercase text-gray-400">Clave Generada</p>
                        <p className="font-mono font-bold text-[#2B1B17]">{req.authKey}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {activeSubTab === 'stores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map(store => (
            <div key={store.id} className="bg-white border-4 border-[#2B1B17] p-8 shadow-[8px_8px_0px_#EADBC8] group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-2 bg-white border-2 border-[#B48D51] w-20 h-20 flex items-center justify-center rotate-[-3deg] group-hover:rotate-0 transition-transform">
                  <img src={store.logoUrl || "/logo.jpeg"} alt={store.storeName} className="max-h-full max-w-full object-contain" />
                </div>
                <span className={`text-[10px] font-black px-3 py-1 uppercase border-2 border-[#2B1B17] ${
                  store.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {store.status}
                </span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{store.storeName}</h3>
              <p className="text-xs text-gray-500 mb-6 line-clamp-2">{store.aboutText}</p>
              
              <div className="space-y-4 pt-6 border-t-2 border-dashed border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-400">Comisión</span>
                  <span className="font-black text-[#B48D51]">{store.commissionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gray-400">Afiliados</span>
                  <span className="font-black text-[#2B1B17]">{store.affiliateConfig.enabled ? 'SÍ' : 'NO'}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-8">
                <button 
                  onClick={() => onVerify(store.id)}
                  className={`flex-1 py-4 font-black text-[10px] uppercase tracking-widest transition-colors border-2 border-[#2B1B17] ${
                    store.isVerified ? 'bg-[#B48D51] text-white' : 'bg-white text-[#2B1B17] hover:bg-gray-50'
                  }`}
                >
                  {store.isVerified ? 'Acreditada' : 'Acreditar'}
                </button>
                <button className="flex-1 bg-[#2B1B17] text-white py-4 font-black text-[10px] uppercase tracking-widest hover:bg-[#B48D51] transition-colors">
                  Gestionar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Ingresos Plataforma", value: "$45,200", icon: BarChart3, color: "text-green-600" },
              { label: "Tiendas Totales", value: stores.length.toString(), icon: Store, color: "text-[#B48D51]" },
              { label: "Ventas Mes", value: "$128,400", icon: Activity, color: "text-blue-600" },
              { label: "Nuevas Solicitudes", value: requests.filter(r=>r.status==='pending').length.toString(), icon: Mail, color: "text-purple-600" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border-4 border-[#2B1B17] p-8 shadow-[8px_8px_0px_#EADBC8]">
                <stat.icon size={24} className={`${stat.color} mb-4`} />
                <p className="text-3xl font-black tracking-tighter text-[#2B1B17]">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-white border-4 border-[#2B1B17] p-10 shadow-[12px_12px_0px_#EADBC8]">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
              <TrendingUp size={24} className="text-[#B48D51]" /> Crecimiento de Ventas
            </h3>
            <div className="h-80 w-full bg-[#FFF9F2] border-2 border-dashed border-gray-200 flex items-center justify-center">
              <p className="text-gray-400 font-black uppercase tracking-widest">Gráfico de Recharts Aquí</p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'config' && (
        <div className="bg-white border-4 border-[#2B1B17] p-10 shadow-[12px_12px_0px_#EADBC8] max-w-4xl">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Ajustes de la Plataforma</h3>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre de la Plataforma</label>
                <input type="text" defaultValue="PaTí Platform" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold focus:outline-none focus:ring-4 focus:ring-[#B48D51]/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email de Soporte</label>
                <input type="email" defaultValue="soporte@pati.cu" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold focus:outline-none focus:ring-4 focus:ring-[#B48D51]/20" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción de Nosotros</label>
              <textarea rows={4} defaultValue="Somos la plataforma líder en Cuba para el alojamiento de tiendas con sistema de afiliados..." className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold focus:outline-none focus:ring-4 focus:ring-[#B48D51]/20" />
            </div>

            <div className="pt-8 border-t-4 border-dashed border-gray-100">
              <h4 className="text-lg font-black uppercase tracking-tighter mb-6">Credenciales de Administrador</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Admin</label>
                  <input type="email" defaultValue="admin@pati.cu" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold focus:outline-none focus:ring-4 focus:ring-[#B48D51]/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#FFF9F2] border-4 border-[#2B1B17] p-4 font-bold focus:outline-none focus:ring-4 focus:ring-[#B48D51]/20" />
                </div>
              </div>
            </div>

            <button type="button" className="bg-[#2B1B17] text-white px-12 py-5 font-black text-xs uppercase tracking-widest shadow-[8px_8px_0px_#B48D51] hover:translate-y-1 hover:shadow-none transition-all">
              Guardar Cambios
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlatformAdmin;
