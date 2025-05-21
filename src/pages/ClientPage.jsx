import React, { useState, useEffect,useMemo } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import ProductCard from '../components/Client/ProductCard';
import { database, ref, push, set, onValue } from '../firebase';
import { motion } from 'framer-motion';


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
          "delivery": "Entrega (+ €2,00)",
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
            "extras": "Adicionais",
            "extrasOptions": {
              "bacon": "Bacon +€1,50",
              "extraCheese": "Queijo extra +€1,00",
              "egg": "Ovo +€0,50"
            },
            "açaiOptions": {
              "granola": "Granola",
              "condensedMilk": "Leite condensado",
              "banana": "Banana",
              "strawberry": "Morango",
              "ninho": "Leite Ninho",
              "complete": "Quero Completo",
              "custom": "Personalizado",
              "pure": "Açaí Puro"
            },
            "sodaOptions": {
              "coke": "Coca-Cola",
              "sevenUp": "7Up",
              "cokeZero": "Coca-Cola Zero",
              "fanta": "Fanta Laranja",
              "guarana": "Guaraná Antarctica",
              "iceTea": "Ice Tea de Manga"
            },
            "waterOptions": {
              "still": "Água sem gás 500ml",
              "sparklingCastelo": "Água com gás Castelo",
              "sparklingPedras": "Água com gás Pedras 500ml"
            },
            "required": "*",
            "addToCart": "Adicionar ao Carrinho",
            "cancel": "Cancelar",
            "selectOptions": "Personalize seu Pedido",
            "additionalPrice": "+€{{price}}",
            "maxOptions": "Máximo {{max}} opções selecionadas",
            "meatSelection": "Escolha até 2 carnes ou apenas 'Só Maminha'",
            "chooseDrink": "Escolha sua bebida",
            "chooseSoda": "Escolha seu refrigerante",
            "chooseWater": "Escolha sua água",
            "chooseAçai": "Escolha seus acompanhamentos"
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
          "delivery": "Delivery (+ €2.00)",
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
              "Mandioca Frita": "Fried cassava",
              "Mandioca Cozida": "Cooked cassava"
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
            "extras": "Extras",
            "extrasOptions": {
              "bacon": "Bacon +€1.50",
              "extraCheese": "Extra cheese +€1.00",
              "egg": "Egg +€0.50"
            },
            "açaiOptions": {
              "granola": "Granola",
              "condensedMilk": "Condensed milk",
              "banana": "Banana",
              "strawberry": "Strawberry",
              "ninho": "Ninho milk",
              "complete": "Complete",
              "custom": "Custom",
              "pure": "Pure Açaí"
            },
            "sodaOptions": {
              "coke": "Coca-Cola",
              "sevenUp": "7Up",
              "cokeZero": "Coca-Cola Zero",
              "fanta": "Fanta Orange",
              "guarana": "Guarana Antarctica",
              "iceTea": "Mango Ice Tea"
            },
            "waterOptions": {
              "still": "Still water 500ml",
              "sparklingCastelo": "Sparkling water Castelo",
              "sparklingPedras": "Sparkling water Pedras 500ml"
            },
            "required": "*",
            "addToCart": "Add to Cart",
            "cancel": "Cancel",
            "selectOptions": "Customize Your Order",
            "additionalPrice": "+€{{price}}",
            "maxOptions": "Maximum {{max}} options selected",
            "meatSelection": "Choose up to 2 meats or just 'Only Top Sirloin'",
            "chooseDrink": "Choose your drink",
            "chooseSoda": "Choose your soda",
            "chooseWater": "Choose your water",
            "chooseAçai": "Choose your toppings"
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
          "delivery": "Entrega a Domicilio (+ €2,00)",
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
            "extras": "Extras",
            "extrasOptions": {
              "bacon": "Bacon +€1,50",
              "extraCheese": "Queso extra +€1,00",
              "egg": "Huevo +€0,50"
            },
            "açaiOptions": {
              "granola": "Granola",
              "condensedMilk": "Leche condensada",
              "banana": "Plátano",
              "strawberry": "Fresa",
              "ninho": "Leche Ninho",
              "complete": "Quiero Completo",
              "custom": "Personalizado",
              "pure": "Açaí Puro"
            },
            "sodaOptions": {
              "coke": "Coca-Cola",
              "sevenUp": "7Up",
              "cokeZero": "Coca-Cola Zero",
              "fanta": "Fanta Naranja",
              "guarana": "Guaraná Antarctica",
              "iceTea": "Té helado de mango"
            },
            "waterOptions": {
              "still": "Agua sin gas 500ml",
              "sparklingCastelo": "Agua con gas Castelo",
              "sparklingPedras": "Agua con gas Pedras 500ml"
            },
            "required": "*",
            "addToCart": "Añadir al Carrito",
            "cancel": "Cancelar",
            "selectOptions": "Personaliza tu Pedido",
            "additionalPrice": "+€{{price}}",
            "maxOptions": "Máximo {{max}} opciones selecionadas",
            "meatSelection": "Elige hasta 2 carnes o solo 'Solo Punta de Solomillo'",
            "chooseDrink": "Elige tu bebida",
            "chooseSoda": "Elige tu refresco",
            "chooseWater": "Elige tu agua",
            "chooseAçai": "Elige tus acompañamientos"
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
          image: "/images/mistadecarne.jpeg",
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
          image: "/images/maminha.jpeg"
          ,
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
                { value: 'cassavaFried',label: t('options.sideDishesOptions.cassavaFried') },
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
          image: "/images/peitofrango.jpg",
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
            image: "/images/combolanche.jpeg",
            options: {
              drinks: {
                title: t('options.chooseDrink'),
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
              },
              extras: {
                title: t('options.extras'),
                required: false,
                type: 'checkbox',
                items: [
                  { value: 'bacon', label: t('options.extrasOptions.bacon'), price: 1.50 },
                  { value: 'extraCheese', label: t('options.extrasOptions.extraCheese'), price: 1.00 },
                  { value: 'egg', label: t('options.extrasOptions.egg'), price: 0.50 }
                ]
              }
            }
          },
        { 
          id: 202, 
          name: i18n.language === 'pt' ? "X-Bacon" : 
                i18n.language === 'en' ? "Bacon Cheeseburger" : "Hamburguesa con Bacon", 
          description: i18n.language === 'pt' ? "Pão, hambúrguer, bacon, queijo, fiambre, ovo, alface, tomate, milho e batata palha." : 
                          i18n.language === 'en' ? "Bun, beef patty, bacon, cheese, ham, egg, lettuce, tomato, corn and potato sticks." : 
                          "Pan, hamburguesa, bacon, queso, jamón, huevo, lechuga, tomate, maíz y patatas paja.", 
          price: 8.00, 
          image: "/images/combolanche.jpeg",
          options: {
            drinks: {
              title: t('options.chooseDrink'),
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
            },
            extras: {
              title: t('options.extras'),
              required: false,
              type: 'checkbox',
              items: [
                { value: 'bacon', label: t('options.extrasOptions.bacon'), price: 1.50 },
                { value: 'extraCheese', label: t('options.extrasOptions.extraCheese'), price: 1.00 },
                { value: 'egg', label: t('options.extrasOptions.egg'), price: 0.50 }
              ]
            }
          }
        },
        { 
          id: 203, 
          name: i18n.language === 'pt' ? "X-Frango" : 
                i18n.language === 'en' ? "Chicken Burger" : "Pollo Burger", 
          description: i18n.language === 'pt' ? "Pão, hambúrguer de frango, queijo, fiambre, ovo, alface, tomate, milho e batata palha." : 
                          i18n.language === 'en' ? "Bun, chicken patty, cheese, ham, egg, lettuce, tomato, corn and potato sticks." : 
                          "Pan, hamburguesa de pollo, queso, jamón, huevo, lechuga, tomate, maíz y patatas paja.", 
          price: 8.00, 
          image: "/images/combolanche.jpeg",
          options: {
            drinks: {
              title: t('options.chooseDrink'),
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
            },
            extras: {
              title: t('options.extras'),
              required: false,
              type: 'checkbox',
              items: [
                { value: 'bacon', label: t('options.extrasOptions.bacon'), price: 1.50 },
                { value: 'extraCheese', label: t('options.extrasOptions.extraCheese'), price: 1.00 },
                { value: 'egg', label: t('options.extrasOptions.egg'), price: 0.50 }
              ]
            }
          }
        },
        
        { 
          id: 204, 
          name: i18n.language === 'pt' ? "X-Especial" : 
                i18n.language === 'en' ? "Special Burger" : "Hamburguesa Especial", 
          description: i18n.language === 'pt' ? "Pão, hambúrguer, queijo, fiambre, ovo, alface, tomate, milho e batata palha." : 
                          i18n.language === 'en' ? "Bun, beef patty, cheese, ham, egg, lettuce, tomato, corn and potato sticks." : 
                          "Pan, hamburguesa, queso, jamón, huevo, lechuga, tomate, maíz y patatas paja.", 
          price: 7.00, 
          image: "/images/combolanche.jpeg",
          options: {
            drinks: {
              title: t('options.chooseDrink'),
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
            },
            extras: {
              title: t('options.extras'),
              required: false,
              type: 'checkbox',
              items: [
                { value: 'bacon', label: t('options.extrasOptions.bacon'), price: 1.50 },
                { value: 'extraCheese', label: t('options.extrasOptions.extraCheese'), price: 1.00 },
                { value: 'egg', label: t('options.extrasOptions.egg'), price: 0.50 }
              ]
            }
          }
        },
        { 
          id: 205, 
          name: i18n.language === 'pt' ? "X-Tudo" : 
                i18n.language === 'en' ? "The Works Burger" : "Hamburguesa Completa", 
          description: i18n.language === 'pt' ? "Pão, hambúrguer, Bacon, queijo, fiambre, Salsicha, ovo, alface, tomate, milho e batata palha." : 
                          i18n.language === 'en' ? "Bun, beef patty, bacon, cheese, ham, sausage, egg, lettuce, tomato, corn and potato sticks." : 
                          "Pan, hamburguesa, bacon, queso, jamón, salchicha, huevo, lechuga, tomate, maíz y patatas paja.", 
          price: 9.00, 
          image: "/images/combolanche.jpeg",
          options: {
            drinks: {
              title: t('options.chooseDrink'),
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
            },
            extras: {
              title: t('options.extras'),
              required: false,
              type: 'checkbox',
              items: [
                { value: 'bacon', label: t('options.extrasOptions.bacon'), price: 1.50 },
                { value: 'extraCheese', label: t('options.extrasOptions.extraCheese'), price: 1.00 },
                { value: 'egg', label: t('options.extrasOptions.egg'), price: 0.50 }
              ]
            }
          }
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
          image: "/images/combolanche.jpeg",
          options: {
            drinks: {
              title: t('options.chooseDrink'),
              required: false,
              type: 'radio',
              items: [
                { value: 'none', label: t('options.drinksOptions.none'), default: true },
                { value: 'waterStill', label: t('options.drinksOptions.waterStill') },
                { value: 'waterSparklingCastelo', label: t('options.drinksOptions.waterSparklingCastelo') },
                { value: 'waterSparklingPedras', label: t('options.drinksOptions.waterSparklingPedras') },
                { value: 'coke', label: t('options.drinksOptions.coke') },
                { value: 'cokeZero', label: t('options.drinksOptions.cokeZero') },
                { value: 'fanta', label: t('options.drinksOptions.fanta') },
                { value: 'guarana', label: t('options.drinksOptions.guarana') },
                { value: 'iceTea', label: t('options.drinksOptions.iceTea') }
              ]
            }
          }
        },
        { 
          id: 302, 
          name: i18n.language === 'pt' ? "Combo X-Tudo" : 
                i18n.language === 'en' ? "The Works Combo" : "Combo Completo", 
          description: i18n.language === 'pt' ? "Sanduíche completo com batata frita e bebida. Economize €3,00 em relação à compra separada." : 
                          i18n.language === 'en' ? "Complete sandwich with fries and drink. Save €3.00 compared to separate purchase." : 
                          "Sándwich completo con patatas fritas y bebida. Ahorra €3,00 en comparación con la compra por separado.", 
          price: 12.00, 
          image: "/images/combolanche.jpeg",
          options: {
            drinks: {
              title: t('options.chooseDrink'),
              required: false,
              type: 'radio',
              items: [
                { value: 'none', label: t('options.drinksOptions.none'), default: true },
                { value: 'waterStill', label: t('options.drinksOptions.waterStill') },
                { value: 'waterSparklingCastelo', label: t('options.drinksOptions.waterSparklingCastelo') },
                { value: 'waterSparklingPedras', label: t('options.drinksOptions.waterSparklingPedras') },
                { value: 'coke', label: t('options.drinksOptions.coke') },
                { value: 'cokeZero', label: t('options.drinksOptions.cokeZero') },
                { value: 'fanta', label: t('options.drinksOptions.fanta') },
                { value: 'guarana', label: t('options.drinksOptions.guarana') },
                { value: 'iceTea', label: t('options.drinksOptions.iceTea') }
              ]
            }
          }
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
          image: "/images/arroz.png" 
        },
        { 
          id: 402, 
          name: i18n.language === 'pt' ? "Queijo Coalho" : 
                i18n.language === 'en' ? "Grilled Cheese" : "Queso Coalho", 
          description: i18n.language === 'pt' ? "Queijo coalho grelhado, tradicional do nordeste brasileiro, perfeito para acompanhar molhos." : 
                          i18n.language === 'en' ? "Grilled coalho cheese, traditional from northeastern Brazil, perfect to accompany sauces." : 
                          "Queso coalho a la parrilla, tradicional del noreste de Brasil, perfecto para acompañar salsas.", 
          price: 6.00, 
          image: "/images/queijo.jpeg" 
        },
        { 
          id: 403, 
          name: i18n.language === 'pt' ? "Torresmo" : 
                i18n.language === 'en' ? "Pork Cracklings" : "Torreznos", 
          description: i18n.language === 'pt' ? "Torresmo brasileiro: crocante e delicioso, feito com pedaços de carne de porco, ideal para acompanhar uma cerveja gelada." : 
                          i18n.language === 'en' ? "Brazilian pork cracklings: crispy and delicious, made with pieces of pork, ideal to accompany an ice-cold beer." : 
                          "Torreznos brasileños: crujientes y deliciosos, hechos con trozos de cerdo, ideales para acompañar una cerveza bien fría.", 
          price: 6.00, 
          image: "/images/torresmo.jpeg" 
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
          id: 501, 
          name: i18n.language === 'pt' ? "Refrigerantes" : 
                i18n.language === 'en' ? "Soft Drinks" : "Refrescos", 
          description: i18n.language === 'pt' ? "Selecione seu refrigerante preferido. Todos em lata 350ml, geladinhos." : 
                          i18n.language === 'en' ? "Select your favorite soft drink. All in 350ml cans, ice cold." : 
                          "Selecciona tu refresco preferido. Todos en lata de 350ml, bien fríos.", 
          price: 2.00, 
          image: "/images/vivi-aguas.jpg",
          options: {
            sodas: {
              title: t('options.chooseSoda'),
              required: true,
              type: 'checkbox',
              items: [
                { value: 'coke', label: t('options.sodaOptions.coke') },
                { value: 'sevenUp', label: t('options.sodaOptions.sevenUp') },
                { value: 'cokeZero', label: t('options.sodaOptions.cokeZero') },
                { value: 'fanta', label: t('options.sodaOptions.fanta') },
                { value: 'guarana', label: t('options.sodaOptions.guarana') },
                { value: 'iceTea', label: t('options.sodaOptions.iceTea') }
              ]
            }
          }
        },
        { 
          id: 502, 
          name: i18n.language === 'pt' ? "Águas" : 
                i18n.language === 'en' ? "Waters" : "Aguas", 
          description: i18n.language === 'pt' ? "Selecione sua água preferida." : 
                          i18n.language === 'en' ? "Select your preferred water." : 
                          "Selecciona tu agua preferida.", 
          price: 1.00, 
          image: "/images/vivi-aguas.jpg",
          options: {
            waters: {
              title: t('options.chooseWater'),
              required: true,
              type: 'checkbox',
              items: [
                { value: 'still', label: t('options.waterOptions.still'), price: 1.00 },
                { value: 'sparklingCastelo', label: t('options.waterOptions.sparklingCastelo'), price: 1.50 },
                { value: 'sparklingPedras', label: t('options.waterOptions.sparklingPedras'), price: 1.50 }
              ]
            }
          }
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
                i18n.language === 'en' ? "Small Açai Bowl" : "Açaí Pequeño", 
          description: i18n.language === 'pt' ? "Açai cremoso com acompanhamentos à escolha. Tamanho pequeno (300ml)." : 
                          i18n.language === 'en' ? "Creamy açai with toppings of your choice. Small size (300ml)." : 
                          "Açaí cremoso con acompañamientos a elegir. Tamaño pequeño (300ml).", 
          price: 6.00, 
          image: "/images/Acai.png",
          options: {
            toppings: {
              title: t('options.chooseAçai'),
              required: true,
              type: 'radio',
              items: [
                { value: 'complete', label: t('options.açaiOptions.complete'), description: t('options.açaiOptions.complete') },
                { value: 'custom', label: t('options.açaiOptions.custom'), description: t('options.açaiOptions.custom') },
                { value: 'pure', label: t('options.açaiOptions.pure'), description: t('options.açaiOptions.pure') }
              ],
              customOptions: {
                title: t('options.chooseAçai'),
                type: 'checkbox',
                items: [
                  { value: 'granola', label: t('options.açaiOptions.granola') },
                  { value: 'condensedMilk', label: t('options.açaiOptions.condensedMilk') },
                  { value: 'banana', label: t('options.açaiOptions.banana') },
                  { value: 'strawberry', label: t('options.açaiOptions.strawberry') },
                  { value: 'ninho', label: t('options.açaiOptions.ninho') }
                ]
              }
            }
          }
        },
        { 
          id: 602, 
          name: i18n.language === 'pt' ? "Açai Grande" : 
                i18n.language === 'en' ? "Large Açai Bowl" : "Açai Grande", 
          description: i18n.language === 'pt' ? "Açai cremoso com acompanhamentos à escolha. Tamanho grande (500ml)." : 
                          i18n.language === 'en' ? "Creamy açai with toppings of your choice. Large size (500ml)." : 
                          "Açai cremoso con acompañamientos a elegir. Tamaño grande (500ml).", 
          price: 10.00, 
          image: "/images/Acai.png",
          options: {
            toppings: {
              title: t('options.chooseAçai'),
              required: true,
              type: 'radio',
              items: [
                { value: 'complete', label: t('options.açaiOptions.complete'), description: t('options.açaiOptions.complete') },
                { value: 'custom', label: t('options.açaiOptions.custom'), description: t('options.açaiOptions.custom') },
                { value: 'pure', label: t('options.açaiOptions.pure'), description: t('options.açaiOptions.pure') }
              ],
              customOptions: {
                title: t('options.chooseAçai'),
                type: 'checkbox',
                items: [
                  { value: 'granola', label: t('options.açaiOptions.granola') },
                  { value: 'condensedMilk', label: t('options.açaiOptions.condensedMilk') },
                  { value: 'banana', label: t('options.açaiOptions.banana') },
                  { value: 'strawberry', label: t('options.açaiOptions.strawberry') },
                  { value: 'ninho', label: t('options.açaiOptions.ninho') }
                ]
              }
            }
          }
        },
        
        { 
          id: 603, 
          name: i18n.language === 'pt' ? "Pudim Caseiro" : 
                i18n.language === 'en' ? "Homemade Pudding" : "Flan Casero", 
          description: i18n.language === 'pt' ? "Pudim tradicional caseiro com calda de caramelo. Feito com ingredientes selecionados." : 
                          i18n.language === 'en' ? "Traditional homemade pudding with caramel sauce. Made with selected ingredients." : 
                          "Flan tradicional casero con salsa de caramelo. Hecho con ingredientes seleccionados.", 
          price: 3.00, 
          image: "/images/pudim.jpeg" 
        }
      ]
    }
  ];

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
  postalCode: '', 
  phone: '',
  notes: ''
});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const [meatSelectionError, setMeatSelectionError] = useState('');
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [unavailableItems, setUnavailableItems] = useState([]);
  const [showWhatsappRedirect, setShowWhatsappRedirect] = useState(false);
  const [countdown, setCountdown] = useState(40);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);


   const allProducts = categories.flatMap(category => category.products);

 const filteredProducts = useMemo(() => {
  const products = activeCategory === 'all' 
    ? allProducts 
    : categories.find(cat => cat.id === activeCategory)?.products || [];
  return products.filter(product => !unavailableItems.includes(product.id.toString()));
}, [activeCategory, allProducts, categories, unavailableItems]);

  const PremiumCartIcon = ({ count }) => (
    <motion.div
      className="relative p-2 rounded-full"
      whileHover={{
        scale: 1.05,
        borderColor: '#000',
      }}
      transition={{ type: 'spring', stiffness: 400 }}
      style={{
        border: '1px solid transparent',
        backgroundColor: 'transparent',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000"
        strokeWidth="1.8"
      >
        <path d="M4 19a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" strokeLinecap="round" />
        <path d="M16 19a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" strokeLinecap="round" />
        <path d="M4 14h2.5l3-10h9.5l-2 6h-12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 14h8" strokeLinecap="round" />
      </svg>
  
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-600 text-white text-xs
                     font-semibold w-5 h-5 flex items-center justify-center rounded-full
                     border border-white shadow"
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      )}
    </motion.div>
  );

  const PremiumOptionsModal = ({ 
    product, 
    onClose, 
    onConfirm,
    t
  }) => {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [additionalPrice, setAdditionalPrice] = useState(0);
    const [meatSelectionError, setMeatSelectionError] = useState('');
    const [activeTab, setActiveTab] = useState('');
  
    useEffect(() => {
      if (product?.options) {
        const defaultOptions = {};
        Object.entries(product.options).forEach(([optionName, optionData]) => {
          if (optionData.required) {
            if (optionData.type === 'radio') {
              const defaultItem = optionData.items.find(item => item.default) || optionData.items[0];
              if (defaultItem) {
                defaultOptions[optionName] = defaultItem.value;
              }
            } else if (optionData.type === 'checkbox') {
              defaultOptions[optionName] = [];
            }
          }
        });
        setSelectedOptions(defaultOptions);
        setActiveTab(Object.keys(product.options)[0] || '');
      }
    }, [product]);

    const isMeatOptionDisabled = (optionValue) => {
      if (!product.options?.meats) return false;
      
      const selectedMeats = selectedOptions.meats || [];
      const hasOnlyTopSirloin = selectedMeats.includes('onlyTopSirloin');
      const maxMeats = product.options.meats.max || 2;
      
      if (hasOnlyTopSirloin && optionValue !== 'onlyTopSirloin') return true;
      if (!hasOnlyTopSirloin && selectedMeats.length >= maxMeats && 
          !selectedMeats.includes(optionValue) && optionValue !== 'onlyTopSirloin') return true;
      
      return false;
    };


  
    const validateMeatSelection = () => {
      if (!product.options?.meats) return true;
      
      const selectedMeats = selectedOptions.meats || [];
      const hasOnlyTopSirloin = selectedMeats.includes('onlyTopSirloin');
      
      if (selectedMeats.length === 0) {
        setMeatSelectionError(t('options.meatSelection'));
        return false;
      }
      
      if (hasOnlyTopSirloin && selectedMeats.length > 1) {
        setMeatSelectionError(t('options.meatSelection'));
        return false;
      }
      
      if (!hasOnlyTopSirloin && selectedMeats.length > 2) {
        setMeatSelectionError(t('options.maxOptions', { max: 2 }));
        return false;
      }
      
      setMeatSelectionError('');
      return true;
    };
  
    const handleOptionSelect = (optionName, value, price = 0, isChecked = false, optionData = {}) => {
      setSelectedOptions(prev => {
        const newOptions = {...prev};
        
        if (optionData.type === 'checkbox') {
          newOptions[optionName] = newOptions[optionName] || [];
          
          if (optionData.exclusive) {
            newOptions[optionName] = isChecked ? [value] : [];
          } else {
            if (value !== 'onlyTopSirloin') {
              newOptions[optionName] = newOptions[optionName].filter(item => item !== 'onlyTopSirloin');
            }
            
            if (isChecked) {
              newOptions[optionName] = [...newOptions[optionName], value];
            } else {
              newOptions[optionName] = newOptions[optionName].filter(item => item !== value);
            }
          }
        } else {
          newOptions[optionName] = value;
          
          if (optionName === 'toppings' && value !== 'custom') {
            delete newOptions.toppingsCustom;
          }
        }
        
        return newOptions;
      });
    
      if (isChecked) {
        setAdditionalPrice(prev => prev + (price || 0));
      } else {
        setAdditionalPrice(prev => prev - (price || 0));
      }
    };
  
    const renderOptionItem = (optionName, optionData, item, index) => {
      const isRadio = optionData.type === 'radio';
      let isChecked = isRadio 
        ? selectedOptions[optionName] === item.value 
        : (selectedOptions[optionName] || []).includes(item.value);
    
      if (optionName === 'toppings' && selectedOptions.toppings === 'complete' && item.value === 'complete') {
        isChecked = true;
      }
    
      return (
        <div 
          key={index}
          onClick={() => {
            if (optionName === 'meats' && isMeatOptionDisabled(item.value)) return;
    
            if (optionName === 'toppings' && item.value === 'complete') {
              handleOptionSelect(optionName, 'complete', 0, true, optionData);
            } else if (optionName === 'toppings' && item.value === 'pure') {
              handleOptionSelect(optionName, 'pure', 0, true, optionData);
            } else if (optionName === 'toppings' && item.value === 'custom') {
              handleOptionSelect(optionName, 'custom', 0, true, optionData);
            } else {
              handleOptionSelect(
                optionName,
                item.value,
                item.price || 0,
                !isChecked,
                optionData
              );
            }
    
            if (optionName === 'meats') {
              validateMeatSelection();
            }
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
              {item.description && (
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        </div>
      );
    };
  
    const renderCustomToppings = () => {
      if (selectedOptions.toppings !== 'custom') return null;
      
      return (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">{t('options.chooseAçai')}</h4>
          <div className="grid grid-cols-1 gap-2">
            {product.options.toppings.customOptions.items.map((item, index) => {
              const isChecked = (selectedOptions.toppingsCustom || []).includes(item.value);
              
              return (
                <div 
                  key={index}
                  onClick={() => {
                    setSelectedOptions(prev => {
                      const newToppings = [...(prev.toppingsCustom || [])];
                      if (isChecked) {
                        return {
                          ...prev,
                          toppingsCustom: newToppings.filter(t => t !== item.value)
                        };
                      } else {
                        return {
                          ...prev,
                          toppingsCustom: [...newToppings, item.value]
                        };
                      }
                    });
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    isChecked ? 'bg-[#FFF5EB] border border-[#3D1106]' : 'bg-white border border-gray-200'
                  } cursor-pointer hover:bg-[#FFF5EB]`}
                >
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                      isChecked ? 'bg-[#3D1106]' : 'border border-gray-400'
                    }`}>
                      {isChecked && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };
  
    const handleConfirm = async () => {
      if (product.options?.meats && !validateMeatSelection()) {
        return;
      }
    
      const optionsToSave = {
        ...selectedOptions,
      };
    
      const success = await onConfirm(optionsToSave, additionalPrice);
      if (success) {
        onClose();
      }
    };
  
    const optionKeys = product?.options ? Object.keys(product.options) : [];
  
    return (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div 
          className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-fadeInUp"
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
  
          {optionKeys.length > 0 && (
            <>
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {optionKeys.map((optionName) => (
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
                {optionKeys.map((optionName) => (
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
                      {product.options[optionName].items.map((item, index) => (
                        renderOptionItem(optionName, product.options[optionName], item, index)
                      ))}
                    </div>
  
                    {optionName === 'toppings' && renderCustomToppings()}
                  </div>
                ))}
              </div>
            </>
          )}
  
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
              onClick={handleConfirm}
              className="px-3 py-1.5 bg-[#3D1106] hover:bg-[#5A1B0D] text-[#FFB501] rounded-md text-sm font-medium"
            >
              + {t('options.addToCart')}
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const addToCart = (product) => {
    setSelectedProduct(product);
    setSelectedOptions({});
    setAdditionalPrice(0);
    setMeatSelectionError('');
    setShowOptionsModal(true);
  };

  const confirmAddToCart = (selectedOptions, additionalPrice) => {
    try {
      if (!selectedProduct) {
        throw new Error("Nenhum produto selecionado");
      }
  
      if (selectedProduct.options?.meats) {
        const selectedMeats = selectedOptions.meats || [];
        const hasOnlyTopSirloin = selectedMeats.includes('onlyTopSirloin');
        
        if (selectedMeats.length === 0) {
          setMeatSelectionError(t('options.meatSelection'));
          return false;
        }
        
        if (hasOnlyTopSirloin && selectedMeats.length > 1) {
          setMeatSelectionError(t('options.meatSelection'));
          return false;
        }
      }
  
      const optionsDescription = [];
      if (selectedProduct.options) {
        Object.entries(selectedProduct.options).forEach(([optionName, optionData]) => {
          const selectedValue = selectedOptions[optionName];
          
          if (optionName === 'toppings') {
            if (selectedValue === 'complete') {
              optionsDescription.push(`${optionData.title}: ${t('options.açaiOptions.complete')}`);
            } else if (selectedValue === 'pure') {
              optionsDescription.push(`${optionData.title}: ${t('options.açaiOptions.pure')}`);
            } else if (selectedValue === 'custom' && selectedOptions.toppingsCustom) {
              const customToppings = selectedProduct.options.toppings.customOptions.items
                .filter(item => selectedOptions.toppingsCustom.includes(item.value))
                .map(item => item.label)
                .join(', ');
              optionsDescription.push(`${optionData.title}: ${customToppings}`);
            }
          } else if (optionData.type === 'radio' && selectedValue && selectedValue !== 'none') {
            const selectedItem = optionData.items.find(item => item.value === selectedValue);
            if (selectedItem) {
              optionsDescription.push(`${t(optionData.title)}: ${t(selectedItem.label)}`);
            }
          } else if (optionData.type === 'checkbox' && Array.isArray(selectedValue)) {
            const selectedLabels = optionData.items
              .filter(item => selectedValue.includes(item.value))
              .map(item => item.label);
            
            if (selectedLabels.length > 0) {
              optionsDescription.push(`${optionData.title}: ${selectedLabels.join(', ')}`);
            }
          }
        });
      }
      
      const cartItem = {
        ...selectedProduct,
        id: `${selectedProduct.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        quantity: 1,
        selectedOptions,
        additionalPrice,
        finalPrice: selectedProduct.price + additionalPrice,
        customizations: optionsDescription.join('; '),
        type: selectedProduct.type || 'food',
        category: selectedProduct.category || 'Geral'
      };
  
      setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(item => 
          item.id === selectedProduct.id &&
          JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
        );
  
        if (existingItemIndex >= 0) {
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += 1;
          return updatedCart;
        }
        
        return [...prevCart, cartItem];
      });
  
      setNotification({
        message: `${selectedProduct.name} ${t('options.addToCart')}`,
        type: 'success'
      });
  
      return true;
  
    } catch (error) {
      setNotification({
        message: error.message,
        type: 'error'
      });
      return false;
    }
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
    const deliveryFee = deliveryOption === 'delivery' ? 2.0 : 0;
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

  if (deliveryOption === 'delivery' && !deliveryDetails.postalCode) {
    setNotification({
      message: i18n.language === 'pt' ? 'Por favor, informe o código postal' :
                i18n.language === 'en' ? 'Please provide the postal code' :
                'Por favor, proporcione el código postal',
      type: 'error'
    });
    return;
  }

  setShowCart(false);
  setCheckoutStep('cart');

  const processedItems = cart.map(item => ({
    id: item.id,
    name: item.name,
    price: item.finalPrice || item.price,
    quantity: item.quantity,
    category: item.category,
    type: item.type || 'food',
    options: item.selectedOptions || null,
    notes: item.notes || '',
    customizations: item.customizations || ''
  }));

  const orderData = {
    items: processedItems.reduce((acc, item, index) => {
      acc[`item_${index}`] = item;
      return acc;
    }, {}),
    customerName: deliveryDetails.firstName + (deliveryDetails.lastName ? ' ' + deliveryDetails.lastName : ''),
    customerPhone: deliveryDetails.phone,
    paymentMethod,
    status: 'pending',
    orderType: deliveryOption,
    createdAt: new Date().toISOString(),
    subtotal: cart.reduce((sum, item) => sum + ((item.finalPrice || item.price) * item.quantity), 0),
    deliveryFee: deliveryOption === 'delivery' ? 2.0 : 0,
    total: calculateTotal(),
    source: 'online',
    ...(deliveryOption === 'delivery' && { 
      deliveryAddress: deliveryDetails.address,
      postalCode: deliveryDetails.postalCode // GARANTINDO QUE O CÓDIGO POSTAL É ENVIADO
    }),
    ...(deliveryDetails.notes && { notes: deliveryDetails.notes })
  };

  try {
    const orderRef = push(ref(database, 'orders'));
    await set(orderRef, orderData);
    
    // Preparar mensagem para WhatsApp
    let whatsappMessage = i18n.language === 'pt' ? '🍽️ *NOVO PEDIDO - Cozinha da Vivi* 🍽️\n\n' :
                        i18n.language === 'en' ? '🍽️ *NEW ORDER - Cozinha da Vivi* 🍽️\n\n' :
                        '🍽️ *NUEVO PEDIDO - Cozinha da Vivi* 🍽️\n\n';
    
    whatsappMessage += cart.map(item => {
      let itemText = `✔️ ${item.name} (${item.quantity}x) - €${((item.finalPrice || item.price) * item.quantity).toFixed(2)}`;
      
      if (item.customizations) {
        itemText += '\n   - ' + item.customizations.split('; ').join('\n   - ');
      }
      
      return itemText;
    }).join('\n');
    
    whatsappMessage += i18n.language === 'pt' ? 
      `\n\n🚚 *Tipo de Pedido:* ${deliveryOption === 'delivery' ? 'Entrega (+€2.00)' : 'Retirada no Local'}` +
      `\n👤 *Nome:* ${deliveryDetails.firstName} ${deliveryDetails.lastName || ''}` +
      (deliveryOption === 'delivery' ? `\n🏠 *Endereço:* ${deliveryDetails.address}` : '') +
      (deliveryOption === 'delivery' ? `\n📮 *Código Postal:* ${deliveryDetails.postalCode}` : '') +
      `\n📞 *Telefone:* ${deliveryDetails.phone}` +
      (deliveryDetails.notes ? `\n📝 *Observações:* ${deliveryDetails.notes}` : '') +
      `\n\n💳 *Pagamento:* ${paymentMethod}` +
      `\n💰 *Subtotal:* €${orderData.subtotal.toFixed(2)}` +
      (deliveryOption === 'delivery' ? `\n🚚 *Taxa de Entrega:* €2.00` : '') +
      `\n💵 *Total a Pagar:* €${orderData.total.toFixed(2)}` :
      i18n.language === 'en' ? 
      `\n\n🚚 *Order Type:* ${deliveryOption === 'delivery' ? 'Delivery (+€2.00)' : 'Pickup'}` +
      `\n👤 *Name:* ${deliveryDetails.firstName} ${deliveryDetails.lastName || ''}` +
      (deliveryOption === 'delivery' ? `\n🏠 *Address:* ${deliveryDetails.address}` : '') +
      (deliveryOption === 'delivery' ? `\n📮 *Postal Code:* ${deliveryDetails.postalCode}` : '') +
      `\n📞 *Phone:* ${deliveryDetails.phone}` +
      (deliveryDetails.notes ? `\n📝 *Notes:* ${deliveryDetails.notes}` : '') +
      `\n\n💳 *Payment:* ${paymentMethod}` +
      `\n💰 *Subtotal:* €${orderData.subtotal.toFixed(2)}` +
      (deliveryOption === 'delivery' ? `\n🚚 *Delivery Fee:* €2.00` : '') +
      `\n💵 *Total:* €${orderData.total.toFixed(2)}` :
      `\n\n🚚 *Tipo de Pedido:* ${deliveryOption === 'delivery' ? 'Entrega (+€2.00)' : 'Recoger en Local'}` +
      `\n👤 *Nombre:* ${deliveryDetails.firstName} ${deliveryDetails.lastName || ''}` +
      (deliveryOption === 'delivery' ? `\n🏠 *Dirección:* ${deliveryDetails.address}` : '') +
      (deliveryOption === 'delivery' ? `\n📮 *Código Postal:* ${deliveryDetails.postalCode}` : '') +
      `\n📞 *Teléfono:* ${deliveryDetails.phone}` +
      (deliveryDetails.notes ? `\n📝 *Observaciones:* ${deliveryDetails.notes}` : '') +
      `\n\n💳 *Pago:* ${paymentMethod}` +
      `\n💰 *Subtotal:* €${orderData.subtotal.toFixed(2)}` +
      (deliveryOption === 'delivery' ? `\n🚚 *Gastos de Envío:* €2.00` : '') +
      `\n💵 *Total:* €${orderData.total.toFixed(2)}`;

    const phone = '+351928145225';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
    setWhatsappUrl(url);
    
    // Mostra o modal primeiro
    setShowSuccessModal(true);
    setShowWhatsappRedirect(true);
    setCountdown(40);
    
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

// E o useEffect para gerenciar o contador:
useEffect(() => {
  if (showWhatsappRedirect) {
    const timer = setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setShowWhatsappRedirect(false);
      setShowSuccessModal(false);
      
      // Limpar carrinho e dados
      setCart([]);
      setDeliveryDetails({
        firstName: '',
        lastName: '',
        address: '',
        postalCode: '', 
        phone: '',
        notes: ''
      });
      setPaymentMethod('');
    }, 40000); // Alterado de 10000 para 15000

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }
}, [showWhatsappRedirect, whatsappUrl]);

 const resetToHome = () => {
  setActiveCategory('all');
  setShowCart(false);
  setCheckoutStep('cart');
  window.scrollTo(0, 0);
};

const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  setLanguageDropdownOpen(false);
};
 
  return (
    <div className="min-h-screen bg-[#FFF1E4] flex flex-col">


{showSuccessModal && (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-90 p-4">
    <motion.div 
      className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Cabeçalho premium */}
      <div className="bg-gradient-to-r from-[#3D1106] to-[#5A1B0D] p-6 text-white relative">
        <div className="flex items-center justify-center space-x-3">
          <svg className="w-10 h-10 text-[#FFB501]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-2xl font-bold">
            {i18n.language === 'pt' ? 'Pedido Confirmado!' : 
             i18n.language === 'en' ? 'Order Confirmed!' : 
             '¡Pedido Confirmado!'}
          </h3>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFB501] opacity-50"></div>
      </div>

      {/* Corpo do modal */}
      <div className="p-6 text-center">
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-800 mb-4">
            {i18n.language === 'pt' ? 'Falta apenas um passo!' : 
             i18n.language === 'en' ? 'Just one more step!' : 
             '¡Solo un paso más!'}
          </p>
          
          <p className="text-gray-600 mb-6">
            {i18n.language === 'pt' ? 'Clique no botão abaixo para enviar seu pedido pelo WhatsApp e concluir o processo.' : 
             i18n.language === 'en' ? 'Click the button below to send your order via WhatsApp and complete the process.' : 
             'Haz clic en el botón de abajo para enviar tu pedido por WhatsApp y completar el proceso.'}
          </p>
          
          <div className="bg-[#FFF5EB] p-4 rounded-lg border border-[#FFB501] mb-6">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5 text-[#3D1106]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-[#3D1106]">
                {i18n.language === 'pt' ? 'Tempo estimado de preparo: 30-40 minutos' : 
                 i18n.language === 'en' ? 'Estimated preparation time: 30-40 minutes' : 
                 'Tiempo estimado de preparación: 30-40 minutos'}
              </span>
            </div>
          </div>
        </div>

        {/* Temporizador visual aumentado para 10 segundos */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">
              {i18n.language === 'pt' ? 'Redirecionando em:' : 
               i18n.language === 'en' ? 'Redirecting in:' : 
               'Redirigiendo en:'}
            </span>
            <span className="text-lg font-bold text-[#3D1106]">{countdown}s</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div 
                className="bg-gradient-to-r from-[#FFB501] to-[#E67E22] h-2.5 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 40, ease: "linear" }} 
              />
            </div>
        </div>

        {/* Botão de ação */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => {
              window.open(whatsappUrl, '_blank');
              setShowSuccessModal(false);
              setShowWhatsappRedirect(false);
              // Limpar carrinho e dados
              setCart([]);
              setDeliveryDetails({
                firstName: '',
                lastName: '',
                address: '',
                postalCode: '',
                phone: '',
                notes: ''
              });
              setPaymentMethod('');
            }}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>
              {i18n.language === 'pt' ? 'Enviar no WhatsApp' : 
               i18n.language === 'en' ? 'Send via WhatsApp' : 
               'Enviar por WhatsApp'}
            </span>
          </button>

          <button
            onClick={() => {
              setShowSuccessModal(false);
              setShowWhatsappRedirect(false);
              // Apenas fecha o modal, sem redirecionamento
            }}
            className="w-full border border-[#3D1106] text-[#3D1106] hover:bg-[#3D1106] hover:text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300"
          >
            {i18n.language === 'pt' ? 'Cancelar' : 
             i18n.language === 'en' ? 'Cancel' : 
             'Cancelar'}
          </button>
        </div>
      </div>
    </motion.div>
  </div>
)}

      <header className="bg-[#FFF1E4] text-[#3D1106] p-4 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            onClick={resetToHome}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img src="/images/logovivi.jpg" alt="Logo" className="h-10 w-10 rounded-full hover:scale-110 transition-transform" />
            <h1 className="text-lg md:text-xl font-bold font-serif text-[#3D1106] hover:text-[#280B04] transition-colors">
              Cozinha da Vivi
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
              className="relative p-2 rounded-full hover:text-[#FFB501] transition-all duration-300"
            >
              <PremiumCartIcon count={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-[#FFF1E4] shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 text-center">Menu</h2>
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#E67E22] to-transparent mx-auto mt-2"></div>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex flex-col items-center px-3 py-1 rounded-lg whitespace-nowrap transition-all duration-300 ${
                activeCategory === 'all' 
                  ? 'bg-[#3D1106] text-[#FFB501] shadow-md' 
                  : 'bg-transparent text-[#3D1106] hover:bg-[#FFF1E4]'
              } border border-[#3D1106]`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-xs mt-1">{t('categories.all')}</span>
            </button>

            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center px-3 py-1 rounded-lg whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'bg-[#3D1106] text-[#FFB501] shadow-md' 
                    : 'bg-transparent text-[#3D1106] hover:bg-[#FFF1E4]'
                } border border-[#3D1106]`}
              >
                {React.cloneElement(category.icon, {
                  className: `h-5 w-5 ${activeCategory === category.id ? 'text-[#FFB501]' : 'text-[#3D1106]'}`
                })}
                <span className="text-xs mt-1">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

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
                unavailableItems={unavailableItems}
                backgroundColor="#FFFBF7"
              />           
            </div>
          ))}
        </div>
      </main>

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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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
                                {item.customizations && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {item.customizations.split('; ').map((custom, index) => (
                                      <div key={index}>{custom}</div>
                                    ))}
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
                              + €2,00
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
                        <>
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
                          <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-[#3D1106] mb-1">{('Codigo Postal')}</label>
                            <input
                              type="text"
                              id="postalCode"
                              name="postalCode"
                              value={deliveryDetails.postalCode}
                              onChange={handleDeliveryDetailsChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D1106] focus:border-transparent"
                              required={deliveryOption === 'delivery'}
                              placeholder="8500-000"
                            />
                          </div>
                        </>
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
                        <span>€2.00</span>
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
                          {i18n.language === 'pt' ? 'Receberá uma solicitação de pagamento do número 922271991' : 
                          i18n.language === 'en' ? 'You will receive a payment request from the number 92922271991' : 
                          'Recibirá una solicitud de pago del número 922271991'}
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
                        <span>€2.00</span>
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
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center ${
      notification.type === 'error' 
        ? 'bg-red-50 border border-red-200 text-red-700' 
        : 'bg-green-50 border border-green-200 text-green-700'
    }`}
    style={{
      maxWidth: 'calc(100% - 2rem)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}
  >
    <div className={`w-2 h-8 rounded-l absolute left-0 top-1/2 transform -translate-y-1/2 ${
      notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
    }`}></div>
    
    <div className="flex items-center pl-3 pr-4 py-2">
      <span className="mr-2 text-lg">
        {notification.type === 'error' ? '⚠️' : '✓'}
      </span>
      <span className="text-sm font-medium">{notification.message}</span>
      <button 
        onClick={() => setNotification(null)} 
        className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  </motion.div>
)}
      
      {showOptionsModal && selectedProduct && (
        <PremiumOptionsModal 
          product={selectedProduct}
          onClose={() => setShowOptionsModal(false)}
          onConfirm={(options, additionalPrice) => {
            const success = confirmAddToCart(options, additionalPrice);
            if (success) {
              setShowOptionsModal(false);
            }
            return success;
          }}
          t={t}
        />
      )}

      <footer className="bg-[#FEB300] text-[#280B04] py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="space-y-4 md:space-y-5">
              <h3 className="text-lg md:text-xl font-bold flex items-center justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('openingHours')}
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li className="flex justify-between items-center border-b border-[#280B04] border-opacity-20 pb-2 md:pb-3">
                  <span className="text-[#280B04] opacity-80 text-sm md:text-base">{t('monday')}</span>
                  <span className="font-medium bg-[#FFF1E4] px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm">
                    {t('closed')}
                  </span>
                </li>
                <li className="flex justify-between border-b border-[#280B04] border-opacity-20 pb-2 md:pb-3">
                  <span className="text-[#280B04] opacity-80 text-sm md:text-base">{t('tuesdayToSaturday')}</span>
                  <span className="font-medium text-sm md:text-base">12:00 – 15:30 | 19:00 – 22:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#280B04] opacity-80 text-sm md:text-base">{t('sunday')}</span>
                  <span className="font-medium text-sm md:text-base">12:00 – 15:30</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 md:space-y-5">
              <h3 className="text-lg md:text-xl font-bold flex items-center justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('addressText')}
              </h3>
              <address className="not-italic text-center md:text-left">
                <div className="flex flex-col items-center md:items-start">
                  <div className="font-medium">
                    <p className="font-bold">Cozinha da Vivi</p>
                    <p className="text-sm md:text-base">Estrada de Alvor, São Sebastião</p>
                    <p className="text-sm md:text-base">8500-769 Portimão</p>
                  </div>
                </div>
              </address>
            </div>

            <div className="space-y-4 md:space-y-5">
              <h3 className="text-lg md:text-xl font-bold flex items-center justify-center md:justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('contact')}
              </h3>
              
              <div className="flex flex-col items-center space-y-3 md:space-y-4 md:items-start">
                <a 
                  href="https://wa.me/351928145225" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center bg-[#280B04] text-[#FEB300] p-3 rounded-lg hover:bg-[#3D1106] transition-all group w-full max-w-xs"
                >
                  <div className="bg-[#FEB300] text-[#280B04] p-2 rounded-full mr-3 md:mr-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-sm md:text-base">WhatsApp</div>
                    <div className="text-xs md:text-sm opacity-90">+351 928 145 225</div>
                  </div>
                </a>

                <a 
                  href="mailto:vivianebistro@gmail.com" 
                  className="flex items-center bg-white text-[#280B04] p-3 rounded-lg hover:bg-gray-100 transition-all group border border-[#280B04] w-full max-w-xs"
                >
                  <div className="bg-[#280B04] text-[#FEB300] p-2 rounded-full mr-3 md:mr-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-sm md:text-base">E-mail</div>
                    <div className="text-xs md:text-sm opacity-90">vivianebistro@gmail.com</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 text-center">
            <h4 className="text-lg font-medium mb-4">Siga-nos</h4>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://www.tripadvisor.com/Restaurant_Review-g189120-d33062978-Reviews-Cozinha_Da_Vivi-Portimao_Faro_District_Algarve.html?m=69573" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#280B04] text-[#FEB300] p-2 rounded-full hover:scale-110 transition-transform hover:shadow-md"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 100 24 12 12 0 000-24zm4.5 16.5c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1zm-9 0c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1zm9-9c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1zm-9 0c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1zm4.5 4.5c-2.5 0-4.5 2-4.5 4.5h9c0-2.5-2-4.5-4.5-4.5z"/>
                </svg>
              </a>
              
              <a 
                href="https://www.instagram.com/cozinhadavivipt?igsh=MTd0NDI1a2c5Y3Uydg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#280B04] text-[#FEB300] p-2 rounded-full hover:scale-110 transition-transform hover:shadow-md"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#280B04] border-opacity-20 text-center">
            <p className="text-xs md:text-sm text-[#280B04] opacity-80">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientPage;