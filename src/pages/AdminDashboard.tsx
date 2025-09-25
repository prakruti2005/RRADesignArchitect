import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import { collection, getDocs, deleteDoc, doc, addDoc, Timestamp, updateDoc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Project, Service, SupportQuery } from '../types';
import { hasMinLen } from '../utils/validation';
import ProjectEditor, { defaultProjectForm, validateProject, toProjectForm } from '../components/ProjectEditor';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<any>(defaultProjectForm());
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectError, setProjectError] = useState('');
  const [showProjectEditor, setShowProjectEditor] = useState(false);
  const [newService, setNewService] = useState({ title: '', description: '' });
  const [services, setServices] = useState<Service[]>([]);
  const [supportQueries, setSupportQueries] = useState<SupportQuery[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [sections, setSections] = useState<{[key:string]: boolean}>({});

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
        navigate('/admin', { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const formatTs = (ts: any) => {
    try {
      if (!ts) return '';
      const d = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
      return d.toLocaleString();
    } catch {
      return '';
    }
  };

  const downloadCSV = (rows: Record<string, any>[], fileName: string) => {
    if (!rows || rows.length === 0) return;
    const headers: string[] = Array.from(new Set<string>(rows.flatMap((r) => Object.keys(r))));
    const escape = (val: any) => {
      if (val == null) return '';
      const s = typeof val === 'object' ? JSON.stringify(val) : String(val);
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const lines = [headers.join(',')].concat(rows.map((r) => headers.map((h) => escape(r[h])).join(',')));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Fetch all collections
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      const [msgSnap, projSnap, servSnap, sqSnap, revSnap, quoteSnap, qnSnap] = await Promise.all([
        getDocs(collection(db, 'contactMessages')),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'supportQueries')),
        getDocs(collection(db, 'reviews')),
        getDocs(collection(db, 'quotes')),
        getDocs(collection(db, 'questionnaireSubmissions')),
      ]);
      setMessages(msgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[]);
      setServices(servSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[]);
      setSupportQueries(sqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SupportQuery[]);
      setReviews(revSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setQuotes(quoteSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setQuestionnaires(qnSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Toggle sections
  const toggleSection = (key: string) => setSections(s => ({ ...s, [key]: !s[key] }));

  // CRUD handlers (copied from previous Admin page)
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasMinLen(newService.title, 3) || !hasMinLen(newService.description, 10)) return;
    const docRef = await addDoc(collection(db, 'services'), {
      ...newService,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    setServices([...services, { ...newService, id: docRef.id } as Service]);
    setNewService({ title: '', description: '' });
  };
  const handleDeleteService = async (id: string) => {
    await deleteDoc(doc(db, 'services', id));
    setServices(services.filter(s => s.id !== id));
  };

  const handleUpdateSupportStatus = async (id: string, status: SupportQuery['status'], response?: string) => {
    await updateDoc(doc(db, 'supportQueries', id), { status, response });
    setSupportQueries(supportQueries.map(q => q.id === id ? { ...q, status, response } : q));
  };
  const handleDeleteSupportQuery = async (id: string) => {
    await deleteDoc(doc(db, 'supportQueries', id));
    setSupportQueries(supportQueries.filter(q => q.id !== id));
  };

  const handleDeleteReview = async (id: string) => {
    await deleteDoc(doc(db, 'reviews', id));
    setReviews(reviews.filter(r => r.id !== id));
  };

  const handleDeleteQuote = async (id: string) => {
    await deleteDoc(doc(db, 'quotes', id));
    setQuotes(quotes.filter(q => q.id !== id));
  };

  const handleDeleteQuestionnaire = async (id: string) => {
    await deleteDoc(doc(db, 'questionnaireSubmissions', id));
    setQuestionnaires(questionnaires.filter(q => q.id !== id));
  };

  const handleDeleteMessage = async (id: string) => {
    await deleteDoc(doc(db, 'contactMessages', id));
    setMessages(messages.filter(m => m.id !== id));
  };

  const handleDeleteProject = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleStartAddProject = () => {
    setEditingProjectId(null);
    setProjectForm(defaultProjectForm());
    setProjectError('');
    setShowProjectEditor(true);
  };

  const handleSaveProject = async () => {
    const v = validateProject(projectForm);
    if (v) {
      setProjectError(v);
      return;
    }
    setProjectSaving(true);
    try {
      if (editingProjectId) {
        await updateDoc(doc(db, 'projects', editingProjectId), {
          ...projectForm,
          updatedAt: Timestamp.now(),
        });
        setProjects(projects.map(p => p.id === editingProjectId ? { ...p, ...projectForm } : p));
      } else {
        const docRef = await addDoc(collection(db, 'projects'), {
          ...projectForm,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        setProjects([...projects, { ...projectForm, id: docRef.id } as Project]);
      }
      setEditingProjectId(null);
      setProjectForm(defaultProjectForm());
      setProjectError('');
      setShowProjectEditor(false);
    } finally {
      setProjectSaving(false);
    }
  };

  const loadProjectForEdit = async (id: string) => {
    try {
      const ref = doc(db, 'projects', id);
      const snap = await getDoc(ref);
      const data = snap.exists() ? { id: snap.id, ...snap.data() } : projects.find(p => p.id === id);
      const normalized = toProjectForm(data as any);
      setProjectForm(normalized as any);
    } catch {
      const fallback = projects.find(p => p.id === id);
      setProjectForm(toProjectForm(fallback as any) as any);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin', { replace: true });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">Checking access…</div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container-minimal py-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="section-title mb-0">Admin Dashboard</h1>
          <div className="flex gap-3">
            <button onClick={() => window.location.reload()} className="btn-primary btn-compact">Refresh</button>
            <button onClick={handleLogout} className="btn-primary btn-compact">Logout</button>
          </div>
        </div>
        {loading ? <div>Loading...</div> : (
          <div className="space-y-12">
            {/* Contact Messages */}
            <section>
              <h2 className="text-title uppercase tracking-[0.2em] font-light mb-4 cursor-pointer" onClick={() => toggleSection('messages')}>Contact Messages</h2>
              {sections.messages !== false && (
                <div className="space-y-4">
                  {messages.length === 0 && <div className="text-white/60">No messages yet.</div>}
                  {messages.map(m => (
                    <div key={m.id} className="card-minimal p-4 rounded-none flex flex-col gap-1">
                      <div><span className="text-white/70 uppercase tracking-wide text-xs">Name:</span> {m.name}</div>
                      <div><span className="text-white/70 uppercase tracking-wide text-xs">Email:</span> <a className="underline" href={`mailto:${m.email}`}>{m.email}</a></div>
                      <div><span className="text-white/70 uppercase tracking-wide text-xs">Message:</span> {m.message}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-white/50">{formatTs(m.createdAt)}</div>
                        <button onClick={() => handleDeleteMessage(m.id)} className="btn-primary btn-compact">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-title uppercase tracking-[0.2em] font-light mb-4 cursor-pointer" onClick={() => toggleSection('projects')}>Projects</h2>
              {sections.projects !== false && (
                <>
                  <div className="flex justify-end mb-4">
                    <button onClick={handleStartAddProject} className="btn-primary btn-compact">Add New Project</button>
                  </div>
      {/* Editor */}
      {showProjectEditor && (
                    <div className="mb-6">
                      <ProjectEditor
                        mode={editingProjectId ? 'edit' : 'add'}
                        value={projectForm}
                        onChange={setProjectForm}
        onCancel={() => { setEditingProjectId(null); setProjectForm(defaultProjectForm()); setProjectError(''); setShowProjectEditor(false); }}
                        onSave={handleSaveProject}
                        saving={projectSaving}
                        error={projectError}
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    {projects.length === 0 && <div className="text-white/60">No projects yet.</div>}
                    {projects.map(p => (
                      <div key={p.id} className="card-minimal p-4 rounded-none flex flex-col gap-1">
                        <div><span className="font-semibold">Title:</span> {p.title}</div>
                        <div><span className="font-semibold">Description:</span> {p.description}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-white/50">{formatTs((p as any).createdAt)}</div>
                          <div className="flex gap-2">
                            <button onClick={async () => {
                              setEditingProjectId(p.id);
                              setProjectError('');
                              setShowProjectEditor(true);
                              await loadProjectForEdit(p.id);
                            }} className="btn-primary btn-compact">Edit</button>
                            <button onClick={() => handleDeleteProject(p.id)} className="btn-primary btn-compact">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* Services */}
            <section>
              <h2 className="text-title uppercase tracking-[0.2em] font-light mb-4 cursor-pointer" onClick={() => toggleSection('services')}>Services</h2>
              {sections.services !== false && (
                <>
                  <form onSubmit={handleAddService} className="card-minimal p-4 rounded-none flex flex-col gap-3 mb-6">
                    <input
                      type="text"
                      placeholder="Service Title"
                      value={newService.title}
                      onChange={e => setNewService({ ...newService, title: e.target.value })}
                      className="bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white"
                    />
                    <textarea
                      placeholder="Service Description"
                      value={newService.description}
                      onChange={e => setNewService({ ...newService, description: e.target.value })}
                      className="bg-black/20 border border-white/15 rounded-lg px-4 py-2 text-white min-h-[60px]"
                    />
                    <button type="submit" className="btn-primary btn-compact">Add Service</button>
                  </form>
                  <div className="space-y-4">
                    {services.length === 0 && <div className="text-white/60">No services yet.</div>}
                    {services.map(s => (
                      <div key={s.id} className="card-minimal p-4 rounded-none flex flex-col gap-1">
                        <div><span className="font-semibold">Title:</span> {s.title}</div>
                        <div><span className="font-semibold">Description:</span> {s.description}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-white/50">{formatTs((s as any).createdAt)}</div>
                          <button onClick={() => handleDeleteService(s.id)} className="btn-primary btn-compact">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* Support Queries */}
            <section>
              <h2 className="text-title uppercase tracking-[0.2em] font-light mb-4 cursor-pointer" onClick={() => toggleSection('support')}>Support Queries</h2>
              {sections.support !== false && (
                <div className="space-y-4">
                  {supportQueries.length === 0 && <div className="text-white/60">No support queries yet.</div>}
                  {supportQueries.map(q => (
                    <div key={q.id} className="card-minimal p-4 rounded-none flex flex-col gap-1">
                      <div><span className="font-semibold">Type:</span> {q.type}</div>
                      <div><span className="font-semibold">Email:</span> {q.email}</div>
                      <div><span className="font-semibold">Question:</span> {q.question}</div>
                      <div><span className="font-semibold">Status:</span> {q.status}</div>
                      <div><span className="font-semibold">Response:</span> {q.response || '—'}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-white/50">{formatTs((q as any).createdAt)}</div>
                        <div className="flex gap-2">
                          <button onClick={() => { const response = prompt('Response:', q.response ?? '') ?? ''; handleUpdateSupportStatus(q.id, 'replied', response); }} className="btn-primary btn-compact">Replied</button>
                          <button onClick={() => handleUpdateSupportStatus(q.id, 'reviewed', q.response)} className="btn-primary btn-compact">Reviewed</button>
                          <button onClick={() => handleDeleteSupportQuery(q.id)} className="btn-primary btn-compact">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-title uppercase tracking-[0.2em] font-light mb-4 cursor-pointer" onClick={() => toggleSection('reviews')}>Reviews</h2>
              {sections.reviews !== false && (
                <div className="space-y-4">
                  {reviews.length === 0 && <div className="text-white/60">No reviews yet.</div>}
                  {reviews.map(r => (
                    <div key={r.id} className="card-minimal p-4 rounded-none flex flex-col gap-1">
                      <div><span className="font-semibold">Name:</span> {r.name}</div>
                      <div><span className="font-semibold">Review:</span> {r.review}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-white/50">{formatTs((r as any).createdAt)}</div>
                        <button onClick={() => handleDeleteReview(r.id)} className="btn-primary btn-compact">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Design Quotient Quotes */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-title uppercase tracking-[0.2em] font-light cursor-pointer" onClick={() => toggleSection('quotes')}>Design Quotient Quotes</h2>
                {quotes.length > 0 && (
                  <button onClick={() => downloadCSV(quotes, 'quotes.csv')} className="btn-primary btn-compact">Export CSV</button>
                )}
              </div>
              {sections.quotes !== false && (
                <div className="space-y-4">
                  {quotes.length === 0 && <div className="text-white/60">No quotes yet.</div>}
                  {quotes.map(q => (
                    <div key={q.id} className="card-minimal p-5 rounded-none flex flex-col gap-2">
                      <div className="flex flex-wrap gap-x-6 gap-y-1">
                        <div><span className="text-white/70 uppercase tracking-wide text-xs">Name:</span> {q.name}</div>
                        <div><span className="text-white/70 uppercase tracking-wide text-xs">Email:</span> <a className="underline" href={`mailto:${q.email}`}>{q.email}</a></div>
                        {q.phone && (<div><span className="text-white/70 uppercase tracking-wide text-xs">Phone:</span> <a className="underline" href={`tel:${q.phone}`}>{q.phone}</a></div>)}
                        <div><span className="text-white/70 uppercase tracking-wide text-xs">Location:</span> {q.location}</div>
                        <div><span className="text-white/70 uppercase tracking-wide text-xs">Size:</span> {q.projectSize}</div>
                        <div><span className="text-white/70 uppercase tracking-wide text-xs">Area:</span> {q.area}</div>
                        <div><span className="text-white/70 uppercase tracking-wide text-xs">Total:</span> {q.total}</div>
                        {q.perSqFt && (<div><span className="text-white/70 uppercase tracking-wide text-xs">Per SqFt:</span> {q.perSqFt}</div>)}
                      </div>
                      <div className="text-xs text-white/60">Created: {formatTs(q.createdAt)}</div>
                      {q.priorities && q.priorities.length > 0 && (
                        <div className="text-sm text-white/80">Priorities: {q.priorities.join(', ')}</div>
                      )}
                      {q.notes && (<div className="text-sm text-white/70">Notes: {q.notes}</div>)}
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-white/60">View raw data</summary>
                        <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-white/70">{JSON.stringify(q, null, 2)}</pre>
                      </details>
                      <div className="flex items-center justify-end mt-2">
                        <button onClick={() => handleDeleteQuote(q.id)} className="btn-primary btn-compact">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Questionnaire Submissions */}
            <section>
              <h2 className="text-title uppercase tracking-[0.2em] font-light mb-4 cursor-pointer" onClick={() => toggleSection('questionnaires')}>Questionnaire Submissions</h2>
              {sections.questionnaires !== false && (
                <div className="space-y-4">
                  {questionnaires.length === 0 && <div className="text-white/60">No submissions yet.</div>}
                  {questionnaires.map(q => (
                    <div key={q.id} className="card-minimal p-4 rounded-none flex flex-col gap-2">
                      <pre className="whitespace-pre-wrap break-words text-xs text-white/70">{JSON.stringify(q, null, 2)}</pre>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-white/50">{formatTs((q as any).createdAt)}</div>
                        <button onClick={() => handleDeleteQuestionnaire(q.id)} className="btn-primary btn-compact">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
