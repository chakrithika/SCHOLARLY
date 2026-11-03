import { useEffect, useState } from 'react';
import { Check, Flag, Plus, Trash2, X } from 'lucide-react';
import { PixelPanel } from '@/components/PixelPanel';
import { supabase, Todo } from '@/lib/supabase';

type Priority = 'low' | 'med' | 'high';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('med');
  const [error, setError] = useState('');
  useEffect(() => { supabase.from('todos').select('*').order('created_at', { ascending: false }).then(({ data, error: loadError }) => { if (loadError) setError(loadError.message); setTodos((data as Todo[]) || []); }); }, []);

  async function add() {
    if (!text.trim()) return;
    const { data, error: saveError } = await supabase.from('todos').insert({ text: text.trim(), priority }).select().maybeSingle();
    if (saveError) { setError(saveError.message); return; }
    if (data) setTodos((prev) => [data as Todo, ...prev]);
    setText('');
  }
  async function toggle(todo: Todo) {
    const { data, error: updateError } = await supabase.from('todos').update({ done: !todo.done }).eq('id', todo.id).select().maybeSingle();
    if (updateError) setError(updateError.message); else if (data) setTodos((prev) => prev.map((item) => item.id === todo.id ? data as Todo : item));
  }
  async function remove(id: string) {
    const { error: removeError } = await supabase.from('todos').delete().eq('id', id);
    if (removeError) setError(removeError.message); else setTodos((prev) => prev.filter((item) => item.id !== id));
  }
  const open = todos.filter((todo) => !todo.done);
  const done = todos.filter((todo) => todo.done);

  return <div className="space-y-5 animate-rise-in max-w-4xl"><header><h1 className="font-display text-base sm:text-lg text-lavender-100 neon-text mb-1">TO-DO LIST</h1><p className="text-sm text-lavender-300 font-body">Keep the next actions for your study session in one place.</p></header>{error && <p className="text-sm text-neon-pink font-body">{error}</p>}<PixelPanel accent="cyan"><div className="flex flex-col sm:flex-row gap-2"><input className="input-pixel flex-1" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && void add()} placeholder="Add a task" /><select className="input-pixel sm:w-32" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}><option value="low">Low</option><option value="med">Medium</option><option value="high">High</option></select><button onClick={() => void add()} className="btn-pixel-pink"><Plus size={16} /> Add</button></div></PixelPanel><div className="grid lg:grid-cols-2 gap-4"><TodoGroup title={`TO DO (${open.length})`} accent="pink" todos={open} onToggle={toggle} onRemove={remove} /><TodoGroup title={`DONE (${done.length})`} accent="lime" todos={done} onToggle={toggle} onRemove={remove} /></div></div>;
}

function TodoGroup({ title, accent, todos, onToggle, onRemove }: { title: string; accent: 'pink' | 'lime'; todos: Todo[]; onToggle: (todo: Todo) => Promise<void>; onRemove: (id: string) => Promise<void> }) { return <PixelPanel title={title} accent={accent}>{todos.length === 0 ? <p className="text-sm text-lavender-300 font-body text-center py-7">Nothing here.</p> : <ul className="space-y-2">{todos.map((todo) => <li key={todo.id} className="flex items-center gap-2 panel !p-2"><button onClick={() => void onToggle(todo)} className={`w-7 h-7 border-2 flex items-center justify-center ${todo.done ? 'border-neon-lime bg-neon-lime/20' : 'border-lavender-400'}`} aria-label={todo.done ? 'Mark task open' : 'Mark task done'}>{todo.done && <Check size={14} className="text-neon-lime" />}</button><span className={`flex-1 font-body text-sm ${todo.done ? 'line-through text-lavender-400' : 'text-lavender-100'}`}>{todo.text}</span><span className="chip !py-0.5"><Flag size={10} /> {todo.priority}</span><button onClick={() => void onRemove(todo.id)} className="text-lavender-400 hover:text-neon-pink" aria-label="Delete task">{todo.done ? <X size={14} /> : <Trash2 size={14} />}</button></li>)}</ul>}</PixelPanel>; }
