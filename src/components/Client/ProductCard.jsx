import { useTranslation } from 'react-i18next';

const ProductCard = ({ 
  product, 
  addToCart, 
  backgroundColor = "#FFFBF7",
  unavailableItems = []
}) => {
  const { t } = useTranslation(); // Obtém a função de tradução do hook
  const isUnavailable = Array.isArray(unavailableItems) && 
                      unavailableItems.includes(product.id.toString());

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isUnavailable) {
      addToCart(product);
    }
  };

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 relative ${
      isUnavailable ? 'opacity-70' : ''
    }`}>
      {/* Badge de Indisponível */}
      {isUnavailable && (
        <div className="absolute top-3 right-3 bg-[#3D1106] text-white px-3 py-1 rounded-full text-xs font-bold z-10">
          {t('unavailable')}
        </div>
      )}

      {/* Imagem do produto */}
      <div 
        className="h-48 w-full flex items-center justify-center p-4 relative"
        style={{ backgroundColor }}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className={`h-full w-full object-cover rounded-lg transition-all duration-300 ${
            isUnavailable ? 'grayscale-[30%]' : 'hover:scale-105'
          }`}
          loading="lazy"
        />
        {isUnavailable && (
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
        )}
      </div>
      
      {/* Informações do produto */}
      <div className="p-4">
        <h3 className={`text-lg font-semibold mb-1 ${
          isUnavailable ? 'text-gray-500' : 'text-gray-800'
        }`}>
          {product.name}
        </h3>
        
        {product.description && (
          <p className={`text-sm ${
            isUnavailable ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {product.description}
          </p>
        )}

        {/* Preço e botão */}
        <div className="mt-4 flex justify-between items-center">
          <span className={`text-lg font-bold ${
            isUnavailable ? 'text-gray-400' : 'text-[#3D1106]'
          }`}>
            €{product.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="ml-2 bg-[#3D1106] text-[#FFB501] py-2 px-4 rounded hover:bg-[#280B04] transition-colors text-sm font-medium"
          >
            {t('options.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
