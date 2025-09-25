import React, { useMemo, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Calculator, Home, Lightbulb, Sofa, DollarSign } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import FloatingElements from '../components/FloatingElements';
import { db } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { hasMinLen, isEmail, isNumberAtLeast, isPhone } from '../utils/validation';
import emailjs from '@emailjs/browser';
import { generateDesignQuotePdf } from '../utils/pdf';





type BudgetKey = 'basic' | 'balanced' | 'premium';
type CategoryKey = 'design' | 'materials' | 'lighting' | 'furniture' | 'execution';
type ProjectSize = 'small' | 'medium' | 'large';

type Category = {
  id: CategoryKey;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  percentage: number;
};

type LevelMap = Record<BudgetKey, { multiplier: number; label: string }>;
type ExpandedState = Record<CategoryKey, boolean>;





const budgetLevels: LevelMap = {
  basic: { multiplier: 0.7, label: 'Basic' },
  balanced: { multiplier: 1.0, label: 'Balanced' },
  premium: { multiplier: 1.5, label: 'Premium' },
};

const categories: Category[] = [
  {
    id: 'design',
    label: 'Design & Planning',
    icon: Calculator,
    description: 'Architectural drawings, 3D modeling, permits',
    percentage: 20,
  },
  {
    id: 'materials',
    label: 'Materials & Structure',
    icon: Home,
    description: 'Construction materials, structural work',
    percentage: 35,
  },
  {
    id: 'lighting',
    label: 'Lighting & Electrical',
    icon: Lightbulb,
    description: 'Electrical work, lighting design, automation',
    percentage: 15,
  },
  {
    id: 'furniture',
    label: 'Furniture & Decor',
    icon: Sofa,
    description: 'Custom furniture, decor, styling',
    percentage: 20,
  },
  {
    id: 'execution',
    label: 'Execution & Finishing',
    icon: DollarSign,
    description: 'Labor, project management, finishing',
    percentage: 10,
  },
];

const sizeMultipliers: Record<
  ProjectSize,
  { label: string; multiplier: number; sqft: string }
> = {
  small: { label: '1-2 BHK', multiplier: 1.0, sqft: '600–900' },
  medium: { label: '3-4 BHK', multiplier: 1.8, sqft: '1200–1800' },
  large: { label: '4+ BHK / Villa', multiplier: 3.0, sqft: '2000+' },
};

const baseAmount = 800_000;


const levelDescriptions: Record<BudgetKey, string> = {
  basic:
    'Essential features, standard materials, and minimal customization.',
  balanced:
    'Balanced quality & value, with selective customization and premium touches.',
  premium:
    'Top-tier materials, end-to-end customization, and luxury features.',
};


const details: Record<CategoryKey, Record<BudgetKey, string[]>> = {
  design: {
    basic: ['Basic floor plans', 'Standard 2D drawings', 'Limited revisions'],
    balanced: [
      'Detailed 2D/3D plans',
      '3D modeling',
      'Up to 3 design revisions',
    ],
    premium: [
      'Full 3D walkthroughs',
      'Unlimited revisions',
      'Permit-ready documentation',
    ],
  },
  materials: {
    basic: [
      'Standard grade materials',
      'Basic finishes',
      'Vendor selection by studio',
    ],
    balanced: [
      'Premium materials',
      'Choice of finishes',
      'Material samples provided',
    ],
    premium: [
      'Luxury materials',
      'Custom finishes',
      'Exclusive vendor sourcing',
    ],
  },
  lighting: {
    basic: ['Standard lighting plan', 'Basic fixtures', 'Standard automation'],
    balanced: ['Designer fixtures', 'Layered lighting', 'Smart controls'],
    premium: [
      'Architectural lighting',
      'Full home automation',
      'Custom fixture design',
    ],
  },
  furniture: {
    basic: ['Standard furniture selection', 'Minimal decor', 'Suggested brands'],
    balanced: ['Custom furniture options', 'Premium decor', 'Brand flexibility'],
    premium: ['Bespoke furniture', 'Designer decor', 'Art curation included'],
  },
  execution: {
    basic: [
      'Standard project management',
      'Basic site supervision',
      'Standard warranty',
    ],
    balanced: [
      'Dedicated project manager',
      'Frequent site visits',
      'Extended warranty',
    ],
    premium: [
      'White-glove execution',
      'Priority scheduling',
      'Premium aftercare',
    ],
  },
};





const formatINR = (value: number) =>
  `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;





const DesignQuotient: React.FC = () => {
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  
  const [budget, setBudget] = useState<Record<CategoryKey, BudgetKey>>({
    design: 'balanced',
    materials: 'balanced',
    lighting: 'balanced',
    furniture: 'balanced',
    execution: 'balanced',
  });

  const [expanded, setExpanded] = useState<ExpandedState>({
    design: true,
    materials: false,
    lighting: false,
    furniture: false,
    execution: false,
  });

  const [projectSize, setProjectSize] = useState<ProjectSize>('medium');
  const [area, setArea] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [propertySubtype, setPropertySubtype] = useState<string>('Apartment');
  const [location, setLocation] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('New Build');
  const [priorities, setPriorities] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [emailStatus, setEmailStatus] = useState<'pending' | 'sent' | 'failed' | 'skipped' | null>(null);
  const [error, setError] = useState<string>('');
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);

  

  const totalMultiplierFromSelections = useMemo(() => {
    return categories.reduce((acc, cat) => {
      const catMultiplier = budgetLevels[budget[cat.id]].multiplier;
      return acc + (catMultiplier * cat.percentage) / 100;
    }, 0);
  }, [budget]);

  const totalCost = useMemo(() => {
    const sizeMult = sizeMultipliers[projectSize].multiplier;
    return Math.round(baseAmount * sizeMult * totalMultiplierFromSelections);
  }, [projectSize, totalMultiplierFromSelections]);

  const categoryAmount = (cat: Category) =>
    Math.round((totalCost * cat.percentage) / 100);

  
  const perSqFt = useMemo(() => {
    const n = Number(area);
    if (!n || n <= 0) return null;
    return Math.round(totalCost / n);
  }, [area, totalCost]);

  

  const toggleExpanded = (key: CategoryKey) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const togglePriority = (opt: string) =>
    setPriorities((p) =>
      p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]
    );

  const handleEstimate: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    
    if (!hasMinLen(name, 2)) {
      setError('Please enter your name (min 2 characters).');
      return;
    }
    if (!isEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!hasMinLen(phone, 7) || !isPhone(phone)) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!hasMinLen(location, 2)) {
      setError('Please enter a location.');
      return;
    }
    if (!isNumberAtLeast(area, 100)) {
      setError('Please enter a valid area in sq.ft. (min 100).');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'quotes'), {
        name,
        email,
        phone,
        propertySubtype,
        location,
        purpose,
        priorities,
        notes,
        area: Number(area),
        projectSize,
        budget,
        total: totalCost,
        perSqFt,
        createdAt: Timestamp.now(),
      });
        
        
        
        
        
        
        
        
        const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined) ?? 'service_d6oq5al';
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

        if (!templateId || !publicKey) {
          
          
          
          console.warn('EmailJS missing templateId or publicKey. Skipping email send. templateId=', templateId, 'publicKey=', !!publicKey);
          setEmailStatus('skipped');
        } else {
          setEmailStatus('pending');
          try {
            
            
            try {
              emailjs.init(publicKey);
            } catch (initErr) {
              
              console.warn('EmailJS init warning:', initErr);
            }

            

            
            const minimalParams = {
              name,
              email,
            } as Record<string, unknown>;

            
            const resp = await emailjs.send(serviceId, templateId, minimalParams, publicKey);
            
            
            console.info('EmailJS send response:', resp);
            setEmailStatus('sent');
          } catch (emailErr: any) {
            
            
            
            console.warn('EmailJS send failed:', emailErr);
            if (emailErr && typeof emailErr === 'object') {
              
              
              console.warn('EmailJS error details:', emailErr.status ?? emailErr.text ?? emailErr.message ?? emailErr);
            }
            setEmailStatus('failed');
          }
        }

        setSuccess(true);
    } catch (err) {
      setError('Failed to save quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNow = () => {
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      window.setTimeout(() => {
        nameInputRef.current?.focus();
      }, 500);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setPdfLoading(true);
      
      const cats = categories.map((cat) => ({
        id: cat.id,
        label: cat.label,
        percentage: cat.percentage,
        amount: categoryAmount(cat),
        level: budget[cat.id],
      }));

      await generateDesignQuotePdf({
        name,
        email,
        phone,
        propertySubtype,
        location,
        purpose,
        priorities,
        notes,
        area: Number(area) || 0,
        projectSize,
        projectSizeLabel: sizeMultipliers[projectSize].label,
        projectSizeSqftHint: sizeMultipliers[projectSize].sqft,
        totalCost,
        perSqFt,
        categories: cats,
      });
    } catch (err) {
      
      console.warn('PDF generation failed:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  
  
  

  return (
    <div className="bg-black text-white min-h-screen">
      {}
      <section
        className="relative h-[62vh] min-h-[520px] overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <FloatingElements />
        <div className="relative z-10 h-full flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="max-w-3xl">
              <div className="section-subtitle">
                <AnimatedText text="CALCULATE" type="fade-in" delay={300} />
              </div>
              <h1 className="section-title">
                <AnimatedText text="DESIGN QUOTIENT" type="slide-up" delay={500} />
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-white/80 max-w-2xl">
                <AnimatedText
                  text="Get a clear, tailored estimate for your project based on your preferences in design, materials, lighting, furniture, and finishing."
                  type="slide-up"
                  delay={750}
                />
              </p>

              <div className="mt-10 opacity-0 animate-fade-in [animation-delay:900ms]">
                <button
                  type="button"
                  onClick={handleStartNow}
                  className="btn-primary btn-compact group inline-flex items-center justify-center"
                >
                  <span>START NOW</span>
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="calculator" className="relative z-10 py-14">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <form
            onSubmit={handleEstimate}
            className="grid grid-cols-1 lg:grid-cols-[1fr,minmax(320px,380px)] gap-8"
          >
            {}
            <div className="space-y-8">
              {}
              <div className="card-elevated p-7 rounded-none">
                <h2 className="text-title uppercase tracking-[0.2em] font-light mb-6">Project Basics</h2>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/60 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      ref={nameInputRef}
                      className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/60 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/60 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                      placeholder="Contact Number"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/60 mb-2">
                      Property Type
                    </label>
                    <select
                      value={propertySubtype}
                      onChange={(e) => setPropertySubtype(e.target.value)}
                      className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40"
                    >
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>Bungalow</option>
                      <option>Row House</option>
                      <option>Office</option>
                      <option>Retail</option>
                      <option>Restaurant</option>
                      <option>Studio</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/60 mb-2">
                      Project Purpose
                    </label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40"
                    >
                      <option>New Build</option>
                      <option>Renovation</option>
                      <option>Interior Only</option>
                      <option>Extension</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/60 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                      placeholder="City / Area"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/60 mb-2">
                      Project Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(sizeMultipliers) as ProjectSize[]).map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setProjectSize(k)}
                          className={`px-3 py-2 text-sm font-light uppercase tracking-wide transition border
                            ${
                              projectSize === k
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-white/80 border-white/15 hover:bg-white/10'
                            }`}
                          aria-pressed={projectSize === k}
                        >
                          {sizeMultipliers[k].label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      Approx. {sizeMultipliers[projectSize].sqft} sq.ft
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/60 mb-2">
                      Area (sq.ft)
                    </label>
                    <input
                      type="number"
                      min={100}
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                      placeholder="e.g. 850"
                      required
                    />
                    {perSqFt && (
                      <p className="text-xs text-white/60 mt-2">
                        Approx. {formatINR(perSqFt)} per sq.ft
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase text-white/60 mb-2">
                      Design Priorities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Sustainability',
                        'Smart Home',
                        'Luxury',
                        'Fast Delivery',
                        'Budget-Friendly',
                        'Minimalism',
                        'Vastu',
                        'Pet Friendly',
                        'Aging in Place',
                        'Other',
                      ].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`px-3 py-1 rounded-full border text-xs font-medium tracking-wide transition
                            ${
                              priorities.includes(opt)
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-black/20 text-white/70 border-white/15 hover:bg-white/10'
                            }`}
                          onClick={() => togglePriority(opt)}
                          aria-pressed={priorities.includes(opt)}
                          aria-label={`Toggle priority ${opt}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs tracking-[0.2em] uppercase text-white/60 mb-2">
                    Special Requests / Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 min-h-[72px]"
                    placeholder="Anything else you'd like us to know?"
                    rows={4}
                  />
                </div>
              </div>

              {}
              <div className="grid md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-8">
                {categories.map((cat) => {
                  const SelectedIcon = cat.icon;
                  const selectedLevel = budget[cat.id];

                  return (
                    <div
                      key={cat.id}
                      className={`card-minimal rounded-none transition-all duration-300 shadow-2xl flex flex-col
                                  ${expanded[cat.id] ? 'border-white/30' : ''}`}
                    >
                      {}
                      <div className="p-7 pb-4 flex items-start justify-between">
                        <div className="flex gap-3">
                          <SelectedIcon className="w-6 h-6 text-white/70 mt-1" />
                          <div>
                            <h3 className="text-base font-light uppercase tracking-wide leading-tight">
                              {cat.label}
                            </h3>
                            <p className="text-xs text-white/60 font-light">
                              {cat.percentage}% of total
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="text-xs text-white/70 underline hover:text-white"
                          onClick={() => toggleExpanded(cat.id)}
                          aria-expanded={expanded[cat.id]}
                        >
                          {expanded[cat.id] ? 'Hide details' : 'What’s included?'}
                        </button>
                      </div>

                      {}
                      <div className="px-7 pb-7">
                        <p className="text-sm text-white/70 mb-3">
                          {cat.description}
                        </p>

                        <div className="text-2xl font-light tracking-wide mb-4">
                          {formatINR(categoryAmount(cat))}
                        </div>

                        {}
        <div className="grid grid-cols-3 gap-2 w-full mt-2 mb-4">
                          {(Object.keys(budgetLevels) as BudgetKey[]).map((key) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() =>
                                setBudget((prev) => ({ ...prev, [cat.id]: key }))
                              }
          className={`w-full h-11 leading-[1.2] text-[12px] font-light uppercase tracking-[0.02em] transition border inline-flex items-center justify-center whitespace-nowrap px-4
                                ${
                                  selectedLevel === key
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-white/80 border-white/15 hover:bg-white/10'
                                }`}
                              aria-pressed={selectedLevel === key}
                            >
                              {budgetLevels[key].label}
                            </button>
                          ))}
                        </div>

                        {}
                        <div className="mt-3 text-xs text-white/60">
                          {levelDescriptions[selectedLevel]}
                        </div>

                        {}
                        <div
                          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out
                                      ${expanded[cat.id] ? 'max-h-[320px] opacity-100' : 'max-h-0 opacity-0'}`}
                          aria-hidden={!expanded[cat.id]}
                        >
                          <div className="mt-4 minimal-border bg-transparent p-4 text-sm text-white/80">
                            <div className="font-light uppercase tracking-wide mb-2">
                              What’s included
                            </div>
                            <ul className="list-disc list-inside pl-5 space-y-1">
                              {details[cat.id][selectedLevel].map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {}
            <aside className="lg:sticky lg:top-8 h-max">
              <div className="card-elevated rounded-none p-8">
                <h3 className="text-title uppercase tracking-[0.2em] font-light mb-2">
                  Estimated Project Cost
                </h3>

                <div className="text-5xl font-extralight tracking-[0.05em] mb-3">
                  {formatINR(totalCost)}
                </div>

                <p className="text-white/70 text-sm">
                  {sizeMultipliers[projectSize].label} •{' '}
                  {sizeMultipliers[projectSize].sqft} sq.ft
                </p>
                {perSqFt && (
                  <p className="text-white/60 text-sm mt-1">
                    ~ {formatINR(perSqFt)} per sq.ft
                  </p>
                )}

                <div className="mt-6 border-t border-white/10 pt-4 space-y-2 text-sm">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between">
                      <span className="text-white/70 uppercase tracking-wide text-xs">{cat.label}</span>
                      <span className="font-light">{formatINR(categoryAmount(cat))}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 btn-primary btn-compact"
                  disabled={loading}
                >
                  {loading ? 'Saving…' : 'Mail & Save Quote'}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="w-full mt-3 btn-secondary btn-compact border border-white/20 hover:border-white/40"
                  disabled={pdfLoading}
                >
                  {pdfLoading ? 'Generating…' : 'Download PDF'}
                </button>

                {error && (
                  <div className="text-red-100 text-xs mt-3">{error}</div>
                )}
                {success && (
                  <div className="text-green-100 text-xs mt-3">
                    Quote saved! You’ll receive an email soon.
                  </div>
                )}
                {emailStatus && (
                  <div className="text-xs mt-2 text-white/60">Email status: {emailStatus}</div>
                )}
              </div>

              {}
              <div className="lg:hidden fixed inset-x-0 bottom-0 z-30">
                <div className="mx-4 mb-4 shadow-2xl overflow-hidden bg-black/60 backdrop-blur border border-white/15">
                  <div className="flex items-center justify-between px-5 py-3">
                    <div>
                      <div className="text-xs text-white/60 uppercase tracking-wide">Estimated Total</div>
                      <div className="text-xl font-light">{formatINR(totalCost)}</div>
                    </div>
                    <button
                      type="submit"
                      className="btn-primary btn-compact"
                      disabled={loading}
                    >
                      {loading ? 'Saving…' : 'Save Quote'}
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </form>
        </div>
      </section>

      {}
      <footer className="py-10 text-center text-white/40 text-sm">
        <p>
          Estimates are indicative and may vary after site survey, scope
          finalization, and vendor quotes.
        </p>
      </footer>
    </div>
  );
};

export default DesignQuotient;




