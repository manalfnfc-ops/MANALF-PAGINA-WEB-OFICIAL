import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FallingPattern } from '@/components/ui/falling-pattern';

export default function App() {
  const [step, setStep] = useState<'overlay' | 'video' | 'content'>('overlay');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Precarga el video en background
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.addEventListener('canplaythrough', () => setVideoLoaded(true), { once: true });
    // Fallback: activar después de 3s
    const timer = setTimeout(() => setVideoLoaded(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = useCallback(() => {
    setStep('video');

    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Si autoplay falla, ir directo al contenido
        setStep('content');
      });
    }
  }, []);

  const handleVideoEnded = useCallback(() => {
    setStep('content');
  }, []);

  // Fallback: si el video se congela, mostrar contenido después de 6.5s
  useEffect(() => {
    if (step !== 'video') return;
    const timer = setTimeout(() => {
      setStep((current) => (current === 'video' ? 'content' : current));
    }, 6500);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* ===== VIDEO DE FONDO ===== */}
      <video
        ref={videoRef}
        preload="auto"
        muted
        playsInline
        disablePictureInPicture
        onEnded={handleVideoEnded}
        className="fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
        style={{ opacity: step === 'video' ? 1 : 0 }}
      >
        <source src="./video/intro.webm" type="video/webm" />
        <source src="./video/intro.mp4" type="video/mp4" />
      </video>

      {/* ===== IMAGEN ESTATICA (frame final) ===== */}
      <img
        src="./images/final-frame.jpg"
        alt=""
        className="fixed inset-0 w-full h-full object-cover z-[1] transition-opacity duration-1000"
        style={{ opacity: step === 'content' ? 1 : 0 }}
      />

      {/* ===== OVERLAY INICIAL CON FALLING PATTERN ===== */}
      <AnimatePresence>
        {step === 'overlay' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Falling Pattern como fondo */}
            <div className="absolute inset-0">
              <FallingPattern
                color="rgba(0, 180, 255, 0.4)"
                backgroundColor="#000000"
                duration={40}
                blurIntensity="1.2em"
                density={1.5}
                className="[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]"
              />
            </div>

            {/* Capa de oscurecimiento extra para legibilidad */}
            <div className="absolute inset-0 bg-black/40 z-[2]" />

            {/* Botón de cristal */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              onClick={handleEnter}
              disabled={!videoLoaded}
              className="relative z-10 px-14 py-5 rounded-full border border-white/20 bg-white/[0.06] text-white text-base font-medium tracking-wide backdrop-blur-xl cursor-pointer transition-all duration-400 hover:bg-white/[0.14] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,180,255,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] hover:border-white/35 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                boxShadow: '0 0 30px rgba(0,180,255,0.06), 0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              <span className="relative z-10">Te estabamos esperando... adelante</span>

              {/* Loader cuando el video aun carga */}
              {!videoLoaded && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm z-20">
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                </span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: step === 'content' ? 1 : 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="relative z-10"
        style={{ pointerEvents: step === 'content' ? 'auto' : 'none' }}
      >
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-black/20 to-black/55">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: step === 'content' ? 1 : 0, y: step === 'content' ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-6xl md:text-7xl font-extrabold tracking-tight mb-5"
            style={{
              background: 'linear-gradient(135deg, #fff 30%, #7ec8ff 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 4px 20px rgba(0,150,255,0.15)',
            }}
          >
            MANALF
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: step === 'content' ? 1 : 0, y: step === 'content' ? 0 : 20 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed mb-8"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            Soluciones tecnologicas innovadoras para transformar tu negocio.
            Impulsamos la transformacion digital con tecnologia de vanguardia.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: step === 'content' ? 1 : 0, y: step === 'content' ? 0 : 20 }}
            transition={{ duration: 1, delay: 0.9 }}
            href="#productos"
            className="inline-flex items-center gap-2 px-9 py-3.5 rounded-full bg-[rgba(0,150,255,0.12)] border border-[rgba(0,180,255,0.25)] text-[#7ec8ff] font-medium transition-all duration-350 hover:bg-[rgba(0,150,255,0.28)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,150,255,0.18)] backdrop-blur-lg"
          >
            Explorar soluciones &rarr;
          </motion.a>
        </section>

        {/* Productos */}
        <section id="productos" className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            Sistemas Desarrollados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <ProductCard step={step} delay={0.1} icon="🔧" title="Sistema ERP" desc="Gestion integral de recursos empresariales con modulos personalizables para tu industria" />
            <ProductCard step={step} delay={0.2} icon="📊" title="Analytics Dashboard" desc="Visualizacion de datos en tiempo real con reportes avanzados y analisis predictivo" />
            <ProductCard step={step} delay={0.3} icon="🔐" title="Security Suite" desc="Proteccion completa con cifrado empresarial y gestion de accesos centralizada" />
          </div>
        </section>

        {/* Servicios */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            Nuestros Servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceItem step={step} delay={0.1} title="Consultoria" desc="Asesoramiento estrategico en transformacion digital y optimizacion de procesos" />
            <ServiceItem step={step} delay={0.15} title="Desarrollo Personalizado" desc="Soluciones a medida disenadas especificamente para tus necesidades operativas" />
            <ServiceItem step={step} delay={0.2} title="Implementacion" desc="Despliegue e integracion completa con tus sistemas existentes sin interrupciones" />
            <ServiceItem step={step} delay={0.25} title="Soporte 24/7" desc="Asistencia tecnica continua con garantia de respuesta inmediata" />
            <ServiceItem step={step} delay={0.3} title="Capacitacion" desc="Programas de formacion integral para tu equipo con certificaciones incluidas" />
            <ServiceItem step={step} delay={0.35} title="Mantenimiento" desc="Actualizaciones periodicas y optimizacion constante de tu infraestructura" />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-16 px-6 text-white/35 text-sm border-t border-white/[0.04]">
          <p>&copy; 2024 MANALF. Todos los derechos reservados.</p>
        </footer>
      </motion.div>
    </div>
  );
}

/* ===== SUB-COMPONENTES ===== */

function ProductCard({ step, delay, icon, title, desc }: { step: string; delay: number; icon: string; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: step === 'content' ? 1 : 0, y: step === 'content' ? 0 : 30 }}
      transition={{ duration: 0.7, delay: 0.6 + delay }}
      className="group relative bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-10 text-center cursor-pointer transition-all duration-500 hover:bg-white/[0.08] hover:border-[rgba(0,180,255,0.2)] hover:-translate-y-2.5 hover:shadow-[0_25px_50px_rgba(0,100,200,0.1)] hover:scale-[1.02]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,150,255,0.06)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      <div className="text-5xl mb-5 relative z-10">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 relative z-10">{title}</h3>
      <p className="text-white/65 text-sm leading-relaxed mb-6 relative z-10">{desc}</p>
      <a
        href="#"
        className="relative z-10 inline-block px-7 py-3 rounded-full bg-[rgba(0,150,255,0.1)] border border-[rgba(0,180,255,0.15)] text-[#7ec8ff] text-sm font-medium transition-all duration-350 hover:bg-[rgba(0,150,255,0.22)] hover:scale-105 hover:shadow-[0_4px_20px_rgba(0,150,255,0.12)]"
      >
        Conocer mas &rarr;
      </a>
    </motion.div>
  );
}

function ServiceItem({ step, delay, title, desc }: { step: string; delay: number; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: step === 'content' ? 1 : 0, y: step === 'content' ? 0 : 20 }}
      transition={{ duration: 0.6, delay: 0.8 + delay }}
      className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 transition-all duration-400 hover:bg-white/[0.07] hover:border-[rgba(0,180,255,0.15)] hover:translate-x-1.5 hover:shadow-[0_10px_30px_rgba(0,100,200,0.06)]"
    >
      <h3 className="text-lg font-semibold mb-3 text-white/95">{title}</h3>
      <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
