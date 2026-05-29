/**
 * 
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  CircleAlert, 
  IndianRupee, 
  DollarSign, 
  Euro, 
  Calendar, 
  Users, 
  MapPin, 
  Activity, 
  TrendingUp, 
  Copy, 
  Check, 
  RotateCcw, 
  Info, 
  Plus, 
  HelpCircle,
  Package,
  Wrench,
  AlertTriangle,
  Flame,
  FileCode,
  ArrowRight
} from 'lucide-react';
import { UserInputs, PackageResponse, RentalPackage } from './types';

// Pre-configured dynamic templates for users to test
const PRESETS = [
  {
    name: "🎤 Outdoor Podcast",
    usecase: "Outdoor Podcast live video recording",
    people: "4 guests",
    budget: "18000",
    currency: "INR",
    duration: "2 days",
    location: "Outdoor" as const,
    level: "Intermediate" as const,
    requirements: "Need premium microphone isolators, wind muffs, and portable sound desk with battery backup panels."
  },
  {
    name: "🎬 Backyard Cinema",
    usecase: "Kids birthday backyard movie night",
    people: "25",
    budget: "8500",
    currency: "INR",
    duration: "1 day",
    location: "Outdoor" as const,
    level: "Beginner" as const,
    requirements: "Easy connection to mobile. Includes screen, HD projector, and sound for kids movie night."
  },
  {
    name: "🏢 Corporate Summit",
    usecase: "High-stakes sales presentation & panel",
    people: "150 attendees",
    budget: "75000",
    currency: "INR",
    duration: "3 days",
    location: "Indoor" as const,
    level: "Professional" as const,
    requirements: "Multiple lavalier mics, live mixer, crisp projector with dual screens, clickers, and technical backup systems."
  },
  {
    name: "🎸 Indie Band Concert",
    usecase: "Rooftop acoustic live mini-concert",
    people: "80, outdoors",
    budget: "45000",
    currency: "INR",
    duration: "1 day",
    location: "Outdoor" as const,
    level: "Professional" as const,
    requirements: "Amps, floor monitors, simple stage wash lighting, vocal mics, and cables."
  }
];

export default function App() {
  const [inputs, setInputs] = useState<UserInputs>({
    usecase: "Outdoor Podcast live video recording",
    people: "4 guests",
    budget: "18000",
    currency: "INR",
    duration: "2 days",
    location: "Outdoor",
    level: "Intermediate",
    requirements: "Need premium microphone isolators, wind muffs, and portable sound desk with battery backup panels."
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PackageResponse | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);
  const [showPromptDoc, setShowPromptDoc] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'recommended' | 'premium'>('recommended');

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR':
      default: return '₹';
    }
  };

  // Build the textual prompt exactly as requested by format
  const generatedPromptText = `Use Case: ${inputs.usecase || "[Enter Use Case]"}
People: ${inputs.people || "[Enter Number of People]"}
Budget: ${inputs.budget || "[Enter Budget]"} [Currency: ${inputs.currency}]
Duration: ${inputs.duration || "[Enter Duration]"}
Location: ${inputs.location}
Experience Level: ${inputs.level}
Special Requirements: ${inputs.requirements || "None"}

Recommend a complete rental package with:
1. Package Name
2. Recommended Items
3. Reasons
4. Optional Add-ons
5. Budget Breakdown
6. Package Benefits
7. Final Recommendation

Generate exactly 3 package options: Basic, Recommended, and Premium, comparing them in a comparative table, highlighting omission risks, backup equipment, and sales-oriented upsell opportunities.`;

  // Pre-load initial simulation or call server directly if possible
  useEffect(() => {
    fetchPackages(true);
  }, []);

  const handlePresetSelect = (index: number) => {
    setSelectedPresetIndex(index);
    const preset = PRESETS[index];
    setInputs({
      usecase: preset.usecase,
      people: preset.people,
      budget: preset.budget,
      currency: preset.currency,
      duration: preset.duration,
      location: preset.location,
      level: preset.level,
      requirements: preset.requirements
    });
  };

  const fetchPackages = async (isInitial = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputs)
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to generate rental package recommendation. Let's try again!");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculated properties helper for bar display percentage
  const getPercentage = (val: number, total: number) => {
    if (!total || total <= 0) return 33.3;
    const pct = (val / total) * 100;
    return Math.min(100, Math.max(5, pct));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans flex flex-col antialiased">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 md:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white p-2 rounded-xl shadow-md shadow-orange-500/15">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 id="app-title" className="text-xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2">
                AI Rental Package Builder
                <span className="text-[10px] uppercase tracking-widest font-mono bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded">
                  Pro-Engine
                </span>
              </h1>
              <p className="text-xs text-slate-500">Expert Event & Gear Configuration Analyst</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPromptDoc(!showPromptDoc)}
              id="prompt-preview-btn"
              className={`text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                showPromptDoc 
                  ? 'bg-slate-800 text-white hover:bg-slate-900' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCode className="h-4 w-4" />
              {showPromptDoc ? "Hide Prompt Log" : "View Prompts Sent to AI"}
            </button>
            
            <a 
              href="#equipment-presets"
              className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
            >
              <Info className="h-3.5 w-3.5" />
              <span>Guidelines applied</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Input Workspace & Prompts */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Preset Selector Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400">⚡ Quick Event Presets</span>
              <span className="text-xs text-slate-400">Click to load</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset, i) => (
                <button
                  key={i}
                  id={`preset-btn-${i}`}
                  onClick={() => handlePresetSelect(i)}
                  className={`text-left p-2.5 rounded-xl border text-xs font-medium transition duration-200 cursor-pointer ${
                    selectedPresetIndex === i
                      ? "border-orange-500 bg-orange-50/50 text-orange-950 font-semibold"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="truncate mb-0.5">{preset.name}</div>
                  <div className="text-[10px] text-slate-400/90 truncate">Budget: {getCurrencySymbol(preset.currency)}{preset.budget}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Form card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col gap-5">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <span>🔧 Rental Parameters</span>
              </h2>
              <p className="text-xs text-slate-500">Configure your specific customer requirements & logistics</p>
            </div>

            <div className="space-y-4">
              {/* Event / Use Case */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                  <span>use case / event type</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  id="usecase"
                  type="text"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition duration-150 bg-slate-50/50 hover:bg-slate-50"
                  placeholder="e.g., Backyard acoustic live band setup, YouTube studio, DSLR filming"
                  value={inputs.usecase}
                  onChange={(e) => setInputs({ ...inputs, usecase: e.target.value })}
                />
              </div>

              {/* Number of People & Budget Row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    audience / people
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Users className="h-4 w-4" />
                    </span>
                    <input
                      id="people"
                      type="text"
                      className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition duration-150 bg-slate-50/50"
                      placeholder="e.g., 50 people"
                      value={inputs.people}
                      onChange={(e) => setInputs({ ...inputs, people: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    rental duration
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <input
                      id="duration"
                      type="text"
                      className="w-full text-sm pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition duration-150 bg-slate-50/50"
                      placeholder="e.g., 3 days"
                      value={inputs.duration}
                      onChange={(e) => setInputs({ ...inputs, duration: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Currency & Budget Input Row */}
              <div className="grid grid-cols-12 gap-3.5">
                <div className="col-span-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Currency
                  </label>
                  <select
                    id="currency-select"
                    className="w-full text-sm px-2.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition duration-150 bg-slate-50/50"
                    value={inputs.currency}
                    onChange={(e) => setInputs({ ...inputs, currency: e.target.value })}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div className="col-span-8">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Budget Limit
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                      {getCurrencySymbol(inputs.currency)}
                    </span>
                    <input
                      id="budget"
                      type="number"
                      className="w-full text-sm pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition duration-150 bg-slate-50/50 font-mono"
                      placeholder="Budget limit"
                      value={inputs.budget}
                      onChange={(e) => setInputs({ ...inputs, budget: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Setting Location & Experience Level Row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Location
                  </label>
                  <select
                    id="location"
                    value={inputs.location}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition duration-150 bg-slate-50/50"
                    onChange={(e) => setInputs({ ...inputs, location: e.target.value as any })}
                  >
                    <option value="Indoor">🏢 Indoor</option>
                    <option value="Outdoor">🌳 Outdoor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Experience Level
                  </label>
                  <select
                    id="level"
                    value={inputs.level}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition duration-150 bg-slate-50/50"
                    onChange={(e) => setInputs({ ...inputs, level: e.target.value as any })}
                  >
                    <option value="Beginner">⭐ Beginner</option>
                    <option value="Intermediate">⚡ Intermediate</option>
                    <option value="Professional">👑 Professional</option>
                  </select>
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Special Requirements
                </label>
                <textarea
                  id="requirements"
                  rows={3}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition duration-150 bg-slate-50/50 resize-none"
                  placeholder="e.g., wireless preferred, emergency backup fuel generators, extra long cables, high-contrast monitors..."
                  value={inputs.requirements}
                  onChange={(e) => setInputs({ ...inputs, requirements: e.target.value })}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                _id="reset-inputs-btn"
                onClick={() => {
                  setInputs({
                    usecase: "",
                    people: "",
                    budget: "",
                    currency: "INR",
                    duration: "",
                    location: "Indoor",
                    level: "Beginner",
                    requirements: ""
                  });
                  setSelectedPresetIndex(-1);
                }}
                className="px-3 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                title="Reset Form Fields"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              
              <button
                id="generate-packages-btn"
                onClick={() => fetchPackages()}
                disabled={loading || !inputs.usecase}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold py-2.5 rounded-xl hover:shadow-md transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Configuring Packages...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-amber-200" />
                    <span>Generate Package Options</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* System Prompt Code Viewer */}
          {showPromptDoc && (
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-lg border border-slate-800 flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400 font-bold tracking-wider uppercase text-[10px]">📟 Simulated Prompt Pipeline</span>
                <button
                  onClick={() => copyToClipboard(generatedPromptText, setCopiedPrompt)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-1 rounded transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-[10px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span className="text-[10px]">Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                This is the raw, formatted schema and prompt structure sent downstream to the Gemini AI models to build package options perfectly scaled into Basic, Recommended, and Premium options.
              </p>
              <pre id="output" className="bg-slate-950 p-3.5 rounded-lg text-amber-200/90 max-h-64 overflow-y-auto whitespace-pre-wrap text-[11px] leading-relaxed select-all">
                {generatedPromptText}
              </pre>
            </div>
          )}

        </div>

        {/* Right Side: recommendations, tables & charts */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {loading ? (
            /* Custom visual shimmer loaders */
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm flex flex-col gap-6 items-center justify-center text-center py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-orange-50 border border-orange-200 p-5 rounded-full text-orange-500 animate-pulse">
                  <Package className="h-10 w-10" />
                </div>
              </div>
              <div className="max-w-md">
                <h3 className="font-bold text-lg font-display text-slate-800">Synthesizing Rental Packages...</h3>
                <p className="text-sm text-slate-500 mt-1.5">
                  Analyzing attendee count, reviewing safety requirements, compiling budget allocations, and designing custom packages for <strong className="text-slate-700">"{inputs.usecase || "your project"}"</strong>.
                </p>
              </div>

              {/* Simulating checklist progress */}
              <div className="w-full max-w-sm bg-slate-50 border border-slate-100 rounded-xl p-4 text-left text-xs text-slate-500 space-y-2 mt-4 font-mono">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Extracting structural omit risks...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Scaling Basic, Mid, & Elite tiers...</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-slate-300"></span>
                  <span>Generating comparative hardware table matrix...</span>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-start">
              <div className="bg-red-100 p-3 rounded-xl text-red-600 shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-red-950 font-display">Optimization Interrupted</h3>
                <p className="text-sm text-red-800 mt-1">{error}</p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => fetchPackages()}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Try to Compile Again
                  </button>
                  <span className="text-xs text-slate-500">Check if your GEMINI_API_KEY is configured in Settings {`>`} Secrets.</span>
                </div>
              </div>
            </div>
          ) : result ? (
            /* Result Dashboard */
            <div className="space-y-6">
              
              {/* Active Package display & Tabs selector */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-100 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-mono bg-slate-800 border border-slate-700 px-2.5 py-1 rounded text-orange-400 font-bold">
                        Event Specs Recommendation
                      </span>
                      <h3 className="text-lg font-bold font-display tracking-tight text-white mt-1.5 flex items-center gap-1.5">
                        {inputs.usecase}
                      </h3>
                    </div>

                    {/* Copy JSON Button */}
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2), setCopiedResponse)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700/80 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-300 hover:text-white transition cursor-pointer self-start sm:self-center"
                    >
                      {copiedResponse ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Copied JSON</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Raw Data Export</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Level & Setting Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-medium">
                    <span className="bg-white/10 px-2.5 py-1 rounded-md text-slate-200">
                      📶 Level: <strong>{inputs.level}</strong>
                    </span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-md text-slate-200">
                      📍 Layout: <strong>{inputs.location}</strong>
                    </span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-md text-slate-200">
                      👥 Crowd: <strong>{inputs.people || "Dynamic"}</strong>
                    </span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-md text-slate-200">
                      ⏱️ Term: <strong>{inputs.duration || "Short Term"}</strong>
                    </span>
                  </div>
                </div>

                {/* Tab buttons for Basic, Recommended, Premium */}
                <div className="border-b border-slate-200 flex p-2 bg-slate-50 gap-2">
                  <button
                    onClick={() => setSelectedTier('basic')}
                    className={`flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
                      selectedTier === 'basic'
                        ? 'bg-slate-200/80 text-slate-900 font-bold border-b-2 border-slate-800'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    🥉 Basic Package
                    <div className="text-[10px] text-slate-400 font-normal">
                      Cost: {getCurrencySymbol(inputs.currency)}{result.basicPackage.items.reduce((acc, it) => acc + (it.cost || 0), 0).toLocaleString()}
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedTier('recommended')}
                    className={`flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold transition duration-150 relative cursor-pointer ${
                      selectedTier === 'recommended'
                        ? 'bg-orange-100/80 text-orange-950 font-bold border-b-2 border-orange-500'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className="absolute -top-1 right-2 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                      Best Value
                    </span>
                    🥈 Recommended
                    <div className="text-[10px] text-slate-500 font-normal">
                      Cost: {getCurrencySymbol(inputs.currency)}{result.recommendedPackage.items.reduce((acc, it) => acc + (it.cost || 0), 0).toLocaleString()}
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedTier('premium')}
                    className={`flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
                      selectedTier === 'premium'
                        ? 'bg-amber-100 text-amber-950 font-bold border-b-2 border-amber-600'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    👑 Premium Package
                    <div className="text-[10px] text-slate-400 font-normal">
                      Cost: {getCurrencySymbol(inputs.currency)}{result.premiumPackage.items.reduce((acc, it) => acc + (it.cost || 0), 0).toLocaleString()}
                    </div>
                  </button>
                </div>

                {/* Selected Package Details */}
                {(() => {
                  const activePack: RentalPackage = 
                    selectedTier === 'basic' 
                      ? result.basicPackage 
                      : selectedTier === 'premium' 
                      ? result.premiumPackage 
                      : result.recommendedPackage;

                  const totalCost = activePack.items.reduce((sum, item) => sum + (item.cost || 0), 0);

                  return (
                    <div className="p-6 space-y-6">
                      
                      {/* Name & Dynamic Quote Card */}
                      <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-bold">Package Blueprint Title</div>
                          <h4 className="text-base font-bold text-slate-800 font-display mt-0.5">
                            {activePack.packageName}
                          </h4>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-bold">Estimated Total Quote</div>
                          <div className="text-xl font-black text-slate-900 mt-0.5 font-display flex items-center gap-1">
                            <span className="text-sm font-semibold">{getCurrencySymbol(inputs.currency)}</span>
                            {totalCost.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Equipment List */}
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold mb-3 flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-slate-400" />
                          <span>Hardware & Core Gear included</span>
                        </h4>
                        
                        <div className="space-y-2.5">
                          {activePack.items.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="p-3 bg-white border border-slate-150 rounded-xl hover:border-slate-300 hover:shadow-xs transition flex flex-col sm:flex-row justify-between items-start gap-2 text-xs"
                            >
                              <div className="space-y-1 max-w-md">
                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                  <span className="bg-slate-100 text-slate-700 h-5 px-1.5 rounded flex items-center justify-center font-mono text-[10px]">
                                    Qty: {item.quantity}
                                  </span>
                                  <span>{item.name}</span>
                                </div>
                                <p className="text-slate-500 leading-relaxed text-[11px]">{item.reason}</p>
                              </div>
                              <div className="font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100 self-end sm:self-start">
                                {getCurrencySymbol(inputs.currency)}{item.cost?.toLocaleString() || "Included"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Optional Add-ons */}
                      {activePack.optionalAddOns && activePack.optionalAddOns.length > 0 && (
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-mono font-bold mb-3 flex items-center gap-1.5">
                            <Plus className="h-4 w-4 text-orange-500" />
                            <span>Suggested Experience Booster Add-ons</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {activePack.optionalAddOns.map((addon, subIdx) => (
                              <div key={subIdx} className="bg-orange-50/40 border border-orange-100 rounded-xl p-3 text-xs">
                                <div className="flex justify-between items-start mb-1 gap-1.5">
                                  <span className="font-bold text-orange-950">{addon.name}</span>
                                  <span className="font-mono font-bold text-orange-600 bg-white px-1.5 py-0.5 border border-orange-200/55 rounded scale-90">
                                    +{getCurrencySymbol(inputs.currency)}{addon.cost?.toLocaleString() || "TBD"}
                                  </span>
                                </div>
                                <p className="text-slate-500 text-[11px] leading-relaxed">{addon.reason}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Estimated Budget Breakdowns with visual bar splits */}
                      {activePack.budgetSplit && (
                        <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-xl space-y-3.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wider text-slate-500 font-mono font-bold">Estimated Quote Split breakdown</span>
                            <span className="text-[10px] text-slate-400 font-mono">100% Total Scale</span>
                          </div>
                          
                          {(() => {
                            const { equipment = 0, accessories = 0, miscellaneous = 0 } = activePack.budgetSplit;
                            const combined = (equipment + accessories + miscellaneous) || 1;
                            const eqPct = getPercentage(equipment, combined);
                            const acPct = getPercentage(accessories, combined);
                            const msPct = getPercentage(miscellaneous, combined);

                            return (
                              <div className="space-y-3">
                                {/* Visual split bar progress */}
                                <div className="h-4.5 w-full flex rounded-lg overflow-hidden bg-slate-200 text-[9px] font-mono text-white text-center font-bold">
                                  <div 
                                    style={{ width: `${eqPct}%` }}
                                    className="bg-indigo-600 flex items-center justify-center transition-all duration-300"
                                    title={`Equipment: ${eqPct.toFixed(1)}%`}
                                  >
                                    {eqPct > 15 && "Core"}
                                  </div>
                                  <div 
                                    style={{ width: `${acPct}%` }}
                                    className="bg-orange-500 flex items-center justify-center transition-all duration-300"
                                    title={`Accessories: ${acPct.toFixed(1)}%`}
                                  >
                                    {acPct > 15 && "Accs"}
                                  </div>
                                  <div 
                                    style={{ width: `${msPct}%` }}
                                    className="bg-slate-400 flex items-center justify-center transition-all duration-300"
                                    title={`Misc: ${msPct.toFixed(1)}%`}
                                  >
                                    {msPct > 15 && "Misc"}
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2.5 text-xs">
                                  <div>
                                    <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                                      <span className="h-2 w-2 rounded-full bg-indigo-600 inline-block"></span>
                                      <span>Equipment</span>
                                    </div>
                                    <p className="font-mono font-bold text-slate-800 pl-3.5">
                                      {getCurrencySymbol(inputs.currency)}{equipment.toLocaleString()}
                                    </p>
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                                      <span className="h-2 w-2 rounded-full bg-orange-500 inline-block"></span>
                                      <span>Accessories</span>
                                    </div>
                                    <p className="font-mono font-bold text-slate-800 pl-3.5">
                                      {getCurrencySymbol(inputs.currency)}{accessories.toLocaleString()}
                                    </p>
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                                      <span className="h-2 w-2 rounded-full bg-slate-400 inline-block"></span>
                                      <span>Misc</span>
                                    </div>
                                    <p className="font-mono font-bold text-slate-800 pl-3.5">
                                      {getCurrencySymbol(inputs.currency)}{miscellaneous.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Package Benefits */}
                      {activePack.benefits && activePack.benefits.length > 0 && (
                        <div>
                          <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-bold mb-2">
                            Key Package Advantages & Guarantees
                          </h4>
                          <div className="space-y-1.5">
                            {activePack.benefits.map((benefit, bIdx) => (
                              <div key={bIdx} className="flex items-start gap-2 text-xs">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-slate-600 font-medium leading-relaxed">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Final recommendation */}
                      <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-amber-950 font-display flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-amber-600" />
                          <span>Expert Configuration Assessment</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed italic">{activePack.finalRecommendation}</p>
                      </div>

                    </div>
                  );
                })()}
              </div>

              {/* Package Comparison Grid Table */}
              {result.comparisonTable && result.comparisonTable.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 overflow-x-auto">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-slate-500" />
                      <span>Configuration Comparison Table</span>
                    </h3>
                    <p className="text-xs text-slate-500">Quick side-by-side spec comparison between all three package tiers</p>
                  </div>

                  <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-2.5">Feature/Spec Comparison</th>
                        <th className="p-2.5">🥉 Basic</th>
                        <th className="p-2.5 bg-orange-50/50 text-orange-950 border-x border-orange-100">🥈 Recommended</th>
                        <th className="p-2.5">👑 Premium</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.comparisonTable.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-semibold text-slate-700">{row.feature}</td>
                          <td className="p-2.5 text-slate-500">{row.basic}</td>
                          <td className="p-2.5 bg-orange-50/30 text-slate-900 font-medium border-x border-orange-100/60">{row.recommended}</td>
                          <td className="p-2.5 text-slate-600 font-medium">{row.premium}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Warnings and Safety Checkpoints Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Risks If Omitted Section */}
                {result.risksIfOmitted && result.risksIfOmitted.length > 0 && (
                  <div className="bg-white rounded-2xl border border-rose-200/70 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-rose-100 pb-2 text-rose-800">
                      <AlertTriangle className="h-5 w-5 text-rose-500 inline shrink-0" />
                      <h4 className="font-bold text-sm font-display text-rose-950">Critical Risks (If Omitted)</h4>
                    </div>

                    <div className="space-y-3 text-xs leading-normal">
                      {result.risksIfOmitted.map((risk, idx) => (
                        <div key={idx} className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 relative">
                          <strong className="block text-rose-950 text-[11px] uppercase tracking-wide font-bold">
                            Missing: {risk.equipment}
                          </strong>
                          <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{risk.risk}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Backups & Upsell Block */}
                <div className="flex flex-col gap-6">
                  {/* Backup Protection Equipment */}
                  {result.backupEquipment && result.backupEquipment.length > 0 && (
                    <div className="bg-white rounded-2xl border border-emerald-200/75 p-5 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 border-b border-emerald-100 pb-2 text-emerald-800">
                        <Wrench className="h-5 w-5 text-emerald-500" />
                        <h4 className="font-bold text-xs uppercase tracking-wider font-mono font-bold text-emerald-950">
                          Recommended Backups
                        </h4>
                      </div>
                      
                      <div className="space-y-2">
                        {result.backupEquipment.map((backup, idx) => (
                          <div key={idx} className="text-xs p-2.5 bg-emerald-50/40 rounded-lg border border-emerald-100">
                            <span className="font-bold text-emerald-950 block">{backup.name}</span>
                            <span className="text-slate-500 text-[11px] leading-snug mt-0.5 block">{backup.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upsell/Satisfaction opportunities */}
                  {result.upsellOpportunities && result.upsellOpportunities.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200/60 p-5 rounded-2xl shadow-sm space-y-3 flex-1">
                      <div className="flex items-center gap-2 border-b border-orange-100 pb-2">
                        <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                        <h4 className="font-bold text-sm font-display text-orange-950">Satisfaction Multipliers</h4>
                      </div>

                      <div className="space-y-3">
                        {result.upsellOpportunities.map((up, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="font-bold text-orange-950 block flex items-center gap-1">
                              <ArrowRight className="h-3 w-3 text-orange-500" />
                              {up.idea}
                            </span>
                            <p className="text-slate-600 text-[11px] leading-snug pl-4 mt-0.5">{up.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          ) : (
            /* Blank onboarding state */
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm flex flex-col items-center justify-center text-center py-24">
              <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-full text-slate-400 mb-4 animate-bounce">
                <Package className="h-12 w-12" />
              </div>
              <h3 className="font-bold text-lg font-display text-slate-800">No Rental Request Generated</h3>
              <p className="text-slate-500 max-w-sm text-sm mt-2">
                Configure your event parameters on the left worksheet or select one of our premium preset options, then press <strong>Generate Package Options</strong>.
              </p>
              
              <div className="mt-6 flex flex-col items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400">or load a default config</span>
                <button
                  onClick={() => handlePresetSelect(0)}
                  className="bg-slate-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                >
                  Load 🎤 Outdoor Podcast Preset
                </button>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Persistent Guidelines Footer */}
      <footer id="equipment-presets" className="bg-white border-t border-slate-200 mt-12 py-8 px-4 text-center text-slate-500 text-xs">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
            ⚙️ AI Rental Package Builder Specifications
          </p>
          <p className="leading-relaxed">
            Designed for professional equipment organizations to optimize sound system setups, cameras, projection scopes, and backup modules.
            Estimates are calculated using a real-time relative model constraints matching safety protocols and budget limits safely.
          </p>
          <div className="flex justify-center gap-4 text-slate-400 font-mono text-[10px]">
            <span>ENGINE: models/gemini-3.5-flash</span>
            <span>•</span>
            <span>PORT: 3000 (Proxy)</span>
            <span>•</span>
            <span>PERSISTENCE: Live Session REST API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
