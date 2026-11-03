import { useEffect, useState } from 'react';
import { BookOpen, Folder, FolderPlus, Plus, Search, Trash2 } from 'lucide-react';
import { PixelPanel } from '@/components/PixelPanel';
import { Modal } from '@/components/Modal';
import { Note, supabase } from '@/lib/supabase';

type FolderRow = { id: string; name: string; created_at: string };

export function MistakeNotebook() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [activeFolder, setActiveFolder] = useState('General');
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const [{ data: noteRows, error: noteError }, { data: folderRows, error: folderError }] = await Promise.all([
      supabase.from('notes').select('*').order('created_at', { ascending: false }),
      supabase.from('folders').select('*').order('created_at', { ascending: true }),
    ]);
    if (noteError || folderError) setError(noteError?.message || folderError?.message || 'Unable to load notebook.');
    setNotes((noteRows as Note[]) || []);
    setFolders((folderRows as FolderRow[]) || []);
  }
  useEffect(() => { void load(); }, []);

  async function addNote() {
    if (!title.trim() && !body.trim()) return;
    const { data, error: saveError } = await supabase.from('notes').insert({ title: title.trim() || 'Untitled mistake', body: body.trim(), folder_name: activeFolder }).select().maybeSingle();
    if (saveError) { setError(saveError.message); return; }
    if (data) setNotes((prev) => [data as Note, ...prev]);
    setTitle(''); setBody(''); setOpen(false);
  }
  async function addFolder() {
    const name = window.prompt('New folder name?')?.trim();
    if (!name || folders.some((folder) => folder.name === name)) return;
    const { data, error: folderError } = await supabase.from('folders').insert({ name }).select().maybeSingle();
    if (folderError) { setError(folderError.message); return; }
    if (data) { setFolders((prev) => [...prev, data as FolderRow]); setActiveFolder(name); }
  }
  async function removeNote(id: string) {
    const { error: removeError } = await supabase.from('notes').delete().eq('id', id);
    if (removeError) setError(removeError.message); else setNotes((prev) => prev.filter((note) => note.id !== id));
  }
  const visible = notes.filter((note) => note.folder_name === activeFolder && (!query || `${note.title} ${note.body}`.toLowerCase().includes(query.toLowerCase())));

  return <div className="space-y-5 animate-rise-in max-w-5xl"><header className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="font-display text-base sm:text-lg text-lavender-100 neon-text mb-1">MISTAKE NOTEBOOK</h1><p className="text-sm text-lavender-300 font-body">Keep your corrections organized for the next revision.</p></div><button onClick={() => setOpen(true)} className="btn-pixel-pink"><Plus size={16} /> New mistake</button></header>{error && <p className="text-sm text-neon-pink font-body">{error}</p>}<div className="grid lg:grid-cols-4 gap-4"><PixelPanel title="FOLDERS" accent="lavender"><button onClick={() => void addFolder()} className="btn-ghost w-full mb-3 !py-1.5 !text-sm"><FolderPlus size={14} /> New folder</button><button onClick={() => setActiveFolder('General')} className={`w-full flex justify-between p-2 font-body text-sm ${activeFolder === 'General' ? 'bg-lavender-600/20 text-lavender-100' : 'text-lavender-300'}`}><span className="flex gap-2"><Folder size={14} /> General</span><span>{notes.filter((n) => n.folder_name === 'General').length}</span></button>{folders.map((folder) => <button key={folder.id} onClick={() => setActiveFolder(folder.name)} className={`w-full flex justify-between p-2 font-body text-sm ${activeFolder === folder.name ? 'bg-lavender-600/20 text-lavender-100' : 'text-lavender-300'}`}><span className="flex gap-2"><Folder size={14} /> {folder.name}</span><span>{notes.filter((n) => n.folder_name === folder.name).length}</span></button>)}</PixelPanel><div className="lg:col-span-3"><PixelPanel title={`${activeFolder.toUpperCase()} NOTES`} accent="pink" right={<div className="flex items-center gap-1"><Search size={13} className="text-lavender-300" /><input className="bg-midnight-950 border border-lavender-500/40 px-2 py-1 text-sm font-body w-40" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" /></div>}>{visible.length === 0 ? <div className="text-center py-12"><BookOpen size={30} className="mx-auto mb-2 text-lavender-400/50" /><p className="font-body text-sm text-lavender-300">No notes in this folder.</p></div> : <div className="grid sm:grid-cols-2 gap-3">{visible.map((note) => <article key={note.id} className="panel !p-3 relative"><h3 className="font-body font-semibold text-sm text-lavender-100 pr-6">{note.title}</h3><p className="font-body text-sm text-lavender-300 whitespace-pre-wrap mt-1">{note.body}</p><button onClick={() => void removeNote(note.id)} className="absolute top-3 right-3 text-lavender-400 hover:text-neon-pink" aria-label="Delete note"><Trash2 size={14} /></button></article>)}</div>}</PixelPanel></div></div><Modal open={open} onClose={() => setOpen(false)} title="NEW MISTAKE"><div className="space-y-3"><label className="block"><span className="block text-xs font-body text-lavender-300 mb-1">Folder</span><select className="input-pixel" value={activeFolder} onChange={(e) => setActiveFolder(e.target.value)}><option>General</option>{folders.map((folder) => <option key={folder.id}>{folder.name}</option>)}</select></label><label className="block"><span className="block text-xs font-body text-lavender-300 mb-1">Title</span><input className="input-pixel" value={title} onChange={(e) => setTitle(e.target.value)} /></label><label className="block"><span className="block text-xs font-body text-lavender-300 mb-1">Correction</span><textarea className="input-pixel min-h-32" value={body} onChange={(e) => setBody(e.target.value)} /></label><button onClick={() => void addNote()} className="btn-pixel-pink w-full"><Plus size={16} /> Save mistake</button></div></Modal></div>;
}
