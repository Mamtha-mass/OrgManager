import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Organization, ModalType, AuthState } from '../types';
import { Button, Input, Card, Modal, Badge } from '../components/ui';
import { 
  Plus, Search, Building2, Users, Database, MoreVertical, 
  Trash2, Edit2, LogOut, ExternalLink, Activity, Server, Loader2,
  ChevronRight, Settings, Bell, Filter, LayoutGrid, List, Zap, Shield, Globe, Lock,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, Cpu
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line
} from 'recharts';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

interface DashboardProps {
  auth: AuthState;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ auth, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [actionLoading, setActionLoading] = useState(false);
  
  // Scroll & Mouse Animation Hooks
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth mouse spring for parallax
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Parallax transforms
  const moveX1 = useTransform(springX, [0, window.innerWidth], [-50, 50]);
  const moveY1 = useTransform(springY, [0, window.innerHeight], [-50, 50]);
  const moveX2 = useTransform(springX, [0, window.innerWidth], [50, -50]);
  const moveY2 = useTransform(springY, [0, window.innerHeight], [50, -50]);
  const rotateGrid = useTransform(springX, [0, window.innerWidth], [1, -1]);

  // Scroll transforms
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // Determine current path
  const currentPath = location.pathname === '/' ? '/dashboard' : location.pathname;

  useEffect(() => {
    fetchOrgs();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchOrgs = async () => {
    try {
      const data = await api.getOrganizations();
      setOrgs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrgs = orgs.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (type: ModalType, org?: Organization) => {
    setModalType(type);
    setSelectedOrg(org || null);
    if (org && type === 'EDIT') {
      setFormData({ name: org.name, email: org.adminEmail, password: '' });
    } else {
      setFormData({ name: '', email: '', password: '' });
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedOrg(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (modalType === 'CREATE') {
        await api.createOrganization({ name: formData.name, email: formData.email });
      } else if (modalType === 'EDIT' && selectedOrg) {
        await api.updateOrganization(selectedOrg.id, { name: formData.name, email: formData.email });
      } else if (modalType === 'DELETE' && selectedOrg) {
        await api.deleteOrganization(selectedOrg.id);
      }
      await fetchOrgs();
      handleCloseModal();
    } catch (error) {
      alert('Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Mock Data
  const chartData = [
    { name: 'Mon', active: 240, requests: 400 },
    { name: 'Tue', active: 350, requests: 600 },
    { name: 'Wed', active: 450, requests: 850 },
    { name: 'Thu', active: 300, requests: 500 },
    { name: 'Fri', active: 550, requests: 950 },
    { name: 'Sat', active: 480, requests: 700 },
    { name: 'Sun', active: 650, requests: 1100 },
  ];

  const recentActivity = [
    { id: 1, type: 'alert', msg: 'High CPU usage detected on cluster-alpha', time: '2 min ago' },
    { id: 2, type: 'success', msg: 'New tenant "Nebula Corp" provisioned', time: '15 min ago' },
    { id: 3, type: 'info', msg: 'Automated backup completed successfully', time: '1 hr ago' },
    { id: 4, type: 'info', msg: 'User "Admin" updated security policies', time: '3 hrs ago' },
  ];

  const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
    <motion.button 
      {...({
        whileHover: { x: 5 }
      } as any)}
      onClick={() => navigate(path)}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group ${
      active 
        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30' 
        : 'text-slate-500 hover:bg-white/50 hover:text-indigo-700'
    }`}>
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
      {label}
      {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
    </motion.button>
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row font-sans text-slate-900 overflow-hidden relative">
      
      {/* --- Dynamic 3D Floating Background Elements --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden perspective-[1000px]">
        {/* Animated Grid Plane */}
        <motion.div 
          style={{ rotateX: 60, rotateZ: rotateGrid, y: 100, opacity: 0.2 }}
          className="absolute -inset-[50%] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px]"
        />

        {/* Floating Orb 1 */}
        <motion.div 
           style={{ y: y1, x: moveX1 }}
           animate={{ rotate: 360, scale: [1, 1.1, 1] }}
           transition={{ rotate: { duration: 100, repeat: Infinity, ease: "linear" }, scale: { duration: 10, repeat: Infinity } }}
           className="absolute top-10 right-[-100px] w-96 h-96 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl mix-blend-multiply" 
        />
        {/* Floating Orb 2 */}
        <motion.div 
           style={{ y: y2, x: moveX2 }}
           animate={{ rotate: -360, scale: [1, 1.2, 1] }}
           transition={{ rotate: { duration: 120, repeat: Infinity, ease: "linear" }, scale: { duration: 15, repeat: Infinity } }}
           className="absolute bottom-20 left-[-50px] w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-rose-400/20 rounded-full blur-3xl mix-blend-multiply" 
        />
        
        {/* Glass 3D Object - Cube-like */}
        <motion.div
          animate={{ y: [0, -30, 0], rotateX: [10, 25, 10], rotateY: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[8%] w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/30 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hidden lg:block z-0"
          style={{ transformStyle: "preserve-3d" }}
        >
           <div className="absolute inset-2 border border-white/20 rounded-2xl" />
        </motion.div>
      </div>

      {/* Colorful Sidebar */}
      <aside className="w-full md:w-72 bg-white/60 backdrop-blur-xl border-r border-white/40 hidden md:flex flex-col z-20 shadow-2xl shadow-indigo-500/5 relative">
        <div className="p-6">
           <motion.div 
             {...({
               initial: { scale: 0.8, opacity: 0 },
               animate: { scale: 1, opacity: 1 }
             } as any)}
             className="flex items-center gap-3 mb-8 cursor-pointer"
             onClick={() => navigate('/')}
            >
             <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg shadow-purple-500/30 text-white transform transition-transform hover:rotate-3">
                <LayoutGrid className="w-6 h-6" />
             </div>
             <div>
               <span className="font-extrabold text-slate-800 text-xl tracking-tight block leading-none">OrgManager</span>
               <span className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 uppercase tracking-widest">Enterprise</span>
             </div>
           </motion.div>
           
           <div className="space-y-6">
             <motion.div 
               {...({
                 variants: containerVariants,
                 initial: "hidden",
                 animate: "show"
               } as any)}
             >
               <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Main Menu</p>
               <nav className="space-y-1.5">
                 <motion.div {...({ variants: itemVariants } as any)}>
                   <SidebarItem icon={Activity} label="Dashboard" path="/dashboard" active={currentPath === '/dashboard' || currentPath === '/'} />
                 </motion.div>
                 <motion.div {...({ variants: itemVariants } as any)}>
                   <SidebarItem icon={Building2} label="Organizations" path="/organizations" active={currentPath === '/organizations'} />
                 </motion.div>
                 <motion.div {...({ variants: itemVariants } as any)}>
                   <SidebarItem icon={Users} label="Team Access" path="/team" active={currentPath === '/team'} />
                 </motion.div>
               </nav>
             </motion.div>

             <motion.div 
               {...({
                 variants: containerVariants,
                 initial: "hidden",
                 animate: "show",
                 transition: { delay: 0.2 }
               } as any)}
             >
               <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Configuration</p>
               <nav className="space-y-1.5">
                 <motion.div {...({ variants: itemVariants } as any)}><SidebarItem icon={Database} label="Data Sources" path="/data" active={currentPath === '/data'} /></motion.div>
                 <motion.div {...({ variants: itemVariants } as any)}><SidebarItem icon={Shield} label="Security" path="/security" active={currentPath === '/security'} /></motion.div>
                 <motion.div {...({ variants: itemVariants } as any)}><SidebarItem icon={Settings} label="Settings" path="/settings" active={currentPath === '/settings'} /></motion.div>
               </nav>
             </motion.div>
           </div>
        </div>

        <div className="mt-auto p-4 mx-4 mb-4">
          <motion.div 
            {...({
              whileHover: { scale: 1.02, y: -2 }
            } as any)}
            className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-white hover:border-indigo-100 hover:bg-white shadow-lg shadow-slate-200/20 transition-all cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white">
                {auth.user?.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-700">{auth.user?.name}</p>
              <p className="text-xs text-slate-500 truncate">Super Admin</p>
            </div>
            <button onClick={onLogout} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
               <LogOut className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative perspective-1000 z-10">
        {/* Header */}
        <header className="hidden md:flex bg-white/40 backdrop-blur-md border-b border-white/50 px-8 py-4 justify-between items-center z-10 sticky top-0">
          <div className="flex items-center gap-2 text-sm">
             <span className="text-slate-500 font-medium">Platform</span>
             <ChevronRight className="w-4 h-4 text-slate-400" />
             <span className="text-slate-900 font-semibold">{
               currentPath === '/organizations' ? 'Organizations' : 
               currentPath === '/team' ? 'Team Access' : 
               currentPath === '/settings' ? 'Settings' : 'Dashboard'
             }</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
               <input className="pl-9 pr-4 py-2 rounded-full bg-white/60 border border-transparent text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64 shadow-sm" placeholder="Global search..." />
            </div>
            <motion.button 
              {...({
                whileHover: { scale: 1.1, rotate: 15 },
                whileTap: { scale: 0.9 },
                transition: { type: "spring", stiffness: 400, damping: 17 }
              } as any)}
              className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors bg-white/60 hover:bg-white rounded-full shadow-sm"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </motion.button>
            <Button variant="secondary" size="sm" className="bg-white/60 hover:bg-white">Help & Docs</Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
          
          {/* --- VIEW: DASHBOARD OVERVIEW --- */}
          {(currentPath === '/dashboard' || currentPath === '/') && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">Welcome back, {auth.user?.name.split(' ')[0]}</h1>
                  <p className="text-slate-500 mt-2 font-medium text-lg">Your system is running smoothly. Here's the latest.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => navigate('/team')}>
                    <Users className="w-4 h-4 mr-2" /> Team
                  </Button>
                  <Button variant="gradient" onClick={() => handleOpenModal('CREATE')}>
                    <Plus className="w-4 h-4 mr-2" /> Provision Tenant
                  </Button>
                </div>
              </div>

              {/* Enhanced KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                  <Card isPressable className="bg-white/80 backdrop-blur-md border-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                           <Building2 className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                          <ArrowUpRight className="w-3 h-3 mr-1" /> +12%
                        </span>
                      </div>
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Tenants</p>
                      <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{orgs.length}</h3>
                      <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-indigo-500 rounded-full" 
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <Card isPressable className="bg-white/80 backdrop-blur-md border-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-inner">
                           <Activity className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                          <ArrowUpRight className="w-3 h-3 mr-1" /> +5.4%
                        </span>
                      </div>
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Active Sessions</p>
                      <h3 className="text-3xl font-extrabold text-slate-900 mt-1">8,245</h3>
                      <div className="mt-4 flex gap-1 items-end h-8">
                         {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                           <motion.div 
                             key={i}
                             initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.5 + (i * 0.1) }}
                             className="flex-1 bg-purple-200 rounded-t-sm hover:bg-purple-500 transition-colors" 
                           />
                         ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                   <Card isPressable className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-slate-700 shadow-xl shadow-slate-900/20">
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                           <Cpu className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-medium text-slate-400">Status</p>
                           <p className="text-sm font-bold text-emerald-400 flex items-center justify-end gap-1">
                             <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Operational
                           </p>
                        </div>
                     </div>
                     <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">System Health</p>
                     <div className="flex items-end gap-2 mt-1">
                       <h3 className="text-3xl font-extrabold text-white">99.9%</h3>
                     </div>
                     <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-slate-400">
                        <span>CPU: 45%</span>
                        <span>RAM: 62%</span>
                        <span>Disk: 28%</span>
                     </div>
                   </Card>
                </motion.div>
              </div>

              {/* Main Charts & Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Traffic Chart */}
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="h-full bg-white/80 backdrop-blur-md border-white">
                    <div className="flex justify-between items-center mb-6">
                       <div>
                         <h3 className="font-bold text-slate-900 text-lg">Traffic Overview</h3>
                         <p className="text-sm text-slate-500">Inbound requests vs Active users</p>
                       </div>
                       <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
                         <option>Last 7 days</option>
                         <option>Last 30 days</option>
                       </select>
                    </div>
                    <div className="h-72 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                           <defs>
                             <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                             </linearGradient>
                             <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                             </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                           <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                           <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                           <Tooltip 
                             contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                           />
                           <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                           <Area type="monotone" dataKey="active" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                         </AreaChart>
                       </ResponsiveContainer>
                    </div>
                  </Card>
                </motion.div>

                {/* Live Activity Feed */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="h-full bg-white/80 backdrop-blur-md border-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900 text-lg">Recent Activity</h3>
                      <div className="flex items-center gap-1.5">
                         <span className="relative flex h-2.5 w-2.5">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                         </span>
                         <span className="text-xs font-medium text-slate-500">Live</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {recentActivity.map((activity, i) => (
                        <motion.div 
                          key={activity.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + (i * 0.1) }}
                          className="flex gap-3 items-start p-3 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100"
                        >
                           <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                             ${activity.type === 'alert' ? 'bg-red-50 text-red-500' : 
                               activity.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 
                               'bg-blue-50 text-blue-500'}`}
                            >
                              {activity.type === 'alert' ? <AlertCircle className="w-4 h-4" /> : 
                               activity.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : 
                               <Clock className="w-4 h-4" />}
                           </div>
                           <div>
                             <p className="text-sm text-slate-800 font-medium leading-tight">{activity.msg}</p>
                             <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                           </div>
                        </motion.div>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-4 text-slate-500">View All Logs</Button>
                  </Card>
                </motion.div>

              </div>
            </motion.div>
          )}

          {/* --- VIEW: ORGANIZATIONS --- */}
          {currentPath === '/organizations' && (
            <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
               className="space-y-6"
            >
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Organizations</h1>
                  <p className="text-slate-500 mt-1 font-medium">Manage and provision tenant environments.</p>
                </div>
                <Button variant="gradient" onClick={() => handleOpenModal('CREATE')} className="shadow-xl shadow-indigo-500/30">
                  <Plus className="w-5 h-5 mr-2" />
                  New Organization
                </Button>
              </div>

              <Card className="overflow-hidden border-white/60 bg-white/80 backdrop-blur-md" noPadding>
              <div className="px-6 py-5 border-b border-slate-100 bg-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                   <h3 className="font-bold text-slate-900 text-lg">Tenant List</h3>
                </div>
                <div className="flex items-center gap-3">
                   <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search tenants..." 
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200/60">
                    <tr>
                      <th className="px-6 py-4">Organization</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Database</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <motion.tbody 
                    {...({
                      variants: containerVariants,
                      initial: "hidden",
                      animate: "show"
                    } as any)}
                    className="divide-y divide-slate-100"
                  >
                    {filteredOrgs.map((org, index) => {
                       const gradients = ['from-blue-400 to-indigo-500', 'from-pink-400 to-rose-500', 'from-emerald-400 to-teal-500'];
                       const gradientClass = gradients[index % gradients.length];
                       return (
                        <motion.tr 
                          key={org.id} 
                          {...({ variants: itemVariants, whileHover: { backgroundColor: "rgba(255, 255, 255, 0.9)" } } as any)}
                          className="transition-colors group hover:shadow-lg"
                        >
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white font-bold text-sm`}>
                                  {org.name.charAt(0)}
                                </div>
                                <div>
                                   <p className="font-bold text-slate-900">{org.name}</p>
                                   <p className="text-xs text-slate-500">{org.adminEmail}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4"><Badge status={org.status} /></td>
                          <td className="px-6 py-4"><code className="bg-slate-100 px-2 py-1 rounded text-xs">{org.collectionName}</code></td>
                          <td className="px-6 py-4 text-slate-500">{new Date(org.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                               <Button size="sm" variant="ghost" onClick={() => handleOpenModal('EDIT', org)}><Edit2 className="w-4 h-4" /></Button>
                               <Button size="sm" variant="ghost" onClick={() => handleOpenModal('DELETE', org)} className="text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                             </div>
                          </td>
                        </motion.tr>
                       )
                    })}
                  </motion.tbody>
                </table>
              </div>
              </Card>
            </motion.div>
          )}

          {/* --- VIEW: TEAM --- */}
          {currentPath === '/team' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Team Access</h1>
                <Card>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                     <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-10 h-10 text-indigo-500" />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900">Team Management</h3>
                     <p className="text-slate-500 max-w-sm mt-2">Manage platform administrators and role-based access control here. (Placeholder view)</p>
                     <Button className="mt-6" variant="outline">Invite Member</Button>
                  </div>
                </Card>
             </motion.div>
          )}

           {/* --- VIEW: SETTINGS --- */}
           {currentPath === '/settings' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Platform Settings</h1>
                <div className="max-w-2xl space-y-6">
                  <Card>
                    <h3 className="font-bold text-lg mb-4">General Configuration</h3>
                    <div className="space-y-4">
                       <Input label="Platform Name" defaultValue="OrgManager Pro" />
                       <Input label="Support Email" defaultValue="support@orgmanager.com" />
                       <div className="flex items-center gap-2 mt-4">
                          <input type="checkbox" className="rounded text-indigo-600" checked readOnly />
                          <span className="text-sm text-slate-600">Enable maintenance mode</span>
                       </div>
                    </div>
                  </Card>
                  <Card>
                    <h3 className="font-bold text-lg mb-4 text-red-600">Danger Zone</h3>
                    <p className="text-sm text-slate-500 mb-4">Irreversible actions regarding platform data.</p>
                    <Button variant="danger">Reset System Data</Button>
                  </Card>
                </div>
             </motion.div>
          )}

        </div>
      </main>

      {/* Modals (Keep existing logic) */}
      <Modal 
        isOpen={modalType === 'CREATE' || modalType === 'EDIT'} 
        onClose={handleCloseModal}
        title={modalType === 'CREATE' ? 'Create New Organization' : 'Edit Organization'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Organization Name" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Acme Corp"
            icon={<Building2 className="w-4 h-4" />}
            required
          />
          <Input 
            label="Admin Email" 
            type="email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            placeholder="admin@company.com"
            icon={<Users className="w-4 h-4" />}
            required
          />
           <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex gap-4 shadow-sm">
             <div className="mt-1 p-2 bg-indigo-100 rounded-lg text-indigo-600 h-fit">
               <Database className="w-4 h-4" />
             </div>
             <div className="text-xs text-indigo-900/80">
               <p className="font-bold text-indigo-900 mb-1 text-sm">Automated Provisioning</p>
               A dedicated MongoDB collection will be created.
             </div>
           </div>
           
           {modalType === 'CREATE' && (
              <Input 
              label="Initial Admin Password" 
              type="password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              icon={<Shield className="w-4 h-4" />}
              required
            />
           )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" variant="gradient" isLoading={actionLoading} className="px-6">
              {modalType === 'CREATE' ? 'Provision Tenant' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={modalType === 'DELETE'}
        onClose={handleCloseModal}
        title="Delete Organization"
      >
        <div className="space-y-6">
          <div className="p-5 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4 shadow-sm">
             <div className="p-3 bg-red-100 rounded-full text-red-600 shadow-sm">
                <Trash2 className="w-6 h-6" />
             </div>
             <div>
               <h4 className="text-base font-bold text-red-900">Critical Action Warning</h4>
               <p className="text-sm text-red-700 mt-1 leading-relaxed">
                 You are about to permanently delete this tenant.
               </p>
             </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
            <Button variant="danger" onClick={handleSubmit} isLoading={actionLoading}>Yes, Delete Everything</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};