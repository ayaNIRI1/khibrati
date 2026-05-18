import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from './apiConfig';
import './index.css';

export default function Login() {
  const [email, setEmail] = useState('admin@khibrati.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('المدير');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const bodyData = isRegistering ? { email, password, name, role: 'admin' } : { email, password };
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      let data: any;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`خطأ في خادم فيرسيل (Vercel 500): ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'حدث خطأ أثناء الاتصال بالخادم');
      }

      // Save token
      localStorage.setItem('khibrati_token', data.token);
      localStorage.setItem('khibrati_user', JSON.stringify(data.user));
      
      alert(isRegistering ? 'تم إنشاء الحساب وتسجيل الدخول بنجاح!' : 'تم تسجيل الدخول بنجاح! سيتم تحويلك إلى لوحة التحكم.');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div className="blob blob-1"></div>
      <div className="blob blob-2" style={{ top: 'auto', bottom: '-100px', right: 'auto', left: '-100px' }}></div>

      <button 
        onClick={() => navigate('/')} 
        style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}
      >
        <ArrowRight size={20} /> العودة للرئيسية
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '1.5rem', zIndex: 10 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
            <img src="/logo.png" alt="Khibrati Logo" style={{ height: '60px' }} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            {isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h2>
          <p className="text-muted">
            {isRegistering ? 'مرحباً بك في منصة خِبرتي' : 'أهلاً بك مجدداً في منصة خِبرتي'}
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isRegistering && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>الاسم الكامل</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit', fontSize: '1rem' }}
                  required 
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>البريد الإلكتروني</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit', fontSize: '1rem' }}
                required 
              />
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', outline: 'none', fontFamily: 'inherit', fontSize: '1rem' }}
                required 
              />
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'جاري المعالجة...' : (
              <>
                <LogIn size={20} />
                {isRegistering ? 'إنشاء حساب' : 'دخول'}
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegistering ? 'لديك حساب بالفعل؟ سجل دخولك' : 'ليس لديك حساب؟ أنشئ حساباً جديداً'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
