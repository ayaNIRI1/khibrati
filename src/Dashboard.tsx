import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  TrendingUp,
  Award,
  Clock,
  PlayCircle,
  Edit,
  Trash2,
  Plus,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from './apiConfig';
import './index.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<any>(null);

  const [stats, setStats] = useState([
    { label: 'إجمالي المتدربين', value: '...', icon: <Users size={24} />, color: 'var(--primary)' },
    { label: 'الدورات المكتملة', value: '...', icon: <Award size={24} />, color: 'var(--secondary)' },
    { label: 'ساعات التدريب', value: '...', icon: <Clock size={24} />, color: 'var(--accent)' },
    { label: 'معدل النجاح', value: '...', icon: <TrendingUp size={24} />, color: '#10b981' },
  ]);

  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  const [courses, setCourses] = useState([
    { id: 1, title: 'أساسيات المبيعات والتسويق', instructor: 'د. خالد عبدالله', duration: '12 ساعة', status: 'متاح', participants: 156, link: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' },
    { id: 2, title: 'إدارة المشاريع الرشيقة (Agile)', instructor: 'م. سارة أحمد', duration: '8 ساعات', status: 'قريباً', participants: 0, link: '' },
    { id: 3, title: 'خدمة العملاء الاحترافية', instructor: 'أ. فاطمة سعيد', duration: '15 ساعة', status: 'متاح', participants: 340, link: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' },
    { id: 4, title: 'تحليل البيانات واتخاذ القرار', instructor: 'د. عمر محمد', duration: '20 ساعة', status: 'متاح', participants: 89, link: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' },
  ]);

  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [watchingCourse, setWatchingCourse] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newCourse, setNewCourse] = useState({ title: '', instructor: '', duration: '', status: 'متاح', link: '' });

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      }
    } catch (e) {
      console.error('Error parsing YouTube URL', e);
    }
    return url;
  };

  const handleDeleteCourse = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.instructor || !newCourse.duration) return;
    
    let videoUrl = newCourse.link;

    // If a file is selected, upload it first
    if (selectedFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append('video', selectedFile);

      try {
        const response = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        videoUrl = data.url;
      } catch (error) {
        console.error('Upload failed:', error);
        alert('فشل رفع الفيديو، يرجى المحاولة مرة أخرى.');
        setUploading(false);
        return;
      }
    }

    const courseToAdd = {
      id: Date.now(),
      title: newCourse.title,
      instructor: newCourse.instructor,
      duration: newCourse.duration,
      status: newCourse.status,
      link: videoUrl,
      participants: 0
    };
    
    setCourses([...courses, courseToAdd]);
    setIsAddingCourse(false);
    setUploading(false);
    setSelectedFile(null);
    setNewCourse({ title: '', instructor: '', duration: '', status: 'متاح', link: '' });
  };

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('khibrati_token');
    const userData = localStorage.getItem('khibrati_user');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // جلب البيانات من واجهة بايثون (API)
    const fetchDashboardData = async () => {
      try {
        const statsRes = await fetch(`${API_BASE}/api/dashboard/stats`);
        const statsData = await statsRes.json();
        setStats([
          { label: 'إجمالي المتدربين', value: statsData.total_trainees.toLocaleString(), icon: <Users size={24} />, color: 'var(--primary)' },
          { label: 'الدورات المكتملة', value: statsData.completed_courses.toLocaleString(), icon: <Award size={24} />, color: 'var(--secondary)' },
          { label: 'ساعات التدريب', value: statsData.training_hours.toLocaleString(), icon: <Clock size={24} />, color: 'var(--accent)' },
          { label: 'معدل النجاح', value: `${statsData.success_rate}%`, icon: <TrendingUp size={24} />, color: '#10b981' },
        ]);

        const usersRes = await fetch(`${API_BASE}/api/dashboard/recent-users`);
        const usersData = await usersRes.json();
        setRecentUsers(usersData);
      } catch (err) {
        console.error("خطأ في جلب بيانات الداشبورد", err);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('khibrati_token');
    localStorage.removeItem('khibrati_user');
    navigate('/login');
  };

  const menuItems = [
    { id: 'overview', label: 'لوحة القيادة', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'المستخدمين', icon: <Users size={20} /> },
    { id: 'courses', label: 'الدورات التدريبية', icon: <BookOpen size={20} /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Background blobs */}
      <div className="blob blob-1" style={{ top: '-10%', right: '-5%' }}></div>
      <div className="blob blob-2" style={{ bottom: '-10%', left: '-5%' }}></div>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{ 
          width: '280px', 
          margin: '1.5rem', 
          borderRadius: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'sticky',
          top: '1.5rem',
          height: 'calc(100vh - 3rem)',
          zIndex: 10
        }}
      >
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 800, fontSize: '1.5rem' }}>
          <img src="/logo.png" alt="Khibrati Logo" style={{ height: '32px' }} />
          خِبرتي
        </div>
        
        <nav style={{ padding: '1.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '1rem',
                width: '100%',
                textAlign: 'right',
                fontWeight: 600,
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
                backgroundColor: activeTab === item.id ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.3s ease',
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ef4444', fontWeight: 600, width: '100%', padding: '0.5rem' }}
          >
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Topbar */}
        <header className="glass-card" style={{ padding: '1rem 2rem', borderRadius: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="البحث في المنصة..." 
              style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '1rem', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'rgba(255,255,255,0.5)' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button style={{ position: 'relative', color: 'var(--text-muted)' }}>
              <Bell size={24} />
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderRight: '1px solid var(--border-color)', paddingRight: '1.5rem' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 700, margin: 0, lineHeight: 1 }}>{user?.name || 'مدير النظام'}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '0.25rem' }}>{user?.role === 'admin' ? 'صلاحيات إدارية' : 'مستخدم'}</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 700 }}>
                {user?.name ? user.name.charAt(0) : 'م'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div style={{ flex: 1, zIndex: 10 }}>
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>نظرة عامة</h2>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem' }}>
                  توليد تقرير
                </button>
              </div>
              
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {stats.map((stat, idx) => (
                  <motion.div 
                    key={idx}
                    className="glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + (idx * 0.1) }}
                    whileHover={{ y: -5 }}
                    style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                  >
                    <div style={{ width: '60px', height: '60px', borderRadius: '1rem', backgroundColor: `${stat.color}20`, color: stat.color, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {stat.icon}
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{stat.label}</p>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{stat.value}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity / Users */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>أحدث المنضمين للمنصة</h3>
                    <button style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>عرض الكل</button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {recentUsers.map(user => (
                      <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '1rem', backgroundColor: 'rgba(255,255,255,0.4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 700 }}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontWeight: 700 }}>{user.name}</h4>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user.date}</span>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '1rem', 
                            fontSize: '0.75rem', 
                            fontWeight: 600,
                            backgroundColor: user.status === 'نشط' ? '#dcfce7' : '#f1f5f9',
                            color: user.status === 'نشط' ? '#166534' : '#475569'
                          }}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>الدورات التدريبية</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Filter size={18} />
                    تصفية
                  </button>
                  <button onClick={() => setIsAddingCourse(true)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Plus size={18} />
                    إضافة دورة
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {courses.map(course => (
                  <motion.div
                    key={course.id}
                    className="glass-card"
                    whileHover={{ y: -5 }}
                    style={{ padding: '1.5rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    <div style={{ width: '100%', height: '160px', backgroundColor: 'var(--primary-light)', borderRadius: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)', position: 'relative' }}>
                      <PlayCircle size={48} opacity={0.5} />
                      <span style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: course.status === 'متاح' ? '#10b981' : '#f59e0b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                        {course.status}
                      </span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{course.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>المدرب: {course.instructor}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          <Clock size={16} />
                          {course.duration}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          <Users size={16} />
                          {course.participants} متدرب
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
                      <button 
                        onClick={() => course.link ? setWatchingCourse(course) : alert('لا يوجد رابط لهذه الدورة بعد')} 
                        className="btn btn-primary" 
                        style={{ flex: 2, padding: '0.5rem', fontSize: '0.875rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <PlayCircle size={16} /> مشاهدة الآن
                      </button>
                      <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem', display: 'flex', justifyContent: 'center' }}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem', color: '#ef4444', borderColor: '#ef4444', display: 'flex', justifyContent: 'center' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab !== 'overview' && activeTab !== 'courses' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card"
              style={{ padding: '3rem', borderRadius: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}
            >
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Settings size={40} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>قسم قيد التطوير</h2>
              <p className="text-muted" style={{ maxWidth: '400px' }}>
                هذا القسم يتم تطويره حالياً وسيكون متاحاً في التحديثات القادمة لمنصة خِبرتي.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Internal Video Player Modal */}
      {watchingCourse && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>جاري مشاهدة: {watchingCourse.title}</h2>
                <p style={{ opacity: 0.8 }}>المدرب: {watchingCourse.instructor}</p>
              </div>
              <button 
                onClick={() => setWatchingCourse(null)} 
                className="btn btn-outline" 
                style={{ color: 'white', borderColor: 'white', padding: '0.5rem 1.5rem' }}
              >
                إغلاق المشغل
              </button>
            </div>
            
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: 'black', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              {watchingCourse.link.includes('youtube.com') || watchingCourse.link.includes('youtu.be') ? (
                <iframe 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src={`${getEmbedUrl(watchingCourse.link)}?autoplay=1`}
                  title={watchingCourse.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video 
                  controls 
                  autoPlay 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                >
                  <source src={watchingCourse.link} type="video/mp4" />
                  متصفحك لا يدعم تشغيل هذا الفيديو.
                </video>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Course Modal */}
      {isAddingCourse && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card" 
            style={{ width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: '1.5rem', backgroundColor: 'white' }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>إضافة دورة جديدة</h3>
            <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>عنوان الدورة</label>
                <input required value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>اسم المدرب</label>
                <input required value={newCourse.instructor} onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>المدة</label>
                <input required value={newCourse.duration} onChange={e => setNewCourse({...newCourse, duration: e.target.value})} placeholder="مثال: 12 ساعة" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>رابط فيديو الدورة (اختياري إذا حملت ملفاً)</label>
                <input value={newCourse.link} onChange={e => setNewCourse({...newCourse, link: e.target.value})} placeholder="https://youtube.com/..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', direction: 'ltr' }} />
              </div>
              <div style={{ padding: '1rem', border: '2px dashed var(--border-color)', borderRadius: '1rem', textAlign: 'center' }}>
                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>أو قم بتحميل فيديو مباشرة</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {selectedFile ? `الملف المختار: ${selectedFile.name}` : 'اضغط لاختيار ملف (MP4, MKV...)'}
                  </span>
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>الحالة</label>
                <select value={newCourse.status} onChange={e => setNewCourse({...newCourse, status: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none' }}>
                  <option value="متاح">متاح</option>
                  <option value="قريباً">قريباً</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" disabled={uploading} className="btn btn-primary" style={{ flex: 1 }}>
                  {uploading ? 'جاري الرفع...' : 'حفظ الدورة'}
                </button>
                <button type="button" onClick={() => setIsAddingCourse(false)} className="btn btn-outline" style={{ flex: 1 }}>إلغاء</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
