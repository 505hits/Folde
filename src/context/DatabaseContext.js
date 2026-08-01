"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  // ============ AUTH ============
  const [users, setUsers] = useState([
    { email: 'emma@test.com', password: 'test123', name: 'Emma', partnerName: 'Lucas' },
    { email: 'sophie@test.com', password: 'test123', name: 'Sophie', partnerName: 'Marc' }
  ]);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    // 1. Initial local load
    const saved = typeof window !== 'undefined' && localStorage.getItem('currentUser');
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); } catch (e) { }
    }

    // 2. Initial Supabase session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile = {
          email: session.user.email,
          name: session.user.user_metadata?.name || '',
          partnerName: session.user.user_metadata?.partner_name || '',
          supabaseId: session.user.id
        };
        setCurrentUser(profile);
        if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(profile));
      }
    }).catch(err => console.warn('Supabase getSession error:', err));

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
      } else if (_event === 'SIGNED_OUT') {
        setCurrentUser(null);
        if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const register = async (email, password, name, partnerName) => {
    const cleanEmail = email ? email.trim() : '';
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { name, partner_name: partnerName }
        }
      });

      if (error) {
        console.warn('Supabase register error:', error.message);
        let errorMsg = 'An error occurred during registration.';
        if (error.message.includes('User already registered') || error.message.includes('already exists')) {
          errorMsg = 'An account already exists with this email.';
        } else if (error.message.includes('Password should be')) {
          errorMsg = 'Password must be at least 6 characters.';
        } else if (error.message.toLowerCase().includes('rate limit') || error.message.toLowerCase().includes('rate_limit')) {
          const fallbackUser = { email: cleanEmail, password, name, partnerName };
          setCurrentUser(fallbackUser);
          if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
          return { success: true, rateLimited: true };
        } else if (error.message) {
          errorMsg = error.message;
        }
        return { success: false, error: errorMsg };
      }

      if (data?.user) {
        const newUser = {
          email: data.user.email,
          name: name || data.user.user_metadata?.name || '',
          partnerName: partnerName || data.user.user_metadata?.partner_name || '',
          supabaseId: data.user.id
        };
        setCurrentUser(newUser);
        if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(newUser));
        return { success: true };
      }

      return { success: true };
    } catch (err) {
      console.error('Register error:', err);
      const newUser = { email: cleanEmail, password, name, partnerName };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const login = async (email, password) => {
    const cleanEmail = email ? email.trim() : '';
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        console.warn('Supabase login error:', error.message);

        // Fallback check for local mock users
        const localUser = users.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase() && u.password === password);
        if (localUser) {
          setCurrentUser(localUser);
          if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(localUser));
          return { success: true };
        }

        let errorMsg = 'Invalid email or password.';
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = 'Invalid email or password.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg = 'Please confirm your email address before signing in.';
        } else if (error.message) {
          errorMsg = error.message;
        }
        return { success: false, error: errorMsg };
      }

      const profile = {
        email: data.user.email,
        name: data.user.user_metadata?.name || '',
        partnerName: data.user.user_metadata?.partner_name || '',
        supabaseId: data.user.id
      };
      setCurrentUser(profile);
      if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(profile));
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      const localUser = users.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase() && u.password === password);
      if (localUser) {
        setCurrentUser(localUser);
        if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(localUser));
        return { success: true };
      }
      return { success: false, error: 'An error occurred while signing in.' };
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
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      couple: "Emma et Lucas",
      slug: "emma-et-lucas",
      email: "emma@test.com",
      plan: "Premium",
      price: 290,
      status: "Live",
      paid: true,
      date: "2026-07-01",
      theme: "la-finca"
    },
    {
      id: "ORD-002",
      couple: "Sophie et Marc",
      slug: "sophie-et-marc",
      email: "sophie@test.com",
      plan: "Standard",
      price: 49.90,
      status: "Awaiting Details",
      paid: true,
      date: "2026-06-28",
      theme: "royal"
    },
  ]);

  // Fetch orders from Supabase (or fallback to local)
  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchOrders failed:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const mappedOrders = data.map(o => ({
          id: o.id,
          couple: o.couple,
          slug: o.slug,
          email: o.user_email,
          plan: o.plan,
          price: o.price,
          status: o.status,
          paid: o.paid,
          date: o.date,
          theme: o.theme,
          details: o.details || {}
        }));
        setOrders(mappedOrders);

        // Also merge eventInfo from stored order details
        setEventInfo(prev => {
          const merged = { ...prev };
          data.forEach(o => {
            if (o.slug && o.details && Object.keys(o.details).length > 0) {
              merged[o.slug] = { ...(prev[o.slug] || {}), ...o.details };
            }
          });
          return merged;
        });
      }
    } catch (err) {
      console.warn('fetchOrders error:', err);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (userEmail, name, partnerName, theme, plan, price, details = {}) => {
    const baseSlug = `${name.toLowerCase()}-et-${partnerName.toLowerCase()}`.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (orders.find(o => o.slug === slug)) {
      slug = `${baseSlug}-wedding${counter > 1 ? `-${counter}` : ''}`;
      counter++;
    }

    const isStandard = plan === 'Standard' || plan === 'Essential' || plan === 'essential';
    const orderId = `ORD-${String(orders.length + 1).padStart(3, '0')}`;

    const newOrder = {
      id: orderId,
      couple: `${name} et ${partnerName}`,
      slug,
      email: userEmail,
      plan,
      price,
      status: isStandard ? "Live" : "In Creation",
      paid: true,
      date: new Date().toISOString().split('T')[0],
      theme,
      details
    };

    // 1. Save locally immediately
    setOrders(prev => [newOrder, ...prev]);

    // 2. Try to insert into Supabase `orders` table
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_email: userEmail,
          couple: `${name} et ${partnerName}`,
          slug: slug,
          plan: plan,
          price: price,
          status: isStandard ? "Live" : "In Creation",
          paid: true,
          date: new Date().toISOString().split('T')[0],
          theme: theme,
          details: details
        });

      if (error) {
        console.warn('Supabase createOrder failed (saved locally):', error.message);
      }
    } catch (err) {
      console.warn('Supabase createOrder exception:', err);
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    } catch (err) {
      console.warn('updateOrderStatus Supabase error:', err);
    }
  };

  const saveOrderDetails = async (slug, details) => {
    setEventInfo(prev => ({ ...prev, [slug]: { ...(prev[slug] || {}), ...details } }));
    try {
      await supabase.from('orders').update({ details }).eq('slug', slug);
    } catch (err) {
      console.warn('saveOrderDetails Supabase error:', err);
    }
  };

  // ============ GUESTS (Supabase + local fallback) ============
  const [guests, setGuests] = useState({
    "emma-et-lucas": [
      { id: 1, name: 'Alice Dupont', status: 'Attending', meal: 'Beef Wellington', side: 'Bride', hasPlusOne: true, plusOneName: 'Marc Dupont', message: 'Tellement hâte de célébrer avec vous !' },
      { id: 2, name: 'Jean Martin', status: 'Pending', meal: '-', side: 'Groom' },
      { id: 3, name: 'Sophie Bernard', status: 'Attending', meal: 'Saumon', side: 'Bride', hasPlusOne: false, message: 'Félicitations pour ce beau projet !' },
    ]
  });

  // Fetch guests from server API (/api/rsvp) with fallback to Supabase / local
  const fetchGuests = useCallback(async (slug) => {
    if (!slug) return [];
    try {
      const res = await fetch(`/api/rsvp?slug=${encodeURIComponent(slug)}`);
      const result = await res.json();

      if (result.success && Array.isArray(result.guests)) {
        setGuests(prev => ({ ...prev, [slug]: result.guests }));
        return result.guests;
      }
    } catch (err) {
      console.warn('fetchGuests API error:', err);
    }

    // Direct Supabase fallback
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('slug', slug)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped = data.map(g => ({
          id: g.id,
          name: g.name,
          email: g.email || '',
          status: g.status,
          side: g.side || 'Both',
          meal: g.meal || '-',
          hasPlusOne: g.has_plus_one || false,
          plusOneName: g.plus_one_name || '',
          accompaniedStatus: g.accompanied_status || 'alone',
          message: g.message || ''
        }));
        setGuests(prev => ({ ...prev, [slug]: mapped }));
        return mapped;
      }
    } catch (e) { }

    return guests[slug] || [];
  }, []);

  // Add guest: sends to /api/rsvp first
  const addGuest = async (slug, newGuest) => {
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
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
      if (result.success && result.guest) {
        const added = result.guest;
        setGuests(prev => {
          const currentList = prev[slug] || [];
          return { ...prev, [slug]: [added, ...currentList] };
        });
        return { success: true, guest: added };
      }
    } catch (err) {
      console.warn('addGuest API error:', err);
    }

    // Fallback to local update
    const fallbackGuest = { ...newGuest, id: `local_${Date.now()}` };
    setGuests(prev => {
      const currentList = prev[slug] || [];
      return { ...prev, [slug]: [fallbackGuest, ...currentList] };
    });
    return { success: true, source: 'local' };
  };

  // ============ EVENT INFO ============
  const [eventInfo, setEventInfo] = useState({
    "emma-et-lucas": {
      date: '2026-09-15',
      ceremonyVenue: 'Château de Chantilly',
      receptionVenue: 'Château de Chantilly',
      customMessage: 'We are so excited to celebrate with you!'
    }
  });

  // ============ LOCAL STORAGE PERSISTENCE ============
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        try { setOrders(JSON.parse(savedOrders)); } catch (e) { }
      }
      const savedEventInfo = localStorage.getItem('eventInfo');
      if (savedEventInfo) {
        try { setEventInfo(JSON.parse(savedEventInfo)); } catch (e) { }
      }
      setIsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem('orders', JSON.stringify(orders));
      } catch (e) {
        console.warn('LocalStorage quota limit reached for orders:', e);
      }
    }
  }, [orders, isLoaded]);

  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem('eventInfo', JSON.stringify(eventInfo));
      } catch (e) {
        console.warn('LocalStorage quota limit reached for eventInfo:', e);
      }
    }
  }, [eventInfo, isLoaded]);

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
      await fetch(`/api/rsvp?slug=${encodeURIComponent(slug)}&id=${encodeURIComponent(guestId)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('deleteGuest API error:', err);
    }

    setGuests(prev => {
      const currentList = prev[slug] || [];
      return { ...prev, [slug]: currentList.filter(g => String(g.id) !== String(guestId) && g.name !== guestId) };
    });
  };

  return (
    <DatabaseContext.Provider value={{
      // Auth
      currentUser, users, register, login, loginWithGoogle, loginWithMagicLink, logout,
      // Orders
      orders, setOrders, createOrder, updateOrderStatus, saveOrderDetails, fetchOrders,
      // Guests
      guests, addGuest, fetchGuests, deleteGuest,
      // Event Info
      eventInfo, setEventInfo,
      // Revisions
      revisions, addRevision,
      // Status
      isLoaded
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
