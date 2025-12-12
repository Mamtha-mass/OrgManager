import React, { useRef, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', isLoading, className = '', disabled, ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden";
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  };

  const variants = {
    primary: "bg-indigo-600 text-white shadow-[0_4px_0_0_rgba(79,70,229,1)] hover:shadow-[0_2px_0_0_rgba(79,70,229,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
    gradient: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(93,93,255,0.23)] hover:-translate-y-1",
    secondary: "bg-white text-slate-700 border border-slate-200 shadow-[0_2px_0_0_rgba(203,213,225,1)] hover:shadow-[0_1px_0_0_rgba(203,213,225,1)] hover:translate-y-[1px] active:shadow-none active:translate-y-[2px]",
    danger: "bg-red-50 text-red-600 border border-red-100 shadow-sm hover:bg-red-100",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100/50",
    outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
  };

  // Override standard animation for primary/secondary "thick" buttons to use CSS transitions instead of motion for the 'click' effect
  const isThick = variant === 'primary' || variant === 'secondary';

  if (isThick) {
      return (
        <button 
          className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
          disabled={disabled || isLoading}
          {...props}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {children}
        </button>
      );
  }

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props as any}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </motion.button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full group">
      {label && <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{label}</label>}
      <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
            {icon}
          </div>
        )}
        <input 
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl shadow-[4px_4px_0px_0px_rgba(241,245,249,1)] text-sm placeholder:text-slate-400
            transition-all duration-300 outline-none
            focus:shadow-[4px_4px_0px_0px_rgba(99,102,241,0.2)] focus:border-indigo-500
            hover:border-slate-300
            ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/30' : 'border-slate-100'} 
            ${className}`}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          {...({
            initial: { opacity: 0, y: -5 },
            animate: { opacity: 1, y: 0 }
          } as any)}
          className="mt-1.5 ml-1 text-xs text-red-500 font-bold"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// --- 3D Tilt Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; noPadding?: boolean; isPressable?: boolean }> = ({ 
  children, className = '', noPadding = false, isPressable = false 
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]); 
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  return (
    <motion.div 
      className={`relative bg-white rounded-3xl border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ${noPadding ? '' : 'p-6'} ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ 
        perspective: 1200,
        rotateX: isPressable ? rotateX : 0,
        rotateY: isPressable ? rotateY : 0,
        transformStyle: "preserve-3d",
      } as any}
      whileHover={isPressable ? { scale: 1.02, z: 30, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glossy reflection effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-20" />
      
      <div style={{ transform: "translateZ(25px)" }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4">
          <motion.div 
            {...({
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 }
            } as any)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
            onClick={onClose} 
          />
          <motion.div 
            {...({
              initial: { opacity: 0, scale: 0.8, y: 100, rotateX: 20 },
              animate: { opacity: 1, scale: 1, y: 0, rotateX: 0 },
              exit: { opacity: 0, scale: 0.8, y: 100, rotateX: 20 }
            } as any)}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="relative w-full max-w-lg z-10"
            style={{ perspective: 1000 } as any}
          >
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-500/30 overflow-hidden flex flex-col max-h-[90vh] border-4 border-white">
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white">
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  {title}
                </h3>
                <motion.button 
                  {...({
                    whileHover: { rotate: 90, scale: 1.1 },
                    whileTap: { scale: 0.9 }
                  } as any)}
                  onClick={onClose} 
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors bg-slate-50"
                >
                   <X className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="p-8 overflow-y-auto bg-slate-50/50">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Badge ---
export const Badge: React.FC<{ status: string }> = ({ status }) => {
  const styles = {
    Active: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", icon: "bg-emerald-500" },
    Inactive: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: "bg-slate-400" },
    Pending: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", icon: "bg-amber-500" }
  };
  
  const style = styles[status as keyof typeof styles] || styles.Inactive;

  return (
    <motion.span 
      {...({
        whileHover: { scale: 1.05, y: -2 }
      } as any)}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${style.bg} ${style.text} ${style.border} shadow-sm`}
    >
      <span className={`w-2 h-2 rounded-full ${style.icon} animate-pulse shadow-[0_0_8px_currentColor]`} />
      {status}
    </motion.span>
  );
};