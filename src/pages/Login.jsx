import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage('Пожалуйста, введите ваш email');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin + '/dashboard',
                }
            });

            if (error) throw error;

            setIsSuccess(true);
            setMessage('Ссылка для входа отправлена на ' + email + '. Проверьте вашу почту!');
        } catch (error) {
            console.error('Login error:', error);
            setMessage(error.message || 'Произошла ошибка при отправке ссылки.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="wizard-container glass"
            style={{
                marginTop: 'var(--spacing-10)',
                maxWidth: '500px',
                padding: 'var(--spacing-8)',
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
            }}
        >
            <h2 style={{ marginBottom: 'var(--spacing-2)' }}>Личный кабинет</h2>
            <p className="text-muted" style={{ marginBottom: 'var(--spacing-6)' }}>
                Введите ваш email для входа в панель управления подписками.
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <input
                    type="email"
                    placeholder="Ваш адрес электронной почты"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.2)',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none',
                        width: '100%'
                    }}
                />

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || isSuccess}
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    {loading ? 'Отправка...' : 'Отправить магическую ссылку 👀'}
                </button>

                {message && (
                    <div style={{
                        marginTop: 'var(--spacing-2)',
                        padding: 'var(--spacing-3)',
                        borderRadius: 'var(--radius-md)',
                        background: isSuccess ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        color: isSuccess ? '#4caf50' : '#f44336',
                        fontSize: '0.9rem'
                    }}>
                        {message}
                    </div>
                )}
            </form>
        </motion.div>
    );
}

export default Login;
