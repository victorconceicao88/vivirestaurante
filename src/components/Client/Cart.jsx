const Cart = ({ cart, removeFromCart, sendOrder, closeCart }) => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Seu Pedido</h2>
            <button onClick={closeCart} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="p-4">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Seu carrinho está vazio</p>
            ) : (
              <>
                <ul className="divide-y">
                  {cart.map(item => (
                    <li key={item.id} className="py-3 flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">€ {item.price.toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>€ {total.toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={sendOrder}
                    className="w-full mt-4 bg-amber-600 text-white py-2 rounded hover:bg-amber-700 transition"
                  >
                    Enviar Pedido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default Cart;