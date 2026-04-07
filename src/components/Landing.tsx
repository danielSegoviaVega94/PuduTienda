import { motion, useScroll, useVelocity, useTransform, useSpring } from 'motion/react';
import { ShoppingCart, Package, RefreshCw, MessageCircle, Home, Star, Heart } from 'lucide-react';
import { BOX_TEMPLATES } from '../data';
import { BoxTemplate } from '../types';

interface LandingProps {
  onSelectBox: (box: BoxTemplate) => void;
}

export default function Landing({ onSelectBox }: LandingProps) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const rotate = useTransform(smoothVelocity, [-1000, 0, 1000], [-25, 0, 25]);

  return (
    <div className="min-h-screen bg-pudu-yellow">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-pudu-yellow/90 backdrop-blur-md border-b border-pudu-yellow-dark/30 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.span 
            style={{ rotate }} 
            className="text-2xl inline-block origin-bottom"
          >
            🦌
          </motion.span>
          <span className="font-display font-bold text-pudu-earth text-lg tracking-tight">La Caja del Pudú</span>
        </div>
        <button className="p-2 bg-white rounded-full shadow-sm text-pudu-green-dark relative hover:bg-pudu-green/10 transition-colors">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-400 rounded-full border-2 border-white"></span>
        </button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="px-4 pt-8 pb-12 text-center max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 relative inline-block"
          >
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" 
              alt="Caja de verduras frescas" 
              className="w-full h-64 object-cover rounded-3xl shadow-xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-lg transform rotate-6 border-2 border-pudu-yellow">
              <span className="text-3xl">🦌🌿</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-block bg-pudu-green/10 text-pudu-green-dark px-4 py-1.5 rounded-full font-medium text-sm mb-4 border border-pudu-green/20"
          >
            ¡De La Serena y Coquimbo con amor!
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-display font-bold text-pudu-earth leading-tight mb-4"
          >
            ¡Hola! Soy el Pudú. Te traigo el campo a tu mesa, armadito a tu pinta.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-pudu-earth-light text-lg mb-8"
          >
            Recolecto las mejores frutas y verduras de nuestros agricultores locales para llevarlas a tu puerta. Elige una de mis cajitas y cámbiale lo que quieras. ¡Como si fueras tú mismo a la feria!
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-pudu-green hover:bg-pudu-green-dark text-white text-lg font-medium py-4 px-8 rounded-full shadow-lg shadow-pudu-green/30 transition-transform active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2 mx-auto"
          >
            <Heart className="w-5 h-5" />
            Armar mi cajita
          </motion.button>
        </section>

        {/* How it works */}
        <section className="bg-white py-12 px-4 rounded-t-[40px] shadow-sm">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-center text-pudu-earth mb-8">Mis 4 pasitos para llevarte el campo a casa 🐾</h2>
            
            <div className="space-y-6">
              {[
                { icon: Package, title: 'Elige tu cajita base', desc: 'Tengo tamaños para todos: Individual, Familiar, Abundante o Premium.' },
                { icon: RefreshCw, title: '¡Ponle tu toque!', desc: '¿No te gusta el brócoli? ¡Cámbialo por más paltas! Ajusta todo a tu gusto.' },
                { icon: MessageCircle, title: 'Me avisas por WhatsApp', desc: 'Revisa tu pedido y escríbeme directo para coordinar el pago y la entrega.' },
                { icon: Home, title: 'Espérame en casita', desc: 'Relájate. Yo me encargo de llevarte todo fresquito a tu puerta.' },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="bg-pudu-yellow w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-pudu-earth-light border border-pudu-yellow-dark">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-pudu-earth">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Catalog */}
        <section id="catalog" className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-pudu-earth mb-2 px-2">Mis Cajitas Sugeridas 📦</h2>
            <p className="text-pudu-earth-light mb-6 px-2">Recuerda: son solo una idea. ¡Puedes cambiarles lo que quieras!</p>
            
            <div className="flex overflow-x-auto gap-4 pb-8 -mx-4 px-4 snap-x">
              {BOX_TEMPLATES.map((box) => (
                <div key={box.id} className="min-w-[280px] sm:min-w-[320px] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 snap-center flex flex-col">
                  <img src={box.imageUrl} alt={box.name} className="w-full h-48 object-cover" />
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-display font-bold text-pudu-earth mb-1">{box.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{box.description}</p>
                    <p className="text-2xl font-bold text-pudu-green-dark mb-6 mt-auto">
                      {box.basePrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                    </p>
                    <button 
                      onClick={() => onSelectBox(box)}
                      className="w-full bg-pudu-yellow hover:bg-pudu-yellow-dark text-pudu-earth font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Elegir y personalizar</span>
                      <span className="text-xl">✨</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-display font-bold text-pudu-earth mb-8">Amigos con la guatita llena 🥰</h2>
            
            <div className="bg-pudu-yellow/50 p-6 rounded-3xl relative border border-pudu-yellow-dark/30">
              <div className="flex justify-center gap-1 mb-4 text-pudu-green-dark">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-lg text-pudu-earth-light italic mb-4">
                "Me encanta que puedo cambiar los tomates por más paltas porque en casa somos adictos. ¡El Pudú siempre llega con todo fresquito a Coquimbo!"
              </p>
              <p className="font-medium text-pudu-earth">— Camila V.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-pudu-earth text-pudu-yellow py-12 px-4 text-center rounded-t-[40px]">
        <div className="max-w-2xl mx-auto">
          <span className="text-5xl mb-4 block">🦌</span>
          <h3 className="font-display font-bold text-2xl mb-2">La Caja del Pudú</h3>
          <p className="text-pudu-yellow/80 mb-8 max-w-sm mx-auto">Llevando amor, frescura y el trabajo de nuestros agricultores a las familias de la Cuarta Región.</p>
          
          <div className="flex flex-col gap-4 mb-8">
            <a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a>
            <a href="#" className="hover:text-white transition-colors">Zonas de Despacho</a>
            <a href="#" className="hover:text-white transition-colors">Hablemos</a>
          </div>
          
          <button className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 mx-auto">
            <MessageCircle className="w-5 h-5" />
            Escríbeme por WhatsApp
          </button>
        </div>
      </footer>
    </div>
  );
}

