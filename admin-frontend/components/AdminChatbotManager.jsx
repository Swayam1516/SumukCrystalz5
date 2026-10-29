'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Bot,
  Sparkles,
  MessageSquare,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Phone,
  ShieldCheck,
  Save,
  Check,
  ArrowRight,
  Filter,
  Eye,
  Zap,
} from 'lucide-react';

const FAQ_CATEGORIES = [
  'All Categories',
  'Products',
  'Ordering',
  'Payment',
  'Shipping',
  'Returns',
  'Crystal Care',
  'Account',
  'General',
];

const INITIAL_FAQS = [
  {
    id: 'faq-1',
    category: 'Products',
    question: 'Are all Sumuk Crystalz natural and authentic?',
    answer:
      'Yes, 100%. Every single crystal, gemstone bracelet, raw cluster, and mala at Sumuk Crystalz is ethically fair-mined from certified geological basins (such as Brazil, Madagascar, Peru, and Uruguay) and comes with a certificate of authenticity. We never sell artificial glass or synthetic resins.',
    isActive: true,
  },
  {
    id: 'faq-2',
    category: 'Crystal Care',
    question: 'How are the crystals energized and consecrated before dispatch?',
    answer:
      'Prior to dispatch, every specimen undergoes an individualized energetic purification ritual by Founder Soumyaa Naveen. Stagnant mining frequencies are cleared using Tibetan singing bowls attuned to sacred Solfeggio frequencies and sacred sandalwood smoke, followed by Usui Reiki charging.',
    isActive: true,
  },
  {
    id: 'faq-3',
    category: 'Shipping',
    question: 'What are the delivery charges and shipping timelines across India?',
    answer:
      'We ship across India from our Pune sanctuary via secure armored couriers. Local Pune (<50km) is ₹50 (1–2 days), Regional Maharashtra (50–150km) is ₹100 (2–3 days), and Interstate/National shipping is ₹150 (3–6 business days). All orders above ₹5,000 qualify for 100% Free Express Shipping.',
    isActive: true,
  },
  {
    id: 'faq-4',
    category: 'Returns',
    question: 'What is your return and replacement policy?',
    answer:
      'Compulsory Unboxing Video Requirement: An unboxing video recorded continuously from the sealed package opening to crystal inspection without cuts or edits is strictly compulsory for any return, transit damage claim, or replacement. For all returns and replacements, please contact the owner directly (Founder Soumyaa Naveen) via WhatsApp or Call at +91 91117 16355 within 7 days of delivery. Because our crystals absorb personal energetic and auric fields, opened or used items cannot be returned for change of mind.',
    isActive: true,
  },
  {
    id: 'faq-5',
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer:
      'We accept 100% secure encrypted online payments via Razorpay, including UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit & Debit Cards (Visa, MasterCard, RuPay), and NetBanking. Cash on Delivery (COD) is available on selected catalog items.',
    isActive: true,
  },
  {
    id: 'faq-6',
    category: 'Ordering',
    question: 'Do I need an account to place an order?',
    answer:
      'No! You can checkout quickly as a guest. However, creating a free Sumuk Sanctuary account allows you to track your orders in real time, view gemological certificates, save your shipping address, and review your consecrated vault history.',
    isActive: true,
  },
  {
    id: 'faq-7',
    category: 'Crystal Care',
    question: 'Can I wash my crystals with water?',
    answer:
      'It depends on the mineral composition! Quartz crystals like Clear Quartz, Amethyst, Rose Quartz, and Carnelian are water-safe. However, soft or porous stones like Selenite (dissolves in water), Pyrite (oxidizes/rusts), Black Tourmaline, and Hematite must NEVER be soaked in water. Clean them using a soft dry microfiber cloth, sound resonance, or a Selenite charging plate.',
    isActive: true,
  },
  {
    id: 'faq-8',
    category: 'Crystal Care',
    question: 'How do I cleanse and recharge my crystal bracelets at home?',
    answer:
      'The safest and most effective method is placing your crystal bracelets on a Moroccan Selenite charging plate for 4–6 hours, or under the soft light of the monthly Full Moon. Avoid leaving Amethyst or Rose Quartz in harsh direct noon sunlight, as UV radiation can fade their natural hues over time.',
    isActive: true,
  },
];

export default function AdminChatbotManager() {
  const [activeSubTab, setActiveSubTab] = useState('faqs'); // 'faqs' | 'unanswered' | 'settings' | 'analytics'
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [toastMessage, setToastMessage] = useState(null);

  // Modal State for Adding/Editing FAQs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formCategory, setFormCategory] = useState('General');
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Unanswered questions log
  const [unansweredList, setUnansweredList] = useState([
    {
      id: 'unans-1',
      question: 'Do you provide energization certificates for customized 10mm bracelets?',
      timestamp: '2026-10-04T18:24:00Z',
      resolved: false,
    },
    {
      id: 'unans-2',
      question: 'Can I wear Pyrite and Amethyst together on the same wrist?',
      timestamp: '2026-10-05T08:12:00Z',
      resolved: false,
    },
    {
      id: 'unans-3',
      question: 'Do you ship to UAE or international destinations?',
      timestamp: '2026-10-05T09:45:00Z',
      resolved: false,
    },
  ]);

  // General Settings State
  const [settings, setSettings] = useState({
    enabled: true,
    name: 'Sumuk Crystalz Assistant',
    welcomeMessage:
      "Namaste & Welcome! 🙏 I'm the Sumuk Crystalz AI Assistant. How may I assist your crystal journey today?",
    fallbackMessage:
      "I'm here to help with all questions about Sumuk Crystalz products, order tracking, shipping, returns, and crystal care.",
    supportEscalationMessage:
      'Connect directly with Founder & Reiki Master Soumyaa Naveen via WhatsApp at +91 91117 16355.',
  });

  // Load stored FAQs on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('sumuk_chatbot_faqs');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFaqs(parsed);
          }
        }
        const storedUnans = localStorage.getItem('sumuk_unanswered_questions');
        if (storedUnans) {
          const parsed = JSON.parse(storedUnans);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setUnansweredList(parsed);
          }
        }
      } catch (_) {}
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveFaq = (e) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) return;

    let updatedList;
    if (editingFaq) {
      updatedList = faqs.map((f) =>
        f.id === editingFaq.id
          ? {
              ...f,
              category: formCategory,
              question: formQuestion.trim(),
              answer: formAnswer.trim(),
              isActive: formIsActive,
            }
          : f
      );
      showToast('FAQ updated successfully.');
    } else {
      const newFaq = {
        id: 'faq-' + Date.now(),
        category: formCategory,
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        isActive: formIsActive,
      };
      updatedList = [newFaq, ...faqs];
      showToast('New FAQ added to AI Knowledge Base.');
    }

    setFaqs(updatedList);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sumuk_chatbot_faqs', JSON.stringify(updatedList));
      } catch (_) {}
    }

    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleDeleteFaq = (id) => {
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sumuk_chatbot_faqs', JSON.stringify(updated));
      } catch (_) {}
    }
    showToast('FAQ removed.');
  };

  const handleToggleFaqStatus = (id) => {
    const updated = faqs.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f));
    setFaqs(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sumuk_chatbot_faqs', JSON.stringify(updated));
      } catch (_) {}
    }
  };

  const openAddModal = () => {
    setEditingFaq(null);
    setFormCategory('General');
    setFormQuestion('');
    setFormAnswer('');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    setFormCategory(faq.category || 'General');
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormIsActive(faq.isActive !== false);
    setIsModalOpen(true);
  };

  const handleConvertUnansweredToFaq = (unans) => {
    setEditingFaq(null);
    setFormCategory('General');
    setFormQuestion(unans.question);
    setFormAnswer('');
    setFormIsActive(true);
    setIsModalOpen(true);

    // Mark as resolved
    const updated = unansweredList.map((u) => (u.id === unans.id ? { ...u, resolved: true } : u));
    setUnansweredList(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sumuk_unanswered_questions', JSON.stringify(updated));
      } catch (_) {}
    }
  };

  const handleDeleteUnanswered = (id) => {
    const updated = unansweredList.filter((u) => u.id !== id);
    setUnansweredList(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sumuk_unanswered_questions', JSON.stringify(updated));
      } catch (_) {}
    }
    showToast('Question cleared.');
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCat = selectedCategory === 'All Categories' || faq.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#1d1633] border border-amber-400 text-amber-300 text-xs font-mono font-bold shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="glass-panel-3d p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#17122b] via-[#20183b] to-[#120d22] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-3d text-[10px] sm:text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
            <Bot className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>AI Knowledge & Customer Support Architecture</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Sumuk Assistant & FAQ Command Center
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans-ui">
            Manage the AI assistant knowledge base, training FAQs, automated store policy responses, unanswered customer inquiries, and live conversion analytics.
          </p>
        </div>

        {/* Sub-tab Pill Nav */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-black/50 border border-white/10 self-start md:self-auto">
          {[
            { id: 'faqs', label: 'FAQ Knowledge Base', icon: HelpCircle, count: faqs.length },
            {
              id: 'unanswered',
              label: 'Questions Needing Attention',
              icon: AlertCircle,
              count: unansweredList.filter((u) => !u.resolved).length,
              badgeColor: 'bg-rose-500 text-white',
            },
            { id: 'analytics', label: 'Chat Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Bot Behavior', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition active:scale-95 ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                      tab.badgeColor || (isActive ? 'bg-black/30 text-black font-extrabold' : 'bg-white/10 text-neutral-300')
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: FAQ KNOWLEDGE BASE */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-4 animate-fade-in">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#140f28]/90 border border-white/10">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs by keywords or answers..."
                className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-neutral-500 outline-none transition font-sans-ui"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono outline-none transition cursor-pointer"
              >
                {FAQ_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#17122b] text-white">
                    {cat}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={openAddModal}
                className="px-4 py-2 rounded-xl btn-pill-primary text-xs flex items-center gap-1.5 shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Add FAQ</span>
              </button>
            </div>
          </div>

          {/* FAQ Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="p-5 rounded-2xl glass-card-3d border border-white/10 hover:border-amber-500/40 bg-[#0f0b1e]/90 flex flex-col justify-between gap-4 transition-all duration-300 shadow-xl group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                      {faq.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleFaqStatus(faq.id)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition ${
                        faq.isActive !== false
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-500 border border-white/10'
                      }`}
                    >
                      {faq.isActive !== false ? '● Active in AI' : '○ Paused'}
                    </button>
                  </div>

                  <h3 className="font-editorial text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition leading-snug">
                    {faq.question}
                  </h3>

                  <p className="text-xs text-neutral-300 font-sans-ui leading-relaxed line-clamp-3">
                    {faq.answer}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500">ID: {faq.id}</span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(faq)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-amber-400/20 text-neutral-300 hover:text-amber-300 transition"
                      title="Edit FAQ"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-neutral-300 hover:text-rose-400 transition"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: QUESTIONS NEEDING ATTENTION (CONTINUOUS IMPROVEMENT LOOP) */}
      {activeSubTab === 'unanswered' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-sans-ui leading-relaxed flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-white block font-mono uppercase tracking-wider text-[11px] mb-0.5">
                Continuous AI Learning Loop
              </strong>
              These questions were asked by live customers where the assistant had low confidence or requested human escalation. Convert them into official FAQs with 1 click to permanently enrich the AI knowledge base.
            </div>
          </div>

          <div className="space-y-3">
            {unansweredList.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.resolved
                    ? 'bg-black/30 border-white/5 opacity-60'
                    : 'bg-[#140f28]/90 border-amber-500/30 shadow-lg'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.resolved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                      }`}
                    >
                      {item.resolved ? '✓ Resolved into FAQ' : 'Needs Official Answer'}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="font-editorial text-sm sm:text-base font-bold text-white">
                    "{item.question}"
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!item.resolved && (
                    <button
                      type="button"
                      onClick={() => handleConvertUnansweredToFaq(item)}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-mono font-bold flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Convert to FAQ</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteUnanswered(item.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition"
                    title="Dismiss"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CHATBOT ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          {/* Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Conversations', value: '1,428', change: '+18% this week', color: 'text-amber-300' },
              { label: 'Product Searches', value: '3,890', change: '84% match rate', color: 'text-emerald-400' },
              { label: 'In-Chat Add to Vaults', value: '342', change: '₹2.8L generated', color: 'text-purple-300' },
              { label: 'Support Escalations', value: '46', change: '3.2% escalation rate', color: 'text-sky-300' },
            ].map((kpi, idx) => (
              <div key={idx} className="p-5 rounded-2xl glass-card-3d border border-white/10 bg-[#120e24]/90 space-y-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                  {kpi.label}
                </span>
                <p className={`font-editorial text-2xl sm:text-3xl font-bold ${kpi.color}`}>
                  {kpi.value}
                </p>
                <span className="text-[10px] font-mono text-neutral-400 block">{kpi.change}</span>
              </div>
            ))}
          </div>

          {/* Top Inquired Categories */}
          <div className="p-6 rounded-3xl glass-panel-3d border border-white/10 bg-[#0f0b1e]/90 space-y-4 shadow-xl">
            <h3 className="font-editorial text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Most Common Customer Inquiries (Last 30 Days)</span>
            </h3>

            <div className="space-y-3">
              {[
                { topic: 'Pyrite & Money Magnet Wealth Bands (Pricing & 8mm Sizes)', percent: 38, count: '542 queries' },
                { topic: 'Order Tracking & Armored Courier Transit Updates', percent: 24, count: '340 queries' },
                { topic: 'Water Safety Rules (Selenite, Pyrite, Black Tourmaline)', percent: 18, count: '256 queries' },
                { topic: 'Full Moon & Selenite Plate Recharging Instructions', percent: 12, count: '172 queries' },
                { topic: '7-Day Transit Damage Replacement & Video Unboxing', percent: 8, count: '118 queries' },
              ].map((row, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-medium">{row.topic}</span>
                    <span className="text-amber-300 font-bold">{row.count} ({row.percent}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GENERAL BOT BEHAVIOR */}
      {activeSubTab === 'settings' && (
        <div className="p-6 rounded-3xl glass-panel-3d border border-white/10 bg-[#0f0b1e]/90 space-y-5 animate-fade-in">
          <h3 className="font-editorial text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>AI Assistant Configuration & Directives</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-300 uppercase tracking-wider block font-bold">
                Assistant Persona Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-sans-ui outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-300 uppercase tracking-wider block font-bold">
                Consecration Frequency Tag
              </label>
              <input
                type="text"
                defaultValue="Sacred Solfeggio Attunement"
                disabled
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-mono text-neutral-300 uppercase tracking-wider block font-bold">
                Welcome Message Greeting
              </label>
              <textarea
                rows={2}
                value={settings.welcomeMessage}
                onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-sans-ui outline-none transition"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-mono text-neutral-300 uppercase tracking-wider block font-bold">
                Human Support Escalation Template
              </label>
              <textarea
                rows={2}
                value={settings.supportEscalationMessage}
                onChange={(e) => setSettings({ ...settings, supportEscalationMessage: e.target.value })}
                className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-sans-ui outline-none transition"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => showToast('Assistant behavior directives saved.')}
            className="px-6 py-3 rounded-full btn-pill-primary text-xs flex items-center gap-2 shadow-xl active:scale-95"
          >
            <Save className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Save Directives</span>
          </button>
        </div>
      )}

      {/* ADD / EDIT FAQ MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-xl w-full rounded-3xl bg-[#140f28] border border-amber-400/40 p-6 shadow-2xl space-y-5 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-editorial text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{editingFaq ? 'Edit AI Knowledge FAQ' : 'Add New FAQ Entry'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-amber-300 uppercase tracking-wider block font-bold">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none"
                >
                  {FAQ_CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                    <option key={c} value={c} className="bg-[#17122b]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-amber-300 uppercase tracking-wider block font-bold">
                  Question (What customers ask)
                </label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. Can I wear Pyrite and Amethyst together?"
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-sans-ui outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-amber-300 uppercase tracking-wider block font-bold">
                  Official Answer (What the AI will reply)
                </label>
                <textarea
                  required
                  rows={4}
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Explain clearly and concisely. Include water safety and disclaimers if applicable..."
                  className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white font-sans-ui outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                  />
                  <span>Active in live AI Assistant</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-neutral-300 font-mono transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl btn-pill-primary text-xs font-mono font-bold shadow-lg"
                  >
                    {editingFaq ? 'Update FAQ' : 'Save FAQ'}
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
