import React, { useEffect, type ReactNode } from 'react';
import { MdClose } from 'react-icons/md';

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const ActionDrawer: React.FC<ActionDrawerProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-[#0c0d10] border-l border-[#1e2028] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800/50 z-10"
          aria-label="Close drawer"
        >
          <MdClose className="text-xl" />
        </button>
        
        <div className="h-full overflow-y-auto px-8 py-12">
          {children}
        </div>
      </div>
    </>
  );
};