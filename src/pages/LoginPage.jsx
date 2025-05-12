import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [animationStage, setAnimationStage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const sequence = [
      () => setAnimationStage(1), // Chef entra
      () => setAnimationStage(2), // Mostra mensagem
      () => setAnimationStage(3), // Chef prepara
      () => setAnimationStage(4)  // Mostra login
    ];

    const timers = sequence.map((action, index) => 
      setTimeout(action, index * 2000)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Credenciais inválidas. Por favor, tente novamente.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-rose-50 overflow-hidden relative">
      {/* Efeitos de fundo gourmet */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`bg-element-${i}`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.1, 0],
              transition: {
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                delay: i * 0.3
              }
            }}
            className="absolute rounded-full bg-amber-200/30"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(30px)'
            }}
          />
        ))}
      </div>

      {/* Animação do Chef Profissional */}
      <AnimatePresence>
        {animationStage > 0 && animationStage < 4 && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ x: '-100vw' }}
              animate={{ 
                x: animationStage >= 3 ? '100vw' : '0vw',
                transition: { 
                  type: 'spring',
                  stiffness: 100,
                  damping: 10
                }
              }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    duration: 1,
                    repeat: Infinity
                  }
                }}
                className="flex flex-col items-center"
              >
                {/* Chef profissional SVG */}
                <div className="bg-white p-4 rounded-full shadow-xl border-2 border-amber-200">
                  <svg className="w-24 h-24" viewBox="0 0 512 512">
                    <path fill="#F59E0B" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0z"/>
                    <path fill="#FEE2E2" d="M256 128c-70.7 0-128 57.3-128 128s57.3 128 128 128s128-57.3 128-128S326.7 128 256 128z"/>
                    <path fill="#F59E0B" d="M256 64c-17.7 0-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32S273.7 64 256 64z"/>
                    <path fill="#EF4444" d="M256 384c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16s16-7.2 16-16v-32C272 391.2 264.8 384 256 384z"/>
                    <path fill="#F59E0B" d="M384 256c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16s7.2 16 16 16h32C376.8 272 384 264.8 384 256z"/>
                    <path fill="#F59E0B" d="M128 256c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16s7.2 16 16 16h32C120.8 272 128 264.8 128 256z"/>
                  </svg>
                </div>
                
                {/* Balão de fala personalizado */}
                {animationStage >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-xl shadow-lg border border-amber-200 w-64 text-center"
                  >
                    <div className="text-sm font-medium text-amber-800">
                      {animationStage === 2 ? "Oi Vivi, vamos começar?" : "Tudo pronto para você!"}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-amber-200"></div>
                  </motion.div>
                )}
                
                {/* Ações do chef */}
                {animationStage === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-16 left-0 right-0 flex justify-center"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 20, 0],
                        transition: { repeat: Infinity, duration: 1 }
                      }}
                      className="text-3xl text-amber-600"
                    >
                      👨‍🍳
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Conteúdo principal */}
      <AnimatePresence>
        {animationStage >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { type: 'spring', stiffness: 100 }
            }}
            className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-10 w-full max-w-md shadow-2xl border border-white/20 z-40"
          >
            {/* Logo premium */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-10"
            >
              <div className="text-4xl font-bold text-amber-800 font-serif tracking-tight">
                2<span className="text-rose-600">Cozinha</span>DaVivi
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              className="text-3xl font-light text-center mb-10 text-amber-900"
            >
              <span className="font-medium">Bem-vinda, Chef Vivi!</span>
            </motion.h1>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 p-4 bg-rose-50/80 border border-rose-200 rounded-xl overflow-hidden"
              >
                <div className="flex items-center text-rose-700">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </motion.div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.4 } }}
              >
                <label className="block text-sm font-medium mb-3 text-amber-800/80" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-600">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-white border border-amber-200/70 text-amber-900 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30 focus:border-amber-400 transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.5 } }}
              >
                <label className="block text-sm font-medium mb-3 text-amber-800/80" htmlFor="password">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-600">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-xl bg-white border border-amber-200/70 text-amber-900 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-300/30 focus:border-amber-400 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.6 } }}
                className="pt-4"
              >
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center">
                    <span>Iniciar Serviço</span>
                    <FiArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.8 } }}
              className="mt-12 text-center text-sm text-amber-600/70"
            >
              <p>© {new Date().getFullYear()} 2 Cozinha da Vivi. Todos os direitos reservados.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;