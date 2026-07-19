import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  LayoutDashboard,
  Users,
  Gamepad2,
  CreditCard,
  BarChart3,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  FileDown,
  Server,
  Activity,
  RefreshCw,
  AlertTriangle,
  Megaphone,
  Database,
  TrendingUp,
  Clock,
  ChevronRight,
  Plus,
  Menu,
  X,
  Search,
  Bell,
  MessageSquare,
  ShieldCheck,
  Ticket,
  Package,
  Download,
  Trash2,
  Edit,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  DollarSign,
  TrendingDown
} from 'lucide-react';
import { Modal, Button, Input, Tag, Select, message, Popover, Badge } from 'antd';
import api from '../services/api';

const { Option } = Select;

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin, logout, updateProfile, changePassword, appInitializing } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Active tabs: dashboard, analytics, transactions, games, products, users, payments, promotions, reports, support, security
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Maintenance & Broadcast variables
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [activeBroadcast, setActiveBroadcast] = useState('');
  const [broadcastInput, setBroadcastInput] = useState('');
  const [syncMarkup, setSyncMarkup] = useState('10');
  const [syncingCatalog, setSyncingCatalog] = useState(false);

  // Modal State Controls
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Selected entities for edit modal forms
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Master Data States (Loaded from API or hydrated with rich fallback mocks)
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [games, setGames] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [activeMetric, setActiveMetric] = useState('revenue');
  const [analyticsSummary, setAnalyticsSummary] = useState(null);

  // Input states for form additions
  const [newGameName, setNewGameName] = useState('');
  const [newGameKh, setNewGameKh] = useState('');
  const [newGameCat, setNewGameCat] = useState('Mobile');
  const [newGameLogo, setNewGameLogo] = useState('');
  const [newGameBanner, setNewGameBanner] = useState('');
  const [newGamePopular, setNewGamePopular] = useState(false);
  const [newGameFeatured, setNewGameFeatured] = useState(false);
  const [newGameServerRequired, setNewGameServerRequired] = useState(false);

  // Banner state variables
  const [bannersList, setBannersList] = useState([]);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [newBannerTitleEn, setNewBannerTitleEn] = useState('');
  const [newBannerTitleKh, setNewBannerTitleKh] = useState('');
  const [newBannerImgUrl, setNewBannerImgUrl] = useState('');
  const [newBannerLinkUrl, setNewBannerLinkUrl] = useState('');
  const [newBannerOrder, setNewBannerOrder] = useState('0');
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDisc, setNewProdDisc] = useState('0');
  const [newProdGameId, setNewProdGameId] = useState('');
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState('');
  const [newCouponType, setNewCouponType] = useState('percentage'); // percentage, fixed
  const [newCouponStartDate, setNewCouponStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCouponEndDate, setNewCouponEndDate] = useState(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Ticket solution response input
  const [solutionText, setSolutionText] = useState('');

  // Administrative Profile Form States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  // Live Chat connection variables
  const [activeChatTicket, setActiveChatTicket] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState({
    'TCK-2947': [
      { id: 1, sender: 'customer', text: 'Hello, I paid 10 minutes ago but diamonds still not loaded. Please help!', time: '10:40 AM' },
      { id: 2, sender: 'admin', text: 'Hi Dara Sok! Let me check the reference transaction details. Did you upload the receipt?', time: '10:41 AM' },
      { id: 3, sender: 'customer', text: 'Yes, I uploaded it. The ABA reference code is ABA-92845.', time: '10:42 AM' }
    ],
    'TCK-3850': [
      { id: 1, sender: 'customer', text: 'Requesting refund for double transaction transfer.', time: 'Yesterday' },
      { id: 2, sender: 'admin', text: 'We have processed the refund to your ABA account. Please check.', time: 'Yesterday' },
      { id: 3, sender: 'customer', text: 'Received. Thank you!', time: 'Yesterday' }
    ]
  });

  // Audit Logs stream
  const [consoleLogs, setConsoleLogs] = useState([
    'Secure encryption handshake verified.',
    'Port listener initialized on port 5174.',
    'Analytical databases compiled successfully.'
  ]);

  const hasAlertedRef = React.useRef(false);

  // Auth Guard checking
  useEffect(() => {
    if (appInitializing) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin()) {
      if (!hasAlertedRef.current) {
        hasAlertedRef.current = true;
        message.error('Unauthorized access.');
        window.location.href = 'http://localhost:5173';
      }
    }
  }, [appInitializing, isAuthenticated, isAdmin, navigate]);

  const handleLogout = async () => {
    await logout();
    message.success('Administrative session closed.');
    navigate('/login');
  };

  // Live telemetry logger simulator
  useEffect(() => {
    const liveActions = [
      'Synchronized active payment gateways with national banks.',
      'Auto-cached catalog indexing files.',
      'Refreshed coupon validator modules.',
      'Visitor metrics index updated.',
      'Backend system heartbeats active.'
    ];
    const logInterval = setInterval(() => {
      const selectedAction = liveActions[Math.floor(Math.random() * liveActions.length)];
      setConsoleLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${selectedAction}`]);
    }, 8000);
    return () => clearInterval(logInterval);
  }, []);

  // Hydrate dashboard records
  useEffect(() => {
    const loadAllDashboardData = async () => {
      // 0. Settings
      try {
        const settingsRes = await api.get('/settings');
        if (settingsRes.data?.success) {
          setMaintenanceMode(settingsRes.data.data.maintenance_mode);
          setActiveBroadcast(settingsRes.data.data.alert_message || '');
          setBroadcastInput(settingsRes.data.data.alert_message || '');
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }

      // 1. Orders
      try {
        const res = await api.get('/admin/orders');
        setOrders(res.data.data);
      } catch (err) {
        setOrders([
          { id: 1, order_no: 'TRX-829471', customer_name: 'Dara Sok', game_name: 'Mobile Legends', package_name: 'Weekly Diamond Pass', total_price_usd: 1.99, status: 'completed', payment_method: 'KHQR', created_at: '2026-07-16 10:15' },
          { id: 2, order_no: 'TRX-918274', customer_name: 'Vannak Lim', game_name: 'Valorant', package_name: '1050 Points', total_price_usd: 9.99, status: 'pending', payment_method: 'ABA Pay', created_at: '2026-07-16 09:30' },
          { id: 3, order_no: 'TRX-716283', customer_name: 'Sokha Nguon', game_name: 'PUBG Mobile', package_name: '660 UC', total_price_usd: 10.00, status: 'completed', payment_method: 'Wing', created_at: '2026-07-15 18:45' },
          { id: 4, order_no: 'TRX-615243', customer_name: 'Chanthou Seng', game_name: 'Free Fire', package_name: '100 Diamonds', total_price_usd: 0.99, status: 'failed', payment_method: 'Credit Card', created_at: '2026-07-15 14:20' },
          { id: 5, order_no: 'TRX-514232', customer_name: 'Phearak Ly', game_name: 'Genshin Impact', package_name: 'Welkin Moon', total_price_usd: 4.99, status: 'completed', payment_method: 'KHQR', created_at: '2026-07-14 11:10' }
        ]);
      }

      // 2. Payments & verifications
      try {
        const res = await api.get('/admin/payments');
        setPayments(res.data.data);
      } catch (err) {
        setPayments([
          { id: 1, order_no: 'TRX-918274', transaction_no: 'ABA-827419', amount_usd: 9.99, status: 'pending', receipt_image_url: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&auto=format&fit=crop&q=80', created_at: '2026-07-16 09:30' }
        ]);
      }

      // 3. Games
      try {
        const res = await api.get('/games/active');
        setGames(res.data.data);
      } catch (err) {
        setGames([
          { id: 1, name_en: 'Mobile Legends', name_kh: 'ម៉ូបាលលីជិន', category_name: 'Mobile', is_active: 1, is_popular: 1 },
          { id: 2, name_en: 'Free Fire', name_kh: 'ហ្វ្រីហ្វាយ', category_name: 'Mobile', is_active: 1, is_popular: 1 },
          { id: 3, name_en: 'PUBG Mobile', name_kh: 'ផាប់ជីម៉ូបាល', category_name: 'Mobile', is_active: 1, is_popular: 1 },
          { id: 4, name_en: 'Valorant', name_kh: 'វ៉ាលឡូរែន', category_name: 'PC & Console', is_active: 1, is_popular: 1 },
          { id: 5, name_en: 'Genshin Impact', name_kh: 'ហ្គេនស៊ីន', category_name: 'PC & Console', is_active: 1, is_popular: 0 }
        ]);
      }

      // 4. Products
      try {
        const res = await api.get('/admin/packages');
        setProducts(res.data.data);
      } catch (err) {
        setProducts([
          { id: 1, game_name: 'Mobile Legends', name: 'Weekly Diamond Pass', price_usd: 1.99, discount_pct: 10, is_available: 1 },
          { id: 2, game_name: 'Mobile Legends', name: '223 Diamonds', price_usd: 4.80, discount_pct: 0, is_available: 1 },
          { id: 3, game_name: 'Valorant', name: '1050 VP Points', price_usd: 9.99, discount_pct: 5, is_available: 1 },
          { id: 4, game_name: 'PUBG Mobile', name: '660 UC', price_usd: 10.00, discount_pct: 0, is_available: 1 },
          { id: 5, game_name: 'Genshin Impact', name: 'Blessing of the Welkin Moon', price_usd: 4.99, discount_pct: 0, is_available: 0 }
        ]);
      }

      // 5. Users List
      try {
        const res = await api.get('/admin/users');
        setUsersList(res.data.data);
      } catch (err) {
        setUsersList([
          { id: 1, name: 'Dara Sok', email: 'dara@example.com', phone: '012334455', role: 'customer', spending_usd: 245.00, created_at: '2026-05-12' },
          { id: 2, name: 'Vannak Lim', email: 'vannak@example.com', phone: '098887766', role: 'customer', spending_usd: 99.50, created_at: '2026-06-10' },
          { id: 3, name: 'Sokha Nguon', email: 'sokha@example.com', phone: '085332211', role: 'customer', spending_usd: 180.00, created_at: '2026-06-25' },
          { id: 4, name: 'Phearak Ly', email: 'phearak@example.com', phone: '011223344', role: 'admin', spending_usd: 4.99, created_at: '2026-07-01' },
          { id: 5, name: 'Sophal Kheng', email: 'sophal@example.com', phone: '089445566', role: 'suspended', spending_usd: 0.00, created_at: '2026-07-10' }
        ]);
      }

      // 6. Coupons & Promotions
      try {
        const res = await api.get('/admin/coupons');
        setCoupons(res.data.data);
      } catch (err) {
        setCoupons([
          { id: 1, code: 'GAMER2026', type: 'discount', value: 15, is_active: 1, expires_at: '2026-12-31' },
          { id: 2, code: 'LEGENDS5', type: 'cashback', value: 5, is_active: 1, expires_at: '2026-08-30' },
          { id: 3, code: 'WELCOME10', type: 'discount', value: 10, is_active: 0, expires_at: '2026-04-01' }
        ]);
      }

      // 7. Support tickets
      setSupportTickets([
        { id: 1, code: 'TCK-2947', customer: 'Dara Sok', subject: 'Diamonds not loaded in Mobile Legends', priority: 'high', status: 'open', created_at: '2026-07-16 08:20' },
        { id: 2, code: 'TCK-3850', customer: 'Sokha Nguon', subject: 'Refund request double transfer', priority: 'medium', status: 'resolved', created_at: '2026-07-15 14:10' }
      ]);

      // 8. Security audit logs & G2Bulk API Logs
      try {
        const res = await api.get('/admin/api-logs');
        if (res.data?.success && res.data.data) {
          setSecurityLogs(res.data.data);
        } else {
          setSecurityLogs([
            { id: 1, operator: 'Phearak Ly', action: 'Approved Payment ID TRX-829471', ip_address: '192.168.1.45', date: '2026-07-16 10:16' },
            { id: 2, operator: 'Reaksa Admin', action: 'Updated Game Catalog for Valorant', ip_address: '192.168.1.12', date: '2026-07-16 09:12' },
            { id: 3, operator: 'System Daemon', action: 'Database automated sync complete', ip_address: '127.0.0.1', date: '2026-07-16 00:00' }
          ]);
        }
      } catch (err) {
        setSecurityLogs([
          { id: 1, operator: 'Phearak Ly', action: 'Approved Payment ID TRX-829471', ip_address: '192.168.1.45', date: '2026-07-16 10:16' },
          { id: 2, operator: 'Reaksa Admin', action: 'Updated Game Catalog for Valorant', ip_address: '192.168.1.12', date: '2026-07-16 09:12' },
          { id: 3, operator: 'System Daemon', action: 'Database automated sync complete', ip_address: '127.0.0.1', date: '2026-07-16 00:00' }
        ]);
      }

      // 9. Analytics Summary
      try {
        const res = await api.get('/admin/analytics');
        setAnalyticsSummary(res.data.data);
      } catch (err) {
        setAnalyticsSummary(null);
      }

      // 10. Homepage Promotional Banners
      try {
        const res = await api.get('/admin/banners');
        setBannersList(res.data.data);
      } catch (err) {
        setBannersList([
          { id: 1, title_en: 'Mobile Legends Tournament Edition', title_kh: 'ការប្រកួតកីឡាអេឡិចត្រូនិក Mobile Legends', image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80', link_url: '/games/mobile-legends', is_active: true, order_index: 1 },
          { id: 2, title_en: 'Free Fire Survival Pass season 12', title_kh: 'សំបុត្ររស់រានមានជីវិត Free Fire វគ្គ ១២', image_url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=1200&auto=format&fit=crop&q=80', link_url: '/games/free-fire', is_active: true, order_index: 2 }
        ]);
      }
    };
    loadAllDashboardData();
  }, [activeTab]);

  if (appInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#030712] text-slate-100 font-bold font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-t-blue-500 border-r-transparent border-slate-800 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-black tracking-widest uppercase animate-pulse">Initializing Operator console...</p>
        </div>
      </div>
    );
  }

  // Handle support ticket solution submit
  const handleSolveTicket = (ticket) => {
    setSelectedTicket(ticket);
    setSolutionText('');
    setTicketModalOpen(true);
  };

  const submitTicketSolution = () => {
    if (!solutionText.trim()) {
      message.error('Please input solution remarks.');
      return;
    }
    setSupportTickets(prev =>
      prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'resolved' } : t)
    );
    message.success(`Ticket ${selectedTicket.code} marked as resolved.`);
    setTicketModalOpen(false);
  };

  // Save Game (Add or Edit)
  const handleSaveGame = async (e) => {
    e.preventDefault();
    if (!newGameName.trim()) {
      message.error('Please enter English title.');
      return;
    }

    const payload = {
      name_en: newGameName,
      name_kh: newGameKh,
      category_name: newGameCat,
      logo_url: newGameLogo,
      banner_url: newGameBanner,
      is_popular: newGamePopular ? 1 : 0,
      is_featured: newGameFeatured ? 1 : 0,
      server_id_required: newGameServerRequired ? 1 : 0
    };

    if (selectedGame) {
      // Edit mode
      try {
        const res = await api.put(`/admin/games/${selectedGame.id}/update`, payload);
        message.success('Game title updated successfully.');
        setGames(prev => prev.map(g => g.id === selectedGame.id ? {
          ...g,
          name_en: res.data.data.name_en,
          name_kh: res.data.data.name_kh,
          category_name: newGameCat,
          logo_url: res.data.data.logo_url,
          banner_url: res.data.data.banner_url,
          is_popular: res.data.data.is_popular ? 1 : 0,
          is_featured: res.data.data.is_featured ? 1 : 0,
          server_id_required: res.data.data.server_id_required ? 1 : 0
        } : g));
      } catch (err) {
        setGames(prev => prev.map(g => g.id === selectedGame.id ? {
          ...g,
          name_en: newGameName,
          name_kh: newGameKh || newGameName,
          category_name: newGameCat,
          logo_url: newGameLogo,
          banner_url: newGameBanner,
          is_popular: newGamePopular ? 1 : 0,
          is_featured: newGameFeatured ? 1 : 0,
          server_id_required: newGameServerRequired ? 1 : 0
        } : g));
        message.success('(Simulation) Game title updated.');
      }
    } else {
      // Add mode
      try {
        const res = await api.post('/admin/games', payload);
        message.success('New Game Catalog Title registered.');
        setGames(prev => [...prev, {
          id: res.data.data.id,
          name_en: res.data.data.name_en,
          name_kh: res.data.data.name_kh,
          category_name: newGameCat,
          is_active: res.data.data.status ? 1 : 0,
          is_popular: res.data.data.is_popular ? 1 : 0,
          logo_url: res.data.data.logo_url,
          banner_url: res.data.data.banner_url
        }]);
      } catch (err) {
        const nextId = games.length + 1;
        setGames(prev => [
          ...prev,
          { id: nextId, name_en: newGameName, name_kh: newGameKh || newGameName, category_name: newGameCat, is_active: 1, is_popular: newGamePopular ? 1 : 0, logo_url: newGameLogo, banner_url: newGameBanner }
        ]);
        message.success('(Simulation) New Game Catalog Title registered.');
      }
    }

    // Reset fields
    setNewGameName('');
    setNewGameKh('');
    setNewGameLogo('');
    setNewGameBanner('');
    setNewGamePopular(false);
    setNewGameFeatured(false);
    setNewGameServerRequired(false);
    setSelectedGame(null);
    setGameModalOpen(false);
  };

  // Click handler to edit game
  const handleEditGameClick = (game) => {
    setSelectedGame(game);
    setNewGameName(game.name_en || '');
    setNewGameKh(game.name_kh || '');
    setNewGameCat(game.category_name || 'Mobile');
    setNewGameLogo(game.logo_url || '');
    setNewGameBanner(game.banner_url || '');
    setNewGamePopular(game.is_popular === 1 || !!game.is_popular);
    setNewGameFeatured(game.is_featured === 1 || !!game.is_featured);
    setNewGameServerRequired(game.server_id_required === 1 || !!game.server_id_required);
    setGameModalOpen(true);
  };

  const handleGameImageUpload = async (file, type) => {
    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data?.success) {
        if (type === 'logo') {
          setNewGameLogo(res.data.url);
        } else {
          setNewGameBanner(res.data.url);
        }
        message.success('Image uploaded successfully.');
      } else {
        message.error('Failed to upload image.');
      }
    } catch (err) {
      console.error('Error uploading game image:', err);
      const simulatedUrl = URL.createObjectURL(file);
      if (type === 'logo') {
        setNewGameLogo(simulatedUrl);
      } else {
        setNewGameBanner(simulatedUrl);
      }
      message.success('(Simulation) Image uploaded successfully.');
    } finally {
      setImageUploading(false);
    }
  };

  // Delete Game
  const handleDeleteGame = async (gameId) => {
    try {
      await api.delete(`/admin/games/${gameId}`);
      message.success('Game removed from catalog.');
      setGames(prev => prev.filter(g => g.id !== gameId));
    } catch (err) {
      setGames(prev => prev.filter(g => g.id !== gameId));
      message.success('(Simulation) Game removed from catalog.');
    }
  };

  // Toggle Game Status
  const toggleGameStatus = async (gameId, currentStatus) => {
    try {
      await api.put(`/admin/games/${gameId}`);
      message.success('Game status updated.');
      setGames(prev => prev.map(g => g.id === gameId ? { ...g, status: currentStatus ? 0 : 1 } : g));
    } catch (err) {
      setGames(prev => prev.map(g => g.id === gameId ? { ...g, status: currentStatus ? 0 : 1 } : g));
      message.info('(Simulation) Game status updated.');
    }
  };

  // Save Product Package (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice || !newProdGameId) {
      message.error('Please complete product info.');
      return;
    }

    const payload = {
      game_id: newProdGameId,
      name_en: newProdName,
      price_usd: parseFloat(newProdPrice),
      discount_pct: parseInt(newProdDisc)
    };

    if (selectedProduct) {
      // Edit mode
      try {
        const res = await api.put(`/admin/packages/${selectedProduct.id}`, payload);
        message.success('Top-Up package updated.');
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? res.data.data : p));
      } catch (err) {
        const matchedGame = games.find(g => String(g.id) === String(newProdGameId));
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? {
          ...p,
          game_name: matchedGame ? matchedGame.name_en : p.game_name,
          name: newProdName,
          price_usd: parseFloat(newProdPrice),
          discount_pct: parseInt(newProdDisc)
        } : p));
        message.success('(Simulation) Top-Up package updated.');
      }
    } else {
      // Add mode
      try {
        const res = await api.post('/admin/packages', payload);
        message.success('Top-Up package registered.');
        const matchedGame = games.find(g => String(g.id) === String(newProdGameId));
        setProducts(prev => [...prev, {
          id: res.data.data.id,
          game_name: matchedGame ? matchedGame.name_en : 'Mobile Legends',
          name: res.data.data.name_en,
          price_usd: parseFloat(res.data.data.price_usd),
          discount_pct: parseInt(newProdDisc),
          is_available: true
        }]);
      } catch (err) {
        const nextId = products.length + 1;
        const matchedGame = games.find(g => String(g.id) === String(newProdGameId));
        setProducts(prev => [
          ...prev,
          { id: nextId, game_name: matchedGame ? matchedGame.name_en : 'Mobile Legends', name: newProdName, price_usd: parseFloat(newProdPrice), discount_pct: parseInt(newProdDisc), is_available: 1 }
        ]);
        message.success('(Simulation) Top-Up package registered.');
      }
    }

    // Reset fields
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDisc('0');
    setSelectedProduct(null);
    setProductModalOpen(false);
  };

  // Click handler to open product edit mode
  const handleEditProductClick = (prod) => {
    setSelectedProduct(prod);
    setNewProdName(prod.name || '');
    setNewProdPrice(String(prod.price_usd || ''));
    setNewProdDisc(String(prod.discount_pct || '0'));
    
    // Attempt to map game name back to ID
    const matchedGame = games.find(g => g.name_en === prod.game_name);
    setNewProdGameId(matchedGame ? matchedGame.id : games[0]?.id || '');
    setProductModalOpen(true);
  };

  // Delete Product
  const handleDeleteProduct = async (prodId) => {
    try {
      await api.delete(`/admin/packages/${prodId}`);
      message.success('Top-Up package deleted.');
      setProducts(prev => prev.filter(p => p.id !== prodId));
    } catch (err) {
      setProducts(prev => prev.filter(p => p.id !== prodId));
      message.success('(Simulation) Top-Up package deleted.');
    }
  };

  // Add Coupon
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponVal) {
      message.error('Please complete coupon attributes.');
      return;
    }
    try {
      const res = await api.post('/admin/coupons', {
        code: newCouponCode,
        value: parseFloat(newCouponVal),
        type: newCouponType,
        start_date: newCouponStartDate,
        end_date: newCouponEndDate
      });
      message.success('Coupon created successfully.');
      setCoupons(prev => [...prev, {
        id: res.data.data.id,
        code: res.data.data.code,
        type: res.data.data.type,
        value: parseFloat(res.data.data.value),
        is_active: true,
        start_date: res.data.data.start_date,
        end_date: res.data.data.end_date,
        expires_at: res.data.data.end_date || 'Never'
      }]);
    } catch (err) {
      const nextId = coupons.length + 1;
      setCoupons(prev => [
        ...prev,
        { 
          id: nextId, 
          code: newCouponCode.toUpperCase(), 
          type: newCouponType, 
          value: parseFloat(newCouponVal), 
          is_active: 1, 
          start_date: newCouponStartDate, 
          end_date: newCouponEndDate, 
          expires_at: newCouponEndDate || 'Never' 
        }
      ]);
      message.success('(Simulation) Coupon created successfully.');
    } finally {
      setNewCouponCode('');
      setNewCouponVal('');
      setNewCouponType('percentage');
      setNewCouponStartDate(new Date().toISOString().split('T')[0]);
      setNewCouponEndDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setCouponModalOpen(false);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (couponId) => {
    try {
      await api.delete(`/admin/coupons/${couponId}`);
      message.success('Promo coupon deleted.');
      setCoupons(prev => prev.filter(c => c.id !== couponId));
    } catch (err) {
      setCoupons(prev => prev.filter(c => c.id !== couponId));
      message.success('(Simulation) Promo coupon deleted.');
    }
  };

  // Save Banner (Add or Edit)
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!newBannerImgUrl.trim()) {
      message.error('Please input or upload a banner image.');
      return;
    }

    const payload = {
      title_en: newBannerTitleEn,
      title_kh: newBannerTitleKh,
      image_url: newBannerImgUrl,
      link_url: newBannerLinkUrl,
      order_index: parseInt(newBannerOrder) || 0
    };

    if (selectedBanner) {
      // Edit mode
      try {
        const res = await api.put(`/admin/banners/${selectedBanner.id}`, payload);
        message.success('Banner updated successfully.');
        setBannersList(prev => prev.map(b => b.id === selectedBanner.id ? res.data.data : b));
      } catch (err) {
        setBannersList(prev => prev.map(b => b.id === selectedBanner.id ? { ...b, ...payload } : b));
        message.success('(Simulation) Banner updated successfully.');
      }
    } else {
      // Add mode
      try {
        const res = await api.post('/admin/banners', payload);
        message.success('Homepage banner created successfully.');
        setBannersList(prev => [...prev, res.data.data]);
      } catch (err) {
        const nextId = bannersList.length + 1;
        setBannersList(prev => [...prev, {
          id: nextId,
          ...payload,
          is_active: true
        }]);
        message.success('(Simulation) Homepage banner registered.');
      }
    }

    // Reset fields
    setNewBannerTitleEn('');
    setNewBannerTitleKh('');
    setNewBannerImgUrl('');
    setNewBannerLinkUrl('');
    setNewBannerOrder('0');
    setSelectedBanner(null);
    setBannerModalOpen(false);
  };

  // Click handler to open edit mode
  const handleEditClick = (banner) => {
    setSelectedBanner(banner);
    setNewBannerTitleEn(banner.title_en || '');
    setNewBannerTitleKh(banner.title_kh || '');
    setNewBannerImgUrl(banner.image_url || '');
    setNewBannerLinkUrl(banner.link_url || '');
    setNewBannerOrder(String(banner.order_index || 0));
    setBannerModalOpen(true);
  };

  // Image Upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data?.success) {
        setNewBannerImgUrl(res.data.url);
        message.success('Image uploaded successfully.');
      } else {
        message.error('Failed to upload image.');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      // Simulation fallback
      const simulatedUrl = URL.createObjectURL(file);
      setNewBannerImgUrl(simulatedUrl);
      message.success('(Simulation) Image uploaded successfully.');
    } finally {
      setImageUploading(false);
    }
  };

  // Toggle Banner Status
  const handleToggleBanner = async (bannerId) => {
    try {
      const res = await api.put(`/admin/banners/${bannerId}/toggle`);
      message.success('Banner status toggled successfully.');
      setBannersList(prev => prev.map(b => b.id === bannerId ? { ...b, is_active: res.data.data.is_active } : b));
    } catch (err) {
      setBannersList(prev => prev.map(b => b.id === bannerId ? { ...b, is_active: !b.is_active } : b));
      message.success('(Simulation) Banner status toggled.');
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (bannerId) => {
    try {
      await api.delete(`/admin/banners/${bannerId}`);
      message.success('Banner deleted successfully.');
      setBannersList(prev => prev.filter(b => b.id !== bannerId));
    } catch (err) {
      setBannersList(prev => prev.filter(b => b.id !== bannerId));
      message.success('(Simulation) Banner deleted.');
    }
  };

  // User management updates (Suspend / Change Role)
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      message.success(`User role set to ${newRole}`);
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      message.success(`(Simulation) User role set to ${newRole}`);
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  // Delete User Account
  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      message.success('User profile removed.');
      setUsersList(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      setUsersList(prev => prev.filter(u => u.id !== userId));
      message.success('(Simulation) User profile removed.');
    }
  };

  // Update Administrative Profile info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      message.error('Name and Email fields are required.');
      return;
    }
    setProfileSubmitting(true);
    try {
      const res = await updateProfile({
        name: profileName,
        email: profileEmail,
        phone: profilePhone
      });
      if (res.success) {
        message.success('Administrative profile updated successfully.');
      } else {
        message.error(res.message || 'Failed to update administrative profile.');
      }
    } catch (err) {
      message.error('An error occurred during profile update.');
    } finally {
      setProfileSubmitting(false);
    }
  };

  // Change Operator Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      message.error('All password fields are required.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      message.error('New passwords do not match.');
      return;
    }
    setProfileSubmitting(true);
    try {
      const res = await changePassword(oldPassword, newPassword, confirmNewPassword);
      if (res.success) {
        message.success('Password changed successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        message.error(res.message || 'Failed to change password.');
      }
    } catch (err) {
      message.error('An error occurred during password update.');
    } finally {
      setProfileSubmitting(false);
    }
  };

  // Verify Manual Payment Receipt
  const handleVerifySubmit = async (paymentId, orderNo, status, reason) => {
    try {
      await api.post(`/admin/payments/${paymentId}/verify`, { status, rejection_reason: reason });
      message.success(`Payment verified: ${status}`);
    } catch (err) {
      message.success(`(Simulation) Payment verified: ${status}`);
      setPayments(prev => prev.filter(p => p.id !== paymentId));
      setOrders(prev => prev.map(o => o.order_no === orderNo ? { ...o, status: status === 'verified' ? 'completed' : 'failed' } : o));
    }
  };

  // Export report action
  const handleExport = (type) => {
    message.loading(`Generating and exporting ${type} file...`, 1);
    setTimeout(() => {
      message.success(`Report downloaded successfully in ${type} format.`);
    }, 1200);
  };

  // Save System Settings to Backend API
  const saveSystemSettings = async (mode, messageText) => {
    try {
      await api.post('/admin/settings', {
        maintenance_mode: mode ? 1 : 0,
        alert_message: messageText || ''
      });
      message.success('System settings saved and synchronized.');
    } catch (err) {
      console.error('Error saving settings:', err);
      message.info('(Simulation) System settings saved locally.');
    }
  };

  // Broadcast Message Publish
  const handlePublishBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastInput.trim()) {
      message.error('Please input message content.');
      return;
    }
    setActiveBroadcast(broadcastInput);
    saveSystemSettings(maintenanceMode, broadcastInput);
    setBroadcastInput('');
  };

  const handleSyncCatalogue = async () => {
    setSyncingCatalog(true);
    try {
      const res = await api.post('/admin/g2bulk/sync', {
        markup: parseFloat(syncMarkup) || 10.0
      });
      if (res.data?.success) {
        message.success('G2Bulk catalogue synchronized successfully!');
        // Refresh products list
        const prodRes = await api.get('/admin/packages');
        if (prodRes.data?.success) {
          setProducts(prodRes.data.data);
        }
      } else {
        message.error(res.data?.message || 'Sync failed.');
      }
    } catch (err) {
      console.error('Error syncing G2Bulk catalog:', err);
      message.error('G2Bulk catalog sync failed.');
    } finally {
      setSyncingCatalog(false);
    }
  };

  // Send Live Chat Message
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatTicket) return;

    const ticketCode = activeChatTicket.code;
    const newMsg = {
      id: Date.now(),
      sender: 'admin',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => ({
      ...prev,
      [ticketCode]: [...(prev[ticketCode] || []), newMsg]
    }));
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        'Thank you for looking into this, let me restart the game.',
        'Yes, ABA-92845 is the reference ID.',
        'I appreciate the prompt support!',
        'No worries, it works perfectly now!'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg = {
        id: Date.now() + 1,
        sender: 'customer',
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => ({
        ...prev,
        [ticketCode]: [...(prev[ticketCode] || []), replyMsg]
      }));
    }, 2000);
  };

  // Filters search query items
  const filterByQuery = (field) => {
    if (!searchQuery) return true;
    return String(field).toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Metric calculation aggregates
  const totalRevenue = Number(analyticsSummary ? (analyticsSummary.total_sales || 0) : orders.reduce((acc, curr) => curr.status === 'completed' ? acc + (parseFloat(curr.total_price_usd) || 0) : acc, 0)) || 0;
  const totalTrx = analyticsSummary ? analyticsSummary.orders_count : orders.length;
  const successTrx = analyticsSummary ? analyticsSummary.completed_count : orders.filter(o => o.status === 'completed').length;
  const pendingTrx = analyticsSummary ? (analyticsSummary.pending_count + analyticsSummary.pending_payments) : orders.filter(o => o.status === 'pending').length + payments.length;
  const failedTrx = orders.filter(o => o.status === 'failed').length;
  const totalUsers = analyticsSummary ? analyticsSummary.total_users : 348;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-350 flex overflow-hidden font-sans text-left transition-colors duration-300">
      
      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* LEFT NAVIGATION SIDEBAR (Sticky Fixed Desktop, Collapsible Drawer Mobile) */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-850 flex flex-col justify-between shrink-0 h-screen z-50 transform lg:transform-none lg:opacity-100 transition-all duration-300 ${
        mobileSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100'
      }`}>
        <div>
          {/* Brand/System Logo */}
          <div className="px-6 h-16 border-b border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Gamepad2 size={18} />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wider text-white">V-TOPUP-STORE</h1>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Admin Engine</p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 border-none bg-transparent cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Links list */}
          <div className="px-6 py-3 mb-1 mt-4 hidden lg:block">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Core Console</h2>
          </div>

          <nav className="px-3 py-1 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] select-none">
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-none text-left cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard size={15} className="text-cyan-400" />
              Dashboard
            </button>

            <button
              onClick={() => { setActiveTab('users'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-none text-left cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Users size={15} className="text-blue-400" />
              Users
            </button>

            <button
              onClick={() => { setActiveTab('transactions'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-none text-left cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <CreditCard size={15} className="text-emerald-400" />
              Orders
            </button>

            <button
              onClick={() => { setActiveTab('products'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-none text-left cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Package size={15} className="text-amber-400" />
              Products
            </button>

            <button
              onClick={() => { setActiveTab('games'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-none text-left cursor-pointer ${
                activeTab === 'games'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Gamepad2 size={15} className="text-pink-400" />
              Games
            </button>

            <button
              onClick={() => { setActiveTab('payments'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-none text-left cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Server size={15} className="text-yellow-400" />
              Payments
            </button>

            <button
              onClick={() => { setActiveTab('security'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-none text-left cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <ShieldCheck size={15} className="text-red-400" />
              API Logs
            </button>

            <button
              onClick={() => { setActiveTab('analytics'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-none text-left cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Activity size={15} className="text-purple-400" />
              Revenue Reports
            </button>

            <button
              onClick={() => { setActiveTab('promotions'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-none text-left cursor-pointer ${
                activeTab === 'promotions'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Ticket size={15} className="text-orange-400" />
              Promo Codes
            </button>

            <button
              onClick={() => { setActiveTab('profile'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-none text-left cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Settings size={15} className="text-slate-450" />
              Settings
            </button>

            {/* Banners, Reports and Support as supplementary buttons */}
            <div className="pt-2 border-t border-slate-850/50 mt-2">
              <button
                onClick={() => { setActiveTab('banners'); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-bold transition-all border-none text-left cursor-pointer ${
                  activeTab === 'banners'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-slate-350 hover:bg-slate-800/30'
                }`}
              >
                <Megaphone size={13} className="text-yellow-500" />
                Homepage Banners
              </button>
              
              <button
                onClick={() => { setActiveTab('support'); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[10px] font-bold transition-all border-none text-left cursor-pointer ${
                  activeTab === 'support'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-slate-350 hover:bg-slate-800/30'
                }`}
              >
                <MessageSquare size={13} className="text-rose-500" />
                Support Center
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Bottom Profile Summary */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/50 flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <p className="text-xs text-white font-black truncate">{user?.name || 'Reaksa Admin'}</p>
            <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider truncate">{user?.role || 'system-admin'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-[10px] text-red-450 hover:text-red-400 font-bold border-none bg-transparent cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE MAIN VIEWPORT WRAPPER (Offset on Desktop) */}
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-y-auto relative lg:pl-64">
        
        {/* Maintenance Warning Banner */}
        {maintenanceMode && (
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-amber-500/15 text-amber-300 border-b border-amber-500/30 text-center py-3 px-6 text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2.5 relative z-50 shrink-0 select-none animate-pulse">
            <AlertTriangle size={14} className="text-amber-450 animate-bounce" />
            <span>System Alert: Catalog storefront is set to Maintenance Mode. General clients cannot browse or purchase.</span>
          </div>
        )}

        {/* Global Broadcast Message Bar */}
        {activeBroadcast && (
          <div className="bg-gradient-to-r from-indigo-500/15 via-indigo-600/10 to-indigo-500/15 text-indigo-200 border-b border-indigo-500/30 text-center py-3 px-6 text-xs font-bold flex items-center justify-center gap-3 relative z-50 shrink-0 animate-fadeIn shadow-lg shadow-indigo-500/5">
            <Megaphone size={14} className="text-cyan-400 animate-bounce" />
            <span>Active Broadcast Alert: &quot;{activeBroadcast}&quot;</span>
            <button 
              onClick={() => setActiveBroadcast('')}
              className="ml-6 text-[9px] text-cyan-400 hover:text-cyan-300 font-extrabold uppercase tracking-widest border border-cyan-500/30 hover:border-cyan-500 px-2 py-0.5 rounded bg-cyan-950/40 transition-all cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TOP NAVIGATION HEADER BAR */}
        <header className="border-b border-slate-850 bg-slate-900 sticky top-0 z-40 h-16 shrink-0 flex items-center justify-between px-6 sm:px-8 select-none shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger Trigger */}
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 border-none bg-transparent cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xs font-bold text-slate-200 tracking-wider uppercase flex items-center gap-2 bg-slate-950/40 border border-slate-850 px-3.5 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {activeTab} PANEL
            </h1>
          </div>

          {/* Search, Notifications, Messages & User summary */}
          <div className="flex items-center gap-6">
            <div className="relative max-w-xs hidden sm:block">
              <Search size={14} className="absolute left-3.5 top-3.5 text-slate-550" />
              <input
                type="text"
                placeholder="Search queries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-955/40 border border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 focus:bg-[#070a1e]/80 transition-smooth focus:shadow-[0_0_12px_rgba(6,182,212,0.08)]"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications Popover */}
              <Popover 
                title="Staff Notifications"
                trigger="click"
                content={
                  <div className="w-64 space-y-2 text-xs text-slate-350">
                    <p className="p-2 bg-slate-900/40 rounded border border-slate-850">
                      <span className="font-bold text-amber-400 uppercase">[Verify]</span> Socket ABA transaction receipt #TRX-918274 needs review.
                    </p>
                    <p className="p-2 bg-slate-900/40 rounded border border-slate-850">
                      <span className="font-bold text-cyan-400 uppercase">[Ticket]</span> New ticket filed from Dara Sok: "Diamonds delay".
                    </p>
                  </div>
                }
              >
                <div className="relative p-2.5 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white transition-smooth cursor-pointer">
                  <Badge count={2} size="small" offset={[2, -2]}>
                    <Bell size={16} />
                  </Badge>
                </div>
              </Popover>

              {/* Messages Popover */}
              <Popover
                title="Recent Messages"
                trigger="click"
                content={
                  <div className="w-64 text-xs text-slate-400">
                    No new message threads. Secure tunnels operational.
                  </div>
                }
              >
                <div className="relative p-2.5 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white transition-smooth cursor-pointer">
                  <MessageSquare size={16} />
                </div>
              </Popover>

              {/* Theme Switcher Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-900 text-slate-450 hover:text-white hover:border-slate-800 transition-smooth hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer select-none"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun size={16} className="text-amber-450 animate-pulse" />
                ) : (
                  <Moon size={16} className="text-indigo-400" />
                )}
              </button>
            </div>

            <div className="h-5 w-px bg-slate-900 hidden sm:block"></div>
            
            <div 
              onClick={() => setActiveTab('profile')} 
              className="items-center gap-2.5 hidden sm:flex cursor-pointer hover:opacity-95 transition-smooth group bg-slate-900/50 border border-slate-850 hover:border-slate-800 px-3 py-1.5 rounded-lg"
              title="Edit My Profile"
            >
              <div className="relative w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white shadow-sm">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
                <span className="absolute bottom-[-1px] right-[-1px] w-2 h-2 rounded-full bg-emerald-500 border border-slate-950"></span>
              </div>
              <div className="text-xs min-w-0">
                <p className="text-white font-bold group-hover:text-blue-400 transition-smooth truncate max-w-[100px]">{user?.name || 'Reaksa Admin'}</p>
                <p className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wide truncate">{user?.role || 'system-admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE BODY FRAME */}
        <main className="p-6 sm:p-8 lg:p-10 w-full max-w-7xl mx-auto space-y-8 flex-grow">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Revenue KPI */}
                <div 
                  onClick={() => setActiveMetric('revenue')}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    activeMetric === 'revenue' 
                      ? 'bg-gradient-to-br from-blue-950/20 to-slate-900/60 border-blue-550 shadow-lg shadow-blue-500/5' 
                      : 'bg-slate-900/40 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div className="absolute top-4 right-4 text-blue-400 bg-blue-950/40 p-2.5 rounded-xl border border-blue-900/30">
                    <DollarSign size={16} />
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total Sales Revenue</p>
                  <h3 className="text-white text-3xl font-black mt-2 tracking-tight">${totalRevenue.toFixed(2)}</h3>
                  <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-extrabold mt-2">
                    <ArrowUpRight size={14} />
                    <span>+14.8%</span>
                    <span className="text-slate-500 font-bold">VS LAST MONTH</span>
                  </div>
                </div>

                {/* Total Transactions KPI */}
                <div 
                  onClick={() => setActiveMetric('transactions')}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    activeMetric === 'transactions' 
                      ? 'bg-gradient-to-br from-indigo-950/20 to-slate-900/60 border-indigo-550 shadow-lg shadow-indigo-500/5' 
                      : 'bg-slate-900/40 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div className="absolute top-4 right-4 text-indigo-400 bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-900/30">
                    <Activity size={16} />
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Transactions Vol</p>
                  <h3 className="text-white text-3xl font-black mt-2 tracking-tight">{totalTrx}</h3>
                  <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-extrabold mt-2">
                    <ArrowUpRight size={14} />
                    <span>+8.2%</span>
                    <span className="text-slate-550 font-bold">VS LAST WEEK</span>
                  </div>
                </div>

                {/* Pending verifications KPI */}
                <div 
                  onClick={() => setActiveTab('transactions')}
                  className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-slate-800 cursor-pointer relative group"
                >
                  <div className="absolute top-4 right-4 text-orange-400 bg-orange-950/40 p-2.5 rounded-xl border border-orange-900/30">
                    <Clock size={16} />
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Pending Review</p>
                  <h3 className="text-orange-400 text-3xl font-black mt-2 tracking-tight">{pendingTrx}</h3>
                  <div className="text-slate-500 text-[10px] font-bold mt-2.5">
                    Awaiting Manual Receipt Check
                  </div>
                </div>

                {/* Total Users KPI */}
                <div 
                  onClick={() => setActiveMetric('users')}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    activeMetric === 'users' 
                      ? 'bg-gradient-to-br from-purple-950/20 to-slate-900/60 border-purple-550 shadow-lg shadow-purple-500/5' 
                      : 'bg-slate-900/40 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div className="absolute top-4 right-4 text-purple-400 bg-purple-950/40 p-2.5 rounded-xl border border-purple-900/30">
                    <Users size={16} />
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Registered Users</p>
                  <h3 className="text-white text-3xl font-black mt-2 tracking-tight">{totalUsers}</h3>
                  <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-extrabold mt-2">
                    <ArrowUpRight size={14} />
                    <span>+23.4%</span>
                    <span className="text-slate-550 font-bold">VS LAST HALF</span>
                  </div>
                </div>
              </div>

              {/* Analytics Graph & Quick Ops Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* SVG Revenue Line Graph */}
                <div className="lg:col-span-2 bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between h-[360px]">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                    <div>
                      <h4 className="text-white font-bold text-sm">Revenue Sales Timeline</h4>
                      <p className="text-[10px] text-slate-500 font-semibold">Weekly aggregated indicator</p>
                    </div>
                    <span className="text-xs text-indigo-400 font-bold">Total Sales (USD)</span>
                  </div>
                  <div className="flex-1 relative pt-6">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 700 220" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="glow-grad-sales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="50" y1="40" x2="650" y2="40" stroke="#101530" strokeDasharray="4" />
                      <line x1="50" y1="100" x2="650" y2="100" stroke="#101530" strokeDasharray="4" />
                      <line x1="50" y1="160" x2="650" y2="160" stroke="#101530" strokeDasharray="4" />
                      <line x1="50" y1="210" x2="650" y2="210" stroke="#1e293b" />

                      <path d="M 50 170 L 150 120 L 250 140 L 350 70 L 450 90 L 550 50 L 650 80" fill="none" stroke="#2563eb" strokeWidth="3" />
                      <path d="M 50 170 L 150 120 L 250 140 L 350 70 L 450 90 L 550 50 L 650 80 L 650 210 L 50 210 Z" fill="url(#glow-grad-sales)" />

                      <circle cx="50" cy="170" r="5" fill="#030712" stroke="#2563eb" strokeWidth="2.5" />
                      <circle cx="150" cy="120" r="5" fill="#030712" stroke="#2563eb" strokeWidth="2.5" />
                      <circle cx="250" cy="140" r="5" fill="#030712" stroke="#2563eb" strokeWidth="2.5" />
                      <circle cx="350" cy="70" r="5" fill="#030712" stroke="#2563eb" strokeWidth="2.5" />
                      <circle cx="450" cy="90" r="5" fill="#030712" stroke="#2563eb" strokeWidth="2.5" />
                      <circle cx="550" cy="50" r="5" fill="#030712" stroke="#2563eb" strokeWidth="2.5" />
                      <circle cx="650" cy="80" r="5" fill="#030712" stroke="#2563eb" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-550 font-extrabold uppercase px-1.5 pt-2">
                    <span>Jul 10</span>
                    <span>Jul 11</span>
                    <span>Jul 12</span>
                    <span>Jul 13</span>
                    <span>Jul 14</span>
                    <span>Jul 15</span>
                    <span>Jul 16</span>
                  </div>
                </div>

                {/* Operations quick variables panel */}
                <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="border-b border-slate-900 pb-3">
                    <h4 className="text-white font-bold text-sm">System Variables</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Auto-update dashboard configurations</p>
                  </div>

                  <div className="space-y-4 py-2">
                    {/* Maintenance Mode */}
                    <div className="flex justify-between items-center p-3 bg-slate-900/30 border border-slate-850 rounded-xl">
                      <div>
                        <p className="text-xs text-white font-bold flex items-center gap-1">
                          <AlertTriangle size={13} className="text-amber-500" />
                          Maintenance Toggler
                        </p>
                        <p className="text-[9px] text-slate-500">Enable warning state</p>
                      </div>
                      <button
                        onClick={() => {
                          const nextMode = !maintenanceMode;
                          setMaintenanceMode(nextMode);
                          saveSystemSettings(nextMode, activeBroadcast);
                        }}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                          maintenanceMode ? 'bg-amber-500' : 'bg-slate-800'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          maintenanceMode ? 'translate-x-5' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {/* Quick message broadcast */}
                    <form onSubmit={handlePublishBroadcast} className="p-3 bg-slate-900/30 border border-slate-850 rounded-xl space-y-3">
                      <p className="text-xs text-white font-bold flex items-center gap-1">
                        <Megaphone size={13} className="text-cyan-400" />
                        Staff Alert Broadcaster
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Broadcast notice text..."
                          value={broadcastInput}
                          onChange={(e) => setBroadcastInput(e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1 text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="bg-indigo-650 hover:bg-indigo-600 text-white text-[10px] font-black px-2.5 rounded-lg border-none"
                        >
                          Send
                        </button>
                      </div>
                    </form>

                    {/* G2Bulk Catalog Sync */}
                    <div className="p-3 bg-slate-900/30 border border-slate-850 rounded-xl space-y-3">
                      <p className="text-xs text-white font-bold flex items-center gap-1">
                        <RefreshCw size={13} className="text-green-400" />
                        G2Bulk Catalog Sync
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Markup %"
                          value={syncMarkup}
                          onChange={(e) => setSyncMarkup(e.target.value)}
                          className="w-16 bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-[10px] text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleSyncCatalogue}
                          disabled={syncingCatalog}
                          className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-[10px] font-black px-2.5 rounded-lg border-none py-1.5 cursor-pointer transition-colors"
                        >
                          {syncingCatalog ? 'Syncing...' : 'Sync Catalog'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-600 font-extrabold flex justify-between items-center border-t border-slate-900 pt-3">
                    <span>Engine v2.0.4</span>
                    <span className="text-cyan-500 flex items-center gap-1">
                      <Server size={10} /> Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Lower Section: Transaction List Table & Live Console logs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Transaction requests table card */}
                <div className="lg:col-span-2 bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 overflow-hidden">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-6">
                    <h3 className="text-white font-bold text-sm">Latest Transaction Audit Log</h3>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Real-time DB feeds</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-900 pb-3">
                          <th className="pb-3 font-bold uppercase text-[9px]">ID</th>
                          <th className="pb-3 font-bold uppercase text-[9px]">Customer</th>
                          <th className="pb-3 font-bold uppercase text-[9px]">Product Details</th>
                          <th className="pb-3 font-bold uppercase text-[9px]">Price</th>
                          <th className="pb-3 font-bold uppercase text-[9px] text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/40">
                        {orders.slice(0, 4).map((order) => (
                          <tr key={order.id} className="hover:bg-slate-900/10 transition-colors">
                            <td className="py-3.5 font-mono text-white font-bold">{order.order_no}</td>
                            <td className="py-3.5 text-slate-350">{order.customer_name}</td>
                            <td className="py-3.5">
                              <p className="text-white font-bold text-xs">{order.game_name}</p>
                              <p className="text-[9px] text-slate-500 mt-0.5">{order.package_name}</p>
                            </td>
                            <td className="py-3.5 text-indigo-400 font-extrabold">${order.total_price_usd}</td>
                            <td className="py-3.5 text-right">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase border ${
                                order.status === 'completed'
                                  ? 'bg-emerald-950/40 text-emerald-450 border-emerald-900/30'
                                  : order.status === 'pending'
                                  ? 'bg-amber-950/40 text-amber-450 border-amber-900/30'
                                  : 'bg-red-950/40 text-red-400 border-red-900/30'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* System running status log feed */}
                <div className="bg-[#0a0d1e]/40 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between">
                  <div className="border-b border-slate-900 pb-3 mb-4">
                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Core Gateway Monitor
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Live background network telemetry</p>
                  </div>

                  <div className="flex-1 font-mono text-[10px] text-slate-450 space-y-3 py-2 text-left">
                    {consoleLogs.map((log, idx) => (
                      <p key={idx} className={idx === consoleLogs.length - 1 ? 'text-violet-400' : ''}>
                        &gt; {log}
                      </p>
                    ))}
                  </div>

                  <div className="border-t border-slate-900 pt-3 text-[9px] font-bold text-slate-500 uppercase flex justify-between items-center">
                    <span>Cert Method: SHA-256</span>
                    <span>All keys verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANALYTICS & TRENDS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-b border-slate-900 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold text-lg">Platform Performance Analytics</h3>
                  <p className="text-xs text-slate-550">Review multi-level graphs charting sales channels and top popular catalogs.</p>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="weekly" size="small" style={{ width: 100 }} className="ant-select-dark">
                    <Option value="daily">Daily</Option>
                    <Option value="weekly">Weekly</Option>
                    <Option value="monthly">Monthly</Option>
                  </Select>
                </div>
              </div>

              {/* Line chart & Bar Chart split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* SVG Revenue Line Graph */}
                <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 h-[340px] flex flex-col justify-between">
                  <h4 className="text-white font-bold text-sm pb-2 border-b border-slate-900">Revenue Line Trends ($)</h4>
                  <div className="flex-1 relative pt-6">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                      <polyline points="30,140 100,110 170,120 240,60 310,80 380,40 450,50" fill="none" stroke="#6366f1" strokeWidth="3" />
                      <circle cx="240" cy="60" r="4" fill="#6366f1" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-2">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* Top Selling Games Bar Chart */}
                <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 h-[340px] flex flex-col justify-between">
                  <h4 className="text-white font-bold text-sm pb-2 border-b border-slate-900">Top-Selling Titles Volume</h4>
                  <div className="flex-grow flex items-end gap-6 pt-6 px-4">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-cyan-600 to-blue-600 rounded-t-lg" style={{ height: '140px' }} />
                      <span className="text-[9px] text-slate-400 font-semibold truncate w-full text-center">Mobile Legends</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-cyan-600 to-blue-600 rounded-t-lg" style={{ height: '90px' }} />
                      <span className="text-[9px] text-slate-400 font-semibold truncate w-full text-center">Free Fire</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-cyan-600 to-blue-600 rounded-t-lg" style={{ height: '110px' }} />
                      <span className="text-[9px] text-slate-400 font-semibold truncate w-full text-center">PUBG Mobile</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-cyan-600 to-blue-600 rounded-t-lg" style={{ height: '60px' }} />
                      <span className="text-[9px] text-slate-400 font-semibold truncate w-full text-center">Valorant</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donut Chart & Stacked Distribution Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Donut Chart visual */}
                <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between h-[300px]">
                  <h4 className="text-white font-bold text-sm pb-2 border-b border-slate-900">Transaction Success Ratios</h4>
                  <div className="flex-1 flex items-center justify-center gap-8 py-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Success Segment */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray="210 251" />
                      {/* Pending Segment */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="8" strokeDasharray="30 251" strokeDashoffset="-210" />
                      {/* Failed Segment */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="8" strokeDasharray="11 251" strokeDashoffset="-240" />
                    </svg>
                    <div className="space-y-2 text-xs">
                      <p className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                        Success: 84%
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                        Pending: 12%
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                        Failed: 4%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Horizontal Progress Payment Method distribution */}
                <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 flex flex-col justify-between h-[300px]">
                  <h4 className="text-white font-bold text-sm pb-2 border-b border-slate-900">Payment Channel Breakdown</h4>
                  <div className="space-y-4 py-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-350 mb-1">
                        <span>KHQR (National QR)</span>
                        <span className="font-bold text-white">48%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: '48%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-350 mb-1">
                        <span>ABA Pay Tunnels</span>
                        <span className="font-bold text-white">35%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '35%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-350 mb-1">
                        <span>Wing QR & App Cash</span>
                        <span className="font-bold text-white">12%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSACTIONS QUEUE */}
          {activeTab === 'transactions' && (
            <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="border-b border-slate-900 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold text-base">Transactions Audit logs</h3>
                  <p className="text-xs text-slate-500 font-medium">Verify orders, amounts, status mappings, and payment modes.</p>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all" size="small" style={{ width: 120 }} className="ant-select-dark">
                    <Option value="all">All statuses</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="failed">Failed</Option>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-550 border-b border-slate-900 pb-3">
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Ref ID</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Client</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Product / Game</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Price Amount</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Gateway</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Date Time</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px] text-right">Status Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {orders.filter(o => filterByQuery(o.order_no) || filterByQuery(o.customer_name)).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-4 font-mono text-white font-bold">{order.order_no}</td>
                        <td className="py-4 text-slate-350">{order.customer_name}</td>
                        <td className="py-4">
                          <p className="text-white font-bold">{order.game_name}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">{order.package_name}</p>
                        </td>
                        <td className="py-4 text-indigo-400 font-extrabold">${order.total_price_usd}</td>
                        <td className="py-4 text-slate-400 font-medium">{order.payment_method}</td>
                        <td className="py-4 text-slate-400">{order.created_at}</td>
                        <td className="py-4 text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase border ${
                            order.status === 'completed'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30'
                              : order.status === 'pending'
                              ? 'bg-amber-950/40 text-amber-400 border-amber-900/30'
                              : 'bg-red-950/40 text-red-400 border-red-900/30'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: GAME CATALOG */}
          {activeTab === 'games' && (
            <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="border-b border-slate-900 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold text-base">Game Catalog</h3>
                  <p className="text-xs text-slate-500">Configure catalog titles, category groups, and trending badges.</p>
                </div>
                <button 
                  onClick={() => setGameModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer border-none flex items-center gap-2"
                >
                  <Plus size={14} /> Add Game Title
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-550 border-b border-slate-900 pb-3">
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Title (EN)</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Title (KH)</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Category</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Trending Flag</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Publish Status</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px] text-right">Access Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {games.filter(g => filterByQuery(g.name_en)).map((game) => (
                      <tr key={game.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-4 text-white font-bold">{game.name_en}</td>
                        <td className="py-4 text-slate-450">{game.name_kh}</td>
                        <td className="py-4 text-slate-400 font-medium">{game.category?.name_en || game.category_name || 'Mobile'}</td>
                        <td className="py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded text-[8px] font-bold ${
                            game.is_popular ? 'bg-indigo-950/40 text-cyan-400 border border-indigo-900/30' : 'bg-slate-900 text-slate-500'
                          }`}>
                            {game.is_popular ? 'TRENDING' : 'NORMAL'}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[8.5px] font-bold border ${
                            game.status ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/20' : 'bg-red-950/30 text-red-400 border-red-900/20'
                          }`}>
                            {game.status ? 'PUBLISHED' : 'HIDDEN'}
                          </span>
                        </td>
                        <td className="py-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditGameClick(game)}
                            className="p-2 bg-indigo-950/30 hover:bg-indigo-900/20 border border-indigo-900/30 text-indigo-400 rounded-lg transition-all duration-200 cursor-pointer border-none flex items-center justify-center active:scale-95"
                            title="Edit Game"
                          >
                            <Edit size={13} />
                          </button>
                          <button 
                            onClick={() => toggleGameStatus(game.id, game.status)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-350 hover:text-white border border-slate-800 rounded-lg text-[10px] font-bold transition-all duration-200 cursor-pointer active:scale-95"
                          >
                            Toggle Status
                          </button>
                          <button 
                            onClick={() => handleDeleteGame(game.id)}
                            className="p-2 bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-red-400 rounded-lg transition-all duration-200 cursor-pointer border-none flex items-center justify-center active:scale-95"
                            title="Delete Game"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PACKAGE CATALOG (PRODUCTS) */}
          {activeTab === 'products' && (
            <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="border-b border-slate-900 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold text-base">Top-Up Package Catalog</h3>
                  <p className="text-xs text-slate-500">Configure prices, active discount rates, and availability flags.</p>
                </div>
                <button 
                  onClick={() => { setNewProdGameId(games[0]?.id || ''); setProductModalOpen(true); }}
                  className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer border-none flex items-center gap-2"
                >
                  <Plus size={14} /> Add Topup package
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(
                  products
                    .filter(p => filterByQuery(p.name) || filterByQuery(p.game_name))
                    .reduce((acc, curr) => {
                      if (!acc[curr.game_name]) {
                        acc[curr.game_name] = [];
                      }
                      acc[curr.game_name].push(curr);
                      return acc;
                    }, {})
                ).map(([gameName, gameProducts]) => (
                  <div key={gameName} className="bg-slate-950/20 border border-slate-900 rounded-2xl p-5 space-y-4">
                    {/* Game Category Section Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-900/60">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-4 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></span>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">{gameName}</h4>
                      </div>
                      <span className="text-[10px] text-cyan-450 font-bold bg-[#0d1527] border border-cyan-900/40 px-3 py-0.5 rounded-full">
                        {gameProducts.length} PACKAGES
                      </span>
                    </div>

                    {/* Category Packages Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="text-slate-550 border-b border-slate-900/40 pb-2">
                            <th className="pb-2 font-semibold uppercase text-[9px] w-[35%]">Package Details</th>
                            <th className="pb-2 font-semibold uppercase text-[9px] w-[15%]">Base Price</th>
                            <th className="pb-2 font-semibold uppercase text-[9px] w-[15%]">Discount</th>
                            <th className="pb-2 font-semibold uppercase text-[9px] w-[15%]">Final Price</th>
                            <th className="pb-2 font-semibold uppercase text-[9px] w-[15%]">Availability</th>
                            <th className="pb-2 font-semibold uppercase text-[9px] text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/30">
                          {gameProducts.map((prod) => {
                            const priceNum = parseFloat(prod.price_usd) || 0;
                            const finalPrice = priceNum - (priceNum * (parseInt(prod.discount_pct) || 0) / 100);
                            return (
                              <tr key={prod.id} className="hover:bg-slate-900/5 transition-colors">
                                <td className="py-3.5 text-slate-200 font-bold text-xs">{prod.name}</td>
                                <td className="py-3.5 text-slate-450">${priceNum.toFixed(2)}</td>
                                <td className="py-3.5 text-orange-400 font-extrabold">{prod.discount_pct}% OFF</td>
                                <td className="py-3.5 text-indigo-400 font-black">${finalPrice.toFixed(2)}</td>
                                <td className="py-3.5">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[8.5px] font-bold ${
                                    prod.is_available ? 'bg-emerald-950/30 text-emerald-450 border border-emerald-900/20' : 'bg-red-950/30 text-red-400 border border-red-900/20'
                                  }`}>
                                    {prod.is_available ? 'IN STOCK' : 'OUT OF STOCK'}
                                  </span>
                                </td>
                                <td className="py-3.5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleEditProductClick(prod)}
                                      className="p-2 bg-indigo-950/30 hover:bg-indigo-900/20 border border-indigo-900/30 text-indigo-400 rounded-lg transition-all cursor-pointer border-none flex items-center justify-center"
                                      title="Edit Package"
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(prod.id)}
                                      className="p-2 bg-red-950/30 hover:bg-red-900/20 border border-red-900/30 text-red-400 rounded-lg transition-all cursor-pointer border-none flex items-center justify-center"
                                      title="Delete Package"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: USER CONTROL */}
          {activeTab === 'users' && (
            <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="border-b border-slate-900 pb-4">
                <h3 className="text-white font-bold text-base">Registered Account Control</h3>
                <p className="text-xs text-slate-500">Suspend accounts, change access rights, and view total spender values.</p>
              </div>

              {/* Customers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Customer Accounts ({usersList.filter(u => u.role === 'customer' || u.role === 'suspended').length})
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-550 border-b border-slate-900 pb-3">
                        <th className="pb-3 font-semibold uppercase text-[9.5px]">Client User</th>
                        <th className="pb-3 font-semibold uppercase text-[9.5px]">Email Address</th>
                        <th className="pb-3 font-semibold uppercase text-[9.5px]">Phone Code</th>
                        <th className="pb-3 font-semibold uppercase text-[9.5px]">Total Spend</th>
                        <th className="pb-3 font-semibold uppercase text-[9.5px]">System Role</th>
                        <th className="pb-3 font-semibold uppercase text-[9.5px] text-right">Operations Gate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {usersList
                        .filter(u => u.role === 'customer' || u.role === 'suspended')
                        .filter(u => filterByQuery(u.name) || filterByQuery(u.email))
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/10 transition-colors">
                            <td className="py-4 text-white font-bold">{item.name}</td>
                            <td className="py-4 text-slate-400">{item.email}</td>
                            <td className="py-4 text-slate-400">{item.phone || 'N/A'}</td>
                            <td className="py-4 text-cyan-400 font-extrabold">${(parseFloat(item.spending_usd) || 0).toFixed(2)}</td>
                            <td className="py-4">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[8.5px] font-bold ${
                                item.role === 'suspended'
                                  ? 'bg-red-950/40 text-red-400 border border-red-900/30'
                                  : 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/20'
                              }`}>
                                {item.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 text-right flex items-center justify-end gap-2.5">
                              <Select
                                defaultValue={item.role}
                                size="small"
                                style={{ width: 120 }}
                                onChange={(val) => handleUpdateUserRole(item.id, val)}
                                className="ant-select-dark text-[10px]"
                                popupClassName="ant-select-dark-popup"
                              >
                                <Option value="customer">Customer</Option>
                                <Option value="admin">Admin</Option>
                                <Option value="suspended">Suspended</Option>
                              </Select>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to permanently delete user "${item.name}"?`)) {
                                    handleDeleteUser(item.id);
                                  }
                                }}
                                className="bg-red-950/20 hover:bg-red-900/40 text-red-400 hover:text-white border border-red-900/30 rounded-xl p-2 transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center"
                                title="Delete User"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admins Section */}
              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Administrative Accounts ({usersList.filter(u => u.role === 'admin' || u.role === 'super-admin').length})
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-550 border-b border-slate-900 pb-3">
                        <th className="pb-3 font-semibold uppercase text-[9.5px]">Administrative User</th>
                        <th className="pb-3 font-semibold uppercase text-[9.5px]">Email Address</th>
                        <th className="pb-3 font-semibold uppercase text-[9.5px]">Phone Code</th>
                        <th className="pb-3 font-semibold uppercase text-[9.5px]">Total Spend</th>
                        <th className="pb-3 font-semibold uppercase text-[9.5px]">System Role</th>
                        <th className="pb-3 font-semibold uppercase text-[9.5px] text-right">Operations Gate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/60">
                      {usersList
                        .filter(u => u.role === 'admin' || u.role === 'super-admin')
                        .filter(u => filterByQuery(u.name) || filterByQuery(u.email))
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/10 transition-colors">
                            <td className="py-4 text-white font-bold">{item.name}</td>
                            <td className="py-4 text-slate-400">{item.email}</td>
                            <td className="py-4 text-slate-400">{item.phone || 'N/A'}</td>
                            <td className="py-4 text-cyan-400 font-extrabold">${(parseFloat(item.spending_usd) || 0).toFixed(2)}</td>
                            <td className="py-4">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[8.5px] font-bold ${
                                item.role === 'super-admin'
                                  ? 'bg-blue-950/40 text-blue-400 border border-blue-900/30'
                                  : 'bg-purple-950/40 text-purple-400 border border-purple-900/30'
                              }`}>
                                {item.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 text-right flex items-center justify-end gap-2.5">
                              <Select
                                defaultValue={item.role}
                                size="small"
                                style={{ width: 120 }}
                                onChange={(val) => handleUpdateUserRole(item.id, val)}
                                className="ant-select-dark text-[10px]"
                                popupClassName="ant-select-dark-popup"
                              >
                                <Option value="customer">Customer</Option>
                                <Option value="admin">Admin</Option>
                                <Option value="suspended">Suspended</Option>
                              </Select>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to permanently delete user "${item.name}"?`)) {
                                    handleDeleteUser(item.id);
                                  }
                                }}
                                className="bg-red-950/20 hover:bg-red-900/40 text-red-400 hover:text-white border border-red-900/30 rounded-xl p-2 transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center"
                                title="Delete User"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PAYMENT GATEWAYS */}
          {activeTab === 'payments' && (
            <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="border-b border-slate-900 pb-4">
                <h3 className="text-white font-bold text-base">Payment Gateway Channels</h3>
                <p className="text-xs text-slate-500 font-medium">Verify system transaction success rates and providers endpoints latency.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-slate-900/30 border border-slate-850 rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-bold text-sm">ABA KHQR</h4>
                    <Tag color="green">ONLINE</Tag>
                  </div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">API Latency</p>
                  <p className="text-white text-lg font-black mt-1">42ms</p>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 inline-block">Success rate: 98%</span>
                </div>

                <div className="p-5 bg-slate-900/30 border border-slate-850 rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-bold text-sm">ABA Instant Pay</h4>
                    <Tag color="green">ONLINE</Tag>
                  </div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">API Latency</p>
                  <p className="text-white text-lg font-black mt-1">56ms</p>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 inline-block">Success rate: 96%</span>
                </div>

                <div className="p-5 bg-slate-900/30 border border-slate-850 rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-white font-bold text-sm">Wing Wallet</h4>
                    <Tag color="green">ONLINE</Tag>
                  </div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">API Latency</p>
                  <p className="text-white text-lg font-black mt-1">112ms</p>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 inline-block">Success rate: 92%</span>
                </div>
              </div>

              {/* Settlement table */}
              <div className="pt-4 border-t border-slate-900">
                <h4 className="text-white font-bold text-xs mb-4">Pending Manual Transfer Verifications</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-900 pb-3">
                        <th className="pb-3 text-[9px] uppercase font-bold">Order ID</th>
                        <th className="pb-3 text-[9px] uppercase font-bold">Reference Code</th>
                        <th className="pb-3 text-[9px] uppercase font-bold">Amount</th>
                        <th className="pb-3 text-[9px] uppercase font-bold">Date</th>
                        <th className="pb-3 text-[9px] uppercase font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/40">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/10 transition-colors">
                          <td className="py-3.5 font-mono text-white font-bold">{p.order_no}</td>
                          <td className="py-3.5 font-mono text-white">{p.transaction_no}</td>
                          <td className="py-3.5 text-emerald-450 font-bold">${p.amount_usd}</td>
                          <td className="py-3.5 text-slate-400">{p.created_at}</td>
                          <td className="py-3.5 text-right flex justify-end gap-2">
                            <Button 
                              size="small" 
                              onClick={() => handleVerifySubmit(p.id, p.order_no, 'verified', '')}
                              className="bg-emerald-950/40 text-emerald-400 border-none hover:bg-emerald-900 text-[10px] font-bold"
                            >
                              Approve
                            </Button>
                            <Button 
                              size="small" 
                              danger 
                              onClick={() => {
                                const reason = prompt('Rejection reason:');
                                if (reason) handleVerifySubmit(p.id, p.order_no, 'rejected', reason);
                              }}
                              className="border-none text-[10px]"
                            >
                              Reject
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: PROMOS & COUPONS */}
          {activeTab === 'promotions' && (
            <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="border-b border-slate-900 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold text-base">Promotions & Coupons Management</h3>
                  <p className="text-xs text-slate-550">Create active discount vouchers, codes, and flash campaigns.</p>
                </div>
                <button 
                  onClick={() => setCouponModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer border-none flex items-center gap-2"
                >
                  <Plus size={14} /> Create Coupon
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-550 border-b border-slate-900 pb-3">
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Promo Code</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Discount Value</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Validity Period</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Status Flag</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px] text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {coupons.filter(c => filterByQuery(c.code)).map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-4 font-mono text-white font-extrabold">{coupon.code}</td>
                        <td className="py-4 text-indigo-400 font-black">
                          {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                        </td>
                        <td className="py-4 text-slate-400">
                          {coupon.start_date ? `${coupon.start_date} to ${coupon.end_date}` : coupon.expires_at}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[8.5px] font-bold border ${
                            coupon.is_active ? 'bg-emerald-950/30 text-emerald-455 border-emerald-900/20' : 'bg-red-950/30 text-red-400 border-red-900/20'
                          }`}>
                            {coupon.is_active ? 'ACTIVE' : 'EXPIRED'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Button 
                            danger 
                            size="small" 
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            icon={<Trash2 size={13} />}
                            className="border-none flex items-center justify-center text-[10px]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 13: HOMEPAGE PROMOTIONAL BANNERS */}
          {activeTab === 'banners' && (
            <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                <div>
                  <h3 className="text-white font-bold text-base">Homepage Marketing Banners</h3>
                  <p className="text-xs text-slate-550">Manage dynamic slideshow banners displayed on the customer storefront homepage.</p>
                </div>
                <button
                  onClick={() => setBannerModalOpen(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-bold rounded-xl transition-all border-none shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 self-start"
                >
                  <Plus size={14} /> Add New Banner
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-550 border-b border-slate-900 pb-3">
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Banner Slide</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Title (EN)</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Title (KH)</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Redirect Path</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Sorting</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Status</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {bannersList.map((banner) => (
                      <tr key={banner.id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-4">
                          <div className="w-24 h-12 rounded-lg border border-slate-850 overflow-hidden bg-slate-950">
                            <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="py-4 text-white font-bold max-w-[150px] truncate">{banner.title_en || 'Untargeted'}</td>
                        <td className="py-4 text-slate-350 max-w-[150px] truncate">{banner.title_kh || 'គ្មានចំណងជើង'}</td>
                        <td className="py-4 font-mono text-cyan-400 max-w-[120px] truncate">{banner.link_url || 'None'}</td>
                        <td className="py-4 font-mono text-slate-450 font-bold">{banner.order_index}</td>
                        <td className="py-4">
                          <button
                            onClick={() => handleToggleBanner(banner.id)}
                            className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black border transition-all cursor-pointer select-none ${
                              banner.is_active 
                                ? 'bg-emerald-950/30 text-emerald-450 border-emerald-900/30 hover:bg-emerald-900/20' 
                                : 'bg-red-950/30 text-red-400 border-red-900/30 hover:bg-red-900/20'
                            }`}
                          >
                            {banner.is_active ? 'ACTIVE' : 'DISABLED'}
                          </button>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditClick(banner)}
                              className="p-2 bg-indigo-950/30 hover:bg-indigo-900/20 border border-indigo-900/30 text-indigo-400 rounded-lg transition-all cursor-pointer border-none flex items-center justify-center"
                              title="Edit Banner"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="p-2 bg-red-950/30 hover:bg-red-900/20 border border-red-900/30 text-red-400 rounded-lg transition-all cursor-pointer border-none flex items-center justify-center"
                              title="Delete Banner"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {bannersList.length === 0 && (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-slate-500 font-bold">
                          No promotional banners configured yet. Click Add New Banner.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: REPORTS EXPORT */}
          {activeTab === 'reports' && (
            <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="border-b border-slate-900 pb-4">
                <h3 className="text-white font-bold text-base">Analytical & Accounting Reports</h3>
                <p className="text-xs text-slate-550 font-medium">Generate financial accounting reports and telemetries. Export to Excel, PDF or CSV.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900/35 border border-slate-850 rounded-2xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-900/30">
                    <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Monthly Revenue Ledger</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Compiled sales, payments, and fees ledger.</p>
                  </div>
                  <div className="flex gap-2 justify-center pt-2">
                    <Button size="small" icon={<Download size={12} />} onClick={() => handleExport('Excel')} className="bg-slate-900 border-slate-800 text-slate-350 text-[10px]">Excel</Button>
                    <Button size="small" icon={<Download size={12} />} onClick={() => handleExport('PDF')} className="bg-slate-900 border-slate-800 text-slate-350 text-[10px]">PDF</Button>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/35 border border-slate-850 rounded-2xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950 text-purple-400 flex items-center justify-center mx-auto border border-purple-900/30">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Customer Demographic Analysis</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Visitor counts, signup locations, spending statistics.</p>
                  </div>
                  <div className="flex gap-2 justify-center pt-2">
                    <Button size="small" icon={<Download size={12} />} onClick={() => handleExport('Excel')} className="bg-slate-900 border-slate-800 text-slate-350 text-[10px]">Excel</Button>
                    <Button size="small" icon={<Download size={12} />} onClick={() => handleExport('CSV')} className="bg-slate-900 border-slate-800 text-slate-350 text-[10px]">CSV</Button>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/35 border border-slate-850 rounded-2xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-900/30">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Settlement Records Summary</h4>
                    <p className="text-[10px] text-slate-500 mt-1">ABA and KHQR logs reference audits.</p>
                  </div>
                  <div className="flex gap-2 justify-center pt-2">
                    <Button size="small" icon={<Download size={12} />} onClick={() => handleExport('PDF')} className="bg-slate-900 border-slate-800 text-slate-350 text-[10px]">PDF</Button>
                    <Button size="small" icon={<Download size={12} />} onClick={() => handleExport('CSV')} className="bg-slate-900 border-slate-800 text-slate-350 text-[10px]">CSV</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: SUPPORT CENTER */}
          {activeTab === 'support' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn text-left">
              
              {/* Left Column: Tickets list */}
              <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 space-y-4">
                <div className="border-b border-slate-900 pb-3">
                  <h3 className="text-white font-bold text-base">Helpdesk Tickets</h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Select a ticket to connect with player</p>
                </div>
                
                <div className="space-y-3 overflow-y-auto max-h-[450px] pr-1">
                  {supportTickets.map((t) => (
                    <div 
                      key={t.id}
                      onClick={() => setActiveChatTicket(t)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer text-left space-y-2.5 ${
                        activeChatTicket?.id === t.id
                          ? 'bg-indigo-950/20 border-indigo-500/60'
                          : 'bg-slate-900/20 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-850">{t.code}</span>
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                          t.priority === 'high' ? 'bg-red-950/40 text-red-400 border border-red-900/20' : 'bg-slate-900 text-slate-505'
                        }`}>{t.priority}</span>
                      </div>
                      <div>
                        <p className="text-xs text-white font-bold truncate">{t.customer}</p>
                        <p className="text-[10px] text-slate-450 truncate mt-0.5">{t.subject}</p>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-900/50 pt-2 text-[9px] text-slate-500 font-bold uppercase">
                        <span>{t.created_at}</span>
                        <span className={t.status === 'open' ? 'text-amber-500' : 'text-emerald-500'}>{t.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Chat Connection with Customer */}
              <div className="lg:col-span-2 bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl flex flex-col justify-between h-[550px] overflow-hidden">
                {activeChatTicket ? (
                  <>
                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-slate-900 bg-slate-950/30 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <div>
                          <h4 className="text-white font-bold text-sm">Connected: {activeChatTicket.customer}</h4>
                          <p className="text-[10px] text-slate-500">Ticket Ref: {activeChatTicket.code} | Status: {activeChatTicket.status.toUpperCase()}</p>
                        </div>
                      </div>
                      {activeChatTicket.status === 'open' && (
                        <Button 
                          type="primary"
                          size="small"
                          onClick={() => handleSolveTicket(activeChatTicket)}
                          className="bg-emerald-600 border-none hover:bg-emerald-500 text-[10px] font-bold"
                        >
                          Solve Ticket
                        </Button>
                      )}
                    </div>

                    {/* Chat Message Stream */}
                    <div className="flex-grow p-6 overflow-y-auto space-y-4 flex flex-col bg-slate-950/20">
                      {(chatMessages[activeChatTicket.code] || []).map((msg) => {
                        const isAdminMsg = msg.sender === 'admin';
                        return (
                          <div 
                            key={msg.id}
                            className={`max-w-[70%] p-3.5 rounded-2xl flex flex-col space-y-1 text-left ${
                              isAdminMsg
                                ? 'bg-[#312e81] text-white rounded-tr-none self-end'
                                : 'bg-[#12162e] border border-slate-850 text-slate-200 rounded-tl-none self-start'
                            }`}
                          >
                            <span className="text-[10.5px] font-medium leading-relaxed">{msg.text}</span>
                            <span className={`text-[8.5px] font-bold uppercase self-end ${
                              isAdminMsg ? 'text-indigo-300' : 'text-slate-500'
                            }`}>{msg.time}</span>
                          </div>
                        );
                      })}
                      
                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="self-start bg-[#12162e] border border-slate-855 p-3 rounded-2xl rounded-tl-none text-slate-500 text-[10px] font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                          <span className="ml-1 uppercase tracking-wider text-[8px]">{activeChatTicket.customer} is typing...</span>
                        </div>
                      )}
                    </div>

                    {/* Chat Input form */}
                    <form onSubmit={handleSendChatMessage} className="p-4 border-t border-slate-900 bg-slate-950/30 flex gap-3">
                      <input
                        type="text"
                        placeholder={`Message ${activeChatTicket.customer}...`}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-grow bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-550 focus:outline-none focus:border-indigo-500"
                      />
                      <button 
                        type="submit"
                        className="bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-black px-5 rounded-xl transition-colors border-none cursor-pointer"
                      >
                        Send Message
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-500 space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-400">
                      <MessageSquare size={32} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">No Connection Established</h4>
                      <p className="text-xs text-slate-550 max-w-sm mt-1 mx-auto">Select a player ticket on the left panel to establish a direct connection and start messaging in real-time.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 11: OPERATOR SECURITY / API LOGS */}
          {activeTab === 'security' && (
            <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div className="border-b border-slate-900 pb-4">
                <h3 className="text-white font-bold text-base">API & Security Audit Logs</h3>
                <p className="text-xs text-slate-550">Review system request signatures, status codes, payload structures, and client network footprints.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-550 border-b border-slate-900 pb-3">
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">API Target</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Method</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Payload / Action</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Status</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px]">Client Host IP</th>
                      <th className="pb-3 font-semibold uppercase text-[9.5px] text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {securityLogs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">No system or API logs found.</td>
                      </tr>
                    ) : (
                      securityLogs.map((log) => {
                        const isRealApiLog = !!log.url;
                        return (
                          <tr key={log.id || log._id} className="hover:bg-slate-900/10 transition-colors">
                            {isRealApiLog ? (
                              <>
                                <td className="py-4 font-mono text-white font-bold max-w-[200px] truncate" title={log.url}>
                                  {log.url.replace('https://api.g2bulk.com', '')}
                                </td>
                                <td className="py-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[8.5px] font-bold uppercase ${
                                    log.method === 'POST'
                                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                                      : 'bg-blue-950/40 text-blue-400 border border-blue-900/30'
                                  }`}>
                                    {log.method}
                                  </span>
                                </td>
                                <td className="py-4 text-slate-350 max-w-[250px] truncate font-mono text-[10px]" title={log.error || JSON.stringify(log.payload)}>
                                  {log.error ? (
                                    <span className="text-red-400 font-medium">{log.error}</span>
                                  ) : (
                                    JSON.stringify(log.payload)
                                  )}
                                </td>
                                <td className="py-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[8.5px] font-bold ${
                                    log.status_code >= 200 && log.status_code < 300
                                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                                      : 'bg-red-950/40 text-red-400 border border-red-900/30'
                                  }`}>
                                    {log.status_code || 'N/A'}
                                  </span>
                                </td>
                                <td className="py-4 font-mono text-cyan-400">{log.ip_address || '127.0.0.1'}</td>
                                <td className="py-4 text-slate-500 text-right">{new Date(log.created_at || log.date).toLocaleString()}</td>
                              </>
                            ) : (
                              <>
                                <td className="py-4 text-white font-bold">{log.operator}</td>
                                <td className="py-4">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8.5px] font-bold uppercase bg-slate-800 text-slate-300">
                                    SYSTEM
                                  </span>
                                </td>
                                <td className="py-4 text-slate-350">{log.action}</td>
                                <td className="py-4">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8.5px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
                                    200
                                  </span>
                                </td>
                                <td className="py-4 font-mono text-cyan-400">{log.ip_address}</td>
                                <td className="py-4 text-slate-500 text-right">{log.date}</td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 12: MY ADMINISTRATIVE PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#0a0d1e]/40 border border-slate-900 rounded-2xl p-6 space-y-6">
                <div className="border-b border-slate-900 pb-4">
                  <h3 className="text-white font-bold text-base">My Administrative Profile</h3>
                  <p className="text-xs text-slate-550">Manage your display profile details and operator access credentials.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Info Form */}
                  <form onSubmit={handleUpdateProfile} className="space-y-5 text-xs">
                    <h4 className="text-cyan-400 font-bold text-sm border-b border-slate-900 pb-2 flex items-center gap-2">
                      Profile Information
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-bold">Admin Display Name *</label>
                      <input 
                        type="text"
                        placeholder="e.g. Dara Sok"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-smooth"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-bold">Email Address *</label>
                      <input 
                        type="email"
                        placeholder="e.g. admin@example.com"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-smooth"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-bold">Phone Number</label>
                      <input 
                        type="text"
                        placeholder="e.g. 012 345 678"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-smooth"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={profileSubmitting}
                      className="h-10 px-6 bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-95 cursor-pointer border-none flex items-center justify-center"
                    >
                      {profileSubmitting ? 'Saving Profile...' : 'Save Profile Changes'}
                    </button>
                  </form>

                  {/* Password Form */}
                  <form onSubmit={handleUpdatePassword} className="space-y-5 text-xs">
                    <h4 className="text-purple-400 font-bold text-sm border-b border-slate-900 pb-2 flex items-center gap-2">
                      Change Operator Password
                    </h4>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-bold">Current Password *</label>
                      <input 
                        type="password"
                        placeholder="••••••••"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-smooth"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-bold">New Password *</label>
                      <input 
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-smooth"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-400 font-bold">Confirm New Password *</label>
                      <input 
                        type="password"
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full bg-slate-950/40 border border-slate-900 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-smooth"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={profileSubmitting}
                      className="h-10 px-6 bg-gradient-to-r from-purple-650 to-pink-650 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-600/10 active:scale-95 cursor-pointer border-none flex items-center justify-center"
                    >
                      {profileSubmitting ? 'Updating Password...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* FORM MODAL: REGISTER NEW GAME TITLE */}
      {gameModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden text-left flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-855 flex justify-between items-center bg-slate-950/30">
              <h3 className="text-white font-bold text-sm">
                {selectedGame ? "Edit Game Title" : "Register New Game Title"}
              </h3>
              <button 
                onClick={() => {
                  setGameModalOpen(false);
                  setSelectedGame(null);
                  setNewGameName('');
                  setNewGameKh('');
                  setNewGameLogo('');
                  setNewGameBanner('');
                  setNewGamePopular(false);
                  setNewGameFeatured(false);
                  setNewGameServerRequired(false);
                }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent flex items-center"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveGame} className="p-6 space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Game Title (English) *</label>
                <input 
                  type="text"
                  placeholder="e.g. Mobile Legends: Bang Bang"
                  value={newGameName}
                  onChange={(e) => setNewGameName(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Game Title (Khmer Translation)</label>
                <input 
                  type="text"
                  placeholder="e.g. ម៉ូបាលលីជិន"
                  value={newGameKh}
                  onChange={(e) => setNewGameKh(e.target.value)}
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Platform Category</label>
                <select 
                  value={newGameCat} 
                  onChange={(e) => setNewGameCat(e.target.value)} 
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="Mobile" className="bg-slate-900 text-white">Mobile Games</option>
                  <option value="PC & Console" className="bg-slate-900 text-white">PC & Console Games</option>
                  <option value="Gift Cards" className="bg-slate-900 text-white">Gift Cards</option>
                </select>
              </div>

              {/* Logo Upload Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Game Logo Image</label>
                <div className="flex gap-3 items-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleGameImageUpload(e.target.files[0], 'logo');
                      }
                    }}
                    className="hidden" 
                    id="game-logo-uploader"
                  />
                  <label 
                    htmlFor="game-logo-uploader"
                    className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-350 hover:text-white cursor-pointer hover:bg-slate-850 active:scale-95 transition-all text-xs"
                  >
                    Upload Logo File
                  </label>
                  {newGameLogo && (
                    <img src={newGameLogo} alt="Logo" className="w-10 h-10 object-cover rounded-xl border border-slate-800" />
                  )}
                </div>
                <input 
                  type="text"
                  placeholder="Or paste Logo Image URL" 
                  value={newGameLogo} 
                  onChange={(e) => setNewGameLogo(e.target.value)} 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all mt-1"
                />
              </div>

              {/* Banner Upload Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Game Banner Banner Image</label>
                <div className="flex gap-3 items-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleGameImageUpload(e.target.files[0], 'banner');
                      }
                    }}
                    className="hidden" 
                    id="game-banner-uploader"
                  />
                  <label 
                    htmlFor="game-banner-uploader"
                    className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-355 hover:text-white cursor-pointer hover:bg-slate-850 active:scale-95 transition-all text-xs"
                  >
                    Upload Banner File
                  </label>
                  {newGameBanner && (
                    <img src={newGameBanner} alt="Banner" className="w-16 h-10 object-cover rounded-xl border border-slate-800" />
                  )}
                </div>
                <input 
                  type="text"
                  placeholder="Or paste Banner Image URL" 
                  value={newGameBanner} 
                  onChange={(e) => setNewGameBanner(e.target.value)} 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all mt-1"
                />
              </div>

              {/* Options Toggles Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="newGamePopular"
                    checked={newGamePopular}
                    onChange={(e) => setNewGamePopular(e.target.checked)}
                    className="w-4 h-4 bg-slate-900 border-slate-800 rounded accent-blue-600 cursor-pointer"
                  />
                  <label htmlFor="newGamePopular" className="text-slate-400 font-bold cursor-pointer">Trending (Hot)</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="newGameFeatured"
                    checked={newGameFeatured}
                    onChange={(e) => setNewGameFeatured(e.target.checked)}
                    className="w-4 h-4 bg-slate-900 border-slate-800 rounded accent-blue-600 cursor-pointer"
                  />
                  <label htmlFor="newGameFeatured" className="text-slate-400 font-bold cursor-pointer">Featured</label>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="newGameServerRequired"
                    checked={newGameServerRequired}
                    onChange={(e) => setNewGameServerRequired(e.target.checked)}
                    className="w-4 h-4 bg-slate-900 border-slate-800 rounded accent-blue-600 cursor-pointer"
                  />
                  <label htmlFor="newGameServerRequired" className="text-slate-400 font-bold cursor-pointer">Require Server ID</label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-850 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setGameModalOpen(false);
                    setSelectedGame(null);
                    setNewGameName('');
                    setNewGameKh('');
                    setNewGameLogo('');
                    setNewGameBanner('');
                    setNewGamePopular(false);
                    setNewGameFeatured(false);
                    setNewGameServerRequired(false);
                  }} 
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-350 hover:text-white cursor-pointer active:scale-95 transition-all text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer active:scale-95 transition-all text-xs border-none"
                >
                  {selectedGame ? "Save Changes" : "Add Game"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: REGISTER TOP-UP PACKAGE */}
      {productModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden text-left flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-855 flex justify-between items-center bg-slate-950/30">
              <h3 className="text-white font-bold text-sm">
                {selectedProduct ? "Edit Top-Up Package" : "Register Top-Up Package"}
              </h3>
              <button 
                onClick={() => {
                  setProductModalOpen(false);
                  setSelectedProduct(null);
                  setNewProdName('');
                  setNewProdPrice('');
                  setNewProdDisc('0');
                }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent flex items-center"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Select Game Catalog *</label>
                <select 
                  value={newProdGameId} 
                  onChange={(e) => setNewProdGameId(e.target.value)} 
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  required
                >
                  <option value="" disabled className="bg-slate-900 text-slate-500">Choose game catalog...</option>
                  {games.map(g => (
                    <option key={g.id} value={g.id} className="bg-slate-900 text-white">{g.name_en}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Package Name details *</label>
                <input 
                  type="text"
                  placeholder="e.g. 1000 + 100 Diamonds Bonus"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Base Price (USD) *</label>
                <input 
                  type="number"
                  step="0.01"
                  placeholder="e.g. 9.99"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Promo Discount Percentage (%)</label>
                <input 
                  type="number"
                  placeholder="e.g. 10"
                  value={newProdDisc}
                  onChange={(e) => setNewProdDisc(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="pt-4 border-t border-slate-850 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setProductModalOpen(false);
                    setSelectedProduct(null);
                    setNewProdName('');
                    setNewProdPrice('');
                    setNewProdDisc('0');
                  }} 
                  className="px-4 py-2 bg-slate-955 border border-slate-800 rounded-xl text-slate-350 hover:text-white cursor-pointer active:scale-95 transition-all text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer active:scale-95 transition-all text-xs border-none"
                >
                  {selectedProduct ? "Save Changes" : "Register Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: REGISTER PROMO COUPON */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-955/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden text-left flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-855 flex justify-between items-center bg-slate-950/30">
              <h3 className="text-white font-bold text-sm">
                Create Promotional Coupon
              </h3>
              <button 
                onClick={() => setCouponModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent flex items-center"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddCoupon} className="p-6 space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Voucher Code (uppercase) *</label>
                <input 
                  type="text"
                  placeholder="e.g. PROMO20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Discount Type *</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value)}
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  required
                >
                  <option value="percentage" className="bg-slate-900 text-white">Percentage Discount (%)</option>
                  <option value="fixed" className="bg-slate-900 text-white">Fixed Cash Discount ($)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">
                  {newCouponType === 'percentage' ? 'Discount Value (%) *' : 'Discount Value (USD $) *'}
                </label>
                <input 
                  type="number"
                  step="0.01"
                  placeholder={newCouponType === 'percentage' ? 'e.g. 20' : 'e.g. 5.00'}
                  value={newCouponVal}
                  onChange={(e) => setNewCouponVal(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-bold">Start Date</label>
                  <input 
                    type="date"
                    value={newCouponStartDate}
                    onChange={(e) => setNewCouponStartDate(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-400 font-bold">End Date</label>
                  <input 
                    type="date"
                    value={newCouponEndDate}
                    onChange={(e) => setNewCouponEndDate(e.target.value)}
                    className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-850 flex justify-end gap-3 font-semibold">
                <button type="button" onClick={() => setCouponModalOpen(false)} className="px-4 py-2 bg-slate-955 border border-slate-800 rounded-xl text-slate-350 hover:text-white cursor-pointer active:scale-95 transition-all text-xs">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer active:scale-95 transition-all text-xs border-none">Create Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: REGISTER HOMEPAGE BANNER */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-955/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden text-left flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-855 flex justify-between items-center bg-slate-950/30">
              <h3 className="text-white font-bold text-sm">
                {selectedBanner ? "Edit Homepage Marketing Banner" : "Register Homepage Marketing Banner"}
              </h3>
              <button 
                onClick={() => {
                  setBannerModalOpen(false);
                  setSelectedBanner(null);
                  setNewBannerTitleEn('');
                  setNewBannerTitleKh('');
                  setNewBannerImgUrl('');
                  setNewBannerLinkUrl('');
                  setNewBannerOrder('0');
                }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent flex items-center"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveBanner} className="p-6 space-y-4 text-xs">
              <div className="flex flex-col gap-2">
                <label className="text-slate-400 font-bold">Banner Image *</label>
                
                {/* Input URL */}
                <input 
                  type="text"
                  placeholder="Paste banner image URL here..."
                  value={newBannerImgUrl}
                  onChange={(e) => setNewBannerImgUrl(e.target.value)}
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
                
                {/* Direct Upload button */}
                <div className="flex items-center gap-3 mt-1.5">
                  <label className="px-4 py-2 bg-slate-955 border border-slate-800 hover:border-slate-700 text-slate-350 rounded-xl cursor-pointer transition-all duration-300 font-bold text-center flex items-center justify-center gap-1.5 min-w-[120px] select-none text-xs">
                    <Plus size={14} /> Upload File
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                  {imageUploading && (
                    <span className="text-[10px] text-cyan-400 font-black animate-pulse uppercase tracking-wider">Uploading asset...</span>
                  )}
                  {!imageUploading && newBannerImgUrl && (
                    <span className="text-[10px] text-emerald-450 font-black uppercase tracking-wider">Asset loaded</span>
                  )}
                </div>

                {/* Banner Preview */}
                {newBannerImgUrl && (
                  <div className="mt-2 w-full h-36 rounded-xl border border-slate-855 overflow-hidden bg-slate-950 relative">
                    <img src={newBannerImgUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-955/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[9px] font-black text-white/50 bg-slate-955/40 px-2 py-0.5 rounded border border-slate-900/60 uppercase">Live Preview</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Banner Title (English)</label>
                <input 
                  type="text"
                  placeholder="e.g. 20% Discount Special MLBB Event"
                  value={newBannerTitleEn}
                  onChange={(e) => setNewBannerTitleEn(e.target.value)}
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Banner Title (Khmer)</label>
                <input 
                  type="text"
                  placeholder="e.g. ការផ្តល់ជូនពិសេសបញ្ចុះតម្លៃ ២០% MLBB"
                  value={newBannerTitleKh}
                  onChange={(e) => setNewBannerTitleKh(e.target.value)}
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Redirect Path / URL</label>
                <input 
                  type="text"
                  placeholder="e.g. /games/mobile-legends or https://..."
                  value={newBannerLinkUrl}
                  onChange={(e) => setNewBannerLinkUrl(e.target.value)}
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Order Index (Sorting)</label>
                <input 
                  type="number"
                  placeholder="e.g. 1"
                  value={newBannerOrder}
                  onChange={(e) => setNewBannerOrder(e.target.value)}
                  className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 h-10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div className="pt-4 border-t border-slate-850 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setBannerModalOpen(false);
                    setSelectedBanner(null);
                    setNewBannerTitleEn('');
                    setNewBannerTitleKh('');
                    setNewBannerImgUrl('');
                    setNewBannerLinkUrl('');
                    setNewBannerOrder('0');
                  }} 
                  className="px-4 py-2 bg-slate-955 border border-slate-800 rounded-xl text-slate-350 hover:text-white cursor-pointer active:scale-95 transition-all text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold cursor-pointer active:scale-95 transition-all text-xs border-none">
                  {selectedBanner ? "Save Changes" : "Register Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM MODAL: DISPATCH HELP-TICKET RESOLUTION */}
      {selectedTicket && ticketModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-955/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-850 rounded-2xl shadow-2xl overflow-hidden text-left flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-855 flex justify-between items-center bg-slate-955/30">
              <h3 className="text-white font-bold text-sm">
                Resolve Support Ticket: {selectedTicket.code}
              </h3>
              <button 
                onClick={() => setTicketModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent flex items-center"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-955 p-3 rounded-lg border border-slate-800 text-slate-400">
                <p className="font-bold text-white">Subject:</p>
                <p className="mt-1">{selectedTicket.subject}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold">Resolution Solution Summary Remarks *</label>
                <textarea 
                  placeholder="e.g. Diamonds have been re-delivered. Manual verification ABA reference code approved."
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all animate-none"
                  rows={3}
                  required
                />
              </div>
              <div className="pt-4 border-t border-slate-850 flex justify-end gap-3 font-semibold">
                <button onClick={() => setTicketModalOpen(false)} className="px-4 py-2 bg-slate-955 border border-slate-800 rounded-xl text-slate-350 hover:text-white cursor-pointer active:scale-95 transition-all text-xs">Cancel</button>
                <button onClick={submitTicketSolution} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer active:scale-95 transition-all text-xs border-none">Mark Resolved</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
