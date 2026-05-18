import { motion } from 'framer-motion';
import { BookOpen, Users, BrainCircuit, GraduationCap, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function App() {
  const navigate = useNavigate();

  const features = [

    {
      icon: <GraduationCap size={32} />,
      title: 'مرجع تدريبي عالمي',
      description: 'تقديم محتوى يحاكي بيئة العمل الفعلية، مما يقلل من تكرار الأخطاء المهنية.'
    },
    {
      icon: <Users size={32} />,
      title: 'توفير الوقت والجهد',
      description: 'تجاوز عقبات التدريب من الصفر، وتوفير الموارد المالية والزمنية في تأهيل الموظفين الجدد.'
    }
  ];

  return (
    <div className="app-container">
      {/* Background decoration elements */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <header style={{ padding: '1.5rem 0', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>
            <img src="/logo.png" alt="Khibrati Logo" style={{ height: '40px' }} />
            خِبرتي
          </div>
          <nav>
            <ul style={{ display: 'flex', gap: '2rem', fontWeight: 600 }}>
              <li><a href="#about">عن المنصة</a></li>
              <li><a href="#features">المميزات</a></li>
              <li><button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>تسجيل الدخول</button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container py-24" style={{ display: 'flex', alignItems: 'center', gap: '4rem', minHeight: '80vh' }}>
          <motion.div 
            style={{ flex: 1 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>
              منصة تعليمية لنقل <span className="text-primary">المهارات التطبيقية</span> وحفظ المعرفة
            </h1>
            <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px' }}>
              مشروع ضمن مجال تسيير الموارد البشرية وإدارة المعرفة، يهدف لتطوير منصة رقمية لسد الفجوة بين التكوين الأكاديمي والاحتياجات الميدانية للمؤسسات.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary">
                ابدأ رحلة التعلم <ChevronLeft size={20} />
              </button>
              <button className="btn btn-outline">
                تصفح الدورات
              </button>
            </div>
          </motion.div>

          <motion.div 
            style={{ flex: 1, position: 'relative' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass-card animate-float" style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '100%', height: '300px', backgroundColor: 'var(--primary-light)', borderRadius: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)' }}>
                <img src="/logo.png" alt="Khibrati Logo" style={{ height: '150px' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }}></div>
                <div>
                  <h4 style={{ fontWeight: 700 }}>دورة تدريبية تفاعلية</h4>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>بناء مهارات سوق العمل الفعلي</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* About Us Section */}
        <section id="about" className="container py-16" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            <motion.div 
              style={{ flex: 1, minWidth: '300px' }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary)' }}>
                من نحن؟ (تعريف المنصة)
              </h2>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--text-main)', marginBottom: '1rem' }}>
                هو عبارة عن مشروع متكامل يوظف تقنيات الهندسة التعليمية والوسائط الرقمية لإنتاج فيديوهات تدريبية وسيناريوهات تفاعلية تحاكي بيئة العمل الواقعية.
              </p>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--text-main)', marginBottom: '1rem' }}>
                تعمل المنصة كجسر معرفي يسمح للمتربصين والموظفين الجدد بالوصول إلى "خلاصة التجارب الميدانية" بأسلوب مرن وسهل الاستخدام.
              </p>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
                يتم انتاج هذا المحتوى بشكل مستقل (خارج المؤسسات) لضمان حماية الأسرار المهنية للمؤسسات، مما يساهم في تسريع الإدماج المهني ورفع الكفاءة التشغيلية.
              </p>
            </motion.div>
            
            <motion.div
              style={{ flex: 1, minWidth: '300px' }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '1.5rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>أهدافنا الرئيسية</h3>
                <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '1.5rem', color: 'rgba(255,255,255,0.9)' }}>
                  نسعى لتسريع الإدماج المهني وتمكين المواهب من خلال نقل المعرفة التطبيقية بطرق مبتكرة وآمنة.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.125rem' }}><BookOpen size={24} /> هندسة تعليمية متطورة</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.125rem' }}><BrainCircuit size={24} /> سيناريوهات تحاكي الواقع</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.125rem' }}><Users size={24} /> حماية الأسرار المهنية</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem & Solution Section */}
        <section id="features" className="container py-16">
          <div className="text-center mb-12">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>الإشكالية التي نعالجها والمميزات</h2>
            <p className="text-muted" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.125rem' }}>
              جاءت فكرة المشروع نتيجة لملاحظة وجود فجوة حادة بين التكوين الأكاديمي والاحتياجات الميدانية، بالإضافة لظاهرة "هجرة الأصول المعرفية".
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="glass-card"
                style={{ padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ backgroundColor: 'var(--text-main)', color: 'white', padding: '3rem 0', marginTop: '4rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.5rem' }}>
            <img src="/logo.png" alt="Khibrati Logo" style={{ height: '32px', filter: 'brightness(0) invert(1)' }} />
            خِبرتي
          </div>
          <p style={{ color: 'var(--text-muted)' }}>© 2026 جميع الحقوق محفوظة لـ مشروع منصة خِبرتي.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
