import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiCheck, FiCalendar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { GiBrazil, GiMeal, GiHotSpices } from 'react-icons/gi';

const ModalPromocionalPremium = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [pratoSelecionado, setPratoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const PRECO_POR_DOSE = 13;

  const pratosEspeciais = [
    {
      id: 1,
      nome: "Feijoada da Vivi",
      descricao: "A autêntica feijoada brasileira com o toque especial da Vivi. Feijão preto, linguiça calabresa, costelinha suína e carne seca. Acompanha farofa, couve refogada e laranja.",
      imagem: "https://img.freepik.com/fotos-gratis/feijoada-brasileira-prato-tradicional_23-2149512715.jpg",
      icone: <GiBrazil className="text-3xl text-yellow-600" />,
      disponibilidade: "Aos Sábados",
      iconeDisponibilidade: <FiCalendar className="text-yellow-600" />
    },
    {
      id: 2,
      nome: "Vaca Atolada da Vivi",
      descricao: "O clássico mineiro preparado com o segredo da Vivi. Costela suína premium, linguiça artesanal e mandioca dourada. Servido com arroz branco e couve refogada.",
      imagem: "https://img.freepik.com/fotos-gratis/comida-brasileira-vaca-atolada_23-2149512717.jpg",
      icone: <GiHotSpices className="text-3xl text-yellow-600" />,
      disponibilidade: "Às Quintas-feiras",
      iconeDisponibilidade: <FiCalendar className="text-yellow-600" />
    }
  ];

  const calcularTotal = () => {
    return (quantidade * PRECO_POR_DOSE).toFixed(2);
  };

  const enviarPedidoWhatsApp = () => {
    const numeroRestaurante = "351912345678"; // Número português
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
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-yellow-200 overflow-hidden"
          >
            {/* Cabeçalho */}
            <div className="p-6 bg-gradient-to-r from-yellow-600 to-yellow-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <GiMeal className="text-white" />
                    {pratoSelecionado ? "FAÇA A SUA ENCOMENDA" : "ESPECIALIDADES DA VIVI"}
                  </h2>
                  <p className="text-white/90 text-sm">
                    {pratoSelecionado ? "Selecione a quantidade desejada" : "Pratos especiais com o toque caseiro da Vivi"}
                  </p>
                </div>
                <button
                  onClick={() => pratoSelecionado ? setPratoSelecionado(null) : setIsOpen(false)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white hover:text-white transition-all"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6 bg-white">
              {!pratoSelecionado ? (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">❗ Pagamento Antecipado</h3>
                    <p className="text-yellow-700 text-sm">
                      Para garantir a qualidade dos nossos pratos especiais, todas as encomendas requerem pagamento antecipado. Irá receber um link seguro após enviar o seu pedido.
                    </p>
                  </div>

                  {pratosEspeciais.map(prato => (
                    <motion.div
                      key={prato.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPratoSelecionado(prato)}
                      className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-200 hover:border-yellow-400 transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                      <img
                        src={prato.imagem}
                        alt={prato.nome}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-yellow-500/80 rounded-full">
                            {prato.icone}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{prato.nome}</h3>
                            <p className="text-white/90 text-sm">{prato.descricao}</p>
                            <div className="mt-2 flex justify-between items-center">
                              <div className="flex items-center text-xs text-yellow-200 bg-yellow-800/50 px-2 py-1 rounded-full">
                                {prato.iconeDisponibilidade}
                                <span className="ml-1">{prato.disponibilidade}</span>
                              </div>
                              <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
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
                <div className="space-y-6">
                  {/* Imagem do prato selecionado */}
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <img
                      src={pratoSelecionado.imagem}
                      alt={pratoSelecionado.nome}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center">
                        <FiCheck className="mr-1" /> SELECIONADO
                      </span>
                      <span className="px-3 py-1 bg-white/90 text-yellow-800 text-xs font-bold rounded-full flex items-center">
                        {pratoSelecionado.iconeDisponibilidade}
                        <span className="ml-1">{pratoSelecionado.disponibilidade}</span>
                      </span>
                    </div>
                  </div>

                  {/* Seletor de quantidade */}
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <h3 className="text-lg font-bold text-yellow-800 mb-3">Quantidade de Doses</h3>
                    <p className="text-gray-700 text-sm mb-4">
                      Selecione quantas doses deseja encomendar (€{PRECO_POR_DOSE.toFixed(2)} por dose)
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={diminuirQuantidade}
                        disabled={quantidade <= 1}
                        className={`p-3 rounded-full ${quantidade <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-yellow-500 text-white hover:bg-yellow-600'} transition-all`}
                      >
                        <FiMinus />
                      </button>
                      
                      <div className="text-center">
                        <div className="text-4xl font-bold text-yellow-600">{quantidade}</div>
                        <div className="text-xs text-gray-500">DOSE(S)</div>
                      </div>
                      
                      <button
                        onClick={aumentarQuantidade}
                        disabled={quantidade >= 10}
                        className={`p-3 rounded-full ${quantidade >= 10 ? 'bg-gray-200 text-gray-400' : 'bg-yellow-500 text-white hover:bg-yellow-600'} transition-all`}
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-yellow-700">
                        Cada dose serve 1 pessoa | Máximo de 10 doses por encomenda
                      </p>
                    </div>
                  </div>

                  {/* Total e botão WhatsApp */}
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium">Total a pagar:</span>
                      <span className="text-2xl font-bold text-yellow-600">
                        €{calcularTotal()}
                      </span>
                    </div>
                    
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
                      <p className="text-yellow-800 text-xs text-center">
                        Após enviar a sua encomenda, irá receber um link seguro para pagamento via WhatsApp.
                      </p>
                    </div>
                    
                    <button
                      onClick={enviarPedidoWhatsApp}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition flex items-center justify-center shadow-md"
                    >
                      <FaWhatsapp className="mr-2" size={20} />
                      Enviar Encomenda
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
              {pratoSelecionado ? (
                <button
                  onClick={() => setPratoSelecionado(null)}
                  className="text-yellow-600 hover:text-yellow-700 text-sm flex items-center justify-center w-full"
                >
                  ← Voltar à seleção de pratos
                </button>
              ) : (
                <p className="text-gray-600 text-sm">
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