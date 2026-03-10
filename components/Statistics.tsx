
import React, { useMemo } from 'react';
import { 
  TrendingUp, Package, DollarSign, Wallet, Activity, Clock, Truck, ShieldCheck, Target, Percent, Download, History, BarChart3
} from 'lucide-react';
import { Product, Transaction, Contact } from '../types';

interface StatisticsProps {
  products: Product[];
  transactions: Transaction[];
  contacts: Contact[];
}

const Statistics: React.FC<StatisticsProps> = ({ products, transactions, contacts }) => {
  const despachadas = transactions.filter(t => t.status === 'Despachado');
  const totalSalesCup = useMemo(() => despachadas.reduce((acc, t) => acc + (t.totalCup || 0), 0), [despachadas]);
  
  const totalUnitsSold = useMemo(() => {
    return despachadas.reduce((acc, t) => acc + t.items.reduce((s, i) => s + (i.unitQuantity || 0), 0), 0);
  }, [despachadas]);

  const inventoryValue = useMemo(() => products.reduce((a, b) => a + ((b.stock || 0) * (b.costPrice || 0)), 0), [products]);

  return (
    <div className="space-y-10 animate-in fade-in pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 border-4 border-[#2B1B17] shadow-[8px_8px_0px_#EADBC8]">
           <div className="w-12 h-12 bg-[#FFF9F2] text-[#B48D51] border-2 border-[#2B1B17] flex items-center justify-center mb-6"><TrendingUp size={24}/></div>
           <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Caja Histórica (CUP)</p>
           <p className="text-3xl font-black text-[#2B1B17] tracking-tighter">${(totalSalesCup || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 border-4 border-[#2B1B17] shadow-[8px_8px_0px_#EADBC8]">
           <div className="w-12 h-12 bg-[#2B1B17] text-white border-2 border-[#2B1B17] flex items-center justify-center mb-6"><Package size={24}/></div>
           <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Unidades Vendidas</p>
           <p className="text-3xl font-black text-[#2B1B17] tracking-tighter">{(totalUnitsSold || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 border-4 border-[#2B1B17] shadow-[8px_8px_0px_#EADBC8]">
           <div className="w-12 h-12 bg-[#FFF9F2] text-[#B48D51] border-2 border-[#2B1B17] flex items-center justify-center mb-6"><BarChart3 size={24}/></div>
           <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Valor Inventario</p>
           <p className="text-3xl font-black text-[#2B1B17] tracking-tighter">${(inventoryValue || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 border-4 border-[#2B1B17] shadow-[8px_8px_0px_#EADBC8]">
           <div className="w-12 h-12 bg-[#B48D51] text-white border-2 border-[#2B1B17] flex items-center justify-center mb-6"><Target size={24}/></div>
           <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Productos Catálogo</p>
           <p className="text-3xl font-black text-[#2B1B17] tracking-tighter">{(products.length || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-white p-10 border-4 border-[#2B1B17] shadow-[12px_12px_0px_#EADBC8]">
            <h3 className="text-lg font-black text-[#2B1B17] uppercase mb-8 flex items-center gap-4 border-b-4 border-[#FFF9F2] pb-6 tracking-tighter">
              <Activity size={24} className="text-[#B48D51]"/> Top Productos Vendidos
            </h3>
            <div className="space-y-6">
               {products.map(p => {
                 const sold = despachadas.reduce((acc, t) => acc + t.items.filter(i => i.productId === p.id).reduce((s, i) => s + (i.unitQuantity || 0), 0), 0);
                 if (sold === 0) return null;
                 return (
                   <div key={p.id} className="flex justify-between items-center p-4 bg-[#FFF9F2] border-2 border-[#2B1B17] group hover:bg-[#B48D51] hover:text-white transition-all">
                      <span className="font-black uppercase text-xs">{p.name}</span>
                      <span className="font-black text-sm">{(sold || 0).toLocaleString()} <span className="text-[10px] opacity-60">U.</span></span>
                   </div>
                 );
               })}
               {totalUnitsSold === 0 && <div className="py-20 text-center text-[10px] opacity-20 uppercase font-black tracking-[0.5em]">Sin datos de ventas</div>}
            </div>
         </div>
         
         <div className="bg-[#2B1B17] p-10 border-l-[16px] border-[#B48D51] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><ShieldCheck size={160} /></div>
            <h3 className="text-lg font-black uppercase tracking-tighter mb-10 text-[#B48D51] border-b-4 border-white/5 pb-6">Liquidación de Proveedores</h3>
            <div className="space-y-6 relative z-10">
              {contacts.filter(c => c.type === 'Proveedor').map(prov => (
                <div key={prov.id} className="p-6 bg-white/5 border-2 border-white/10 flex justify-between items-center hover:bg-white/10 transition-all">
                   <div>
                      <p className="text-lg font-black uppercase tracking-tighter">{prov.name}</p>
                      <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Pendiente de Liquidar</p>
                   </div>
                   <p className="text-3xl font-black text-[#B48D51] tracking-tighter">${(prov.pendingBalanceCup || 0).toLocaleString()}</p>
                </div>
              ))}
              {contacts.filter(c => c.type === 'Proveedor').length === 0 && <div className="text-[10px] opacity-20 text-center py-20 uppercase font-black tracking-[0.5em]">No hay proveedores registrados</div>}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Statistics;
