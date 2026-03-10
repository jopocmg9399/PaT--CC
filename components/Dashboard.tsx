
import React, { useMemo } from 'react';
import { 
  TrendingUp, DollarSign, AlertCircle, Clock, BarChart3, Wallet, Activity, Users, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Product, Transaction, Contact } from '../types';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
  suppliers: Contact[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, transactions, suppliers }) => {
  const lowStockProducts = products.filter(p => p.stock <= (p.minStock || 5));
  
  const totalSalesCup = useMemo(() => transactions.filter(t => t.status === 'Despachado').reduce((a, b) => a + (b.totalCup || 0), 0), [transactions]);
  const capitalInStock = useMemo(() => products.reduce((a, b) => a + (b.stock * b.costPrice), 0), [products]);

  const stats = [
    { label: 'Caja Total (CUP)', value: totalSalesCup.toLocaleString(), icon: Wallet, color: 'text-[#B48D51]', bg: 'bg-[#B48D51]/10' },
    { label: 'Capital Stock', value: capitalInStock.toLocaleString(), icon: DollarSign, color: 'text-[#2B1B17]', bg: 'bg-[#2B1B17]/10' },
    { label: 'Stock Alerta', value: lowStockProducts.length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Proveedores', value: suppliers.length, icon: Users, color: 'text-[#2B1B17]', bg: 'bg-gray-100' },
  ];

  const chartData = useMemo(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const data = days.map(d => ({ name: d, ventas: 0 }));
    transactions.filter(t=>t.status==='Despachado').forEach(t => {
      const dayIndex = new Date(t.date).getDay();
      data[dayIndex].ventas += (t.totalCup || 0);
    });
    return data;
  }, [transactions]);

  return (
    <div className="space-y-12 animate-in fade-in py-6 px-4">
      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 border-[6px] border-[#2B1B17] shadow-[10px_10px_0px_#EADBC8] hover:shadow-[15px_15px_0px_#B48D51] transition-all flex flex-col justify-between min-h-[180px]">
            <div className="flex justify-between items-start">
               <div className={`p-4 border-4 border-[#2B1B17] ${stat.bg} ${stat.color}`}>
                  <stat.icon size={28} />
               </div>
               <ArrowUpRight size={24} className="text-gray-200" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-[#2B1B17] tracking-tighter truncate">${stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Gráfico */}
          <div className="bg-white p-12 border-[8px] border-[#2B1B17] shadow-[20px_20px_0px_#2B1B17] overflow-hidden">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-16 gap-6">
              <h3 className="text-lg font-black text-[#2B1B17] uppercase tracking-[0.4em] flex items-center gap-6">
                <BarChart3 className="text-[#B48D51]" size={32} /> Reporte Semanal
              </h3>
              <div className="px-6 py-2 bg-[#FFF9F2] border-4 border-[#2B1B17] shadow-[6px_6px_0px_#B48D51]">
                <span className="text-[10px] font-black text-[#B48D51] uppercase tracking-widest">Actividad Reciente</span>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B48D51" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#B48D51" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#2B1B17'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#2B1B17'}} />
                  <Tooltip contentStyle={{ border: '6px solid #2B1B17', borderRadius: '0', textTransform: 'uppercase', fontSize: '12px', fontWeight: '900', background: '#FFF9F2' }} />
                  <Area type="monotone" dataKey="ventas" stroke="#B48D51" strokeWidth={8} fill="url(#colorVentas)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 border-[6px] border-[#2B1B17] shadow-xl">
              <h4 className="text-[11px] font-black uppercase text-[#B48D51] tracking-[0.4em] mb-10 flex items-center gap-4 border-b-4 border-[#FFF9F2] pb-4">
                <AlertCircle size={20} className="text-red-600"/> Stock Crítico
              </h4>
              <div className="space-y-4">
                {lowStockProducts.slice(0, 5).map(p => (
                  <div key={p.id} className="flex justify-between items-center p-4 bg-red-50 border-4 border-red-100 group hover:border-red-400 transition-colors">
                    <span className="text-xs font-black text-[#2B1B17] uppercase truncate pr-6">{p.name}</span>
                    <span className="text-xs font-black text-red-700 bg-white px-3 py-1 border-2 border-red-700 whitespace-nowrap">{p.stock} U.</span>
                  </div>
                ))}
                {lowStockProducts.length === 0 && <div className="py-20 text-center text-xs opacity-20 uppercase font-black tracking-widest">Todo en orden</div>}
              </div>
            </div>

            <div className="bg-[#2B1B17] p-10 text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform"></div>
               <h4 className="text-[11px] font-black uppercase text-[#B48D51] tracking-[0.4em] mb-10 flex items-center gap-4 border-b-4 border-white/5 pb-4">
                <ShieldCheck size={20} className="text-[#B48D51]"/> Liquidación Consignación
              </h4>
              <div className="space-y-6">
                 {suppliers.filter(s => s.pendingBalanceCup > 0).slice(0,3).map(s => (
                   <div key={s.id} className="p-4 bg-white/5 border-2 border-white/10 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black uppercase text-white/40 mb-1">Pendiente de Pago</p>
                        <p className="text-xl font-black text-[#B48D51] uppercase truncate w-32">{s.name}</p>
                      </div>
                      <p className="text-2xl font-black text-white tabular-nums">${s.pendingBalanceCup.toLocaleString()}</p>
                   </div>
                 ))}
                 {suppliers.filter(s => s.pendingBalanceCup > 0).length === 0 && <p className="text-xs opacity-30 text-center py-10 uppercase font-black">Sin deudas activas</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-[#B48D51] p-12 border-[8px] border-[#2B1B17] text-white shadow-[20px_20px_0px_#2B1B17] relative flex flex-col justify-between min-h-[500px] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.5em] mb-20 flex items-center gap-6 text-[#2B1B17]">
                 <Activity size={32} /> Monitor Activos
              </h3>
              <div className="space-y-16">
                <div>
                  <p className="text-[11px] text-[#2B1B17] font-black uppercase tracking-[0.3em] mb-4">Total Ventas (Ticket Prom.)</p>
                  <p className="text-7xl font-black tracking-tighter tabular-nums text-[#2B1B17]">${totalSalesCup.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#2B1B17] font-black uppercase tracking-[0.3em] mb-4">Inversión en Mercancía</p>
                  <p className="text-5xl font-black tracking-tighter tabular-nums text-white">${capitalInStock.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="mt-16 pt-10 border-t-4 border-[#2B1B17]/20 flex justify-between items-center">
               <div className="flex items-center gap-4 bg-[#2B1B17]/10 px-6 py-3 border-2 border-[#2B1B17]">
                 <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
                 <span className="text-[11px] font-black uppercase text-[#2B1B17]">Sincronización OK</span>
               </div>
               <ShieldCheck size={48} className="text-[#2B1B17] opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
