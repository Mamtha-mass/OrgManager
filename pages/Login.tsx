import React, { useState } from 'react';
import { api } from '../services/mockApi';
import { Button, Input, Card } from '../components/ui';
import { LayoutDashboard, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { AuthState } from '../types';
import { motion } from 'framer-motion';

interface LoginProps {
  setAuth: (auth: AuthState) => void;
}

export const Login: React.FC<LoginProps> = ({ setAuth }) => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { user, token } = await api.login(email, password);
      setAuth({ isAuthenticated: true, user, token });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      {/* Rich Animated Background */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div 
          {...({
            animate: { x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] },
            transition: { duration: 15, repeat: Infinity, ease: "easeInOut" }
          } as any)}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30"
        />
        <motion.div 
          {...({
            animate: { x: [0, -30, 0], y: [0, 50, 0], scale: [1, 1.2, 1] },
            transition: { duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }
          } as any)}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30"
        />
        <motion.div 
          {...({
            animate: { x: [0, 40, 0], y: [0, 40, 0], scale: [1, 1.1, 1] },
            transition: { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }
          } as any)}
          className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30"
        />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="w-full max-w-md px-6 relative z-10" style={{ perspective: 1200 }}>
        <motion.div 
          {...({
            initial: { y: -20, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: { duration: 0.6 }
          } as any)}
          className="text-center mb-10"
        >
          <motion.div 
            {...({
              whileHover: { rotate: 10, scale: 1.1 }
            } as any)}
            className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-tr from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-500/20 mb-6"
          >
            <LayoutDashboard className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
            OrgManager <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Pro</span>
          </h1>
          <p className="text-slate-300 mt-3 text-base font-medium">Enterprise Orchestration Platform</p>
        </motion.div>

        <motion.div
           {...({
             initial: { rotateX: 20, opacity: 0, y: 50 },
             animate: { rotateX: 0, opacity: 1, y: 0 },
             transition: { type: "spring", damping: 20, stiffness: 100, delay: 0.2 }
           } as any)}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden" isPressable={true}>
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-white">Sign In</h2>
               <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/80 flex items-center gap-1.5">
                 <Sparkles className="w-3 h-3 text-yellow-300" /> Secure Access
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200 ml-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all outline-none hover:bg-slate-900/70"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all outline-none hover:bg-slate-900/70"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <a href="#" className="text-xs font-medium text-purple-300 hover:text-purple-200 hover:underline transition-colors">Forgot password?</a>
                </div>
              </div>
              
              {error && (
                <motion.div 
                  {...({
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 }
                  } as any)}
                  className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm flex items-center shadow-lg"
                >
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3 shadow-[0_0_8px_rgba(248,113,113,0.8)]"></div>
                  {error}
                </motion.div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                variant="gradient"
                className="w-full py-4 text-lg"
                isLoading={loading}
              >
                {!loading && (
                   <>Sign In <ArrowRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
        
        <motion.div 
          {...({
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.8 }
          } as any)}
          className="mt-8 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/5 inline-block">
            <p className="text-xs text-slate-400">
             Use <span className="text-white font-mono bg-white/10 px-1 rounded">admin@example.com</span> / <span className="text-white font-mono bg-white/10 px-1 rounded">password</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};