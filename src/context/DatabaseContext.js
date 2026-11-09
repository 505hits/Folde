"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { createWeddingWriter } from '@/lib/wedding-writer.mjs';
import { weddingRequest } from "@/lib/wedding-client";
import { supabase } from "@/lib/supabase";

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  // ============ AUTH ============
  const users = [];
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    // Supabase is the sole source of authentication state.
    localStorage.removeItem('currentUser');
    // 3. Listen to active auth state changes (login, logout, OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const profile = {
          email: session.user.email,
          name: session.user.user_metadata?.name || '',
          partnerName: session.user.user_metadata?.partner_name || '',
          supabaseId: session.user.id
        };
        setCurrentUser(profile);
        if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(profile));
      } else {
        setCurrentUser(null);
        if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const register = async (email, password, name, partnerName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email?.trim() || '', password,
        options: { data: { name, partner_name: partnerName } }
      });
      if (error) return { success: false, error: error.message };
      return { success: true, requiresConfirmation: !data.session };
    } catch {
      return { success: false, error: 'Unable to create your account. Please try again.' };
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email?.trim() || '', password });
      if (error || !data.session) return { success: false, error: error?.message || 'Please sign in again.' };
      return { success: true };
    } catch {
      return { success: false, error: 'Unable to sign in. Please try again.' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/dashboard`
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const loginWithMagicLink = async (email) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email ? email.trim() : '',
        options: {
          emailRedirectTo: `${origin}/dashboard`
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut failed:', err);
    }
    setCurrentUser(null);
    if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
  };

  // ============ ORDERS ============
  const [orders, setOrders] = useState([]);
  const [guests, setGuests] = useState({});
  const [eventInfo, setEventInfoState] = useState({});
  const eventInfoRef = useRef({});
  const writerRef = useRef(null);
  if (writerRef.current == null) writerRef.current = createWeddingWriter(weddingRequest);
  const setEventInfo = useCallback(update => {
    const next = typeof update === 'function' ? update(eventInfoRef.current) : update;
    eventInfoRef.current = next;
    setEventInfoState(next);
  }, []);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [databaseError, setDatabaseError] = useState('');
  const [mediaUploads,setMediaUploads] = useState(0);
  const mapOrder = o => ({ ...o, email: o.user_email, createdAt: o.created_at, details: o.details || {} });
  const fetchOrders = useCallback(async () => {
    if (!currentUser?.supabaseId) { setOrders([]); setEventInfo({}); setGuests({}); return; }
    setOrdersLoading(true);
    try {
      const result = await weddingRequest('/api/wedding');
      result.orders.forEach(order => writerRef.current.seed(order.slug,order.details?._draftVersion));
      setOrders(result.orders.map(mapOrder));
      setEventInfo(Object.fromEntries(result.orders.map(o => [o.slug, o.details || {}])));
      setDatabaseError('');
    } catch (err) { setDatabaseError(err.message); }
    finally { setOrdersLoading(false); }
  }, [currentUser?.supabaseId, setEventInfo]);
  React.useEffect(() => { Promise.resolve().then(fetchOrders); }, [fetchOrders]);

  const createOrder = async () => { throw new Error('Orders must be confirmed through checkout.'); };
  const updateOrderStatus = async (orderId, status) => {
    const result = await weddingRequest('/api/admin/orders', { method: 'PATCH', body: JSON.stringify({ orderId, status }) });
    setOrders(prev => prev.map(o => o.id === orderId ? mapOrder(result.order) : o));
  };

  const applySavedOrder = (slug, result, submitted) => {
    setOrders(prev => prev.map(o => o.slug === slug ? mapOrder(result.order) : o));
    // A completed autosave must not replace newer changes made while it ran.
    if (eventInfoRef.current[slug] === submitted) {
      setEventInfo(prev => ({ ...prev, [slug]: result.order.details }));
    }
    setDatabaseError('');
  };
  const saveOrderDetails = async (slug, details) => {
    try {
      const submitted = eventInfoRef.current[slug];
      const result = await writerRef.current.save(slug, details);
      applySavedOrder(slug, result, submitted);
      return true;
    } catch (err) { setDatabaseError(err.message); return false; }
  };
  const publishOrderDetails = async slug => {
    try {
      const submitted = eventInfoRef.current[slug];
      const result = await writerRef.current.publish(slug, submitted);
      applySavedOrder(slug, result, submitted);
      return true;
    } catch (err) { setDatabaseError(err.message); return false; }
  };

  // ============ GUESTS ============
  const fetchGuests = useCallback(async slug => {
    if (!slug) return [];
    try {
      const result = await weddingRequest('/api/rsvp?slug=' + encodeURIComponent(slug));
      setGuests(prev => ({ ...prev, [slug]: result.guests }));
      setDatabaseError('');
      return result.guests;
    } catch (err) { setDatabaseError(err.message); throw err; }
  }, []);

  // Add guest: sends to /api/rsvp first and persists locally
  const addGuest = async (slug, newGuest) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: 'Bearer ' + session.access_token } : {}) },
        body: JSON.stringify({
          slug,
          responseId: newGuest.responseId,
          name: newGuest.name,
          email: newGuest.email,
          status: newGuest.status,
          meal: newGuest.meal,
          hasPlusOne: newGuest.hasPlusOne,
          plusOneName: newGuest.plusOneName,
          accompaniedStatus: newGuest.accompaniedStatus,
          side: newGuest.side,
          message: newGuest.message
        })
      });

      const result = await res.json();
      if (res.ok && result.success && result.guest?.id) {
        const added = result.guest;
        setGuests(prev => {
          const currentList = prev[slug] || [];
          const updated = [added, ...currentList.filter(g => String(g.id) !== String(added.id))];
          return { ...prev, [slug]: updated };
        });
        return { success: true, guest: added };
      }
    } catch (err) {
      console.warn('addGuest API error:', err);
    }

    return { success: false, error: 'Your response could not be saved. Please try again.' };
  };

  const isLoaded = true;
  // Legacy browser drafts may be the only copy of unsynced edits. Preserve them.

  // ============ REVISIONS ============
  const [revisions, setRevisions] = useState({});

  const addRevision = (slug, comment) => {
    const currentList = revisions[slug] || [];
    if (currentList.length >= 2) {
      return { success: false, error: 'Maximum limit of 2 revision rounds reached.' };
    }
    const newRev = {
      number: currentList.length + 1,
      comment,
      date: new Date().toISOString()
    };
    const updated = { ...revisions, [slug]: [...currentList, newRev] };
    setRevisions(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('revisions', JSON.stringify(updated));
    }
    return { success: true, revisionNumber: newRev.number };
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRev = localStorage.getItem('revisions');
      if (savedRev) {
        try { setRevisions(JSON.parse(savedRev)); } catch (e) { }
      }
    }
  }, []);

  // Delete guest: calls /api/rsvp DELETE and updates local state
  const deleteGuest = async (slug, guestId) => {
    try {
      await weddingRequest('/api/rsvp?slug=' + encodeURIComponent(slug) + '&id=' + encodeURIComponent(guestId), { method: 'DELETE' });
      setGuests(prev => ({ ...prev, [slug]: (prev[slug] || []).filter(g => String(g.id) !== String(guestId)) }));
      return { success: true };
    } catch (err) { setDatabaseError(err.message); return { success: false }; }
  };

  return (
    <DatabaseContext.Provider value={{
      // Auth
      currentUser, users, register, login, loginWithGoogle, loginWithMagicLink, logout,
      // Orders
      orders, setOrders, createOrder, updateOrderStatus, saveOrderDetails, publishOrderDetails, fetchOrders, mediaUploads, setMediaUploads,
      // Guests
      guests, addGuest, fetchGuests, deleteGuest,
      // Event Info
      eventInfo, setEventInfo,
      // Revisions
      revisions, addRevision,
      // Status
      isLoaded, ordersLoading, databaseError
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
