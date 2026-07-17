"use client";

import React, { createContext, useContext, useState } from "react";

const DatabaseContext = createContext();

export function DatabaseProvider({ children }) {
  // ============ AUTH ============
  const [users, setUsers] = useState([
    { email: 'emma@test.com', password: 'test123', name: 'Emma', partnerName: 'Lucas' }
  ]);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('currentUser');
    if (saved) {
      try { setCurrentUser(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const register = (email, password, name, partnerName) => {
    const exists = users.find(u => u.email === email);
    if (exists) return { success: false, error: 'Un compte existe déjà avec cet email.' };
    const newUser = { email, password, name, partnerName };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { success: true };
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Email ou mot de passe incorrect.' };
    setCurrentUser(user);
    if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true };
  };

  const logout = () => {
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
      plan: "Standard",
      price: 49.90,
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

    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      couple: `${name} et ${partnerName}`,
      slug,
      email: userEmail,
      plan,
      price,
      status: "Awaiting Details",
      paid: true,
      date: new Date().toISOString().split('T')[0],
      theme
    };
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  // ============ GUESTS ============
  const [guests, setGuests] = useState({
    "emma-et-lucas": [
      { id: 1, name: 'Alice Dupont', status: 'Attending', meal: 'Beef Wellington', side: 'Bride' },
      { id: 2, name: 'Jean Martin', status: 'Pending', meal: '-', side: 'Groom' },
    ]
  });

  const addGuest = (slug, newGuest) => {
    setGuests(prev => {
      const currentList = prev[slug] || [];
      return {
        ...prev,
        [slug]: [...currentList, { ...newGuest, id: Date.now() }]
      };
    });
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
      orders, setOrders, createOrder,
      // Guests
      guests, addGuest,
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
