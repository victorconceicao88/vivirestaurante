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
    deliveryAvailable: false
  });

  // Links para delivery externo
  const deliveryLinks = {
    uber: 'https://www.ubereats.com/pt/store/cozinha-da-vivi/1ecH28yjXgSgpSGCtKlKoA?diningMode=DELIVERY&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMlBvcnRpbSVDMyVBM28lMjIlMkMlMjJyZWZlcmVuY2UlMjIlM0ElMjJDaElKOFY1YlBiWW9HdzBSVlNLMDNJLWs5YnclMjIlMkMlMjJyZWZlcmVuY2VUeXBlJTIyJTNBJTIyZ29vZ2xlX3BsYWNlcyUyMiUyQyUyMmxhdGl0dWRlJTIyJTNBMzcuMTM3Nzc5OSUyQyUyMmxvbmdpdHVkZSUyMiUzQS04LjU2NTE5NTg5OTk5OTk5OSU3RA%3D%3D',
    glovo: 'https://glovoapp.com/pt/pt/portimao/cozinha-da-vivi-pot/'
  };

  // Definição dos horários de funcionamento
  const schedule = [
    { 
      phase: 'open', 
      open: { hour: 11, minute: 30 }, 
      close: { hour: 17, minute: 45 },
      deliveryStarts: { hour: 12, minute: 0 }, // Entregas começam ao meio-dia
      message: 'Estamos abertos - entregas disponíveis a partir das 12:00'
    }
  ];

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

  // Encontra o próximo horário de abertura
  const getNextOpening = () => {
    return {
      time: calculateTimeToEvent(11, 30),
      phase: 'open',
      message: 'Amanhã abrimos às 11:30 (entregas a partir do meio-dia)',
      deliveryStarts: { hour: 12, minute: 0 }
    };
  };

  const checkStatus = () => {
    const testClosed = false;

    if (testClosed) {
      setStatus({
        isOpen: false,
        nextOpening: getNextOpening(),
        currentPhase: 'closed',
        message: 'Plataforma fechada temporariamente para testes',
        nextChangeIn: 3600,
        deliveryAvailable: false
      });
      return;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    let isCurrentlyOpen = false;
    let currentPhase = 'closed';
    let message = '';
    let deliveryAvailable = false;

    for (const period of schedule) {
      const openTime = period.open.hour * 60 + period.open.minute;
      const closeTime = period.close.hour * 60 + period.close.minute;
      const deliveryTime = period.deliveryStarts.hour * 60 + period.deliveryStarts.minute;

      if (currentTime >= openTime && currentTime < closeTime) {
        isCurrentlyOpen = true;
        currentPhase = period.phase;
        
        if (currentTime >= deliveryTime) {
          deliveryAvailable = true;
          message = period.message;
        } else {
          message = `Aberto - entregas começam às ${period.deliveryStarts.hour}:${period.deliveryStarts.minute.toString().padStart(2, '0')}`;
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
      deliveryAvailable
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

  const AnalogClock = ({ size = 60 }) => {
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

  if (!status.isOpen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#3D1106]/10 to-[#5A1B0D]/30 flex items-center justify-center p-4 z-[1000] overflow-y-auto backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="w-full max-w-md mx-auto bg-gradient-to-br from-[#3D1106] to-[#5A1B0D] p-5 sm:p-6 rounded-2xl shadow-2xl text-center text-white relative overflow-hidden border border-[#FFB501]/20"
          style={{
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            backgroundImage: 'radial-gradient(at top right, #5A1B0D, transparent 60%), linear-gradient(to bottom, #3D1106, #5A1B0D)'
          }}
        >
          {/* Efeitos de partículas */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#FFB501]/10"
                initial={{
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  width: Math.random() * 8 + 3,
                  height: Math.random() * 8 + 3,
                  opacity: Math.random() * 0.3 + 0.1
                }}
                animate={{
                  y: [null, (Math.random() - 0.5) * 30],
                  x: [null, (Math.random() - 0.5) * 30],
                  transition: {
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }
                }}
              />
            ))}
          </div>
          
          {/* Elementos decorativos */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B00] via-[#FFB501] to-[#FF6B00]"></div>
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#FFB501]/10 filter blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#FFB501]/5 filter blur-xl"></div>
          
          <div className="relative z-10">
            <div className="mb-4 sm:mb-6 flex flex-col items-center">
              <motion.div 
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.05, 1]
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
                className="bg-gradient-to-br from-[#FFB501] to-[#FF6B00] p-1.5 sm:p-2 rounded-full mb-3 sm:mb-4 shadow-lg"
                style={{
                  boxShadow: '0 0 15px rgba(255, 181, 1, 0.5)'
                }}
              >
                <AnalogClock size={50} />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#FFB501] to-[#FF6B00]"
              >
                {t('closedTitle')}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4"
              >
                Fora do horário de funcionamento
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-[#FFB501]/20 mb-4 sm:mb-6 relative overflow-hidden"
              style={{
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFB501]/5 to-transparent opacity-20"></div>
              <div className="relative z-10">
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                  <div className="text-center">
                    <p className="text-[#FFB501] text-xs sm:text-sm font-semibold mb-1">
                      Próxima abertura:
                    </p>
                    <p className="text-white text-sm sm:text-base font-medium">
                      Amanhã às 11:30 (entregas a partir do meio-dia)
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#FFB501]/10 to-[#FF6B00]/10 p-2 sm:p-3 rounded-lg border border-[#FFB501]/30 backdrop-blur-sm w-full max-w-[180px]">
                    <p className="text-[#FFB501] text-xs mb-1">Tempo restante:</p>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tighter">
                      {formatTime(status.nextChangeIn)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Seção de Delivery Externo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-4 sm:mb-6"
            >
              <h3 className="text-[#FFB501] font-bold text-base sm:text-lg mb-3 sm:mb-4 text-center">
                ENCOMENDE AGORA PELOS NOSSOS PARCEIROS:
              </h3>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Botão Uber Eats */}
                <motion.a
                  href={deliveryLinks.uber}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-black p-4 rounded-xl border border-gray-800 flex flex-col items-center justify-center text-center group relative overflow-hidden hover:shadow-lg hover:shadow-[#000]/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 w-full">
                    <div className="mb-3 flex justify-center">
                      <img 
                        src="/images/ubereats.jpg" 
                        alt="Uber Eats Logo"
                        className="h-8 object-contain"
                      />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20 mt-2">
                      <h4 className="text-white font-bold text-sm sm:text-base mb-1">PEDIR NO UBER EATS</h4>
                      <p className="text-gray-300 text-xs">Clique para ser redirecionado</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#06C167] to-[#3AAE2A]"></div>
                </motion.a>
                
                {/* Botão Glovo */}
                <motion.a
                  href={deliveryLinks.glovo}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#FF6B00] p-4 rounded-xl border border-[#FF8C33] flex flex-col items-center justify-center text-center group relative overflow-hidden hover:shadow-lg hover:shadow-[#FF6B00]/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00] to-[#FF8C33] opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 w-full">
                    <div className="mb-3 flex justify-center">
                      <img 
                        src="/images/glovo.jpg" 
                        alt="Glovo Logo"
                        className="h-8 object-contain"
                      />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20 mt-2">
                      <h4 className="text-white font-bold text-sm sm:text-base mb-1">PEDIR NO GLOVO</h4>
                      <p className="text-white text-xs opacity-90">Clique para ser redirecionado</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B00] to-[#FFB501]"></div>
                </motion.a>
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-xs text-gray-400 mt-3"
              >
                * Será redirecionado para o site oficial do parceiro
              </motion.p>
            </motion.div>
            
            {/* Horário de Funcionamento */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-[#FFB501]/5 to-[#FF6B00]/5 p-3 sm:p-4 rounded-xl border border-[#FFB501]/20 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute -right-3 -top-3 w-12 h-12 rounded-full bg-[#FFB501]/10 group-hover:opacity-50 transition-opacity duration-300"></div>
              <h3 className="text-[#FFB501] font-bold text-base sm:text-lg mb-1 sm:mb-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                HORÁRIO DE FUNCIONAMENTO
              </h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB501] mr-1.5"></span>
                    Abertura:
                  </span>
                  <span className="font-medium text-white">11:30</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB501] mr-1.5"></span>
                    Entregas a partir:
                  </span>
                  <span className="font-medium text-white">12:00</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB501] mr-1.5"></span>
                    Fechamento:
                  </span>
                  <span className="font-medium text-white">14:50</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {status.isOpen && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-[999] bg-gradient-to-r from-[#FF6B00] to-[#FFA800] shadow-lg backdrop-blur-sm py-2"
            style={{
              boxShadow: '0 4px 20px rgba(255, 107, 0, 0.3)'
            }}
          >
            <div className="container mx-auto px-4 text-center text-white font-medium text-sm sm:text-base">
              {status.deliveryAvailable ? (
                <>
                  <span className="inline-block mr-2">🚚</span>
                  {status.message} - Fechamos às 14:50
                </>
              ) : (
                <>
                  <span className="inline-block mr-2">⏱️</span>
                  {status.message} - Entregas começam ao meio-dia
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {children}
    </>
  );
};

export default OpeningHoursControl;