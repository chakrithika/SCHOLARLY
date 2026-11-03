import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Headphones, Link2, Music2, Pause, Play, Plus, Repeat, RotateCcw, Square, Trash2, Volume2, Youtube } from 'lucide-react';
import { MusicLink, supabase } from '@/lib/supabase';

type TrackKind = 'youtube' | 'spotify' | 'audio';

function getTrackKind(value: string): TrackKind | null {
  try {
    const parsed = new URL(value.trim());
    const host = parsed.hostname.toLowerCase();
    if (host === 'youtu.be' || host === 'youtube.com' || host.endsWith('.youtube.com')) return 'youtube';
    if (host === 'spotify.com' || host.endsWith('.spotify.com')) return 'spotify';
    if (parsed.protocol === 'https:' && /\.(mp3|wav|ogg|m4a|aac|webm)(\?.*)?$/i.test(parsed.pathname + parsed.search)) return 'audio';
    return null;
  } catch {
    return null;
  }
}

function getEmbedUrl(value: string, kind: TrackKind): string | null {
  try {
    const parsed = new URL(value);
    if (kind === 'youtube') {
      const id = parsed.hostname === 'youtu.be'
        ? parsed.pathname.slice(1).split('/')[0]
        : parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&playsinline=1` : null;
    }
    const parts = parsed.pathname.split('/').filter(Boolean);
    const typeIndex = parts.findIndex((part) => ['track', 'album', 'playlist', 'episode', 'show'].includes(part));
    return typeIndex >= 0 && parts[typeIndex + 1] ? `https://open.spotify.com/embed/${parts[typeIndex]}/${parts[typeIndex + 1]}?utm_source=generator` : null;
  } catch {
    return null;
  }
}

export function VibeStation() {
  const [links, setLinks] = useState<MusicLink[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  const activeTrack = links.find((item) => item.id === activeId) || null;
  const activeKind = activeTrack ? getTrackKind(activeTrack.url) : null;

  useEffect(() => {
    async function loadTracks(): Promise<void> {
      setLoading(true);
      const { data, error: loadError } = await supabase.from('music_links').select('*').order('created_at', { ascending: false });
      if (loadError) setError('Your saved tracks could not be loaded. Please try again.');
      else setLinks((data as MusicLink[]) || []);
      setLoading(false);
    }
    void loadTracks();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || activeKind !== 'audio') return;
    audio.volume = volume;
    audio.loop = loop;
  }, [volume, loop, activeKind]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = loop;
  }, [volume, loop]);

  function selectTrack(track: MusicLink): void {
    setError('');
    audioRef.current?.pause();
    setPlaying(false);
    setActiveId(track.id);
  }

  function playAudioTrack(track: MusicLink, reportError = true): void {
    const audio = audioRef.current;
    if (!audio || getTrackKind(track.url) !== 'audio') return;
    setError('');
    setActiveId(track.id);
    audio.src = track.url;
    audio.volume = volume;
    audio.loop = loop;
    audio.load();
    void audio.play().then(() => setPlaying(true)).catch(() => {
      setPlaying(false);
      if (reportError) setError('This direct audio link could not be played. Check that the file is publicly accessible and uses MP3, WAV, OGG, M4A, AAC, or WEBM.');
    });
  }

  function changeTrack(direction: -1 | 1, autoplay = false): void {
    if (links.length === 0) return;
    const currentIndex = links.findIndex((track) => track.id === activeId);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + direction + links.length) % links.length;
    const nextTrack = links[nextIndex];
    if (autoplay && getTrackKind(nextTrack.url) === 'audio') playAudioTrack(nextTrack, false);
    else selectTrack(nextTrack);
  }

  function handleTrackButton(track: MusicLink): void {
    const kind = getTrackKind(track.url);
    if (track.id === activeId && kind === 'audio') {
      togglePlayback();
      return;
    }
    if (kind === 'audio') playAudioTrack(track);
    else selectTrack(track);
  }

  function togglePlayback(): void {
    const audio = audioRef.current;
    if (!audio || activeKind !== 'audio') return;
    if (audio.paused) {
      void audio.play().then(() => setPlaying(true)).catch(() => setError('This audio link cannot be played by the browser.'));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function stopPlayback(): void {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
  }

  function replayPlayback(): void {
    const audio = audioRef.current;
    if (!audio || activeKind !== 'audio') return;
    audio.currentTime = 0;
    void audio.play().then(() => setPlaying(true)).catch(() => setError('This audio link cannot be played by the browser.'));
  }

  function handleAudioEnded(): void {
    setPlaying(false);
    if (!loop) changeTrack(1, true);
  }

  async function saveTrack(): Promise<void> {
    setError('');
    const cleanUrl = url.trim();
    if (!getTrackKind(cleanUrl)) {
      setError('Use a YouTube, Spotify, MP3, WAV, OGG, M4A, AAC, or WEBM link.');
      return;
    }
    const { data, error: saveError } = await supabase.from('music_links').insert({ title: title.trim() || 'Saved track', url: cleanUrl }).select().maybeSingle();
    if (saveError) {
      setError('This track could not be saved. Please try again.');
      return;
    }
    if (data) {
      const track = data as MusicLink;
      setLinks((current) => [track, ...current]);
      setActiveId(track.id);
    }
    setTitle('');
    setUrl('');
  }

  async function removeTrack(id: string): Promise<void> {
    const { error: removeError } = await supabase.from('music_links').delete().eq('id', id);
    if (removeError) {
      setError('This track could not be removed. Please try again.');
      return;
    }
    if (activeId === id) stopPlayback();
    setLinks((current) => current.filter((item) => item.id !== id));
    if (activeId === id) setActiveId(null);
  }

  return (
    <div className="space-y-5 animate-rise-in max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs text-neon-cyan font-body uppercase tracking-[0.22em] mb-2">Your listening room</p><h1 className="font-display text-base sm:text-lg text-lavender-100 neon-text mb-2">VIBE STATION</h1><p className="text-sm text-lavender-300 font-body">Play your study soundtrack without leaving SCHOLARLY.</p></div>
        <div className="flex items-center gap-2 rounded-full border border-lavender-500/30 bg-midnight-900/70 px-3 py-2 text-xs text-lavender-300 font-body"><Headphones size={14} className="text-neon-cyan" /> {links.length} saved</div>
      </header>

      <section className="rounded-xl border-2 border-lavender-500/40 bg-midnight-900/70 p-4">
        <div className="flex items-center justify-between gap-3 border-b border-lavender-500/20 pb-3"><div><h2 className="font-display text-xs text-lavender-100">LISTENING QUEUE</h2><p className="text-xs text-lavender-400 font-body mt-1">Pick a song to start listening</p></div><button onClick={() => document.getElementById('add-track')?.focus()} className="btn-ghost !py-1.5 !px-3 !text-xs"><Plus size={13} /> Add track</button></div>
        <div className="divide-y divide-lavender-500/15">{loading ? <p className="text-sm text-lavender-400 font-body text-center py-10">Loading your queue...</p> : links.length === 0 ? <p className="text-sm text-lavender-400 font-body text-center py-10">Tracks you add will show up here.</p> : links.map((track) => { const kind = getTrackKind(track.url); return <div key={track.id} className={`flex items-center gap-3 py-3 ${activeId === track.id ? 'text-neon-cyan' : ''}`}><button onClick={() => handleTrackButton(track)} className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-lavender-500/40 hover:border-neon-cyan hover:bg-neon-cyan/10" aria-label={activeId === track.id && playing ? `Pause ${track.title}` : `Play ${track.title}`}>{activeId === track.id && playing ? <Pause size={14} /> : <Play size={14} />}</button><span className={kind === 'youtube' ? 'text-neon-pink' : kind === 'spotify' ? 'text-neon-lime' : 'text-neon-cyan'}>{kind === 'youtube' ? <Youtube size={17} /> : <Music2 size={17} />}</span><button onClick={() => selectTrack(track)} className="min-w-0 flex-1 text-left"><span className="block text-sm font-body font-semibold text-lavender-100 truncate">{track.title}</span><span className="block text-xs font-body text-lavender-500 mt-0.5">{kind === 'audio' ? 'Audio file' : kind === 'youtube' ? 'YouTube player' : 'Spotify player'}</span></button>{activeId === track.id && kind === 'audio' && <div className="flex items-center gap-1 shrink-0"><button onClick={() => changeTrack(-1)} className="btn-ghost !p-1.5" aria-label="Previous track"><ChevronLeft size={14} /></button><button onClick={stopPlayback} className="btn-ghost !p-1.5" aria-label="Stop"><Square size={13} /></button><button onClick={replayPlayback} className="btn-ghost !p-1.5" aria-label="Replay"><RotateCcw size={13} /></button><button onClick={() => setLoop((current) => !current)} className={`btn-ghost !p-1.5 ${loop ? '!border-neon-cyan !text-neon-cyan' : ''}`} aria-label={loop ? 'Disable loop' : 'Enable loop'}><Repeat size={13} /></button><button onClick={() => changeTrack(1)} className="btn-ghost !p-1.5" aria-label="Next track"><ChevronRight size={14} /></button><label className="hidden sm:flex items-center gap-1 text-lavender-300 ml-1"><Volume2 size={13} /><input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="w-16 accent-cyan-300" aria-label="Volume" /></label></div>}<button onClick={() => void removeTrack(track.id)} className="text-lavender-500 hover:text-neon-pink p-1" aria-label={`Remove ${track.title}`}><Trash2 size={15} /></button></div>; })}</div>
      </section>

      <audio ref={audioRef} src={activeKind === 'audio' && activeTrack ? activeTrack.url : undefined} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={handleAudioEnded} className="hidden" />
      {activeTrack && activeKind && <section className="rounded-xl border-2 border-neon-cyan/50 bg-midnight-900/80 p-4 shadow-glow-cyan"><div className="flex flex-wrap items-center gap-3"><div className="w-10 h-10 rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 flex items-center justify-center text-neon-cyan"><Music2 size={18} /></div><div className="min-w-0 flex-1"><p className="font-display text-xs text-lavender-100 truncate">{activeTrack.title}</p><p className="text-xs text-lavender-400 font-body mt-1">{activeKind === 'audio' ? 'Playing inside SCHOLARLY' : 'Embedded player'}</p></div></div>{(activeKind === 'youtube' || activeKind === 'spotify') && getEmbedUrl(activeTrack.url, activeKind) && <iframe src={getEmbedUrl(activeTrack.url, activeKind) || undefined} title={activeTrack.title} className="w-full h-32 mt-3 rounded-lg border border-lavender-500/30" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen loading="lazy" />}</section>}

      <section className="rounded-xl border-2 border-lavender-500/40 bg-midnight-900/70 p-4"><div className="flex items-center gap-2 mb-3"><Link2 size={16} className="text-neon-cyan" /><h2 className="font-display text-xs text-lavender-100">ADD A TRACK</h2></div><div className="grid md:grid-cols-[0.8fr_1.8fr_auto] gap-2"><input className="input-pixel font-body" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Track name" /><input id="add-track" className="input-pixel font-body" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="YouTube, Spotify, or direct audio link" onKeyDown={(event) => event.key === 'Enter' && void saveTrack()} /><button className="btn-pixel-pink" onClick={() => void saveTrack()}><Plus size={16} /> Add track</button></div>{error && <p className="mt-2 text-sm text-neon-pink font-body">{error}</p>}</section>
    </div>
  );
}
