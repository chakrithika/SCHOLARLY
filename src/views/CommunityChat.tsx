import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import { PixelPanel } from '@/components/PixelPanel';
import { Mascot } from '@/components/Mascot';
import { ChatMessage, supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export function CommunityChat() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error: loadError } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true }).limit(200);
      if (!active) return;
      if (loadError) setError(loadError.message);
      else setMessages((data as ChatMessage[]) || []);
      setLoading(false);
    }
    void load();
    const channel = supabase.channel('community-chat').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
      const message = payload.new as ChatMessage;
      setMessages((prev) => prev.some((item) => item.id === message.id) ? prev : [...prev, message]);
    }).subscribe();
    return () => { active = false; void supabase.removeChannel(channel); };
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send() {
    const body = input.trim();
    if (!body || !profile) return;
    setError('');
    const { data, error: sendError } = await supabase.from('chat_messages').insert({ display_name: profile.display_name, avatar_color: profile.avatar_color, avatar_url: profile.avatar_url, body }).select().maybeSingle();
    if (sendError) { setError(sendError.message); return; }
    if (data) setMessages((prev) => prev.some((item) => item.id === data.id) ? prev : [...prev, data as ChatMessage]);
    setInput('');
  }

  return (
    <div className="space-y-5 animate-rise-in max-w-3xl">
      <header><h1 className="font-display text-base sm:text-lg text-lavender-100 neon-text mb-1">COMMUNITY CHAT</h1><p className="text-sm text-lavender-300 font-body">Talk with other students in the shared study lounge.</p></header>
      <PixelPanel accent="pink">
        <div className="h-[28rem] overflow-y-auto space-y-3 pr-1">
          {loading ? <p className="text-sm text-lavender-300 font-body text-center py-8">Loading conversation...</p> : messages.length === 0 ? <div className="text-center py-12"><Mascot size={56} mood="happy" className="mx-auto mb-3" /><p className="font-body text-sm text-lavender-300">Start the conversation.</p></div> : messages.map((message) => { const mine = message.user_id === profile?.id; return <div key={message.id} className={`flex gap-2 ${mine ? 'flex-row-reverse' : ''}`}><div className="shrink-0">{message.avatar_url ? <img src={message.avatar_url} alt="" className="w-8 h-8 object-cover border-2 border-lavender-400" /> : <div className="w-8 h-8 border-2 border-lavender-400 flex items-center justify-center font-display text-xs" style={{ background: message.avatar_color, color: '#05031a' }}>{message.display_name[0]?.toUpperCase()}</div>}</div><div className={`max-w-[75%] ${mine ? 'text-right' : ''}`}><p className="text-[10px] text-lavender-400 font-body mb-0.5">{mine ? 'You' : message.display_name} · {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p><div className={`inline-block px-3 py-2 text-sm font-body border-2 ${mine ? 'bg-lavender-600/30 border-lavender-400 text-lavender-100' : 'bg-midnight-800 border-lavender-500/40 text-lavender-100'}`}>{message.body}</div></div></div>; })}
          <div ref={endRef} />
        </div>
        <div className="flex gap-2 mt-3 border-t-2 border-lavender-500/20 pt-3"><input className="input-pixel flex-1" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && void send()} placeholder="Write a message..." /><button onClick={() => void send()} className="btn-pixel-pink"><Send size={16} /> Send</button></div>
        {error && <p className="text-sm text-neon-pink font-body mt-2">{error}</p>}
      </PixelPanel>
      <div className="flex items-start gap-2 text-xs text-lavender-400 font-body"><AlertTriangle size={14} className="text-neon-pink shrink-0 mt-0.5" /><p>Please keep the study lounge respectful. Messages are shared with signed-in students.</p></div>
    </div>
  );
}
