import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type T = { id: number; kind: 'ok' | 'err'; text: string };
const Ctx = createContext<(kind: T['kind'], text: string) => void>(() => undefined);
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<T[]>([]);
  const push = useCallback((kind: T['kind'], text: string) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, kind, text }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 5000);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex max-w-sm flex-col gap-2" role="status" aria-live="polite">
        {items.map((t) => <div key={t.id} className={`glass-strong rounded-xl px-4 py-3 text-sm ${t.kind === 'err' ? 'border-red-400/40 text-red-200' : 'border-emerald-400/40 text-emerald-100'}`}>{t.text}</div>)}
      </div>
    </Ctx.Provider>
  );
}
