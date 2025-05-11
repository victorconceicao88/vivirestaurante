import { useTranslation } from 'react-i18next';

const ProductCard = ({ product, addToCart, backgroundColor = "#FFFBF7" }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div 
        className="h-48 w-full flex items-center justify-center p-4"
        style={{ backgroundColor }}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover rounded-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-[#3D1106]">€{product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-[#3D1106] text-[#FFF1E4] py-1 px-3 rounded-lg hover:bg-[#280B04] transition-colors text-sm"
          >
            {t('add', 'Adicionar')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;