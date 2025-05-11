import PrintButton from './PrintButton';

const OrderItem = ({ order, updateOrderStatus, activeTab }) => {
  const total = order.items.reduce((sum, item) => sum + item.price, 0);
  const timestamp = new Date(order.timestamp).toLocaleString();

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold">Pedido #{order.id.substring(0, 6)}</h3>
          <p className="text-sm text-gray-500">Mesa: {order.table || 'N/A'} • {timestamp}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
          order.status === 'ready' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {order.status === 'pending' ? 'Pendente' :
           order.status === 'preparing' ? 'Em Preparo' :
           order.status === 'ready' ? 'Pronto' : 'Entregue'}
        </span>
      </div>

      <ul className="divide-y mb-4">
        {order.items.map((item, index) => (
          <li key={index} className="py-2">
            <div className="flex justify-between">
              <span>{item.name}</span>
              <span>€ {item.price.toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center border-t pt-3">
        <span className="font-bold">Total: € {total.toFixed(2)}</span>
        
        <div className="flex space-x-2">
          <PrintButton order={order} />
          
          {activeTab === 'pending' && (
            <button
              onClick={() => handleStatusChange('preparing')}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
            >
              Iniciar
            </button>
          )}
          
          {activeTab === 'preparing' && (
            <button
              onClick={() => handleStatusChange('ready')}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
            >
              Pronto
            </button>
          )}
          
          {activeTab === 'ready' && (
            <button
              onClick={() => handleStatusChange('delivered')}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition"
            >
              Entregue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;