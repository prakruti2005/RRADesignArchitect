import React, { useState } from 'react';
import { Project, TransformationStep, Material } from '../types';
import { hasMinLen, isNumberAtLeast } from '../utils/validation';

type ProjectForm = Omit<Project, 'id'>;

export interface ProjectEditorProps {
  mode: 'add' | 'edit';
  value: ProjectForm;
  onChange: (next: ProjectForm) => void;
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
  error?: string;
}

const emptyMaterial: Material = {
  id: crypto.randomUUID(),
  name: '',
  category: 'wood',
  source: '',
  cost: '',
  sustainability: 'medium',
};

const emptyStep: TransformationStep = {
  step: 1,
  title: '',
  description: '',
  date: '',
  challenges: [],
  solutions: [],
};

export const defaultProjectForm = (): ProjectForm => ({
  title: '',
  location: { city: '', neighborhood: '' },
  type: 'residential',
  area: 0,
  completionDate: '',
  description: '',
  transformationLog: [],
  materials: [],
  testimonial: { client: '', quote: '' },
  images: [],
  budget: '',
});

export const validateProject = (p: ProjectForm): string | null => {
  if (!hasMinLen(p.title, 3)) return 'Title must be at least 3 characters.';
  if (!hasMinLen(p.description, 10)) return 'Description must be at least 10 characters.';
  if (!hasMinLen(p.location.city, 2)) return 'City is required (min 2 characters).';
  if (!isNumberAtLeast(p.area, 1)) return 'Area must be a positive number.';
  if (!hasMinLen(p.completionDate, 4)) return 'Completion date is required (YYYY-MM-DD).';
  if (!hasMinLen(p.budget, 1)) return 'Budget is required (e.g., $450,000).';
  return null;
};

export const toProjectForm = (input: Partial<Project> | any): ProjectForm => {
  const base = defaultProjectForm();
  return {
    title: input?.title ?? base.title,
    location: {
      city: input?.location?.city ?? base.location.city,
      neighborhood: input?.location?.neighborhood ?? base.location.neighborhood,
    },
    type: (input?.type ?? base.type) as ProjectForm['type'],
    area: Number(input?.area ?? base.area),
    completionDate: input?.completionDate ?? base.completionDate,
    description: input?.description ?? base.description,
    transformationLog: Array.isArray(input?.transformationLog)
      ? input.transformationLog.map((s: Partial<TransformationStep>, i: number) => ({
          ...emptyStep,
          ...s,
          step: typeof s.step === 'number' ? s.step : i + 1,
          challenges: Array.isArray(s.challenges) ? s.challenges : [],
          solutions: Array.isArray(s.solutions) ? s.solutions : [],
        }))
      : base.transformationLog,
    materials: Array.isArray(input?.materials)
      ? input.materials.map((m: Partial<Material>) => ({
          ...emptyMaterial,
          ...m,
          id: m.id ?? (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Math.random())),
        }))
      : base.materials,
    testimonial: {
      client: input?.testimonial?.client ?? base.testimonial.client,
      quote: input?.testimonial?.quote ?? base.testimonial.quote,
    },
    images: Array.isArray(input?.images) ? input.images.filter(Boolean) : base.images,
    budget: input?.budget ?? base.budget,
  };
};

const ProjectEditor: React.FC<ProjectEditorProps> = ({ mode, value, onChange, onCancel, onSave, saving, error }) => {
  const set = (patch: Partial<ProjectForm>) => onChange({ ...value, ...patch });

  const setMaterial = (idx: number, patch: Partial<Material>) => {
    const copy = value.materials.slice();
    copy[idx] = { ...copy[idx], ...patch } as Material;
    set({ materials: copy });
  };
  const addMaterial = () => set({ materials: [...value.materials, { ...emptyMaterial, id: crypto.randomUUID() }] });
  const removeMaterial = (idx: number) => set({ materials: value.materials.filter((_, i) => i !== idx) });

  const setStep = (idx: number, patch: Partial<TransformationStep>) => {
    const copy = value.transformationLog.slice();
    copy[idx] = { ...copy[idx], ...patch } as TransformationStep;
    set({ transformationLog: copy });
  };
  const addStep = () => set({ transformationLog: [...value.transformationLog, { ...emptyStep, step: value.transformationLog.length + 1 }] });
  const removeStep = (idx: number) => set({ transformationLog: value.transformationLog.filter((_, i) => i !== idx) });

  
  const [imageError, setImageError] = useState<string>('');
  const [processingImages, setProcessingImages] = useState(false);

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const compressImageIfNeeded = (dataUrl: string, maxWidth = 1400, quality = 0.8): Promise<string> => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        if (img.width <= maxWidth) return resolve(dataUrl); 
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const out = canvas.toDataURL('image/jpeg', quality);
        resolve(out);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleLocalImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setImageError('');
    setProcessingImages(true);
    try {
      const limitPerDoc = 950000; 
      const currentSize = value.images.reduce((sum, d) => sum + d.length, 0);
      const results: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 4 * 1024 * 1024) {
          setImageError('Some files exceed 4MB and were skipped.');
          continue;
        }
        const raw = await readFileAsDataURL(file);
        const processed = await compressImageIfNeeded(raw);
        if (currentSize + results.reduce((s, r) => s + r.length, 0) + processed.length > limitPerDoc) {
          setImageError('Adding these images would exceed Firestore document size limit. Some were skipped.');
          break;
        }
        results.push(processed);
      }
      if (results.length) set({ images: [...value.images, ...results] });
    } catch (e) {
      setImageError('Failed to process one or more images.');
    } finally {
      setProcessingImages(false);
    }
  };

  const removeImage = (idx: number) => set({ images: value.images.filter((_, i) => i !== idx) });

  const challengesText = (idx: number) => (value.transformationLog[idx]?.challenges || []).join('\n');
  const solutionsText = (idx: number) => (value.transformationLog[idx]?.solutions || []).join('\n');

  return (
    <div className="card-minimal p-4 rounded-none space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-title uppercase tracking-[0.2em] font-light">{mode === 'add' ? 'Add Project' : 'Edit Project'}</h3>
      </div>

      {}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Title</label>
          <input value={value.title} onChange={e => set({ title: e.target.value })} className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white" placeholder="Project title" />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Type</label>
          <select value={value.type} onChange={e => set({ type: e.target.value as ProjectForm['type'] })} className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white">
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="retail">Retail</option>
          </select>
        </div>
      </div>

      {}
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">City</label>
          <input value={value.location.city} onChange={e => set({ location: { ...value.location, city: e.target.value } })} className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white" placeholder="Tokyo" />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Neighborhood</label>
          <input value={value.location.neighborhood} onChange={e => set({ location: { ...value.location, neighborhood: e.target.value } })} className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white" placeholder="Shibuya" />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Area (sq ft)</label>
          <input type="number" value={value.area} onChange={e => set({ area: Number(e.target.value) })} className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white" placeholder="2800" />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Completion Date</label>
          <input type="date" value={value.completionDate} onChange={e => set({ completionDate: e.target.value })} className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Budget</label>
          <input value={value.budget} onChange={e => set({ budget: e.target.value })} className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white" placeholder="$450,000" />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Client (for Testimonial)</label>
          <input value={value.testimonial.client} onChange={e => set({ testimonial: { ...value.testimonial, client: e.target.value } })} className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white" placeholder="Client Name" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Client Quote</label>
        <textarea value={value.testimonial.quote} onChange={e => set({ testimonial: { ...value.testimonial, quote: e.target.value } })} className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white min-h-[72px]" placeholder="What the client said..." />
      </div>

      {}
      <div>
        <label className="block text-xs text-white/60 mb-1 uppercase tracking-wide">Description</label>
        <textarea value={value.description} onChange={e => set({ description: e.target.value })} className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white min-h-[80px]" placeholder="Short overview of the project..." />
      </div>

      {}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs text-white/60 uppercase tracking-wide">Images (upload – stored inline)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={e => handleLocalImages(e.target.files)}
            className="text-xs text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-white/10 file:text-white file:uppercase file:tracking-wide hover:file:bg-white/20"
          />
        </div>
        {processingImages && <div className="text-xs text-white/60 mb-2">Processing images…</div>}
        {imageError && <div className="text-xs text-red-400 mb-2">{imageError}</div>}
        <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.images.length === 0 && !processingImages && (
            <div className="text-white/40 text-xs col-span-full">No images uploaded.</div>
          )}
          {value.images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={img} alt={`Project image ${idx + 1}`} className="w-full h-32 object-cover border border-white/15" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white text-[10px] px-1 py-0.5 tracking-wide"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-white/40 leading-snug">Images are stored as base64 inside the project document. Keep total small (&lt; 5–6 medium images) to avoid Firestore size limits. For production, prefer an external storage/CDN.</p>
      </div>

      {}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs text-white/60 uppercase tracking-wide">Materials</label>
          <button type="button" onClick={addMaterial} className="btn-primary btn-compact">Add</button>
        </div>
        <div className="space-y-3">
          {value.materials.length === 0 && <div className="text-white/50 text-sm">No materials added.</div>}
          {value.materials.map((m, idx) => (
            <div key={m.id} className="grid md:grid-cols-6 gap-2 items-end card-minimal p-3">
              <input value={m.name} onChange={e => setMaterial(idx, { name: e.target.value })} placeholder="Name" className="bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-white md:col-span-2" />
              <select value={m.category} onChange={e => setMaterial(idx, { category: e.target.value as Material['category'] })} className="bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-white">
                <option value="wood">Wood</option>
                <option value="paint">Paint</option>
                <option value="tile">Tile</option>
                <option value="fabric">Fabric</option>
                <option value="metal">Metal</option>
                <option value="stone">Stone</option>
                <option value="glass">Glass</option>
              </select>
              <input value={m.source} onChange={e => setMaterial(idx, { source: e.target.value })} placeholder="Source" className="bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-white" />
              <input value={m.cost} onChange={e => setMaterial(idx, { cost: e.target.value })} placeholder="$45/sqft" className="bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-white" />
              <select value={m.sustainability} onChange={e => setMaterial(idx, { sustainability: e.target.value as Material['sustainability'] })} className="bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-white">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button type="button" onClick={() => removeMaterial(idx)} className="btn-primary btn-compact">Remove</button>
            </div>
          ))}
        </div>
      </div>

      {}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs text-white/60 uppercase tracking-wide">Transformation Steps</label>
          <button type="button" onClick={addStep} className="btn-primary btn-compact">Add Step</button>
        </div>
        <div className="space-y-3">
          {value.transformationLog.length === 0 && <div className="text-white/50 text-sm">No steps added.</div>}
          {value.transformationLog.map((s, idx) => (
            <div key={idx} className="card-minimal p-3 space-y-2">
              <div className="grid md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Title</label>
                  <input value={s.title} onChange={e => setStep(idx, { title: e.target.value })} className="w-full bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Date</label>
                  <input type="date" value={s.date} onChange={e => setStep(idx, { date: e.target.value })} className="w-full bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-white" />
                </div>
                <div className="flex items-end">
                  <button type="button" onClick={() => removeStep(idx)} className="btn-primary btn-compact w-full">Remove Step</button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1">Description</label>
                <textarea value={s.description} onChange={e => setStep(idx, { description: e.target.value })} className="w-full bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-white min-h-[60px]" />
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Challenges (one per line)</label>
                  <textarea value={challengesText(idx)} onChange={e => setStep(idx, { challenges: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) })} className="w-full bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-white min-h-[60px]" />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Solutions (one per line)</label>
                  <textarea value={solutionsText(idx)} onChange={e => setStep(idx, { solutions: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) })} className="w-full bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-white min-h-[60px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      {error && <div className="text-red-300 text-xs">{error}</div>}
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-primary btn-compact">Cancel</button>
        <button type="button" onClick={onSave} className="btn-primary btn-compact" disabled={!!validateProject(value) || saving || processingImages}>
          {saving ? 'Saving…' : processingImages ? 'Processing…' : mode === 'add' ? 'Add Project' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ProjectEditor;
