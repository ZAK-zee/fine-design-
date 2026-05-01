import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient.js';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Image, Wrench, MessageSquare, LogOut, Plus, Trash2, X, Upload, Pencil, Users, Star, FileText, LayoutDashboard, Share2, Settings } from 'lucide-react';

const TABS = [
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'portfolio', label: 'Portfolio', icon: Image },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'about', label: 'About Page', icon: FileText },
  { id: 'stats', label: 'Stats', icon: LayoutDashboard },
  { id: 'social', label: 'Social Media', icon: Share2 },
  { id: 'settings', label: 'Site Settings', icon: Settings },
];

const CATEGORIES = ['Construction & Building Works', 'Interior Finishing & Fit-Out', 'Fire Fighting & Fire Alarm Systems', 'HVAC Maintenance & Services'];
const SOCIAL_PLATFORMS = ['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'YouTube', 'Website'];

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#1A2744]">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
      </div>
      {children}
    </div>
  </div>
);

const ModalActions = ({ onCancel, onSave, saving, saveLabel = 'Save', saveStyle = 'gold' }) => (
  <div className="flex gap-3 mt-6">
    <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
    <button onClick={onSave} disabled={saving} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all ${saveStyle === 'gold' ? 'bg-[#C9A84C] text-black hover:bg-[#C9A84C]/90' : 'bg-[#1A2744] text-white hover:bg-[#1A2744]/90'}`}>
      {saving ? 'Saving...' : saveLabel}
    </button>
  </div>
);

const ImageUpload = ({ file, setFile, currentUrl, label = 'Upload Image' }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
    {currentUrl && !file && <img src={currentUrl} alt="current" className="w-full h-32 object-cover rounded-xl mb-2" />}
    <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-4 cursor-pointer hover:border-[#C9A84C] transition-colors">
      <Upload className="w-5 h-5 text-gray-400" />
      <span className="text-sm text-gray-500">{file ? file.name : 'Click to upload image'}</span>
      <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
    </label>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('messages');
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'viewer'
  const isAdmin = userRole === 'admin';

  const [messages, setMessages] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [team, setTeam] = useState([]);
  const [aboutContent, setAboutContent] = useState({ story: '', mission: '', image_url: '' });
  const [aboutId, setAboutId] = useState(null);
  const [stats, setStats] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [siteSettings, setSiteSettings] = useState({ phone: '', email: '', address: '', whatsapp: '', phone2: '', hours: '', map_url: '', map_link: '', hero_tagline: '', hero_subtitle: '' });
  const [siteSettingsId, setSiteSettingsId] = useState(null);

  // Portfolio state
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [showEditPhoto, setShowEditPhoto] = useState(false);
  const [photoForm, setPhotoForm] = useState({ title: '', category: CATEGORIES[0], description: '', image_url: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);

  // Service state
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [serviceForm, setServiceForm] = useState({ title: '', description: '', features: '', image_url: '' });
  const [serviceFile, setServiceFile] = useState(null);
  const [uploadingService, setUploadingService] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Testimonial state
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [showEditTestimonial, setShowEditTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ author: '', role: '', text: '', rating: 5 });
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // Team state
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: '', role: '', bio: '', image_url: '' });
  const [teamFile, setTeamFile] = useState(null);
  const [savingTeam, setSavingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  // About state
  const [aboutFile, setAboutFile] = useState(null);
  const [savingAbout, setSavingAbout] = useState(false);
  const [savingStats, setSavingStats] = useState(false);

  // Social state
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [showEditSocial, setShowEditSocial] = useState(false);
  const [socialForm, setSocialForm] = useState({ platform: SOCIAL_PLATFORMS[0], url: '' });
  const [savingSocial, setSavingSocial] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);

  // Site settings state
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => { checkAuth(); fetchAll(); }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/admin/login'); return; }
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).single();
    setUserRole(roleData?.role || 'admin'); // fallback to admin if no role set (existing users)
  };

  const fetchAll = async () => {
    setIsLoading(true);
    const [msgRes, portRes, svcRes, testRes, teamRes, aboutRes, statsRes, socialRes, settingsRes] = await Promise.all([
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
      supabase.from('portfolio').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('created_at', { ascending: true }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('team').select('*').order('created_at', { ascending: true }),
      supabase.from('about_content').select('*').order('updated_at', { ascending: false }).limit(1),
      supabase.from('about_stats').select('*').order('sort_order', { ascending: true }),
      supabase.from('social_links').select('*').order('sort_order', { ascending: true }),
      supabase.from('site_settings').select('*').limit(1),
    ]);
    if (msgRes.data) setMessages(msgRes.data);
    if (portRes.data) setPortfolio(portRes.data);
    if (svcRes.data) setServices(svcRes.data);
    if (testRes.data) setTestimonials(testRes.data);
    if (teamRes.data) setTeam(teamRes.data);
    if (aboutRes.data && aboutRes.data.length > 0) { setAboutContent(aboutRes.data[0]); setAboutId(aboutRes.data[0].id); }
    if (statsRes.data) setStats(statsRes.data);
    if (socialRes.data) setSocialLinks(socialRes.data);
    if (settingsRes.data && settingsRes.data.length > 0) {
      setSiteSettings(settingsRes.data[0]);
      setSiteSettingsId(settingsRes.data[0].id);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/admin/login'); };

  const uploadImage = async (file, folder) => {
    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('site-images').upload(filename, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('site-images').getPublicUrl(filename);
    return data.publicUrl;
  };

  // Messages
  const deleteMessage = async (id) => {
    await supabase.from('messages').delete().eq('id', id);
    setMessages(messages.filter(m => m.id !== id));
    toast.success('Deleted ✅');
  };

  // Portfolio
  const addPhoto = async () => {
    if (!photoForm.title || (!photoFile && !photoForm.image_url)) { toast.error('Add title and image'); return; }
    setUploadingPhoto(true);
    try {
      let image_url = photoForm.image_url;
      if (photoFile) image_url = await uploadImage(photoFile, 'portfolio');
      const { data, error } = await supabase.from('portfolio').insert([{ ...photoForm, image_url }]).select();
      if (error) throw error;
      setPortfolio([data[0], ...portfolio]);
      setShowAddPhoto(false); setPhotoForm({ title: '', category: CATEGORIES[0], description: '', image_url: '' }); setPhotoFile(null);
      toast.success('Photo added ✅');
    } catch { toast.error('Upload failed'); }
    setUploadingPhoto(false);
  };

  const openEditPhoto = (item) => { setEditingPhoto(item); setPhotoForm({ title: item.title, category: item.category, description: item.description || '', details: item.details || '', image_url: item.image_url || '' }); setPhotoFile(null); setShowEditPhoto(true); };

  const saveEditPhoto = async () => {
    setUploadingPhoto(true);
    try {
      let image_url = photoForm.image_url;
      if (photoFile) image_url = await uploadImage(photoFile, 'portfolio');
      const { data, error } = await supabase.from('portfolio').update({ ...photoForm, image_url }).eq('id', editingPhoto.id).select();
      if (error) throw error;
      setPortfolio(portfolio.map(p => p.id === editingPhoto.id ? data[0] : p));
      setShowEditPhoto(false); setEditingPhoto(null);
      toast.success('Updated ✅');
    } catch { toast.error('Update failed'); }
    setUploadingPhoto(false);
  };

  const deletePhoto = async (id) => { await supabase.from('portfolio').delete().eq('id', id); setPortfolio(portfolio.filter(p => p.id !== id)); toast.success('Deleted ✅'); };

  // Services
  const addService = async () => {
    if (!serviceForm.title || !serviceForm.description) { toast.error('Fill title and description'); return; }
    setUploadingService(true);
    try {
      let image_url = serviceForm.image_url;
      if (serviceFile) image_url = await uploadImage(serviceFile, 'services');
      const features = serviceForm.features.split(',').map(f => f.trim()).filter(Boolean);
      const { data, error } = await supabase.from('services').insert([{ title: serviceForm.title, description: serviceForm.description, features, image_url }]).select();
      if (error) throw error;
      setServices([...services, data[0]]);
      setShowAddService(false); setServiceForm({ title: '', description: '', features: '', image_url: '' }); setServiceFile(null);
      toast.success('Service added ✅');
    } catch { toast.error('Failed'); }
    setUploadingService(false);
  };

  const openEditService = (svc) => { setEditingService(svc); setServiceForm({ title: svc.title, description: svc.description, features: Array.isArray(svc.features) ? svc.features.join(', ') : '', image_url: svc.image_url || '' }); setServiceFile(null); setShowEditService(true); };

  const saveEditService = async () => {
    setUploadingService(true);
    try {
      let image_url = serviceForm.image_url;
      if (serviceFile) image_url = await uploadImage(serviceFile, 'services');
      const features = serviceForm.features.split(',').map(f => f.trim()).filter(Boolean);
      const { data, error } = await supabase.from('services').update({ title: serviceForm.title, description: serviceForm.description, features, image_url }).eq('id', editingService.id).select();
      if (error) throw error;
      setServices(services.map(s => s.id === editingService.id ? data[0] : s));
      setShowEditService(false); setEditingService(null);
      toast.success('Updated ✅');
    } catch { toast.error('Update failed'); }
    setUploadingService(false);
  };

  const deleteService = async (id) => { await supabase.from('services').delete().eq('id', id); setServices(services.filter(s => s.id !== id)); toast.success('Deleted ✅'); };

  // Testimonials
  const addTestimonial = async () => {
    if (!testimonialForm.author || !testimonialForm.text) { toast.error('Fill author and review'); return; }
    setSavingTestimonial(true);
    const { data, error } = await supabase.from('testimonials').insert([testimonialForm]).select();
    if (!error) { setTestimonials([data[0], ...testimonials]); setShowAddTestimonial(false); setTestimonialForm({ author: '', role: '', text: '', rating: 5 }); toast.success('Added ✅'); }
    setSavingTestimonial(false);
  };

  const openEditTestimonial = (t) => { setEditingTestimonial(t); setTestimonialForm({ author: t.author, role: t.role || '', text: t.text, rating: t.rating || 5 }); setShowEditTestimonial(true); };

  const saveEditTestimonial = async () => {
    setSavingTestimonial(true);
    const { data, error } = await supabase.from('testimonials').update(testimonialForm).eq('id', editingTestimonial.id).select();
    if (!error) { setTestimonials(testimonials.map(t => t.id === editingTestimonial.id ? data[0] : t)); setShowEditTestimonial(false); setEditingTestimonial(null); toast.success('Updated ✅'); }
    setSavingTestimonial(false);
  };

  const deleteTestimonial = async (id) => { await supabase.from('testimonials').delete().eq('id', id); setTestimonials(testimonials.filter(t => t.id !== id)); toast.success('Deleted ✅'); };

  // Team
  const addTeamMember = async () => {
    if (!teamForm.name) { toast.error('Name is required'); return; }
    setSavingTeam(true);
    try {
      let image_url = teamForm.image_url;
      if (teamFile) image_url = await uploadImage(teamFile, 'team');
      const { data, error } = await supabase.from('team').insert([{ ...teamForm, image_url }]).select();
      if (error) throw error;
      setTeam([...team, data[0]]); setShowAddTeam(false); setTeamForm({ name: '', role: '', bio: '', image_url: '' }); setTeamFile(null);
      toast.success('Team member added ✅');
    } catch { toast.error('Failed'); }
    setSavingTeam(false);
  };

  const openEditTeam = (m) => { setEditingTeam(m); setTeamForm({ name: m.name, role: m.role || '', bio: m.bio || '', image_url: m.image_url || '' }); setTeamFile(null); setShowEditTeam(true); };

  const saveEditTeam = async () => {
    setSavingTeam(true);
    try {
      let image_url = teamForm.image_url;
      if (teamFile) image_url = await uploadImage(teamFile, 'team');
      const { data, error } = await supabase.from('team').update({ ...teamForm, image_url }).eq('id', editingTeam.id).select();
      if (error) throw error;
      setTeam(team.map(m => m.id === editingTeam.id ? data[0] : m)); setShowEditTeam(false); setEditingTeam(null);
      toast.success('Updated ✅');
    } catch { toast.error('Failed'); }
    setSavingTeam(false);
  };

  const deleteTeamMember = async (id) => { await supabase.from('team').delete().eq('id', id); setTeam(team.filter(m => m.id !== id)); toast.success('Deleted ✅'); };

  // About
  const saveAbout = async () => {
    setSavingAbout(true);
    try {
      let image_url = aboutContent.image_url;
      if (aboutFile) image_url = await uploadImage(aboutFile, 'about');
      const payload = { story: aboutContent.story, mission: aboutContent.mission, image_url, updated_at: new Date().toISOString() };
      if (aboutId) {
        await supabase.from('about_content').update(payload).eq('id', aboutId);
      } else {
        const { data } = await supabase.from('about_content').insert([payload]).select();
        if (data) setAboutId(data[0].id);
      }
      setAboutFile(null);
      toast.success('About page updated ✅');
    } catch { toast.error('Failed to save'); }
    setSavingAbout(false);
  };

  // Social Links
  const addSocialLink = async () => {
    if (!socialForm.url) { toast.error('Enter a URL'); return; }
    setSavingSocial(true);
    try {
      const { data, error } = await supabase.from('social_links').insert([{ ...socialForm, sort_order: socialLinks.length }]).select();
      if (error) throw error;
      setSocialLinks([...socialLinks, data[0]]);
      setShowAddSocial(false); setSocialForm({ platform: SOCIAL_PLATFORMS[0], url: '' });
      toast.success('Social link added ✅');
    } catch { toast.error('Failed'); }
    setSavingSocial(false);
  };

  const openEditSocial = (s) => { setEditingSocial(s); setSocialForm({ platform: s.platform, url: s.url }); setShowEditSocial(true); };

  const saveEditSocial = async () => {
    setSavingSocial(true);
    try {
      const { data, error } = await supabase.from('social_links').update(socialForm).eq('id', editingSocial.id).select();
      if (error) throw error;
      setSocialLinks(socialLinks.map(s => s.id === editingSocial.id ? data[0] : s));
      setShowEditSocial(false); setEditingSocial(null);
      toast.success('Updated ✅');
    } catch { toast.error('Failed'); }
    setSavingSocial(false);
  };

  const deleteSocialLink = async (id) => {
    await supabase.from('social_links').delete().eq('id', id);
    setSocialLinks(socialLinks.filter(s => s.id !== id));
    toast.success('Deleted ✅');
  };

  // Site Settings
  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const payload = {
        phone: siteSettings.phone,
        email: siteSettings.email,
        address: siteSettings.address,
        whatsapp: siteSettings.whatsapp,
        hours: siteSettings.hours,
        map_url: siteSettings.map_url,
        map_link: siteSettings.map_link,
        hero_tagline: siteSettings.hero_tagline,
        hero_subtitle: siteSettings.hero_subtitle,
        updated_at: new Date().toISOString(),
      };
      if (siteSettingsId) {
        await supabase.from('site_settings').update(payload).eq('id', siteSettingsId);
      } else {
        const { data } = await supabase.from('site_settings').insert([payload]).select();
        if (data) setSiteSettingsId(data[0].id);
      }
      toast.success('Settings saved ✅');
    } catch { toast.error('Failed to save'); }
    setSavingSettings(false);
  };

  const dashStats = [
    { label: 'Messages', value: messages.length, color: 'bg-blue-500' },
    { label: 'Portfolio', value: portfolio.length, color: 'bg-emerald-500' },
    { label: 'Services', value: services.length, color: 'bg-amber-500' },
    { label: 'Reviews', value: testimonials.length, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A2744] text-white flex flex-col fixed h-full z-20">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Fine Design" className="h-10 w-auto" />
            <div><p className="font-bold text-sm">Fine Design</p><p className="text-xs text-white/50">Admin Panel</p></div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="text-white/30 text-xs uppercase tracking-widest px-3 mb-3">Navigation</p>
          {TABS.filter(tab => isAdmin || tab.id === 'messages').map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-[#C9A84C] text-black' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" />{tab.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-6 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
            <LogOut className="w-5 h-5" />Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {dashStats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
              <div className={`w-3 h-10 rounded-full ${s.color}`} />
              <div><p className="text-gray-500 text-xs">{s.label}</p><p className="text-3xl font-bold text-[#1A2744]">{s.value}</p></div>
            </div>
          ))}
        </div>

        {isLoading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (<>

          {/* Viewer notice */}
          {userRole === 'viewer' && (
            <div className="mb-6 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm flex items-center gap-3">
              <span className="text-lg">👁️</span>
              <span>You have <strong>view-only</strong> access. You can read messages but cannot make any changes.</span>
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="text-lg font-semibold text-[#1A2744]">Contact Messages</h2>
              </div>
              {messages.length === 0 ? <div className="text-center py-20 text-gray-400">No messages yet</div> : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                      <tr>{['Name','Email','Phone','Message','Date',''].map(h => <th key={h} className="px-6 py-3 text-left">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {messages.map(msg => (
                        <tr key={msg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-[#1A2744]">{msg.name}</td>
                          <td className="px-6 py-4 text-gray-600">{msg.email}</td>
                          <td className="px-6 py-4 text-gray-600">{msg.phone}</td>
                          <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{msg.message}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{new Date(msg.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4">{isAdmin && <button onClick={() => deleteMessage(msg.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#1A2744] flex items-center gap-2"><Image className="w-5 h-5 text-[#C9A84C]" />Portfolio Photos</h2>
                <button onClick={() => { setPhotoForm({ title: '', category: CATEGORIES[0], description: '', image_url: '' }); setPhotoFile(null); setShowAddPhoto(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] text-black font-semibold rounded-xl hover:bg-[#C9A84C]/90"><Plus className="w-4 h-4" />Add Photo</button>
              </div>
              {showAddPhoto && <Modal title="Add Photo" onClose={() => setShowAddPhoto(false)}>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Title *</label><Input value={photoForm.title} onChange={e => setPhotoForm({...photoForm, title: e.target.value})} placeholder="Project title" /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                    <select value={photoForm.category} onChange={e => setPhotoForm({...photoForm, category: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Short Description</label><Input value={photoForm.description} onChange={e => setPhotoForm({...photoForm, description: e.target.value})} placeholder="Brief summary shown on hover" /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Full Details</label><textarea value={photoForm.details || ''} onChange={e => setPhotoForm({...photoForm, details: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none" placeholder="Full project details..." /></div>
                  <ImageUpload file={photoFile} setFile={setPhotoFile} currentUrl={photoForm.image_url} />
                </div>
                <ModalActions onCancel={() => setShowAddPhoto(false)} onSave={addPhoto} saving={uploadingPhoto} saveLabel="Add Photo" saveStyle="dark" />
              </Modal>}
              {showEditPhoto && <Modal title="Edit Photo" onClose={() => setShowEditPhoto(false)}>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Title *</label><Input value={photoForm.title} onChange={e => setPhotoForm({...photoForm, title: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                    <select value={photoForm.category} onChange={e => setPhotoForm({...photoForm, category: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Short Description</label><Input value={photoForm.description} onChange={e => setPhotoForm({...photoForm, description: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Full Details</label><textarea value={photoForm.details || ''} onChange={e => setPhotoForm({...photoForm, details: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none" /></div>
                  <ImageUpload file={photoFile} setFile={setPhotoFile} currentUrl={photoForm.image_url} />
                </div>
                <ModalActions onCancel={() => setShowEditPhoto(false)} onSave={saveEditPhoto} saving={uploadingPhoto} saveLabel="Save Changes" />
              </Modal>}
              {portfolio.length === 0 ? <div className="bg-white rounded-2xl border border-gray-200 text-center py-20 text-gray-400">No photos yet</div> : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm group">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3">
                          <button onClick={() => openEditPhoto(item)} className="opacity-0 group-hover:opacity-100 bg-[#C9A84C] text-black p-2 rounded-full transition-all"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => deletePhoto(item.id)} className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wide">{item.category}</span>
                        <p className="font-semibold text-[#1A2744] mt-1">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SERVICES */}
          {activeTab === 'services' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#1A2744] flex items-center gap-2"><Wrench className="w-5 h-5 text-[#C9A84C]" />Services</h2>
                <button onClick={() => { setServiceForm({ title: '', description: '', features: '', image_url: '' }); setServiceFile(null); setShowAddService(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] text-black font-semibold rounded-xl hover:bg-[#C9A84C]/90"><Plus className="w-4 h-4" />Add Service</button>
              </div>
              {showAddService && <Modal title="Add Service" onClose={() => setShowAddService(false)}>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Title *</label><Input value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} placeholder="Service title" /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Description *</label><textarea value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none" placeholder="Describe the service..." /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Features (comma separated)</label><Input value={serviceForm.features} onChange={e => setServiceForm({...serviceForm, features: e.target.value})} placeholder="Feature 1, Feature 2" /></div>
                  <ImageUpload file={serviceFile} setFile={setServiceFile} currentUrl={serviceForm.image_url} />
                </div>
                <ModalActions onCancel={() => setShowAddService(false)} onSave={addService} saving={uploadingService} saveLabel="Add Service" saveStyle="dark" />
              </Modal>}
              {showEditService && <Modal title="Edit Service" onClose={() => setShowEditService(false)}>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Title *</label><Input value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Description *</label><textarea value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none" /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Features (comma separated)</label><Input value={serviceForm.features} onChange={e => setServiceForm({...serviceForm, features: e.target.value})} /></div>
                  <ImageUpload file={serviceFile} setFile={setServiceFile} currentUrl={serviceForm.image_url} />
                </div>
                <ModalActions onCancel={() => setShowEditService(false)} onSave={saveEditService} saving={uploadingService} saveLabel="Save Changes" />
              </Modal>}
              {services.length === 0 ? <div className="bg-white rounded-2xl border border-gray-200 text-center py-20 text-gray-400">No services yet</div> : (
                <div className="space-y-4">
                  {services.map(svc => (
                    <div key={svc.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-6 shadow-sm">
                      {svc.image_url && <img src={svc.image_url} alt={svc.title} className="w-32 h-24 object-cover rounded-xl flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1A2744] text-lg">{svc.title}</h3>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{svc.description}</p>
                        {svc.features?.length > 0 && <div className="flex flex-wrap gap-2 mt-3">{svc.features.map((f,i) => <span key={i} className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full">{f}</span>)}</div>}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button onClick={() => openEditService(svc)} className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => deleteService(svc.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#1A2744] flex items-center gap-2"><Star className="w-5 h-5 text-[#C9A84C]" />Client Reviews</h2>
                <button onClick={() => { setTestimonialForm({ author: '', role: '', text: '', rating: 5 }); setShowAddTestimonial(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] text-black font-semibold rounded-xl hover:bg-[#C9A84C]/90"><Plus className="w-4 h-4" />Add Review</button>
              </div>
              {showAddTestimonial && <Modal title="Add Review" onClose={() => setShowAddTestimonial(false)}>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Client Name *</label><Input value={testimonialForm.author} onChange={e => setTestimonialForm({...testimonialForm, author: e.target.value})} placeholder="e.g. Ahmed Al Mansoori" /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Role / Title</label><Input value={testimonialForm.role} onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})} placeholder="e.g. Villa Owner, Dubai" /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Review *</label><textarea value={testimonialForm.text} onChange={e => setTestimonialForm({...testimonialForm, text: e.target.value})} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none" placeholder="What did the client say?" /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Rating</label>
                    <div className="flex gap-2">{[1,2,3,4,5].map(n => <button key={n} onClick={() => setTestimonialForm({...testimonialForm, rating: n})} className={`text-2xl ${n <= testimonialForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>)}</div>
                  </div>
                </div>
                <ModalActions onCancel={() => setShowAddTestimonial(false)} onSave={addTestimonial} saving={savingTestimonial} saveLabel="Add Review" saveStyle="dark" />
              </Modal>}
              {showEditTestimonial && <Modal title="Edit Review" onClose={() => setShowEditTestimonial(false)}>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Client Name *</label><Input value={testimonialForm.author} onChange={e => setTestimonialForm({...testimonialForm, author: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Role / Title</label><Input value={testimonialForm.role} onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Review *</label><textarea value={testimonialForm.text} onChange={e => setTestimonialForm({...testimonialForm, text: e.target.value})} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none" /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Rating</label>
                    <div className="flex gap-2">{[1,2,3,4,5].map(n => <button key={n} onClick={() => setTestimonialForm({...testimonialForm, rating: n})} className={`text-2xl ${n <= testimonialForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>)}</div>
                  </div>
                </div>
                <ModalActions onCancel={() => setShowEditTestimonial(false)} onSave={saveEditTestimonial} saving={savingTestimonial} saveLabel="Save Changes" />
              </Modal>}
              {testimonials.length === 0 ? <div className="bg-white rounded-2xl border border-gray-200 text-center py-20 text-gray-400">No reviews yet</div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map(t => (
                    <div key={t.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div><p className="font-bold text-[#1A2744]">{t.author}</p><p className="text-sm text-gray-500">{t.role}</p></div>
                        <div className="flex gap-2">
                          <button onClick={() => openEditTestimonial(t)} className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => deleteTestimonial(t.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-3">{[...Array(t.rating || 5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}</div>
                      <p className="text-gray-600 text-sm italic">"{t.text}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TEAM */}
          {activeTab === 'team' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#1A2744] flex items-center gap-2"><Users className="w-5 h-5 text-[#C9A84C]" />Team Members</h2>
                <button onClick={() => { setTeamForm({ name: '', role: '', bio: '', image_url: '' }); setTeamFile(null); setShowAddTeam(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] text-black font-semibold rounded-xl hover:bg-[#C9A84C]/90"><Plus className="w-4 h-4" />Add Member</button>
              </div>
              {showAddTeam && <Modal title="Add Team Member" onClose={() => setShowAddTeam(false)}>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Name *</label><Input value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} placeholder="Full name" /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Role / Position</label><Input value={teamForm.role} onChange={e => setTeamForm({...teamForm, role: e.target.value})} placeholder="e.g. Project Manager" /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Bio</label><textarea value={teamForm.bio} onChange={e => setTeamForm({...teamForm, bio: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none" placeholder="Short bio..." /></div>
                  <ImageUpload file={teamFile} setFile={setTeamFile} currentUrl={teamForm.image_url} label="Profile Photo" />
                </div>
                <ModalActions onCancel={() => setShowAddTeam(false)} onSave={addTeamMember} saving={savingTeam} saveLabel="Add Member" saveStyle="dark" />
              </Modal>}
              {showEditTeam && <Modal title="Edit Team Member" onClose={() => setShowEditTeam(false)}>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Name *</label><Input value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Role / Position</label><Input value={teamForm.role} onChange={e => setTeamForm({...teamForm, role: e.target.value})} /></div>
                  <div><label className="text-sm font-medium text-gray-700 block mb-1">Bio</label><textarea value={teamForm.bio} onChange={e => setTeamForm({...teamForm, bio: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none" /></div>
                  <ImageUpload file={teamFile} setFile={setTeamFile} currentUrl={teamForm.image_url} label="Profile Photo" />
                </div>
                <ModalActions onCancel={() => setShowEditTeam(false)} onSave={saveEditTeam} saving={savingTeam} saveLabel="Save Changes" />
              </Modal>}
              {team.length === 0 ? <div className="bg-white rounded-2xl border border-gray-200 text-center py-20 text-gray-400">No team members yet</div> : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {team.map(member => (
                    <div key={member.id} className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                      {member.image_url
                        ? <img src={member.image_url} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-[#C9A84C]/30" />
                        : <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3"><span className="text-2xl font-bold text-[#C9A84C]">{member.name.split(' ').map(n => n[0]).join('')}</span></div>
                      }
                      <p className="font-bold text-[#1A2744]">{member.name}</p>
                      <p className="text-sm text-[#C9A84C] mt-1">{member.role}</p>
                      {member.bio && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{member.bio}</p>}
                      <div className="flex justify-center gap-2 mt-4">
                        <button onClick={() => openEditTeam(member)} className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => deleteTeamMember(member.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABOUT */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-3xl">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <FileText className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="text-lg font-semibold text-[#1A2744]">About Page Content</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Company Story</label>
                  <textarea value={aboutContent.story || ''} onChange={e => setAboutContent({...aboutContent, story: e.target.value})} rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none" placeholder="Tell your company story..." />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Mission Statement</label>
                  <textarea value={aboutContent.mission || ''} onChange={e => setAboutContent({...aboutContent, mission: e.target.value})} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none" placeholder="What is your mission?" />
                </div>
                <ImageUpload file={aboutFile} setFile={setAboutFile} currentUrl={aboutContent.image_url} label="About Page Image" />
                <button onClick={saveAbout} disabled={savingAbout} className="w-full py-3 bg-[#C9A84C] text-black font-semibold rounded-xl hover:bg-[#C9A84C]/90 transition-all disabled:opacity-50">
                  {savingAbout ? 'Saving...' : 'Save About Page ✅'}
                </button>
              </div>
            </div>
          )}

          {/* STATS */}
          {activeTab === 'stats' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-2xl">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <LayoutDashboard className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="text-lg font-semibold text-[#1A2744]">About Page Stats</h2>
              </div>
              <p className="text-sm text-gray-400 mb-6">These numbers appear on the About page in the gold stats bar.</p>
              <div className="space-y-4">
                {stats.map((stat, i) => (
                  <div key={stat.id} className="flex gap-3 items-center">
                    <div className="flex-1"><label className="text-xs font-medium text-gray-500 block mb-1">Value</label><Input value={stat.value} onChange={e => setStats(stats.map((s, idx) => idx === i ? {...s, value: e.target.value} : s))} placeholder="e.g. 150+" className="font-bold text-[#1A2744]" /></div>
                    <div className="flex-1"><label className="text-xs font-medium text-gray-500 block mb-1">Label</label><Input value={stat.label} onChange={e => setStats(stats.map((s, idx) => idx === i ? {...s, label: e.target.value} : s))} placeholder="e.g. Projects Completed" /></div>
                    <button onClick={async () => { await supabase.from('about_stats').delete().eq('id', stat.id); setStats(stats.filter((_, idx) => idx !== i)); toast.success('Deleted ✅'); }} className="mt-5 p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStats([...stats, { id: `new-${Date.now()}`, value: '', label: '', sort_order: stats.length }])} className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"><Plus className="w-4 h-4" /> Add Stat</button>
                <button onClick={async () => { setSavingStats(true); try { for (const stat of stats) { if (stat.id.toString().startsWith('new-')) { await supabase.from('about_stats').insert([{ value: stat.value, label: stat.label, sort_order: stat.sort_order }]); } else { await supabase.from('about_stats').update({ value: stat.value, label: stat.label }).eq('id', stat.id); } } await fetchAll(); toast.success('Stats saved ✅'); } catch { toast.error('Failed to save'); } setSavingStats(false); }} disabled={savingStats} className="flex-1 py-2.5 bg-[#C9A84C] text-black font-semibold rounded-xl hover:bg-[#C9A84C]/90 transition-all disabled:opacity-50">{savingStats ? 'Saving...' : 'Save All Stats ✅'}</button>
              </div>
            </div>
          )}

          {/* SOCIAL MEDIA */}
          {activeTab === 'social' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[#1A2744] flex items-center gap-2"><Share2 className="w-5 h-5 text-[#C9A84C]" />Social Media Links</h2>
                <button onClick={() => { setSocialForm({ platform: SOCIAL_PLATFORMS[0], url: '' }); setShowAddSocial(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] text-black font-semibold rounded-xl hover:bg-[#C9A84C]/90"><Plus className="w-4 h-4" />Add Link</button>
              </div>

              <p className="text-sm text-gray-400 mb-6">These links appear in the footer of your website. Add your real profile URLs.</p>

              {showAddSocial && <Modal title="Add Social Link" onClose={() => setShowAddSocial(false)}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Platform</label>
                    <select value={socialForm.platform} onChange={e => setSocialForm({...socialForm, platform: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                      {SOCIAL_PLATFORMS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Profile URL *</label>
                    <Input value={socialForm.url} onChange={e => setSocialForm({...socialForm, url: e.target.value})} placeholder="https://instagram.com/yourpage" />
                  </div>
                </div>
                <ModalActions onCancel={() => setShowAddSocial(false)} onSave={addSocialLink} saving={savingSocial} saveLabel="Add Link" saveStyle="dark" />
              </Modal>}

              {showEditSocial && <Modal title="Edit Social Link" onClose={() => setShowEditSocial(false)}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Platform</label>
                    <select value={socialForm.platform} onChange={e => setSocialForm({...socialForm, platform: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]">
                      {SOCIAL_PLATFORMS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Profile URL *</label>
                    <Input value={socialForm.url} onChange={e => setSocialForm({...socialForm, url: e.target.value})} />
                  </div>
                </div>
                <ModalActions onCancel={() => setShowEditSocial(false)} onSave={saveEditSocial} saving={savingSocial} saveLabel="Save Changes" />
              </Modal>}

              {socialLinks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 text-center py-20 text-gray-400">
                  No social links yet — add your first one!
                </div>
              ) : (
                <div className="space-y-3">
                  {socialLinks.map(s => (
                    <div key={s.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <Share2 className="w-5 h-5 text-[#C9A84C]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1A2744]">{s.platform}</p>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate block">{s.url}</a>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => openEditSocial(s)} className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => deleteSocialLink(s.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-3xl">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                <Settings className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="text-lg font-semibold text-[#1A2744]">Site Settings</h2>
              </div>
              <div className="space-y-6">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Contact Information</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Phone Number</label>
                      <Input value={siteSettings.phone || ''} onChange={e => setSiteSettings({...siteSettings, phone: e.target.value})} placeholder="+971 50 123 4567" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Phone Number 2</label>
                      <Input value={siteSettings.phone2 || ''} onChange={e => setSiteSettings({...siteSettings, phone2: e.target.value})} placeholder="+20 100 000 0000" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">WhatsApp Number</label>
                      <Input value={siteSettings.whatsapp || ''} onChange={e => setSiteSettings({...siteSettings, whatsapp: e.target.value})} placeholder="+971 50 123 4567 (with country code)" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Email Address</label>
                      <Input value={siteSettings.email || ''} onChange={e => setSiteSettings({...siteSettings, email: e.target.value})} placeholder="info@finedesign.ae" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Address</label>
                      <Input value={siteSettings.address || ''} onChange={e => setSiteSettings({...siteSettings, address: e.target.value})} placeholder="Dubai, United Arab Emirates" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Working Hours</label>
                      <Input value={siteSettings.hours || ''} onChange={e => setSiteSettings({...siteSettings, hours: e.target.value})} placeholder="Sun - Thu: 9:00 AM - 6:00 PM" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Google Maps — Embed URL</label>
                      <Input value={siteSettings.map_url || ''} onChange={e => setSiteSettings({...siteSettings, map_url: e.target.value})} placeholder="https://www.google.com/maps/embed?pb=..." />
                      <p className="text-xs text-gray-400 mt-1">Google Maps → Share → Embed a map → copy only the src="..." URL. This shows the map on the Contact page.</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Google Maps — Short Link</label>
                      <Input value={siteSettings.map_link || ''} onChange={e => setSiteSettings({...siteSettings, map_link: e.target.value})} placeholder="https://maps.app.goo.gl/..." />
                      <p className="text-xs text-gray-400 mt-1">The short link from Google Maps → Share → Copy link. Used for the clickable address in the footer.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Hero Section Text</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Tagline</label>
                      <Input value={siteSettings.hero_tagline || ''} onChange={e => setSiteSettings({...siteSettings, hero_tagline: e.target.value})} placeholder="Design • Build • Better Futures" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Subtitle</label>
                      <textarea value={siteSettings.hero_subtitle || ''} onChange={e => setSiteSettings({...siteSettings, hero_subtitle: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none" placeholder="Transforming spaces into exceptional experiences..." />
                    </div>
                  </div>
                </div>

                <button onClick={saveSettings} disabled={savingSettings} className="w-full py-3 bg-[#C9A84C] text-black font-semibold rounded-xl hover:bg-[#C9A84C]/90 transition-all disabled:opacity-50">
                  {savingSettings ? 'Saving...' : 'Save Settings ✅'}
                </button>
              </div>
            </div>
          )}

        </>)}
      </main>
    </div>
  );
};

export default DashboardPage;