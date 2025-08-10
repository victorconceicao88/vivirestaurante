import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const OpeningHoursControl = ({ children }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState({
    isOpen: false,
    nextOpening: null,
    currentPhase: 'closed',
    message: '',
    nextChangeIn: 0,
    deliveryAvailable: false,
    platformAvailable: false,
    nextOpeningText: ''
  });

  // Links para delivery externo
  const deliveryLinks = {
    uber: 'https://www.ubereats.com/pt/store/cozinha-da-vivi/1ecH28yjXgSgpSGCtKlKoA?diningMode=DELIVERY&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMlBvcnRpbSVDMyVBM28lMjIlMkMlMjJyZWZlcmVuY2UlMjIlM0ElMjJDaElKOFY1YlBiWW9HdzBSVlNLMDNJLWs5YnclMjIlMkMlMjJyZWZlcmVuY2VUeXBlJTIyJTNBJTIyZ29vZ2xlX3BsYWNlcyUyMiUyQyUyMmxhdGl0dWRlJTIyJTNBMzcuMTM3Nzc5OSUyQyUyMmxvbmdpdHVkZSUyMiUzQS04LjU2NTE5NTg5OTk5OTk5OSU3RA%3D%3D',
    glovo: 'https://glovoapp.com/pt/pt/portimao/cozinha-da-vivi-pot/',
    bolt:'https://food.bolt.eu/en-US/438/p/145891-cozinha-da-vivi?utm_source=share_provider&utm_medium=product&utm_content=menu_header'
  };

  // Definição dos horários de funcionamento
  const getSchedule = () => {
    const today = new Date();
    const isSunday = today.getDay() === 0; // 0 é domingo
    
    if (isSunday) {
      return [
        { 
          phase: 'open', 
          open: { hour: 11, minute: 30 }, 
          close: { hour: 15, minute: 0 }, // Fecha às 15:00 no domingo
          deliveryStarts: { hour: 12, minute: 0 },
          message: 'Plataforma aberta - pedidos disponíveis até 15:00',
          platformAvailable: true
        }
      ];
    }
    
    // Horário normal para outros dias
    return [
      { 
        phase: 'open', 
        open: { hour: 11, minute: 30 }, 
        close: { hour: 17, minute: 45 },
        deliveryStarts: { hour: 12, minute: 0 },
        message: 'Plataforma aberta - pedidos disponíveis até 17:45',
        platformAvailable: true
      }
    ];
  };

  // Calcula o tempo até o próximo evento
  const calculateTimeToEvent = (targetHour, targetMinute) => {
    const now = new Date();
    const targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      targetHour,
      targetMinute,
      0
    );
    
    if (targetTime < now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    return Math.floor((targetTime - now) / 1000);
  };

  // Nova função para determinar o texto do próximo horário de abertura
  const getNextOpeningText = (currentTime, openHour, openMinute, closeHour, closeMinute) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    const openTimeInMinutes = openHour * 60 + openMinute;
    const closeTimeInMinutes = closeHour * 60 + closeMinute;
    const isSunday = now.getDay() === 0;

    // Se ainda não abriu hoje
    if (currentTimeInMinutes < openTimeInMinutes) {
      return { text: `hoje às ${openHour}:${openMinute.toString().padStart(2, '0')}`, isToday: true };
    }
    // Se já fechou hoje
    else if (currentTimeInMinutes >= closeTimeInMinutes) {
      if (isSunday) {
        // Se for domingo, o próximo dia de abertura é terça-feira
        const nextOpening = new Date(now);
        nextOpening.setDate(nextOpening.getDate() + (2 - nextOpening.getDay() + 7) % 7 || 7);
        const dayName = nextOpening.toLocaleDateString('pt-PT', { weekday: 'long' });
        return { text: `${dayName} às ${openHour}:${openMinute.toString().padStart(2, '0')}`, isToday: false };
      } else {
        return { text: `amanhã às ${openHour}:${openMinute.toString().padStart(2, '0')}`, isToday: false };
      }
    }
    // Se estiver aberto agora (não deveria chegar aqui, mas por segurança)
    else {
      return { text: `hoje às ${openHour}:${openMinute.toString().padStart(2, '0')}`, isToday: true };
    }
  };

  // Encontra o próximo horário de abertura com o texto correto
  const getNextOpening = () => {
    const now = new Date();
    const schedule = getSchedule();
    const { hour: openHour, minute: openMinute } = schedule[0].open;
    const { hour: closeHour, minute: closeMinute } = schedule[0].close;
    
    const { text: openingText, isToday } = getNextOpeningText(
      now, 
      openHour, 
      openMinute, 
      closeHour, 
      closeMinute
    );

    return {
      time: calculateTimeToEvent(openHour, openMinute),
      phase: 'open',
      message: isToday ? `Hoje abrimos às ${openHour}:${openMinute.toString().padStart(2, '0')}` : 
                         `Próxima abertura: ${openingText}`,
      deliveryStarts: { hour: 12, minute: 0 },
      platformAvailable: true,
      openingText: openingText
    };
  };

  const checkStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    const schedule = getSchedule();

    let isCurrentlyOpen = false;
    let currentPhase = 'closed';
    let message = '';
    let deliveryAvailable = false;
    let platformAvailable = false;

    for (const period of schedule) {
      const openTime = period.open.hour * 60 + period.open.minute;
      const closeTime = period.close.hour * 60 + period.close.minute;
      const deliveryTime = period.deliveryStarts.hour * 60 + period.deliveryStarts.minute;

      if (currentTime >= openTime && currentTime < closeTime) {
        isCurrentlyOpen = true;
        currentPhase = period.phase;
        platformAvailable = period.platformAvailable;
        
        if (currentTime >= deliveryTime) {
          deliveryAvailable = true;
          message = period.message;
        } else {
          message = `Plataforma aberta - entregas a partir das ${period.deliveryStarts.hour}:${period.deliveryStarts.minute.toString().padStart(2, '0')}`;
        }
        break;
      }
    }

    const nextOpening = getNextOpening();

    setStatus({
      isOpen: isCurrentlyOpen,
      nextOpening: nextOpening,
      currentPhase,
      message,
      nextChangeIn: isCurrentlyOpen 
        ? calculateTimeToEvent(
            schedule.find(p => p.phase === currentPhase).close.hour,
            schedule.find(p => p.phase === currentPhase).close.minute
          )
        : nextOpening.time,
      deliveryAvailable,
      platformAvailable,
      nextOpeningText: nextOpening.openingText
    });
  };

  useEffect(() => {
    checkStatus();
    
    const statusInterval = setInterval(() => {
      checkStatus();
    }, 60000);
    
    const countdownInterval = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        nextChangeIn: prev.nextChangeIn > 0 ? prev.nextChangeIn - 1 : 0
      }));
    }, 1000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const AnalogClock = ({ size = 40 }) => {
    const time = new Date();
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours() % 12;
    
    const secondsAngle = useMotionValue(seconds * 6);
    const minutesAngle = useMotionValue(minutes * 6);
    const hoursAngle = useMotionValue(hours * 30 + minutes * 0.5);
    
    useEffect(() => {
      secondsAngle.set(seconds * 6);
      minutesAngle.set(minutes * 6);
      hoursAngle.set(hours * 30 + minutes * 0.5);
    }, [seconds, minutes, hours, secondsAngle, minutesAngle, hoursAngle]);
    
    const secondsHandX = useTransform(secondsAngle, angle => {
      return 50 + 40 * Math.sin(angle * (Math.PI / 180));
    });
    const secondsHandY = useTransform(secondsAngle, angle => {
      return 50 - 40 * Math.cos(angle * (Math.PI / 180));
    });
    
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto">
        <circle cx="50" cy="50" r="48" fill="none" stroke="#FFB501" strokeWidth="2" strokeOpacity="0.2" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="10"
            x2="50"
            y2="15"
            stroke="#FFB501"
            strokeWidth="2"
            strokeOpacity="0.6"
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}
        <motion.line
          x1="50"
          y1="50"
          x2={hoursAngle => 50 + 25 * Math.sin(hoursAngle * (Math.PI / 180))}
          y2={hoursAngle => 50 - 25 * Math.cos(hoursAngle * (Math.PI / 180))}
          stroke="#FFB501"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <motion.line
          x1="50"
          y1="50"
          x2={minutesAngle => 50 + 35 * Math.sin(minutesAngle * (Math.PI / 180))}
          y2={minutesAngle => 50 - 35 * Math.cos(minutesAngle * (Math.PI / 180))}
          stroke="#FFB501"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <motion.line
          x1="50"
          y1="50"
          x2={secondsHandX}
          y2={secondsHandY}
          stroke="#FF6B00"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="3" fill="#FF6B00" />
      </svg>
    );
  };

  const isSunday = new Date().getDay() === 0;

  if (!status.isOpen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#3D1106]/10 to-[#5A1B0D]/30 flex items-center justify-center p-4 z-[1000] overflow-y-auto backdrop-blur-sm">
        {/* Viewport mobile-specific adjustments */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* Mobile-specific touch optimizations */}
        <style jsx global>{`
          @media (max-width: 640px) {
            /* Prevent text size adjustment on orientation change */
            html {
              -webkit-text-size-adjust: 100%;
              text-size-adjust: 100%;
            }
            /* Tap highlight color */
            a, button {
              -webkit-tap-highlight-color: transparent;
            }
          }
          
          /* iPhone notch/padding adjustments */
          @supports (padding: max(0px)) {
            .safe-area-padding {
              padding-left: max(12px, env(safe-area-inset-left));
              padding-right: max(12px, env(safe-area-inset-right));
              padding-bottom: max(12px, env(safe-area-inset-bottom));
            }
          }
        `}</style>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="w-full max-w-sm mx-auto bg-gradient-to-br from-[#3D1106] to-[#5A1B0D] p-4 rounded-2xl shadow-2xl text-center text-white relative overflow-hidden border border-[#FFB501]/20 safe-area-padding"
          style={{
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            backgroundImage: 'radial-gradient(at top right, #5A1B0D, transparent 60%), linear-gradient(to bottom, #3D1106, #5A1B0D)',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Efeitos de partículas (reduzidos em mobile) */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#FFB501]/10"
                initial={{
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  opacity: Math.random() * 0.2 + 0.1
                }}
                animate={{
                  y: [null, (Math.random() - 0.5) * 10],
                  x: [null, (Math.random() - 0.5) * 10],
                  transition: {
                    duration: Math.random() * 8 + 8,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }
                }}
              />
            ))}
          </div>
          
          {/* Elementos decorativos (otimizados para mobile) */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B00] via-[#FFB501] to-[#FF6B00]"></div>
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#FFB501]/10 filter blur-md"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-[#FFB501]/5 filter blur-md"></div>
          
          <div className="relative z-10">
            <div className="mb-3 flex flex-col items-center">
              <motion.div 
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.03, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 20, 
                  ease: "linear",
                  scale: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }
                }}
                className="bg-gradient-to-br from-[#FFB501] to-[#FF6B00] p-1 rounded-full mb-2 shadow-lg"
                style={{
                  boxShadow: '0 0 8px rgba(255, 181, 1, 0.5)'
                }}
              >
                <AnalogClock size={36} />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#FFB501] to-[#FF6B00] px-2"
              >
                Plataforma Fechada
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-gray-300 mb-2 px-2"
              >
                Fora do horário de funcionamento da plataforma própria
              </motion.p>
            </div>
            
            {/* Contador de tempo - otimizado para mobile */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-[#FFB501]/20 mb-3 relative overflow-hidden mx-1"
              style={{
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFB501]/5 to-transparent opacity-20"></div>
              <div className="relative z-10">
                <div className="flex flex-col items-center gap-1">
                  <div className="text-center">
                    <p className="text-[#FFB501] text-xs font-semibold mb-1">
                      Próximo horário de funcionamento:
                    </p>
                    <p className="text-white text-xs font-medium leading-tight">
                      {status.nextOpeningText} (funcionamento normal até {isSunday ? '15:00' : '17:45'})
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#FFB501]/10 to-[#FF6B00]/10 p-2 rounded-lg border border-[#FFB501]/30 backdrop-blur-sm w-full max-w-[140px] mt-1">
                    <p className="text-[#FFB501] text-[10px] mb-1">Tempo restante:</p>
                    <div className="text-lg font-mono font-bold text-white tracking-tighter">
                      {formatTime(status.nextChangeIn)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Seção de Delivery Externo - Só mostra se não for domingo */}
            {!isSunday && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-3 mx-1"
              >
                <h3 className="text-[#FFB501] font-bold text-sm mb-2 text-center px-1">
                  Pedidos Noturnos pelos Parceiros
                </h3>
                
                <div className="mb-2 bg-black/20 p-2 rounded-lg border border-[#FFB501]/30">
                  <p className="text-white text-xs text-center">
                    Durante o período noturno, você pode fazer pedidos exclusivamente pelos nossos parceiros oficiais:
                  </p>
                </div>
                
                <div className="space-y-2">
                  {/* Card Glovo - Mobile optimized */}
                  <motion.a
                    href={deliveryLinks.glovo}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="block bg-gradient-to-r from-[#FF6B00] to-[#FF8C33] rounded-lg overflow-hidden border border-[#FF8C33] group transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6B00]/30 active:scale-95"
                    style={{
                      touchAction: 'manipulation'
                    }}
                  >
                    <div className="flex items-center p-2">
                      <div className="flex-shrink-0 mr-2">
                        <div className="bg-white p-1 rounded-md flex items-center justify-center w-10 h-10">
                          <img 
                            src="/images/glovo.jpg" 
                            alt="Glovo Logo"
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="text-white font-bold text-xs mb-0.5 truncate">Glovo</h4>
                        <p className="text-white/90 text-[10px] mb-1 truncate">Clique para fazer seu pedido</p>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-[#FF6B00] to-[#FFB501]"></div>
                  </motion.a>

                  {/* Card Bolt Food - Mobile optimized */}
                  <motion.a
                    href={deliveryLinks.bolt}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="block bg-gradient-to-r from-[#06C167] to-[#3AAE2A] rounded-lg overflow-hidden border border-green-600 group transition-all duration-300 hover:shadow-lg hover:shadow-[#06C167]/30 active:scale-95"
                    style={{
                      touchAction: 'manipulation'
                    }}
                  >
                    <div className="flex items-center p-2">
                      <div className="flex-shrink-0 mr-2">
                        <div className="bg-white p-1 rounded-md flex items-center justify-center w-10 h-10">
                          <img 
                            src="/images/boltfood.jpg" 
                            alt="Bolt Food Logo"
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="text-white font-bold text-xs mb-0.5 truncate">Bolt Food</h4>
                        <p className="text-white/90 text-[10px] mb-1 truncate">Clique para fazer seu pedido</p>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <svg className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                    <div className="h-1 bg-white/20"></div>
                  </motion.a>
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-3 text-center"
                >
                  <div className="inline-flex items-center bg-black/20 px-2 py-1 rounded-full border border-[#FFB501]/30 text-center mx-auto max-w-xs">
                    <svg className="w-3 h-3 mr-1 text-[#FFB501]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] text-gray-300 leading-tight">
                      Plataforma própria reabre {status.nextOpeningText}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {/* Horário de Funcionamento - Mobile optimized */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-[#FFB501]/5 to-[#FF6B00]/5 p-2 rounded-lg border border-[#FFB501]/20 backdrop-blur-sm relative overflow-hidden group mx-1"
            >
              <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-[#FFB501]/10 group-hover:opacity-50 transition-opacity duration-300"></div>
              <h3 className="text-[#FFB501] font-bold text-xs mb-1 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                HORÁRIO DE FUNCIONAMENTO
              </h3>
              <ul className="space-y-1 text-[10px] text-gray-300">
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB501] mr-1"></span>
                    Plataforma própria:
                  </span>
                  <span className="font-medium text-white">{isSunday ? '11:30 - 15:00' : '11:30 - 17:45'}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB501] mr-1"></span>
                    Entregas a partir:
                  </span>
                  <span className="font-medium text-white">12:00</span>
                </li>
                {!isSunday && (
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFB501] mr-1"></span>
                      Pedidos noturnos:
                    </span>
                    <span className="font-medium text-white">Apenas por parceiros</span>
                  </li>
                )}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OpeningHoursControl;