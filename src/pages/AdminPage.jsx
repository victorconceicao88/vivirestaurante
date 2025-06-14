import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue, off, update, push, remove, set, get } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { database, auth } from '../firebase';
import { FiHome, FiClock, FiCoffee, FiCheckCircle, FiTruck, FiLogOut, FiMenu, FiX, FiChevronLeft, FiSearch, FiUser, FiEye, FiPhone, FiMapPin } from 'react-icons/fi';
import { BsReceipt, BsCashStack, BsPrinter } from 'react-icons/bs';
import { IoFastFoodOutline, IoClose } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState(null);
  const [swipeEndX, setSwipeEndX] = useState(null);
  const [order, setOrder] = useState(null);
  const { i18n } = useTranslation(); 

  const navigate = useNavigate();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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
const printKitchenOrder = async (order) => {
  // Configuração inicial para impressoras térmicas
  let content = '\x1B\x40\x1B\x21\x10'; // Inicializa + negrito
  
  try {
    // =============================================
    // DICIONÁRIO COMPLETO DE TRADUÇÕES (ATUALIZADO)
    // =============================================
    const translations = {
      options: {
        // Categorias principais
        beans: "FEIJÃO",
        sideDishes: "ACOMPANHAMENTOS",
        meats: "CARNES",
        salad: "SALADA",
        drinks: "BEBIDAS",
        toppings: "COBERTURAS",
        extras: "EXTRAS",
        // Tipos específicos
        beansType: "TIPO DE FEIJÃO",
        meatSelection: "SELECÃO DE CARNES",
        saladType: "TIPO DE SALADA",
        drinkSelection: "BEBIDA SELECIONADA",
        additionalToppings: "ADICIONAIS",
        // Açaí e complementos
        acaiSize: "TAMANHO DO AÇAÍ",
        acaiBase: "BASE",
        granolaType: "TIPO DE GRANOLA",
        toppingsAcai: "COBERTURAS (AÇAÍ)",
        specialRequests: "PEDIDOS ESPECIAIS",
        // Queijos
        cheeseType: "TIPO DE QUEIJO",
        cheesePreparation: "PREPARO DO QUEIJO"
      },
      values: {
        // Feijão e acompanhamentos
        broth: "COM CALDO",
        tropeiro: "TROPEIRO",
        banana: "BANANA FRITA",
        potato: "BATATA FRITA",
        cassavaFried: "MANDIOCA FRITA",
        cassavaCooked: "MANDIOCA COZIDA",
        mixed: "MISTA",
        vinaigrette: "VINAGRETE",
        none: "SEM",
        // Carnes
        heart: "CORAÇÃO DE FRANGO",
        ribs: "COSTELINHA SUÍNA",
        fillet: "FILÉ DE FRANGO",
        sausage: "LINGUIÇA",
        topSirloin: "MAMINHA",
        cracklings: "TORRESMO",
        onlyTopSirloin: "SÓ MAMINHA (+R$5,00)",
        // Bebidas
        pure: "PURO",
        waterStill: "ÁGUA SEM GÁS",
        waterSparkling: "ÁGUA COM GÁS",
        coke: "COCA-COLA",
        cokeZero: "COCA ZERO",
        fanta: "FANTA",
        guarana: "GUARANÁ",
        iceTea: "ICE TEA",
        // Extras
        bacon: "BACON",
        extraCheese: "QUEIJO EXTRA",
        egg: "OVO",
        // Açaí
        small: "PEQUENO (300ml)",
        medium: "MÉDIO (500ml)",
        large: "GRANDE (700ml)",
        pureAcai: "AÇAÍ PURO",
        mixedAcai: "AÇAÍ MISTO",
        bananaGranola: "GRANOLA COM BANANA",
        traditionalGranola: "GRANOLA TRADICIONAL",
        // Coberturas
        leiteNinho: "LEITE NINHO",
        paçoca: "PAÇOCA",
        nutella: "NUTELLA",
        condensedMilk: "LEITE CONDENSADO",
        // Queijos
        coalho: "QUEIJO COALHO",
        prato: "QUEIJO PRATO",
        friedCheese: "QUEIJO FRITO",
        grilledCheese: "QUEIJO GRELHADO",
        // Status
        complete: "COMPLETO",
        custom: "PERSONALIZADO"
      },
      labels: {
        orderNumber: "PEDIDO N°",
        dateTime: "DATA/HORA",
        customer: "CLIENTE",
        phone: "TELEFONE",
        delivery: "ENTREGA",
        pickup: "RETIRADA",
        address: "ENDEREÇO",
        notes: "OBSERVAÇÕES",
        subtotal: "SUBTOTAL",
        deliveryFee: "TAXA DE ENTREGA",
        total: "TOTAL",
        paymentMethod: "FORMA DE PAGAMENTO",
        changeFor: "TROCO PARA"
      }
    };

    // =============================================
    // FUNÇÕES DE FORMATAÇÃO PROFISSIONAL
    // =============================================
    const centerText = (text, width = 32) => {
      text = text || '';
      const padding = Math.max(0, width - text.length);
      return ' '.repeat(Math.floor(padding/2)) + text + ' '.repeat(Math.ceil(padding/2));
    };

    const formatCurrency = (value) => {
      return 'R$ ' + parseFloat(value || 0).toFixed(2).replace('.', ',');
    };

    const safeString = (value) => {
      if (value == null) return '';
      if (typeof value === 'object') {
        if (Array.isArray(value)) return value.map(v => translations.values[v] || v).join(', ');
        return translations.values[value.selected] || translations.values[value.display] || '';
      }
      return translations.values[value] || String(value).toUpperCase();
    };

    // =============================================
    // CABEÇALHO PROFISSIONAL
    // =============================================
    content += centerText('COZINHA DA VIVI ') + '\n';
    content += centerText(''.padEnd(32, '=')) + '\n';
    content += centerText(`${translations.labels.orderNumber} ${order.id.slice(-4)}`) + '\n';
    content += centerText(new Date().toLocaleString('pt-BR')) + '\n';
    content += centerText(''.padEnd(32, '-')) + '\n';

    // =============================================
    // INFORMAÇÕES DO CLIENTE
    // =============================================
    content += `${translations.labels.customer}: ${order.customerName || 'NÃO INFORMADO'}\n`;
    content += `${translations.labels.phone}: ${order.customerPhone || 'NÃO INFORMADO'}\n`;
    content += `TIPO: ${order.deliveryAddress ? translations.labels.delivery : translations.labels.pickup}\n`;
    
    if (order.deliveryAddress) {
      content += `${translations.labels.address}: ${order.deliveryAddress}\n`;
      if (order.postalCode) {
        content += `CEP: ${order.postalCode.replace(/(\d{5})(\d{3})/, '$1-$2')}\n`;
      }
    }

    content += centerText(''.padEnd(32, '-')) + '\n';

    // =============================================
    // ITENS DO PEDIDO (FORMATADO PARA COZINHA)
    // =============================================
    content += '\x1B\x21\x10' + centerText('ITENS DO PEDIDO') + '\x1B\x21\x00' + '\n';
    
    let subtotal = 0;
    const items = Array.isArray(order.items) ? order.items : Object.values(order.items || {});

    items.forEach(item => {
      const quantity = item.quantity || 1;
      const price = item.price || 0;
      const total = quantity * price;
      subtotal += total;

      content += '\n' + '\x1B\x21\x08'; // Negrito
      content += `${quantity}x ${item.name.toUpperCase()}\n`;
      content += '\x1B\x21\x00'; // Normal
      content += `VALOR: ${formatCurrency(total)}\n`;

      // Opções do item
      if (item.options) {
        Object.entries(item.options).forEach(([key, value]) => {
          if (value && value !== 'none') {
            const optionName = translations.options[key] || key.toUpperCase();
            const optionValue = safeString(value);
            if (optionValue) content += `- ${optionName}: ${optionValue}\n`;
          }
        });
      }

      // Observações
      if (item.notes) {
        content += `OBS: ${item.notes}\n`;
      }

      content += ''.padEnd(32, '.') + '\n';
    });

    // =============================================
    // RESUMO FINAL
    // =============================================
    content += '\n' + centerText(''.padEnd(32, '=')) + '\n';
    content += `${translations.labels.subtotal}: ${formatCurrency(subtotal)}\n`;
    
    if (order.deliveryFee) {
      content += `${translations.labels.deliveryFee}: ${formatCurrency(order.deliveryFee)}\n`;
    }
    
    content += '\x1B\x21\x10'; // Negrito
    content += `${translations.labels.total}: ${formatCurrency(subtotal + (order.deliveryFee || 0))}\n`;
    content += '\x1B\x21\x00'; // Normal
    
    content += centerText(''.padEnd(32, '=')) + '\n';
    
    // Pagamento
    content += `${translations.labels.paymentMethod}: ${order.paymentMethod?.toUpperCase() || 'NÃO ESPECIFICADO'}\n`;
    
    if (order.changeFor) {
      content += `${translations.labels.changeFor}: ${formatCurrency(order.changeFor)}\n`;
    }

    // Observações gerais
    if (order.notes) {
      content += '\n' + `${translations.labels.notes}: ${order.notes}\n`;
    }

    // =============================================
    // RODAPÉ PROFISSIONAL
    // =============================================
    content += '\n' + centerText(''.padEnd(32, '=')) + '\n';
    content += centerText('OBRIGADO PELA PREFERÊNCIA!') + '\n';
    content += centerText('VOLTE SEMPRE') + '\n';
    content += '\n\n\n\x1D\x56\x00'; // Corta o papel

    // =============================================
    // ENVIO PARA IMPRESSORA
    // =============================================
    const printSuccess = await sendToPrinter(content);
    return printSuccess;

  } catch (error) {
    console.error('ERRO NA IMPRESSÃO:', error);
    return false;
  }
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


const sendToPrinter = async (content) => {
  try {
    console.log('Iniciando conexão Bluetooth...');
    
    if (!navigator.bluetooth) {
      throw new Error('Bluetooth não suportado neste navegador');
    }

    // 1. Solicitar dispositivo Bluetooth
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "BlueTooth Printer" }], // Substitua pelo nome real da sua impressora
      optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'] // UUID comum para impressoras térmicas
    });

    console.log('Dispositivo selecionado:', device.name);

    // 2. Gerenciar eventos de desconexão
    device.addEventListener('gattserverdisconnected', () => {
      console.warn('Dispositivo desconectado!');
    });

    // 3. Conectar ao servidor GATT
    console.log('Conectando ao servidor GATT...');
    const server = await device.gatt.connect();
    
    // 4. Obter serviço e característica
    console.log('Obtendo serviço...');
    const service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
    
    console.log('Obtendo característica...');
    const characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

    // 5. Enviar dados em chunks
    console.log('Enviando dados para impressão...');
    const encoder = new TextEncoder();
    const chunkSize = 100; // Tamanho seguro para envio
    
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      await characteristic.writeValue(encoder.encode(chunk));
      await new Promise(resolve => setTimeout(resolve, 50)); // Pequeno delay entre chunks
    }

    // 6. Comando para cortar papel
    console.log('Enviando comando de corte...');
    const cutCommand = new Uint8Array([0x1D, 0x56, 0x41, 0x05]);
    await characteristic.writeValue(cutCommand);

    // 7. Desconectar após envio
    setTimeout(() => {
      device.gatt.disconnect();
      console.log('Desconectado com sucesso');
    }, 1000);

    return true;
    
  } catch (error) {
    console.error('Erro na impressão:', error);
    
    // Fallback para exibição do conteúdo
    const printableContent = content
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove caracteres de controle
      .replace(/\x1B\[[0-9;]*[mGKH]/g, '') // Remove códigos de escape
      .replace(/\n/g, '<br>');
    
    alert(`ERRO DE IMPRESSÃO\n\nCopie e cole manualmente na impressora:\n\n${printableContent}`);
    
    return false;
  }
};

// Exemplo de chamada
const handleSendToKitchen = async (orderId) => {
  try {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      console.error('Pedido não encontrado:', orderId);
      showNotification('Pedido não encontrado', 'error');
      return;
    }

    await printKitchenOrder(order);

    await updateOrderStatus(orderId, 'preparing');

    if (order.customerPhone) {
      sendWhatsAppNotification(order, 'preparing');
    }

    showNotification('Pedido enviado para a cozinha com sucesso!', 'success');

  } catch (error) {
    console.error('Erro ao enviar para a cozinha:', error);
    showNotification('Erro ao processar pedido', 'error');
  }
};

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const orderRef = ref(database, `orders/${orderId}`);
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        showNotification('Pedido não encontrado', 'error');
        return;
      }

      await update(orderRef, { 
        status,
        updatedAt: new Date().toISOString()
      });

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

  // Função ultra-robusta para calcular totais
const getOrderTotal = (order) => {
  try {
    if (!order) return 0;
    
    // Caso o pedido já tenha um total calculado e válido
    if (typeof order.total === 'number' && !isNaN(order.total)) {
      return order.total;
    }
    
    // Se for string, tenta converter para número
    if (typeof order.total === 'string') {
      const parsedTotal = parseFloat(order.total);
      if (!isNaN(parsedTotal)) {
        return parsedTotal;
      }
    }

    // Calcula subtotal dos itens com verificações robustas
    let subtotal = 0;
    if (order.items && typeof order.items === 'object') {
      Object.values(order.items).forEach(item => {
        if (!item) return;
        
        // Garante que price seja um número válido
        const price = typeof item.price === 'number' ? item.price : 
                     typeof item.price === 'string' ? parseFloat(item.price) : 0;
        
        // Garante que quantity seja um número válido (mínimo 1)
        const quantity = typeof item.quantity === 'number' ? Math.max(1, item.quantity) :
                         typeof item.quantity === 'string' ? Math.max(1, parseInt(item.quantity)) : 1;
        
        if (!isNaN(price) && !isNaN(quantity)) {
          subtotal += price * quantity;
        }
      });
    }

    // Adiciona taxa de entrega se aplicável com verificações
    let deliveryFee = 0;
    if (order.deliveryAddress) {
      if (typeof order.deliveryFee === 'number') {
        deliveryFee = order.deliveryFee;
      } else if (typeof order.deliveryFee === 'string') {
        const parsedFee = parseFloat(order.deliveryFee);
        deliveryFee = isNaN(parsedFee) ? (order.isOver5km ? 3.5 : 2.0) : parsedFee;
      } else {
        deliveryFee = order.isOver5km ? 3.5 : 2.0;
      }
    }

    // Retorna o total garantindo que seja número
    const total = subtotal + deliveryFee;
    return typeof total === 'number' ? total : 0;
    
  } catch (error) {
    console.error('Error calculating order total:', error);
    return 0; // Fallback seguro
  }
};

const total = getOrderTotal(order);
 
  // Função 100% segura para formatar valores
  const formatCurrency = (value) => {
    const number = parseFloat(value) || 0;
    return number.toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    } else if (difference < -50) { // Swipe right
      if (!mobileMenuOpen) {
        setMobileMenuOpen(true);
      }
    }
    
    setSwipeStartX(null);
    setSwipeEndX(null);
  };

  useEffect(() => {
    const ordersRef = ref(database, 'orders');
  
    const ordersListener = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const ordersArray = data ? Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value
      })) : [];
      setOrders(ordersArray);
    });
  
    return () => {
      off(ordersRef, ordersListener);
    };
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeSection !== 'online') return false;
    const statusMatch = order.status === activeTab;
    const searchMatch = !searchTerm || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customerPhone && order.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()));
    return statusMatch && searchMatch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-emerald-100 text-emerald-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FiClock className="mr-1" />;
      case 'preparing': return <FiCoffee className="mr-1" />;
      case 'ready': return <FiCheckCircle className="mr-1" />;
      case 'delivered': return <FiTruck className="mr-1" />;
      default: return <FiClock className="mr-1" />;
    }
  };

  const stats = useMemo(() => {
    return {
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      preparingOrders: orders.filter(o => o.status === 'preparing').length,
    };
  }, [orders]);

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
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
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
                                            
                        {order.items && Object.entries(order.items).map(([key, item]) => (
                          <div key={key} className="mb-2">
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {item.quantity}x {item.name}
                              </span>
                              <span>€{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            
                            {item.options && (
                              <div className="text-sm text-gray-600 ml-2 mt-1">
                                {Object.entries(item.options).map(([optKey, opt]) => (
                                  <div key={optKey}>
                                    <strong>{opt.optionName || optKey}:</strong> {opt.display || opt.selected}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {item.notes && (
                              <div className="text-sm text-red-600 ml-2 mt-1">
                                <strong>Obs:</strong> {item.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </ul>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                          <div className="text-base sm:text-lg font-semibold whitespace-nowrap">
                            {order.deliveryAddress && (
                              <>
                                <div className="text-sm text-gray-600">
                                  Subtotal: € {Object.values(order.items || {}).reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Taxa de entrega: € {order.isOver5km ? '3.50' : '2.00'}
                                </div>
                              </>
                            )}
                            <div className="mt-1">Total: € {(getOrderTotal(order) || 0).toFixed(2)}</div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                               {order.status === 'pending' && (
                                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                  <button 
                                    onClick={() => handleSendToKitchen(order.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                                  >
                                    <BsPrinter className="mr-2" />
                                    Enviar Cozinha
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
                                        updateOrderStatus(order.id, 'delivered');
                                        showNotification('Pedido cancelado com sucesso');
                                      }
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                                  >
                                    <FiX className="mr-2" />
                                    Cancelar
                                  </button>
                                </div>
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
        </div>
      </div>
    </div>
  );
};

export default AdminPage;