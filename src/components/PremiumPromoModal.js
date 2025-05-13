import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiCheck, FiCalendar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { GiBrazil, GiMeal, GiHotSpices } from 'react-icons/gi';

const ModalPromocionalPremium = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const PRECO_POR_DOSE = 13;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pratosEspeciais = [
    {
      id: 1,
      nome: "Feijoada da Vivi",
      descricao: "A autêntica feijoada brasileira com o toque especial da Vivi. Feijão preto, linguiça calabresa, costelinha suína e carne seca. Acompanha farofa, couve refogada e laranja.",
      imagem: "images/feijoada.jpeg",
      icone: <GiBrazil className="text-3xl text-[#feb300]" />,
      disponibilidade: "Aos Sábados",
      iconeDisponibilidade: <FiCalendar className="text-[#feb300]" />
    },
    {
      id: 2,
      nome: "Vaca Atolada da Vivi",
      descricao: "O clássico mineiro preparado com o segredo da Vivi. Costela suína premium, linguiça artesanal e mandioca dourada. Servido com arroz branco e couve refogada.",
      imagem: "images/vaca-atolada.jpg",
      icone: <GiHotSpices className="text-3xl text-[#feb300]" />,
      disponibilidade: "Às Quintas-feiras",
      iconeDisponibilidade: <FiCalendar className="text-[#feb300]" />
    }
  ];

  const calcularTotal = () => {
    return (quantidade * PRECO_POR_DOSE).toFixed(2);
  };

  const enviarPedidoWhatsApp = () => {
    const numeroRestaurante = "351928145225";
    const mensagem = `*ENCOMENDA ESPECIAL* - ${pratoSelecionado.nome}\n\n` +
      `*Quantidade:* ${quantidade} dose(s)\n` +
      `*Preço por dose:* €${PRECO_POR_DOSE.toFixed(2)}\n` +
      `*Total a pagar:* €${calcularTotal()}\n\n` +
      `_Para confirmar a sua encomenda, irá receber um link para pagamento seguro via WhatsApp._\n` +
      `_A sua encomenda só será preparada após confirmação do pagamento._\n\n` +
      `_Obrigado por escolher as Especialidades da Cozinha da Vivi!_`;
    
    window.open(`https://wa.me/${numeroRestaurante}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  const aumentarQuantidade = () => {
    setQuantidade(prev => Math.min(prev + 1, 10));
  };

  const diminuirQuantidade = () => {
    setQuantidade(prev => Math.max(prev - 1, 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className={`relative w-full ${isMobile ? 'max-w-full h-full' : 'max-w-md'} bg-[#fff1ea] rounded-2xl shadow-2xl border border-[#feb300]/30 overflow-hidden flex flex-col`}
            style={{ maxHeight: isMobile ? '100vh' : '90vh' }}
          >
            {/* Cabeçalho */}
            <div className="p-4 md:p-6 bg-gradient-to-r from-[#3d1106] to-[#5a1d0e]">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                    <GiMeal className="text-[#feb300]" />
                    {pratoSelecionado ? "FAÇA A SUA ENCOMENDA" : "ESPECIALIDADES DA VIVI"}
                  </h2>
                  <p className="text-white/90 text-xs md:text-sm">
                    {pratoSelecionado ? "Selecione a quantidade desejada" : "Pratos especiais com o toque caseiro da Vivi"}
                  </p>
                </div>
                <button
                  onClick={() => pratoSelecionado ? setPratoSelecionado(null) : setIsOpen(false)}
                  className="p-1 md:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-[#feb300] transition-all"
                  aria-label="Fechar modal"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>

            {/* Corpo do Modal - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#fff1ea]">
              {!pratoSelecionado ? (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-[#3d1106]/5 border border-[#3d1106]/10 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-bold text-[#3d1106] mb-1 md:mb-2 flex items-center gap-2">
                      <span className="text-[#feb300]">❗</span> Pagamento Antecipado
                    </h3>
                    <p className="text-[#3d1106]/90 text-xs md:text-sm">
                      Para garantir a qualidade dos nossos pratos especiais, todas as encomendas requerem pagamento antecipado. Irá receber um link seguro após enviar o seu pedido.
                    </p>
                  </div>

                  {pratosEspeciais.map(prato => (
                    <motion.div
                      key={prato.id}
                      whileHover={{ scale: isMobile ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPratoSelecionado(prato)}
                      className="relative group cursor-pointer rounded-xl overflow-hidden border border-[#3d1106]/20 hover:border-[#feb300] transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                      <img
                        src={prato.imagem}
                        alt={prato.nome}
                        className="w-full h-40 md:h-48 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-20">
                        <div className="flex items-start gap-2 md:gap-3">
                          <div className="p-1 md:p-2 bg-[#feb300]/90 rounded-full">
                            {prato.icone}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-white">{prato.nome}</h3>
                            <p className="text-white/90 text-xs md:text-sm line-clamp-2">{prato.descricao}</p>
                            <div className="mt-1 md:mt-2 flex justify-between items-center">
                              <div className="flex items-center text-xs text-[#feb300] bg-[#3d1106]/70 px-2 py-1 rounded-full">
                                {prato.iconeDisponibilidade}
                                <span className="ml-1">{prato.disponibilidade}</span>
                              </div>
                              <span className="px-2 md:px-3 py-1 bg-[#feb300] text-[#3d1106] text-xs font-bold rounded-full">
                                SELECIONAR
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {/* Imagem do prato selecionado */}
                  <div className="relative rounded-xl overflow-hidden border border-[#3d1106]/20">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <img
                      src={pratoSelecionado.imagem}
                      alt={pratoSelecionado.nome}
                      className="w-full h-40 md:h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 md:top-4 left-3 md:left-4 flex items-center gap-1 md:gap-2">
                      <span className="px-2 md:px-3 py-1 bg-[#feb300] text-[#3d1106] text-xs font-bold rounded-full flex items-center">
                        <FiCheck className="mr-1" /> SELECIONADO
                      </span>
                      <span className="px-2 md:px-3 py-1 bg-white/90 text-[#3d1106] text-xs font-bold rounded-full flex items-center">
                        {pratoSelecionado.iconeDisponibilidade}
                        <span className="ml-1">{pratoSelecionado.disponibilidade}</span>
                      </span>
                    </div>
                  </div>

                  {/* Descrição do prato */}
                  <div className="bg-white rounded-xl p-3 md:p-4 border border-[#3d1106]/10">
                    <h3 className="text-lg md:text-xl font-bold text-[#3d1106] mb-1 md:mb-2">{pratoSelecionado.nome}</h3>
                    <p className="text-[#3d1106]/90 text-sm">{pratoSelecionado.descricao}</p>
                  </div>

                  {/* Seletor de quantidade */}
                  <div className="bg-[#3d1106]/5 rounded-xl p-3 md:p-4 border border-[#feb300]/50">
                    <h3 className="text-base md:text-lg font-bold text-[#3d1106] mb-2 md:mb-3">Quantidade de Doses</h3>
                    <p className="text-[#3d1106]/80 text-xs md:text-sm mb-3 md:mb-4">
                      Selecione quantas doses deseja encomendar (€{PRECO_POR_DOSE.toFixed(2)} por dose)
                    </p>
                    
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <button
                        onClick={diminuirQuantidade}
                        disabled={quantidade <= 1}
                        className={`p-2 md:p-3 rounded-full ${quantidade <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-[#feb300] text-[#3d1106] hover:bg-[#feb300]/90'} transition-all`}
                        aria-label="Reduzir quantidade"
                      >
                        <FiMinus />
                      </button>
                      
                      <div className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-[#3d1106]">{quantidade}</div>
                        <div className="text-xs text-[#3d1106]/60">DOSE(S)</div>
                      </div>
                      
                      <button
                        onClick={aumentarQuantidade}
                        disabled={quantidade >= 10}
                        className={`p-2 md:p-3 rounded-full ${quantidade >= 10 ? 'bg-gray-200 text-gray-400' : 'bg-[#feb300] text-[#3d1106] hover:bg-[#feb300]/90'} transition-all`}
                        aria-label="Aumentar quantidade"
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-[#3d1106]/70">
                        Cada dose serve 1 pessoa | Máximo de 10 doses por encomenda
                      </p>
                    </div>
                  </div>

                  {/* Total e botão WhatsApp */}
                  <div className="bg-[#3d1106]/5 rounded-xl p-3 md:p-4 border border-[#feb300]/50">
                    <div className="flex justify-between items-center mb-3 md:mb-4">
                      <span className="text-[#3d1106] font-medium">Total a pagar:</span>
                      <span className="text-xl md:text-2xl font-bold text-[#3d1106]">
                        €{calcularTotal()}
                      </span>
                    </div>
                    
                    <div className="bg-[#feb300]/10 border border-[#feb300]/30 rounded-lg p-2 md:p-3 mb-3 md:mb-4">
                      <p className="text-[#3d1106] text-xs text-center">
                        Após enviar a sua encomenda, irá receber um link seguro para pagamento via WhatsApp.
                      </p>
                    </div>
                    
                    <button
                      onClick={enviarPedidoWhatsApp}
                      className="w-full py-2 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition flex items-center justify-center shadow-md"
                      aria-label="Enviar encomenda via WhatsApp"
                    >
                      <FaWhatsapp className="mr-2" size={18} />
                      Enviar Encomenda
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="p-3 md:p-4 bg-[#3d1106]/5 border-t border-[#3d1106]/10 text-center">
              {pratoSelecionado ? (
                <button
                  onClick={() => setPratoSelecionado(null)}
                  className="text-[#3d1106] hover:text-[#feb300] text-sm flex items-center justify-center w-full transition-colors"
                  aria-label="Voltar para seleção de pratos"
                >
                  ← Voltar à seleção de pratos
                </button>
              ) : (
                <p className="text-[#3d1106]/80 text-xs md:text-sm">
                  Pratos especiais - €{PRECO_POR_DOSE.toFixed(2)} por dose
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalPromocionalPremium;