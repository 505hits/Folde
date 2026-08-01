"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDatabase } from "@/context/DatabaseContext";
import BordeauxTemplate from "@/components/templates/BordeauxTemplate";

const themes = [
  { id: 'bordeaux', name: 'Bordeaux' },
  { id: 'champagne', name: 'Champagne' },
  { id: 'ivory', name: 'Ivory' },
  { id: 'sage', name: 'Sage' },
  { id: 'terracotta', name: 'Terracotta' },
  { id: 'royalbordeaux', name: 'Royal Bordeaux' },
  { id: 'royalblue', name: 'Royal Blue' },
  { id: 'chocolate', name: 'Chocolate' },
  { id: 'rosebow', name: 'Blush Ribbon' },
  { id: 'majestic', name: 'Grand Heritage' },
  { id: 'thelaceedit', name: 'The Lace Edit' },
  { id: 'lejardin', name: 'Le Jardin' },
  { id: 'lacephotoscratch', name: 'Lace Photo Scratch' },
  { id: 'oasisroyale', name: 'Oasis Royale' },
  { id: 'tropical', name: 'Tropical' },
  { id: 'photoscratch', name: 'Photo Scratch' },
  { id: 'softscratch', name: 'Soft Scratch' },
  { id: 'cisnes', name: 'Cisnes' },
  { id: 'bloom', name: 'Bloom' },
  { id: 'floral', name: 'Floral' },
  { id: 'romanticgarden', name: 'Romantic Garden' },
  { id: 'blossomoud', name: 'Blossom Oud' },
  { id: 'dolcevita', name: 'Dolce Vita' },
  { id: 'webgencytemplate5', name: 'Velvet Garden' },
  { id: 'tildatemplate2', name: 'Noir Gold' },
  { id: 'pressedlovecomo', name: 'Como' },
  { id: 'pressedloveteatro', name: 'Teatro' },
  { id: 'pressedlovethevenue', name: 'The Venue' },
  { id: 'pressedlovesweetlove', name: 'Sweet Love' },
  { id: 'pressedlovefloral', name: 'Botanical Floral' },
  { id: 'pressedlovebigentrance', name: 'Big Entrance' },
];

const packages = [
  {
    id: 'essential',
    name: 'Standard',
    price: 49.90,
    originalPrice: 99.90,
    desc: 'Choose from our +15 exclusive templates and receive a personalized digital wedding invitation with your texts, photos and colours.',
    features: [
      'Choose 1 template from over 15 options',
      'Your colors and info applied',
      'RSVP + private dashboard',
      'Guest directory & table planner',
      'All languages supported',
      'Unlimited guests included'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79.90,
    originalPrice: 149.90,
    desc: 'Full access to standard invitation editor + AI background images, 24h express support, design review, and custom sections.',
    features: [
      'Everything in Standard included',
      'AI Generated Backgrounds & Images',
      'Express 24h Dedicated Support',
      'Review by our Design Team',
      'Custom sections (boarding pass, RSVP options)',
      'Unlimited revisions'
    ]
  },
  {
    id: 'Custom',
    name: 'Custom',
    price: 149.90,
    originalPrice: 290.00,
    desc: 'Bespoke hand-crafted ("Fait main") experience with dedicated questionnaire onboarding, team review, and admin site validation.',
    features: [
      '100% bespoke questionnaire onboarding',
      'Hand-crafted ("Fait main") art direction',
      'Custom Envelope, Hero video, Menu & Photos',
      'Direct review & validation by our team',
      'Concierge priority support',
      'Everything in Premium'
    ]
  }
];

const ENVELOPE_OPTIONS = [
  { id: 'env_bordeaux', name: 'Bordeaux Envelope', url: '/videos/bordeaux.mp4', color: '#4a1523' },
  { id: 'env_seaview', name: 'Sea View Envelope', url: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', color: '#d4c5b9' },
  { id: 'env_floral', name: 'Floral Envelope', url: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777312876430.mp4', color: '#f5e3d7' },
  { id: 'env_luxury', name: 'Luxury Envelope', url: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777314873141.mp4', color: '#d4c5b9' },
  { id: 'env_royal', name: 'Royal Envelope', url: 'https://kdcyugwruypwrmtllswt.supabase.co/storage/v1/object/public/invitation-assets/98032531-8029-42fd-8ba2-3f50d3ab7f3a/opening-animation-1777287974328.mp4', color: '#33403a' },
  { id: 'env_horizon_bordeaux', name: 'Bordeaux Horizon', url: '/videos/horizon-bordeaux.mp4', color: '#5C3A1E' },
  { id: 'env_royal_doves', name: 'Royal Doves', url: '/videos/royal-doves.mp4', color: '#e5dcd3' },
  { id: 'env_imperial_light', name: 'Imperial Light', url: '/videos/imperial-light.mp4', color: '#f3e5d8' },
  { id: 'env_golden_palace', name: 'Golden Palace', url: '/videos/golden-palace.mp4', color: '#d4af37' },
  { id: 'env_oriental_palace', name: 'Oriental Palace', url: '/videos/oriental-palace.mp4', color: '#c7b299' },
  { id: 'env_celestial_veil', name: 'Celestial Veil', url: '/videos/celestial-veil.mp4', color: '#e0e5ec' },
  { id: 'env_ivory_veil', name: 'Ivory Veil', url: '/videos/ivory-veil.mp4', color: '#f8f5f0' },
  { id: 'env_rose_veil', name: 'Rosé Veil', url: '/videos/rose-veil.mp4', color: '#f4e1e1' },
  { id: 'env_rose_bow', name: 'Rose Bow', url: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4', color: '#f3d9d7' },
  { id: 'env_majestic', name: 'Majestic', url: 'https://majestic-template.thedigitalyes.com/assets/intro-video-Dhn3t98e.mp4', color: '#7a5e42' },
  { id: 'env_thelaceedit', name: 'The Lace Edit', url: 'https://savethedate-thelaceedit.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8' },
  { id: 'env_lejardin', name: 'Le Jardin', url: 'https://savethedate-lejardin.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8' },
  { id: 'env_lacephotoscratch', name: 'Lace Photo Scratch', url: 'https://savethedate-lacephotoscratch.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8' },
  { id: 'env_oasisroyale', name: 'Oasis Royale', url: 'https://savethedate-oasisroyale.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8' },
  { id: 'env_tropical', name: 'Tropical', url: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/276cb847-0eab-41c6-9ad6-30c90ab5ec34/envelope-open.mp4', color: '#f3e5d8' },
  { id: 'env_photoscratch', name: 'Photo Scratch', url: 'https://savethedate-photo-scratch.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8' },
  { id: 'env_softscratch', name: 'Soft Scratch', url: 'https://soft-scratch.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8' },
  { id: 'env_cisnes', name: 'Cisnes', url: 'https://savethedate-cisnes.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8' },
  { id: 'env_bloom', name: 'Bloom', url: 'https://savethedate-bloom.thedigitalyes.com/video/envelope-open.mp4', color: '#f3e5d8' },
  { id: 'env_romanticgarden', name: 'Romantic Garden', url: 'https://eftesa.com/assets/themes/romantic-garden/Floral-garden-intro-video.mp4', color: '#e8f0e8' },
  { id: 'env_pressedlovecomo', name: 'Como Blue Seal', url: 'https://pressedlove.com/demo-media/shared/wax-seal-blue-e30ba1e0.mp4', color: '#0c2340' },
  { id: 'env_pressedloveenvelope', name: 'Pressed Love Envelope', url: 'https://pressedlove.com/demo-media/shared/pressed-love-envelope-52d49bf5.mp4', color: '#221810' },
  { id: 'env_pressedlovegold', name: 'Big Entrance Gold Seal', url: 'https://pressedlove.com/demo-media/shared/wax-seal-yellow-dc798fa1.mp4', color: '#1a2744' },
  { id: 'env_custom', name: "I'll provide my own", color: '#888' },
];

const HERO_VIDEO_OPTIONS = [
  { id: 'hero_couple', name: 'Kissing Couple', url: 'https://www.wooowinvites.com/assets/kissing-couple-theme-m4dGzKxs.mp4' },
  { id: 'hero_seaview', name: 'Sea View', url: 'https://www.wooowinvites.com/assets/sea-view-theme-CqN1unYE.mp4' },
  { id: 'hero_palm', name: 'Palm Zoom', url: 'https://www.wooowinvites.com/assets/palm-zoom-theme-DTmwX1Yh.mp4' },
  { id: 'hero_car', name: 'Just Married Car', url: 'https://www.wooowinvites.com/assets/just-married-car-theme-BhahCrzF.mp4' },
  { id: 'hero_castle', name: 'Castle', url: 'https://www.wooowinvites.com/assets/castle-theme-DW5muDbc.mp4' },
  { id: 'hero_royal', name: 'Royal Heritage', url: 'https://www.wooowinvites.com/assets/royal-heritage-theme-Czr23y-Y.mp4' },
  { id: 'hero_sea_anim', name: 'Sea Animation', url: 'https://www.wooowinvites.com/assets/sea-theme-animation-D5DLPcRz.mp4' },
  { id: 'hero_sea_balcony', name: 'Seaview Balcony', url: 'https://www.wooowinvites.com/assets/seaview-balcony-theme-X8-zUaoe.mp4' },
  { id: 'hero_rose_bow', name: 'Blush Ribbon', url: 'https://maldives-demo.thedigitalyes.com/__l5e/assets-v1/ca66d869-63f5-40cc-8421-1b0df31922c2/rs-bow-v2.mp4' },
  { id: 'hero_thelaceedit', name: 'The Lace Edit', url: 'https://savethedate-thelaceedit.thedigitalyes.com/assets/hero-scratch-cover-CwPyg4DV.png' },
  { id: 'hero_lejardin', name: 'Le Jardin', url: 'https://savethedate-lejardin.thedigitalyes.com/__l5e/assets-v1/0d44b575-21a3-498b-856a-eaf9614d23c6/hero-video-compressed.mp4' },
  { id: 'hero_lacephotoscratch', name: 'Lace Photo Scratch', url: 'https://savethedate-lacephotoscratch.thedigitalyes.com/assets/hero-scratch-cover-reference-CIK32eF4.png' },
  { id: 'hero_oasisroyale', name: 'Oasis Royale', url: 'https://savethedate-oasisroyale.thedigitalyes.com/__l5e/assets-v1/775de535-0300-4a62-ae3b-dceee4b22ab7/hero-video-compressed.mp4' },
  { id: 'hero_tropical', name: 'Tropical', url: 'https://savethedate-tropical.thedigitalyes.com/__l5e/assets-v1/4689b4cd-298d-4b59-b560-7d443345b459/hero-bg.mp4' },
  { id: 'hero_bloom', name: 'Bloom', url: 'https://savethedate-bloom.thedigitalyes.com/__l5e/assets-v1/1bdda2ef-38b6-474c-a5cf-b37eaabdb36f/hero-video.mp4' },
  { id: 'hero_dolcevita', name: 'Dolce Vita', url: 'https://static.tildacdn.net/tild3733-3133-4232-b033-623736623262/romantic-moments-bea.png' },
  { id: 'hero_webgencytemplate5', name: 'Velvet Garden', url: 'https://static.tildacdn.net/tild3338-6332-4463-b639-623665353237/300592484d1f31590325.png' },
  { id: 'hero_pressedlovecomo', name: 'Como Villa', url: 'https://pressedlove.com/demo-media/como/hero-video.mp4' },
  { id: 'hero_pressedloveteatro', name: 'Teatro Curtain', url: 'https://pressedlove.com/demo-media/template-teatro/curtain-video-BAKLj3Y5.mp4' },
  { id: 'hero_pressedlovethevenue', name: 'The Venue Estate', url: 'https://pressedlove.com/demo-media/boda-mar-jaume/intro-video-BSNlV4m4.webm' },
  { id: 'hero_pressedlovesweetlove', name: 'Sweet Love', url: 'https://pressedlove.com/demo-media/boda-laura-javier/hero-video-new-G6oopIOA.mp4' },
  { id: 'hero_pressedlovefloral', name: 'Botanical Floral', url: 'https://pressedlove.com/demo-media/boda-maria-carlos/hero-video-1230-C27srnl9.mp4' },
  { id: 'hero_pressedlovebigentrance', name: 'Big Entrance', url: 'https://pressedlove.com/demo-media/theme-previews/theme-big-entrance.mp4' },
  { id: 'hero_custom', name: "I'll provide my own" },
];

const SECTION_OPTIONS = [
  { key: 'intro', label: 'Introduction' },
  { key: 'venue', label: 'Venue' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'dressCode', label: 'Dress Code' },
  { key: 'rsvp', label: 'RSVP' },
  { key: 'gallery', label: 'Photo Gallery' },
  { key: 'gifts', label: 'Gift Registry' },
];

const inputStyle = {
  width: '100%',
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid #e0dcd7',
  backgroundColor: '#faf8f5',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23888\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  paddingRight: '2.5rem',
};

const labelStyle = {
  fontSize: '0.8rem',
  color: '#888',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  marginBottom: '0.5rem',
  display: 'block',
};

export default function CheckoutClient() {
  const router = useRouter();
  const { currentUser, register, login, createOrder } = useDatabase();

  // Flow: 1=Package, 2=Preview+Personalize, 3=Email+Pay → /success
  // Premium/Custom: 1=Package, 2=Preview, 3=Email+Pay → 4=Wedding form → send email → done
  const [step, setStep] = useState(1);

  const [selectedPackage, setSelectedPackage] = useState(packages[0]);
  const [selectedTheme, setSelectedTheme] = useState(themes[0].id);

  // Account details (shared by all)
  const [account, setAccount] = useState({ name: '', partnerName: '', email: '', password: 'welcome123' });
  const [authError, setAuthError] = useState('');

  // Premium/Custom wedding form (shown AFTER payment)
  const [premiumForm, setPremiumForm] = useState({
    phone: '',
    weddingDate: '',
    weddingVenue: '',
    weddingCity: '',
    guestCount: '',
    envelopeChoice: '',
    heroVideoChoice: '',
    languages: '',
    colorPreferences: '',
    specialRequests: '',
    inspirationLinks: '',
    sectionsWanted: ['intro', 'venue', 'schedule', 'rsvp', 'gallery'],
    menuDetails: '',
    menuFile: null,        // { name, content (base64) }
    galleryPhotos: [],     // Array of { name, content (base64) }
    customHeroVideo: null, // { name, content (base64) }
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Preview step state
  const [previewDate, setPreviewDate] = useState('');
  const [previewVenue, setPreviewVenue] = useState('');
  const [selectedEnvelope, setSelectedEnvelope] = useState(ENVELOPE_OPTIONS[0].id);
  const [selectedHeroVideo, setSelectedHeroVideo] = useState(HERO_VIDEO_OPTIONS[0].id);
  const [envelopeKey, setEnvelopeKey] = useState(0);

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (field === 'galleryPhotos') {
      const promises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              content: reader.result.split(',')[1] // Strip prefix
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises).then(newPhotos => {
        setPremiumForm(prev => ({
          ...prev,
          galleryPhotos: [...prev.galleryPhotos, ...newPhotos]
        }));
      });
    } else if (field === 'customHeroVideo' || field === 'menuFile') {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPremiumForm(prev => ({
          ...prev,
          [field]: {
            name: file.name,
            size: file.size,
            type: file.type,
            content: reader.result.split(',')[1] // Strip prefix
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isPremiumOrCustom = selectedPackage.id === 'premium' || selectedPackage.id === 'Custom';

  // Note: checkout fields intentionally start empty — the client enters their own details.

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('selectedTemplate');
    if (saved && themes.find(t => t.id === saved)) {
      setSelectedTheme(saved);
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const plan = params.get('plan');
      if (plan) {
        const found = packages.find(p => p.id.toLowerCase() === plan.toLowerCase());
        if (found) setSelectedPackage(found);
      }
    }
  }, []);

  // Debounced preview state to prevent video re-initialization memory leaks while typing
  const [debouncedAccount, setDebouncedAccount] = useState(account);
  const [debouncedPreviewDate, setDebouncedPreviewDate] = useState(previewDate);
  const [debouncedPreviewVenue, setDebouncedPreviewVenue] = useState(previewVenue);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedAccount(account), 300);
    return () => clearTimeout(timer);
  }, [account.name, account.partnerName]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPreviewDate(previewDate), 300);
    return () => clearTimeout(timer);
  }, [previewDate]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedPreviewVenue(previewVenue), 300);
    return () => clearTimeout(timer);
  }, [previewVenue]);

  const total = selectedPackage.price;
  const originalTotal = selectedPackage.originalPrice;
  const themeName = themes.find(t => t.id === selectedTheme)?.name || 'Editorial';

  const formatPreviewDate = (dateStr) => {
    if (!dateStr) return 'MAY 27, 2026';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return 'MAY 27, 2026';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  const envObj = ENVELOPE_OPTIONS.find(e => e.id === selectedEnvelope);
  const heroObj = HERO_VIDEO_OPTIONS.find(h => h.id === selectedHeroVideo);

  const previewData = useMemo(() => ({
    partner1: debouncedAccount.name || 'Your Name',
    partner2: debouncedAccount.partnerName || "Partner's Name",
    date: formatPreviewDate(debouncedPreviewDate),
    time: '16:00',
    ceremonyVenue: debouncedPreviewVenue || 'Your Dream Venue',
    receptionVenue: debouncedPreviewVenue || '',
    themeId: selectedTheme,
    videos: {
      envelope: envObj?.url || '',
      hero: heroObj?.url || '',
    },
    timeline: [
      { time: "15:00", title: "Ceremony" },
      { time: "16:30", title: "Cocktail" },
      { time: "19:00", title: "Dinner" },
      { time: "22:00", title: "Party" },
    ],
    accommodations: [],
    menu: [
      { course: "Starter", dish: "..." },
      { course: "Main", dish: "..." },
      { course: "Dessert", dish: "..." },
    ],
    sections: {
      showIntro: true,
      showVenue: true,
      showSchedule: true,
      showBoardingPass: false,
      showRSVP: true,
      showGallery: false,
      showDressCode: false,
    },
    images: {},
  }), [debouncedAccount.name, debouncedAccount.partnerName, debouncedPreviewDate, debouncedPreviewVenue, selectedTheme, selectedEnvelope, selectedHeroVideo]);

  const handleNextStep = async () => {
    setAuthError('');
    if (step === 1) {
      if (!account.name || !account.partnerName) {
        setAuthError('Please enter both names to continue.');
        return;
      }
      setStep(2);
      window.scrollTo(0, 0);
      return;
    }
    if (step === 2) {
      setStep(3);
      window.scrollTo(0, 0);
      return;
    }
    if (step === 3) {
      if (!account.email) {
        setAuthError('Please enter your email address.');
        return;
      }
      if (!currentUser) {
        const result = await register(account.email, account.password || 'test123', account.name, account.partnerName);
        if (!result.success) {
          const isRateLimit = result.error?.toLowerCase().includes('rate limit') || result.error?.toLowerCase().includes('rate_limit');
          const isInvalid = result.error?.toLowerCase().includes('invalid') || account.email?.toLowerCase().endsWith('@test.com');
          const isExists = result.error === 'Email already exists' || result.error === 'Un compte existe déjà avec cet email.' || result.error?.toLowerCase().includes('already exists');

          if (isExists) {
            const loginRes = await login(account.email, account.password || 'test123');
            if (!loginRes.success) {
              const fallbackUser = { email: account.email, name: account.name, partnerName: account.partnerName };
              setCurrentUser(fallbackUser);
              if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
            }
          } else if (isRateLimit || isInvalid) {
            const fallbackUser = { email: account.email, name: account.name, partnerName: account.partnerName };
            setCurrentUser(fallbackUser);
            if (typeof window !== 'undefined') localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
          } else {
            setAuthError(result.error); return;
          }
        }
      }
      await handlePayment();
      return;
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else {
      router.push('/collections');
    }
    window.scrollTo(0, 0);
  };

  const handlePayment = async () => {
    setPaymentProcessing(true);

    // Save pending order info to localStorage (needed after Stripe redirect)
    if (typeof window !== 'undefined') {
      localStorage.setItem('pendingOrder', JSON.stringify({
        name: account.name,
        partnerName: account.partnerName,
        email: account.email,
        password: account.password,
        theme: selectedTheme,
        plan: selectedPackage.name,
        planId: selectedPackage.id,
        price: total,
      }));
    }

    // Fast Test Bypass: if email contains 'test' or 'bypass' (e.g. emma@test.com, test@test.com, user@test.com)
    const cleanEmail = (account.email || '').trim().toLowerCase();
    const isTestEmail = cleanEmail.includes('test') || cleanEmail.includes('bypass') || cleanEmail.endsWith('@test.com');

    if (isTestEmail) {
      try {
        if (!currentUser) {
          await register(account.email, account.password || 'test123', account.name, account.partnerName);
        }
        await createOrder(account.email, account.name, account.partnerName, selectedTheme, selectedPackage.name, total);
        router.push('/dashboard');
        return;
      } catch (err) {
        console.warn('Fast test payment bypass failed:', err);
      }
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPackage.id,
          name: account.name,
          partnerName: account.partnerName,
          email: account.email,
          theme: selectedTheme,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned:', data.error);
        setPaymentProcessing(false);
        alert('Payment error: ' + (data.error || 'Please try again.'));
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentProcessing(false);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSendOrder = async () => {
    setSending(true);
    try {
      const envName = ENVELOPE_OPTIONS.find(e => e.id === premiumForm.envelopeChoice)?.name || premiumForm.envelopeChoice || 'Not specified';
      const heroName = HERO_VIDEO_OPTIONS.find(h => h.id === premiumForm.heroVideoChoice)?.name || premiumForm.heroVideoChoice || 'Not specified';

      const attachments = [];
      if (premiumForm.menuFile) {
        attachments.push({
          filename: premiumForm.menuFile.name,
          content: premiumForm.menuFile.content,
        });
      }
      if (premiumForm.customHeroVideo) {
        attachments.push({
          filename: premiumForm.customHeroVideo.name,
          content: premiumForm.customHeroVideo.content,
        });
      }
      if (premiumForm.galleryPhotos && premiumForm.galleryPhotos.length > 0) {
        premiumForm.galleryPhotos.forEach(p => {
          attachments.push({
            filename: p.name,
            content: p.content,
          });
        });
      }

      await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageName: selectedPackage.name,
          price: total,
          name: account.name,
          partnerName: account.partnerName,
          email: account.email,
          phone: premiumForm.phone,
          weddingDate: premiumForm.weddingDate,
          weddingVenue: premiumForm.weddingVenue,
          weddingCity: premiumForm.weddingCity,
          guestCount: premiumForm.guestCount,
          selectedTheme: themeName,
          envelopeChoice: envName,
          heroVideoChoice: heroName,
          languages: premiumForm.languages,
          colorPreferences: premiumForm.colorPreferences,
          specialRequests: premiumForm.specialRequests,
          inspirationLinks: premiumForm.inspirationLinks,
          sectionsWanted: premiumForm.sectionsWanted.map(
            k => SECTION_OPTIONS.find(s => s.key === k)?.label || k
          ),
          menuDetails: premiumForm.menuDetails,
          attachments,
        }),
      });
      setSent(true);
    } catch (err) {
      console.error(err);
      setSent(true); // Still mark as sent
    } finally {
      setSending(false);
    }
  };

  const toggleSection = (key) => {
    setPremiumForm(prev => ({
      ...prev,
      sectionsWanted: prev.sectionsWanted.includes(key)
        ? prev.sectionsWanted.filter(k => k !== key)
        : [...prev.sectionsWanted, key]
    }));
  };

  // ─── STEP 4: Payment processing overlay ───
  if (paymentProcessing) {
    return (
      <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #f0ede9', borderTopColor: '#5C3A1E', margin: '0 auto 2rem', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', color: '#1a1a1a', marginBottom: '0.5rem' }}>Processing Payment</h1>
          <p style={{ color: '#888', fontSize: '0.95rem' }}>Please wait while we secure your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', fontFamily: 'var(--font-body)', color: '#1a1a1a', position: 'relative' }}>
      <style>{`
        .checkout-bottom-bar-inner {
          background-color: rgba(250, 248, 245, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding: 0.75rem 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .checkout-back-btn {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          border: 1px solid #e0dcd7;
          background-color: #faf8f5;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          color: #555;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .checkout-back-btn:hover {
          border-color: #5C3A1E;
          color: #5C3A1E;
        }

        .checkout-main-btn {
          flex: 1;
          height: 56px;
          border-radius: 14px;
          border: none;
          background-color: #5C3A1E;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem;
          transition: all 0.2s ease;
          letter-spacing: 0.5px;
          min-width: 0;
        }

        .checkout-main-btn:hover:not(:disabled) {
          background-color: #4A2E18;
          transform: translateY(-1px);
        }

        .checkout-btn-text {
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .checkout-btn-price {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .checkout-old-price {
          text-decoration: line-through;
          opacity: 0.65;
          font-size: 0.85rem;
          font-weight: 400;
        }

        .checkout-final-price {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .checkout-pay-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.4rem;
          font-size: 0.72rem;
          color: #888;
        }

        .pay-chip {
          padding: 1px 5px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.58rem;
          letter-spacing: 0.2px;
        }

        .pay-chip-apple {
          background: #000;
          color: #fff;
        }

        .pay-chip-google {
          background: #fff;
          color: #555;
          border: 1px solid #ddd;
        }

        /* ─── Preview Step Layout ─── */
        .preview-step-wrapper {
          display: flex;
          flex-direction: row-reverse;
          min-height: calc(100vh - 60px);
        }
        .preview-form-side {
          flex: 1;
          padding: 3rem 2.5rem 160px;
          overflow-y: auto;
          max-height: calc(100vh - 60px);
        }
        .preview-phone-side {
          width: 440px;
          background: linear-gradient(180deg, #f5f1ea 0%, #ede7dc 100%);
          border-right: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: sticky;
          top: 60px;
          height: calc(100vh - 60px);
          flex-shrink: 0;
        }
        .preview-phone-frame {
          width: 280px;
          height: 580px;
          background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
          border-radius: 44px;
          padding: 10px;
          box-shadow: 0 30px 70px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.08) inset, 0 2px 4px rgba(255,255,255,0.05) inset;
          position: relative;
          animation: phoneSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .preview-phone-frame::before {
          content: '';
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 90px;
          height: 22px;
          background: #0a0a0a;
          border-radius: 0 0 14px 14px;
          z-index: 2;
        }
        .preview-phone-screen {
          width: 100%;
          height: 100%;
          background-color: #fff;
          border-radius: 34px;
          overflow: hidden;
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          -ms-overflow-style: none;
          scrollbar-width: none;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .preview-phone-screen::-webkit-scrollbar {
          display: none;
        }
        .preview-phone-template-inner {
          width: 450px;
          min-height: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          zoom: 0.5777;
          margin: 0 auto;
        }
        @keyframes phoneSlideIn {
          from { opacity: 0; transform: translateY(40px) scale(0.92); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes formFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .preview-form-card {
          animation: formFadeIn 0.5s ease-out;
        }
        .preview-input-active {
          border-color: #5C3A1E !important;
          box-shadow: 0 0 0 3px rgba(92,58,30,0.08) !important;
        }
        @media (max-width: 1024px) {
          .preview-step-wrapper {
            flex-direction: column;
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem 1.5rem 160px;
          }
          .preview-form-side {
            padding: 0;
            overflow-y: visible;
            max-height: none;
          }
          .preview-phone-side {
            width: 100%;
            position: relative;
            top: auto;
            height: auto;
            border-right: none;
            border-radius: 24px;
            padding: 2.5rem 1rem;
            margin-top: 2rem;
          }
          .preview-phone-frame {
            width: 260px;
            height: 540px;
          }
          .preview-phone-template-inner {
            zoom: 0.5333;
          }
        }
        @media (max-width: 600px) {
          .preview-step-wrapper {
            padding: 1.5rem 1rem 140px;
          }
          .preview-phone-side {
            padding: 2rem 0.5rem;
            margin-top: 1.5rem;
          }
          .preview-phone-frame {
            width: 250px;
            height: 520px;
            border-radius: 38px;
          }
          .preview-phone-template-inner {
            zoom: 0.5111;
          }
        }

        @media (max-width: 600px) {
          .mobile-hide { display: none !important; }
          .checkout-bottom-bar-inner {
            padding: 0.65rem 1rem 0.85rem !important;
          }
          .checkout-back-btn {
            width: 52px !important;
            height: 54px !important;
            border-radius: 14px !important;
            font-size: 1.1rem !important;
          }
          .checkout-main-btn {
            height: 54px !important;
            border-radius: 14px !important;
            padding: 0 1.1rem !important;
            box-shadow: 0 6px 20px rgba(92,58,30,0.28) !important;
          }
          .checkout-btn-text {
            font-size: 0.92rem !important;
            font-weight: 700 !important;
            letter-spacing: 0.4px !important;
          }
          .checkout-btn-price {
            gap: 0.4rem !important;
          }
          .checkout-old-price {
            font-size: 0.78rem !important;
          }
          .checkout-final-price {
            font-size: 0.95rem !important;
            font-weight: 700 !important;
          }
          .checkout-pay-badge {
            margin-top: 0.35rem !important;
            font-size: 0.72rem !important;
          }
          .checkout-box { padding: 1.5rem 1rem !important; }
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-container:not(.preview-active) { padding-bottom: 80px !important; }
          .checkout-container.preview-active { padding: 0 !important; max-width: none !important; }
          input, select, textarea { width: 100% !important; box-sizing: border-box; }
        }
      `}</style>

      {/* ─── Top Header ─── */}
      {step <= 4 && !sent && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'sticky', top: 0, backgroundColor: 'rgba(250,248,245,0.95)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
          <button onClick={handleBack} style={{ background: '#fff', border: '1px solid #e0dcd7', padding: '0.45rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#555', fontSize: '0.85rem', fontFamily: 'inherit' }}>
            ← {step === 1 ? 'Templates' : 'Back'}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2c2c2c' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#b08968' }}></span>
              {selectedPackage.name} Package
            </div>
            {step > 1 && step <= 3 && (
              <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                {[1, 2, 3].map(s => (
                  <div key={s} style={{ width: '32px', height: '3px', borderRadius: '2px', backgroundColor: step >= s ? '#5C3A1E' : '#e0dcd7' }}></div>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: '1rem' }}>
            <span style={{ textDecoration: 'line-through', opacity: 0.4, marginRight: '0.4rem', fontSize: '0.85rem' }}>{originalTotal}$</span>
            <span style={{ fontWeight: 700 }}>{total}$</span>
          </div>
        </div>
      )}

      <div className={`checkout-container ${step === 1 ? 'preview-active' : ''}`} style={{ maxWidth: step === 1 ? 'none' : '600px', margin: '0 auto', padding: step === 4 ? '0' : step === 1 ? '0' : '3rem 1.5rem 120px' }}>

        {/* ═══ STEP 1: PERSONALIZE + PREVIEW ═══ */}
        {step === 1 && (
          <div className="preview-step-wrapper">
            {/* ── Form Panel ── */}
            <div className="preview-form-side">
              <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                {/* Header with Social Proof */}
                <div className="preview-form-card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>

                  {/* Social Proof Pill Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    backgroundColor: '#ffffff',
                    padding: '0.45rem 1.1rem 0.45rem 0.6rem',
                    borderRadius: '30px',
                    border: '1px solid rgba(176, 137, 104, 0.25)',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                    marginBottom: '1rem'
                  }}>
                    {/* Overlapping Avatars */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="Couple 1"
                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }}
                      />
                      <img
                        src="https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="Couple 2"
                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover', marginLeft: '-10px' }}
                      />
                      <img
                        src="https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="Couple 3"
                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover', marginLeft: '-10px' }}
                      />
                      <img
                        src="https://images.pexels.com/photos/3352398/pexels-photo-3352398.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="Couple 4"
                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover', marginLeft: '-10px' }}
                      />
                    </div>

                    {/* Social Proof Text */}
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ color: '#b08968', fontSize: '0.75rem', letterSpacing: '1px' }}>★★★★★</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#333' }}>4.9/5</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#666', fontWeight: 500 }}>Chosen by 500+ happy couples</span>
                    </div>
                  </div>

                  <h1 style={{ fontSize: '2rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#1a1a1a', marginBottom: '0.4rem' }}>Live Personalization Preview</h1>
                  <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>Select your preferred envelope animation, background video, and details to preview your invitation live.</p>

                  {/* Customer Review Quote Pill */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 1rem',
                    backgroundColor: '#FAF5F0',
                    borderRadius: '20px',
                    border: '1px solid rgba(176, 137, 104, 0.18)'
                  }}>
                    <span style={{ fontSize: '0.8rem' }}>💬</span>
                    <p style={{ fontSize: '0.78rem', color: '#5C3A1E', fontStyle: 'italic', margin: 0, fontWeight: 500 }}>
                      &ldquo;Our guests were captivated from the moment they opened it!&rdquo; <span style={{ fontStyle: 'normal', opacity: 0.75, fontWeight: 600 }}>&mdash; Camille &amp; Antoine</span>
                    </p>
                  </div>
                </div>

                {/* Envelope Selection Card */}
                <div className="preview-form-card" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                      Envelope Animation
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'none', letterSpacing: 0 }}>Scroll horizontally →</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.6rem', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}>
                    {ENVELOPE_OPTIONS.map(env => {
                      const isSelected = selectedEnvelope === env.id;
                      return (
                        <div
                          key={env.id}
                          onClick={() => {
                            setSelectedEnvelope(env.id);
                            setEnvelopeKey(k => k + 1);
                          }}
                          style={{
                            flex: '0 0 105px',
                            border: isSelected ? '2.5px solid #5C3A1E' : '1px solid #e0dcd7',
                            borderRadius: '14px', padding: '0.35rem', cursor: 'pointer',
                            backgroundColor: isSelected ? '#faf5f6' : '#fff',
                            transition: 'all 0.2s', textAlign: 'center'
                          }}
                        >
                          <div style={{ width: '100%', height: '160px', borderRadius: '10px', overflow: 'hidden', backgroundColor: env.color || '#ccc', position: 'relative' }}>
                            {env.url && !env.url.endsWith('.m3u8') && env.id !== 'env_custom' ? (
                              <video src={env.url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', backgroundColor: env.color }} />
                            )}
                          </div>
                          <div style={{ fontSize: '0.7rem', fontWeight: isSelected ? 700 : 500, marginTop: '0.4rem', color: isSelected ? '#5C3A1E' : '#444', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            {env.name.replace(' Envelope', '')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hero Video Selection Card */}
                <div className="preview-form-card" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /></svg>
                      Hero Theme Video
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'none', letterSpacing: 0 }}>Scroll horizontally →</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.6rem', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}>
                    {HERO_VIDEO_OPTIONS.map(hero => {
                      const isSelected = selectedHeroVideo === hero.id;
                      return (
                        <div
                          key={hero.id}
                          onClick={() => setSelectedHeroVideo(hero.id)}
                          style={{
                            flex: '0 0 105px',
                            border: isSelected ? '2.5px solid #5C3A1E' : '1px solid #e0dcd7',
                            borderRadius: '14px', padding: '0.35rem', cursor: 'pointer',
                            backgroundColor: isSelected ? '#faf5f6' : '#fff',
                            transition: 'all 0.2s', textAlign: 'center'
                          }}
                        >
                          <div style={{ width: '100%', height: '160px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#eaeaea', position: 'relative' }}>
                            {hero.url && hero.id !== 'hero_custom' ? (
                              hero.url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) || hero.url.includes('Vector.png') || hero.url.includes('romantic-moments-bea.png') ? (
                                <img src={hero.url} alt={hero.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <video src={hero.url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )
                            ) : (
                              <div style={{ width: '100%', height: '100%', backgroundColor: '#d9d0c7' }} />
                            )}
                          </div>
                          <div style={{ fontSize: '0.7rem', fontWeight: isSelected ? 700 : 500, marginTop: '0.4rem', color: isSelected ? '#5C3A1E' : '#444', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            {hero.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Couple Names Card */}
                <div className="preview-form-card" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '1.75rem', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    The Couple
                  </div>
                  <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ ...labelStyle, marginBottom: '0.4rem' }}>First name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sophie"
                        value={account.name || ''}
                        onChange={e => setAccount({ ...account, name: e.target.value })}
                        onFocus={e => e.target.classList.add('preview-input-active')}
                        onBlur={e => e.target.classList.remove('preview-input-active')}
                        style={{ ...inputStyle, transition: 'border-color 0.3s, box-shadow 0.3s' }}
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, marginBottom: '0.4rem' }}>Partner's name</label>
                      <input
                        type="text"
                        placeholder="e.g. Lucas"
                        value={account.partnerName || ''}
                        onChange={e => setAccount({ ...account, partnerName: e.target.value })}
                        onFocus={e => e.target.classList.add('preview-input-active')}
                        onBlur={e => e.target.classList.remove('preview-input-active')}
                        style={{ ...inputStyle, transition: 'border-color 0.3s, box-shadow 0.3s' }}
                      />
                    </div>
                  </div>
                  {/* Live indicator */}
                  {(account.name || account.partnerName) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem', fontSize: '0.75rem', color: '#b08968' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#b08968', animation: 'pulse 2s infinite' }}></span>
                      Updating preview…
                    </div>
                  )}
                </div>

                {/* Date & Venue Card */}
                <div className="preview-form-card" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '1.75rem', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    Wedding Details
                  </div>
                  <div style={{ marginBottom: '0.85rem' }}>
                    <label style={{ ...labelStyle, marginBottom: '0.4rem' }}>Wedding date <span style={{ fontWeight: 400, opacity: 0.5, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                    <input
                      type="date"
                      value={previewDate}
                      onChange={e => setPreviewDate(e.target.value)}
                      onFocus={e => e.target.classList.add('preview-input-active')}
                      onBlur={e => e.target.classList.remove('preview-input-active')}
                      style={{ ...inputStyle, transition: 'border-color 0.3s, box-shadow 0.3s' }}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, marginBottom: '0.4rem' }}>Venue <span style={{ fontWeight: 400, opacity: 0.5, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Château de Versailles"
                      value={previewVenue}
                      onChange={e => setPreviewVenue(e.target.value)}
                      onFocus={e => e.target.classList.add('preview-input-active')}
                      onBlur={e => e.target.classList.remove('preview-input-active')}
                      style={{ ...inputStyle, transition: 'border-color 0.3s, box-shadow 0.3s' }}
                    />
                  </div>
                </div>

                {/* Important Notice Banner (Moved to the end of input fields) */}
                <div className="preview-form-card" style={{ backgroundColor: '#FAF5F0', border: '1px solid #E8DDD4', borderRadius: '16px', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div style={{ color: '#5C3A1E', marginTop: '2px', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#5C3A1E', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.25rem' }}>Live Invitation Preview</div>
                    <div style={{ fontSize: '0.85rem', color: '#6A5647', lineHeight: 1.5 }}>
                      This interactive preview lets you see how your names and date look on your design. <strong>After completing payment, you will unlock full access to your private dashboard</strong> to customize photos, videos, music, envelope animations, RSVPs, and all event details.
                    </div>
                  </div>
                </div>

                {authError && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '10px' }}>{authError}</div>}

                {/* Trust indicators */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                  {['Unlimited guests', 'RSVP included', 'Live in 24h'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#888', padding: '0.35rem 0.75rem', backgroundColor: '#fff', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ color: '#b08968', fontSize: '0.7rem' }}>✓</span> {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Phone Preview Panel ── */}
            <div className="preview-phone-side">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '0.68rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#999', fontWeight: 600 }}>Live Preview</div>
                <div className="preview-phone-frame">
                  <div className="preview-phone-screen">
                    <div className="preview-phone-template-inner">
                      <BordeauxTemplate key={`${selectedEnvelope}-${envelopeKey}-${selectedTheme}`} data={previewData} editMode={false} autoPlaySimulation={true} heroHeight="970px" />
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#aaa', textAlign: 'center', maxWidth: '220px', lineHeight: 1.4 }}>Scroll inside the phone to explore your invitation ↕</div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: CHOOSE PACKAGE ═══ */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}>Choose your package</h1>
              <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '0.5rem' }}>Select the level of service you need.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {packages.map(p => (
                <div key={p.id} onClick={() => setSelectedPackage(p)}
                  style={{
                    backgroundColor: '#fff', padding: '2rem', borderRadius: '20px', cursor: 'pointer',
                    border: selectedPackage.id === p.id ? '2px solid #5C3A1E' : '1px solid rgba(0,0,0,0.06)',
                    boxShadow: selectedPackage.id === p.id ? '0 8px 24px rgba(107,54,62,0.08)' : 'none',
                    transition: 'all 0.2s ease', position: 'relative'
                  }}>
                  {selectedPackage.id === p.id && (
                    <div style={{ position: 'absolute', top: 20, right: 20, width: 24, height: 24, borderRadius: '50%', backgroundColor: '#5C3A1E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>✓</div>
                  )}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your plan</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#1a1a1a' }}>{p.name}</h3>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: '#aaa' }}>{p.originalPrice}$</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#5C3A1E' }}>{p.price}$</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.75rem', lineHeight: 1.5 }}>{p.desc}</p>
                  </div>
                  <div style={{ borderTop: '1px solid #f0ede9', paddingTop: '1.5rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {p.features.map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: '#444' }}>
                          <span style={{ color: '#b08968', marginTop: '2px' }}>✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {(p.id === 'premium' || p.id === 'Custom') && selectedPackage.id === p.id && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#faf5f0', borderRadius: '10px', border: '1px solid #e8ddd4', fontSize: '0.8rem', color: '#8b6e5a', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b6e5a" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                      <span>We handle everything for you! After payment, you'll fill in your wedding details and our design team will craft your invitation.</span>
                    </div>
                  )}
                </div>
              ))}
              <div style={{ backgroundColor: '#faf8f5', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', marginTop: '1rem', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ color: '#5C3A1E', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', color: '#555', marginBottom: '0.25rem' }}>YOU'LL-LOVE-IT PROMISE</div>
                  <div style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.5 }}>We work with you, revision after revision, until your invitation moves you. You won't share it with the world until every detail feels exactly the way you dreamed it.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: CONFIRM & PAY ═══ */}
        {step === 3 && (
          <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '3rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: '#5C3A1E' }}>Almost there!</h1>
              <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '0.5rem' }}>Enter your email to create your private dashboard and complete your order.</p>
            </div>

            {/* Couple summary badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', backgroundColor: '#faf8f5', borderRadius: '14px', marginBottom: '1.5rem', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #5C3A1E, #8b6e5a)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.98rem', fontWeight: 600, color: '#1a1a1a' }}>{account.name} & {account.partnerName}</div>
                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.1rem' }}>
                  {previewDate ? formatPreviewDate(previewDate) : ''}
                  {previewDate && previewVenue ? ' · ' : ''}
                  {previewVenue || ''}
                  {!previewDate && !previewVenue ? themeName : ''}
                </div>
              </div>
              <button onClick={() => { setStep(2); window.scrollTo(0, 0); }} style={{ background: 'none', border: 'none', color: '#5C3A1E', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
            </div>

            <div style={{ marginBottom: '0.25rem' }}>
              <label style={{ ...labelStyle, marginBottom: '0.4rem' }}>Email address</label>
              <input type="email" placeholder="your@email.com" value={account.email || ''} onChange={e => setAccount({ ...account, email: e.target.value })} style={inputStyle} />
            </div>
            {authError && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>{authError}</div>}
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
              Already have an account? <Link href="/dashboard" style={{ color: '#5C3A1E', fontWeight: 600, textDecoration: 'underline' }}>Log in to your dashboard</Link>
            </div>
          </div>
        )}



        {/* ═══ STEP 4: WEDDING FORM (after payment, Premium/Custom only) ═══ */}
        {step === 4 && (
          <div style={{ padding: '2rem 1.5rem 3rem' }}>

            {sent ? (
              <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '4rem 2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)', textAlign: 'center', maxWidth: '540px', margin: '2rem auto' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#5C3A1E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 2rem', boxShadow: '0 4px 16px rgba(92,58,30,0.2)' }}>✓</div>
                <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#5C3A1E', marginBottom: '1rem' }}>Details Sent Successfully!</h2>
                <p style={{ color: '#666', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                  Thank you! Our design team has received your wedding details. Your bespoke invitation is now being crafted (estimated delivery: 3 days). You can access your private dashboard right now.
                </p>
                <button onClick={() => router.push('/dashboard')} style={{ width: '100%', backgroundColor: '#5C3A1E', color: '#fff', border: 'none', padding: '1.1rem 2rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '1px', boxShadow: '0 4px 12px rgba(92,58,30,0.25)' }}>
                  ACCESS MY DASHBOARD →
                </button>
              </div>
            ) : (
              <>
                {/* Success banner */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '1rem 2rem' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#5C3A1E', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem', boxShadow: '0 4px 12px rgba(107,54,62,0.2)' }}>✓</div>
                  <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#1a1a1a', marginBottom: '0.5rem' }}>Payment Confirmed!</h1>
                  <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Now tell us about your wedding so we can start crafting your invitation.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                  {/* Wedding Details */}
                  <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>Wedding Details</div>
                    <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={labelStyle}>Wedding date</label>
                        <input type="date" value={premiumForm.weddingDate} onChange={e => setPremiumForm({ ...premiumForm, weddingDate: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Guest count</label>
                        <input type="text" placeholder="e.g. 120" value={premiumForm.guestCount} onChange={e => setPremiumForm({ ...premiumForm, guestCount: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={labelStyle}>Venue name</label>
                      <input type="text" placeholder="e.g. Château de Versailles" value={premiumForm.weddingVenue} onChange={e => setPremiumForm({ ...premiumForm, weddingVenue: e.target.value })} style={inputStyle} />
                    </div>
                    <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={labelStyle}>City / Country</label>
                        <input type="text" placeholder="e.g. Paris, France" value={premiumForm.weddingCity} onChange={e => setPremiumForm({ ...premiumForm, weddingCity: e.target.value })} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Languages</label>
                        <input type="text" placeholder="e.g. French, English" value={premiumForm.languages} onChange={e => setPremiumForm({ ...premiumForm, languages: e.target.value })} style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>Contact Details</div>
                    <label style={labelStyle}>Phone number (for WhatsApp or call)</label>
                    <input type="tel" placeholder="+33 6 12 34 56 78" value={premiumForm.phone} onChange={e => setPremiumForm({ ...premiumForm, phone: e.target.value })} style={inputStyle} />
                  </div>

                  {/* Design Preferences (Visual selectors) */}
                  <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>Envelope Choice</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                      {ENVELOPE_OPTIONS.map(e => {
                        const isSelected = premiumForm.envelopeChoice === e.id;
                        return (
                          <div key={e.id} onClick={() => setPremiumForm({ ...premiumForm, envelopeChoice: e.id })}
                            style={{
                              border: isSelected ? '2.5px solid #5C3A1E' : '1px solid #e0dcd7',
                              borderRadius: '12px', padding: '0.5rem', cursor: 'pointer',
                              backgroundColor: isSelected ? '#faf5f6' : '#fff',
                              transition: 'all 0.2s', textAlign: 'center'
                            }}>
                            <div style={{ height: '70px', borderRadius: '8px', overflow: 'hidden', backgroundColor: e.color || '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                              {e.url && !e.url.endsWith('.m3u8') && e.id !== 'env_custom' ? (
                                <video src={e.url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : e.id === 'env_custom' ? (
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Upload</span>
                              ) : (
                                <div style={{ width: '100%', height: '100%', backgroundColor: e.color }} />
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem', color: isSelected ? '#5C3A1E' : '#333', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                              {e.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom Envelope File Upload */}
                    {premiumForm.envelopeChoice === 'env_custom' && (
                      <div style={{ marginBottom: '2rem', padding: '1rem', border: '2px dashed #e0dcd7', borderRadius: '12px', backgroundColor: '#faf8f5', textAlign: 'center' }}>
                        <label style={{ cursor: 'pointer', display: 'block' }}>
                          <span style={{ fontSize: '0.85rem', color: '#5C3A1E', fontWeight: 600 }}>Click to upload envelope video (.mp4)</span>
                          <input type="file" accept="video/mp4" onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPremiumForm(prev => ({
                                  ...prev,
                                  envelopeChoice: `Custom Uploaded: ${file.name}`
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }} style={{ display: 'none' }} />
                        </label>
                      </div>
                    )}

                    <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>Hero Video Choice</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                      {HERO_VIDEO_OPTIONS.map(h => {
                        const isSelected = premiumForm.heroVideoChoice === h.id;
                        return (
                          <div key={h.id} onClick={() => setPremiumForm({ ...premiumForm, heroVideoChoice: h.id })}
                            style={{
                              border: isSelected ? '2.5px solid #5C3A1E' : '1px solid #e0dcd7',
                              borderRadius: '12px', padding: '0.5rem', cursor: 'pointer',
                              backgroundColor: isSelected ? '#faf5f6' : '#fff',
                              transition: 'all 0.2s', textAlign: 'center'
                            }}>
                            <div style={{ height: '70px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                              {h.url && h.id !== 'hero_custom' ? (
                                <video src={h.url} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Upload</span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem', color: isSelected ? '#5C3A1E' : '#333', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                              {h.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Custom Hero Video File Upload */}
                    {premiumForm.heroVideoChoice === 'hero_custom' && (
                      <div style={{ marginBottom: '2rem', padding: '1.2rem', border: '2px dashed #e0dcd7', borderRadius: '12px', backgroundColor: '#faf8f5', textAlign: 'center' }}>
                        <label style={{ cursor: 'pointer', display: 'block' }}>
                          <span style={{ fontSize: '0.85rem', color: '#5C3A1E', fontWeight: 600 }}>Click to upload custom hero video (.mp4)</span>
                          <input type="file" accept="video/mp4" onChange={(e) => handleFileChange(e, 'customHeroVideo')} style={{ display: 'none' }} />
                        </label>
                        {premiumForm.customHeroVideo && (
                          <div style={{ fontSize: '0.8rem', color: '#2d8a4e', marginTop: '0.5rem', fontWeight: 600 }}>
                            Selected: {premiumForm.customHeroVideo.name} ({(premiumForm.customHeroVideo.size / (1024 * 1024)).toFixed(2)} MB)
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label style={labelStyle}>Color preferences</label>
                      <input type="text" placeholder="e.g. Blush pink, gold, ivory" value={premiumForm.colorPreferences} onChange={e => setPremiumForm({ ...premiumForm, colorPreferences: e.target.value })} style={inputStyle} />
                    </div>
                  </div>

                  {/* Photo Gallery Upload */}
                  <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>Photo Gallery</div>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Upload photos you want us to include in your gallery (Max 10 photos)</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                      {premiumForm.galleryPhotos.map((photo, index) => (
                        <div key={index} style={{ position: 'relative', width: '100%', paddingBottom: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0dcd7' }}>
                          <img src={`data:${photo.type};base64,${photo.content}`} alt="Gallery preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button onClick={() => {
                            setPremiumForm(prev => ({
                              ...prev,
                              galleryPhotos: prev.galleryPhotos.filter((_, i) => i !== index)
                            }));
                          }} style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', cursor: 'pointer' }}>
                            ✕
                          </button>
                        </div>
                      ))}
                      {premiumForm.galleryPhotos.length < 10 && (
                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer', minHeight: '60px' }}>
                          <span style={{ fontSize: '1.2rem', color: '#888' }}>+</span>
                          <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'galleryPhotos')} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Menu Details & Upload */}
                  <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>Menu & Reception details</div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={labelStyle}>Write your menu courses / details</label>
                      <textarea placeholder="Appetizers, main courses, desserts, dietary options..." value={premiumForm.menuDetails} onChange={e => setPremiumForm({ ...premiumForm, menuDetails: e.target.value })} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div style={{ padding: '1rem', border: '2px dashed #e0dcd7', borderRadius: '12px', backgroundColor: '#faf8f5', textAlign: 'center' }}>
                      <label style={{ cursor: 'pointer', display: 'block' }}>
                        <span style={{ fontSize: '0.85rem', color: '#5C3A1E', fontWeight: 600 }}>Upload menu file (PDF, Image)</span>
                        <input type="file" accept="application/pdf,image/*" onChange={(e) => handleFileChange(e, 'menuFile')} style={{ display: 'none' }} />
                      </label>
                      {premiumForm.menuFile && (
                        <div style={{ fontSize: '0.8rem', color: '#2d8a4e', marginTop: '0.5rem', fontWeight: 600 }}>
                          Selected: {premiumForm.menuFile.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>Invitation Sections</div>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Select the sections you want</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {SECTION_OPTIONS.map(s => (
                        <div key={s.key} onClick={() => toggleSection(s.key)}
                          style={{
                            padding: '0.85rem 1rem', borderRadius: '12px',
                            border: premiumForm.sectionsWanted.includes(s.key) ? '2px solid #5C3A1E' : '1px solid #e0dcd7',
                            backgroundColor: premiumForm.sectionsWanted.includes(s.key) ? '#fbf5f6' : '#faf8f5',
                            cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.15s ease',
                          }}>
                          <span style={{ color: premiumForm.sectionsWanted.includes(s.key) ? '#5C3A1E' : '#ccc', fontSize: '0.9rem' }}>
                            {premiumForm.sectionsWanted.includes(s.key) ? '✓' : '○'}
                          </span>
                          {s.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extra Notes */}
                  <div className="checkout-box" style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '2rem 2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '0.75rem', letterSpacing: '2px', color: '#5C3A1E', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 600 }}>Additional Details & Notes</div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={labelStyle}>Inspiration links</label>
                      <textarea placeholder="Share any Pinterest boards, Instagram posts, or websites you love..." value={premiumForm.inspirationLinks} onChange={e => setPremiumForm({ ...premiumForm, inspirationLinks: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Details / requests to add</label>
                      <textarea placeholder="Write down any text blocks, timeline events, or special layout requests you want us to add..." value={premiumForm.specialRequests} onChange={e => setPremiumForm({ ...premiumForm, specialRequests: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleSendOrder}
                    disabled={sending}
                    style={{
                      width: '100%', padding: '1.2rem', borderRadius: '16px', border: 'none',
                      backgroundColor: '#5C3A1E', color: '#fff', fontSize: '1.1rem', fontWeight: 600,
                      cursor: sending ? 'wait' : 'pointer', fontFamily: 'inherit', letterSpacing: '1px',
                      opacity: sending ? 0.7 : 1, transition: 'all 0.3s',
                    }}>
                    {sending ? 'SENDING...' : 'SEND MY DETAILS →'}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#aaa' }}>
                    Our team will contact you within 24 hours
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Trust Badges */}
        {(step === 1 || step === 3) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', paddingBottom: '6rem' }}>
            <div className="mobile-hide" style={{ display: 'flex', gap: '1rem', color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <span>✓ Secure payment</span><span>·</span><span>✓ Instant confirmation</span><span>·</span><span>✓ Designer-made</span>
            </div>
            <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ height: '1px', width: '40px', backgroundColor: '#e0dcd7' }}></div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#5C3A1E', letterSpacing: '2px', textTransform: 'uppercase' }}>SPECIAL OFFER · You save ${Math.round(originalTotal - total)}</span>
              <div style={{ height: '1px', width: '40px', backgroundColor: '#e0dcd7' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom Bar (steps 1-3) ─── */}
      {step <= 3 && (
        <div className="checkout-bottom-bar" style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 100 }}>
          <div style={{ height: '20px', background: 'linear-gradient(to top, #faf8f5, transparent)', pointerEvents: 'none' }}></div>
          <div className="checkout-bottom-bar-inner">
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '600px' }}>
              <button onClick={handleBack} className="checkout-back-btn" aria-label="Back">←</button>
              <button onClick={handleNextStep} className="checkout-main-btn" disabled={paymentProcessing}>
                <span className="checkout-btn-text">{step === 1 ? 'CONTINUE TO PACKAGES →' : step === 2 ? 'CONTINUE TO PAYMENT →' : (paymentProcessing ? 'PROCESSING...' : 'PAY & START')}</span>
                <div className="checkout-btn-price">
                  {originalTotal > total && (
                    <span className="checkout-old-price">{originalTotal}$</span>
                  )}
                  <span className="checkout-final-price">{total}$ →</span>
                </div>
              </button>
            </div>
            <div className="checkout-pay-badge">
              <span>1 tap with</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span className="pay-chip pay-chip-apple">Pay</span>
                <span className="pay-chip pay-chip-google">G Pay</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
