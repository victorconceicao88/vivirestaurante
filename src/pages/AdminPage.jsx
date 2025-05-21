import { useState, useEffect, useCallback, useMemo } from 'react';
import { ref, onValue, off, update, push, remove, set, get } from 'firebase/database';
import { database } from '../firebase';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { 
  FiLogOut, FiPlus, FiTrash2, FiChevronLeft, FiClock, FiCheckCircle, 
  FiTruck, FiCoffee, FiHome, FiUsers, FiPrinter, FiX, FiEdit, 
  FiSearch, FiPhone, FiUser, FiMapPin, FiDollarSign, FiMenu, FiEye, FiEyeOff
} from 'react-icons/fi';
import { BsClockHistory, BsReceipt, BsCashStack, BsPrinter } from 'react-icons/bs';
import { IoFastFoodOutline, IoWineOutline, IoClose } from 'react-icons/io5';
import { GiMeal, GiChopsticks, GiSodaCan } from 'react-icons/gi';
import { FaWineBottle, FaGlassWhiskey, FaBluetoothB } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-datepicker/dist/react-datepicker.css';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [newTableNumber, setNewTableNumber] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [addingItems, setAddingItems] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [notification, setNotification] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [historyFilter, setHistoryFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [swipeStartX, setSwipeStartX] = useState(null);
  const [swipeEndX, setSwipeEndX] = useState(null);
  const [unavailableItems, setUnavailableItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [itemOptions, setItemOptions] = useState({});
  const [itemNotes, setItemNotes] = useState('');

  const stats = {
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    preparingOrders: orders.filter(o => o.status === 'preparing').length,
    activeTables: tables.filter(t => t.status !== 'closed').length
  };
  const menuItems = [
    // Churrasco Misto
    {
      id: 1,
      name: 'Churrasco Misto',
      category: 'Churrasco',
      price: 15.00,
      type: 'food',
      iconName: 'meat',
      options: {
        feijao: {
          title: 'Feijão',
          required: true,
          type: 'radio',
          items: [
            { label: 'Feijão de caldo', value: 'feijaoCaldo' },
            { label: 'Feijão tropeiro', value: 'feijaoTropeiro' }
          ]
        },
        acompanhamentos: {
          title: 'Acompanhamentos',
          required: true,
          type: 'radio',
          items: [
            { label: 'Banana frita', value: 'bananaFrita' },
            { label: 'Mandioca cozida', value: 'mandiocaCozida' },
            { label: 'Mandioca frita', value: 'mandiocaFrita' }
          ]
        },
        carnes: {
          title: 'Carnes (Escolha até 2)',
          required: true,
          type: 'checkbox',
          max: 2,
          items: [
            { label: 'Coração de galinha', value: 'coracao' },
            { label: 'Costelinha de porco', value: 'costelinha' },
            { label: 'Filé de frango', value: 'fileFrango' },
            { label: 'Linguiça', value: 'linguica' },
            { label: 'Maminha', value: 'maminha' },
            { label: 'Torresmo', value: 'torresmo' },
            { label: 'Só Maminha (+€1,00)', value: 'soMaminha', price: 1.00 }
          ]
        },
        pontoCarne: {
          title: 'Ponto da Carne',
          required: true,
          type: 'radio',
          items: [
            { label: 'Selada', value: 'selada' },
            { label: 'Mal passada', value: 'malPassada' },
            { label: 'Ao ponto', value: 'aoPonto' },
            { label: 'Ao ponto para bem', value: 'aoPontoBem' },
            { label: 'Bem passado', value: 'bemPassado' },
            { label: 'Indiferente', value: 'indiferente' }
          ]
        },
        salada: {
          title: 'Salada',
          required: true,
          type: 'radio',
          items: [
            { label: 'Salada mista', value: 'saladaMista' },
            { label: 'Vinagrete', value: 'vinagrete' },
            { label: 'Não quero salada', value: 'semSalada' }
          ]
        },
        observacoes: {
          title: 'Observações para Cozinha',
          type: 'textarea',
          placeholder: 'Ex: Mais mandioca, carne bem passada...'
        }
      }
    },
    {
      id: 2,
      name: 'Maminha',
      category: 'Churrasco',
      price: 16.00,
      type: 'food',
      iconName: 'meat',
      options: {
        feijao: {
          title: 'Feijão',
          required: true,
          type: 'radio',
          items: [
            { label: 'Feijão de caldo', value: 'feijaoCaldo' },
            { label: 'Feijão tropeiro', value: 'feijaoTropeiro' }
          ]
        },
        acompanhamentos: {
          title: 'Acompanhamentos',
          required: true,
          type: 'radio',
          items: [
            { label: 'Banana frita', value: 'bananaFrita' },
            { label: 'Mandioca cozida', value: 'mandiocaCozida' },
            { label: 'Mandioca frita', value: 'mandiocaFrita' }
          ]
        },
        pontoCarne: {
          title: 'Ponto da Carne',
          required: true,
          type: 'radio',
          items: [
            { label: 'Selada', value: 'selada' },
            { label: 'Mal passada', value: 'malPassada' },
            { label: 'Ao ponto', value: 'aoPonto' },
            { label: 'Ao ponto para bem', value: 'aoPontoBem' },
            { label: 'Bem passado', value: 'bemPassado' },
            { label: 'Indiferente', value: 'indiferente' }
          ]
        },
        salada: {
          title: 'Salada',
          required: true,
          type: 'radio',
          items: [
            { label: 'Salada mista', value: 'saladaMista' },
            { label: 'Vinagrete', value: 'vinagrete' },
            { label: 'Não quero salada', value: 'semSalada' }
          ]
        },
        observacoes: {
          title: 'Observações para Cozinha',
          type: 'textarea',
          placeholder: 'Ex: Ponto bem passado, sem vinagrete...'
        }
      }
    },
    {
      id: 3,
      name: 'Linguiça Toscana',
      category: 'Churrasco',
      price: 13.00,
      type: 'food',
      iconName: 'meat',
      options: {
        feijao: {
          title: 'Feijão',
          required: true,
          type: 'radio',
          items: [
            { label: 'Feijão de caldo', value: 'feijaoCaldo' },
            { label: 'Feijão tropeiro', value: 'feijaoTropeiro' }
          ]
        },
        acompanhamentos: {
          title: 'Acompanhamentos',
          required: true,
          type: 'radio',
          items: [
            { label: 'Banana frita', value: 'bananaFrita' },
            { label: 'Mandioca cozida', value: 'mandiocaCozida' },
            { label: 'Mandioca frita', value: 'mandiocaFrita' }
          ]
        },
        pontoCarne: {
          title: 'Ponto da Carne',
          required: true,
          type: 'radio',
          items: [
            { label: 'Selada', value: 'selada' },
            { label: 'Mal passada', value: 'malPassada' },
            { label: 'Ao ponto', value: 'aoPonto' },
            { label: 'Ao ponto para bem', value: 'aoPontoBem' },
            { label: 'Bem passado', value: 'bemPassado' },
            { label: 'Indiferente', value: 'indiferente' }
          ]
        },
        salada: {
          title: 'Salada',
          required: true,
          type: 'radio',
          items: [
            { label: 'Salada mista', value: 'saladaMista' },
            { label: 'Vinagrete', value: 'vinagrete' },
            { label: 'Não quero salada', value: 'semSalada' }
          ]
        },
        observacoes: {
          title: 'Observações para Cozinha',
          type: 'textarea',
          placeholder: 'Ex: Linguiça bem assada, mandioca extra...'
        }
      }
    },
    {
      id: 4,
      name: 'Costelinha de Porco',
      category: 'Churrasco',
      price: 14.00,
      type: 'food',
      iconName: 'meat',
      options: {
        feijao: {
          title: 'Feijão',
          required: true,
          type: 'radio',
          items: [
            { label: 'Feijão de caldo', value: 'feijaoCaldo' },
            { label: 'Feijão tropeiro', value: 'feijaoTropeiro' }
          ]
        },
        acompanhamentos: {
          title: 'Acompanhamentos',
          required: true,
          type: 'radio',
          items: [
            { label: 'Banana frita', value: 'bananaFrita' },
            { label: 'Mandioca cozida', value: 'mandiocaCozida' },
            { label: 'Mandioca frita', value: 'mandiocaFrita' }
          ]
        },
        pontoCarne: {
          title: 'Ponto da Carne',
          required: true,
          type: 'radio',
          items: [
            { label: 'Selada', value: 'selada' },
            { label: 'Mal passada', value: 'malPassada' },
            { label: 'Ao ponto', value: 'aoPonto' },
            { label: 'Ao ponto para bem', value: 'aoPontoBem' },
            { label: 'Bem passado', value: 'bemPassado' },
            { label: 'Indiferente', value: 'indiferente' }
          ]
        },
        salada: {
          title: 'Salada',
          required: true,
          type: 'radio',
          items: [
            { label: 'Salada mista', value: 'saladaMista' },
            { label: 'Vinagrete', value: 'vinagrete' },
            { label: 'Não quero salada', value: 'semSalada' }
          ]
        },
        observacoes: {
          title: 'Observações para Cozinha',
          type: 'textarea',
          placeholder: 'Ex: Costelinha bem assada, banana extra...'
        }
      }
    },
    {
      id: 5,
      name: 'Peito de Frango Grelhado',
      category: 'Churrasco',
      price: 12.00,
      type: 'food',
      iconName: 'meat',
      options: {
        feijao: {
          title: 'Feijão',
          required: true,
          type: 'radio',
          items: [
            { label: 'Feijão de caldo', value: 'feijaoCaldo' },
            { label: 'Feijão tropeiro', value: 'feijaoTropeiro' }
          ]
        },
        acompanhamentos: {
          title: 'Acompanhamentos',
          required: true,
          type: 'radio',
          items: [
            { label: 'Banana frita', value: 'bananaFrita' },
            { label: 'Mandioca cozida', value: 'mandiocaCozida' },
            { label: 'Mandioca frita', value: 'mandiocaFrita' }
          ]
        },
        pontoCarne: {
          title: 'Ponto da Carne',
          required: true,
          type: 'radio',
          items: [
            { label: 'Selada', value: 'selada' },
            { label: 'Mal passada', value: 'malPassada' },
            { label: 'Ao ponto', value: 'aoPonto' },
            { label: 'Ao ponto para bem', value: 'aoPontoBem' },
            { label: 'Bem passado', value: 'bemPassado' },
            { label: 'Indiferente', value: 'indiferente' }
          ]
        },
        salada: {
          title: 'Salada',
          required: true,
          type: 'radio',
          items: [
            { label: 'Salada mista', value: 'saladaMista' },
            { label: 'Vinagrete', value: 'vinagrete' },
            { label: 'Não quero salada', value: 'semSalada' }
          ]
        },
        observacoes: {
          title: 'Observações para Cozinha',
          type: 'textarea',
          placeholder: 'Ex: Frango bem passado, sem salada...'
        }
      }
    },
    {
      id: 26,
      name: 'Açaí Pequeno',
      category: 'Sobremesas',
      price: 4.50,
      type: 'dessert',
      iconName: 'acai',
      options: {
        tamanho: {
          title: 'Tamanho',
          required: true,
          type: 'radio',
          items: [
            { label: 'Pequeno (300ml)', value: 'pequeno' },
            { label: 'Grande (500ml) +€2.00', value: 'grande', price: 2.00 }
          ]
        },
        base: {
          title: 'Base',
          required: true,
          type: 'radio',
          items: [
            { label: 'Açaí puro', value: 'puro' },
            { label: 'Açaí com banana', value: 'banana' }
          ]
        },
        acompanhamentos: {
          title: 'Acompanhamentos',
          required: false,
          type: 'checkbox',
          items: [ // Removido o max: 3
            { label: 'Granola', value: 'granola' },
            { label: 'Leite condensado', value: 'leite_condensado' },
            { label: 'Leite em pó', value: 'leite_po' },
            { label: 'Paçoca', value: 'pacoca' },
            { label: 'Morango', value: 'morango' },
            { label: 'Banana', value: 'banana' }
          ]
        },
        observacoes: {
          title: 'Observações',
          type: 'textarea',
          placeholder: 'Ex: Mais granola, menos leite condensado...'
        }
      }
    },
    {
      id: 27,
      name: 'Açaí Grande',
      category: 'Sobremesas',
      price: 6.50,
      type: 'dessert',
      iconName: 'acai',
      options: {
        base: {
          title: 'Base',
          required: true,
          type: 'radio',
          items: [
            { label: 'Açaí puro', value: 'puro' },
            { label: 'Açaí com banana', value: 'banana' }
          ]
        },
        acompanhamentos: {
          title: 'Acompanhamentos (Escolha até 5)',
          required: false,
          type: 'checkbox',
          max: 5,
          items: [
            { label: 'Granola', value: 'granola' },
            { label: 'Leite condensado', value: 'leite_condensado' },
            { label: 'Leite em pó', value: 'leite_po' },
            { label: 'Paçoca', value: 'pacoca' },
            { label: 'Morango', value: 'morango' },
            { label: 'Banana', value: 'banana' },
            { label: 'Nutella +€1.50', value: 'nutella', price: 1.50 }
          ]
        },
        observacoes: {
          title: 'Observações',
          type: 'textarea',
          placeholder: 'Ex: Mais granola, menos leite condensado...'
        }
      }
    },
    { id: 6, name: 'X-Salada', price: 6.90, category: 'Burguers', type: 'food', iconName: 'burger' },
    { id: 7, name: 'X-Bacon', price: 7.90, category: 'Burguers', type: 'food', iconName: 'burger' },
    { id: 8, name: 'X-Frango', price: 7.50, category: 'Burguers', type: 'food', iconName: 'burger' },
    { id: 9, name: 'X-Especial', price: 8.90, category: 'Burguers', type: 'food', iconName: 'burger' },
    { id: 10, name: 'X-Tudo', price: 9.90, category: 'Burguers', type: 'food', iconName: 'burger' },
    { id: 11, name: 'Porção de Arroz', price: 3.00, category: 'Porções', type: 'food', iconName: 'rice' },
    { id: 12, name: 'Queijo Coalho', price: 5.50, category: 'Porções', type: 'food', iconName: 'cheese' },
    { id: 13, name: 'Torresmo', price: 4.50, category: 'Porções', type: 'food', iconName: 'pork' },
    { id: 14, name: 'Porção de Mandioca', price: 4.00, category: 'Porções', type: 'food', iconName: 'cassava' },
    { id: 15, name: 'Porção de Batata Frita', price: 4.00, category: 'Porções', type: 'food', iconName: 'fries' },
    { id: 16, name: 'Porção de Carnes', price: 10.00, category: 'Porções', type: 'food', iconName: 'meat' },
    { id: 17, name: 'Coca-Cola', price: 2.00, category: 'Bebidas', type: 'drink', iconName: 'soda' },
    { id: 18, name: 'Coca-Cola Zero', price: 2.00, category: 'Bebidas', type: 'drink', iconName: 'soda' },
    { id: 19, name: '7Up', price: 2.00, category: 'Bebidas', type: 'drink', iconName: 'soda' },
    { id: 20, name: 'Fanta Laranja', price: 2.00, category: 'Bebidas', type: 'drink', iconName: 'soda' },
    { id: 21, name: 'Guaraná Antarctica', price: 2.00, category: 'Bebidas', type: 'drink', iconName: 'soda' },
    { id: 22, name: 'Ice Tea de Manga', price: 2.00, category: 'Bebidas', type: 'drink', iconName: 'tea' },
    { id: 23, name: 'Água sem gás 500ml', price: 1.00, category: 'Bebidas', type: 'drink', iconName: 'water' },
    { id: 24, name: 'Água com gás Castelo (pequena)', price: 1.50, category: 'Bebidas', type: 'drink', iconName: 'water' },
    { id: 25, name: 'Água com gás Pedras (pequena)', price: 1.50, category: 'Bebidas', type: 'drink', iconName: 'water' },
    { id: 28, name: 'Garrafa de Vinho', price: 13.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 29, name: 'Garrafa Vinho Tinto', price: 10.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 30, name: 'Caneca de Cerveja', price: 3.50, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'beer' },
    { id: 31, name: 'Imperial', price: 2.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'beer' },
    { id: 32, name: 'Jarra de Vinho', price: 10.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 33, name: 'Meia Jarra de Vinho', price: 6.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 34, name: 'Sagres', price: 2.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'beer' },
    { id: 35, name: 'Sangria', price: 15.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 36, name: 'Sangria 0.5L', price: 8.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 37, name: 'Sangria Taça', price: 5.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 38, name: 'Summersby', price: 2.50, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'cider' },
    { id: 39, name: 'Super Bock', price: 2.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'beer' },
    { id: 40, name: 'Taça de Vinho', price: 3.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 41, name: 'Cachaça', price: 1.50, category: 'Cafés & Licores', type: 'drink', iconName: 'shot' },
    { id: 42, name: 'Café', price: 1.00, category: 'Cafés & Licores', type: 'drink', iconName: 'coffee' },
    { id: 43, name: 'Galão', price: 1.50, category: 'Cafés & Licores', type: 'drink', iconName: 'coffee' },
    { id: 44, name: 'Constantino', price: 2.00, category: 'Cafés & Licores', type: 'drink', iconName: 'liqueur' },
    { id: 45, name: 'Compal', price: 2.00, category: 'Bebidas', type: 'drink', iconName: 'water' },
    { id: 46, name: 'Esporão Monte Velho', price: 15.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 47, name: 'Grão Vasco', price: 12.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 48, name: 'Caipirinha', price: 6.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 49, name: 'Panaché', price: 4.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 50, name: 'Papa Figos', price: 15.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 51, name: 'Vinho da Casa', price: 10.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 52, name: 'Sossego', price: 15.00, category: 'Vinhos & Cervejas', type: 'drink', iconName: 'wine' },
    { id: 53, name: 'Sumo Natural', price: 3.00, category: 'Bebidas', type: 'drink', iconName: 'water' },
    { id: 54, name: 'Fogão', price: 15.90, category: 'Churrasco', type: 'food', iconName: 'meat' },
    { id: 55, name: 'Fogão Kids', price: 8.00, category: 'Churrasco', type: 'food', iconName: 'meat' },
  ];

const categories = ['all', ...new Set(menuItems?.map(item => item?.category) || [])];
const navigate = useNavigate();

const showNotification = (message, type = 'success') => {
  setNotification({ message, type });
  setTimeout(() => setNotification(null), 3000);
};

  const toggleItemAvailability = async (productId) => {
    try {
      const idString = productId.toString();
      const itemRef = ref(database, `unavailableItems/${idString}`);
      
      if (unavailableItems.includes(idString)) {
        await set(itemRef, null);
        setUnavailableItems(prev => prev.filter(id => id !== idString));
      } else {
        await set(itemRef, true);
        setUnavailableItems(prev => [...prev, idString]);
      }
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const sendWhatsAppNotification = (order, status) => {
    if (!order.customerPhone) {
      console.error('Número de telefone do cliente não disponível');
      return;
    }
    
    const phoneNumber = order.customerPhone.replace(/\D/g, '');
    let message = '';
    
    if (status === 'preparing') {
      message = `✅ Pedido recebido com sucesso!\n\nOlá ${order.customerName || 'Cliente'}! Recebemos o seu pedido #${order.id.slice(0, 6)} e ele já está sendo preparado com todo o cuidado.\n\n`;
      message += order.deliveryAddress 
        ? 'Você será notificado assim que estiver pronto para entrega.\n\n' 
        : 'Você será notificado assim que estiver pronto para retirada.\n\n';
      message += 'Agradecemos pela sua preferência!';
    } else if (status === 'ready') {
      message = `🍽️ Pedido pronto!\n\nOlá ${order.customerName || 'Cliente'}! Seu pedido #${order.id.slice(0, 6)} está pronto! `;
      message += order.deliveryAddress 
        ? 'Nosso entregador está a caminho! 🚴‍♂️' 
        : 'Pode vir retirar no balcão! 🎉';
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const loadUnavailableItems = async () => {
    try {
      const snapshot = await get(ref(database, 'unavailableItems'));
      const data = snapshot.val() || {};
      const items = Object.keys(data).filter(key => data[key] === true);
      setUnavailableItems(items);
    } catch (error) {
      console.error("Error loading unavailable items:", error);
      setUnavailableItems([]);
    }
  };
  
  useEffect(() => {
    loadUnavailableItems();
    
    const unavailableRef = ref(database, 'unavailableItems');
    const unsubscribe = onValue(unavailableRef, (snapshot) => {
      const data = snapshot.val() || {};
      setUnavailableItems(Object.keys(data).filter(key => data[key] === true));
    });
  
    return () => unsubscribe();
  }, []);

const printKitchenOrder = async (items, orderId, customerInfo) => {
  try {
    let content = '\x1B\x40'; // Reset printer
    content += '\x1B\x21\x00'; // Default font

    const centerText = (text) => {
      const lineWidth = 32;
      const spaces = Math.max(0, Math.floor((lineWidth - text.length) / 2));
      return ' '.repeat(spaces) + text;
    };

    const sanitizeText = (text) => {
      return (text || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/ç/g, 'c')              // Replace ç
        .replace(/\^/g, '')              // Remove ^
        .replace(/[€£¥$¢]/g, '')         // Remove currency symbols
        .replace(/[^\x20-\x7E]/g, '')    // Remove other non-printable ASCII
        .trim();
    };

    const formatPhone = (phone) => {
      if (!phone) return '';
      return phone.replace(/[^0-9]/g, '').replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    };

    // Cabeçalho
    content += `${centerText("COZINHA DA VIVI")}\n`;
    content += `${centerText("-------------------------------")}\n`;
    content += `${centerText("COMANDA: #" + orderId.slice(0, 8))}\n`;
    content += `${centerText(new Date().toLocaleString('pt-BR'))}\n\n`;

    // Dados do cliente
    content += '\x1B\x21\x10'; // Bold
    content += `DADOS DO CLIENTE:\n`;
    content += '\x1B\x21\x00'; // Normal

    content += `NOME: ${sanitizeText(customerInfo.customerName) || 'Nao informado'}\n`;
    content += `TEL: ${formatPhone(customerInfo.customerPhone) || 'Nao informado'}\n`;
    content += `TIPO: ${customerInfo.deliveryAddress ? 'ENTREGA' : 'BALCAO'}\n`;

    if (customerInfo.deliveryAddress) {
      content += `END: ${sanitizeText(customerInfo.deliveryAddress)}\n`;
      content += `CEP: ${sanitizeText(customerInfo.postalCode) || 'NAO INFORMADO'}\n`;
    }

    content += `PGTO: ${sanitizeText(customerInfo.paymentMethod) || 'Nao especificado'}\n`;
    content += `OBS: ${sanitizeText(customerInfo.notes) || 'Nenhuma'}\n`;
    content += `-------------------------------\n\n`;

    // Categorias
    const allCategories = ['Bebidas', 'Porcoes', 'Churrasco', 'Sobremesas', 'Outros'];
    const categorizedItems = Object.fromEntries(allCategories.map(cat => [cat, []]));

    items.forEach(item => {
      const category = allCategories.includes(item.category) ? item.category : 'Outros';
      categorizedItems[category].push(item);
    });

    // Itens do pedido
    content += '\x1B\x21\x10'; // Bold
    content += `ITENS DO PEDIDO:\n\n`;
    content += '\x1B\x21\x00'; // Normal

    Object.entries(categorizedItems).forEach(([category, items]) => {
      if (items.length === 0) return;

      content += '\x1B\x21\x10'; // Bold
      content += `${category.toUpperCase()}:\n`;
      content += '\x1B\x21\x00'; // Normal

      items.forEach((item, index) => {
        const itemNameMap = {
          'water': 'Agua Mineral',
          'fries': 'Mandioca Frita',
          'fries': 'Mandioca cozida'
        };
        const displayName = itemNameMap[item.name.toLowerCase()] || item.name;

        content += `${item.quantity}x ${sanitizeText(displayName).toUpperCase()}\n`;

        if (item.options && Object.keys(item.options).length > 0) {
          content += `   PERSONALIZACOES:\n`;

          Object.entries(item.options).forEach(([optionName, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return;

            const translatedOption = {
              'point': 'Ponto da Carne',
              'size': 'Tamanho',
              'sideDishes': 'Acompanhamentos',
              'salad': 'Salada',
              'beans': 'Feijao',
              'meats': 'Carnes',
              'toppings': 'Coberturas',
              'drinks': 'Bebida',
              'dessert': 'Sobremesa'
            }[optionName] || optionName;

            const translateValue = (val) => {
              const translations = {
                'rare': 'Mal passada',
                'medium': 'Ao ponto',
                'wellDone': 'Bem passada',
                'broth': 'Caldo',
                'mixed': 'Mista',
                'complete': 'Completa',
                'pure': 'Puro',
                'custom': 'Personalizado',
                'small': 'Pequeno',
                'medium': 'Medio',
                'large': 'Grande',
                'none': 'Sem',
                'extra': 'Extra',
                'cassavaCooked':'Mandioca cozida',
                'cassavaFried':'Mandioca frita',
              };
              return translations[val] || val;
            };

            const displayValue = Array.isArray(value)
              ? value.map(v => `> ${translateValue(v)}`).join('\n      ')
              : `> ${translateValue(value)}`;

            content += `   ${sanitizeText(translatedOption)}:\n`;
            content += `      ${sanitizeText(displayValue)}\n`;
          });
        }

        if (item.notes || item.kitchenNotes) {
          const notes = sanitizeText(item.notes || item.kitchenNotes);
          content += `   OBS: ${notes}\n`;
        }

        if (index < items.length - 1) content += '\n';
      });

      content += '\n';
    });

    // Rodape
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    content += `-------------------------------\n`;
    content += `${centerText("TOTAL: " + total.toFixed(2))}\n`;
    content += `${centerText("OBRIGADO PELA PREFERENCIA")}\n`;
    content += `${centerText("-------------------------------")}\n`;

    // Cortar papel
    content += '\n\n\n\n\n';
    content += '\x1D\x56\x00'; // Corte total

    const printSuccess = await sendToPrinter(content);

    if (!printSuccess) {
      const fallbackText = content
        .replace(/[\x1B\x1D][^\n]*?/g, '') // Remove comandos ESC/POS
        .replace(/[^\x20-\x7E\n]/g, '');   // Remove caracteres especiais

      alert(`FALHA NA IMPRESSAO! Copie manualmente:\n\n${fallbackText}`);
      return false;
    }

    return true;

  } catch (error) {
    console.error('Erro na impressao:', error);
    showNotification('Falha ao imprimir comanda', 'error');
    return false;
  }
};



const formatPostalCode = (postalCode) => {
  if (!postalCode) return '';
  const cleaned = postalCode.replace(/\D/g, '');
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
};
  
// Função para centralizar texto
const centerText = (text, width = 32) => {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(padding) + text;
};

// Função para formatar telefone
const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

// Função para sanitizar texto
const sanitizeText = (str) => {
  if (typeof str !== 'string') return '';
  
  const charMap = {
    'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
    'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
    'ç': 'c', 'Ç': 'C',
    'Á': 'A', 'À': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A',
    'É': 'E', 'È': 'E', 'Ê': 'E', 'Ë': 'E',
    'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
    'Ó': 'O', 'Ò': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
    'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U'
  };
  
  return str
    .replace(/[áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ]/g, match => charMap[match] || match)
    .replace(/[^ -~À-ÿ]/g, '');
};


const printBarOrder = async (items, tableNumber) => {
  try {
    // Simulação da lógica de impressão
    console.log(`Imprimindo itens do bar para a mesa ${tableNumber}:`, items);

    // Aqui entraria a integração com a impressora ou sistema de impressão
    // Ex: await printer.print(drinkItems)

    return true; // Retorna true se a impressão for bem-sucedida
  } catch (error) {
    console.error('Erro ao imprimir itens do bar:', error);
    return false;
  }
};

const sendToPrinter = async (content) => {
  try {
    console.log('Tentando imprimir via Bluetooth...');
    
    if (!navigator.bluetooth) {
      throw new Error('Bluetooth não suportado neste navegador');
    }

    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "BlueTooth Printer" }],
      optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
    });

    console.log('Conectando à impressora:', device.name);
    
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
    const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

    console.log('Enviando dados para impressão...');
    
    const chunkSize = 100;
    const encoder = new TextEncoder();
    
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      await characteristic.writeValue(encoder.encode(chunk));
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Comando para cortar o papel
    const cutCommand = new Uint8Array([0x1D, 0x56, 0x41, 0x05]);
    await characteristic.writeValue(cutCommand);

    console.log('Impressão concluída com sucesso!');
    return true;
    
  } catch (error) {
    console.error('Erro na impressão:', error);
    
    const printableContent = content
      .replace(/\x1B\[[0-9;]*[mGKH]/g, '')
      .replace(/\x1B\x40/g, '')
      .replace(/\x1B\x74\x10/g, '')
      .replace(/\x1B\x21\x01/g, '');
    
    alert(`ERRO DE IMPRESSÃO\n\nCopie e cole manualmente na impressora:\n\n${printableContent}`);
    
    return false;
  }
};

// Função auxiliar para preparar o conteúdo da impressão
const preparePrintContent = (text) => {
  // Primeiro normaliza os caracteres (NFD = decomposição canônica)
  let normalized = text.normalize('NFD');
  
  // Remove caracteres de controle e mantém apenas imprimíveis
  return normalized
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacríticos (acentos)
    .replace(/[^\x20-\x7E]/g, '')     // Mantém apenas ASCII básico
    .replace(/\r\n/g, '\n')           // Normaliza quebras de linha
    .replace(/\t/g, '    ');          // Substitui tabs por espaços
};

const handleSendToKitchen = async (orderId) => {
  try {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Prepara os dados do cliente incluindo o postalCode
    const customerInfo = {
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      postalCode: order.postalCode, // GARANTE QUE O CEP ESTÁ SENDO ENVIADO
      paymentMethod: order.paymentMethod,
      notes: order.notes
    };

    // Chama a função de impressão com todos os dados
    const printSuccess = await printKitchenOrder(
      Object.values(order.items || {}),
      order.id,
      customerInfo
    );

    if (printSuccess) {
      await updateOrderStatus(orderId, 'preparing');
      if (order.customerPhone) {
        sendWhatsAppNotification(order, 'preparing');
      }
    }
  } catch (error) {
    console.error('Falha ao enviar para cozinha:', error);
    showNotification('Erro ao enviar para cozinha', 'error');
  }
};

// Atualize a função updateOrderStatus para processar corretamente as opções
const updateOrderStatus = useCallback(async (orderId, status) => {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      showNotification('Pedido não encontrado', 'error');
      return;
    }

    // Atualiza o status e o timestamp
    await update(orderRef, { 
      status,
      updatedAt: new Date().toISOString()
    });

    // Notificação de sucesso
    let statusMessage = '';
    switch(status) {
      case 'preparing': 
        statusMessage = 'Pedido enviado para cozinha';
        break;
      case 'ready': 
        statusMessage = 'Pedido marcado como pronto';
        break;
      case 'delivered': 
        statusMessage = 'Pedido marcado como entregue';
        break;
    }
    
    if (statusMessage) {
      showNotification(statusMessage);
    }

    // Se for marcado como pronto e tiver telefone, enviar WhatsApp
    if (status === 'ready' && order.customerPhone) {
      sendWhatsAppNotification(order, status);
    }

  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    showNotification(`Erro ao atualizar pedido: ${error.message}`, 'error');
  }
}, [orders]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      showNotification('Erro ao fazer logout', 'error');
    }
  };

  const createNewTable = useCallback(() => {
    if (!newTableNumber) {
      showNotification('Por favor, insira um número de mesa', 'error');
      return;
    }
    
    const tableNumber = parseInt(newTableNumber);
    if (isNaN(tableNumber) || tableNumber < 1 || tableNumber > 30) {
      showNotification('Número de mesa inválido (1-30)', 'error');
      return;
    }
    
    const tableType = tableNumber <= 15 ? 'internal' : 'external';
    const tableExists = tables.some(t => t && t.number === tableNumber && t.status !== 'closed');
    
    if (tableExists) {
      showNotification('Esta mesa já está aberta!', 'error');
      return;
    }
    
    const newTable = {
      number: tableNumber,
      type: tableType,
      status: 'open',
      order: {}, 
      createdAt: new Date().toISOString(),
      waiter: 'Usuário Atual'
    };
    
    push(ref(database, 'tables'), newTable)
      .then(() => {
        showNotification(`Mesa #${tableNumber} aberta com sucesso!`);
        setNewTableNumber('');
      })
      .catch(error => {
        console.error('Error creating table:', error);
        showNotification('Erro ao abrir mesa', 'error');
      });
  }, [newTableNumber, tables]);

  const handleOptionChange = (optionKey, value) => {
    setItemOptions(prev => ({
      ...prev,
      [optionKey]: value
    }));
  };

  const addItemToCart = (item) => {
    const selectedOptions = {};
    let additionalPrice = 0;
  
    // Process selected options
    if (item.options) {
      Object.entries(item.options).forEach(([key, option]) => {
        if (itemOptions[key] !== undefined) {
          selectedOptions[key] = itemOptions[key];
          
          // Process additional prices
          if (option.type === 'checkbox') {
            const selectedItems = Array.isArray(itemOptions[key]) ? itemOptions[key] : [itemOptions[key]];
            option.items.forEach(optItem => {
              if (selectedItems.includes(optItem.value) && optItem.price) {
                additionalPrice += optItem.price;
              }
            });
          } else if (option.type === 'radio') {
            const selectedItem = option.items.find(opt => opt.value === itemOptions[key]);
            if (selectedItem?.price) {
              additionalPrice += selectedItem.price;
            }
          }
        }
      });
    }
  
    const itemWithOptions = {
      ...item,
      quantity,
      options: selectedOptions,
      kitchenNotes: itemNotes,
      price: item.price + additionalPrice
    };
  
    setCartItems([...cartItems, itemWithOptions]);
    setQuantity(1);
    setSelectedItem(null);
    setItemOptions({});
    setItemNotes('');
    showNotification(`${item.name} adicionado ao carrinho`);
  };

  const removeItemFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const sendCartItemsToTable = useCallback(async () => {
    if (!selectedTable || cartItems.length === 0) return;
    
    try {
      const tableRef = ref(database, `tables/${selectedTable.id}/order`);
      const updates = {};
      
      for (const item of cartItems) {
        const newItemRef = push(tableRef).key;
        updates[`tables/${selectedTable.id}/order/${newItemRef}`] = {
          name: item.name,
          price: item.price,
          category: item.category,
          type: item.type,
          iconName: item.iconName,
          quantity: item.quantity,
          status: 'pending',
          addedAt: new Date().toISOString(),
          itemId: newItemRef,
          printed: false,
          options: item.options || null,
          notes: item.kitchenNotes || null,
          source: 'table' // Adiciona identificação de origem
        };
      }
      
      await update(ref(database), updates);
      
      // REMOVIDA A CHAMADA PARA IMPRESSORA PARA PEDIDOS DE MESA
      
      showNotification(`${cartItems.length} itens adicionados à mesa #${selectedTable.number}`);
      setCartItems([]);
      setAddingItems(false);
      
      const updatedOrder = { ...selectedTable.order, ...updates };
      setSelectedTable({
        ...selectedTable,
        order: updatedOrder
      });
      
    } catch (error) {
      console.error('Error adding items to table:', error);
      showNotification('Erro ao adicionar itens à mesa', 'error');
    }
  }, [selectedTable, cartItems]);

  const removeItemFromTable = useCallback(async (tableId, itemId) => {
    if (!tableId || !itemId) return;
    
    const itemRef = ref(database, `tables/${tableId}/order/${itemId}`);
    
    try {
      await remove(itemRef);
      showNotification('Item removido com sucesso');
      
      if (selectedTable && selectedTable.id === tableId) {
        const updatedOrder = { ...selectedTable.order };
        delete updatedOrder[itemId];
        setSelectedTable({
          ...selectedTable,
          order: updatedOrder
        });
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
      showNotification('Erro ao remover item da mesa', 'error');
    }
  }, [selectedTable]);

  const deleteTable = useCallback(async (tableId) => {
    if (!tableId) return;
    
    const tableRef = ref(database, `tables/${tableId}`);
    
    try {
      await remove(tableRef);
      showNotification('Mesa removida com sucesso');
      setSelectedTable(null);
    } catch (error) {
      console.error('Erro ao remover mesa:', error);
      showNotification('Erro ao remover mesa', 'error');
    }
  }, []);

  const getUnprintedFoodItems = useCallback(() => {
    if (!selectedTable || !selectedTable.order) return [];
    
    return Object.entries(selectedTable.order || {})
      .filter(([_, item]) => item && !item.printed && 
        (item.type === 'food' || 
         ['Churrasco', 'Burguers', 'Porções', 'Sobremesas'].includes(item.category)))
      .map(([key, item]) => ({ ...item, itemId: key }));
  }, [selectedTable]);
  
  const getUnprintedDrinkItems = useCallback(() => {
    if (!selectedTable || !selectedTable.order) return [];
    
    return Object.entries(selectedTable.order || {})
      .filter(([_, item]) => item && !item.printed && 
        (item.type === 'drink' || 
         ['Bebidas', 'Vinhos & Cervejas', 'Cafés & Licores'].includes(item.category)))
      .map(([key, item]) => ({ ...item, itemId: key }));
  }, [selectedTable]);
  
  const hasUnprintedFoodItems = useMemo(() => getUnprintedFoodItems().length > 0, [getUnprintedFoodItems]);
  const hasUnprintedDrinkItems = useMemo(() => getUnprintedDrinkItems().length > 0, [getUnprintedDrinkItems]);
  
  const confirmPrintKitchenItems = useCallback(async (foodItems) => {
    // Adiciona verificação de origem
    if (selectedTable.source === 'table') {
      showNotification('Impressão de pedidos de mesa temporariamente desativada', 'info');
      return;
    }
  
    const printSuccess = await printKitchenOrder(foodItems, selectedTable.number);
    
    if (printSuccess) {
      const updates = {};
      foodItems.forEach(item => {
        updates[`tables/${selectedTable.id}/order/${item.itemId}/printed`] = true;
        updates[`tables/${selectedTable.id}/order/${item.itemId}/status`] = 'preparing';
      });
      
      try {
        await update(ref(database), updates);
        showNotification('Itens enviados para cozinha com sucesso!');
        
        const updatedOrder = { ...selectedTable.order };
        foodItems.forEach(item => {
          if (updatedOrder[item.itemId]) {
            updatedOrder[item.itemId].printed = true;
            updatedOrder[item.itemId].status = 'preparing';
          }
        });
        
        setSelectedTable({
          ...selectedTable,
          order: updatedOrder
        });
      } catch (error) {
        console.error('Error updating item status:', error);
        showNotification('Erro ao atualizar status dos itens', 'error');
      }
    }
  }, [selectedTable]);
  
  const confirmPrintBarItems = useCallback(async (drinkItems) => {
    const printSuccess = await printBarOrder(drinkItems, selectedTable.number);
    
    if (printSuccess) {
      const updates = {};
      drinkItems.forEach(item => {
        updates[`tables/${selectedTable.id}/order/${item.itemId}/printed`] = true;
        updates[`tables/${selectedTable.id}/order/${item.itemId}/status`] = 'preparing';
      });
      
      try {
        await update(ref(database), updates);
        showNotification('Itens enviados para o bar com sucesso!');
        
        const updatedOrder = { ...selectedTable.order };
        drinkItems.forEach(item => {
          if (updatedOrder[item.itemId]) {
            updatedOrder[item.itemId].printed = true;
            updatedOrder[item.itemId].status = 'preparing';
          }
        });
        
        setSelectedTable({
          ...selectedTable,
          order: updatedOrder
        });
      } catch (error) {
        console.error('Error updating item status:', error);
        showNotification('Erro ao atualizar status dos itens', 'error');
      }
    }
  }, [selectedTable]);

  const prepareCloseTable = useCallback(() => {
    if (!selectedTable || !selectedTable.order || Object.keys(selectedTable.order).length === 0) {
      showNotification('Não é possível fechar uma mesa sem itens', 'error');
      return;
    }
    setShowSummary(true);
  }, [selectedTable]);

  const confirmCloseTable = useCallback(async () => {
    if (!selectedTable || !selectedTable.order || Object.keys(selectedTable.order).length === 0) return;
    
    let total = 0;
    Object.values(selectedTable.order || {}).forEach(item => {
      if (item && item.price) {
        total += item.price * (item.quantity || 1);
      }
    });
    
    const tableRef = ref(database, `tables/${selectedTable.id}`);
    
    try {
      await update(tableRef, { 
        status: 'closed',
        closedAt: new Date().toISOString(),
        total: total.toFixed(2)
      });
      
      showNotification(`Mesa #${selectedTable.number} fechada com sucesso! Total: €${total.toFixed(2)}`);
      setSelectedTable(null);
      setAddingItems(false);
      setShowSummary(false);
    } catch (error) {
      console.error('Error closing table:', error);
      showNotification('Erro ao fechar mesa', 'error');
    }
  }, [selectedTable]);

  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'pizza': return <IoFastFoodOutline />;
      case 'burger': return <GiMeal />;
      case 'fries': return <GiChopsticks />;
      case 'soda': return <GiSodaCan />;
      case 'water': return <FaGlassWhiskey />;
      case 'salad': return <GiMeal />;
      case 'dessert': return <GiMeal />;
      case 'pasta': return <GiMeal />;
      case 'wine': return <FaWineBottle />;
      case 'beer': return <FaWineBottle />;
      case 'juice': return <GiSodaCan />;
      case 'risotto': return <GiMeal />;
      case 'steak': return <GiMeal />;
      case 'water': return <FaGlassWhiskey />; // Água
      case 'soda': return <GiSodaCan />;      // Refrigerante
      case 'juice': return <GiSodaCan />;     // Suco
      default: return <IoFastFoodOutline />;
    }
  };

  const getItemStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Em preparo';
      case 'ready': return 'Pronto';
      default: return 'Status desconhecido';
    }
  };

  const formatItemOptions = (options) => {
    if (!options) return '';
    
    return Object.entries(options)
      .map(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return '';
        
        // Exibe diretamente os valores em português
        const formattedValue = Array.isArray(value) 
          ? value.join(', ')
          : String(value);
        
        return `${key}: ${formattedValue}`;
      })
      .filter(Boolean)
      .join('; ');
  };
  
  // Exemplo de uso no componente de pedidos:
  {orders.items && Object.entries(orders.items).map(([key, item]) => (
    <li key={key} className="flex justify-between text-sm">
      <span>
        {item.quantity}x {item.name}
        {item.options && (
          <div className="text-xs text-gray-600 ml-2">
            {formatItemOptions(item.options)}
          </div>
        )}
      </span>
      <span>€ {(item.price * item.quantity).toFixed(2)}</span>
    </li>
  ))}

  const filteredOrders = orders.filter(order => {
    if (activeSection !== 'online') return false;
    const statusMatch = order.status === activeTab;
    const searchMatch = !searchTerm || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerPhone && order.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()));
    return statusMatch && searchMatch;
  });

  const filteredTables = tables.filter(table => 
    activeSection === 'tables' && 
    (activeTab === 'open' ? table.status === 'open' : 
     activeTab === 'closed' ? table.status === 'closed' : false)
  );

  const filteredHistoryTables = tables.filter(table => {
    if (activeSection !== 'tables' || activeTab !== 'closed') return false;
    const tableDate = new Date(table.closedAt || table.createdAt);
    const isDateInRange = tableDate >= startDate && tableDate <= endDate;
    if (historyFilter === 'all') return isDateInRange;
    if (historyFilter === 'internal') return isDateInRange && table.type === 'internal';
    if (historyFilter === 'external') return isDateInRange && table.type === 'external';
    return isDateInRange;
  });

  const filteredMenuItems = menuItems
    .filter(item => activeCategory === 'all' || item.category === activeCategory)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => !unavailableItems.includes(item.id.toString()));

  const isItemAvailable = useCallback((itemId) => {
    return !unavailableItems.includes(itemId.toString());
  }, [unavailableItems]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-emerald-100 text-emerald-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'open': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FiClock className="mr-1" />;
      case 'preparing': return <FiCoffee className="mr-1" />;
      case 'ready': return <FiCheckCircle className="mr-1" />;
      case 'delivered': return <FiTruck className="mr-1" />;
      case 'open': return <FiHome className="mr-1" />;
      case 'closed': return <FiCheckCircle className="mr-1" />;
      default: return <FiClock className="mr-1" />;
    }
  };

  const calculateTotal = (table) => {
    if (!table || !table.order) return 0;
    return Object.values(table.order || {}).reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (e) => {
    setSwipeStartX(e.changedTouches[0].screenX);
  };

  const handleTouchMove = (e) => {
    setSwipeEndX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = () => {
    if (!swipeStartX || !swipeEndX) return;
    const difference = swipeStartX - swipeEndX;
    
    if (difference > 50) { // Swipe left
      if (selectedTable) {
        if (showSummary) setShowSummary(false);
        else if (addingItems) setAddingItems(false);
        else if (selectedItem) setSelectedItem(null);
        else setSelectedTable(null);
      } else if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    } else if (difference < -50) { // Swipe right
      if (!mobileMenuOpen && !selectedTable) {
        setMobileMenuOpen(true);
      }
    }
    
    setSwipeStartX(null);
    setSwipeEndX(null);
  };

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
    const tablesRef = ref(database, 'tables');
    const unavailableItemsRef = ref(database, 'unavailableItems');
  
    const ordersListener = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const ordersArray = data ? Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value
      })) : [];
      setOrders(ordersArray);
    });
  
    const tablesListener = onValue(tablesRef, (snapshot) => {
      const data = snapshot.val();
      const tablesArray = data ? Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
        order: value.order || {}
      })) : [];
      setTables(tablesArray);
    });
  
    const unavailableItemsListener = onValue(unavailableItemsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const items = Object.keys(data).filter(key => data[key] === true);
      setUnavailableItems(items);
    });
  
    return () => {
      off(ordersRef, ordersListener);
      off(tablesRef, tablesListener);
      off(unavailableItemsRef, unavailableItemsListener);
    };
  }, []);

  const renderOptionInput = (optionKey, option) => {
    switch (option.type) {
      case 'radio':
        return (
          <div className="space-y-2">
            {option.items.map((optItem, idx) => (
              <label key={idx} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={optionKey}
                  value={optItem.value}
                  checked={itemOptions[optionKey] === optItem.value}
                  onChange={() => handleOptionChange(optionKey, optItem.value)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>{optItem.label}{optItem.price ? ` (+€${optItem.price.toFixed(2)})` : ''}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {option.items.map((optItem, idx) => {
              const isChecked = itemOptions[optionKey]?.includes(optItem.value) || false;
              return (
                <label key={idx} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      const currentValues = itemOptions[optionKey] || [];
                      let newValues;
                      if (isChecked) {
                        newValues = currentValues.filter(v => v !== optItem.value);
                      } else {
                        newValues = [...currentValues, optItem.value];
                      }
                      handleOptionChange(optionKey, newValues);
                    }}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{optItem.label}{optItem.price ? ` (+€${optItem.price.toFixed(2)})` : ''}</span>
                </label>
              );
            })}
          </div>
        );
      case 'textarea':
        return (
          <textarea
            value={itemNotes}
            onChange={(e) => setItemNotes(e.target.value)}
            placeholder={option.placeholder}
            className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 flex"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center ${
              notification.type === 'error' 
                ? 'bg-red-100 border-l-4 border-red-500 text-red-700' 
                : notification.type === 'info'
                ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
                : notification.type === 'warning'
                ? 'bg-amber-100 border-l-4 border-amber-500 text-amber-700'
                : 'bg-green-100 border-l-4 border-green-500 text-green-700'
            }`}
          >
            <span className="mr-2">
              {notification.type === 'error' ? '⚠️' : notification.type === 'info' ? 'ℹ️' : notification.type === 'warning' ? '⚠️' : '✓'}
            </span>
            {notification.message}
            <button 
              onClick={() => setNotification(null)} 
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <FiX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${isMobile ? 'hidden' : 'w-64'} bg-gray-900 text-gray-100 p-4 flex flex-col`}>
        <div className="flex items-center justify-between mb-8 p-2">
          <h1 className="text-xl font-bold">Cozinha da Vivi</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeSection === 'dashboard' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-800'}`}
          >
            <FiHome className="mr-3" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveSection('online')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeSection === 'online' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-800'}`}
          >
            <BsReceipt className="mr-3" />
            Pedidos Online
          </button>
          
          <button
            onClick={() => {
              setActiveSection('tables');
              setActiveTab('open');
              setSelectedTable(null);
            }}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeSection === 'tables' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-800'}`}
          >
            <FiUsers className="mr-3" />
            Gerenciar Mesas
          </button>

          <button
            onClick={() => setActiveSection('availability')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeSection === 'availability' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-800'}`}
          >
            <FiEye className="mr-3" />
            Controle de Disponibilidade
          </button>
        </nav>
        
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg transition hover:bg-gray-800"
          >
            <FiLogOut className="mr-3" />
            Sair
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-gray-900 text-white p-4 flex justify-between items-center md:hidden">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 mr-2"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl font-bold">Restaurante</h1>
          </div>
        </header>
        
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-gray-800 text-white shadow-xl"
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-bold">Menu</h2>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <IoClose size={24} />
                </button>
              </div>
              
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => {
                    setActiveSection('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeSection === 'dashboard' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-700'}`}
                >
                  <FiHome className="mr-3" />
                  Dashboard
                </button>
                
                <button
                  onClick={() => {
                    setActiveSection('online');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeSection === 'online' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-700'}`}
                >
                  <BsReceipt className="mr-3" />
                  Pedidos Online
                </button>
                
                <button
                  onClick={() => {
                    setActiveSection('tables');
                    setActiveTab('open');
                    setSelectedTable(null);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeSection === 'tables' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-700'}`}
                >
                  <FiUsers className="mr-3" />
                  Gerenciar Mesas
                </button>

                <button
                  onClick={() => {
                    setActiveSection('availability');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition ${activeSection === 'availability' ? 'bg-indigo-700 text-white' : 'hover:bg-gray-700'}`}
                >
                  <FiEye className="mr-3" />
                  Controle de Disponibilidade
                </button>
              </nav>
              
              <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 rounded-lg transition hover:bg-gray-700"
                >
                  <FiLogOut className="mr-3" />
                  Sair
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="container mx-auto p-4">
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Visão Geral</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="p-2 sm:p-3 rounded-full bg-amber-100 text-amber-600 mr-3 sm:mr-4">
                      <FiClock size={isMobile ? 20 : 24} />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-500">Pedidos Pendentes</p>
                      <h3 className="text-xl sm:text-2xl font-bold">{stats.pendingOrders}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600 mr-3 sm:mr-4">
                      <FiCoffee size={isMobile ? 20 : 24} />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-500">Em Preparo</p>
                      <h3 className="text-xl sm:text-2xl font-bold">{stats.preparingOrders}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="p-2 sm:p-3 rounded-full bg-purple-100 text-purple-600 mr-3 sm:mr-4">
                      <FiUsers size={isMobile ? 20 : 24} />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-gray-500">Mesas Ativas</p>
                      <h3 className="text-xl sm:text-2xl font-bold">{stats.activeTables}</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-4 sm:p-6 border-b">
                  <h3 className="text-lg font-semibold">Pedidos Recentes</h3>
                </div>
                
                <div className="divide-y">
                  {orders
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map(order => (
                      <div key={order.id} className="p-4 hover:bg-gray-50 transition">
                        <div className="flex items-center">
                          <div className={`p-1 sm:p-2 rounded-full mr-2 sm:mr-3 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">Pedido #{order.id.slice(0, 6)}</p>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="text-right ml-2">
                            <p className="text-sm font-medium whitespace-nowrap">
                              {order.items ? `€ ${Object.values(order.items).reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}` : ''}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {order.status === 'pending' && 'Pendente'}
                              {order.status === 'preparing' && 'Em Preparo'}
                              {order.status === 'ready' && 'Pronto'}
                              {order.status === 'delivered' && 'Entregue'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {orders.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                      Nenhum pedido recente encontrado.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'online' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Pedidos Online</h2>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Buscar pedido..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>
              
              <div className="flex bg-white rounded-lg shadow overflow-hidden">
                <button
                  className={`flex-1 py-2 sm:py-3 text-sm sm:text-base font-medium flex items-center justify-center ${activeTab === 'pending' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('pending')}
                >
                  <FiClock className="mr-1 sm:mr-2" />
                  Pendentes
                </button>
                <button
                  className={`flex-1 py-2 sm:py-3 text-sm sm:text-base font-medium flex items-center justify-center ${activeTab === 'preparing' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('preparing')}
                >
                  <FiCoffee className="mr-1 sm:mr-2" />
                  Em Prep.
                </button>
                <button
                  className={`flex-1 py-2 sm:py-3 text-sm sm:text-base font-medium flex items-center justify-center ${activeTab === 'ready' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('ready')}
                >
                  <FiCheckCircle className="mr-1 sm:mr-2" />
                  Prontos
                </button>
                <button
                  className={`flex-1 py-2 sm:py-3 text-sm sm:text-base font-medium flex items-center justify-center ${activeTab === 'delivered' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('delivered')}
                >
                  <FiTruck className="mr-1 sm:mr-2" />
                  Entregues
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {filteredOrders.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center">
                    <div className="text-gray-400 mb-3 sm:mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 sm:h-12 w-10 sm:w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-1">Nenhum pedido encontrado</h3>
                    <p className="text-sm sm:text-base text-gray-500">Quando houver pedidos {activeTab === 'pending' ? 'pendentes' : activeTab === 'preparing' ? 'em preparo' : activeTab === 'ready' ? 'prontos' : 'entregues'}, eles aparecerão aqui.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredOrders.map(order => (
                      <div key={order.id} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">Pedido #{order.id.slice(0, 6)}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              {new Date(order.createdAt).toLocaleString()} • {order.customerName || 'Cliente não identificado'}
                            </p>
                          </div>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status === 'pending' && 'Pendente'}
                            {order.status === 'preparing' && 'Em Preparo'}
                            {order.status === 'ready' && 'Pronto'}
                            {order.status === 'delivered' && 'Entregue'}
                          </span>
                        </div>
                        {order.notes && (
                            <div className="mb-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                              <h4 className="font-medium text-yellow-800 mb-1">Observações do Cliente:</h4>
                              <p className="text-yellow-700">{order.notes}</p>
                            </div>
                          )}

                        
                        <div className="mb-3 sm:mb-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
                          <h4 className="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Informações do Cliente:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="flex items-start">
                              <FiUser className="text-gray-500 mt-0.5 sm:mt-1 mr-2 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Nome</p>
                                <p className="text-gray-800 truncate">{order.customerName || 'Não informado'}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <FiPhone className="text-gray-500 mt-0.5 sm:mt-1 mr-2 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Telefone</p>
                                <p className="text-gray-800 truncate">{order.customerPhone || 'Não informado'}</p>
                              </div>
                            </div>
                              {order.deliveryAddress && (
                              <div className="flex items-start sm:col-span-2">
                                <FiMapPin className="text-gray-500 mt-0.5 sm:mt-1 mr-2 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-medium text-gray-600">Endereço de Entrega</p>
                                  <p className="text-gray-800 truncate">
                                    {order.deliveryAddress}
                                  </p>
                                  {/* LINHA ADICIONADA PARA MOSTRAR O CEP SEPARADAMENTE */}
                                  {order.postalCode && (
                                    <p className="text-gray-800 truncate">
                                      <span className="font-medium">Codigo Postal:</span> {order.postalCode}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="flex items-start">
                              <BsCashStack className="text-gray-500 mt-0.5 sm:mt-1 mr-2 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Método de Pagamento</p>
                                <p className="text-gray-800 truncate">{order.paymentMethod || 'Não informado'}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <FiTruck className="text-gray-500 mt-0.5 sm:mt-1 mr-2 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Tipo de Pedido</p>
                                <p className="text-gray-800 truncate">
                                  {order.deliveryAddress ? 'Entrega' : 'Retirada no Local'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3 sm:mb-4">
                          <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Itens:</h4>
                          <ul className="space-y-1 sm:space-y-2">
                   
{order.items && Object.entries(order.items).map(([key, item]) => {
  // Função para formatar opções em português
  const formatOptions = (options) => {
    if (!options) return '';
    
    const translations = {
      'point': 'Ponto da Carne',
      'size': 'Tamanho',
      'sideDishes': 'Acompanhamentos',
      'salad': 'Salada',
      'beans': 'Feijão',
      'meats': 'Carnes',
      'toppings': 'Coberturas'
    };

    const valueTranslations = {
      'rare': 'Mal passada',
      'medium': 'Ao ponto',
      'wellDone': 'Bem passada',
      'broth': 'Caldo',
      'mixed': 'Mista',
      'complete': 'Completa',
      'pure': 'Puro',
      'custom': 'Personalizado'
    };

    return Object.entries(options)
      .map(([optKey, optValue]) => {
        const translatedKey = translations[optKey] || optKey;
        
        let translatedValue;
        if (Array.isArray(optValue)) {
          translatedValue = optValue.map(v => valueTranslations[v] || v).join(', ');
        } else {
          translatedValue = valueTranslations[optValue] || optValue;
        }
        
        return `${translatedKey}: ${translatedValue}`;
      })
      .join('; ');
  };

  return (
    <li key={key} className="flex justify-between text-sm sm:text-base">
      <span className="truncate max-w-[70%]">
        <span className="font-medium">{item.name}</span>
        {item.options && (
          <span className="text-xs text-gray-600 block ml-2">
            {formatOptions(item.options)}
          </span>
        )}
        {item.notes && (
          <span className="text-xs text-red-600 ml-1 sm:ml-2">
            (Obs: {item.notes})
          </span>
        )}
      </span>
      <span className="text-gray-700 whitespace-nowrap ml-2">
        x{item.quantity} • € {(item.price * item.quantity).toFixed(2)}
      </span>
    </li>
  );
})}
</ul>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                          <div className="text-base sm:text-lg font-semibold whitespace-nowrap">
                            Total: € {Object.values(order.items || {}).reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            {order.status === 'pending' && (
                          <button 
                          onClick={() => handleSendToKitchen(order.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                          <BsPrinter className="mr-2" />
                          Enviar para Cozinha
                        </button>
                            )}
                            {order.status === 'preparing' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                className="px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center flex-1 sm:flex-none text-sm sm:text-base"
                              >
                                <FiCheckCircle className="mr-1 sm:mr-2" />
                                Pronto
                              </button>
                            )}
                            {order.status === 'ready' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center flex-1 sm:flex-none text-sm sm:text-base"
                              >
                                <FiTruck className="mr-1 sm:mr-2" />
                                Entregar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'tables' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {activeTab === 'open' ? 'Mesas Abertas' : 'Histórico de Mesas'}
                </h2>
                
                {activeTab === 'open' ? (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        placeholder="Nº da mesa (1-30)"
                        className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={newTableNumber}
                        onChange={(e) => setNewTableNumber(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && createNewTable()}
                      />
                    </div>
                    <button
                      onClick={createNewTable}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center transition shadow-md hover:shadow-lg text-sm sm:text-base"
                    >
                      <FiPlus className="mr-1 sm:mr-2" />
                      Abrir Mesa
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center w-full sm:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="border rounded-lg px-3 py-2 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Data inicial"
                      />
                      <span className="text-gray-500 text-sm sm:text-base">até</span>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="border rounded-lg px-3 py-2 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Data final"
                      />
                    </div>
                    <select
                      value={historyFilter}
                      onChange={(e) => setHistoryFilter(e.target.value)}
                      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto text-sm sm:text-base"
                    >
                      <option value="all">Todas as mesas</option>
                      <option value="internal">Mesas internas</option>
                      <option value="external">Esplanada</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex bg-white rounded-lg shadow overflow-hidden">
                <button
                  className={`flex-1 py-2 sm:py-3 text-sm sm:text-base font-medium flex items-center justify-center ${activeTab === 'open' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('open')}
                >
                  <FiHome className="mr-1 sm:mr-2" />
                  Abertas
                </button>
                <button
                  className={`flex-1 py-2 sm:py-3 text-sm sm:text-base font-medium flex items-center justify-center ${activeTab === 'closed' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('closed')}
                >
                  <BsClockHistory className="mr-1 sm:mr-2" />
                  Histórico
                </button>
              </div>
              
              {selectedTable ? (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {showSummary ? (
                    <div className="p-4 sm:p-6">
                      <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-semibold">Resumo da Mesa #{selectedTable.number}</h3>
                        <button
                          onClick={() => setShowSummary(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiChevronLeft size={20} />
                        </button>
                      </div>
                      
                      <div className="border-2 border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="text-center mb-4 sm:mb-6">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Cozinha da Vivi</h3>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-6 pb-2 border-b gap-3 sm:gap-4">
                          <div>
                            <p className="font-medium text-sm sm:text-base">Mesa: #{selectedTable.number}</p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {selectedTable.type === 'internal' ? 'Interna' : 'Esplanada'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs sm:text-sm text-gray-600">
                              Aberta em: {new Date(selectedTable.createdAt).toLocaleTimeString()}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Fechada em: {new Date().toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-3 sm:mb-4">
                          <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 border-b pb-2">Consumo</h4>
                          
                          <div className="divide-y">
                            {selectedTable.order && Object.keys(selectedTable.order).length > 0 ? (
                              Object.entries(selectedTable.order).map(([key, item]) => (
                                <div key={key} className="py-2 sm:py-3 flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="p-1 sm:p-2 rounded-full bg-indigo-100 text-indigo-600 mr-2 sm:mr-3">
                                      {getIconComponent(item.iconName)}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-medium text-sm sm:text-base truncate">{item.name} (x{item.quantity || 1})</div>
                                      <div className="text-xs sm:text-sm text-gray-600 truncate">{item.category}</div>
                                      {item.type === 'food' && (
                                        <div className={`text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full inline-block mt-0.5 sm:mt-1 ${getItemStatusColor(item.status)}`}>
                                          {getItemStatusText(item.status)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right ml-2">
                                    <div className="font-medium text-sm sm:text-base">€ {(item.price * (item.quantity || 1)).toFixed(2)}</div>
                                    <div className={`text-xs ${item.type === 'food' ? 'text-blue-600' : 'text-purple-600'}`}>
                                      {item.type === 'food' ? 'Prato' : 'Bebida'}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                                Nenhum item consumido nesta mesa.
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="border-t pt-3 sm:pt-4">
                          <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-emerald-600">
                              € {calculateTotal(selectedTable).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                        <button
                          onClick={() => setShowSummary(false)}
                          className="px-4 sm:px-6 py-2 border rounded-lg hover:bg-gray-100 flex items-center justify-center text-sm sm:text-base"
                        >
                          <FiChevronLeft className="mr-1 sm:mr-2" />
                          Voltar
                        </button>
                        <button
                          onClick={confirmCloseTable}
                          className="px-4 sm:px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center text-sm sm:text-base"
                        >
                          <FiCheckCircle className="mr-1 sm:mr-2" />
                          Confirmar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 sm:p-6 border-b">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => {
                                setSelectedTable(null);
                                setAddingItems(false);
                              }}
                              className="mr-2 sm:mr-4 text-gray-500 hover:text-gray-700"
                            >
                              <FiChevronLeft size={20} />
                            </button>
                            <h3 className="text-lg sm:text-xl font-semibold">
                              Mesa #{selectedTable.number}
                              <span className={`ml-2 sm:ml-3 px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(selectedTable.status)}`}>
                                {getStatusIcon(selectedTable.status)}
                                {selectedTable.status === 'open' && 'Aberta'}
                                {selectedTable.status === 'closed' && 'Fechada'}
                              </span>
                            </h3>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            Aberta em: {new Date(selectedTable.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      
                      {addingItems ? (
                        <div className="p-4 sm:p-6">
                          {selectedItem ? (
                            <div className="mb-4 sm:mb-6">
                              <div className="flex items-center mb-3 sm:mb-4">
                                <button
                                  onClick={() => setSelectedItem(null)}
                                  className="mr-2 sm:mr-3 text-gray-500 hover:text-gray-700"
                                >
                                  <FiChevronLeft size={20} />
                                </button>
                                <h4 className="text-lg sm:text-xl font-semibold">{selectedItem.name}</h4>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                                <div>
                                  <p className="text-gray-600 text-sm sm:text-base">Preço unitário: € {selectedItem.price.toFixed(2)}</p>
                                  <p className="text-gray-600 text-sm sm:text-base">Categoria: {selectedItem.category}</p>
                                </div>
                                <div className="flex items-center bg-gray-100 rounded-lg">
                                  <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="px-3 sm:px-4 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300 transition"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 sm:px-4 py-2 text-center min-w-[40px] sm:min-w-[50px] font-medium text-sm sm:text-base">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="px-3 sm:px-4 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300 transition"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              
                              {/* Item Options */}
                              {selectedItem.options && (
                                <div className="space-y-4 mb-4 sm:mb-6">
                                  {Object.entries(selectedItem.options).map(([optionKey, option]) => (
                                    <div key={optionKey} className="border-b pb-4 last:border-b-0">
                                      <h5 className="font-medium text-gray-700 mb-2 sm:mb-3">{option.title}</h5>
                                      {renderOptionInput(optionKey, option)}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                                <button
                                  onClick={() => {
                                    setSelectedItem(null);
                                    setQuantity(1);
                                    setItemOptions({});
                                    setItemNotes('');
                                  }}
                                  className="px-4 sm:px-6 py-2 border rounded-lg hover:bg-gray-100 transition text-sm sm:text-base"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={() => addItemToCart(selectedItem)}
                                  className="px-4 sm:px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-600 flex items-center transition shadow-md hover:shadow-lg justify-center text-sm sm:text-base"
                                >
                                  <span className="font-medium">ADICIONAR</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="mb-4 sm:mb-6">
                                <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Adicionar Itens</h4>
                                
                                {cartItems.length > 0 && (
                                  <div className="mb-4 sm:mb-6 border rounded-lg divide-y">
                                    <div className="p-3 sm:p-4 bg-gray-50">
                                      <h5 className="font-medium">Itens no Carrinho</h5>
                                    </div>
                                    
                                    {cartItems.filter(item => item.type === 'food').length > 0 && (
                                      <div className="p-3 sm:p-4">
                                        <div className="flex items-center mb-2">
                                          <FiCoffee className="text-blue-500 mr-2" />
                                          <h6 className="font-medium text-blue-600">Para Cozinha</h6>
                                        </div>
                                        {cartItems.filter(item => item.type === 'food').map((item, index) => (
                                          <div key={index} className="flex justify-between items-center py-2">
                                            <div>
                                              <span className="font-medium">{item.name}</span>
                                              <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                                            </div>
                                            <div className="flex items-center">
                                              <span className="text-sm font-medium mr-2">€ {(item.price * item.quantity).toFixed(2)}</span>
                                              <button 
                                                onClick={() => removeItemFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700"
                                              >
                                                <FiTrash2 size={16} />
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {cartItems.filter(item => item.type === 'drink').length > 0 && (
                                      <div className="p-3 sm:p-4">
                                        <div className="flex items-center mb-2">
                                          <FaGlassWhiskey className="text-purple-500 mr-2" />
                                          <h6 className="font-medium text-purple-600">Para Bar</h6>
                                        </div>
                                        {cartItems.filter(item => item.type === 'drink').map((item, index) => (
                                          <div key={index} className="flex justify-between items-center py-2">
                                            <div>
                                              <span className="font-medium">{item.name}</span>
                                              <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                                            </div>
                                            <div className="flex items-center">
                                              <span className="text-sm font-medium mr-2">€ {(item.price * item.quantity).toFixed(2)}</span>
                                              <button 
                                                onClick={() => removeItemFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700"
                                              >
                                                <FiTrash2 size={16} />
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    
                                    <div className="p-3 sm:p-4 bg-gray-50 flex justify-between">
                                      <span className="font-medium">Total:</span>
                                      <span className="font-bold">
                                        € {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                
                                {cartItems.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                                    <button
                                      onClick={() => setCartItems([])}
                                      className="px-3 sm:px-4 py-2 border rounded-lg hover:bg-gray-100 transition text-sm sm:text-base"
                                    >
                                      Limpar Carrinho
                                    </button>
                                    <button
                                      onClick={sendCartItemsToTable}
                                      className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base"
                                    >
                                      Enviar Todos os Itens
                                    </button>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex overflow-x-auto pb-2 mb-3 sm:mb-4">
                                {categories.map(category => (
                                  <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-3 sm:px-4 py-1 sm:py-2 mr-1 sm:mr-2 rounded-full whitespace-nowrap text-xs sm:text-sm ${activeCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                  >
                                    {category === 'all' ? 'Todos' : category}
                                  </button>
                                ))}
                              </div>
                              
                              <div className="relative mb-4 sm:mb-6">
                                <input
                                  type="text"
                                  placeholder="Buscar item..."
                                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                {filteredMenuItems.map(item => (
                                  <button
                                    key={item.id}
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setQuantity(1);
                                      setItemOptions({});
                                      setItemNotes('');
                                    }}
                                    className="border rounded-lg p-3 sm:p-4 hover:bg-indigo-50 transition text-left flex items-center relative"
                                  >
                                    <div className={`p-1 sm:p-2 rounded-full ${item.type === 'food' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'} mr-2 sm:mr-3`}>
                                      {getIconComponent(item.iconName)}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-medium text-sm sm:text-base truncate">{item.name}</div>
                                      <div className="text-xs sm:text-sm text-gray-600">€ {item.price.toFixed(2)}</div>
                                      <div className={`text-xs ${item.type === 'food' ? 'text-blue-600' : 'text-purple-600'}`}>
                                        {item.type === 'food' ? 'Prato' : 'Bebida'}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                              
                              <div className="flex justify-end">
                                <button
                                  onClick={() => {
                                    setAddingItems(false);
                                    setCartItems([]);
                                  }}
                                  className="px-4 sm:px-6 py-2 border rounded-lg hover:bg-gray-100 transition text-sm sm:text-base"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 sm:p-6">
                          <div className="mb-4 sm:mb-6">
                            <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Itens do Pedido</h4>
                            
                            {selectedTable.order && Object.keys(selectedTable.order).length > 0 ? (
                              <div className="border rounded-lg divide-y">
                                {Object.entries(selectedTable.order).map(([key, item]) => (
                                  <div 
                                    key={key} 
                                    className="p-3 sm:p-4 flex justify-between items-center relative"
                                  >
                                    <div className="flex items-center flex-1 min-w-0">
                                      <div className={`p-1 sm:p-2 rounded-full ${item.type === 'food' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'} mr-2 sm:mr-3`}>
                                        {getIconComponent(item.iconName)}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="font-medium text-sm sm:text-base truncate">{item.name} (x{item.quantity || 1})</div>
                                        <div className="text-xs sm:text-sm text-gray-600 truncate">€ {(item.price * (item.quantity || 1)).toFixed(2)}</div>
                                        {item.type === 'food' && (
                                          <div className={`text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full inline-block mt-0.5 sm:mt-1 ${getItemStatusColor(item.status)}`}>
                                            {getItemStatusText(item.status)}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2 sm:space-x-4 ml-2">
                                      <button
                                        onClick={() => removeItemFromTable(selectedTable.id, key)}
                                        className="text-red-500 hover:text-red-700 p-1 transition"
                                      >
                                        <FiTrash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base border-2 border-dashed rounded-lg">
                                Nenhum item adicionado a esta mesa.
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                            <div className="text-base sm:text-lg font-semibold whitespace-nowrap">
                              Total: € {calculateTotal(selectedTable).toFixed(2)}
                            </div>
                    
                            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                              <button
                                onClick={() => {
                                  setAddingItems(true);
                                  setCartItems([]);
                                }}
                                className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center flex-1 sm:flex-none text-sm sm:text-base"
                              >
                                <FiPlus className="mr-1 sm:mr-2" />
                                Adicionar
                              </button>
                              
                              {hasUnprintedFoodItems && (
                                <button
                                onClick={() => confirmPrintKitchenItems(getUnprintedFoodItems())}
                                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center flex-1 sm:flex-none text-sm sm:text-base"
                              >
                                <BsPrinter className="mr-1 sm:mr-2" />
                                Enviar Cozinha
                              </button>
                              )}
                              
                              {hasUnprintedDrinkItems && (
                                <button
                                  onClick={() => confirmPrintBarItems(getUnprintedDrinkItems())}
                                  className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center flex-1 sm:flex-none text-sm sm:text-base"
                                >
                                  <FaGlassWhiskey className="mr-1 sm:mr-2" />
                                  Enviar Bar
                                </button>
                              )}
                              
                              <button
                                onClick={prepareCloseTable}
                                className="px-3 sm:px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center justify-center flex-1 sm:flex-none text-sm sm:text-base"
                              >
                                Fechar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {(activeTab === 'open' ? filteredTables : filteredHistoryTables).length === 0 ? (
                    <div className="p-6 sm:p-8 text-center">
                      <div className="text-gray-400 mb-3 sm:mb-4">
                        {activeTab === 'open' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 sm:h-12 w-10 sm:w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www3.org/2000/svg" className="h-10 sm:h-12 w-10 sm:w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-1">
                        {activeTab === 'open' ? 'Nenhuma mesa aberta' : 'Nenhum histórico no período'}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500">
                        {activeTab === 'open' ? 'Abra uma nova mesa para começar' : 'Altere o período ou filtro para encontrar mesas fechadas'}
                      </p>
                      {activeTab === 'open' && (
                        <button
                          onClick={() => document.querySelector('input[type="number"]')?.focus()}
                          className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center transition text-sm sm:text-base"
                        >
                          <FiPlus className="mr-1 sm:mr-2" />
                          Abrir Mesa
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mesa
                            </th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tipo
                            </th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Itens
                            </th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {activeTab === 'open' ? 'Aberta em' : 'Fechada em'}
                            </th>
                            <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(activeTab === 'open' ? filteredTables : filteredHistoryTables).map(table => (
                            <tr 
                              key={table.id} 
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() => setSelectedTable(table)}
                            >
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className={`flex-shrink-0 h-4 sm:h-5 w-4 sm:w-5 rounded-full ${table.type === 'internal' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'} flex items-center justify-center text-xs`}>
                                    {table.type === 'internal' ? 'I' : 'E'}
                                  </div>
                                  <div className="ml-2 sm:ml-4 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">#{table.number}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{table.type === 'internal' ? 'Interna' : 'Esplanada'}</div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {table.order ? Object.keys(table.order).length : 0}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {activeTab === 'open' ? `€ ${calculateTotal(table).toFixed(2)}` : `€ ${parseFloat(table.total || 0).toFixed(2)}`}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {new Date(activeTab === 'open' ? table.createdAt : table.closedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900 text-xs sm:text-sm">
                                  Ver
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSection === 'availability' && (
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Controle de Disponibilidade</h2>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 border-b">
                  <h3 className="text-lg font-semibold">Itens Especiais</h3>
                  <p className="text-sm text-gray-500">
                    Status atualizado em tempo real. Alterações afetam imediatamente o cardápio.
                  </p>
                </div>
                
                <div className="divide-y">
                  {menuItems
                    .filter(item => 
                      (item.category === 'Churrasco' && item.name.includes('Mandioca')) ||
                      (item.category === 'Porções' && item.name === 'Torresmo') ||
                      (item.category === 'Sobremesas' && (item.name === 'Açaí Grande' || item.name === 'Açaí Pequeno')) ||
                      item.name.includes('Mandioca')
                    )
                    .map(item => {
                      const isUnavailable = unavailableItems.includes(item.id.toString());
                      return (
                        <div key={item.id} className="p-4 sm:p-6 hover:bg-gray-50 transition">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1 min-w-0">
                              <div className={`p-2 sm:p-3 rounded-full ${
                                item.type === 'food' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                              } mr-3 sm:mr-4`}>
                                {getIconComponent(item.iconName)}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                                <p className="text-sm text-gray-500 truncate">
                                  {item.category} • € {item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => toggleItemAvailability(item.id)}
                              className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium ${
                                isUnavailable 
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {isUnavailable ? 'Indisponível' : 'Disponível'}
                            </button>
                          </div>
                          
                          <div className={`mt-2 text-xs sm:text-sm ${
                            isUnavailable ? 'text-red-600' : 'text-green-600'
                          }`}>
                            Status atual: {isUnavailable ? 'INDISPONÍVEL (não aparecerá no cardápio)' : 'DISPONÍVEL'}
                          </div>
                        </div>
                      );
                    })}
                  
                  {menuItems.filter(item => 
                    (item.category === 'Churrasco' && item.name.includes('Mandioca')) ||
                    (item.category === 'Porções' && item.name === 'Torresmo') ||
                    (item.category === 'Sobremesas' && (item.name === 'Açaí Grande' || item.name === 'Açaí Pequeno')) ||
                    item.name.includes('Mandioca')
                  ).length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                      Nenhum item especial encontrado.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;