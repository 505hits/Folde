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
    const saved = typeof window !== 'undefined' && localStorage.getItem('currentUser');
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const register = async (email, password, name, partnerName) => {
    // Try Supabase Auth first
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, partner_name: partnerName }
        }
      });
      if (error) {
        // Fallback to local if Supabase fails
        console.warn('Supabase register failed, using local:', error.message);
        const exists = users.find(u => u.email === email);
        if (exists) return { success: false, error: 'Un compte existe déjà avec cet email.' };
        const newUser = { email, password, name, partnerName };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(newUser));
        return { success: true };
      }
      const newUser = { email, name, partnerName, supabaseId: data.user?.id };
      setCurrentUser(newUser);
      if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(newUser));
      return { success: true };
    } catch (err) {
      // Fallback to local
      const exists = users.find(u => u.email === email);
      if (exists) return { success: false, error: 'Un compte existe déjà avec cet email.' };
      const newUser = { email, password, name, partnerName };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const login = async (email, password) => {
    // Try Supabase Auth first
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        // Fallback to local auth
        console.warn('Supabase login failed, using local:', error.message);
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) return { success: false, error: 'Email ou mot de passe incorrect.' };
        setCurrentUser(user);
        if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true };
      }
      // Supabase login succeeded
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
      // Fallback to local auth
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) return { success: false, error: 'Email ou mot de passe incorrect.' };
      setCurrentUser(user);
      if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true };
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

  const createOrder = (userEmail, name, partnerName, theme, plan, price) => {
    const baseSlug = `${name.toLowerCase()}-et-${partnerName.toLowerCase()}`.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure slug is unique
    while (orders.find(o => o.slug === slug)) {
      slug = `${baseSlug}-wedding${counter > 1 ? `-${counter}` : ''}`;
      counter++;
    }

    const isStandard = plan === 'Standard' || plan === 'Essential' || plan === 'essential';

    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      couple: `${name} et ${partnerName}`,
      slug,
      email: userEmail,
      plan,
      price,
      status: isStandard ? "Live" : "In Creation",
      paid: true,
      date: new Date().toISOString().split('T')[0],
      theme
    };
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // ============ GUESTS (Supabase + local fallback) ============
  const [guests, setGuests] = useState({
    "emma-et-lucas": [
      { id: 1, name: 'Alice Dupont', status: 'Attending', meal: 'Beef Wellington', side: 'Bride', hasPlusOne: true, plusOneName: 'Marc Dupont', message: 'Tellement hâte de célébrer avec vous !' },
      { id: 2, name: 'Jean Martin', status: 'Pending', meal: '-', side: 'Groom' },
      { id: 3, name: 'Sophie Bernard', status: 'Attending', meal: 'Saumon', side: 'Bride', hasPlusOne: false, message: 'Félicitations pour ce beau projet !' },
    ]
  });

  // Fetch guests from Supabase for a given slug
  const fetchGuests = useCallback(async (slug) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('slug', slug)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchGuests failed:', error.message);
        return guests[slug] || [];
      }

      // Map Supabase format to app format
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

      // Update local state too
      setGuests(prev => ({ ...prev, [slug]: mapped }));
      return mapped;
    } catch (err) {
      console.warn('fetchGuests error:', err);
      return guests[slug] || [];
    }
  }, [guests]);

  // Add guest: writes to Supabase first, falls back to local
  const addGuest = async (slug, newGuest) => {
    // First, we need the invitation_id for this slug
    try {
      // Try to find the invitation by slug
      const { data: invitation, error: invError } = await supabase
        .from('invitations')
        .select('id')
        .eq('slug', slug)
        .single();

      const invitationId = invitation?.id || null;

      const { data, error } = await supabase
        .from('guests')
        .insert({
          invitation_id: invitationId,
          slug: slug,
          name: newGuest.name,
          email: newGuest.email || null,
          status: newGuest.status === 'yes' ? 'Attending' : newGuest.status === 'no' ? 'Declined' : newGuest.status || 'Pending',
          side: newGuest.side || 'Both',
          meal: newGuest.meal || '-',
          has_plus_one: newGuest.hasPlusOne || (newGuest.accompaniedStatus && newGuest.accompaniedStatus !== 'alone') || false,
          plus_one_name: newGuest.plusOneName || null,
          accompanied_status: newGuest.accompaniedStatus || 'alone',
          message: newGuest.message || null
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase addGuest failed, saving locally:', error.message);
        // Fallback to local
        setGuests(prev => {
          const currentList = prev[slug] || [];
          return { ...prev, [slug]: [...currentList, { ...newGuest, id: Date.now() }] };
        });
        return { success: true, source: 'local' };
      }

      // Update local state with the Supabase record
      const mappedGuest = {
        id: data.id,
        name: data.name,
        email: data.email || '',
        status: data.status,
        side: data.side || 'Both',
        meal: data.meal || '-',
        hasPlusOne: data.has_plus_one || false,
        plusOneName: data.plus_one_name || '',
        accompaniedStatus: data.accompanied_status || 'alone',
        message: data.message || ''
      };

      setGuests(prev => {
        const currentList = prev[slug] || [];
        return { ...prev, [slug]: [...currentList, mappedGuest] };
      });

      return { success: true, source: 'supabase', guest: mappedGuest };
    } catch (err) {
      console.warn('addGuest error:', err);
      // Fallback to local
      setGuests(prev => {
        const currentList = prev[slug] || [];
        return { ...prev, [slug]: [...currentList, { ...newGuest, id: Date.now() }] };
      });
      return { success: true, source: 'local' };
    }
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
        try { setOrders(JSON.parse(savedOrders)); } catch (e) {}
      }
      const savedEventInfo = localStorage.getItem('eventInfo');
      if (savedEventInfo) {
        try { setEventInfo(JSON.parse(savedEventInfo)); } catch (e) {}
      }
      setIsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  React.useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('eventInfo', JSON.stringify(eventInfo));
    }
  }, [eventInfo, isLoaded]);

  return (
    <DatabaseContext.Provider value={{
      // Auth
      currentUser, users, register, login, logout,
      // Orders
      orders, setOrders, createOrder, updateOrderStatus,
      // Guests
      guests, addGuest, fetchGuests,
      // Event Info
      eventInfo, setEventInfo,
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
