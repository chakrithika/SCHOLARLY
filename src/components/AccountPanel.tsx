import { ChangeEvent, useState } from 'react';
import { Camera, CircleHelp, ImagePlus, X } from 'lucide-react';
import { EXAMS } from '@/data/exams';
import { Profile, supabase } from '@/lib/supabase';

interface AccountPanelProps {
  profile: Profile;
  onClose: () => void;
  onExit: () => void;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  initialTab?: Tab;
}

type Tab = 'account' | 'help' | 'report';

export function AccountPanel({ profile, onClose, onExit, updateProfile, signOut, initialTab = 'account' }: AccountPanelProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [selectedExam, setSelectedExam] = useState(profile.target_exam);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  async function saveAccount(): Promise<void> {
    setSaving(true);
    await updateProfile({ display_name: displayName.trim() || 'Student', target_exam: selectedExam || 'SAT' });
    setNotice('Account changes saved.');
    setSaving(false);
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { setNotice('Please choose an image smaller than 5 MB.'); return; }
    setSaving(true);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${profile.id}/profile-${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
    if (error) setNotice('The profile picture could not be uploaded. Please try again.');
    else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      await updateProfile({ avatar_url: data.publicUrl });
      setNotice('Profile picture updated.');
    }
    setSaving(false);
  }

  async function submitRequest(): Promise<void> {
    if (!subject.trim() || !message.trim()) { setNotice('Add a subject and message first.'); return; }
    setSaving(true);
    const { error } = await supabase.from('support_requests').insert({ kind: tab, subject: subject.trim(), message: message.trim() });
    if (error) setNotice('Your message could not be sent. Please try again.');
    else { setSubject(''); setMessage(''); setNotice(tab === 'help' ? 'Your help request was saved.' : 'Your report was saved.'); }
    setSaving(false);
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm" onClick={onClose}><section className="w-full max-w-xl rounded-xl border-2 border-lavender-500/50 bg-midnight-950 shadow-glow overflow-hidden" onClick={(event) => event.stopPropagation()}><div className="flex items-center gap-3 p-5 border-b border-lavender-500/25"><div className="relative shrink-0"><div className="w-12 h-12 rounded-xl border border-neon-cyan/60 bg-neon-cyan/10 overflow-hidden flex items-center justify-center font-display text-lg text-neon-cyan">{profile.avatar_url ? <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" /> : profile.display_name[0]?.toUpperCase() || 'S'}</div><label className="absolute -right-2 -bottom-2 w-7 h-7 rounded-full border border-midnight-950 bg-neon-cyan text-midnight-950 flex items-center justify-center cursor-pointer" title="Choose a profile picture"><Camera size={13} /><input type="file" accept="image/*" capture="user" className="sr-only" onChange={(event) => void uploadAvatar(event)} /></label></div><div className="flex-1 min-w-0"><h2 className="font-display text-sm text-lavender-100 truncate">{profile.display_name}</h2><p className="text-sm text-lavender-400 font-body mt-1">Your SCHOLARLY account</p></div><button onClick={onClose} className="text-lavender-400 hover:text-neon-pink" aria-label="Close account"><X size={20} /></button></div><div className="flex border-b border-lavender-500/25"><TabButton active={tab === 'account'} onClick={() => { setTab('account'); setNotice(''); }}>ACCOUNT</TabButton><TabButton active={tab === 'help'} onClick={() => { setTab('help'); setNotice(''); }}>HELP</TabButton><TabButton active={tab === 'report'} onClick={() => { setTab('report'); setNotice(''); }}>REPORT</TabButton></div><div className="p-5">{tab === 'account' ? <div className="space-y-4"><div className="flex items-center gap-2 text-sm text-lavender-300 font-body"><ImagePlus size={16} className="text-neon-cyan" /> Choose a picture from your gallery or camera using the button on your avatar.</div><label className="block"><span className="block text-sm text-lavender-300 font-body mb-2">Display name</span><input className="input-pixel font-body" value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label><label className="block"><span className="block text-sm text-lavender-300 font-body mb-2">Exam preference</span><select className="input-pixel font-body" value={selectedExam} onChange={(event) => setSelectedExam(event.target.value)}>{EXAMS.map((exam) => <option key={exam.id} value={exam.id}>{exam.short} — {exam.full}</option>)}</select></label><button onClick={() => void saveAccount()} disabled={saving} className="btn-pixel-pink w-full py-3 font-display text-xs">{saving ? 'Saving...' : 'Save changes'}</button><button onClick={() => { void signOut(); onExit(); onClose(); }} className="w-full rounded border-2 border-red-500/50 py-3 font-display text-xs text-red-300 hover:bg-red-500/10 transition-colors">Sign out</button></div> : <div className="space-y-4"><div className="flex items-start gap-2 rounded-lg border border-lavender-500/20 bg-midnight-900/60 p-3 text-sm text-lavender-300 font-body"><CircleHelp size={17} className="text-neon-cyan shrink-0 mt-0.5" />{tab === 'help' ? 'Ask what SCHOLARLY is for, how a study tool works, or anything about using the website.' : 'Tell us about a bug, a feature that is not working, or a problem in Community Chat.'}</div><label className="block"><span className="block text-sm text-lavender-300 font-body mb-2">Subject</span><input className="input-pixel font-body" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder={tab === 'help' ? 'What do you need help with?' : 'What is not working?'} /></label><label className="block"><span className="block text-sm text-lavender-300 font-body mb-2">Message</span><textarea className="input-pixel font-body min-h-32 resize-y" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write the details here..." /></label><button onClick={() => void submitRequest()} disabled={saving} className="btn-pixel-pink w-full py-3 font-display text-xs">{saving ? 'Sending...' : tab === 'help' ? 'Send help request' : 'Send report'}</button></div>}{notice && <p className="mt-4 text-sm text-neon-cyan font-body">{notice}</p>}</div></section></div>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return <button onClick={onClick} className={`flex-1 py-3 text-center font-display text-xs transition-colors ${active ? 'text-lavender-100 border-b-2 border-neon-pink' : 'text-lavender-500 hover:text-lavender-200'}`}>{children}</button>;
}
