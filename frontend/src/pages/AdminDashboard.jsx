import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard,
  Clock,
  BookOpen,
  Package,
  Users,
  DollarSign,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowLeft,
  AlertTriangle,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  LogOut,
  X,
  Search,
  Menu,
  Sliders,
  Save,
  RotateCcw,
  Sparkles,
  Globe,
  Percent,
  Truck,
  Phone,
  Mail,
  FileText,
  Layers,
  Crown,
  ShieldAlert,
  UserPlus,
  Star,
  Flame,
  EyeOff,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Tag,
  Bookmark,
  Compass,
  Stethoscope,
  GraduationCap,
  Languages,
  School,
  Library,
  BookMarked,
  Recycle,
  Heart,
  Award,
  Trophy,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const ICON_MAP = {
  BookOpen,
  Bookmark,
  Compass,
  Stethoscope,
  GraduationCap,
  Languages,
  School,
  Library,
  Layers,
  BookMarked,
  Sparkles,
  Flame,
  Globe,
  Tag,
  Users,
  Recycle,
  Heart,
  Award,
  Trophy,
  Shield,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Star,
};


// Fallback initial data in case the API is offline or returns empty
const initialFallbackPendingBooks = [
  {
    _id: 'pb-101',
    title: 'Operating System Concepts (10th Edition)',
    author: 'Silberschatz, Galvin & Gagne',
    category: 'Engineering',
    originalPrice: 1500,
    sellingPrice: 750,
    condition: 'Like New',
    type: 'sale',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    ],
    sellerId: {
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      address: { city: 'Kathmandu', phone: '9841234567' },
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'pb-102',
    title: 'Harrison\'s Principles of Internal Medicine',
    author: 'J. Larry Jameson',
    category: 'Medical',
    originalPrice: 4200,
    sellingPrice: 1800,
    condition: 'Good Condition',
    type: 'sale',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    ],
    sellerId: {
      name: 'Dr. Anupama Karki',
      email: 'anupama.karki@example.com',
      address: { city: 'Lalitpur', phone: '9851098765' },
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: 'pb-103',
    title: 'SEE Compulsory Mathematics Question Bank',
    author: 'K.P. Adhikari',
    category: 'SEE Prep',
    originalPrice: 650,
    sellingPrice: 0,
    condition: 'Fair Condition',
    type: 'donation',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    ],
    sellerId: {
      name: 'Sunita Thapa',
      email: 'sunita.thapa@example.com',
      address: { city: 'Bhaktapur', phone: '9860112233' },
    },
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

const initialSampleOrders = [
  {
    _id: 'ORD-8821',
    buyerName: 'Pooja Shrestha',
    buyerEmail: 'pooja.s@example.com',
    itemsCount: 2,
    totalAmount: 950,
    paymentStatus: 'completed',
    orderStatus: 'delivered',
    createdAt: '2026-09-14T10:15:00Z',
  },
  {
    _id: 'ORD-8822',
    buyerName: 'Bikash Pokhrel',
    buyerEmail: 'bikash.p@example.com',
    itemsCount: 1,
    totalAmount: 350,
    paymentStatus: 'completed',
    orderStatus: 'shipped',
    createdAt: '2026-09-14T14:30:00Z',
  },
  {
    _id: 'ORD-8823',
    buyerName: 'Suman Shrestha',
    buyerEmail: 'suman.shrestha@example.com',
    itemsCount: 3,
    totalAmount: 1420,
    paymentStatus: 'pending',
    orderStatus: 'processing',
    createdAt: '2026-09-15T08:45:00Z',
  },
  {
    _id: 'ORD-8824',
    buyerName: 'Aayush Basnet',
    buyerEmail: 'aayush.b@example.com',
    itemsCount: 1,
    totalAmount: 280,
    paymentStatus: 'completed',
    orderStatus: 'pending',
    createdAt: '2026-09-15T11:20:00Z',
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Navigation sidebar state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'pending' | 'books' | 'orders' | 'users'

  // Admin and Auth validation
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Data States
  const [stats, setStats] = useState({
    totalRevenue: 42850,
    totalUsers: 128,
    pendingApprovals: 3,
    completedOrders: 94,
  });

  const [pendingBooks, setPendingBooks] = useState(initialFallbackPendingBooks);
  const [allBooks, setAllBooks] = useState([]);
  const [orders, setOrders] = useState(initialSampleOrders);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal State for Inspection & Price Adjustments
  const [inspectingBook, setInspectingBook] = useState(null);
  const [inspectPrice, setInspectPrice] = useState(0);
  const [inspectOriginalPrice, setInspectOriginalPrice] = useState(0);

  const handleOpenInspection = (book) => {
    setInspectingBook(book);
    setInspectPrice(book.sellingPrice || 0);
    setInspectOriginalPrice(book.originalPrice || 0);
  };

  // Search in Pending Table
  const [pendingSearch, setPendingSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ================= RBAC & CURRENT USER STATE =================
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const isSuperAdmin =
    currentUser?.role === 'superadmin' || currentUser?.email === 'admin@smartkitab.com';

  const hasPermission = (permKey) => {
    if (isSuperAdmin) return true;
    return Boolean(currentUser?.permissions?.[permKey]);
  };

  // ================= CURATIONS (FEATURED & BESTSELLERS) STATE =================
  const [curationBooks, setCurationBooks] = useState([]);
  const [curationFilter, setCurationFilter] = useState('all'); // 'all' | 'featured' | 'bestsellers'
  const [curationSearch, setCurationSearch] = useState('');
  const [savingCurationId, setSavingCurationId] = useState(null);

  // ================= STAFF & MULTI-ADMIN STATE =================
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [newStaffModalOpen, setNewStaffModalOpen] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    permissions: {
      canManageBooks: true,
      canManageOrders: true,
      canManageCMS: true,
      canManageCurations: true,
      canManageUsers: false,
    },
  });

  // ================= DYNAMIC CATEGORY & METRIC MODAL STATE =================
  const [newCatModalOpen, setNewCatModalOpen] = useState(false);
  const [newCatData, setNewCatData] = useState({
    name: '',
    description: '',
    icon: 'BookOpen',
  });

  const [newMetricModalOpen, setNewMetricModalOpen] = useState(false);
  const [newMetricData, setNewMetricData] = useState({
    value: '',
    label: '',
    subtext: '',
    icon: 'BookOpen',
  });

  // ================= CMS & Site Settings State =================
  const {
    settings: globalSettings,
    updateSettings: updateCmsSettings,
    resetSettings: resetCmsSettings,
  } = useSiteSettings();

  const [cmsData, setCmsData] = useState(globalSettings);
  const [cmsSubTab, setCmsSubTab] = useState('metrics'); // 'metrics' | 'announcement' | 'hero' | 'bookcycle' | 'contact' | 'commerce'
  const [savingCms, setSavingCms] = useState(false);

  useEffect(() => {
    if (globalSettings) {
      setCmsData(globalSettings);
    }
  }, [globalSettings]);

  const handleSaveCms = async (e) => {
    if (e) e.preventDefault();
    setSavingCms(true);
    const res = await updateCmsSettings(cmsData);
    setSavingCms(false);
    showToast(res.message);
  };

  const handleResetCms = async () => {
    if (
      window.confirm(
        'Are you sure you want to restore all website copy, metrics, and banners back to default factory settings?'
      )
    ) {
      setSavingCms(true);
      const res = await resetCmsSettings();
      setSavingCms(false);
      showToast(res.message);
    }
  };

  const updateCmsSection = (section, field, value) => {
    setCmsData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  // Metric Cards Management inside CMS
  const handleAddMetric = () => {
    if (!newMetricData.value.trim() || !newMetricData.label.trim()) return;
    const metricId =
      newMetricData.label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_') +
      '_' +
      Date.now().toString().slice(-4);
    const newMetric = {
      id: metricId,
      value: newMetricData.value.trim(),
      label: newMetricData.label.trim(),
      subtext: newMetricData.subtext.trim(),
      icon: newMetricData.icon || 'BookOpen',
      isVisible: true,
      displayOrder: (cmsData?.metrics?.length || 0) + 1,
    };
    setCmsData((prev) => ({
      ...prev,
      metrics: [...(prev.metrics || []), newMetric],
    }));
    setNewMetricModalOpen(false);
    setNewMetricData({ value: '', label: '', subtext: '', icon: 'BookOpen' });
    showToast(`Added metric card "${newMetric.label}". Click Save to persist!`);
  };

  const handleToggleMetricVisibility = (index) => {
    setCmsData((prev) => {
      const metrics = [...(prev.metrics || [])];
      metrics[index] = {
        ...metrics[index],
        isVisible: metrics[index].isVisible === false ? true : false,
      };
      return { ...prev, metrics };
    });
  };

  const handleDeleteMetric = (index) => {
    if (!window.confirm('Are you sure you want to remove this metric card?')) return;
    setCmsData((prev) => {
      const metrics = [...(prev.metrics || [])];
      metrics.splice(index, 1);
      return { ...prev, metrics };
    });
    showToast('Metric card removed. Click Save to persist!');
  };

  const handleMoveMetric = (index, direction) => {
    setCmsData((prev) => {
      const metrics = [...(prev.metrics || [])];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= metrics.length) return prev;
      const temp = metrics[index];
      metrics[index] = metrics[targetIndex];
      metrics[targetIndex] = temp;
      metrics.forEach((m, idx) => {
        m.displayOrder = idx + 1;
      });
      return { ...prev, metrics };
    });
  };

  const updateMetricItem = (index, field, value) => {
    setCmsData((prev) => {
      const updated = [...(prev?.metrics || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, metrics: updated };
    });
  };


  const updateFounderField = (field, value) => {
    setCmsData((prev) => ({
      ...prev,
      bookCycle: {
        ...(prev?.bookCycle || {}),
        founder: {
          ...((prev?.bookCycle && prev.bookCycle.founder) || {}),
          [field]: value,
        },
      },
    }));
  };

  const updateTrustBadge = (index, value) => {
    setCmsData((prev) => {
      const badges = [...((prev?.hero && prev.hero.trustBadges) || [])];
      badges[index] = value;
      return {
        ...prev,
        hero: {
          ...(prev?.hero || {}),
          trustBadges: badges,
        },
      };
    });
  };

  const updateBookCycleFeature = (index, value) => {
    setCmsData((prev) => {
      const feats = [...((prev?.bookCycle && prev.bookCycle.features) || [])];
      feats[index] = value;
      return {
        ...prev,
        bookCycle: {
          ...(prev?.bookCycle || {}),
          features: feats,
        },
      };
    });
  };

  // Category management inside CMS
  const handleAddCategory = () => {
    if (!newCatData.name.trim()) return;
    const catId = newCatData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
    const newCategory = {
      id: catId,
      name: newCatData.name.trim(),
      description: newCatData.description.trim(),
      icon: newCatData.icon || 'BookOpen',
      isVisible: true,
      displayOrder: (cmsData?.categories?.length || 0) + 1,
    };
    setCmsData((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), newCategory],
    }));
    setNewCatModalOpen(false);
    setNewCatData({ name: '', description: '', icon: 'BookOpen' });
    showToast(`Added category "${newCategory.name}". Click Save to persist!`);
  };

  const handleToggleCategoryVisibility = (index) => {
    setCmsData((prev) => {
      const cats = [...(prev.categories || [])];
      cats[index] = { ...cats[index], isVisible: !cats[index].isVisible };
      return { ...prev, categories: cats };
    });
  };

  const handleDeleteCategory = (index) => {
    if (!window.confirm('Are you sure you want to remove this category?')) return;
    setCmsData((prev) => {
      const cats = [...(prev.categories || [])];
      cats.splice(index, 1);
      return { ...prev, categories: cats };
    });
    showToast('Category removed. Click Save to persist!');
  };

  const handleMoveCategory = (index, direction) => {
    setCmsData((prev) => {
      const cats = [...(prev.categories || [])];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= cats.length) return prev;
      const temp = cats[index];
      cats[index] = cats[targetIndex];
      cats[targetIndex] = temp;
      cats.forEach((c, idx) => {
        c.displayOrder = idx + 1;
      });
      return { ...prev, categories: cats };
    });
  };

  // Curations Handlers
  const fetchCurations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/curations', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.books) {
        setCurationBooks(res.data.books);
      }
    } catch (err) {
      console.warn('Failed to fetch curations:', err.message);
    }
  };

  const handleCurationFieldChange = (bookId, field, value) => {
    setCurationBooks((prev) =>
      prev.map((b) => (b._id === bookId ? { ...b, [field]: value } : b))
    );
  };

  const handleUpdateCuration = async (bookId, fields) => {
    try {
      setSavingCurationId(bookId);
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/admin/curations/${bookId}`, fields, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.success) {
        setCurationBooks((prev) =>
          prev.map((b) => (b._id === bookId ? { ...b, ...fields } : b))
        );
        showToast(res.data.message || 'Curation updated!');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update curation');
    } finally {
      setSavingCurationId(null);
    }
  };

  // Staff Handlers
  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/staff', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.staff) {
        setStaffList(res.data.staff);
      }
    } catch (err) {
      console.warn('Failed to fetch staff list:', err.message);
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/admin/staff', newStaffData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.success) {
        showToast(res.data.message);
        setNewStaffModalOpen(false);
        setNewStaffData({
          name: '',
          email: '',
          password: '',
          role: 'admin',
          permissions: {
            canManageBooks: true,
            canManageOrders: true,
            canManageCMS: true,
            canManageCurations: true,
            canManageUsers: false,
          },
        });
        fetchStaff();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleToggleStaffPermission = async (staffId, permKey, currentValue) => {
    try {
      const staffMember = staffList.find((s) => s._id === staffId);
      if (!staffMember) return;
      const updatedPermissions = {
        ...staffMember.permissions,
        [permKey]: !currentValue,
      };
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `/api/admin/staff/${staffId}/permissions`,
        { permissions: updatedPermissions },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (res.data?.success) {
        setStaffList((prev) =>
          prev.map((s) =>
            s._id === staffId ? { ...s, permissions: updatedPermissions } : s
          )
        );
        showToast(`Updated permissions for ${staffMember.name}`);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update permission');
    }
  };

  const handleDeleteStaff = async (staffId, staffName) => {
    if (!window.confirm(`Revoke administrative privileges for ${staffName}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`/api/admin/staff/${staffId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.data?.success) {
        showToast(res.data.message);
        setStaffList((prev) => prev.filter((s) => s._id !== staffId));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to revoke access');
    }
  };

  // 1. Authorization & Token Verification
  useEffect(() => {
    const verifyAdmin = async () => {
      let token = localStorage.getItem('token');
      let storedUser = null;

      try {
        storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      } catch {
        storedUser = null;
      }

      // If already logged in as admin or superadmin
      if (token && storedUser && ['admin', 'superadmin'].includes(storedUser.role)) {
        setCurrentUser(storedUser);
        setIsAuthorized(true);
        setAuthChecking(false);
        return;
      }

      // Check if we can automatically authenticate using seeded admin credentials
      try {
        const loginRes = await axios.post('/api/auth/login', {
          email: 'admin@smartkitab.com',
          password: 'password123',
        });

        if (loginRes.data?.token && ['admin', 'superadmin'].includes(loginRes.data?.user?.role)) {
          localStorage.setItem('token', loginRes.data.token);
          localStorage.setItem('user', JSON.stringify(loginRes.data.user));
          setCurrentUser(loginRes.data.user);
          setIsAuthorized(true);
          setAuthChecking(false);
          return;
        }
      } catch (err) {
        console.warn('Auto admin login failed:', err.message);
      }

      // If user is neither admin nor authorized, redirect to home page
      if (!storedUser || !['admin', 'superadmin'].includes(storedUser.role)) {
        alert('Access denied: Administrator credentials required. Redirecting to home page...');
        navigate('/');
      } else {
        setCurrentUser(storedUser);
        setIsAuthorized(true);
      }
      setAuthChecking(false);
    };

    verifyAdmin();
  }, [navigate]);

  // 2. Fetch Data (Stats, Pending Books, All Books)
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const authHeaders = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    try {
      // 1. Fetch Admin Stats
      try {
        const statsRes = await axios.get('/api/admin/stats', authHeaders);
        if (statsRes.data?.stats) {
          setStats((prev) => ({
            ...prev,
            totalUsers: statsRes.data.stats.totalUsers || prev.totalUsers,
            pendingApprovals: statsRes.data.stats.pendingApprovals ?? prev.pendingApprovals,
            totalRevenue: statsRes.data.stats.totalSales || prev.totalRevenue,
          }));
        }
      } catch (e) {
        console.warn('Stats fetch notice:', e.message);
      }

      // 2. Fetch Pending Books
      try {
        const pendingRes = await axios.get('/api/admin/pending-books', authHeaders);
        if (pendingRes.data?.books && pendingRes.data.books.length > 0) {
          setPendingBooks(pendingRes.data.books);
        }
      } catch (e) {
        console.warn('Pending books fetch notice:', e.message);
      }

      // 3. Fetch All Books for catalog tab
      try {
        const allBooksRes = await axios.get('/api/books');
        if (allBooksRes.data?.books) {
          setAllBooks(allBooksRes.data.books);
        }
      } catch (e) {
        console.warn('All books fetch notice:', e.message);
      }

      // 4. Fetch Curations
      try {
        await fetchCurations();
      } catch (e) {
        console.warn('Curations fetch notice:', e.message);
      }

      // 5. Fetch Staff if superadmin or has permission
      try {
        if (isSuperAdmin || currentUser?.permissions?.canManageAdmins) {
          await fetchStaff();
        }
      } catch (e) {
        console.warn('Staff fetch notice:', e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchData();
    }
  }, [isAuthorized]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 3. Handle Status Update (Approve / Reject) with optional Price updates
  const handleUpdateStatus = async (bookId, newStatus, additionalFields = {}) => {
    const token = localStorage.getItem('token');
    const authHeaders = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    try {
      await axios.patch(
        `/api/books/${bookId}/status`,
        { status: newStatus, ...additionalFields },
        authHeaders
      );
      showToast(
        newStatus === 'approved' && additionalFields.sellingPrice
          ? `Listing approved & published with price Rs. ${additionalFields.sellingPrice}!`
          : `Book listing successfully marked as "${newStatus}"!`
      );
    } catch (err) {
      console.warn('API status patch fallback:', err.message);
      showToast(`Book listing marked as "${newStatus}"! (Local state updated)`);
    }

    // Update local state by removing from pending table
    setPendingBooks((prev) => prev.filter((b) => b._id !== bookId));
    setStats((prev) => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
    }));

    if (inspectingBook?._id === bookId) {
      setInspectingBook(null);
    }

    // Refresh catalog books
    try {
      const allBooksRes = await axios.get('/api/books');
      if (allBooksRes.data?.books) {
        setAllBooks(allBooksRes.data.books);
      }
    } catch (e) {
      console.warn('Error refreshing books:', e.message);
    }
  };

  const handleSaveBookPrice = async (bookId, newPrice, newOriginalPrice) => {
    try {
      const token = localStorage.getItem('token');
      const authHeaders = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.put(
        `/api/books/${bookId}`,
        { sellingPrice: Number(newPrice), originalPrice: Number(newOriginalPrice) },
        authHeaders
      );
      if (res.data?.success) {
        showToast(`Book price updated to Rs. ${newPrice} successfully!`);
        setAllBooks((prev) =>
          prev.map((b) =>
            b._id === bookId
              ? { ...b, sellingPrice: Number(newPrice), originalPrice: Number(newOriginalPrice) }
              : b
          )
        );
        setPendingBooks((prev) =>
          prev.map((b) =>
            b._id === bookId
              ? { ...b, sellingPrice: Number(newPrice), originalPrice: Number(newOriginalPrice) }
              : b
          )
        );
        if (inspectingBook?._id === bookId) {
          setInspectingBook(null);
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update book price');
    }
  };

  // 4. Handle Order Status Change
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord))
    );
    showToast(`Order ${orderId} status updated to ${newStatus}.`);
  };

  // Filtered Pending Books by Search
  const filteredPending = pendingBooks.filter(
    (b) =>
      b.title?.toLowerCase().includes(pendingSearch.toLowerCase()) ||
      b.author?.toLowerCase().includes(pendingSearch.toLowerCase()) ||
      b.sellerId?.name?.toLowerCase().includes(pendingSearch.toLowerCase())
  );

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#795238] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-[#795238]">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex flex-col lg:flex-row font-sans text-stone-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#795238] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden bg-[#F3EBDD] border-b border-[#795238]/15 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="SMARTKITAB Logo"
            className="w-8 h-8 object-contain rounded-lg shadow-2xs border border-[#795238]/20 bg-white"
          />
          <span className="text-lg font-black tracking-tight text-[#795238]">
            SMART<span className="text-[#E07A5F]">KITAB</span>
          </span>
          <span className="text-[9px] uppercase font-bold text-[#365314] tracking-wider ml-1 bg-[#365314]/10 px-1.5 py-0.5 rounded">
            Admin
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-white/80 border border-[#795238]/20 text-[#795238] cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 animate-in fade-in duration-200"
        />
      )}

      {/* ================= 1. NAVIGATION SIDEBAR ================= */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 w-72 lg:w-64 bg-[#F3EBDD] border-r border-[#795238]/15 flex flex-col justify-between shrink-0 h-screen transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#795238]/15 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.jpg"
                alt="SMARTKITAB Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-sm border border-[#795238]/20 bg-white"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-[#795238] leading-none">
                  SMART<span className="text-[#E07A5F]">KITAB</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-[#365314] tracking-wider mt-0.5">
                  Admin Panel
                </span>
              </div>
            </Link>
            {/* Close button on mobile drawer */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#795238] text-white shadow-md'
                  : 'text-stone-700 hover:bg-[#FAF6EF]'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Overview</span>
            </button>

            {hasPermission('canManageBooks') && (
              <button
                onClick={() => {
                  setActiveTab('pending');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'pending'
                    ? 'bg-[#795238] text-white shadow-md'
                    : 'text-stone-700 hover:bg-[#FAF6EF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  <span>Pending Approvals</span>
                </div>
                {pendingBooks.length > 0 && (
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      activeTab === 'pending'
                        ? 'bg-[#E07A5F] text-white'
                        : 'bg-[#E07A5F]/15 text-[#E07A5F]'
                    }`}
                  >
                    {pendingBooks.length}
                  </span>
                )}
              </button>
            )}

            {hasPermission('canManageBooks') && (
              <button
                onClick={() => {
                  setActiveTab('books');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'books'
                    ? 'bg-[#795238] text-white shadow-md'
                    : 'text-stone-700 hover:bg-[#FAF6EF]'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>All Books</span>
              </button>
            )}

            {hasPermission('canManageOrders') && (
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#795238] text-white shadow-md'
                    : 'text-stone-700 hover:bg-[#FAF6EF]'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </button>
            )}

            {hasPermission('canManageCurations') && (
              <button
                onClick={() => {
                  setActiveTab('curations');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'curations'
                    ? 'bg-[#795238] text-white shadow-md'
                    : 'text-stone-700 hover:bg-[#FAF6EF]'
                }`}
              >
                <Star className="w-5 h-5 text-amber-500" />
                <span>Curations & Featured</span>
              </button>
            )}

            {hasPermission('canManageCMS') && (
              <button
                onClick={() => {
                  setActiveTab('cms');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'cms'
                    ? 'bg-[#795238] text-white shadow-md'
                    : 'text-stone-700 hover:bg-[#FAF6EF]'
                }`}
              >
                <Sliders className="w-5 h-5" />
                <span>CMS & Content</span>
              </button>
            )}

            {hasPermission('canManageUsers') && (
              <button
                onClick={() => {
                  setActiveTab('users');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-[#795238] text-white shadow-md'
                    : 'text-stone-700 hover:bg-[#FAF6EF]'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </button>
            )}

            {/* Super Admin Exclusive: Staff & Permissions */}
            {isSuperAdmin && (
              <button
                onClick={() => {
                  setActiveTab('staff');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'staff'
                    ? 'bg-[#795238] text-white shadow-md'
                    : 'text-stone-700 hover:bg-[#FAF6EF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <span>Staff & Roles</span>
                </div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  Super
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#795238]/15 space-y-3">
          <div className="p-3 bg-white/70 rounded-2xl border border-[#795238]/10 text-xs">
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-stone-900 truncate">
                {currentUser?.name || 'SMARTKITAB Admin'}
              </p>
              {isSuperAdmin ? (
                <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-amber-500 text-white rounded-full">
                  Super Admin
                </span>
              ) : (
                <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-[#795238] text-white rounded-full">
                  Admin Staff
                </span>
              )}
            </div>
            <p className="text-stone-500 truncate">{currentUser?.email || 'admin@smartkitab.com'}</p>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-bold text-[#795238] hover:text-[#E07A5F] px-2 py-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/');
            }}
            className="w-full flex items-center gap-2 text-xs font-bold text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-10 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#795238]/15">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#795238] tracking-tight">
              {activeTab === 'cms'
                ? 'Storefront Content CMS'
                : activeTab === 'curations'
                ? 'Book Curations & Ranking'
                : activeTab === 'staff'
                ? 'Staff Roles & Permissions (RBAC)'
                : 'Management Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {activeTab === 'cms'
                ? 'Manage metrics (20k+ books, 12k+ students), homepage sections, categories, announcements, hero copy, and delivery fees.'
                : activeTab === 'curations'
                ? 'Designate which books appear in the Featured Carousel and Best Sellers slider, and control their exact display rank.'
                : activeTab === 'staff'
                ? 'Super Admin control panel to create new administrators, assign granular permission checkboxes, and revoke staff access.'
                : 'Real-time platform metrics, listing verification, and order processing.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'cms' ? (
              <>
                <button
                  type="button"
                  onClick={handleResetCms}
                  disabled={savingCms}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2 transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveCms}
                  disabled={savingCms}
                  className="px-5 py-2.5 rounded-xl bg-[#795238] hover:bg-[#633f27] text-white text-xs font-bold flex items-center gap-2 transition shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Save className={`w-4 h-4 ${savingCms ? 'animate-spin' : ''}`} />
                  <span>{savingCms ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </>
            ) : activeTab === 'curations' ? (
              <button
                type="button"
                onClick={fetchCurations}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#F3EBDD] border border-[#795238]/20 text-xs font-bold text-[#795238] flex items-center gap-2 transition shadow-2xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Curations</span>
              </button>
            ) : activeTab === 'staff' ? (
              <button
                type="button"
                onClick={() => setNewStaffModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#795238] hover:bg-[#633f27] text-white text-xs font-bold flex items-center gap-2 transition shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create New Admin</span>
              </button>
            ) : (
              <>
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F3EBDD] border border-[#795238]/20 text-xs font-bold text-[#795238] flex items-center gap-2 transition shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Data</span>
                </button>
                <span className="text-xs font-bold bg-[#365314]/15 text-[#365314] px-3 py-1.5 rounded-full">
                  System Active • 2026
                </span>
              </>
            )}
          </div>
        </div>

        {/* ================= SECTION 1: KEY METRICS GRID ================= */}
        {(activeTab === 'overview' || activeTab === 'pending') && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
              Platform Vital Metrics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Total Revenue */}
              <div className="bg-white border border-[#795238]/15 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#795238]/10 text-[#795238] flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center text-xs font-bold text-[#365314] bg-emerald-50 px-2 py-0.5 rounded-full gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> +14.2%
                  </span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-[#795238]">
                    Rs. {stats.totalRevenue.toLocaleString()}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-700 mt-1">
                    Total Revenue
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Gross book marketplace sales</p>
                </div>
              </div>

              {/* Card 2: Total Active Users */}
              <div className="bg-white border border-[#795238]/15 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#365314]/10 text-[#365314] flex items-center justify-center font-bold">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center text-xs font-bold text-[#365314] bg-emerald-50 px-2 py-0.5 rounded-full gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> +8.5%
                  </span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-stone-900">
                    {stats.totalUsers}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-700 mt-1">
                    Total Active Users
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Verified buyers and sellers</p>
                </div>
              </div>

              {/* Card 3: Pending Book Approvals */}
              <div className="bg-white border border-[#795238]/15 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E07A5F]/15 text-[#E07A5F] flex items-center justify-center font-bold">
                    <Clock className="w-6 h-6" />
                  </div>
                  {pendingBooks.length > 0 && (
                    <span className="text-xs font-bold text-[#E07A5F] bg-rose-50 px-2.5 py-0.5 rounded-full border border-[#E07A5F]/20 animate-pulse">
                      Action Required
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-[#E07A5F]">
                    {pendingBooks.length}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-700 mt-1">
                    Pending Book Approvals
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Waiting for quality verification</p>
                </div>
              </div>

              {/* Card 4: Completed Orders */}
              <div className="bg-white border border-[#795238]/15 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                    <Package className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
                    98.4% Fulfilled
                  </span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-stone-900">
                    {stats.completedOrders}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-700 mt-1">
                    Completed Orders
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Delivered to readers across Nepal</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 2: LISTING VERIFICATION TABLE ================= */}
        {(activeTab === 'overview' || activeTab === 'pending') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-[#795238] tracking-tight flex items-center gap-2">
                  <span>Pending Book Approvals</span>
                  <span className="text-xs font-bold bg-[#E07A5F] text-white px-2.5 py-0.5 rounded-full">
                    {pendingBooks.length}
                  </span>
                </h2>
                <p className="text-xs text-stone-600">
                  Inspect user-submitted books, check condition rating, and approve or reject listings.
                </p>
              </div>

              {/* Search in table */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter pending books..."
                  value={pendingSearch}
                  onChange={(e) => setPendingSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#795238]/20 focus:outline-none focus:border-[#795238]"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl border border-[#795238]/15 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F3EBDD]/60 text-[#795238] font-bold text-[11px] uppercase tracking-wider border-b border-[#795238]/10">
                    <tr>
                      <th className="py-4 px-6">Cover</th>
                      <th className="py-4 px-6">Title & Category</th>
                      <th className="py-4 px-6">Author</th>
                      <th className="py-4 px-6">Seller Name</th>
                      <th className="py-4 px-6">Condition</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#795238]/10">
                    {filteredPending.length > 0 ? (
                      filteredPending.map((book) => {
                        const coverImg =
                          book.images && book.images.length > 0
                            ? book.images[0]
                            : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=120&q=80';

                        return (
                          <tr
                            key={book._id}
                            className="hover:bg-[#FAF6EF]/50 transition-colors duration-150"
                          >
                            {/* Thumbnail */}
                            <td className="py-4 px-6">
                              <div className="w-12 h-16 rounded-lg overflow-hidden border border-[#795238]/20 bg-stone-100 shadow-2xs">
                                <img
                                  src={coverImg}
                                  alt={book.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </td>

                            {/* Title & Category */}
                            <td className="py-4 px-6">
                              <p className="font-bold text-stone-900 line-clamp-1 max-w-xs" title={book.title}>
                                {book.title}
                              </p>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#365314] bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                                {book.category}
                              </span>
                            </td>

                            {/* Author */}
                            <td className="py-4 px-6 text-stone-600 font-medium">
                              {book.author}
                            </td>

                            {/* Seller */}
                            <td className="py-4 px-6">
                              <p className="font-bold text-stone-800">
                                {book.sellerId?.name || 'Verified Member'}
                              </p>
                              <p className="text-[11px] text-stone-500">
                                {book.sellerId?.address?.city || 'Kathmandu'}
                              </p>
                            </td>

                            {/* Condition */}
                            <td className="py-4 px-6">
                              <span
                                className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                                  book.condition === 'Like New'
                                    ? 'bg-emerald-50 text-[#365314] border-emerald-300'
                                    : book.condition === 'Good Condition'
                                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                                    : 'bg-stone-100 text-stone-700 border-stone-300'
                                }`}
                              >
                                {book.condition}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-4 px-6">
                              <span className="font-black text-[#795238] text-sm">
                                Rs. {book.sellingPrice}
                              </span>
                              {book.type === 'donation' && (
                                <span className="block text-[10px] font-bold text-[#E07A5F]">
                                  Free Donation
                                </span>
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* Inspect Details & Edit Price */}
                                <button
                                  onClick={() => handleOpenInspection(book)}
                                  title="Inspect Details & Set Price"
                                  className="p-2 rounded-xl bg-[#F3EBDD] hover:bg-[#795238] hover:text-white text-[#795238] transition cursor-pointer shadow-2xs"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {/* Approve */}
                                <button
                                  onClick={() => handleUpdateStatus(book._id, 'approved')}
                                  title="Approve Book"
                                  className="px-3 py-1.5 rounded-xl bg-[#365314] hover:bg-[#283e0e] text-white font-bold text-xs flex items-center gap-1 transition shadow-sm cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>

                                {/* Reject */}
                                <button
                                  onClick={() => handleUpdateStatus(book._id, 'rejected')}
                                  title="Reject Book"
                                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-sm cursor-pointer"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-stone-500">
                          <CheckCircle2 className="w-8 h-8 text-[#365314] mx-auto mb-2 opacity-80" />
                          <p className="font-bold text-sm text-stone-800">All caught up!</p>
                          <p className="text-xs text-stone-500">
                            There are currently no book listings pending moderation.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ================= SECTION 3: ORDER MANAGEMENT LIST ================= */}
        {(activeTab === 'overview' || activeTab === 'orders') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#795238] tracking-tight">
                  Recent Orders & Fulfillment
                </h2>
                <p className="text-xs text-stone-600">
                  Track delivery status and update dispatch phases for student orders.
                </p>
              </div>

              <span className="text-xs font-bold text-stone-600 bg-white border border-[#795238]/15 px-3 py-1.5 rounded-xl">
                Total Orders: <strong>{orders.length}</strong>
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-[#795238]/15 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F3EBDD]/60 text-[#795238] font-bold text-[11px] uppercase tracking-wider border-b border-[#795238]/10">
                    <tr>
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Buyer</th>
                      <th className="py-4 px-6">Items</th>
                      <th className="py-4 px-6">Amount</th>
                      <th className="py-4 px-6">Payment Status</th>
                      <th className="py-4 px-6">Order Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#795238]/10">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-[#FAF6EF]/50 transition">
                        {/* Order ID */}
                        <td className="py-4 px-6 font-mono font-bold text-[#795238]">
                          {ord._id}
                        </td>

                        {/* Buyer */}
                        <td className="py-4 px-6">
                          <p className="font-bold text-stone-900">{ord.buyerName}</p>
                          <p className="text-[11px] text-stone-500">{ord.buyerEmail}</p>
                        </td>

                        {/* Items */}
                        <td className="py-4 px-6 text-stone-600 font-medium">
                          {ord.itemsCount} {ord.itemsCount > 1 ? 'books' : 'book'}
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-6 font-black text-stone-900">
                          Rs. {ord.totalAmount}
                        </td>

                        {/* Payment Status Badge */}
                        <td className="py-4 px-6">
                          <span
                            className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              ord.paymentStatus === 'completed'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : ord.paymentStatus === 'pending'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>

                        {/* Order Status Dropdown */}
                        <td className="py-4 px-6">
                          <div className="relative inline-block">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                              className={`appearance-none text-xs font-bold rounded-xl pl-3 pr-8 py-1.5 border cursor-pointer focus:outline-none ${
                                ord.orderStatus === 'delivered'
                                  ? 'bg-emerald-50 text-[#365314] border-emerald-300'
                                  : ord.orderStatus === 'shipped'
                                  ? 'bg-purple-50 text-purple-800 border-purple-300'
                                  : ord.orderStatus === 'processing'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-stone-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ================= ALL BOOKS TAB ================= */}
        {activeTab === 'books' && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-[#795238] tracking-tight">
                  All Approved Books in Catalog ({allBooks.length})
                </h2>
                <p className="text-xs text-stone-600">
                  Review prices, profit margins, and update selling prices directly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allBooks.map((b) => {
                const sellerAsking = b.sellerAskingPrice || b.sellingPrice;
                const margin = b.sellingPrice - sellerAsking;

                return (
                  <div
                    key={b._id}
                    className="p-4 bg-white border border-[#795238]/15 rounded-2xl flex flex-col justify-between gap-3 shadow-xs hover:shadow-md transition"
                  >
                    <div className="flex gap-3 items-start">
                      <img
                        src={b.images?.[0] || 'https://via.placeholder.com/60'}
                        alt={b.title}
                        className="w-14 h-20 object-cover rounded-xl border border-[#795238]/15 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-[#E07A5F] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {b.category}
                        </span>
                        <p className="font-bold text-sm text-stone-900 line-clamp-1 mt-1" title={b.title}>
                          {b.title}
                        </p>
                        <p className="text-xs text-stone-500 truncate">{b.author}</p>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-sm font-black text-[#795238]">
                            Rs. {b.sellingPrice}
                          </span>
                          {b.originalPrice > b.sellingPrice && (
                            <span className="text-[11px] text-stone-400 line-through">
                              MRP Rs. {b.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#795238]/10 flex items-center justify-between">
                      <div className="text-[11px]">
                        <span className="text-stone-500">Seller: Rs. {sellerAsking}</span>
                        {margin > 0 && (
                          <span className="ml-1.5 font-bold text-[#365314] bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                            +Rs. {margin} Margin
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenInspection(b)}
                        className="px-3 py-1 rounded-xl bg-[#FAF6EF] hover:bg-[#795238] hover:text-white text-[#795238] text-xs font-bold transition border border-[#795238]/20 flex items-center gap-1 cursor-pointer"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Edit Price</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================= USERS TAB ================= */}
        {activeTab === 'users' && (
          <section className="space-y-4">
            <h2 className="text-lg font-black text-[#795238]">Registered Platform Users</h2>
            <div className="bg-white rounded-3xl border border-[#795238]/15 p-6 shadow-sm">
              <ul className="divide-y divide-[#795238]/10 text-sm">
                <li className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold">SMARTKITAB Admin</p>
                    <p className="text-xs text-stone-500">admin@smartkitab.com</p>
                  </div>
                  <span className="text-xs font-bold bg-[#795238] text-white px-2.5 py-0.5 rounded-full">Admin</span>
                </li>
                <li className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold">Sample Seller</p>
                    <p className="text-xs text-stone-500">seller@smartkitab.com</p>
                  </div>
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Seller</span>
                </li>
                <li className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold">Sample Buyer</p>
                    <p className="text-xs text-stone-500">buyer@smartkitab.com</p>
                  </div>
                  <span className="text-xs font-bold bg-emerald-100 text-[#365314] px-2.5 py-0.5 rounded-full">Buyer</span>
                </li>
              </ul>
            </div>
          </section>
        )}

        {/* ================= CMS & STOREFRONT CONTENT MANAGEMENT ================= */}
        {activeTab === 'cms' && (
          <section className="space-y-6">
            {/* CMS Sub-Navigation Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#795238]/15">
              {[
                { id: 'sections', label: '👁️ Homepage Sections', desc: 'Toggle section visibility' },
                { id: 'categories', label: '🏷️ Category Manager', desc: 'Add, hide, reorder categories' },
                { id: 'metrics', label: '📊 Impact Metrics (20k Books...)', desc: 'Homepage statistics' },
                { id: 'announcement', label: '📢 Announcement Banner', desc: 'Top global ribbon' },
                { id: 'hero', label: '🚀 Hero Copy & Badges', desc: 'Main headline & trust' },
                { id: 'bookcycle', label: '🔄 BookCycle & Founder', desc: 'Pricing & mission' },
                { id: 'contact', label: '📞 Contact & Footer', desc: 'Address, phone, bio' },
                { id: 'commerce', label: '🚚 Delivery & Fees', desc: 'Free delivery threshold' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCmsSubTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    cmsSubTab === tab.id
                      ? 'bg-[#795238] text-white shadow-md'
                      : 'bg-white text-stone-700 hover:bg-[#FAF6EF] border border-[#795238]/15'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* SUB-TAB: HOMEPAGE SECTIONS VISIBILITY */}
            {cmsSubTab === 'sections' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#795238]/15 p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-base font-black text-[#795238]">
                      Homepage Section Visibility Toggles
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Enable or disable entire sections of the homepage. Changes immediately reflect across customer storefront browsing sessions when you click Save.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        key: 'showAnnouncement',
                        title: '📢 Global Announcement Ribbon',
                        desc: 'Top-of-page announcement ribbon highlighting student discounts and quality assurances.',
                      },
                      {
                        key: 'showHero',
                        title: '🚀 Hero Section & Search Bar',
                        desc: 'Primary headline, value proposition banner, CTA buttons, and trust badges.',
                      },
                      {
                        key: 'showMetricsBar',
                        title: '📊 Impact Metrics Bar',
                        desc: 'Key platform milestone counters: 20,000+ books, 12,000+ students served, money saved.',
                      },
                      {
                        key: 'showCategoryGrid',
                        title: '🏷️ Circular Category Selector',
                        desc: 'The circular category navigation grid linking directly to catalog collections.',
                      },
                      {
                        key: 'showFeaturedBooks',
                        title: '⭐ Featured Books Showcase',
                        desc: 'The curated Featured Books carousel on the homepage.',
                      },
                      {
                        key: 'showBestSellers',
                        title: '🔥 Best Sellers Slider',
                        desc: 'The horizontal high-demand Best Sellers book slider.',
                      },
                      {
                        key: 'showBookCycle',
                        title: '🔄 BookCycle & Founder Story',
                        desc: 'BookCycle membership benefits, study notes facilities, and founder message.',
                      },
                    ].map((sec) => {
                      const isEnabled = cmsData?.sections?.[sec.key] !== false;
                      return (
                        <div
                          key={sec.key}
                          className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                            isEnabled
                              ? 'bg-[#FAF6EF]/60 border-[#795238]/20 shadow-xs'
                              : 'bg-stone-50 border-stone-200 opacity-60'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-stone-900">{sec.title}</h4>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isEnabled
                                    ? 'bg-emerald-100 text-[#365314]'
                                    : 'bg-stone-200 text-stone-600'
                                }`}
                              >
                                {isEnabled ? 'Visible' : 'Hidden'}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 leading-relaxed">{sec.desc}</p>
                          </div>

                          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={(e) =>
                                updateCmsSection('sections', sec.key, e.target.checked)
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#365314]"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB: CATEGORY MANAGER */}
            {cmsSubTab === 'categories' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#795238]/15 p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-[#795238]">
                        Platform Categories Manager
                      </h3>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Add new categories, toggle visibility (show/hide), reorder display priority, or delete categories. All changes sync dynamically to Homepage Grid, Catalog filters, and Sell Book submission.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewCatModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#795238] hover:bg-[#633f27] text-white text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Category</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(cmsData?.categories || []).map((cat, idx) => {
                      const IconComponent = ICON_MAP[cat.icon] || BookOpen;
                      return (
                        <div
                          key={cat.id || idx}
                          className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            cat.isVisible !== false
                              ? 'bg-[#FAF6EF]/60 border-[#795238]/15'
                              : 'bg-stone-50 border-stone-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-2xl bg-white border border-[#795238]/20 flex items-center justify-center text-[#795238] shrink-0 shadow-2xs">
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-black text-stone-900 truncate">
                                  {cat.name}
                                </h4>
                                <span className="text-[10px] font-mono font-bold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0">
                                  ID: {cat.id}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                    cat.isVisible !== false
                                      ? 'bg-emerald-100 text-[#365314]'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {cat.isVisible !== false ? 'Visible' : 'Hidden'}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 truncate mt-0.5">
                                {cat.description || 'General category'} • Icon: {cat.icon || 'BookOpen'} • Slot #{idx + 1}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => handleMoveCategory(idx, -1)}
                              disabled={idx === 0}
                              title="Move Up"
                              className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveCategory(idx, 1)}
                              disabled={idx === (cmsData?.categories?.length || 0) - 1}
                              title="Move Down"
                              className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleCategoryVisibility(idx)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                                cat.isVisible !== false
                                  ? 'bg-white hover:bg-amber-50 border-amber-200 text-amber-800'
                                  : 'bg-white hover:bg-emerald-50 border-emerald-200 text-[#365314]'
                              }`}
                            >
                              {cat.isVisible !== false ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Hide</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Show</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(idx)}
                              className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 cursor-pointer hover:bg-rose-100 transition"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 1: METRICS */}
            {cmsSubTab === 'metrics' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#795238]/15 p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-[#795238]">
                        Platform Impact Metrics Cards
                      </h3>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Add new cards, toggle visibility (show/hide), reorder priority, customize icons, or delete cards. All visible cards instantly render in the homepage Metrics Bar.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewMetricModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#795238] hover:bg-[#633f27] text-white text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Metric Card</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(cmsData?.metrics || []).map((m, idx) => {
                      const IconComponent = ICON_MAP[m.icon] || BookOpen;
                      const isVisible = m.isVisible !== false;

                      return (
                        <div
                          key={m.id || idx}
                          className={`p-5 rounded-2xl border transition-all space-y-4 ${
                            isVisible
                              ? 'bg-[#FAF6EF]/60 border-[#795238]/15 shadow-2xs'
                              : 'bg-stone-50 border-stone-200 opacity-60'
                          }`}
                        >
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#795238]/10 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white border border-[#795238]/20 flex items-center justify-center text-[#795238] shadow-2xs shrink-0">
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-black text-[#795238] uppercase tracking-wider">
                                    Slot #{idx + 1}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                                    ID: {m.id}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      isVisible
                                        ? 'bg-emerald-100 text-[#365314]'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {isVisible ? 'Visible' : 'Hidden'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                              <button
                                type="button"
                                onClick={() => handleMoveMetric(idx, -1)}
                                disabled={idx === 0}
                                title="Move Up"
                                className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 disabled:opacity-30 cursor-pointer transition"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveMetric(idx, 1)}
                                disabled={idx === (cmsData?.metrics?.length || 0) - 1}
                                title="Move Down"
                                className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 disabled:opacity-30 cursor-pointer transition"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleMetricVisibility(idx)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                                  isVisible
                                    ? 'bg-white hover:bg-amber-50 border-amber-200 text-amber-800'
                                    : 'bg-white hover:bg-emerald-50 border-emerald-200 text-[#365314]'
                                }`}
                              >
                                {isVisible ? (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5" />
                                    <span>Hide</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Show</span>
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMetric(idx)}
                                className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 cursor-pointer hover:bg-rose-100 transition"
                                title="Delete Metric Card"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Card Fields Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Displayed Value *
                              </label>
                              <input
                                type="text"
                                value={m.value || ''}
                                onChange={(e) => updateMetricItem(idx, 'value', e.target.value)}
                                className="w-full px-3 py-2 text-sm font-black text-[#795238] bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                                placeholder="e.g. 20,000+"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Label Title *
                              </label>
                              <input
                                type="text"
                                value={m.label || ''}
                                onChange={(e) => updateMetricItem(idx, 'label', e.target.value)}
                                className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                                placeholder="e.g. Books Available"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Subtext / Description
                              </label>
                              <input
                                type="text"
                                value={m.subtext || ''}
                                onChange={(e) => updateMetricItem(idx, 'subtext', e.target.value)}
                                className="w-full px-3 py-2 text-xs text-stone-600 bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                                placeholder="e.g. In stock across Nepal"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Display Icon
                              </label>
                              <select
                                value={m.icon || 'BookOpen'}
                                onChange={(e) => updateMetricItem(idx, 'icon', e.target.value)}
                                className="w-full px-3 py-2 text-xs font-bold text-stone-800 bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238] cursor-pointer"
                              >
                                {[
                                  { value: 'BookOpen', label: '📖 Book Open' },
                                  { value: 'Users', label: '👥 Users / Students' },
                                  { value: 'Recycle', label: '♻️ Recycle / Savings' },
                                  { value: 'Heart', label: '❤️ Heart / Care' },
                                  { value: 'Award', label: '🎖️ Award / Badge' },
                                  { value: 'Trophy', label: '🏆 Trophy / Success' },
                                  { value: 'Sparkles', label: '✨ Sparkles / Featured' },
                                  { value: 'Shield', label: '🛡️ Shield / Verified' },
                                  { value: 'TrendingUp', label: '📈 Trending Up' },
                                  { value: 'DollarSign', label: '💰 Money / Savings' },
                                  { value: 'Compass', label: '🧭 Compass / Hubs' },
                                  { value: 'GraduationCap', label: '🎓 Graduation Cap' },
                                  { value: 'School', label: '🏫 School' },
                                  { value: 'Library', label: '📚 Library' },
                                  { value: 'CheckCircle', label: '✅ Verified Quality' },
                                ].map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="bg-[#FAF6EF] border-2 border-dashed border-[#795238]/30 rounded-3xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#795238] flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>Live Storefront Preview (Visible Cards Only)</span>
                    </span>
                    <span className="text-[11px] font-medium text-stone-500">
                      Renders in MetricsBar on Homepage
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-[#795238]/15 shadow-sm">
                    {(() => {
                      const visibleMetrics = (cmsData?.metrics || []).filter(
                        (m) => m.isVisible !== false
                      );
                      if (visibleMetrics.length === 0) {
                        return (
                          <p className="text-xs text-stone-400 text-center py-4">
                            All metric cards are currently hidden. The section will not render on the homepage.
                          </p>
                        );
                      }
                      return (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                          {visibleMetrics.map((m, idx) => {
                            const IconC = ICON_MAP[m.icon] || BookOpen;
                            return (
                              <div
                                key={idx}
                                className="p-4 rounded-xl bg-[#FAF6EF]/50 border border-[#795238]/10 flex flex-col items-center justify-between gap-2"
                              >
                                <div className="w-9 h-9 rounded-xl bg-[#795238]/10 flex items-center justify-center text-[#795238]">
                                  <IconC className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-xl sm:text-2xl font-black text-[#795238] tracking-tight">
                                    {m.value || '—'}
                                  </p>
                                  <p className="text-xs font-bold text-stone-900 mt-0.5">
                                    {m.label || '—'}
                                  </p>
                                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                                    {m.subtext || '—'}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: ANNOUNCEMENT */}
            {cmsSubTab === 'announcement' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#795238]/15 p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#795238]">
                        Top Announcement Ribbon
                      </h3>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Appears at the very top of all storefront pages to announce offers, holiday schedules, or delivery updates.
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsData?.announcement?.enabled ?? true}
                        onChange={(e) => updateCmsSection('announcement', 'enabled', e.target.checked)}
                        className="w-4 h-4 accent-[#795238] rounded cursor-pointer"
                      />
                      <span className="text-xs font-bold text-stone-800">Show Ribbon</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Pill Badge Text
                      </label>
                      <input
                        type="text"
                        value={cmsData?.announcement?.badge || ''}
                        onChange={(e) => updateCmsSection('announcement', 'badge', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="Offer / Alert / New"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Main Announcement Text
                      </label>
                      <input
                        type="text"
                        value={cmsData?.announcement?.text || ''}
                        onChange={(e) => updateCmsSection('announcement', 'text', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="Read More. Pay Less. • Save up to 70%..."
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Right Notice / Trust Text
                      </label>
                      <input
                        type="text"
                        value={cmsData?.announcement?.rightNotice || ''}
                        onChange={(e) => updateCmsSection('announcement', 'rightNotice', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="Verified Book Quality Guarantee • Kathmandu Valley..."
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="bg-[#FAF6EF] border-2 border-dashed border-[#795238]/30 rounded-3xl p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#795238] flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>Live Storefront Preview</span>
                    </span>
                    <span className="text-[11px] font-medium text-stone-500">
                      Status: {cmsData?.announcement?.enabled ? 'Active (Visible)' : 'Hidden (Disabled)'}
                    </span>
                  </div>

                  {cmsData?.announcement?.enabled ? (
                    <div className="bg-[#4E3629] text-[#FAF6EF] px-4 py-2.5 rounded-xl shadow-xs text-xs flex flex-col md:flex-row items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#FAF6EF] text-[#4E3629] rounded-md shrink-0">
                          {cmsData?.announcement?.badge || 'Offer'}
                        </span>
                        <span className="font-bold truncate">
                          {cmsData?.announcement?.text || 'Announcement text goes here'}
                        </span>
                      </div>
                      <span className="hidden md:inline-block text-[11px] text-[#FAF6EF]/80 font-medium">
                        {cmsData?.announcement?.rightNotice || 'Verified Quality Guarantee'}
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-stone-200 text-stone-600 text-xs text-center font-bold">
                      The announcement ribbon is currently disabled and will not be displayed to customers.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-TAB 3: HERO COPY */}
            {cmsSubTab === 'hero' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#795238]/15 p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-base font-black text-[#795238]">
                      Hero Section Headline & Badges
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Customise the main punchline, pill badge, descriptive text, and trust indicators on the homepage hero.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Pill Tagline Badge
                      </label>
                      <input
                        type="text"
                        value={cmsData?.hero?.pillText || ''}
                        onChange={(e) => updateCmsSection('hero', 'pillText', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="Sustainable Student Book Marketplace"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Headline Prefix (Normal font)
                      </label>
                      <input
                        type="text"
                        value={cmsData?.hero?.titlePrefix || ''}
                        onChange={(e) => updateCmsSection('hero', 'titlePrefix', e.target.value)}
                        className="w-full px-3 py-2 text-sm font-bold text-stone-900 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="Smart books."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Headline Highlight (Warm Brown Accent)
                      </label>
                      <input
                        type="text"
                        value={cmsData?.hero?.titleHighlight || ''}
                        onChange={(e) => updateCmsSection('hero', 'titleHighlight', e.target.value)}
                        className="w-full px-3 py-2 text-sm font-black text-[#795238] bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="Smarter savings."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Subtitle Paragraph
                      </label>
                      <textarea
                        rows={2}
                        value={cmsData?.hero?.subtitle || ''}
                        onChange={(e) => updateCmsSection('hero', 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-medium text-stone-800 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="Buy verified second-hand books, sell the ones you've finished..."
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                        Trust Badges (3 Badges)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[0, 1, 2].map((idx) => (
                          <input
                            key={idx}
                            type="text"
                            value={cmsData?.hero?.trustBadges?.[idx] || ''}
                            onChange={(e) => updateTrustBadge(idx, e.target.value)}
                            className="px-3 py-2 text-xs font-bold text-stone-800 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                            placeholder={`Badge #${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="bg-[#FAF6EF] border-2 border-dashed border-[#795238]/30 rounded-3xl p-6 sm:p-8 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#795238] flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>Live Hero Preview</span>
                  </span>

                  <div className="bg-white rounded-2xl p-6 border border-[#795238]/15 shadow-sm space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#FAF6EF] text-[#795238] border border-[#795238]/20">
                      {cmsData?.hero?.pillText || 'Pill text'}
                    </span>
                    <h2 className="text-3xl font-black tracking-tight text-stone-900">
                      {cmsData?.hero?.titlePrefix || 'Prefix'}{' '}
                      <span className="text-[#795238]">{cmsData?.hero?.titleHighlight || 'Highlight'}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
                      {cmsData?.hero?.subtitle || 'Subtitle description...'}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {(cmsData?.hero?.trustBadges || []).map((b, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs font-bold text-[#365314] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: BOOKCYCLE & FOUNDER */}
            {cmsSubTab === 'bookcycle' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#795238]/15 p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-base font-black text-[#795238]">
                      BookCycle Membership & Founder Story
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Configure the subscription plan pricing, included features, and the founder mission card.
                    </p>
                  </div>

                  {/* Pricing row */}
                  <div className="p-4 rounded-2xl bg-[#FAF6EF]/60 border border-[#795238]/15 space-y-4">
                    <span className="text-xs font-black text-[#795238] uppercase tracking-wider">
                      BookCycle Subscription Pricing
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Monthly Fee (Rs.)
                        </label>
                        <input
                          type="number"
                          value={cmsData?.bookCycle?.membershipPrice ?? 200}
                          onChange={(e) => updateCmsSection('bookCycle', 'membershipPrice', Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm font-black text-[#795238] bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Billing Cycle Period
                        </label>
                        <input
                          type="text"
                          value={cmsData?.bookCycle?.membershipPeriod || '/ month'}
                          onChange={(e) => updateCmsSection('bookCycle', 'membershipPeriod', e.target.value)}
                          className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        />
                      </div>
                      <div className="sm:col-span-2 md:col-span-1">
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          BookCycle Tagline
                        </label>
                        <input
                          type="text"
                          value={cmsData?.bookCycle?.tagline || ''}
                          onChange={(e) => updateCmsSection('bookCycle', 'tagline', e.target.value)}
                          className="w-full px-3 py-2 text-xs text-stone-800 bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                          placeholder="Read as many books as you like..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                        Subscription Features (4 Highlights)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[0, 1, 2, 3].map((idx) => (
                          <input
                            key={idx}
                            type="text"
                            value={cmsData?.bookCycle?.features?.[idx] || ''}
                            onChange={(e) => updateBookCycleFeature(idx, e.target.value)}
                            className="px-3 py-2 text-xs font-medium text-stone-800 bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                            placeholder={`Feature #${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Founder Story row */}
                  <div className="p-4 rounded-2xl bg-[#FAF6EF]/60 border border-[#795238]/15 space-y-4">
                    <span className="text-xs font-black text-[#795238] uppercase tracking-wider">
                      Founder Mission Quote & Profile
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Founder Name
                        </label>
                        <input
                          type="text"
                          value={cmsData?.bookCycle?.founder?.name || ''}
                          onChange={(e) => updateFounderField('name', e.target.value)}
                          className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                          placeholder="Shraddha"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={cmsData?.bookCycle?.founder?.role || ''}
                          onChange={(e) => updateFounderField('role', e.target.value)}
                          className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                          placeholder="Founder & Community Lead"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Avatar Image URL
                        </label>
                        <input
                          type="text"
                          value={cmsData?.bookCycle?.founder?.imageUrl || ''}
                          onChange={(e) => updateFounderField('imageUrl', e.target.value)}
                          className="w-full px-3 py-2 text-xs text-stone-800 bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Founder Mission Quote / Story
                        </label>
                        <textarea
                          rows={3}
                          value={cmsData?.bookCycle?.founder?.quote || ''}
                          onChange={(e) => updateFounderField('quote', e.target.value)}
                          className="w-full px-3 py-2 text-xs text-stone-800 bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                          placeholder="Hi, I'm Shraddha! I founded SMARTKITAB because..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="bg-[#FAF6EF] border-2 border-dashed border-[#795238]/30 rounded-3xl p-6 sm:p-8 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#795238] flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>Live BookCycle & Founder Preview</span>
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Membership Preview */}
                    <div className="p-5 bg-[#365314] text-white rounded-2xl space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200">
                        SmartKitab Pass
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black">
                          Rs. {cmsData?.bookCycle?.membershipPrice ?? 200}
                        </span>
                        <span className="text-xs text-emerald-200">
                          {cmsData?.bookCycle?.membershipPeriod || '/ month'}
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-xs">
                        {(cmsData?.bookCycle?.features || []).map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Founder Quote Preview */}
                    <div className="p-5 bg-white border border-[#795238]/15 rounded-2xl flex gap-4 items-start">
                      <img
                        src={cmsData?.bookCycle?.founder?.imageUrl || 'https://via.placeholder.com/80'}
                        alt="Founder"
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#795238]/20 shrink-0"
                      />
                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-stone-900">
                          {cmsData?.bookCycle?.founder?.name || 'Founder'}
                        </p>
                        <p className="text-[10px] font-medium text-stone-500">
                          {cmsData?.bookCycle?.founder?.role || 'Founder & Lead'}
                        </p>
                        <p className="text-stone-600 italic text-[11px] pt-1 leading-relaxed">
                          "{cmsData?.bookCycle?.founder?.quote || 'Founder mission statement...'}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 5: CONTACT & FOOTER */}
            {cmsSubTab === 'contact' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#795238]/15 p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-base font-black text-[#795238]">
                      Contact Information & Footer Details
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Maintain accurate customer support contacts, physical hub address, footer narrative, and copyright notice.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Support Email Address
                      </label>
                      <input
                        type="email"
                        value={cmsData?.contact?.email || ''}
                        onChange={(e) => updateCmsSection('contact', 'email', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="support@smartkitab.com"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Customer Hotline Phone
                      </label>
                      <input
                        type="text"
                        value={cmsData?.contact?.phone || ''}
                        onChange={(e) => updateCmsSection('contact', 'phone', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="+977 9800000000"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Physical Office / Drop-off Hub Address
                      </label>
                      <input
                        type="text"
                        value={cmsData?.contact?.address || ''}
                        onChange={(e) => updateCmsSection('contact', 'address', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-medium text-stone-800 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="Putalisadak, Kathmandu, Nepal"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Brand Tagline
                      </label>
                      <input
                        type="text"
                        value={cmsData?.contact?.tagline || ''}
                        onChange={(e) => updateCmsSection('contact', 'tagline', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="Read More. Pay Less. • Saving Trees, Saving Money"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Company Bio (Footer Summary)
                      </label>
                      <textarea
                        rows={3}
                        value={cmsData?.contact?.bio || ''}
                        onChange={(e) => updateCmsSection('contact', 'bio', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-medium text-stone-800 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="Nepal's circular second-hand book marketplace..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Footer Copyright Notice
                      </label>
                      <input
                        type="text"
                        value={cmsData?.contact?.copyright || ''}
                        onChange={(e) => updateCmsSection('contact', 'copyright', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-bold text-stone-900 bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                        placeholder="© 2026 SMARTKITAB Nepal. All rights reserved."
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="bg-[#FAF6EF] border-2 border-dashed border-[#795238]/30 rounded-3xl p-6 sm:p-8 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#795238] flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>Live Footer Preview</span>
                  </span>

                  <div className="bg-[#4E3629] text-[#FAF6EF] rounded-2xl p-6 shadow-sm space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-white/10 pb-4">
                      <div>
                        <p className="font-black text-sm tracking-wider text-[#FAF6EF]">SMARTKITAB</p>
                        <p className="text-[11px] text-[#FAF6EF]/70">{cmsData?.contact?.tagline}</p>
                        <p className="text-[11px] text-[#FAF6EF]/80 mt-2 max-w-md">{cmsData?.contact?.bio}</p>
                      </div>
                      <div className="space-y-1 shrink-0 text-[11px]">
                        <p className="flex items-center gap-1.5 text-[#FAF6EF]/90">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{cmsData?.contact?.phone}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-[#FAF6EF]/90">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{cmsData?.contact?.email}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-[#FAF6EF]/90">
                          <Globe className="w-3.5 h-3.5" />
                          <span>{cmsData?.contact?.address}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-[11px] text-[#FAF6EF]/60 text-center">
                      {cmsData?.contact?.copyright}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 6: COMMERCE & DELIVERY */}
            {cmsSubTab === 'commerce' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#795238]/15 p-6 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-base font-black text-[#795238]">
                      Commerce & Shipping Rules
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Configure dynamic delivery fee rates and free delivery qualification thresholds across the cart and checkout.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-4 rounded-2xl bg-[#FAF6EF]/60 border border-[#795238]/15 space-y-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                        Free Delivery Minimum Order (Rs.)
                      </label>
                      <input
                        type="number"
                        value={cmsData?.commerce?.freeDeliveryThreshold ?? 500}
                        onChange={(e) => updateCmsSection('commerce', 'freeDeliveryThreshold', Number(e.target.value))}
                        className="w-full px-3 py-2 text-base font-black text-[#795238] bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                      />
                      <p className="text-[11px] text-stone-500">
                        Orders equal to or exceeding this subtotal automatically receive free delivery in the cart.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF6EF]/60 border border-[#795238]/15 space-y-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                        Standard Delivery Shipping Fee (Rs.)
                      </label>
                      <input
                        type="number"
                        value={cmsData?.commerce?.standardDeliveryFee ?? 50}
                        onChange={(e) => updateCmsSection('commerce', 'standardDeliveryFee', Number(e.target.value))}
                        className="w-full px-3 py-2 text-base font-black text-[#795238] bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                      />
                      <p className="text-[11px] text-stone-500">
                        Charged when order subtotal is below the free delivery minimum threshold.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="bg-[#FAF6EF] border-2 border-dashed border-[#795238]/30 rounded-3xl p-6 sm:p-8 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#795238] flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>Live Cart Drawer Preview</span>
                  </span>

                  <div className="bg-white rounded-2xl p-6 border border-[#795238]/15 shadow-sm space-y-3 max-w-md">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                      <span className="flex items-center gap-1.5 text-[#365314]">
                        <Truck className="w-4 h-4" />
                        <span>Free Delivery Progress</span>
                      </span>
                      <span>Rs. 350 / Rs. {cmsData?.commerce?.freeDeliveryThreshold ?? 500}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-[#365314] rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((350 / (cmsData?.commerce?.freeDeliveryThreshold || 500)) * 100)
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="text-[11px] text-stone-600">
                      Add <strong className="text-stone-900 font-bold">Rs. {Math.max(0, (cmsData?.commerce?.freeDeliveryThreshold ?? 500) - 350)}</strong> more to unlock FREE delivery! (Standard rate: Rs. {cmsData?.commerce?.standardDeliveryFee ?? 50})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Floating/Sticky Action Bar */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#795238]/15 shadow-md">
              <div className="text-xs text-stone-500">
                <span>Changes will update immediately across all storefront sessions upon saving.</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetCms}
                  disabled={savingCms}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Factory Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveCms}
                  disabled={savingCms}
                  className="px-6 py-2 rounded-xl bg-[#795238] hover:bg-[#633f27] text-white text-xs font-bold flex items-center gap-2 transition shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Save className={`w-4 h-4 ${savingCms ? 'animate-spin' : ''}`} />
                  <span>{savingCms ? 'Saving...' : 'Save All CMS Changes'}</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ================= BOOK CURATIONS & RANKING ================= */}
        {activeTab === 'curations' && (
          <section className="space-y-6">
            {/* Top Stat Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#795238]/15 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Featured Books
                  </span>
                  <p className="text-2xl font-black text-[#795238] mt-1">
                    {curationBooks.filter((b) => b.isFeatured).length}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Active in homepage carousel
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-2xs">
                  <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#795238]/15 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Best Sellers
                  </span>
                  <p className="text-2xl font-black text-[#E07A5F] mt-1">
                    {curationBooks.filter((b) => b.isBestSeller).length}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Highlighted with flame badge
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E07A5F] flex items-center justify-center border border-rose-200 shadow-2xs">
                  <Flame className="w-6 h-6 fill-[#E07A5F]" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#795238]/15 shadow-xs flex items-center justify-between sm:col-span-2 lg:col-span-1">
                <div>
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Total Catalog Books
                  </span>
                  <p className="text-2xl font-black text-stone-800 mt-1">
                    {curationBooks.length}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Available for homepage curation
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#365314] flex items-center justify-center border border-emerald-200 shadow-2xs">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#795238]/15 shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: `All Books (${curationBooks.length})` },
                  {
                    id: 'featured',
                    label: `⭐ Featured Only (${curationBooks.filter((b) => b.isFeatured).length})`,
                  },
                  {
                    id: 'bestsellers',
                    label: `🔥 Best Sellers (${curationBooks.filter((b) => b.isBestSeller).length})`,
                  },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCurationFilter(f.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      curationFilter === f.id
                        ? 'bg-[#795238] text-white shadow-xs'
                        : 'bg-[#FAF6EF] text-stone-700 hover:bg-stone-200/60'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search title, author, category..."
                  value={curationSearch}
                  onChange={(e) => setCurationSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF6EF]/60 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238] text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Curations Table */}
            <div className="bg-white rounded-3xl border border-[#795238]/15 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-[#795238]/10 bg-[#FAF6EF]/70 text-[11px] font-black uppercase tracking-wider text-stone-600">
                      <th className="py-3 px-4">Book Details</th>
                      <th className="py-3 px-4">Featured Carousel</th>
                      <th className="py-3 px-4">Best Sellers Slider</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#795238]/10 text-xs">
                    {curationBooks
                      .filter((b) => {
                        if (curationFilter === 'featured' && !b.isFeatured) return false;
                        if (curationFilter === 'bestsellers' && !b.isBestSeller) return false;
                        if (!curationSearch.trim()) return true;
                        const s = curationSearch.toLowerCase();
                        return (
                          b.title?.toLowerCase().includes(s) ||
                          b.author?.toLowerCase().includes(s) ||
                          b.category?.toLowerCase().includes(s)
                        );
                      })
                      .map((book) => (
                        <tr key={book._id} className="hover:bg-[#FAF6EF]/40 transition">
                          {/* Book Info */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={book.images?.[0] || 'https://via.placeholder.com/50'}
                                alt=""
                                className="w-10 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-black text-stone-900 text-sm truncate max-w-[240px]">
                                  {book.title}
                                </p>
                                <p className="text-stone-500 text-[11px] truncate">
                                  {book.author}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-bold text-[#E07A5F] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                                    {book.category}
                                  </span>
                                  <span className="text-[11px] font-black text-[#795238]">
                                    Rs. {book.sellingPrice}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Featured Controls */}
                          <td className="py-3 px-4">
                            <div className="space-y-2">
                              <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(book.isFeatured)}
                                  onChange={(e) =>
                                    handleCurationFieldChange(book._id, 'isFeatured', e.target.checked)
                                  }
                                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                                />
                                <span className="font-bold text-stone-800 flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                                  <span>Featured</span>
                                </span>
                              </label>

                              {book.isFeatured && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] text-stone-500">Rank:</span>
                                  <input
                                    type="number"
                                    min="1"
                                    value={book.featuredOrder ?? 1}
                                    onChange={(e) =>
                                      handleCurationFieldChange(
                                        book._id,
                                        'featuredOrder',
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-xs font-black text-amber-700 bg-amber-50/70 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                                    title="Lower numbers appear first (e.g. 1, 2, 3)"
                                  />
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Best Seller Controls */}
                          <td className="py-3 px-4">
                            <div className="space-y-2">
                              <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(book.isBestSeller)}
                                  onChange={(e) =>
                                    handleCurationFieldChange(book._id, 'isBestSeller', e.target.checked)
                                  }
                                  className="w-4 h-4 rounded text-[#E07A5F] focus:ring-[#E07A5F] cursor-pointer"
                                />
                                <span className="font-bold text-stone-800 flex items-center gap-1">
                                  <Flame className="w-3.5 h-3.5 text-[#E07A5F] fill-[#E07A5F]" />
                                  <span>Best Seller</span>
                                </span>
                              </label>

                              {book.isBestSeller && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] text-stone-500">Rank:</span>
                                  <input
                                    type="number"
                                    min="1"
                                    value={book.bestSellerOrder ?? 1}
                                    onChange={(e) =>
                                      handleCurationFieldChange(
                                        book._id,
                                        'bestSellerOrder',
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-xs font-black text-[#E07A5F] bg-rose-50/70 border border-rose-200 rounded-lg focus:outline-none focus:border-[#E07A5F]"
                                    title="Lower numbers appear first (e.g. 1, 2, 3)"
                                  />
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Row Actions */}
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateCuration(book._id, {
                                  isFeatured: Boolean(book.isFeatured),
                                  featuredOrder: Number(book.featuredOrder || 1),
                                  isBestSeller: Boolean(book.isBestSeller),
                                  bestSellerOrder: Number(book.bestSellerOrder || 1),
                                })
                              }
                              disabled={savingCurationId === book._id}
                              className="px-3 py-1.5 rounded-xl bg-[#795238] hover:bg-[#633f27] text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-50"
                            >
                              <Save
                                className={`w-3.5 h-3.5 ${
                                  savingCurationId === book._id ? 'animate-spin' : ''
                                }`}
                              />
                              <span>
                                {savingCurationId === book._id ? 'Saving...' : 'Save Curation'}
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ================= STAFF & MULTI-ADMIN RBAC ================= */}
        {activeTab === 'staff' && (
          <section className="space-y-6">
            {!isSuperAdmin ? (
              <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 flex items-start gap-4">
                <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-black text-amber-900">
                    Super Admin Restricted Area
                  </h3>
                  <p className="text-xs text-amber-700 mt-1">
                    Only the platform Super Administrator has permission to view staff accounts, create new administrators, and configure granular permission checkboxes.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Super Admin Info Card */}
                <div className="bg-white rounded-3xl border border-[#795238]/15 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-600" />
                      <h3 className="text-base font-black text-[#795238]">
                        Administrator Staff & Permissions
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Super Admin Panel
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 max-w-2xl">
                      Create sub-administrators and grant them precise access using the permission checkboxes below. Sub-admins will only see and interact with the dashboard sections you tick for them.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNewStaffModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#795238] hover:bg-[#633f27] text-white text-xs font-bold flex items-center gap-2 transition shadow-md cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create New Admin</span>
                  </button>
                </div>

                {/* Staff Table */}
                <div className="bg-white rounded-3xl border border-[#795238]/15 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="border-b border-[#795238]/10 bg-[#FAF6EF]/70 text-[11px] font-black uppercase tracking-wider text-stone-600">
                          <th className="py-3.5 px-4">Staff Member</th>
                          <th className="py-3.5 px-4">Role</th>
                          <th className="py-3.5 px-4">Assigned Permissions (Tick to alter)</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#795238]/10 text-xs">
                        {loadingStaff ? (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-stone-400">
                              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#795238]" />
                              Loading administrator staff...
                            </td>
                          </tr>
                        ) : staffList.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-stone-400">
                              No staff accounts found.
                            </td>
                          </tr>
                        ) : (
                          staffList.map((staff) => {
                            const isStaffSuper =
                              staff.role === 'superadmin' ||
                              staff.email === 'admin@smartkitab.com';
                            return (
                              <tr key={staff._id} className="hover:bg-[#FAF6EF]/40 transition">
                                {/* Name & Email */}
                                <td className="py-3.5 px-4">
                                  <div>
                                    <p className="font-black text-stone-900 text-sm">
                                      {staff.name}
                                    </p>
                                    <p className="text-xs text-stone-500 font-mono">
                                      {staff.email}
                                    </p>
                                    <span className="text-[10px] text-stone-400">
                                      Added {new Date(staff.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </td>

                                {/* Role Badge */}
                                <td className="py-3.5 px-4">
                                  {isStaffSuper ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
                                      <Crown className="w-3.5 h-3.5" />
                                      <span>Super Admin</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FAF6EF] text-[#795238] border border-[#795238]/20">
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      <span>Admin Staff</span>
                                    </span>
                                  )}
                                </td>

                                {/* Permissions Checkboxes */}
                                <td className="py-3.5 px-4">
                                  {isStaffSuper ? (
                                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                      Full Platform Access (Unrestricted)
                                    </span>
                                  ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                      {[
                                        { key: 'canManageBooks', label: '📚 Books' },
                                        { key: 'canManageOrders', label: '📦 Orders' },
                                        { key: 'canManageCMS', label: '🎨 CMS' },
                                        { key: 'canManageCurations', label: '⭐ Curations' },
                                        { key: 'canManageUsers', label: '👥 Users' },
                                      ].map((p) => {
                                        const isChecked = Boolean(
                                          staff.permissions?.[p.key]
                                        );
                                        return (
                                          <label
                                            key={p.key}
                                            className="inline-flex items-center gap-1.5 cursor-pointer bg-white px-2 py-1 rounded-lg border border-stone-200 hover:border-[#795238]/30 transition"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={isChecked}
                                              onChange={() =>
                                                handleToggleStaffPermission(
                                                  staff._id,
                                                  p.key,
                                                  isChecked
                                                )
                                              }
                                              className="w-3.5 h-3.5 rounded text-[#795238] focus:ring-[#795238] cursor-pointer"
                                            />
                                            <span
                                              className={`text-[11px] font-bold ${
                                                isChecked
                                                  ? 'text-stone-900'
                                                  : 'text-stone-400'
                                              }`}
                                            >
                                              {p.label}
                                            </span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 px-4 text-right">
                                  {isStaffSuper ? (
                                    <span className="text-[11px] font-bold text-stone-400">
                                      Protected Account
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteStaff(staff._id, staff.name)
                                      }
                                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer hover:border-rose-300"
                                      title="Revoke admin access"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Revoke Access</span>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

      </main>

      {/* ================= INSPECT DETAILS & PRICE MANAGER MODAL ================= */}
      {inspectingBook && (() => {
        const sellerAsking = inspectingBook.sellerAskingPrice || inspectingBook.sellingPrice || 0;
        const currentSelling = Number(inspectPrice);
        const margin = currentSelling - Number(sellerAsking);
        const markupPercent = sellerAsking > 0 ? Math.round((margin / sellerAsking) * 100) : 0;
        const buyerDiscount = Number(inspectOriginalPrice) > 0 ? Math.round(((Number(inspectOriginalPrice) - currentSelling) / Number(inspectOriginalPrice)) * 100) : 0;
        const isPending = inspectingBook.status === 'pending';

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-[#795238]/20 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setInspectingBook(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#365314] bg-emerald-50 px-3 py-1 rounded-full w-fit">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isPending ? 'Listing Quality & Price Verification' : 'Edit Book Price & Details'}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isPending ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-[#365314]'
                }`}>
                  Status: {inspectingBook.status || 'Pending'}
                </span>
              </div>

              {/* Book Header Summary */}
              <div className="flex gap-4 sm:gap-5 items-start">
                <img
                  src={inspectingBook.images?.[0] || 'https://via.placeholder.com/140'}
                  alt={inspectingBook.title}
                  className="w-24 sm:w-28 h-32 sm:h-36 object-cover rounded-2xl border border-[#795238]/20 shrink-0 shadow-sm"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E07A5F]">
                    {inspectingBook.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 leading-snug">
                    {inspectingBook.title}
                  </h3>
                  <p className="text-xs text-stone-600">
                    Author: <strong className="text-stone-900">{inspectingBook.author}</strong>
                  </p>
                  <p className="text-xs text-stone-500">
                    Condition: <strong className="text-stone-800">{inspectingBook.condition}</strong>
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Seller: <strong className="text-stone-800">{inspectingBook.sellerId?.name || 'Seller'}</strong> ({inspectingBook.sellerId?.address?.city || 'Kathmandu'})
                  </p>
                </div>
              </div>

              {/* ================= PRICE & ADMIN PROFIT CONTROLLER ================= */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6EF] border-2 border-[#795238]/20 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#795238] uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#795238]" />
                    <span>Price & Admin Profit Setting</span>
                  </span>
                  <span className="text-[10px] font-bold text-stone-600 bg-white px-2.5 py-0.5 rounded-full border border-[#795238]/20">
                    Seller Payout: <strong>Rs. {sellerAsking}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Storefront Selling Price Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Storefront Selling Price (Buyer Pays) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={inspectPrice}
                        onChange={(e) => setInspectPrice(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 text-base font-black text-[#795238] bg-white border-2 border-[#795238]/40 rounded-xl focus:outline-none focus:border-[#795238]"
                      />
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1">
                      Seller asked for: <strong>Rs. {sellerAsking}</strong>
                    </p>
                  </div>

                  {/* Original Book MRP Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Original Book MRP (Rs.)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={inspectOriginalPrice}
                        onChange={(e) => setInspectOriginalPrice(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 text-sm font-bold text-stone-800 bg-white border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                      />
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1">
                      Buyer discount: <strong>{buyerDiscount > 0 ? `${buyerDiscount}% OFF` : '0% OFF'}</strong> vs MRP
                    </p>
                  </div>
                </div>

                {/* Profit & Margin Calculation Breakdown Card */}
                <div className="p-3 rounded-xl bg-white border border-[#795238]/15 flex items-center justify-between flex-wrap gap-2 text-xs shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                      margin > 0
                        ? 'bg-emerald-100 text-[#365314]'
                        : margin === 0
                        ? 'bg-stone-100 text-stone-600'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-black text-stone-900">
                        {margin > 0
                          ? `Admin Profit / Margin: +Rs. ${margin}`
                          : margin === 0
                          ? 'Direct Price (0% Admin Markup)'
                          : `Selling below seller asking price (-Rs. ${Math.abs(margin)})`}
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {margin > 0
                          ? `${markupPercent}% markup retained by platform`
                          : 'Customer pays exact seller submitted price'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    margin > 0
                      ? 'bg-emerald-100 text-[#365314] border border-emerald-300'
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {margin > 0 ? 'Profitable' : 'Direct'}
                  </span>
                </div>
              </div>

              {/* Quality & Listing Checklist */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5 text-stone-600">
                <div className="flex justify-between">
                  <span>Seller Contact:</span>
                  <span className="font-bold text-stone-900">{inspectingBook.sellerId?.email || 'N/A'} (Phone: {inspectingBook.sellerId?.address?.phone || 'N/A'})</span>
                </div>
                <div className="flex justify-between">
                  <span>Listing Type:</span>
                  <span className="font-bold text-[#E07A5F] uppercase">{inspectingBook.type || 'sale'}</span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {isPending ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(inspectingBook._id, 'rejected')}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(inspectingBook._id, 'approved', {
                          sellingPrice: Number(inspectPrice),
                          originalPrice: Number(inspectOriginalPrice),
                        })
                      }
                      className="px-6 py-2.5 rounded-xl bg-[#365314] hover:bg-[#283e0e] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Set Price (Rs. {inspectPrice})</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setInspectingBook(null)}
                      className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSaveBookPrice(
                          inspectingBook._id,
                          Number(inspectPrice),
                          Number(inspectOriginalPrice)
                        )
                      }
                      className="px-6 py-2.5 rounded-xl bg-[#795238] hover:bg-[#603f29] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Updated Price (Rs. {inspectPrice})</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================= CREATE NEW STAFF ADMIN MODAL ================= */}
      {newStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#795238]/20 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setNewStaffModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#795238] bg-[#FAF6EF] px-3 py-1 rounded-full w-fit">
              <Crown className="w-4 h-4 text-amber-600" />
              <span>Super Admin Management</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-stone-900">
                Create New Administrator
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Set up an administrator account and configure which features they are authorized to manage.
              </p>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStaffData.name}
                  onChange={(e) =>
                    setNewStaffData({ ...newStaffData, name: e.target.value })
                  }
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-3 py-2 text-sm bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newStaffData.email}
                  onChange={(e) =>
                    setNewStaffData({ ...newStaffData, email: e.target.value })
                  }
                  placeholder="e.g. ramesh@smartkitab.com"
                  className="w-full px-3 py-2 text-sm bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newStaffData.password}
                  onChange={(e) =>
                    setNewStaffData({ ...newStaffData, password: e.target.value })
                  }
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 text-sm bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Administrative Level
                </label>
                <select
                  value={newStaffData.role}
                  onChange={(e) =>
                    setNewStaffData({ ...newStaffData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                >
                  <option value="admin">Admin Staff (Granular Checkbox Permissions)</option>
                  <option value="superadmin">Super Admin (Full Unrestricted Access)</option>
                </select>
              </div>

              {/* Permission Checkboxes */}
              {newStaffData.role === 'admin' && (
                <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#795238]/15 space-y-3">
                  <span className="block text-xs font-black text-[#795238] uppercase tracking-wider">
                    Staff Permission Checkboxes
                  </span>
                  <p className="text-[11px] text-stone-600">
                    Tick the areas of the platform this administrator is allowed to manage:
                  </p>

                  <div className="space-y-2 pt-1">
                    {[
                      {
                        key: 'canManageBooks',
                        title: '📚 Manage Books & Approvals',
                        desc: 'Approve or reject seller listings, inspect details, browse catalog.',
                      },
                      {
                        key: 'canManageOrders',
                        title: '📦 Manage Orders & Fulfillment',
                        desc: 'Update shipping status (processing, shipped, delivered) and view sales.',
                      },
                      {
                        key: 'canManageCMS',
                        title: '🎨 Manage CMS & Section Toggles',
                        desc: 'Edit impact numbers, hero banners, section visibility, and categories.',
                      },
                      {
                        key: 'canManageCurations',
                        title: '⭐ Manage Curations & Book Ranking',
                        desc: 'Select Featured & Best Seller books and configure display ranks.',
                      },
                      {
                        key: 'canManageUsers',
                        title: '👥 View Registered Users',
                        desc: 'Access user lists, buyer details, and platform statistics.',
                      },
                    ].map((p) => (
                      <label
                        key={p.key}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#795238]/40 transition cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(newStaffData.permissions[p.key])}
                          onChange={(e) =>
                            setNewStaffData({
                              ...newStaffData,
                              permissions: {
                                ...newStaffData.permissions,
                                [p.key]: e.target.checked,
                              },
                            })
                          }
                          className="mt-0.5 w-4 h-4 rounded text-[#795238] focus:ring-[#795238] cursor-pointer"
                        />
                        <div>
                          <p className="text-xs font-bold text-stone-900">{p.title}</p>
                          <p className="text-[11px] text-stone-500">{p.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#795238] hover:bg-[#633f27] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-md"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Admin Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD NEW CATEGORY MODAL ================= */}
      {newCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#795238]/20 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <button
              onClick={() => setNewCatModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#795238] bg-[#FAF6EF] px-3 py-1 rounded-full w-fit">
              <Tag className="w-4 h-4 text-[#795238]" />
              <span>Category Manager</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-stone-900">
                Add New Book Category
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                This category will instantly be available in the homepage circular grid, catalog filters, and sell submission.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCategory();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science & IT"
                  value={newCatData.name}
                  onChange={(e) =>
                    setNewCatData({ ...newCatData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Programming, AI & Systems"
                  value={newCatData.description}
                  onChange={(e) =>
                    setNewCatData({ ...newCatData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Select Display Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'BookOpen', label: 'Book' },
                    { name: 'Bookmark', label: 'Bookmark' },
                    { name: 'Compass', label: 'Compass' },
                    { name: 'Stethoscope', label: 'Medical' },
                    { name: 'GraduationCap', label: 'Cap' },
                    { name: 'School', label: 'School' },
                    { name: 'Library', label: 'Library' },
                    { name: 'Layers', label: 'Layers' },
                    { name: 'Languages', label: 'Language' },
                    { name: 'Sparkles', label: 'Sparkles' },
                    { name: 'Flame', label: 'Flame' },
                    { name: 'Globe', label: 'Globe' },
                  ].map((ic) => {
                    const IconC = ICON_MAP[ic.name] || BookOpen;
                    const isSelected = newCatData.icon === ic.name;
                    return (
                      <button
                        key={ic.name}
                        type="button"
                        onClick={() =>
                          setNewCatData({ ...newCatData, icon: ic.name })
                        }
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#795238] text-white border-[#795238] shadow-xs'
                            : 'bg-[#FAF6EF]/40 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <IconC className="w-5 h-5" />
                        <span className="text-[10px] font-bold truncate w-full">
                          {ic.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#795238] hover:bg-[#633f27] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD NEW METRIC MODAL ================= */}
      {newMetricModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#795238]/20 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <button
              onClick={() => setNewMetricModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#795238] bg-[#FAF6EF] px-3 py-1 rounded-full w-fit">
              <TrendingUp className="w-4 h-4 text-[#795238]" />
              <span>Impact Metrics Manager</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-stone-900">
                Add New Impact Metric Card
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                This statistic card will instantly appear on the homepage impact statistics bar.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddMetric();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Displayed Number / Value *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 25,000+ or Rs. 20 Lakhs+"
                  value={newMetricData.value}
                  onChange={(e) =>
                    setNewMetricData({ ...newMetricData, value: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Metric Title / Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Books Recycled or Happy Students"
                  value={newMetricData.label}
                  onChange={(e) =>
                    setNewMetricData({ ...newMetricData, label: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Subtext / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Across universities and colleges"
                  value={newMetricData.subtext}
                  onChange={(e) =>
                    setNewMetricData({ ...newMetricData, subtext: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-[#FAF6EF]/50 border border-[#795238]/20 rounded-xl focus:outline-none focus:border-[#795238]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Select Display Icon
                </label>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 border border-stone-200 rounded-xl bg-stone-50/50">
                  {[
                    { name: 'BookOpen', label: 'Books' },
                    { name: 'Users', label: 'Users' },
                    { name: 'Recycle', label: 'Recycle' },
                    { name: 'Heart', label: 'Heart' },
                    { name: 'Award', label: 'Award' },
                    { name: 'Trophy', label: 'Trophy' },
                    { name: 'Sparkles', label: 'Sparkles' },
                    { name: 'Shield', label: 'Shield' },
                    { name: 'TrendingUp', label: 'Trending' },
                    { name: 'DollarSign', label: 'Savings' },
                    { name: 'Compass', label: 'Hubs' },
                    { name: 'GraduationCap', label: 'Cap' },
                    { name: 'School', label: 'School' },
                    { name: 'Library', label: 'Library' },
                    { name: 'CheckCircle', label: 'Verified' },
                  ].map((ic) => {
                    const IconC = ICON_MAP[ic.name] || BookOpen;
                    const isSelected = newMetricData.icon === ic.name;
                    return (
                      <button
                        key={ic.name}
                        type="button"
                        onClick={() =>
                          setNewMetricData({ ...newMetricData, icon: ic.name })
                        }
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#795238] text-white border-[#795238] shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <IconC className="w-5 h-5" />
                        <span className="text-[10px] font-bold truncate w-full">
                          {ic.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewMetricModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#795238] hover:bg-[#633f27] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Metric Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


