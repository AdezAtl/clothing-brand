import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  MessageSquare,
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Check,
  X,
  MapPin,
  Phone,
  RefreshCw,
  Lock,
  LogOut,
  Database
} from 'lucide-react';
import { StoreManager } from '../services/storeManager';
import { formatNaira } from '../utils/formatters';

export default function AdminDashboard({ onBackToStore, onSignOut }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'items' | 'orders' | 'messages'
  const [products, setProducts] = useState(() => StoreManager.getProducts());
  const [orders, setOrders] = useState(() => StoreManager.getOrders());
  const [messages, setMessages] = useState(() => StoreManager.getMessages());

  // Modal for Add / Edit item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dresses',
    price: '',
    stock: 1,
    sizes: 'S, M, L',
    fabric: 'Linen / Cotton Weave',
    tagline: 'Tailored for everyday Ibadan style'
  });

  const refreshData = () => {
    setProducts(StoreManager.getProducts());
    setOrders(StoreManager.getOrders());
    setMessages(StoreManager.getMessages());
  };

  useEffect(() => {
    const handleUpdate = () => refreshData();
    window.addEventListener('lolashub_products_updated', handleUpdate);
    window.addEventListener('lolashub_orders_updated', handleUpdate);
    window.addEventListener('lolashub_messages_updated', handleUpdate);
    return () => {
      window.removeEventListener('lolashub_products_updated', handleUpdate);
      window.removeEventListener('lolashub_orders_updated', handleUpdate);
      window.removeEventListener('lolashub_messages_updated', handleUpdate);
    };
  }, []);

  // Stats
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const pendingOrdersCount = orders.filter((o) => o.status !== 'Shipped').length;
  const unreadMessagesCount = messages.filter((m) => m.unread).length;

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Dresses',
      price: '',
      stock: 5,
      sizes: 'S, M, L',
      fabric: 'Breathable Cotton / Viscose',
      tagline: 'Fresh cut ready-to-wear piece'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
      sizes: item.sizes.join(', '),
      fabric: item.fabric,
      tagline: item.tagline
    });
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Delete this piece from the catalog?')) {
      StoreManager.deleteProduct(id);
      refreshData();
    }
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    const sizesArray = formData.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      sizes: sizesArray.length ? sizesArray : ['M'],
      fabric: formData.fabric.trim(),
      tagline: formData.tagline.trim()
    };

    if (editingItem) {
      StoreManager.updateProduct(editingItem.id, payload);
    } else {
      StoreManager.createProduct(payload);
    }

    setIsModalOpen(false);
    refreshData();
  };

  const handleStatusChange = (orderId, newStatus) => {
    StoreManager.updateOrderStatus(orderId, newStatus);
    refreshData();
  };

  const handleMarkMessageRead = (msgId) => {
    StoreManager.markMessageRead(msgId);
    refreshData();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-linen)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Navigation Header */}
      <header
        style={{
          background: 'var(--color-evergreen)',
          color: '#FFFFFF',
          padding: '12px var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={onBackToStore}
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'transparent' }}
          >
            <ArrowLeft size={14} />
            <span>Back to Storefront</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600 }}>
              Lola's Hub
            </span>
            <span className="badge badge-terracotta" style={{ fontSize: '0.68rem' }}>
              Challenge Backoffice
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Storage & Database Mode Indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: StoreManager.isSupabaseActive() ? 'rgba(74, 222, 128, 0.15)' : 'rgba(251, 191, 36, 0.15)',
              border: `1px solid ${StoreManager.isSupabaseActive() ? 'rgba(74, 222, 128, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`,
              fontSize: '0.75rem',
              color: '#FFFFFF'
            }}
            title={StoreManager.isSupabaseActive() ? 'Connected to Supabase PostgreSQL' : 'Local Storage Cache Mode'}
          >
            <Database size={12} color={StoreManager.isSupabaseActive() ? '#4ADE80' : '#FBBF24'} />
            <span className="mono" style={{ fontSize: '0.72rem' }}>
              {StoreManager.isSupabaseActive() ? 'PostgreSQL Active' : 'Local Mode'}
            </span>
          </div>

          <button
            type="button"
            onClick={refreshData}
            className="btn btn-ghost btn-sm"
            style={{ color: '#FFFFFF' }}
            title="Refresh state"
          >
            <RefreshCw size={14} />
          </button>

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="btn btn-sm"
              style={{
                background: 'rgba(217, 93, 57, 0.25)',
                color: '#FFFFFF',
                border: '1px solid rgba(217, 93, 57, 0.4)',
                fontSize: '0.78rem',
                gap: '6px'
              }}
              title="End active session and lock admin backoffice"
            >
              <LogOut size={13} />
              <span>Lock Admin</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="container" style={{ flexGrow: 1, padding: 'var(--space-8) var(--space-6)' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '24px', overflowX: 'auto' }}>
          <button
            type="button"
            className={`category-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <BarChart3 size={15} />
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            className={`category-tab ${activeTab === 'items' ? 'active' : ''}`}
            onClick={() => setActiveTab('items')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Package size={15} />
            <span>Pieces & Stock ({products.length})</span>
          </button>
          <button
            type="button"
            className={`category-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ShoppingBag size={15} />
            <span>Customer Orders ({pendingOrdersCount} to fulfill)</span>
          </button>
          <button
            type="button"
            className={`category-tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <MessageSquare size={15} />
            <span>Fitting Inquiries ({unreadMessagesCount} unread)</span>
          </button>
        </div>

        {/* ================= PANEL: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Boutique Overview</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-ink-muted)' }}>
                Live inventory tracking and delivery status for the Challenge boutique.
              </p>
            </div>

            {/* Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px' }}>
                <div className="mono" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-evergreen)' }}>
                  {products.length}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
                  Total In-Stock Styles
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px' }}>
                <div className="mono" style={{ fontSize: '2rem', fontWeight: 600, color: lowStockCount > 0 ? 'var(--color-terracotta)' : 'var(--color-ink)' }}>
                  {lowStockCount}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
                  Low Stock Pieces (≤ 5 left)
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px' }}>
                <div className="mono" style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-evergreen)' }}>
                  {pendingOrdersCount}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
                  Orders to Dispatch
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '20px' }}>
                <div className="mono" style={{ fontSize: '2rem', fontWeight: 600, color: unreadMessagesCount > 0 ? 'var(--color-terracotta)' : 'var(--color-ink)' }}>
                  {unreadMessagesCount}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)', marginTop: '4px' }}>
                  Unread Sizing Questions
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Recent Customer Orders</h3>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveTab('orders')}
                >
                  View All Orders
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="measurement-table" style={{ marginTop: 0 }}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Destination</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 4).map((o) => (
                      <tr key={o.id}>
                        <td className="mono" style={{ fontWeight: 600 }}>{o.id}</td>
                        <td>
                          <strong>{o.customer}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>{o.phone}</div>
                        </td>
                        <td style={{ fontSize: '0.82rem' }}>{o.address}</td>
                        <td className="mono" style={{ fontWeight: 600 }}>{formatNaira(o.total)}</td>
                        <td>
                          <span className={`badge ${o.status === 'Shipped' ? 'badge-evergreen' : 'badge-terracotta'}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= PANEL: ITEMS ================= */}
        {activeTab === 'items' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Garment Catalog</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
                  Manage pieces shown on the public store, update inventory counts, and adjust prices.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleOpenAddModal}
              >
                <Plus size={14} />
                <span>Add New Garment</span>
              </button>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="measurement-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Style Name</th>
                      <th>Category</th>
                      <th>Retail Price</th>
                      <th>Stock Units</th>
                      <th>Available Sizes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>{p.fabric}</div>
                        </td>
                        <td>
                          <span className="badge">{p.category}</span>
                        </td>
                        <td className="mono" style={{ fontWeight: 600, color: 'var(--color-evergreen)' }}>
                          {formatNaira(p.price)}
                        </td>
                        <td>
                          <span className={`badge ${p.stock === 0 ? '' : p.stock <= 5 ? 'badge-terracotta' : 'badge-evergreen'}`}>
                            {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                          </span>
                        </td>
                        <td className="mono" style={{ fontSize: '0.8rem' }}>
                          {p.sizes.join(', ')}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              onClick={() => handleOpenEditModal(p)}
                            >
                              <Edit2 size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#B65328' }}
                              onClick={() => handleDeleteItem(p.id)}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= PANEL: ORDERS ================= */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Customer Orders</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
                Orders placed through the store checkout and WhatsApp dispatches.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="measurement-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Delivery Destination</th>
                      <th>Ordered Items</th>
                      <th>Total & Method</th>
                      <th>Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="mono" style={{ fontWeight: 600 }}>{o.id}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{o.customer}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>{o.phone}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)' }}>{o.date}</div>
                        </td>
                        <td style={{ fontSize: '0.82rem', maxWidth: '220px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                            <MapPin size={12} style={{ flexShrink: 0, marginTop: '3px' }} />
                            <span>{o.address}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.82rem' }}>
                          {o.items ? (
                            o.items.map((it, idx) => (
                              <div key={idx}>
                                {it.name} ({it.size}) × {it.quantity}
                              </div>
                            ))
                          ) : (
                            <span>1 piece</span>
                          )}
                        </td>
                        <td>
                          <div className="mono" style={{ fontWeight: 600, color: 'var(--color-evergreen)' }}>
                            {formatNaira(o.total)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>
                            {o.paymentMethod || 'Bank Transfer'}
                          </div>
                        </td>
                        <td>
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid var(--color-border)',
                              fontFamily: 'inherit',
                              fontSize: '0.8rem',
                              background: o.status === 'Shipped' ? '#E8EFEA' : '#FAF1EC',
                              color: o.status === 'Shipped' ? 'var(--color-evergreen)' : 'var(--color-terracotta)',
                              fontWeight: 500
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= PANEL: MESSAGES ================= */}
        {activeTab === 'messages' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Fitting Inquiries & Questions</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
                Questions from shoppers asking about Challenge stock, sizing, and colors.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: m.unread ? '#FAF1EC' : '#FFFFFF',
                    border: `1px solid ${m.unread ? '#F0D4C5' : 'var(--color-border)'}`,
                    borderRadius: '8px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong>{m.from}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>{m.phone}</span>
                      <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-ink-faint)' }}>• {m.time}</span>
                      {m.unread && <span className="badge badge-terracotta" style={{ fontSize: '0.65rem' }}>Unread</span>}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-ink)', lineHeight: 1.5 }}>
                      "{m.preview}"
                    </p>
                    {m.garment && (
                      <div style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--color-ink-muted)' }}>
                        Garment inquired: <strong style={{ color: 'var(--color-ink)' }}>{m.garment}</strong>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <a
                      href={`https://wa.me/${m.phone?.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-sm"
                    >
                      <MessageSquare size={13} />
                      <span>Reply on WhatsApp</span>
                    </a>
                    {m.unread && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleMarkMessageRead(m.id)}
                      >
                        <Check size={13} />
                        <span>Mark Read</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT ITEM ================= */}
      {isModalOpen && (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <div className="modal-box">
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                {editingItem ? 'Edit Garment Piece' : 'Add New Ready-to-Wear Piece'}
              </h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveItem}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '4px' }}>
                    Style Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ankara Wrap Dress"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border-dark)', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '4px' }}>
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border-dark)', fontFamily: 'inherit' }}
                    >
                      <option value="Dresses">Dresses</option>
                      <option value="Two-Piece">Two-Piece</option>
                      <option value="Workwear">Workwear</option>
                      <option value="Trousers">Trousers</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '4px' }}>
                      Stock Units in Challenge
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border-dark)', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '4px' }}>
                      Retail Price (₦) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="18500"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border-dark)', fontFamily: 'inherit' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '4px' }}>
                      Sizes (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      placeholder="S, M, L, XL"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border-dark)', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '4px' }}>
                    Fabric / Composition
                  </label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. 100% Cotton Ankara Wax"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border-dark)', fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, marginBottom: '4px' }}>
                    Short Tagline / Cut Note
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Flattering crossover front with tie belt"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border-dark)', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                  >
                    {editingItem ? 'Save Changes' : 'Publish to Store'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
