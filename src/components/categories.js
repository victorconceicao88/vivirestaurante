import { 
  GiMeal, 
  GiSteak, 
  GiChickenOven, 
  GiCakeSlice 
} from 'react-icons/gi';
import { MdLocalBar } from 'react-icons/md';
import { FaBox } from 'react-icons/fa';

// Dados dos produtos organizados por categoria
export const categories = (t, i18n) => [
  {
    id: 'churrasco',
    name: t('categories.churrasco'),
    icon: <GiSteak className="h-5 w-5 text-red-600" />,
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
        image: "/images/maminha.jpeg",
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
    id: 'porcoes',
    name: t('categories.porcoes'),
    icon: <GiChickenOven className="h-5 w-5 text-yellow-600" />,
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
              i18n.language === 'en' ? "Mixed Grill" : "Parrillada Mixta", 
        description: "", 
        price: 10.00, 
        image: "/images/mistadecarne.jpeg",
        options: {
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
        }
      },      
    ]
  },
  {
    id: 'bebidas',
    name: t('categories.bebidas'),
    icon: <MdLocalBar className="h-5 w-5 text-blue-600" />,
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
    icon: <GiCakeSlice className="h-5 w-5 text-pink-600" />,
    products: [
      { 
        id: 601, 
        name: i18n.language === 'pt' ? "Açai Pequeno" : 
              i18n.language === 'en' ? "Small Açai Bowl" : "Açaí Pequeño", 
        description: i18n.language === 'pt' ? "Açai cremoso com acompanhamentos à escolha. Tamanho pequeno ." : 
                      i18n.language === 'en' ? "Creamy açai with toppings of your choice. Small size." : 
                      "Açaí cremoso con acompañamientos a elegir. Tamaño pequeño.", 
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
        description: i18n.language === 'pt' ? "Açai cremoso com acompanhamentos à escolha. Tamanho grande." : 
                      i18n.language === 'en' ? "Creamy açai with toppings of your choice. Large size." : 
                      "Açai cremoso con acompañamientos a elegir. Tamaño grande.", 
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
  },
  {
    id: 'Patros da Semana',
    name: t('Pratos da Semana'),
    icon: <GiMeal className="h-5 w-5 text-gray-700" />,
    products: [
      { 
        id: 701, 
        name: i18n.language === 'pt' ? "Vaca Atolada (Quinta-feira)" : 
              i18n.language === 'en' ? "Vaca Atolada (Thursday)" : "Vaca Atolada (Jueves)", 
        description: i18n.language === 'pt' ? "Delicioso prato tradicional brasileiro servido com arroz, feijão tropeiro e couve" : 
                      i18n.language === 'en' ? "Traditional Brazilian dish served with rice, tropeiro beans and collard greens" : 
                      "Plato tradicional brasileño servido con arroz, frijoles tropeiro y col", 
        price: 13.00, 
        image: "/images/vaca-atolada.jpg",
        isWeeklySpecial: true,
        availableDays: ['thursday'],
        options: {
          // Opções similares aos outros pratos principais
        }
      },
      { 
        id: 702, 
        name: i18n.language === 'pt' ? "Feijoada (Sábado e Domingo)" : 
              i18n.language === 'en' ? "Feijoada (Saturday & Sunday)" : "Feijoada (Sábado y Domingo)", 
        description: i18n.language === 'pt' ? "A tradicional feijoada brasileira completa com todos os acompanhamentos" : 
                      i18n.language === 'en' ? "Traditional Brazilian feijoada with all the side dishes" : 
                      "Feijoada brasileña tradicional con todas las guarniciones", 
        price: 13.00, 
        image: "/images/feijoada.jpeg",
        isWeeklySpecial: true,
        availableDays: ['saturday', 'sunday'],
        options: {
          // Opções similares aos outros pratos principais
        }
      }
    ]
  }
];

export const getCategoryIcon = (iconName, className = "h-5 w-5") => {
  const icons = {
    GiSteak: <GiSteak className={`${className} text-red-600`} />,
    GiMeal: <GiMeal className={`${className} text-gray-700`} />,
    GiChickenOven: <GiChickenOven className={`${className} text-yellow-600`} />,
    GiCakeSlice: <GiCakeSlice className={`${className} text-pink-600`} />,
    MdLocalBar: <MdLocalBar className={`${className} text-blue-600`} />,
  };
  return icons[iconName] || <GiMeal className={className} />; // Fallback padrão
};