import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Credenciais inválidas. Por favor, tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff1ea] p-4">
      {/* Container Principal */}
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#fff1ea]">
          {/* Cabeçalio com Degradê */}
          <div className="bg-gradient-to-r from-[#3d1106] to-[#feb300] p-6 text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">COZINHA DA VIVI</h1>
            <p className="text-[#fff1ea] mt-1 text-sm font-light">Painel Administrativo</p>
          </div>
          
          {/* Formulário */}
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-red-700">{error}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#3d1106]" htmlFor="email">
                Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-[#feb300]" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-[#feb300] focus:border-[#feb300] block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 transition duration-150"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#3d1106]" htmlFor="password">
                Senha
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#feb300]" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-[#feb300] focus:border-[#feb300] block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 transition duration-150"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3d1106] hover:bg-[#2a0b04] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#feb300] transition-colors duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  'Acessando...'
                ) : (
                  <>
                    Acessar Painel
                    <FiArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Rodapé */}
          <div className="px-8 py-4 bg-gray-50 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Cozinha da Vivi. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;