import React, { useState, useEffect } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import ProductCard from '../components/Client/ProductCard';
import { database, ref, push, set } from '../firebase';
import PremiumPromoModal from '../components/PremiumPromoModal';

// Configuração de internacionalização
i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: {
          "title": "Cozinha da Vivi",
          "menu": "Menu",
          "allProducts": "Todos os Produtos",
          "cart": "Carrinho",
          "emptyCart": "Seu carrinho está vazio",
          "subtotal": "Subtotal",
          "continue": "Continuar",
          "deliveryOptions": "Opções de Entrega",
          "pickup": "Retirar no Local (Grátis)",
          "delivery": "Entrega (+ €2,50)",
          "deliveryInfo": "Informações de Entrega",
          "firstName": "Nome*",
          "lastName": "Sobrenome",
          "address": "Endereço Completo*",
          "phone": "Telefone*",
          "notes": "Observações",
          "deliveryFee": "Taxa de Entrega",
          "total": "Total",
          "paymentMethod": "Método de Pagamento",
          "mbway": "MBWay",
          "cardMachine": "Cartão (Máquina)",
          "cash": "Dinheiro",
          "completeOrder": "Finalizar Pedido",
          "openingHours": "Horário de Funcionamento",
          "monday": "Segunda:",
          "tuesdayToSaturday": "Terça a Sábado:",
          "sunday": "Domingo:",
          "closed": "Fechado",
          "contact": "Contato",
          "addressText": "Endereço",
          "copyright": "© {{year}} Cozinha da Vivi. Todos os direitos reservados.",
          "categories": {
            "all": "Ver Todos",
            "churrasco": "Churrasco",
            "burguers": "Burguers",
            "combos": "Combos",
            "porcoes": "Porções",
            "bebidas": "Bebidas",
            "sobremesas": "Sobremesas"
          },
          "promoModal": {
            "title": "PROMOÇÕES ESPECIAIS DA SEMANA",
            "thursday": "QUINTAS-FEIRAS",
            "thursdaySpecial": "Vaca Atolada por apenas €13",
            "sunday": "DOMINGOS",
            "sundaySpecial": "Feijoada Brasileira Completa",
            "close": "Fechar"
          },
          "options": {
            "beans": "Tipo de Feijão",
            "beansOptions": {
              "broth": "Feijão de caldo",
              "tropeiro": "Feijão tropeiro"
            },
            "sideDishes": "Acompanhamentos",
            "sideDishesOptions": {
              "banana": "Banana frita",
              "potato": "Batata frita",
              "cassavaFried": "Mandioca frita",
              "cassavaCooked": "Mandioca cozida"
            },
            "meats": "Escolha de Carnes",
            "meatsOptions": {
              "heart": "Coração de frango",
              "ribs": "Costelinha de porco",
              "fillet": "Filé de frango",
              "sausage": "Linguiça",
              "topSirloin": "Maminha",
              "cracklings": "Torresmo",
              "onlyTopSirloin": "Só Maminha +€1,00"
            },
            "salad": "Salada",
            "saladOptions": {
              "mixed": "Salada mista",
              "vinaigrette": "Vinagrete",
              "none": "Não quero salada"
            },
            "drinks": "Bebida",
            "drinksOptions": {
              "none": "Sem bebida",
              "waterStill": "Água sem gás 500ml",
              "waterSparklingCastelo": "Água com gás Castelo",
              "waterSparklingPedras": "Água com gás Pedras 500ml",
              "coke": "Coca-Cola",
              "cokeZero": "Coca-Cola Zero",
              "fanta": "Fanta Laranja",
              "guarana": "Guaraná Antarctica",
              "iceTea": "Ice Tea de Manga"
            },
            "required": "*",
            "addToCart": "Adicionar ao Carrinho",
            "cancel": "Cancelar",
            "selectOptions": "Personalize seu Pedido",
            "additionalPrice": "+€{{price}}",
            "maxOptions": "Máximo {{max}} opções selecionadas",
            "meatSelection": "Escolha até 2 carnes ou apenas 'Só Maminha'"
          }
        }
      },
      en: {
        translation: {
          "title": "Vivi's Kitchen",
          "menu": "Menu",
          "allProducts": "All Products",
          "cart": "Cart",
          "emptyCart": "Your cart is empty",
          "subtotal": "Subtotal",
          "continue": "Continue",
          "deliveryOptions": "Delivery Options",
          "pickup": "Pickup (Free)",
          "delivery": "Delivery (+ €2.50)",
          "deliveryInfo": "Delivery Information",
          "firstName": "First Name*",
          "lastName": "Last Name",
          "address": "Full Address*",
          "phone": "Phone*",
          "notes": "Notes",
          "deliveryFee": "Delivery Fee",
          "total": "Total",
          "paymentMethod": "Payment Method",
          "mbway": "MBWay",
          "cardMachine": "Card Machine",
          "cash": "Cash",
          "completeOrder": "Complete Order",
          "openingHours": "Opening Hours",
          "monday": "Monday:",
          "tuesdayToSaturday": "Tuesday to Saturday:",
          "sunday": "Sunday:",
          "closed": "Closed",
          "contact": "Contact",
          "addressText": "Address",
          "copyright": "© {{year}} Vivi's Kitchen. All rights reserved.",
          "categories": {
            "all": "View All",
            "churrasco": "Barbecue",
            "burguers": "Burgers",
            "combos": "Combos",
            "porcoes": "Portions",
            "bebidas": "Drinks",
            "sobremesas": "Desserts"
          },
          "promoModal": {
            "title": "WEEKLY SPECIAL PROMOTIONS",
            "thursday": "THURSDAYS",
            "thursdaySpecial": "Vaca Atolada for just €13",
            "sunday": "SUNDAYS",
            "sundaySpecial": "Complete Brazilian Feijoada",
            "close": "Close"
          },
          "options": {
            "beans": "Beans Type",
            "beansOptions": {
              "broth": "Broth beans",
              "tropeiro": "Tropeiro beans"
            },
            "sideDishes": "Side Dishes",
            "sideDishesOptions": {
              "banana": "Fried banana",
              "potato": "French fries",
              "cassavaFried": "Fried cassava",
              "cassavaCooked": "Cooked cassava"
            },
            "meats": "Meat Selection",
            "meatsOptions": {
              "heart": "Chicken heart",
              "ribs": "Pork ribs",
              "fillet": "Chicken fillet",
              "sausage": "Sausage",
              "topSirloin": "Top sirloin",
              "cracklings": "Pork cracklings",
              "onlyTopSirloin": "Only Top Sirloin +€1.00"
            },
            "salad": "Salad",
            "saladOptions": {
              "mixed": "Mixed salad",
              "vinaigrette": "Vinaigrette",
              "none": "No salad"
            },
            "drinks": "Drink",
            "drinksOptions": {
              "none": "No drink",
              "waterStill": "Still water 500ml",
              "waterSparklingCastelo": "Sparkling water Castelo",
              "waterSparklingPedras": "Sparkling water Pedras 500ml",
              "coke": "Coca-Cola",
              "cokeZero": "Coca-Cola Zero",
              "fanta": "Fanta Orange",
              "guarana": "Guarana Antarctica",
              "iceTea": "Mango Ice Tea"
            },
            "required": "*",
            "addToCart": "Add to Cart",
            "cancel": "Cancel",
            "selectOptions": "Customize Your Order",
            "additionalPrice": "+€{{price}}",
            "maxOptions": "Maximum {{max}} options selected",
            "meatSelection": "Choose up to 2 meats or just 'Only Top Sirloin'"
          }
        }
      },
      es: {
        translation: {
          "title": "Cocina de Vivi",
          "menu": "Menú",
          "allProducts": "Todos los Productos",
          "cart": "Carrito",
          "emptyCart": "Tu carrito está vacío",
          "subtotal": "Subtotal",
          "continue": "Continuar",
          "deliveryOptions": "Opciones de Entrega",
          "pickup": "Recoger en Local (Gratis)",
          "delivery": "Entrega a Domicilio (+ €2,50)",
          "deliveryInfo": "Información de Entrega",
          "firstName": "Nombre*",
          "lastName": "Apellido",
          "address": "Dirección Completa*",
          "phone": "Teléfono*",
          "notes": "Observaciones",
          "deliveryFee": "Gastos de Envío",
          "total": "Total",
          "paymentMethod": "Método de Pago",
          "mbway": "MBWay",
          "cardMachine": "Máquina de Tarjeta",
          "cash": "Efectivo",
          "completeOrder": "Finalizar Pedido",
          "openingHours": "Horario de Apertura",
          "monday": "Lunes:",
          "tuesdayToSaturday": "Martes a Sábado:",
          "sunday": "Domingo:",
          "closed": "Cerrado",
          "contact": "Contacto",
          "addressText": "Dirección",
          "copyright": "© {{year}} Cocina de Vivi. Todos los derechos reservados.",
          "categories": {
            "all": "Ver Todo",
            "churrasco": "Barbacoa",
            "burguers": "Hamburguesas",
            "combos": "Combos",
            "porcoes": "Porciones",
            "bebidas": "Bebidas",
            "sobremesas": "Postres"
          },
          "promoModal": {
            "title": "PROMOCIONES ESPECIALES DE LA SEMANA",
            "thursday": "JUEVES",
            "thursdaySpecial": "Vaca Atolada por solo €13",
            "sunday": "DOMINGOS",
            "sundaySpecial": "Feijoada Brasileña Completa",
            "close": "Cerrar"
          },
          "options": {
            "beans": "Tipo de Frijoles",
            "beansOptions": {
              "broth": "Frijoles al caldo",
              "tropeiro": "Frijoles tropeiro"
            },
            "sideDishes": "Acompañamientos",
            "sideDishesOptions": {
              "banana": "Plátano frito",
              "potato": "Patatas fritas",
              "cassavaFried": "Yuca frita",
              "cassavaCooked": "Yuca cocida"
            },
            "meats": "Selección de Carnes",
            "meatsOptions": {
              "heart": "Corazón de pollo",
              "ribs": "Costillas de cerdo",
              "fillet": "Filete de pollo",
              "sausage": "Salchicha",
              "topSirloin": "Punta de solomillo",
              "cracklings": "Torreznos",
              "onlyTopSirloin": "Solo Punta de Solomillo +€1,00"
            },
            "salad": "Ensalada",
            "saladOptions": {
              "mixed": "Ensalada mixta",
              "vinaigrette": "Vinagreta",
              "none": "Sin ensalada"
            },
            "drinks": "Bebida",
            "drinksOptions": {
              "none": "Sin bebida",
              "waterStill": "Agua sin gas 500ml",
              "waterSparklingCastelo": "Agua con gas Castelo",
              "waterSparklingPedras": "Agua con gas Pedras 500ml",
              "coke": "Coca-Cola",
              "cokeZero": "Coca-Cola Zero",
              "fanta": "Fanta Naranja",
              "guarana": "Guaraná Antarctica",
              "iceTea": "Té helado de mango"
            },
            "required": "*",
            "addToCart": "Añadir al Carrito",
            "cancel": "Cancelar",
            "selectOptions": "Personaliza tu Pedido",
            "additionalPrice": "+€{{price}}",
            "maxOptions": "Máximo {{max}} opciones selecionadas",
            "meatSelection": "Elige hasta 2 carnes o solo 'Solo Punta de Solomillo'"
          }
        }
      }
    },
    lng: "pt",
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false
    }
  });

// Novo ícone de carrinho premium
const PremiumCartIcon = ({ count }) => (
  <div className="relative">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
      <path d="M3 6h18"></path>
      <path d="M16 10a4 4 0 01-8 0"></path>
    </svg>
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-[#3D1106] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
        {count}
      </span>
    )}
  </div>
);


const ClientPage = () => {
  const { t, i18n } = useTranslation();

  // Dados dos produtos organizados por categoria
  const categories = [
    {
      id: 'churrasco',
      name: t('categories.churrasco'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.89 7.111c1.1 1.1 1.1 2.9 0 4l-7.1 7.1c-1.1 1.1-2.9 1.1-4 0l-4-4c-1.1-1.1-1.1-2.9 0-4l7.1-7.1c1.1-1.1 2.9-1.1 4 0l4 4zm-5.66 2.83l-5.66 5.66 2.83 2.83 5.66-5.66-2.83-2.83z"/>
        </svg>
      ),
      products: [
        { 
          id: 101, 
          name: i18n.language === 'pt' ? "Churrasco Misto" : 
                i18n.language === 'en' ? "Mixed Grill" : "Parrillada Mixta", 
          description: "", 
          price: 12.00, 
          image: "/images/mistadecarne.jpg",
          options: {
            beans: {
              title: t('options.beans'),
              required: true,
              type: 'radio',
              items: [
                { value: 'broth', label: t('options.beansOptions.broth') },
                { value: 'tropeiro', label: t('options.beansOptions.tropeiro') }
              ]
            },
            sideDishes: {
              title: t('options.sideDishes'),
              required: true,
              type: 'radio',
              items: [
                { value: 'banana', label: t('options.sideDishesOptions.banana') },
                { value: 'potato', label: t('options.sideDishesOptions.potato') },
                { value: 'cassavaFried', label: t('options.sideDishesOptions.cassavaFried') },
                { value: 'cassavaCooked', label: t('options.sideDishesOptions.cassavaCooked') }
              ]
            },
            meats: {
              title: t('options.meats'),
              required: true,
              type: 'checkbox',
              max: 2,
              items: [
                { value: 'heart', label: t('options.meatsOptions.heart') },
                { value: 'ribs', label: t('options.meatsOptions.ribs') },
                { value: 'fillet', label: t('options.meatsOptions.fillet') },
                { value: 'sausage', label: t('options.meatsOptions.sausage') },
                { value: 'topSirloin', label: t('options.meatsOptions.topSirloin') },
                { value: 'cracklings', label: t('options.meatsOptions.cracklings') },
                { value: 'onlyTopSirloin', label: t('options.meatsOptions.onlyTopSirloin'), price: 1.00, exclusive: true }
              ]
            },
            salad: {
              title: t('options.salad'),
              required: true,
              type: 'radio',
              items: [
                { value: 'mixed', label: t('options.saladOptions.mixed') },
                { value: 'vinaigrette', label: t('options.saladOptions.vinaigrette') },
                { value: 'none', label: t('options.saladOptions.none') }
              ]
            },
            drinks: {
              title: t('options.drinks'),
              required: false,
              type: 'radio',
              items: [
                { value: 'none', label: t('options.drinksOptions.none'), default: true },
                { value: 'waterStill', label: t('options.drinksOptions.waterStill'), price: 1.00 },
                { value: 'waterSparklingCastelo', label: t('options.drinksOptions.waterSparklingCastelo'), price: 1.50 },
                { value: 'waterSparklingPedras', label: t('options.drinksOptions.waterSparklingPedras'), price: 1.50 },
                { value: 'coke', label: t('options.drinksOptions.coke'), price: 2.00 },
                { value: 'cokeZero', label: t('options.drinksOptions.cokeZero'), price: 2.00 },
                { value: 'fanta', label: t('options.drinksOptions.fanta'), price: 2.00 },
                { value: 'guarana', label: t('options.drinksOptions.guarana'), price: 2.00 },
                { value: 'iceTea', label: t('options.drinksOptions.iceTea'), price: 2.00 }
              ]
            }
          }
        },
        { 
          id: 102, 
          name: i18n.language === 'pt' ? "Maminha" : 
                i18n.language === 'en' ? "Top Sirloin" : "Punta de Solomillo", 
          description: "", 
          price: 13.00, 
          image: "/images/maminha.jpg",
          options: {
            beans: {
              title: t('options.beans'),
              required: true,
              type: 'radio',
              items: [
                { value: 'broth', label: t('options.beansOptions.broth') },
                { value: 'tropeiro', label: t('options.beansOptions.tropeiro') }
              ]
            },
            sideDishes: {
              title: t('options.sideDishes'),
              required: true,
              type: 'radio',
              items: [
                { value: 'banana', label: t('options.sideDishesOptions.banana') },
                { value: 'potato', label: t('options.sideDishesOptions.potato') },
                { value: 'cassavaFried', label: t('options.sideDishesOptions.cassavaFried') },
                { value: 'cassavaCooked', label: t('options.sideDishesOptions.cassavaCooked') }
              ]
            },
            salad: {
              title: t('options.salad'),
              required: true,
              type: 'radio',
              items: [
                { value: 'mixed', label: t('options.saladOptions.mixed') },
                { value: 'vinaigrette', label: t('options.saladOptions.vinaigrette') },
                { value: 'none', label: t('options.saladOptions.none') }
              ]
            },
            drinks: {
              title: t('options.drinks'),
              required: false,
              type: 'radio',
              items: [
                { value: 'none', label: t('options.drinksOptions.none'), default: true },
                { value: 'waterStill', label: t('options.drinksOptions.waterStill'), price: 1.00 },
                { value: 'waterSparklingCastelo', label: t('options.drinksOptions.waterSparklingCastelo'), price: 1.50 },
                { value: 'waterSparklingPedras', label: t('options.drinksOptions.waterSparklingPedras'), price: 1.50 },
                { value: 'coke', label: t('options.drinksOptions.coke'), price: 2.00 },
                { value: 'cokeZero', label: t('options.drinksOptions.cokeZero'), price: 2.00 },
                { value: 'fanta', label: t('options.drinksOptions.fanta'), price: 2.00 },
                { value: 'guarana', label: t('options.drinksOptions.guarana'), price: 2.00 },
                { value: 'iceTea', label: t('options.drinksOptions.iceTea'), price: 2.00 }
              ]
            }
          }
        },
        { 
          id: 103, 
          name: i18n.language === 'pt' ? "Linguiça Toscana" : 
                i18n.language === 'en' ? "Tuscan Sausage" : "Salchicha Toscana", 
          description: "", 
          price: 12.00, 
          image: "/images/toscana.jpg",
          options: {
            beans: {
              title: t('options.beans'),
              required: true,
              type: 'radio',
              items: [
                { value: 'broth', label: t('options.beansOptions.broth') },
                { value: 'tropeiro', label: t('options.beansOptions.tropeiro') }
              ]
            },
            sideDishes: {
              title: t('options.sideDishes'),
              required: true,
              type: 'radio',
              items: [
                { value: 'banana', label: t('options.sideDishesOptions.banana') },
                { value: 'potato', label: t('options.sideDishesOptions.potato') },
                { value: 'cassavaFried', label: t('options.sideDishesOptions.cassavaFried') },
                { value: 'cassavaCooked', label: t('options.sideDishesOptions.cassavaCooked') }
              ]
            },
            salad: {
              title: t('options.salad'),
              required: true,
              type: 'radio',
              items: [
                { value: 'mixed', label: t('options.saladOptions.mixed') },
                { value: 'vinaigrette', label: t('options.saladOptions.vinaigrette') },
                { value: 'none', label: t('options.saladOptions.none') }
              ]
            },
            drinks: {
              title: t('options.drinks'),
              required: false,
              type: 'radio',
              items: [
                { value: 'none', label: t('options.drinksOptions.none'), default: true },
                { value: 'waterStill', label: t('options.drinksOptions.waterStill'), price: 1.00 },
                { value: 'waterSparklingCastelo', label: t('options.drinksOptions.waterSparklingCastelo'), price: 1.50 },
                { value: 'waterSparklingPedras', label: t('options.drinksOptions.waterSparklingPedras'), price: 1.50 },
                { value: 'coke', label: t('options.drinksOptions.coke'), price: 2.00 },
                { value: 'cokeZero', label: t('options.drinksOptions.cokeZero'), price: 2.00 },
                { value: 'fanta', label: t('options.drinksOptions.fanta'), price: 2.00 },
                { value: 'guarana', label: t('options.drinksOptions.guarana'), price: 2.00 },
                { value: 'iceTea', label: t('options.drinksOptions.iceTea'), price: 2.00 }
              ]
            }
          }
        },
        { 
          id: 104, 
          name: i18n.language === 'pt' ? "Costelinha de Porco" : 
                i18n.language === 'en' ? "Pork Ribs" : "Costillas de Cerdo", 
          description: "", 
          price: 12.00, 
          image: "/images/costelinha.jpg",
          options: {
            beans: {
              title: t('options.beans'),
              required: true,
              type: 'radio',
              items: [
                { value: 'broth', label: t('options.beansOptions.broth') },
                { value: 'tropeiro', label: t('options.beansOptions.tropeiro') }
              ]
            },
            sideDishes: {
              title: t('options.sideDishes'),
              required: true,
              type: 'radio',
              items: [
                { value: 'banana', label: t('options.sideDishesOptions.banana') },
                { value: 'potato', label: t('options.sideDishesOptions.potato') },
                { value: 'cassavaFried', label: t('options.sideDishesOptions.cassavaFried') },
                { value: 'cassavaCooked', label: t('options.sideDishesOptions.cassavaCooked') }
              ]
            },
            salad: {
              title: t('options.salad'),
              required: true,
              type: 'radio',
              items: [
                { value: 'mixed', label: t('options.saladOptions.mixed') },
                { value: 'vinaigrette', label: t('options.saladOptions.vinaigrette') },
                { value: 'none', label: t('options.saladOptions.none') }
              ]
            },
            drinks: {
              title: t('options.drinks'),
              required: false,
              type: 'radio',
              items: [
                { value: 'none', label: t('options.drinksOptions.none'), default: true },
                { value: 'waterStill', label: t('options.drinksOptions.waterStill'), price: 1.00 },
                { value: 'waterSparklingCastelo', label: t('options.drinksOptions.waterSparklingCastelo'), price: 1.50 },
                { value: 'waterSparklingPedras', label: t('options.drinksOptions.waterSparklingPedras'), price: 1.50 },
                { value: 'coke', label: t('options.drinksOptions.coke'), price: 2.00 },
                { value: 'cokeZero', label: t('options.drinksOptions.cokeZero'), price: 2.00 },
                { value: 'fanta', label: t('options.drinksOptions.fanta'), price: 2.00 },
                { value: 'guarana', label: t('options.drinksOptions.guarana'), price: 2.00 },
                { value: 'iceTea', label: t('options.drinksOptions.iceTea'), price: 2.00 }
              ]
            }
          }
        },
        { 
          id: 105, 
          name: i18n.language === 'pt' ? "Peito de Frango Grelhado" : 
                i18n.language === 'en' ? "Grilled Chicken Breast" : "Pechuga de Pollo a la Parrilla", 
          description: "", 
          price: 12.00, 
          image: "/images/peitodefrango.jpg",
          options: {
            beans: {
              title: t('options.beans'),
              required: true,
              type: 'radio',
              items: [
                { value: 'broth', label: t('options.beansOptions.broth') },
                { value: 'tropeiro', label: t('options.beansOptions.tropeiro') }
              ]
            },
            sideDishes: {
              title: t('options.sideDishes'),
              required: true,
              type: 'radio',
              items: [
                { value: 'banana', label: t('options.sideDishesOptions.banana') },
                { value: 'potato', label: t('options.sideDishesOptions.potato') },
                { value: 'cassavaFried', label: t('options.sideDishesOptions.cassavaFried') },
                { value: 'cassavaCooked', label: t('options.sideDishesOptions.cassavaCooked') }
              ]
            },
            salad: {
              title: t('options.salad'),
              required: true,
              type: 'radio',
              items: [
                { value: 'mixed', label: t('options.saladOptions.mixed') },
                { value: 'vinaigrette', label: t('options.saladOptions.vinaigrette') },
                { value: 'none', label: t('options.saladOptions.none') }
              ]
            },
            drinks: {
              title: t('options.drinks'),
              required: false,
              type: 'radio',
              items: [
                { value: 'none', label: t('options.drinksOptions.none'), default: true },
                { value: 'waterStill', label: t('options.drinksOptions.waterStill'), price: 1.00 },
                { value: 'waterSparklingCastelo', label: t('options.drinksOptions.waterSparklingCastelo'), price: 1.50 },
                { value: 'waterSparklingPedras', label: t('options.drinksOptions.waterSparklingPedras'), price: 1.50 },
                { value: 'coke', label: t('options.drinksOptions.coke'), price: 2.00 },
                { value: 'cokeZero', label: t('options.drinksOptions.cokeZero'), price: 2.00 },
                { value: 'fanta', label: t('options.drinksOptions.fanta'), price: 2.00 },
                { value: 'guarana', label: t('options.drinksOptions.guarana'), price: 2.00 },
                { value: 'iceTea', label: t('options.drinksOptions.iceTea'), price: 2.00 }
              ]
            }
          }
        }
      ]
    },
    {
      id: 'burguers',
      name: t('categories.burguers'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm2 2h10a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm0 4h10a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm0 4h10a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2z"/>
        </svg>
      ),
      products: [
        { 
          id: 201, 
          name: i18n.language === 'pt' ? "X-Salada" : 
                i18n.language === 'en' ? "Cheeseburger" : "Hamburguesa con Queso", 
          description: i18n.language === 'pt' ? "Pão, hambúrguer, queijo, fiambre, alface, tomate, milho e batata palha." : 
                          i18n.language === 'en' ? "Bun, beef patty, cheese, ham, lettuce, tomato, corn and potato sticks." : 
                          "Pan, hamburguesa, queso, jamón, lechuga, tomate, maíz y patatas paja.", 
          price: 6.50, 
          image: "/images/comboxtudo.jpg" 
        },
        { 
          id: 202, 
          name: i18n.language === 'pt' ? "X-Bacon" : 
                i18n.language === 'en' ? "Bacon Cheeseburger" : "Hamburguesa con Bacon", 
          description: i18n.language === 'pt' ? "Pão, hambúrguer, bacon, queijo, fiambre, ovo, alface, tomate, milho e batata palha." : 
                          i18n.language === 'en' ? "Bun, beef patty, bacon, cheese, ham, egg, lettuce, tomato, corn and potato sticks." : 
                          "Pan, hamburguesa, bacon, queso, jamón, huevo, lechuga, tomate, maíz y patatas paja.", 
          price: 8.00, 
          image: "/images/xbacon.jpg" 
        },
        { 
          id: 203, 
          name: i18n.language === 'pt' ? "X-Frango" : 
                i18n.language === 'en' ? "Chicken Burger" : "Pollo Burger", 
          description: i18n.language === 'pt' ? "Pão, hambúrguer de frango, queijo, fiambre, ovo, alface, tomate, milho e batata palha." : 
                          i18n.language === 'en' ? "Bun, chicken patty, cheese, ham, egg, lettuce, tomato, corn and potato sticks." : 
                          "Pan, hamburguesa de pollo, queso, jamón, huevo, lechuga, tomate, maíz y patatas paja.", 
          price: 8.00, 
          image: "/images/xfrango.jpg" 
        },
        { 
          id: 204, 
          name: i18n.language === 'pt' ? "X-Especial" : 
                i18n.language === 'en' ? "Special Burger" : "Hamburguesa Especial", 
          description: i18n.language === 'pt' ? "Pão, hambúrguer, queijo, fiambre, ovo, alface, tomate, milho e batata palha." : 
                          i18n.language === 'en' ? "Bun, beef patty, cheese, ham, egg, lettuce, tomato, corn and potato sticks." : 
                          "Pan, hamburguesa, queso, jamón, huevo, lechuga, tomate, maíz y patatas paja.", 
          price: 7.00, 
          image: "/images/xespecial.jpg" 
        },
        { 
          id: 205, 
          name: i18n.language === 'pt' ? "X-Tudo" : 
                i18n.language === 'en' ? "The Works Burger" : "Hamburguesa Completa", 
          description: i18n.language === 'pt' ? "Pão, hambúrguer, Bacon, queijo, fiambre, Salsicha, ovo, alface, tomate, milho e batata palha." : 
                          i18n.language === 'en' ? "Bun, beef patty, bacon, cheese, ham, sausage, egg, lettuce, tomato, corn and potato sticks." : 
                          "Pan, hamburguesa, bacon, queso, jamón, salchicha, huevo, lechuga, tomate, maíz y patatas paja.", 
          price: 9.00, 
          image: "/images/xtudo.jpg" 
        }
      ]
    },
    {
      id: 'combos',
      name: t('categories.combos'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2v2h6v2h-1.99l1.99 4v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10l2-2H5V4h6V2h2zm-1 4h-2v2H8v2h2v2h2v-2h2V8h-2V6z"/>
        </svg>
      ),
      products: [
        { 
          id: 301, 
          name: i18n.language === 'pt' ? "Combo Frango Supreme" : 
                i18n.language === 'en' ? "Chicken Supreme Combo" : "Combo Pollo Supreme", 
          description: i18n.language === 'pt' ? "Sanduíche de frango com batata frita e bebida. Economize €2,50 em relação à compra separada." : 
                          i18n.language === 'en' ? "Chicken sandwich with fries and drink. Save €2.50 compared to separate purchase." : 
                          "Sándwich de pollo con patatas fritas y bebida. Ahorra €2,50 en comparación con la compra por separado.", 
          price: 10.00, 
          image: "/images/combofrango.jpg" 
        },
        { 
          id: 302, 
          name: i18n.language === 'pt' ? "Combo X-Tudo" : 
                i18n.language === 'en' ? "The Works Combo" : "Combo Completo", 
          description: i18n.language === 'pt' ? "Sanduíche completo com batata frita e bebida. Economize €3,00 em relação à compra separada." : 
                          i18n.language === 'en' ? "Complete sandwich with fries and drink. Save €3.00 compared to separate purchase." : 
                          "Sándwich completo con patatas fritas y bebida. Ahorra €3,00 en comparación con la compra por separado.", 
          price: 12.00, 
          image: "/images/comboxtudo.jpg" 
        }
      ]
    },
    {
      id: 'porcoes',
      name: t('categories.porcoes'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8m-1 3h2v6h-2V7m0 8h2v2h-2v-2z"/>
        </svg>
      ),
      products: [
        { 
          id: 401, 
          name: i18n.language === 'pt' ? "Porção de Arroz" : 
                i18n.language === 'en' ? "Rice Portion" : "Porción de Arroz", 
          description: i18n.language === 'pt' ? "Porção de arroz branco soltinho, ideal para acompanhar seus pratos favoritos." : 
                          i18n.language === 'en' ? "Portion of fluffy white rice, ideal to accompany your favorite dishes." : 
                          "Porción de arroz blanco suelto, ideal para acompañar tus platos favoritos.", 
          price: 3.00, 
          image: "/images/arroz.jpg" 
        },
        { 
          id: 402, 
          name: i18n.language === 'pt' ? "Queijo Coalho" : 
                i18n.language === 'en' ? "Grilled Cheese" : "Queso Coalho", 
          description: i18n.language === 'pt' ? "Queijo coalho grelhado, tradicional do nordeste brasileiro, perfeito para acompanhar molhos." : 
                          i18n.language === 'en' ? "Grilled coalho cheese, traditional from northeastern Brazil, perfect to accompany sauces." : 
                          "Queso coalho a la parrilla, tradicional del noreste de Brasil, perfecto para acompañar salsas.", 
          price: 6.00, 
          image: "/images/queijo.jpg" 
        },
        { 
          id: 403, 
          name: i18n.language === 'pt' ? "Torresmo" : 
                i18n.language === 'en' ? "Pork Cracklings" : "Torreznos", 
          description: i18n.language === 'pt' ? "Torresmo brasileiro: crocante e delicioso, feito com pedaços de carne de porco, ideal para acompanhar uma cerveja gelada." : 
                          i18n.language === 'en' ? "Brazilian pork cracklings: crispy and delicious, made with pieces of pork, ideal to accompany an ice-cold beer." : 
                          "Torreznos brasileños: crujientes y deliciosos, hechos con trozos de cerdo, ideales para acompañar una cerveza bien fría.", 
          price: 6.00, 
          image: "/images/torresmo.jpg" 
        },
        { 
          id: 404, 
          name: i18n.language === 'pt' ? "Porção de Mandioca" : 
                i18n.language === 'en' ? "Cassava Portion" : "Porción de Yuca", 
          description: i18n.language === 'pt' ? "Mandioca frita crocante por fora e macia por dentro, acompanha molho à escolha." : 
                          i18n.language === 'en' ? "Crispy fried cassava, soft inside, served with sauce of your choice." : 
                          "Yuca frita crujiente por fuera y suave por dentro, acompañada de salsa a elegir.", 
          price: 6.00, 
          image: "/images/mandioca.jpg" 
        },
        { 
          id: 405, 
          name: i18n.language === 'pt' ? "Porção de Batata Frita" : 
                i18n.language === 'en' ? "French Fries" : "Patatas Fritas", 
          description: i18n.language === 'pt' ? "Batata frita crocante temperada com sal e ervas finas, acompanha molho à escolha." : 
                          i18n.language === 'en' ? "Crispy fries seasoned with salt and fine herbs, served with sauce of your choice." : 
                          "Patatas fritas crujientes sazonadas con sal y hierbas finas, acompañadas de salsa a elegir.", 
          price: 3.00, 
          image: "/images/batatafrita.jpg" 
        },
        { 
          id: 406, 
          name: i18n.language === 'pt' ? "Porção de Carnes" : 
                i18n.language === 'en' ? "Meat Platter" : "Tabla de Carnes", 
          description: i18n.language === 'pt' ? "Selecione suas carnes preferidas para montar sua porção especial." : 
                          i18n.language === 'en' ? "Select your favorite meats to build your special platter." : 
                          "Selecciona tus carnes preferidas para crear tu porción especial.", 
          price: 10.00, 
          image: "/images/carnes.jpg" 
        }
      ]
    },
    {
      id: 'bebidas',
      name: t('categories.bebidas'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 2v2h1v14a4 4 0 0 0 4 4 4 4 0 0 0 4-4V4h1V2H7zm4 14c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm0-4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm0-4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
        </svg>
      ),
      products: [
        { 
          id: 5021, 
          name: i18n.language === 'pt' ? "Refrigerantes e Águas" : 
                i18n.language === 'en' ? "Soft Drinks and Water" : "Refrescos y Aguas", 
          description: i18n.language === 'pt' ? "Selecione seu refrigerante preferido. Todos em lata 350ml, geladinhos." : 
                          i18n.language === 'en' ? "Select your favorite soft drink. All in 350ml cans, ice cold." : 
                          "Selecciona tu refresco preferido. Todos en lata de 350ml, bien fríos.", 
          price: 2.00, 
          image: "/images/refrigerantes.jpg" 
        }
      ]
    },
    {
      id: 'sobremesas',
      name: t('categories.sobremesas'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8m-1 3h2v6h-2V7m0 8h2v2h-2v-2z"/>
        </svg>
      ),
      products: [
        { 
          id: 601, 
          name: i18n.language === 'pt' ? "Açai Pequeno" : 
                i18n.language === 'en' ? "Small Açai Bowl" : "Açai Pequeño", 
          description: i18n.language === 'pt' ? "Açai cremoso com acompanhamentos à escolha. Tamanho pequeno (300ml)." : 
                          i18n.language === 'en' ? "Creamy açai with toppings of your choice. Small size (300ml)." : 
                          "Açai cremoso con acompañamientos a elegir. Tamaño pequeño (300ml).", 
          price: 6.00, 
          image: "/images/acai.jpg" 
        },
        { 
          id: 602, 
          name: i18n.language === 'pt' ? "Açai Grande" : 
                i18n.language === 'en' ? "Large Açai Bowl" : "Açai Grande", 
          description: i18n.language === 'pt' ? "Açai cremoso com acompanhamentos à escolha. Tamanho grande (500ml)." : 
                          i18n.language === 'en' ? "Creamy açai with toppings of your choice. Large size (500ml)." : 
                          "Açai cremoso con acompañamientos a elegir. Tamaño grande (500ml).", 
          price: 10.00, 
          image: "/images/Acai.png" 
        },
        { 
          id: 603, 
          name: i18n.language === 'pt' ? "Pudim Caseiro" : 
                i18n.language === 'en' ? "Homemade Pudding" : "Flan Casero", 
          description: i18n.language === 'pt' ? "Pudim tradicional caseiro com calda de caramelo. Feito com ingredientes selecionados." : 
                          i18n.language === 'en' ? "Traditional homemade pudding with caramel sauce. Made with selected ingredients." : 
                          "Flan tradicional casero con salsa de caramelo. Hecho con ingredientes seleccionados.", 
          price: 3.00, 
          image: "/images/pudim.jpg" 
        }
      ]
    }
  ];
  // Estado do componente
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [deliveryOption, setDeliveryOption] = useState('pickup');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(true);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const [meatSelectionError, setMeatSelectionError] = useState('');
  const [notification, setNotification] = useState(null);

  // Todos os produtos em um único array
  const allProducts = categories.flatMap(category => category.products);

  // Produtos filtrados por categoria
  const filteredProducts = activeCategory === 'all' 
    ? allProducts 
    : categories.find(cat => cat.id === activeCategory)?.products || [];

  // Componente de ícone de carrinho premium
  const PremiumCartIcon = ({ count }) => (
    <div className="relative">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
        <path d="M3 6h18"></path>
        <path d="M16 10a4 4 0 01-8 0"></path>
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#3D1106] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
          {count}
        </span>
      )}
    </div>
  );

  // Componente de Modal de Opções Premium
  const PremiumOptionsModal = ({ 
    product, 
    onClose, 
    onConfirm,
    t,
    selectedOptions: initialSelectedOptions = {},
    setSelectedOptions: parentSetSelectedOptions,
    additionalPrice: initialAdditionalPrice = 0,
    setAdditionalPrice: parentSetAdditionalPrice,
    meatSelectionError: initialMeatSelectionError = '',
    setMeatSelectionError: parentSetMeatSelectionError
  }) => {
    const modalRef = React.useRef(null);
    const optionKeys = Object.keys(product.options);
    const [activeTab, setActiveTab] = useState(optionKeys[0]);
    const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions);
    const [additionalPrice, setAdditionalPrice] = useState(initialAdditionalPrice);
    const [meatSelectionError, setMeatSelectionError] = useState(initialMeatSelectionError);

    useEffect(() => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }, []);

    const isMeatOptionDisabled = (optionValue) => {
      if (!product.options.meats) return false;
      
      const selectedMeats = selectedOptions.meats || [];
      const hasOnlyTopSirloin = selectedMeats.includes('onlyTopSirloin');
      const maxMeats = product.options.meats.max || 2;
      
      if (hasOnlyTopSirloin && optionValue !== 'onlyTopSirloin') return true;
      if (!hasOnlyTopSirloin && selectedMeats.length >= maxMeats && 
          !selectedMeats.includes(optionValue) && optionValue !== 'onlyTopSirloin') return true;
      
      return false;
    };

    const handleOptionSelect = (optionName, value, price = 0, isChecked = false, optionData = {}) => {
      setSelectedOptions(prev => {
        const newOptions = { ...prev };
        
        if (optionName === 'meats') {
          let newSelectedMeats = newOptions.meats || [];
          
          if (optionData.exclusive) {
            newSelectedMeats = isChecked ? [value] : [];
          } else {
            newSelectedMeats = newSelectedMeats.filter(item => item !== 'onlyTopSirloin');
            if (isChecked) {
              newSelectedMeats = [...newSelectedMeats, value];
            } else {
              newSelectedMeats = newSelectedMeats.filter(item => item !== value);
            }
          }
          
          const maxMeats = product.options.meats?.max || 2;
          if (newSelectedMeats.length > maxMeats && !newSelectedMeats.includes('onlyTopSirloin')) {
            setMeatSelectionError(t('options.maxOptions', { max: maxMeats }));
            return prev;
          } else {
            setMeatSelectionError('');
          }
          
          newOptions[optionName] = newSelectedMeats;
        } else {
          newOptions[optionName] = value;
        }
        
        return newOptions;
      });

      if (isChecked) {
        setAdditionalPrice(prev => prev + price);
      } else if (optionName !== 'meats') {
        const previousOption = selectedOptions[optionName];
        const previousPrice = product.options[optionName]?.items
          .find(item => item.value === previousOption)?.price || 0;
        setAdditionalPrice(prev => prev - previousPrice);
      }

      // Avança automaticamente para a próxima aba obrigatória
      const currentIndex = optionKeys.indexOf(optionName);
      if (currentIndex < optionKeys.length - 1 && product.options[optionName].required) {
        const nextOption = optionKeys[currentIndex + 1];
        setActiveTab(nextOption);
      }
    };

    const renderOptionItem = (optionName, optionData, item, index) => {
      const isRadio = optionData.type === 'radio';
      const isChecked = isRadio 
        ? selectedOptions[optionName] === item.value 
        : (selectedOptions[optionName] || []).includes(item.value);
      
      return (
        <div 
          key={index}
          onClick={() => {
            if (optionName === 'meats' && isMeatOptionDisabled(item.value)) return;
            handleOptionSelect(
              optionName,
              item.value,
              item.price || 0,
              !isChecked,
              item
            );
          }}
          className={`p-3 rounded-lg transition-all ${
            isChecked ? 'bg-[#FFF5EB] border border-[#3D1106]' : 'bg-white border border-gray-200'
          } ${
            optionName === 'meats' && isMeatOptionDisabled(item.value) 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer hover:bg-[#FFF5EB]'
          }`}
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
              isChecked ? 'bg-[#3D1106]' : 'border border-gray-400'
            }`}>
              {isChecked && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
                {item.price && (
                  <span className="text-xs font-medium bg-[#3D1106] text-white px-2 py-0.5 rounded-full">
                    +€{item.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div 
          ref={modalRef}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-fadeInUp"
          tabIndex="-1"
        >
          <div className="bg-gradient-to-r from-[#3D1106] to-[#5A1B0D] p-6 text-white relative">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{t('options.selectOptions')}</h3>
                <p className="text-sm opacity-90 mt-1">{product.name}</p>
              </div>
              <button 
                onClick={onClose}
                className="text-white hover:text-[#FFB501] transition-colors p-1 absolute right-4 top-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFB501] opacity-30"></div>
          </div>

          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {Object.keys(product.options).map((optionName) => (
                <button
                  key={optionName}
                  onClick={() => setActiveTab(optionName)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap relative ${
                    activeTab === optionName 
                      ? 'text-[#3D1106]' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {product.options[optionName].title}
                  {activeTab === optionName && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3D1106] animate-underline"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {Object.entries(product.options).map(([optionName, optionData]) => (
              <div 
                key={optionName} 
                className={`space-y-3 ${activeTab === optionName ? 'block' : 'hidden'}`}
              >
                {meatSelectionError && optionName === 'meats' && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {meatSelectionError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-2">
                  {optionData.items.map((item, index) => (
                    renderOptionItem(optionName, optionData, item, index)
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-gray-500">
                  {t('options.required')} {t('options.required') === '*' ? 'Required fields' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold text-[#3D1106]">
                  €{(product.price + additionalPrice).toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-[#3D1106] text-[#3D1106] rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {t('options.cancel')}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#3D1106] to-[#5A1B0D] text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('options.addToCart')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Funções do carrinho
  const addToCart = (product) => {
    if (product.options) {
      setSelectedProduct(product);
      setSelectedOptions({});
      setAdditionalPrice(0);
      setMeatSelectionError('');
      setShowOptionsModal(true);
    } else {
      const productId = product.id;
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === productId);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === productId 
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, id: productId, quantity: 1 }];
        }
      });
    }
  };

  const confirmAddToCart = () => {
    if (!selectedProduct) return;

    for (const [optionName, optionData] of Object.entries(selectedProduct.options)) {
      if (optionData.required && !selectedOptions[optionName]) {
        setNotification({
          message: i18n.language === 'pt' ? 'Por favor, selecione todas as opções obrigatórias' :
                    i18n.language === 'en' ? 'Please select all required options' :
                    'Por favor, seleccione todas las opciones obligatorias',
          type: 'error'
        });
        return;
      }
    }

    if (selectedProduct.options.meats) {
      const selectedMeats = selectedOptions.meats || [];
      const hasOnlyTopSirloin = selectedMeats.includes('onlyTopSirloin');
      const maxMeats = selectedProduct.options.meats.max || 2;
      
      if (!hasOnlyTopSirloin && selectedMeats.length === 0) {
        setMeatSelectionError(t('options.meatSelection'));
        return;
      }
      
      if (!hasOnlyTopSirloin && selectedMeats.length > maxMeats) {
        setMeatSelectionError(t('options.maxOptions', { max: maxMeats }));
        return;
      }
    }

    const productWithOptions = {
      ...selectedProduct,
      id: selectedProduct.id,
      quantity: 1,
      selectedOptions: selectedOptions,
      additionalPrice: additionalPrice,
      finalPrice: selectedProduct.price + additionalPrice
    };

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => 
        item.id === productWithOptions.id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(productWithOptions.selectedOptions)
      );

      if (existingItemIndex >= 0) {
        return prevCart.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, productWithOptions];
      }
    });

    setShowOptionsModal(false);
  };

  const removeFromCart = (id) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === id 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== id);
      }
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id 
          ? { ...item, quantity: parseInt(quantity) }
          : item
      )
    );
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + ((item.finalPrice || item.price) * (item.quantity || 1)), 0);
    const deliveryFee = deliveryOption === 'delivery' ? 2.5 : 0;
    return subtotal + deliveryFee;
  };

  const handleDeliveryOptionChange = (option) => {
    setDeliveryOption(option);
  };

  const handleDeliveryDetailsChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const proceedToDelivery = () => {
    setCheckoutStep('delivery');
  };

  const proceedToPayment = () => {
    if (!deliveryDetails.firstName || !deliveryDetails.phone) {
      setNotification({
        message: i18n.language === 'pt' ? 'Por favor, preencha todos os campos obrigatórios' :
                  i18n.language === 'en' ? 'Please fill in all required fields' :
                  'Por favor, complete todos los campos obligatorios',
        type: 'error'
      });
      return;
    }
    if (deliveryOption === 'delivery' && !deliveryDetails.address) {
      setNotification({
        message: i18n.language === 'pt' ? 'Por favor, informe o endereço de entrega' :
                  i18n.language === 'en' ? 'Please provide the delivery address' :
                  'Por favor, proporcione la dirección de entrega',
        type: 'error'
      });
      return;
    }
    setCheckoutStep('payment');
  };

  const sendOrder = async () => {
    if (!paymentMethod) {
      setNotification({
        message: i18n.language === 'pt' ? 'Selecione um método de pagamento' : 
                  i18n.language === 'en' ? 'Select a payment method' : 
                  'Seleccione un método de pago',
        type: 'error'
      });
      return;
    }

    setShowCart(false);
    setCheckoutStep('cart');

    const orderData = {
      items: cart,
      customerName: deliveryDetails.firstName + (deliveryDetails.lastName ? ' ' + deliveryDetails.lastName : ''),
      customerPhone: deliveryDetails.phone,
      paymentMethod,
      status: 'pending',
      orderType: deliveryOption,
      createdAt: new Date().toISOString(),
      subtotal: cart.reduce((sum, item) => sum + ((item.finalPrice || item.price) * item.quantity), 0),
      deliveryFee: deliveryOption === 'delivery' ? 2.5 : 0,
      total: calculateTotal(),
      ...(deliveryOption === 'delivery' && { 
        deliveryAddress: deliveryDetails.address 
      }),
      ...(deliveryDetails.notes && { notes: deliveryDetails.notes })
    };

    try {
      const orderRef = push(ref(database, 'orders'));
      await set(orderRef, orderData);
      
      let whatsappMessage = i18n.language === 'pt' ? '🍽️ *NOVO PEDIDO - Cozinha da Vivi* 🍽️\n\n' :
                           i18n.language === 'en' ? '🍽️ *NEW ORDER - Vivi\'s Kitchen* 🍽️\n\n' :
                           '🍽️ *NUEVO PEDIDO - Cocina de Vivi* 🍽️\n\n';
      
      whatsappMessage += cart.map(item => {
        let itemText = `✔️ ${item.name} (${item.quantity}x) - €${((item.finalPrice || item.price) * item.quantity).toFixed(2)}`;
        
        if (item.selectedOptions) {
          itemText += '\n   - ' + Object.entries(item.selectedOptions)
            .map(([optionName, value]) => {
              if (Array.isArray(value)) {
                return `${optionName}: ${value.join(', ')}`;
              }
              return `${optionName}: ${value}`;
            })
            .join('\n   - ');
        }
        
        return itemText;
      }).join('\n');
      
      whatsappMessage += i18n.language === 'pt' ? 
        `\n\n🚚 *Tipo de Pedido:* ${deliveryOption === 'delivery' ? 'Entrega (+€2,50)' : 'Retirada no Local'}` +
        `\n👤 *Nome:* ${deliveryDetails.firstName} ${deliveryDetails.lastName || ''}` +
        (deliveryOption === 'delivery' ? `\n🏠 *Endereço:* ${deliveryDetails.address}` : '') +
        `\n📞 *Telefone:* ${deliveryDetails.phone}` +
        (deliveryDetails.notes ? `\n📝 *Observações:* ${deliveryDetails.notes}` : '') :
        i18n.language === 'en' ? 
        `\n\n🚚 *Order Type:* ${deliveryOption === 'delivery' ? 'Delivery (+€2.50)' : 'Pickup'}` +
        `\n👤 *Name:* ${deliveryDetails.firstName} ${deliveryDetails.lastName || ''}` +
        (deliveryOption === 'delivery' ? `\n🏠 *Address:* ${deliveryDetails.address}` : '') +
        `\n📞 *Phone:* ${deliveryDetails.phone}` +
        (deliveryDetails.notes ? `\n📝 *Notes:* ${deliveryDetails.notes}` : '') :
        `\n\n🚚 *Tipo de Pedido:* ${deliveryOption === 'delivery' ? 'Entrega (+€2,50)' : 'Recoger en Local'}` +
        `\n👤 *Nombre:* ${deliveryDetails.firstName} ${deliveryDetails.lastName || ''}` +
        (deliveryOption === 'delivery' ? `\n🏠 *Dirección:* ${deliveryDetails.address}` : '') +
        `\n📞 *Teléfono:* ${deliveryDetails.phone}` +
        (deliveryDetails.notes ? `\n📝 *Observaciones:* ${deliveryDetails.notes}` : '');
      
      whatsappMessage += i18n.language === 'pt' ? 
        `\n\n💳 *Pagamento:* ${paymentMethod}` +
        `\n💰 *Subtotal:* €${orderData.subtotal.toFixed(2)}` +
        (deliveryOption === 'delivery' ? `\n🚚 *Taxa de Entrega:* €2.50` : '') +
        `\n💵 *Total a Pagar:* €${orderData.total.toFixed(2)}` :
        i18n.language === 'en' ? 
        `\n\n💳 *Payment:* ${paymentMethod}` +
        `\n💰 *Subtotal:* €${orderData.subtotal.toFixed(2)}` +
        (deliveryOption === 'delivery' ? `\n🚚 *Delivery Fee:* €2.50` : '') +
        `\n💵 *Total:* €${orderData.total.toFixed(2)}` :
        `\n\n💳 *Pago:* ${paymentMethod}` +
        `\n💰 *Subtotal:* €${orderData.subtotal.toFixed(2)}` +
        (deliveryOption === 'delivery' ? `\n🚚 *Gastos de Envío:* €2.50` : '') +
        `\n💵 *Total:* €${orderData.total.toFixed(2)}`;

      setShowSuccessModal(true);

      setTimeout(() => {
        const phone = '+351933737672';
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        setShowSuccessModal(false);
        setCart([]);
        setDeliveryOption('pickup');
        setDeliveryDetails({
          firstName: '',
          lastName: '',
          address: '',
          phone: '',
          notes: ''
        });
        setPaymentMethod('');
      }, 3000);

    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      setNotification({
        message: i18n.language === 'pt' ? 'Erro ao enviar pedido. Tente novamente.' :
                  i18n.language === 'en' ? 'Error sending order. Please try again.' :
                  'Error al enviar pedido. Intente nuevamente.',
        type: 'error'
      });
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguageDropdownOpen(false);
  };

  const resetToHome = () => {
    setActiveCategory('all');
    setShowCart(false);
    setCheckoutStep('cart');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#FFF1E4] flex flex-col">
      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 text-center animate-fadeIn">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {i18n.language === 'pt' ? 'Pedido realizado com sucesso!' : 
               i18n.language === 'en' ? 'Order placed successfully!' : 
               '¡Pedido realizado con éxito!'}
            </h3>
            <p className="text-gray-600 mb-6">
              {i18n.language === 'pt' ? 'Você será redirecionado para o WhatsApp em instantes...' : 
               i18n.language === 'en' ? 'You will be redirected to WhatsApp shortly...' : 
               'Serás redirigido a WhatsApp en breve...'}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Promocional */}
      <PremiumPromoModal 
        show={showPromoModal} 
        onClose={() => setShowPromoModal(false)}
        t={t}
      />

      {/* Modal de Opções Premium */}
      {showOptionsModal && selectedProduct && (
        <PremiumOptionsModal 
          product={selectedProduct}
          onClose={() => setShowOptionsModal(false)}
          onConfirm={confirmAddToCart}
          t={t}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          additionalPrice={additionalPrice}
          setAdditionalPrice={setAdditionalPrice}
          meatSelectionError={meatSelectionError}
          setMeatSelectionError={setMeatSelectionError}
        />
      )}

      {/* Cabeçalho Premium */}
      <header className="bg-[#FFF1E4] text-[#3D1106] p-4 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            onClick={resetToHome}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img src="/images/logovivi.jpg" alt="Logo" className="h-10 w-10 rounded-full border border-[#3D1106] hover:scale-110 transition-transform" />
            <h1 className="text-lg md:text-xl font-bold font-serif text-[#3D1106] hover:text-[#280B04] transition-colors">
              COZINHA DA VIVI
            </h1>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button 
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-[#3D1106] text-[#FFB501] hover:bg-[#280B04] transition-all duration-300 shadow"
              >
                <span className="text-sm">
                  {i18n.language === 'pt' ? '🇵🇹' : 
                   i18n.language === 'en' ? '🇬🇧' : '🇪🇸'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 overflow-hidden border border-[#3D1106] animate-fadeIn">
                  <div className="py-1">
                    <button 
                      onClick={() => changeLanguage('pt')}
                      className={`flex items-center px-3 py-1 text-sm w-full text-left hover:bg-[#FFF1E4] transition-colors ${i18n.language === 'pt' ? 'bg-[#FFF1E4] font-medium' : ''}`}
                    >
                      <span className="text-sm mr-2">🇵🇹</span>
                      Português
                    </button>
                    <button 
                      onClick={() => changeLanguage('en')}
                      className={`flex items-center px-3 py-1 text-sm w-full text-left hover:bg-[#FFF1E4] transition-colors ${i18n.language === 'en' ? 'bg-[#FFF1E4] font-medium' : ''}`}
                    >
                      <span className="text-sm mr-2">🇬🇧</span>
                      English
                    </button>
                    <button 
                      onClick={() => changeLanguage('es')}
                      className={`flex items-center px-3 py-1 text-sm w-full text-left hover:bg-[#FFF1E4] transition-colors ${i18n.language === 'es' ? 'bg-[#FFF1E4] font-medium' : ''}`}
                    >
                      <span className="text-sm mr-2">🇪🇸</span>
                      Español
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 rounded-full hover:bg-[#3D1106] hover:text-[#FFB501] transition-all duration-300"
            >
              <PremiumCartIcon count={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} />
            </button>
          </div>
        </div>
      </header>

      {/* Navegação por Categorias com linha animada */}
      <div className="bg-[#FFF1E4] shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <h2 className="text-xl font-bold text-[#3D1106] mb-3 text-center">
            {t('menu')}
          </h2>
          <div className="relative mb-4">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-[#3D1106] to-transparent rounded-full animate-underline-expand"></div>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex flex-col items-center px-3 py-1 rounded-lg whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-[#3D1106] text-[#FFB501] shadow' : 'bg-[#FFF1E4] hover:bg-[#3D1106] hover:text-[#FFB501]'} border border-[#3D1106]`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-xs mt-1">{t('categories.all')}</span>
            </button>

            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center px-3 py-1 rounded-lg whitespace-nowrap transition-all ${activeCategory === category.id ? 'bg-[#3D1106] text-white shadow' : 'bg-[#FFF1E4] hover:bg-[#3D1106] hover:text-white'} border border-[#3D1106]`}
              >
                {React.cloneElement(category.icon, {
                  className: `h-4 w-4 ${activeCategory === category.id ? 'text-white' : 'text-[#3D1106]'}`
                })}
                <span className="text-xs mt-1">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="container mx-auto p-4 bg-[#FFF1E4] flex-1">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#3D1106]">
            {activeCategory === 'all' ? t('allProducts') : categories.find(c => c.id === activeCategory)?.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="border border-[#3D1106] rounded-lg overflow-hidden transition-shadow hover:shadow-md">
              <ProductCard 
                product={product} 
                addToCart={addToCart}
                backgroundColor="#FFFBF7"
                textColor="#3D1106"
                borderColor="#3D1106"
                borderWidth="0"
              />
            </div>
          ))}
        </div>
      </main>

      {/* Carrinho Lateral */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end animate-fadeIn">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#3D1106]">
                  {checkoutStep === 'cart' ? t('cart') : 
                   checkoutStep === 'delivery' ? t('deliveryOptions') : 
                   t('paymentMethod')}
                </h2>
                <button 
                  onClick={() => {
                    setShowCart(false);
                    setCheckoutStep('cart');
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {checkoutStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <p className="mt-4 text-gray-500">{t('emptyCart')}</p>
                      <button
                        onClick={() => setShowCart(false)}
                        className="mt-6 px-6 py-2 bg-[#3D1106] text-white rounded-lg hover:bg-[#280B04] transition-colors"
                      >
                        {i18n.language === 'pt' ? 'Ver Menu' : 
                         i18n.language === 'en' ? 'View Menu' : 
                         'Ver Menú'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover border border-[#3D1106]" />
                              <div>
                                <h3 className="font-medium text-[#3D1106]">{item.name}</h3>
                                {item.selectedOptions && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {Object.entries(item.selectedOptions).map(([optionName, value]) => {
                                      if (Array.isArray(value)) {
                                        return (
                                          <div key={optionName}>
                                            {optionName}: {value.join(', ')}
                                          </div>
                                        );
                                      }
                                      return (
                                        <div key={optionName}>
                                          {optionName}: {value}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                <p className="text-sm text-gray-500">€{(item.finalPrice || item.price).toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center border border-[#3D1106] rounded-lg overflow-hidden">
                                <button 
                                  onClick={() => removeFromCart(item.id)}
                                  className="px-3 py-1 text-[#3D1106] hover:bg-[#3D1106] hover:text-white transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                <button 
                                  onClick={() => {
                                    if (item.selectedOptions) {
                                      setSelectedProduct(item);
                                      setSelectedOptions(item.selectedOptions);
                                      setAdditionalPrice(item.additionalPrice || 0);
                                      setShowOptionsModal(true);
                                    } else {
                                      addToCart(item);
                                    }
                                  }}
                                  className="px-3 py-1 text-[#3D1106] hover:bg-[#3D1106] hover:text-white transition-colors"
                                >
                                  +
                                </button>
                              </div>
                              <button 
                                onClick={() => setCart(cart.filter(i => i.id !== item.id))}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{t('subtotal')}</span>
                          <span>€{cart.reduce((sum, item) => sum + ((item.finalPrice || item.price) * item.quantity), 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-[#3D1106] pt-2 border-t border-gray-200">
                          <span>{t('total')}</span>
                          <span>€{cart.reduce((sum, item) => sum + ((item.finalPrice || item.price) * item.quantity), 0).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={proceedToDelivery}
                        className="w-full bg-[#3D1106] text-white py-3 px-4 rounded-lg hover:bg-[#280B04] transition-all font-bold"
                      >
                        {t('continue')}
                      </button>
                    </>
                  )}
                </>
              )}

              {checkoutStep === 'delivery' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#3D1106]">{t('deliveryOptions')}</h3>
                    
                    <div 
                      onClick={() => handleDeliveryOptionChange('pickup')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        deliveryOption === 'pickup' ? 'border-[#3D1106] bg-[#FFF1E4] shadow-md' : 'border-gray-200 hover:border-[#3D1106]'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          deliveryOption === 'pickup' ? 'bg-[#3D1106] text-[#FFB501]' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-[#3D1106]">{t('pickup')}</h3>
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                              deliveryOption === 'pickup' ? 'bg-[#3D1106] text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {t('pickup').includes('Grátis') ? 'Grátis' : 'Free'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {i18n.language === 'pt' ? 'Retire seu pedido no nosso restaurante' : 
                              i18n.language === 'en' ? 'Pick up your order at our restaurant' : 
                              'Recoge tu pedido en nuestro restaurante'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => handleDeliveryOptionChange('delivery')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        deliveryOption === 'delivery' ? 'border-[#3D1106] bg-[#FFF1E4] shadow-md' : 'border-gray-200 hover:border-[#3D1106]'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          deliveryOption === 'delivery' ? 'bg-[#3D1106] text-[#FFB501]' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h2a1 1 0 001-1v-1h2a1 1 0 001-1v-1h2a1 1 0 001-1V5a1 1 0 00-1-1H3zM16 5h-3V3h3v2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-[#3D1106]">{t('delivery')}</h3>
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                              deliveryOption === 'delivery' ? 'bg-[#3D1106] text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              + €2,50
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {i18n.language === 'pt' ? 'Entregamos no conforto da sua casa' : 
                              i18n.language === 'en' ? 'We deliver to your doorstep' : 
                              'Entregamos en la comodidad de tu hogar'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="text-lg font-semibold text-[#3D1106]">
                      {i18n.language === 'pt' ? 'Informações do Cliente' : 
                       i18n.language === 'en' ? 'Customer Information' : 
                       'Información del Cliente'}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-[#3D1106] mb-1">{t('firstName')}</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={deliveryDetails.firstName}
                          onChange={handleDeliveryDetailsChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1106] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-[#3D1106] mb-1">{t('lastName')}</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={deliveryDetails.lastName}
                          onChange={handleDeliveryDetailsChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1106] focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    {deliveryOption === 'delivery' && (
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-[#3D1106] mb-1">{t('address')}</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={deliveryDetails.address}
                          onChange={handleDeliveryDetailsChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1106] focus:border-transparent"
                          required={deliveryOption === 'delivery'}
                        />
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#3D1106] mb-1">{t('phone')}</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={deliveryDetails.phone}
                        onChange={handleDeliveryDetailsChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1106] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-[#3D1106] mb-1">{t('notes')}</label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={2}
                        value={deliveryDetails.notes}
                        onChange={handleDeliveryDetailsChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1106] focus:border-transparent"
                        placeholder={i18n.language === 'pt' ? 'Instruções especiais, número de apartamento, etc.' : 
                                    i18n.language === 'en' ? 'Special instructions, apartment number, etc.' : 
                                    'Instrucciones especiales, número de apartamento, etc.'}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{t('subtotal')}</span>
                      <span>€{cart.reduce((sum, item) => sum + ((item.finalPrice || item.price) * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    {deliveryOption === 'delivery' && (
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{t('deliveryFee')}</span>
                        <span>€2.50</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-[#3D1106] pt-2 border-t border-gray-200">
                      <span>{t('total')}</span>
                      <span>€{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={proceedToPayment}
                    className="w-full bg-[#3D1106] text-white py-3 px-4 rounded-lg hover:bg-[#280B04] transition-all font-bold"
                  >
                    {i18n.language === 'pt' ? 'Continuar para Pagamento' : 
                     i18n.language === 'en' ? 'Continue to Payment' : 
                     'Continuar al Pago'}
                  </button>
                </div>
              )}

              {checkoutStep === 'payment' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[#3D1106]">{t('paymentMethod')}</h3>
                  
                  <div className="space-y-3">
                    <div 
                      onClick={() => setPaymentMethod('MBWay')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        paymentMethod === 'MBWay' ? 'border-[#3D1106] bg-[#FFF1E4] shadow-md' : 'border-gray-200 hover:border-[#3D1106]'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          paymentMethod === 'MBWay' ? 'bg-[#3D1106] text-[#FFB501]' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[#3D1106]">MBWay</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {i18n.language === 'pt' ? 'Pagamento rápido e seguro pelo telemóvel' : 
                              i18n.language === 'en' ? 'Fast and secure payment via mobile' : 
                              'Pago rápido y seguro por móvil'}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'MBWay' ? 'border-[#3D1106] bg-[#3D1106]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'MBWay' && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setPaymentMethod('Cartão Visa')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        paymentMethod === 'Cartão Visa' ? 'border-[#3D1106] bg-[#FFF1E4] shadow-md' : 'border-gray-200 hover:border-[#3D1106]'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          paymentMethod === 'Cartão Visa' ? 'bg-[#3D1106] text-[#FFB501]' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1.61a10.39 10.39 0 0110.39 10.39 10.39 10.39 0 01-10.39 10.39A10.39 10.39 0 011.61 12 10.39 10.39 0 0112 1.61zm0 1.39a9 9 0 100 18 9 9 0 000-8m3.5 10.5h-7v-1h7v1z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[#3D1106]">Cartão Visa</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {i18n.language === 'pt' ? 'Pague com seu cartão Visa na entrega' : 
                              i18n.language === 'en' ? 'Pay with your Visa card on delivery' : 
                              'Pague con su tarjeta Visa en la entrega'}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'Cartão Visa' ? 'border-[#3D1106] bg-[#3D1106]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'Cartão Visa' && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setPaymentMethod('Cartão Mastercard')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        paymentMethod === 'Cartão Mastercard' ? 'border-[#3D1106] bg-[#FFF1E4] shadow-md' : 'border-gray-200 hover:border-[#3D1106]'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          paymentMethod === 'Cartão Mastercard' ? 'bg-[#3D1106] text-[#FFB501]' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1.61a10.39 10.39 0 0110.39 10.39 10.39 10.39 0 01-10.39 10.39A10.39 10.39 0 011.61 12 10.39 10.39 0 0112 1.61zm0 1.39a9 9 0 100 18 9 9 0 000-8m3.5 10.5h-7v-1h7v1z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[#3D1106]">Mastercard</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {i18n.language === 'pt' ? 'Pague com seu cartão Mastercard na entrega' : 
                              i18n.language === 'en' ? 'Pay with your Mastercard on delivery' : 
                              'Pague con su tarjeta Mastercard en la entrega'}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'Cartão Mastercard' ? 'border-[#3D1106] bg-[#3D1106]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'Cartão Mastercard' && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setPaymentMethod('Multibanco')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        paymentMethod === 'Multibanco' ? 'border-[#3D1106] bg-[#FFF1E4] shadow-md' : 'border-gray-200 hover:border-[#3D1106]'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          paymentMethod === 'Multibanco' ? 'bg-[#3D1106] text-[#FFB501]' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1.61a10.39 10.39 0 0110.39 10.39 10.39 10.39 0 01-10.39 10.39A10.39 10.39 0 011.61 12 10.39 10.39 0 0112 1.61zm0 1.39a9 9 0 100 18 9 9 0 000-8m3.5 10.5h-7v-1h7v1z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[#3D1106]">Multibanco</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {i18n.language === 'pt' ? 'Pagamento por referência Multibanco' : 
                              i18n.language === 'en' ? 'Payment via Multibanco reference' : 
                              'Pago por referencia Multibanco'}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'Multibanco' ? 'border-[#3D1106] bg-[#3D1106]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'Multibanco' && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setPaymentMethod('Dinheiro')}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        paymentMethod === 'Dinheiro' ? 'border-[#3D1106] bg-[#FFF1E4] shadow-md' : 'border-gray-200 hover:border-[#3D1106]'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          paymentMethod === 'Dinheiro' ? 'bg-[#3D1106] text-[#FFB501]' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1.61a10.39 10.39 0 0110.39 10.39 10.39 10.39 0 01-10.39 10.39A10.39 10.39 0 011.61 12 10.39 10.39 0 0112 1.61zm0 1.39a9 9 0 100 18 9 9 0 000-8m3.5 10.5h-7v-1h7v1z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[#3D1106]">
                            {i18n.language === 'pt' ? 'Dinheiro' : 
                              i18n.language === 'en' ? 'Cash' : 
                              'Efectivo'}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {i18n.language === 'pt' ? 'Pagamento em dinheiro na entrega' : 
                              i18n.language === 'en' ? 'Cash payment on delivery' : 
                              'Pago en efectivo en la entrega'}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'Dinheiro' ? 'border-[#3D1106] bg-[#3D1106]' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'Dinheiro' && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{t('subtotal')}</span>
                      <span>€{cart.reduce((sum, item) => sum + ((item.finalPrice || item.price) * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    {deliveryOption === 'delivery' && (
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{t('deliveryFee')}</span>
                        <span>€2.50</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-xl text-[#3D1106] pt-2 border-t border-gray-200">
                      <span>{t('total')}</span>
                      <span>€{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={sendOrder}
                    disabled={!paymentMethod}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 ${
                      paymentMethod 
                        ? 'bg-[#3D1106] text-white hover:bg-[#280B04] shadow-md' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {t('completeOrder')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center ${
          notification.type === 'error' 
            ? 'bg-red-100 border-l-4 border-red-500 text-red-700' 
            : 'bg-green-100 border-l-4 border-green-500 text-green-700'
        }`}
        >
          <span className="mr-2">
            {notification.type === 'error' ? '⚠️' : '✓'}
          </span>
          {notification.message}
          <button 
            onClick={() => setNotification(null)} 
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 10.586l4.293-4.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )} 

      {/* Rodapé */}
      <footer className="bg-[#FEB300] text-[#280B04] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('openingHours')}
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center border-b border-[#280B04] border-opacity-20 pb-2">
                  <span className="text-[#280B04] opacity-80 text-sm">{t('monday')}</span>
                  <span className="font-medium bg-[#FFF1E4] px-2 py-0.5 rounded-full text-xs">
                    {t('closed')}
                  </span>
                </li>
                <li className="flex justify-between border-b border-[#280B04] border-opacity-20 pb-2">
                  <span className="text-[#280B04] opacity-80 text-sm">{t('tuesdayToSaturday')}</span>
                  <span className="font-medium text-sm">12:00 – 15:30 | 19:00 – 22:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#280B04] opacity-80 text-sm">{t('sunday')}</span>
                  <span className="font-medium text-sm">12:00 – 15:30</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('addressText')}
              </h3>
              <address className="not-italic">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="font-medium text-sm hover:underline">
                      Cozinha da Vivi, Estr. de Alvor, Portimão, Faro, Portugal
                    </a>
                  </div>
                </div>
              </address>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('contact')}
              </h3>
              <div className="space-y-2">
                <a href="tel:+351933737672" className="flex items-center group transition-all hover:bg-[#FFF1E4] hover:shadow p-2 rounded-md">
                  <div className="bg-[#280B04] text-[#FEB300] p-1 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">+351 933 737 672</div>
                    <div className="text-xs text-[#280B04] opacity-80">Ligue para nós</div>
                  </div>
                </a>
                <a href="https://wa.me/351933737672" target="_blank" rel="noopener noreferrer" className="flex items-center group transition-all hover:bg-[#FFF1E4] hover:shadow p-2 rounded-md">
                  <div className="bg-[#280B04] text-[#FEB300] p-1 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-sm">WhatsApp</div>
                    <div className="text-xs text-[#280B04] opacity-80">Envie uma mensagem</div>
                  </div>
                </a>
              </div>
              
              <div className="pt-2">
                <h4 className="text-md font-medium mb-2">Siga-nos</h4>
                <div className="flex space-x-3">
                  <a href="#" className="bg-[#280B04] text-[#FEB300] p-1.5 rounded-full hover:scale-110 transition-transform">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="bg-[#280B04] text-[#FEB300] p-1.5 rounded-full hover:scale-110 transition-transform">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.597 0-2.917-.01-3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[#280B04] border-opacity-20 text-center">
          <p className="text-xs text-[#280B04] opacity-80">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs mt-1 text-[#280B04] opacity-60">
            Desenvolvido com ❤️ por Cozinha da Vivi
          </p>
        </div>
      </div>
    </footer>
  </div>
);
};

export default ClientPage;