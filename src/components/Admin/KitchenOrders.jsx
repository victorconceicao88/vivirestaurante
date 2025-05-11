import OrderItem from './OrderItem';

const KitchenOrders = ({ orders, updateOrderStatus, activeTab }) => {
  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Nenhum pedido {getStatusText(activeTab)}</p>
      ) : (
        orders.map(order => (
          <OrderItem 
            key={order.id}
            order={order}
            updateOrderStatus={updateOrderStatus}
            activeTab={activeTab}
          />
        ))
      )}
    </div>
  );
};

const getStatusText = (status) => {
  switch(status) {
    case 'pending': return 'pendente';
    case 'preparing': return 'em preparo';
    case 'ready': return 'pronto';
    case 'delivered': return 'entregue';
    default: return '';
  }
};

export default KitchenOrders;