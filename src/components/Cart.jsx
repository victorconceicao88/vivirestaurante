import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = ({ cart, removeFromCart, sendOrder, closeCart }) => {
  const cartRef = useRef(null);
  const total = cart.reduce((sum, item) => sum + (item.finalPrice || item.price) * item.quantity, 0);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        closeCart();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeCart]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000] backdrop-blur-sm"
      >
        <motion.div
          ref={cartRef}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-gradient-to-b from-[#FFF9F2] to-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-[#FFE8D0]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3D1106] to-[#5A1B0D] p-6 text-white relative">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Seu Pedido
                </h2>
                <p className="text-sm opacity-90 mt-1">{cart.length} {cart.length === 1 ? 'item' : 'itens'}</p>
              </div>
              <button 
                onClick={closeCart}
                className="text-white hover:text-[#FFB501] transition-colors p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFB501] opacity-30"></div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh]">
            {cart.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 text-lg">Seu carrinho está vazio</p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2 bg-[#3D1106] text-white rounded-lg hover:bg-[#280B04] transition-colors"
                >
                  Ver Menu
                </button>
              </motion.div>
            ) : (
              <motion.ul className="divide-y divide-[#FFE8D0]">
                <AnimatePresence>
                  {cart.map(item => (
                    <motion.li 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ type: 'spring' }}
                      className="p-4 hover:bg-[#FFF9F2] transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#FFE8D0]">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/images/placeholder-food.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-[#3D1106]">{item.name}</h3>
                            {item.customizations && (
                              <p className="text-xs text-gray-500 mt-1">
                                {item.customizations.split('; ').map((custom, i) => (
                                  <span key={i} className="block">{custom}</span>
                                ))}
                              </p>
                            )}
                            <div className="flex items-center mt-2">
                              <span className="text-sm font-medium text-[#3D1106]">
                                €{(item.finalPrice || item.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-[#3D1106] rounded-lg overflow-hidden">
                            <button 
                              onClick={() => removeFromCart(item.id, 1)}
                              className="px-3 py-1 text-[#3D1106] hover:bg-[#3D1106] hover:text-white transition-colors"
                            >
                              -
                            </button>
                            <span className="px-2 text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => {
                                // Lógica para adicionar mais um do mesmo item
                                const newItem = {...item, id: `${item.id}-${Date.now()}`};
                                removeFromCart(item.id);
                                removeFromCart(newItem.id, -1); // Adiciona novo com quantity +1
                              }}
                              className="px-3 py-1 text-[#3D1106] hover:bg-[#3D1106] hover:text-white transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-[#FFE8D0] p-6 bg-white sticky bottom-0"
            >
              <div className="flex justify-between text-lg mb-4">
                <span className="font-medium text-gray-700">Subtotal</span>
                <span className="font-bold text-[#3D1106]">
                  €{cart.reduce((sum, item) => sum + ((item.finalPrice || item.price) * item.quantity), 0).toFixed(2)}
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={sendOrder}
                className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Finalizar Pedido
                </div>
              </motion.button>
              
              <p className="text-xs text-center text-gray-500 mt-3">
                Ao confirmar, você será redirecionado ao WhatsApp
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Cart;