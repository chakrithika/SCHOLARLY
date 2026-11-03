import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-rise-in"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} panel-glow pixel-border rounded-lg relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-lavender-500/40">
          <h3 className="font-display text-sm text-lavender-100 neon-text uppercase tracking-wider">{title}</h3>
          <button
            onClick={onClose}
            className="text-lavender-300 hover:text-neon-pink transition-colors p-1"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
