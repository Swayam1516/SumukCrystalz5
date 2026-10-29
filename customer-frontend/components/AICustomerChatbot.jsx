'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuth';
import { useCartStore } from '../store/useCart';
import { crystalAudio } from '../utils/harmonicResonance';
import { processCustomerMessage, DEFAULT_FAQS, STORE_CONTACT_INFO } from '../lib/aiAssistantEngine';
import {
  Sparkles,
  Send,
  Minimize2,
  Maximize2,
  RefreshCw,
  X,
  ShoppingBag,
  Package,
  Truck,
  CreditCard,
  Heart,
  ChevronRight,
  ExternalLink,
  Check,
  Headphones,
  Radio,
  Search,
} from 'lucide-react';

// Custom SVG Crystal Cluster Emblem
function LuxuryCrystalIcon({ className = 'w-6 h-6', glowing = false }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glowing ? 'filter drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]' : ''}`}
    >
      <defs>
        <linearGradient id="crystMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="45%" stopColor="#8B2DC9" />
          <stop offset="100%" stopColor="#4C1678" />
        </linearGradient>
        <linearGradient id="crystHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#F5DFA5" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#D9A441" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="crystFacetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>
        <linearGradient id="crystFacetRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8B4FE" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
      </defs>
      {/* Central Tower */}
      <polygon points="32,4 42,22 32,58 22,22" fill="url(#crystMain)" stroke="#E9D5FF" strokeWidth="0.8" />
      <polygon points="32,4 37,22 32,58" fill="url(#crystFacetRight)" opacity="0.85" />
      <polygon points="32,4 27,22 32,58" fill="url(#crystFacetLeft)" opacity="0.85" />
      {/* Left Crystal Pillar */}
      <polygon points="18,18 24,30 18,52 10,34" fill="url(#crystFacetLeft)" stroke="#E9D5FF" strokeWidth="0.6" />
      <polygon points="18,18 20,30 18,52" fill="url(#crystHighlight)" opacity="0.4" />
      {/* Right Crystal Pillar */}
      <polygon points="46,18 54,34 46,52 40,30" fill="url(#crystFacetRight)" stroke="#E9D5FF" strokeWidth="0.6" />
      <polygon points="46,18 44,30 46,52" fill="url(#crystHighlight)" opacity="0.4" />
      {/* Small Front Satellites */}
      <polygon points="26,34 32,42 26,56 20,44" fill="url(#crystMain)" opacity="0.9" stroke="#E9D5FF" strokeWidth="0.5" />
      <polygon points="38,34 44,44 38,56 32,42" fill="url(#crystFacetRight)" opacity="0.9" stroke="#E9D5FF" strokeWidth="0.5" />
      {/* Golden Sparkling Light Refraction */}
      <polygon points="32,6 34,16 32,22 30,16" fill="url(#crystHighlight)" opacity="0.9" />
      <circle cx="32" cy="14" r="1.5" fill="#FFFFFF" />
      <circle cx="20" cy="24" r="1" fill="#FDE68A" />
      <circle cx="44" cy="24" r="1" fill="#FDE68A" />
    </svg>
  );
}

// Background Facet Artwork
function CrystalFacetArtwork() {
  return (
    <div className="absolute right-0 bottom-0 pointer-events-none select-none opacity-[0.14] overflow-hidden w-64 h-64">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-125 translate-x-12 translate-y-12">
        <polygon points="100,20 140,80 100,180 60,80" fill="#7026B5" stroke="#4C1678" strokeWidth="1" />
        <polygon points="100,20 120,80 100,180" fill="#9333EA" />
        <polygon points="140,80 180,120 140,190 100,180" fill="#A855F7" />
        <polygon points="60,80 100,180 60,190 20,120" fill="#6B21A8" />
        <polygon points="130,50 170,90 140,160 110,90" fill="#C084FC" />
        <polygon points="70,50 90,90 60,160 30,90" fill="#7E22CE" />
      </svg>
    </div>
  );
}

const PRIMARY_ACTIONS = [
  {
    id: 'find',
    label: 'Find a Crystal',
    icon: Sparkles,
    query: 'Show me your best consecrated crystals',
  },
  {
    id: 'track',
    label: 'Track My Order',
    icon: Package,
    query: 'Track my order status',
  },
  {
    id: 'ship',
    label: 'Shipping Info',
    icon: Truck,
    query: 'What are your delivery times and shipping rates?',
  },
  {
    id: 'pay',
    label: 'Payment Help',
    icon: CreditCard,
    query: 'What payment options do you accept?',
  },
  {
    id: 'care',
    label: 'Crystal Care Guide',
    icon: Heart,
    query: 'How do I clean and recharge my crystals safely?',
  },
];

export default function AICustomerChatbot() {
  const router = useRouter();
  const { user, openAuthModal } = useAuthStore();
  const { addItem, openDrawer } = useCartStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickAddedId, setQuickAddedId] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [activeFaqs, setActiveFaqs] = useState(DEFAULT_FAQS);
  const [activeActionId, setActiveActionId] = useState('find');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial greeting message
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome-init',
      sender: 'assistant',
      isWelcomeBox: true,
      text: 'Sanctuary dialogue refreshed.\nHow can I help you explore **Sumuk Crystalz** today?',
      products: [],
      quickReplies: ['Find a Crystal Under ₹1000', 'Track My Order', 'Shipping Rates', 'Water Safety Guide'],
      timestamp: new Date().toISOString(),
    },
  ]);

  // Load custom FAQs from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const customFaqs = localStorage.getItem('sumuk_chatbot_faqs');
        if (customFaqs) {
          const parsed = JSON.parse(customFaqs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setActiveFaqs(parsed.filter((f) => f.isActive !== false));
          }
        }
      } catch (_) {}
    }
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 250);
      setHasUnread(false);
    }
  }, [isOpen, isMinimized]);

  // Quick Add Product to Vault
  const handleQuickAdd = (product, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const prodId = product.id || product.slug;
    const price = Number(product.price || 699);
    const origPrice = Number(product.originalPrice || price * 1.3);

    addItem({
      productId: prodId,
      id: prodId,
      name: product.name,
      price: price,
      unitPrice: price,
      originalPrice: origPrice,
      quantity: 1,
      variantLabel: product.beadSize || '8mm Regular Standard',
      image: product.image || '/images/products/pyrite.jpg',
    });

    setQuickAddedId(prodId);
    try {
      crystalAudio?.playSingingBowl(528);
    } catch (_) {}
    setTimeout(() => setQuickAddedId(null), 1800);
    openDrawer();
  };

  // Submit User Message
  const handleSendMessage = async (textToSend = null, actionId = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    if (actionId) {
      setActiveActionId(actionId);
    }

    const userMsgId = 'msg-user-' + Date.now();
    const newUserMsg = {
      id: userMsgId,
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      crystalAudio?.playSingingBowl(432);
    } catch (_) {}

    try {
      let replyData = null;
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            conversationHistory: messages.slice(-6),
            authenticatedUser: user,
            activeFaqs: activeFaqs,
          }),
        });

        if (res.ok) {
          replyData = await res.json();
        }
      } catch (_) {}

      if (!replyData || !replyData.reply) {
        replyData = await processCustomerMessage({
          message: text,
          conversationHistory: messages.slice(-6),
          authenticatedUser: user,
          activeFaqs: activeFaqs,
        });
      }

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-bot-' + Date.now(),
            sender: 'assistant',
            text: replyData.reply,
            products: replyData.products || [],
            quickReplies: replyData.quickReplies || [],
            timestamp: new Date().toISOString(),
          },
        ]);

        if (!isOpen) {
          setHasUnread(true);
        }
      }, 450);
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          text: "I'm experiencing a momentary fluctuation with our sanctuary server. You can ask me again or connect directly on WhatsApp at **+91 91117 16355**.",
          products: [],
          quickReplies: ['WhatsApp Support', 'Find a Crystal', 'Shipping Info'],
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleClearChat = () => {
    setActiveActionId('find');
    setMessages([
      {
        id: 'msg-welcome-' + Date.now(),
        sender: 'assistant',
        isWelcomeBox: true,
        text: 'Sanctuary dialogue refreshed.\nHow can I help you explore **Sumuk Crystalz** today?',
        products: [],
        quickReplies: ['Find a Crystal Under ₹1000', 'Track My Order', 'Shipping Rates', 'Water Safety Guide'],
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // Clean Markdown text renderer for bold, links, and lists (NO emojis)
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      // Bullet list
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        const content = line.trim().replace(/^[-•]\s*/, '');
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1 text-[13.5px] leading-relaxed text-[#171522]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7026B5] mt-2 flex-shrink-0" />
            <span>{parseInlineStyles(content)}</span>
          </div>
        );
      }

      // Numbered list
      if (/^\d+\.\s/.test(line.trim())) {
        const match = line.trim().match(/^(\d+)\.\s*(.*)/);
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1 text-[13.5px] leading-relaxed text-[#171522]">
            <span className="font-sans font-bold text-[#7026B5] text-[12px] mt-0.5 min-w-[16px]">{match[1]}.</span>
            <span>{parseInlineStyles(match[2])}</span>
          </div>
        );
      }

      // Blank line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Normal paragraph
      return (
        <p key={idx} className="my-1 text-[14px] leading-relaxed text-[#171522]">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  const parseInlineStyles = (content) => {
    if (!content) return null;
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIdx = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIdx) {
        parts.push(content.substring(lastIdx, match.index));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          target={linkUrl.startsWith('http') ? '_blank' : '_self'}
          rel="noopener noreferrer"
          className="text-[#7026B5] hover:text-[#4C1678] underline font-semibold transition inline-flex items-center gap-0.5"
        >
          {linkText}
        </a>
      );
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < content.length) {
      parts.push(content.substring(lastIdx));
    }

    return parts.map((part, pIdx) => {
      if (typeof part !== 'string') return part;
      const boldSegments = part.split(/(\*\*.*?\*\*)/g);
      return boldSegments.map((seg, sIdx) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          const innerText = seg.slice(2, -2);
          if (innerText === 'Sumuk Crystalz') {
            return (
              <span key={`${pIdx}-${sIdx}`} className="font-['Cormorant_Garamond',serif] text-[17px] font-bold text-[#7026B5] tracking-wide">
                Sumuk Crystalz
              </span>
            );
          }
          return (
            <strong key={`${pIdx}-${sIdx}`} className="text-[#171522] font-semibold">
              {innerText}
            </strong>
          );
        }
        if (seg.startsWith('`') && seg.endsWith('`')) {
          return (
            <code key={`${pIdx}-${sIdx}`} className="px-1.5 py-0.5 rounded-md bg-[#EDE1FF]/80 text-[#7026B5] font-mono text-[12px] border border-[#7026B5]/20">
              {seg.slice(1, -1)}
            </code>
          );
        }
        return seg;
      });
    });
  };

  return (
    <>
      {/* 1. FLOATING LUXURY TRIGGER BUTTON (WHEN CLOSED) */}
      {!isOpen && !isDismissed && (
        <div className="fixed bottom-20 right-3.5 md:bottom-6 md:right-6 z-40 animate-fade-in group flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="relative flex items-center gap-2.5 p-2.5 md:px-4 md:py-3 rounded-full bg-white/95 hover:bg-white border border-[#7026B5]/25 hover:border-[#7026B5]/50 shadow-[0_8px_30px_rgba(112,38,181,0.2)] transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-xl"
            aria-label="Open Sumuk Crystalz AI Assistant"
          >
            {/* Crystal Emblem Avatar */}
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#F6F0FF] to-white border border-[#7026B5]/20 flex items-center justify-center shadow-sm flex-shrink-0">
              <LuxuryCrystalIcon className="w-5 h-5" glowing />
            </div>

            {/* Label (Hidden on mobile for ultra-compact luxury look) */}
            <div className="hidden md:flex flex-col text-left pr-1">
              <span className="text-[12px] font-['Cormorant_Garamond',serif] font-bold text-[#171522] tracking-wider flex items-center gap-1.5">
                <span>SUMUK ASSISTANT</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[10px] text-[#6F6879] font-sans">
                Curated Crystal Guide
              </span>
            </div>

            {/* Unread Alert Dot */}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#7026B5] border-2 border-white animate-bounce" />
            )}
          </button>

          {/* Dismiss button for mobile/desktop to completely clear screen if needed */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="w-6 h-6 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-stone-700 border border-stone-200/60 shadow-xs flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            title="Hide assistant"
            aria-label="Hide assistant button"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 2. MAIN ASSISTANT WINDOW */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col font-sans ${
            isMinimized
              ? 'bottom-5 right-5 w-72 sm:w-80 h-16 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(80,40,130,0.15)] border border-[#7026B5]/20 bg-white/95 backdrop-blur-xl'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[500px] md:w-[540px] h-[100dvh] sm:h-[660px] max-h-[100dvh] sm:max-h-[90vh] rounded-none sm:rounded-[28px] shadow-[0_25px_70px_rgba(80,40,130,0.18)] border-0 sm:border sm:border-[#7026B5]/20 flex flex-col overflow-hidden backdrop-blur-2xl'
          }`}
          style={{
            background: `
              radial-gradient(circle at 85% 15%, rgba(220, 198, 255, 0.45), transparent 38%),
              radial-gradient(circle at 10% 90%, rgba(245, 220, 255, 0.35), transparent 32%),
              linear-gradient(135deg, #ffffff 0%, #fbf9ff 45%, #f4edff 100%)
            `,
          }}
        >
          {/* Subtle Facet Background Graphic */}
          <CrystalFacetArtwork />

          {/* ================= HEADER ================= */}
          <div className="relative z-10 flex items-center justify-between px-5 sm:px-6 py-4 bg-white/60 backdrop-blur-md border-b border-[#7026B5]/12 flex-shrink-0">
            <div className="flex items-center gap-3.5">
              {/* Luxury Logo Emblem */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-white via-[#FAF5FF] to-[#EDE1FF] border border-[#7026B5]/20 flex items-center justify-center shadow-[0_4px_16px_rgba(112,38,181,0.12)] flex-shrink-0">
                <LuxuryCrystalIcon className="w-7 h-7 sm:w-8 sm:h-8" glowing />
              </div>

              {/* Title & Subtitle */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="font-['Cormorant_Garamond',serif] text-[20px] sm:text-[23px] font-bold text-[#171522] tracking-[1.5px] leading-tight">
                    SUMUK CRYSTALZ
                  </h2>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" title="Online" />
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-['Cormorant_Garamond',serif] text-[11px] sm:text-[12px] font-bold text-[#7026B5] tracking-[4px] uppercase">
                    ASSISTANT
                  </span>
                  <span className="text-[10.5px] text-[#6F6879] font-sans font-normal truncate hidden sm:inline">
                    • Your Online Sanctuary Guide • Sacred Consecrated
                  </span>
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1.5 text-[#6F6879]">
              <button
                type="button"
                onClick={handleClearChat}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-[#EDE1FF] hover:text-[#7026B5] border border-[#7026B5]/15 flex items-center justify-center transition shadow-sm cursor-pointer"
                title="Refresh Dialogue"
                aria-label="Refresh Dialogue"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-[#EDE1FF] hover:text-[#7026B5] border border-[#7026B5]/15 flex items-center justify-center transition shadow-sm cursor-pointer hidden sm:flex"
                title={isMinimized ? 'Expand' : 'Minimize'}
                aria-label={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-rose-50 hover:text-rose-600 border border-rose-200/50 flex items-center justify-center transition shadow-sm cursor-pointer"
                title="Close Assistant"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* ================= TOP QUICK ACTION BAR ================= */}
              <div className="relative z-10 px-4 py-2.5 bg-white/40 border-b border-[#7026B5]/10 overflow-x-auto no-scrollbar flex items-center gap-2 flex-shrink-0">
                {PRIMARY_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  const isActive = activeActionId === action.id;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleSendMessage(action.query, action.id)}
                      className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border text-[12px] font-medium transition-all duration-200 shadow-sm cursor-pointer active:scale-95 ${
                        isActive
                          ? 'bg-[#EDE1FF] border-[#7026B5]/40 text-[#7026B5] font-semibold shadow-[0_4px_12px_rgba(112,38,181,0.12)]'
                          : 'bg-white/85 hover:bg-[#FAF6FF] border-[#7026B5]/15 text-[#171522] hover:border-[#7026B5]/30'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#7026B5]' : 'text-[#7026B5]/80'}`} />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ================= MAIN MESSAGE FEED ================= */}
              <div className="relative z-10 flex-1 p-4 sm:p-5 overflow-y-auto space-y-5">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';

                  // 1. Initial / Refreshed Welcome Card View
                  if (msg.isWelcomeBox && !isUser) {
                    return (
                      <div key={msg.id} className="space-y-4 animate-fade-in">
                        {/* Assistant Dialogue Card */}
                        <div className="flex items-start gap-3">
                          {/* Circular Glass Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#EDE1FF] border border-[#7026B5]/20 flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                            <LuxuryCrystalIcon className="w-6 h-6" />
                          </div>

                          {/* Frosted Glass Dialogue Card */}
                          <div className="flex-1 relative rounded-[22px] bg-gradient-to-br from-white/96 to-[#F7F2FF]/92 border border-[#7026B5]/15 p-5 shadow-[0_12px_35px_rgba(85,45,130,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-xl">
                            {/* Subtle faceted decoration in top right corner */}
                            <div className="absolute top-2 right-3 opacity-20 pointer-events-none">
                              <Sparkles className="w-5 h-5 text-[#7026B5]" />
                            </div>

                            <p className="text-[14.5px] font-normal text-[#171522] leading-relaxed">
                              Sanctuary dialogue refreshed.
                            </p>
                            <p className="text-[14.5px] font-normal text-[#171522] leading-relaxed mt-1">
                              How can I help you explore{' '}
                              <span className="font-['Cormorant_Garamond',serif] text-[18px] font-bold text-[#7026B5] tracking-wide">
                                Sumuk Crystalz
                              </span>{' '}
                              today?
                            </p>
                          </div>
                        </div>

                        {/* 5 Quick Response Cards in Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pl-12">
                          {PRIMARY_ACTIONS.map((action) => {
                            const Icon = action.icon;
                            return (
                              <button
                                key={action.id}
                                type="button"
                                onClick={() => handleSendMessage(action.query, action.id)}
                                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-white/95 to-[#FAF5FF]/90 hover:from-white hover:to-[#EDE1FF] border border-[#7026B5]/15 hover:border-[#7026B5]/35 shadow-[0_4px_16px_rgba(80,40,130,0.06)] hover:shadow-[0_8px_24px_rgba(112,38,181,0.12)] hover:-translate-y-0.5 transition-all duration-200 group text-left cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-[#EDE1FF] group-hover:bg-[#E0CCFF] flex items-center justify-center transition">
                                    <Icon className="w-3.5 h-3.5 text-[#7026B5]" />
                                  </div>
                                  <span className="text-[13px] font-medium text-[#171522] group-hover:text-[#7026B5] transition">
                                    {action.label}
                                  </span>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-[#7026B5]/50 group-hover:text-[#7026B5] group-hover:translate-x-0.5 transition-all" />
                              </button>
                            );
                          })}
                        </div>

                        {/* Timestamp */}
                        <div className="pl-13 text-[11px] text-[#85808F] font-sans">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  }

                  // 2. Subsequent Conversation Message Views
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
                    >
                      <div className={`flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Assistant Avatar for bot messages */}
                        {!isUser && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-[#EDE1FF] border border-[#7026B5]/20 flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                            <LuxuryCrystalIcon className="w-5 h-5" />
                          </div>
                        )}

                        <div
                          className={`rounded-2xl p-4 text-[13.5px] sm:text-[14px] leading-relaxed shadow-sm ${
                            isUser
                              ? 'bg-gradient-to-r from-[#7026B5] to-[#4C1678] text-white font-medium rounded-tr-xs shadow-[0_6px_20px_rgba(112,38,181,0.22)]'
                              : 'bg-white/96 border border-[#7026B5]/15 text-[#171522] rounded-tl-xs shadow-[0_8px_25px_rgba(80,40,130,0.06)]'
                          }`}
                        >
                          {/* Content */}
                          <div>{renderFormattedText(msg.text)}</div>

                          {/* Embedded Crystal Product Cards */}
                          {msg.products && msg.products.length > 0 && (
                            <div className="mt-3.5 pt-3 border-t border-[#7026B5]/12 grid grid-cols-1 gap-2.5">
                              {msg.products.map((prod) => {
                                const prodId = prod.id || prod.slug;
                                return (
                                  <div
                                    key={prodId}
                                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#7026B5]/20 hover:border-[#7026B5] shadow-sm hover:shadow-md transition-all duration-300 group"
                                  >
                                    {/* Thumbnail */}
                                    <Link
                                      href={`/product/${prod.slug}`}
                                      className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-[#7026B5]/15 block"
                                    >
                                      <Image
                                        src={prod.image}
                                        alt={prod.name}
                                        fill
                                        sizes="56px"
                                        className="object-cover group-hover:scale-108 transition-transform duration-500"
                                      />
                                      {prod.discountPercent > 0 && (
                                        <span className="absolute top-0.5 right-0.5 px-1 rounded bg-[#7026B5] text-white text-[8.5px] font-bold">
                                          {prod.discountPercent}%
                                        </span>
                                      )}
                                    </Link>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                      <Link href={`/product/${prod.slug}`}>
                                        <h4 className="font-['Cormorant_Garamond',serif] text-[14px] font-bold text-[#171522] group-hover:text-[#7026B5] transition line-clamp-1">
                                          {prod.name}
                                        </h4>
                                      </Link>

                                      {prod.multiTags && prod.multiTags.length > 0 && (
                                        <p className="text-[10px] text-[#6F6879] truncate mt-0.5 font-sans">
                                          {prod.multiTags.slice(0, 2).join(' • ')}
                                        </p>
                                      )}

                                      <div className="flex items-baseline gap-2 mt-1">
                                        <span className="font-bold text-[13px] text-[#7026B5]">
                                          ₹{prod.price.toLocaleString('en-IN')}
                                        </span>
                                        {prod.originalPrice > prod.price && (
                                          <span className="text-[10.5px] text-[#85808F] line-through">
                                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                                          </span>
                                        )}
                                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 ml-auto">
                                          In Stock
                                        </span>
                                      </div>
                                    </div>

                                    {/* Quick Add Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => handleQuickAdd(prod, e)}
                                      className="p-2 rounded-lg bg-[#EDE1FF] hover:bg-[#7026B5] text-[#7026B5] hover:text-white transition flex-shrink-0 active:scale-95 shadow-sm cursor-pointer"
                                      title="Add to Vault"
                                      aria-label="Add to Vault"
                                    >
                                      {quickAddedId === prodId ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Follow-up Suggestion Chips */}
                      {msg.quickReplies && msg.quickReplies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5 pl-11 max-w-[90%]">
                          {msg.quickReplies.map((reply, rIdx) => (
                            <button
                              key={rIdx}
                              type="button"
                              onClick={() => handleSendMessage(reply)}
                              className="px-3 py-1 rounded-full bg-white/90 hover:bg-[#EDE1FF] border border-[#7026B5]/18 hover:border-[#7026B5]/40 text-[#7026B5] text-[11px] font-medium transition active:scale-95 shadow-xs cursor-pointer"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}

                      <span className="text-[10px] text-[#85808F] mt-1 px-11 font-sans">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 pl-11">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/90 border border-[#7026B5]/15 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#7026B5] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#7026B5] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#7026B5] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ================= FLOATING CHAT INPUT BAR ================= */}
              <div className="relative z-10 p-3.5 sm:p-4 bg-white/70 backdrop-blur-lg border-t border-[#7026B5]/12 flex-shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="relative flex items-center bg-white/95 rounded-[22px] border border-[#7026B5]/20 focus-within:border-[#7026B5] shadow-[0_10px_30px_rgba(80,40,130,0.08)] px-3.5 py-1.5 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#7026B5] flex-shrink-0 mr-2.5" />

                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about Sumuk Crystalz..."
                    className="flex-1 bg-transparent border-0 text-[14px] text-[#171522] placeholder-[#85808F] outline-none font-sans"
                    maxLength={500}
                  />

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7B2CBF] to-[#5E1D91] hover:from-[#6A24A6] hover:to-[#4C1678] disabled:opacity-35 text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-[0_6px_16px_rgba(106,39,163,0.25)] flex-shrink-0 cursor-pointer ml-2"
                    title="Send Message"
                    aria-label="Send Message"
                  >
                    <Send className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                  </button>
                </form>

                {/* ================= FOOTER ================= */}
                <div className="flex items-center justify-between mt-2.5 px-2 text-[10.5px] text-[#6F6879] font-sans">
                  <div className="flex items-center gap-1.5">
                    {/* Audio Waveform icon */}
                    <span className="flex items-center gap-0.5 text-[#7026B5]">
                      <span className="w-0.5 h-2 bg-[#7026B5] rounded-full inline-block" />
                      <span className="w-0.5 h-3.5 bg-[#7026B5] rounded-full inline-block" />
                      <span className="w-0.5 h-2 bg-[#7026B5] rounded-full inline-block" />
                      <span className="w-0.5 h-4 bg-[#7026B5] rounded-full inline-block" />
                      <span className="w-0.5 h-1.5 bg-[#7026B5] rounded-full inline-block" />
                    </span>
                    <span>Solfeggio Consecrated AI</span>
                  </div>

                  <a
                    href="https://wa.me/c/919111716355"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7026B5] hover:text-[#4C1678] font-medium transition flex items-center gap-1"
                  >
                    <span>Human Help</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
