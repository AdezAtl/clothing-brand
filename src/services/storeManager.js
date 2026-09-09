/**
 * Unified data & persistence service for Lola's Hub Store & Boutique Admin
 * Supports hybrid synchronization: PostgreSQL via Supabase + local caching fallback
 */
import { PRODUCTS } from '../data/products';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const PRODUCTS_KEY = 'lolashub_products_v2';
const ORDERS_KEY = 'lolashub_orders_v2';
const MESSAGES_KEY = 'lolashub_messages_v2';

const INITIAL_ORDERS = [
  {
    id: 'LH-8492',
    customer: 'Funmilayo Adeleke',
    phone: '0814 233 4991',
    address: '14 Awolowo Ave, Old Bodija, Ibadan',
    items: [
      { name: 'Ankara Wrap Dress', size: 'M', quantity: 1, price: 18500 }
    ],
    total: 20000,
    delivery: 'Same-Day Ibadan Bike Delivery (₦1,500)',
    date: 'Today, 11:20 AM',
    status: 'Pending',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'LH-8301',
    customer: 'Chidinma Okafor',
    phone: '0802 991 4420',
    address: '32 Ring Road, Near Challenge Junction, Ibadan',
    items: [
      { name: 'Emerald Two-Piece Set', size: 'L', quantity: 1, price: 24000 }
    ],
    total: 25500,
    delivery: 'Same-Day Ibadan Bike Delivery (₦1,500)',
    date: 'Yesterday, 3:15 PM',
    status: 'Shipped',
    paymentMethod: 'Card / Paystack'
  },
  {
    id: 'LH-8199',
    customer: 'Toyin Kareem',
    phone: '0818 440 1209',
    address: 'Store Pickup at Challenge Boutique',
    items: [
      { name: 'Straight-Leg Office Trouser', size: '30', quantity: 1, price: 15500 }
    ],
    total: 15500,
    delivery: 'Pickup at Challenge Boutique (Free)',
    date: '2026-09-06',
    status: 'Shipped',
    paymentMethod: 'In-Shop Payment'
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'm1',
    from: 'Toyin K.',
    phone: '0818 440 1209',
    preview: 'Can I stop by Challenge around 5 PM to try on the emerald two-piece in size L?',
    time: '45m ago',
    unread: true,
    garment: 'Emerald Two-Piece Set'
  },
  {
    id: 'm2',
    from: 'Bolanle M.',
    phone: '0703 112 4990',
    preview: 'Do you have the office straight trousers in waist 34 available for same-day bike dispatch to Secretariat?',
    time: '2h ago',
    unread: true,
    garment: 'Straight-Leg Office Trouser'
  },
  {
    id: 'm3',
    from: 'Adaobi N.',
    phone: '0809 332 1088',
    preview: 'The wrap dress fit perfectly for my church dedication yesterday, thank you!',
    time: '1d ago',
    unread: false,
    garment: 'Ankara Wrap Dress'
  }
];

// Track background synchronization state
let hasInitiatedSync = false;

export const StoreManager = {
  /**
   * Status indicator for Supabase vs Local Storage
   */
  isSupabaseActive() {
    return isSupabaseConfigured() && Boolean(supabase);
  },

  // -------------------------------------------------------------
  // PRODUCTS
  // -------------------------------------------------------------
  getProducts() {
    // Kick off background sync once if Supabase is active
    if (!hasInitiatedSync && this.isSupabaseActive()) {
      hasInitiatedSync = true;
      this.syncFromSupabase();
    }

    try {
      const raw = localStorage.getItem(PRODUCTS_KEY);
      if (!raw) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(PRODUCTS));
        return PRODUCTS;
      }
      return JSON.parse(raw);
    } catch {
      return PRODUCTS;
    }
  },

  saveProducts(products) {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      window.dispatchEvent(new Event('lolashub_products_updated'));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  },

  async createProduct(itemData) {
    const products = this.getProducts();
    const id = 'p' + (Date.now() % 100000);
    const newProduct = {
      id,
      stock: 1,
      sizes: ['S', 'M', 'L'],
      measurements: {},
      accentColor: '#1E4A2C',
      pattern: itemData.category?.toLowerCase().includes('trouser') ? 'trouser' : 'ankara-wrap',
      ...itemData
    };
    products.unshift(newProduct);
    this.saveProducts(products);

    // Sync to Supabase in background
    if (this.isSupabaseActive()) {
      try {
        await supabase.from('lh_products').insert([{
          id: newProduct.id,
          name: newProduct.name,
          category: newProduct.category,
          price: newProduct.price,
          stock: newProduct.stock,
          sizes: newProduct.sizes,
          fabric: newProduct.fabric,
          tagline: newProduct.tagline,
          accent_color: newProduct.accentColor,
          pattern: newProduct.pattern,
          measurements: newProduct.measurements || {}
        }]);
      } catch (err) {
        console.warn('Failed to insert product to Supabase:', err);
      }
    }

    return newProduct;
  },

  async updateProduct(id, patch) {
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...patch };
    this.saveProducts(products);

    // Sync to Supabase
    if (this.isSupabaseActive()) {
      try {
        const payload = {};
        if (patch.name !== undefined) payload.name = patch.name;
        if (patch.category !== undefined) payload.category = patch.category;
        if (patch.price !== undefined) payload.price = patch.price;
        if (patch.stock !== undefined) payload.stock = patch.stock;
        if (patch.sizes !== undefined) payload.sizes = patch.sizes;
        if (patch.fabric !== undefined) payload.fabric = patch.fabric;
        if (patch.tagline !== undefined) payload.tagline = patch.tagline;
        if (patch.accentColor !== undefined) payload.accent_color = patch.accentColor;
        if (patch.pattern !== undefined) payload.pattern = patch.pattern;

        await supabase.from('lh_products').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Failed to update product in Supabase:', err);
      }
    }

    return products[idx];
  },

  async deleteProduct(id) {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);

    if (this.isSupabaseActive()) {
      try {
        await supabase.from('lh_products').delete().eq('id', id);
      } catch (err) {
        console.warn('Failed to delete product in Supabase:', err);
      }
    }
  },

  // -------------------------------------------------------------
  // ORDERS
  // -------------------------------------------------------------
  getOrders() {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (!raw) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders) {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event('lolashub_orders_updated'));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  },

  async createOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: `LH-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just now',
      status: 'Pending',
      ...orderData
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);

    if (this.isSupabaseActive()) {
      try {
        await supabase.from('lh_orders').insert([{
          id: newOrder.id,
          customer: newOrder.customer,
          phone: newOrder.phone,
          address: newOrder.address,
          items: newOrder.items,
          total: newOrder.total,
          delivery: newOrder.delivery,
          date: newOrder.date,
          status: newOrder.status,
          payment_method: newOrder.paymentMethod
        }]);
      } catch (err) {
        console.warn('Failed to insert order into Supabase:', err);
      }
    }

    return newOrder;
  },

  async updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      this.saveOrders(orders);

      if (this.isSupabaseActive()) {
        try {
          await supabase.from('lh_orders').update({ status }).eq('id', orderId);
        } catch (err) {
          console.warn('Failed to update order status in Supabase:', err);
        }
      }
    }
  },

  // -------------------------------------------------------------
  // MESSAGES
  // -------------------------------------------------------------
  getMessages() {
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      if (!raw) {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
        return INITIAL_MESSAGES;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_MESSAGES;
    }
  },

  async markMessageRead(id) {
    const msgs = this.getMessages();
    const m = msgs.find((x) => x.id === id);
    if (m) {
      m.unread = false;
      try {
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
        window.dispatchEvent(new Event('lolashub_messages_updated'));
      } catch (e) {
        console.error(e);
      }

      if (this.isSupabaseActive()) {
        try {
          await supabase.from('lh_messages').update({ unread: false }).eq('id', id);
        } catch (err) {
          console.warn('Failed to update message in Supabase:', err);
        }
      }
    }
  },

  // -------------------------------------------------------------
  // SUPABASE BACKGROUND SYNC
  // -------------------------------------------------------------
  async syncFromSupabase() {
    if (!this.isSupabaseActive()) return;

    try {
      // 1. Sync Products
      const { data: dbProducts, error: prodErr } = await supabase
        .from('lh_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!prodErr && dbProducts && dbProducts.length > 0) {
        const formatted = dbProducts.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: Number(p.price),
          stock: Number(p.stock),
          sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L'],
          fabric: p.fabric || '',
          tagline: p.tagline || '',
          accentColor: p.accent_color || '#1E4A2C',
          pattern: p.pattern || 'ankara-wrap',
          measurements: p.measurements || {},
          fit: p.fit || '',
          color: p.color || ''
        }));
        this.saveProducts(formatted);
      }

      // 2. Sync Orders
      const { data: dbOrders, error: orderErr } = await supabase
        .from('lh_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!orderErr && dbOrders && dbOrders.length > 0) {
        const formattedOrders = dbOrders.map((o) => ({
          id: o.id,
          customer: o.customer,
          phone: o.phone,
          address: o.address,
          items: o.items,
          total: Number(o.total),
          delivery: o.delivery,
          date: o.date,
          status: o.status,
          paymentMethod: o.payment_method
        }));
        this.saveOrders(formattedOrders);
      }

      // 3. Sync Messages
      const { data: dbMessages, error: msgErr } = await supabase
        .from('lh_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!msgErr && dbMessages && dbMessages.length > 0) {
        const formattedMsgs = dbMessages.map((m) => ({
          id: m.id,
          from: m.sender_name,
          phone: m.phone,
          preview: m.preview,
          garment: m.garment,
          time: m.time_display || 'Recent',
          unread: Boolean(m.unread)
        }));
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(formattedMsgs));
        window.dispatchEvent(new Event('lolashub_messages_updated'));
      }
    } catch (err) {
      console.warn('Supabase sync attempted with notice:', err);
    }
  }
};
