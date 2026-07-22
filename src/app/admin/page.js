"use client";

import { useState } from "react";
import Link from "next/link";
import { useDatabase } from "@/context/DatabaseContext";

export default function AdminDashboard() {
  const { orders, updateOrderStatus } = useDatabase();
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f4f5', fontFamily: 'var(--font-body)', color: '#18181b' }}>
      
      {/* Admin Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#18181b', color: '#fff', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '3rem', paddingLeft: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>Admin Portal</h1>
          <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.2rem' }}>FOLDÈ Design</p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
              borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500,
              backgroundColor: activeTab === 'orders' ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: '#fff', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <span>📦</span> Orders
          </button>
          <button
            onClick={() => setActiveTab('sites')}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
              borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500,
              backgroundColor: activeTab === 'sites' ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: '#fff', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <span>🌐</span> Client Sites
          </button>
        </nav>
        
        <div style={{ marginTop: 'auto', paddingLeft: '1rem' }}>
          <Link href="/" style={{ fontSize: '0.9rem', color: '#a1a1aa', textDecoration: 'none', fontWeight: 500 }}>
            ← Back to Main Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '2rem' }}>
            {activeTab === 'orders' ? 'Orders Management' : 'Active Client Sites'}
          </h2>

          {activeTab === 'orders' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#64748b' }}>Order ID</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#64748b' }}>Client / Couple</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#64748b' }}>Package</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#64748b' }}>Price</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#64748b' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 500, fontSize: '0.9rem' }}>{order.id}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{order.couple}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#475569' }}>{order.plan}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>{order.price}$</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.5rem',
                          backgroundColor: order.status === 'Live' ? '#dcfce7' : '#fef9c3',
                          color: order.status === 'Live' ? '#166534' : '#854d0e'
                        }}>
                          {order.status}
                        </span>
                        {order.status !== 'Live' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Live')}
                            style={{ display: 'block', backgroundColor: '#18181b', color: '#fff', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Mark as Live
                          </button>
                        )}
                        {order.status === 'Live' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Awaiting Details')}
                            style={{ display: 'block', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Revert
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'sites' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {orders.map(order => (
                <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{order.couple}</h3>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{order.theme}</span>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Dynamic URL (SEO)</p>
                    <Link href={`/${order.slug}`} target="_blank" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'none', fontWeight: 500, wordBreak: 'break-all' }}>
                      foldedesign.com/{order.slug}
                    </Link>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/${order.slug}`} target="_blank" style={{ flex: 1, textAlign: 'center', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}>
                      Visit Site
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
