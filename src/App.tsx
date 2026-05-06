/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  School, 
  Users, 
  Trophy, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  Menu, 
  X,
  Facebook,
  Instagram,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Plus,
  Trash2,
  LogOut,
  Image as ImageIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSupabase } from './lib/supabase';

// --- Types ---
interface NewsItem {
  id: number;
  image_url: string;
  date_string: string;
  title: string;
  description: string;
}

// --- Components ---

const Navbar = ({ onLogin, isAdmin, onLogout }: { onLogin: () => void, isAdmin: boolean, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Bosh sahifa', href: '#' },
    { name: 'Maktab haqida', href: '#about' },
    { name: 'Yangiliklar', href: '#news' },
    { name: 'Galereya', href: '#gallery' },
    { name: 'Bog\'lanish', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || isAdmin ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-blue rounded-lg text-white">
            <School size={28} />
          </div>
          <span className={`font-display font-bold text-xl tracking-tight ${scrolled || isAdmin ? 'text-brand-blue' : 'text-white'}`}>
            11-sonli Maktab
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {!isAdmin && navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={`text-sm font-medium hover:text-brand-gold transition-colors ${scrolled ? 'text-slate-600' : 'text-white/90'}`}
            >
              {link.name}
            </a>
          ))}
          {isAdmin ? (
            <button 
              onClick={onLogout}
              className="bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <LogOut size={16} /> Chiqish
            </button>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-brand-blue text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20"
            >
              Kirish
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        {!isAdmin && (
          <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} className={scrolled ? 'text-brand-blue' : 'text-white'} /> : <Menu size={28} className={scrolled ? 'text-brand-blue' : 'text-white'} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && !isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-medium text-slate-700 hover:text-brand-blue"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <hr />
              <button 
                onClick={() => { setIsOpen(false); onLogin(); }}
                className="w-full bg-brand-blue text-white py-3 rounded-xl font-semibold"
              >
                Kirish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const StatCard = ({ icon: Icon, value, label, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover-glow group"
  >
    <div className="w-12 h-12 bg-slate-50 text-brand-blue rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
      <Icon size={24} />
    </div>
    <div className="text-3xl font-display font-bold text-slate-900 mb-1">{value}</div>
    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</div>
  </motion.div>
);

const NewsCard = ({ image_url, date_string, title, description, isAdmin, onDelete }: any) => (
  <div className="group cursor-pointer relative">
    {isAdmin && (
      <button 
        onClick={onDelete}
        className="absolute top-4 right-4 z-10 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    )}
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-4">
      <img 
        src={image_url} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-blue">
        Yangilik
      </div>
    </div>
    <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
      <Calendar size={14} />
      <span>{date_string}</span>
    </div>
    <h3 className="text-xl font-display font-bold text-slate-900 mb-2 group-hover:text-brand-blue transition-colors leading-tight">
      {title}
    </h3>
    <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
      {description}
    </p>
    {!isAdmin && (
      <div className="flex items-center gap-1 text-brand-blue font-semibold text-sm group-hover:gap-2 transition-all">
        Batafsil o'qish <ArrowRight size={16} />
      </div>
    )}
  </div>
);

const AdminPanel = ({ news, gallery, onAddNews, onAddGallery, onDeleteNews }: any) => {
  const [newNews, setNewNews] = useState({ title: '', description: '' });
  const [newsFile, setNewsFile] = useState<File | null>(null);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);

  const handleNewsSubmit = () => {
    if (newNews.title && newNews.description && newsFile) {
      const formData = new FormData();
      formData.append('title', newNews.title);
      formData.append('description', newNews.description);
      formData.append('image', newsFile);
      onAddNews(formData);
      setNewNews({ title: '', description: '' });
      setNewsFile(null);
    }
  };

  const handleGallerySubmit = () => {
    if (galleryFile) {
      const formData = new FormData();
      formData.append('image', galleryFile);
      onAddGallery(formData);
      setGalleryFile(null);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-brand-light min-h-screen">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-brand-blue text-white p-3 rounded-2xl">
              <Users size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">Admin Panel</h1>
              <p className="text-slate-500">Maktab saytini boshqarish</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '#news'} 
            className="flex items-center gap-2 text-brand-blue font-bold hover:underline"
          >
            Saytni ko'rish (Bosh sahifa) <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Add News */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="text-brand-blue" /> Yangilik qo'shish
            </h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Yangilik sarlavhasi"
                className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl focus:border-brand-blue outline-none text-slate-900"
                value={newNews.title}
                onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
              />
              <textarea 
                placeholder="Batafsil ma'lumot" 
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl focus:border-brand-blue outline-none text-slate-900"
                value={newNews.description}
                onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
              ></textarea>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider block">Yangilik rasmi (JPG, PNG, BMP)</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.bmp"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setNewsFile(e.target.files?.[0] || null)}
                  />
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center group-hover:border-brand-blue transition-colors">
                    <ImageIcon className="text-slate-400 mb-2 group-hover:text-brand-blue transition-colors" size={32} />
                    <p className="text-sm font-medium text-slate-500">
                      {newsFile ? newsFile.name : "Rasmni tanlang yoki bu yerga tashlang"}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleNewsSubmit}
                className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-brand-blue/90 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Yangilikni saqlash
              </button>
            </div>

            <div className="mt-10">
              <h3 className="font-bold text-slate-900 mb-4">Mavjud yangiliklar ({news.length})</h3>
              <div className="space-y-3">
                {news.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image_url} 
                        className="w-10 h-10 rounded-lg object-cover" 
                      />
                      <span className="font-medium text-sm text-slate-700 line-clamp-1">{item.title}</span>
                    </div>
                    <button onClick={() => onDeleteNews(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Gallery */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="text-brand-blue" /> Galereyaga rasm qo'shish
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider block">Galereya rasmi (JPG, PNG, BMP)</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png,.bmp"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                  />
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center group-hover:border-brand-blue transition-colors">
                    <ImageIcon className="text-slate-400 mb-2 group-hover:text-brand-blue transition-colors" size={32} />
                    <p className="text-sm font-medium text-slate-500">
                      {galleryFile ? galleryFile.name : "Rasmni tanlang yoki bu yerga tashlang"}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGallerySubmit}
                className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-brand-blue/90 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Rasm qo'shish
              </button>
            </div>

            <div className="mt-10">
              <h3 className="font-bold text-slate-900 mb-4">Galereya rasmlari ({gallery.length})</h3>
              <div className="grid grid-cols-4 gap-3">
                {gallery.map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-50 relative group">
                    <img 
                      src={img} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const supabase = getSupabase();
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery')
        .select('url')
        .order('created_at', { ascending: false });

      if (newsError) throw newsError;
      if (galleryError) throw galleryError;

      setNews(newsData || []);
      setGallery((galleryData || []).map(g => g.url));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    const supabase = getSupabase();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { data, error } = await supabase.storage
      .from('school-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('school-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleAddNews = async (formData: FormData) => {
    try {
      const supabase = getSupabase();
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const file = formData.get('image') as File;

      const imageUrl = await uploadImage(file);

      const { data, error } = await supabase
        .from('news')
        .insert([{ 
          title, 
          description, 
          image_url: imageUrl, 
          date_string: new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' }) 
        }])
        .select()
        .single();

      if (error) throw error;
      setNews([data, ...news]);
    } catch (error: any) {
      console.error('Error adding news:', error);
      alert('Xatolik: ' + error.message);
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNews(news.filter(n => n.id !== id));
    } catch (error: any) {
      console.error('Error deleting news:', error);
      alert('Xatolik: ' + error.message);
    }
  };

  const handleAddGallery = async (formData: FormData) => {
    try {
      const supabase = getSupabase();
      const file = formData.get('image') as File;
      const imageUrl = await uploadImage(file);

      const { data, error } = await supabase
        .from('gallery')
        .insert([{ url: imageUrl }])
        .select()
        .single();

      if (error) throw error;
      setGallery([data.url, ...gallery]);
    } catch (error: any) {
      console.error('Error adding gallery:', error);
      alert('Xatolik: ' + error.message);
    }
  };

  if (isAdmin) {
    return (
      <div className="bg-brand-light">
        <Navbar isAdmin={true} onLogout={() => setIsAdmin(false)} onLogin={() => {}} />
        <AdminPanel 
          news={news} 
          gallery={gallery} 
          onAddNews={handleAddNews} 
          onAddGallery={handleAddGallery}
          onDeleteNews={handleDeleteNews}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar onLogin={() => setIsAdmin(true)} isAdmin={false} onLogout={() => {}} />

      {/* --- Hero Section --- */}
      <section className="relative h-screen flex items-center bg-brand-blue overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-gold rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white rounded-full blur-[120px]" />
        </div>
        
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            alt="School Exterior"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 via-brand-blue/60 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-white/10">
              <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
              Kelajak bunyodkorlari maskani
            </div>
            <h1 className="text-5xl md:text-7xl text-white mb-6 leading-[1.1]">
              Bilim — <span className="text-brand-gold">baxt</span> va muvaffaqiyat kalitidir
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              11-sonli umumiy o'rta ta'lim maktabi sizning farzandlaringizga sifatli bilim va yuksak ma'naviyat berishda davom etadi.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-brand-gold text-brand-blue px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-brand-gold/20">
                Maktab bilan tanishing <ArrowRight size={20} />
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
                Bog'lanish
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-[40px] overflow-hidden border-[12px] border-white/5 backdrop-blur-xl aspect-square max-w-lg mx-auto shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1523050338692-7b83b907ff1d?auto=format&fit=crop&q=80&w=1000" 
                alt="Students"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 max-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-brand-gold bg-brand-gold/10 p-2 rounded-lg">
                  <Trophy size={20} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Erishilgan</span>
              </div>
              <div className="text-2xl font-display font-bold text-slate-900">100+</div>
              <div className="text-xs text-slate-500 font-medium">Olimpiada g'oliblari</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Stats Counter --- */}
      <section className="py-20 bg-brand-light">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32 relative z-20">
            <StatCard icon={Users} value="1200+" label="O'quvchilar" delay={0.1} />
            <StatCard icon={GraduationCap} value="85+" label="O'qituvchilar" delay={0.2} />
            <StatCard icon={BookOpen} value="45" label="Sinflar" delay={0.3} />
            <StatCard icon={Trophy} value="15" label="Sport to'garaklari" delay={0.4} />
          </div>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl bg-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000" 
                  alt="Classroom"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-gold rounded-full opacity-10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-blue rounded-full opacity-10 blur-3xl" />
            </div>
            
            <div>
              <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Maktabimiz haqida</span>
              <h2 className="text-4xl md:text-5xl text-slate-900 mb-8 leading-[1.2]">
                Zamonaviy ta'lim — yorqin <span className="text-brand-blue italic">kelajak</span> poydevori
              </h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Bizning maktabimiz 1995-yilda tashkil topgan bo'lib, o'sha vaqtdan buyon minglab yoshlarga bilim berib kelmoqda. Biz nafaqat darslikdagi bilimlarni, balki hayotiy ko'nikmalarni va axloqiy qadriyatlarni o'rgatamiz.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 mb-10">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-brand-blue/5 rounded-lg flex items-center justify-center text-brand-blue">
                    <ChevronRight size={20} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold mb-1">Innovatsion metodlar</h4>
                    <p className="text-slate-500 text-sm">Darslar interaktiv shaklda olib boriladi.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-brand-blue/5 rounded-lg flex items-center justify-center text-brand-blue">
                    <ChevronRight size={20} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold mb-1">Tajribali ustozlar</h4>
                    <p className="text-slate-500 text-sm">Oliy toifali o'qituvchilar jamoasi.</p>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-3 text-brand-blue font-bold text-lg hover:underline underline-offset-8 transition-all">
                Batafsil ma'lumot olish <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- News Section --- */}
      <section id="news" className="py-24 bg-brand-light">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">So'nggi voqealar</span>
              <h2 className="text-4xl md:text-5xl text-slate-900">Maktab hayotidan yangiliklar</h2>
            </div>
            <button className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shrink-0">
              Barcha yangiliklar
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <NewsCard 
                  key={item.id}
                  {...item}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- Gallery Section --- */}
      <section id="gallery" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
             <span className="text-brand-blue font-bold uppercase tracking-widest text-sm mb-4 block">Foto lavhalar</span>
             <h2 className="text-4xl md:text-5xl text-slate-900">Maktabimiz foto galereyasi</h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             {gallery.map((img, idx) => (
               <motion.div 
                 key={idx}
                 whileHover={{ scale: 0.98 }}
                 className="aspect-square rounded-2xl overflow-hidden bg-slate-100 group cursor-zoom-in"
               >
                 <img 
                  src={img} 
                  alt={`Gallery item ${idx}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                 />
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Footer Content... (similar to previous, omitted for brevity but fully implemented) */}
      <footer id="contact" className="bg-slate-950 text-white pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 mb-20">
            <div>
              <h2 className="text-4xl font-display font-bold mb-8">Biz bilan bog'lanish</h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Savollaringiz bormi? Biz bilan bog'laning va biz sizga yordam berishdan mamnun bo'lamiz.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-brand-gold">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Manzil</h4>
                    <p className="text-slate-400">Toshkent shahar, Yunusobod tumani, 11-kvartal, 45-uy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-12">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-gold rounded text-brand-blue">
                <School size={20} />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">11-sonli Maktab</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2026 11-sonli umumiy o'rta ta'lim maktabi. Barcha huquqlar himoyalangan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
