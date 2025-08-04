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
    nextChangeIn: 0
  });

  // Definição dos horários de funcionamento
  const schedule = [
    { 
      phase: 'lunch', 
      open: { hour: 11, minute: 30 }, 
      close: { hour: 15, minute: 0 },
      deliveryStarts: { hour: 12, minute: 0 },
      message: 'Horário de almoço - entregas a partir do meio-dia'
    },
    { 
      phase: 'dinner', 
      open: { hour: 18, minute: 0 }, 
      close: { hour: 22, minute: 0 },
      deliveryStarts: { hour: 18, minute: 0 },
      message: 'Horário de jantar - entregas imediatas'
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
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    if (currentHour < 11 || (currentHour === 11 && currentMinute < 30)) {
      return {
        time: calculateTimeToEvent(11, 30),
        phase: 'lunch',
        message: 'Abertura do almoço às 11:30 (entregas a partir do meio-dia)'
      };
    }
    
    if (currentHour < 18 || (currentHour === 18 && currentMinute < 0)) {
      return {
        time: calculateTimeToEvent(18, 0),
        phase: 'dinner',
        message: 'Abertura do jantar às 18:00'
      };
    }
    
    return {
      time: calculateTimeToEvent(11, 30),
      phase: 'lunch',
      message: 'Abertura do almoço às 11:30 (entregas a partir do meio-dia)'
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
        nextChangeIn: 3600
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

    for (const period of schedule) {
      const openTime = period.open.hour * 60 + period.open.minute;
      const closeTime = period.close.hour * 60 + period.close.minute;

      if (currentTime >= openTime && currentTime < closeTime) {
        isCurrentlyOpen = true;
        currentPhase = period.phase;

        const deliveryTime = period.deliveryStarts.hour * 60 + period.deliveryStarts.minute;
        if (currentTime < deliveryTime) {
          message = `Aberto para pedidos (entregas a partir das ${period.deliveryStarts.hour}:${period.deliveryStarts.minute.toString().padStart(2, '0')})`;
        } else {
          message = period.message;
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
        : nextOpening.time
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

  // Componente de relógio analógico animado
  const AnalogClock = ({ size = 80 }) => {
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
          className="max-w-2xl w-full bg-gradient-to-br from-[#3D1106] to-[#5A1B0D] p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl text-center text-white relative overflow-hidden border border-[#FFB501]/20"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            backgroundImage: 'radial-gradient(at top right, #5A1B0D, transparent 60%), linear-gradient(to bottom, #3D1106, #5A1B0D)'
          }}
        >
          {/* Efeitos de partículas */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#FFB501]/10"
                initial={{
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  opacity: Math.random() * 0.3 + 0.1
                }}
                animate={{
                  y: [null, (Math.random() - 0.5) * 50],
                  x: [null, (Math.random() - 0.5) * 50],
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
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF6B00] via-[#FFB501] to-[#FF6B00]"></div>
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[#FFB501]/10 filter blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#FFB501]/5 filter blur-xl"></div>
          
          <div className="relative z-10">
            <div className="mb-6 sm:mb-8 md:mb-10 flex flex-col items-center">
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
                className="bg-gradient-to-br from-[#FFB501] to-[#FF6B00] p-2 sm:p-3 rounded-full mb-4 sm:mb-5 shadow-lg"
                style={{
                  boxShadow: '0 0 20px rgba(255, 181, 1, 0.5)'
                }}
              >
                <AnalogClock size={60} />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#FFB501] to-[#FF6B00]"
              >
                {t('closedTitle')}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6"
              >
                Fora do horário de funcionamento
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#FFB501]/20 mb-6 sm:mb-8 relative overflow-hidden"
              style={{
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFB501]/5 to-transparent opacity-20"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-[#FFB501] text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2">
                      Próxima abertura:
                    </p>
                    <p className="text-white text-base sm:text-lg md:text-xl font-medium">
                      {status.nextOpening?.message}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#FFB501]/10 to-[#FF6B00]/10 p-3 sm:p-4 rounded-xl border border-[#FFB501]/30 backdrop-blur-sm min-w-[150px] sm:min-w-[180px]">
                    <p className="text-[#FFB501] text-xs sm:text-sm mb-1 sm:mb-2">Tempo restante:</p>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-white tracking-tighter">
                      {formatTime(status.nextChangeIn)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-left"
            >
              <div className="bg-gradient-to-br from-[#FFB501]/5 to-[#FF6B00]/5 p-4 sm:p-5 rounded-2xl border border-[#FFB501]/20 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-[#FFB501]/10 group-hover:opacity-50 transition-opacity duration-300"></div>
                <h3 className="text-[#FFB501] font-bold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Horário de Almoço
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300">
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#FFB501] mr-2"></span>
                      Abertura:
                    </span>
                    <span className="font-medium text-white">11:30</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#FFB501] mr-2"></span>
                      Entregas a partir:
                    </span>
                    <span className="font-medium text-white">12:00</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#FFB501] mr-2"></span>
                      Fechamento:
                    </span>
                    <span className="font-medium text-white">15:00</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-[#FFB501]/5 to-[#FF6B00]/5 p-4 sm:p-5 rounded-2xl border border-[#FFB501]/20 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-[#FF6B00]/10 group-hover:opacity-50 transition-opacity duration-300"></div>
                <h3 className="text-[#FFB501] font-bold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Horário de Jantar
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300">
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#FF6B00] mr-2"></span>
                      Abertura:
                    </span>
                    <span className="font-medium text-white">18:00</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#FF6B00] mr-2"></span>
                      Entregas a partir:
                    </span>
                    <span className="font-medium text-white">18:00</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#FF6B00] mr-2"></span>
                      Fechamento:
                    </span>
                    <span className="font-medium text-white">22:00</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {status.currentPhase === 'lunch' && 
         (new Date().getHours() * 60 + new Date().getMinutes()) < (12 * 60) && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-[999] bg-gradient-to-r from-[#FF6B00] to-[#FFA800] shadow-lg backdrop-blur-sm"
            style={{
              boxShadow: '0 4px 30px rgba(255, 107, 0, 0.3)'
            }}
          >
            <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3,
                      ease: "easeInOut"
                    }}
                    className="bg-white/20 p-1 sm:p-2 rounded-full mr-2 sm:mr-3 backdrop-blur-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <p className="text-white font-bold text-xs sm:text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">
                    {status.message}
                  </p>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center bg-black/10 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm border border-white/10"
                >
                  <span className="text-white text-xs sm:text-sm font-medium">
                    Fechamento às <span className="font-bold">15:00</span> • 
                    <span className="ml-1 sm:ml-2 font-mono tracking-tighter">{formatTime(status.nextChangeIn)}</span>
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {children}
    </>
  );
};

export default OpeningHoursControl;