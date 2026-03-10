
import React, { useState } from 'react';
import { 
  Store, PlusCircle, ArrowRight, ShieldCheck, 
  Users, TrendingUp, Globe, Zap, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PlatformHomeProps {
  onRequestStore: () => void;
  onEnterStore: () => void;
}

const PlatformHome: React.FC<PlatformHomeProps> = ({ onRequestStore, onEnterStore }) => {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-7xl md:text-9xl font-black text-[#2B1B17] uppercase tracking-tighter leading-[0.85]">
                Tu Tienda <br />
                <span className="text-[#B48D51]">PaTí</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-lg leading-relaxed">
                La plataforma de alojamiento de tiendas online más potente y flexible. Crea tu negocio hoy mismo con sistema de afiliados integrado.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <button 
                onClick={onRequestStore}
                className="bg-[#2B1B17] text-white px-10 py-6 font-black text-sm uppercase tracking-widest shadow-[8px_8px_0px_#B48D51] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 group"
              >
                Solicitar Tienda <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
              <button 
                onClick={onEnterStore}
                className="bg-white text-[#2B1B17] border-4 border-[#2B1B17] px-10 py-6 font-black text-sm uppercase tracking-widest shadow-[8px_8px_0px_#EADBC8] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
              >
                Entrar a mi Tienda <ArrowRight size={20} />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white border-[12px] border-[#2B1B17] p-4 shadow-[20px_20px_0px_#B48D51]">
              <img 
                src="https://picsum.photos/seed/store/800/600" 
                alt="Store Preview" 
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -left-10 bg-[#B48D51] text-white p-8 border-4 border-[#2B1B17] shadow-xl rotate-6 hidden md:block">
                <p className="text-4xl font-black tracking-tighter uppercase">100%</p>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Personalizable</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: ShieldCheck, title: "Seguridad Total", desc: "Tus datos y transacciones protegidos con los más altos estándares." },
          { icon: Users, title: "Sistema de Afiliados", desc: "Potencia tus ventas con una red de afiliados gestionada automáticamente." },
          { icon: TrendingUp, title: "Escalabilidad", desc: "Desde pequeñas boutiques hasta grandes almacenes con miles de productos." }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
            className="bg-white border-4 border-[#2B1B17] p-10 shadow-[8px_8px_0px_#EADBC8] hover:shadow-[12px_12px_0px_#B48D51] transition-all group"
          >
            <div className="w-16 h-16 bg-[#FFF9F2] border-2 border-[#2B1B17] flex items-center justify-center mb-8 group-hover:bg-[#B48D51] group-hover:text-white transition-colors">
              <feature.icon size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{feature.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="bg-[#2B1B17] p-16 border-l-[16px] border-[#B48D51] text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: "Tiendas Activas", value: "50+" },
            { label: "Ventas Totales", value: "$2M+" },
            { label: "Afiliados", value: "1.2K" },
            { label: "Países", value: "12" }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-5xl font-black tracking-tighter text-[#B48D51]">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 bg-white border-4 border-[#2B1B17] shadow-[12px_12px_0px_#B48D51] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Globe size={200} />
        </div>
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 relative z-10">
          ¿Listo para empezar?
        </h2>
        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto relative z-10">
          Únete a la red de comercio más innovadora. Solicita tu tienda hoy y comienza a vender en minutos.
        </p>
        <button 
          onClick={onRequestStore}
          className="bg-[#B48D51] text-white px-12 py-6 font-black text-sm uppercase tracking-widest shadow-[8px_8px_0px_#2B1B17] hover:translate-y-1 hover:shadow-none transition-all inline-flex items-center gap-3 relative z-10"
        >
          Crear mi Tienda Ahora <Zap size={20} />
        </button>
      </section>
    </div>
  );
};

export default PlatformHome;
