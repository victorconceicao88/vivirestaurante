const PrintButton = ({ order }) => {
    const handlePrint = async () => {
      try {
        const printer = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['generic_access']
        });
        
        console.log('Conectado à impressora:', printer.name);
        
        // Aqui você implementaria a lógica de impressão real
        // Isso varia dependendo do modelo da impressora Bluetooth
        alert(`Pedido #${order.id} enviado para impressão!`);
        
      } catch (error) {
        console.error('Erro na impressão:', error);
        alert('Erro ao conectar à impressora. Verifique se ela está ligada e pareada.');
      }
    };
  
    return (
      <button
        onClick={handlePrint}
        className="bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700 transition"
      >
        <i className="fas fa-print mr-1"></i> Imprimir
      </button>
    );
  };
  
  export default PrintButton;