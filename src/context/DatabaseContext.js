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
      try { setCurrentUser(JSON.parse(saved)); } catch (e) {}
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
        let errorMsg = 'Erreur lors de l’inscription.';
        if (error.message.includes('User already registered') || error.message.includes('already exists')) {
          errorMsg = 'Un compte existe déjà avec cet email.';
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

        let errorMsg = 'Email ou mot de passe incorrect.';
        if (error.message.includes('Invalid login credentials')) {
          errorMsg = 'Email ou mot de passe incorrect.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMsg = 'Veuillez confirmer votre adresse e-mail avant de vous connecter.';
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
      return { success: false, error: 'Une erreur s’est produite lors de la connexion.' };
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
        try { setRevisions(JSON.parse(savedRev)); } catch (e) {}
      }
    }
  }, []);

  return (
    <DatabaseContext.Provider value={{
      // Auth
      currentUser, users, register, login, loginWithGoogle, loginWithMagicLink, logout,
      // Orders
      orders, setOrders, createOrder, updateOrderStatus,
      // Guests
      guests, addGuest, fetchGuests,
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
