import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';

export default function StepSuccess({ contactInfo }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            style={{ textAlign: 'center', padding: '2rem 0' }}
        >
            <motion.div
                initial={{ rotate: -15, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(49, 130, 206, 0.1)',
                    color: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem auto'
                }}
            >
                <PartyPopper size={40} />
            </motion.div>

            <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Отлично! Всё готово.
            </h2>

            <p style={{ fontSize: '1.25rem', color: 'var(--secondary-color)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto' }}>
                Ваши предпочтения успешно сохранены. Теперь вы не пропустите ни одного важного события!
            </p>

            {contactInfo.method === 'telegram' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        background: 'var(--surface-color)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-md)',
                        maxWidth: '500px',
                        margin: '2rem auto 0 auto',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: '#0088cc',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem auto'
                    }}>
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'white', transform: 'translateX(-2px)' }}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>Остался последний шаг</h3>
                    <p style={{ color: 'var(--secondary-color)', marginBottom: '1.5rem' }}>
                        Чтобы мы могли отправлять вам сообщения, перейдите в нашего бота и нажмите кнопку <b>Start</b>.
                    </p>
                    <a
                        href={`https://t.me/my_favariteSports_notifier_bot?start=${contactInfo.userId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#0088cc',
                            color: 'white',
                            textDecoration: 'none',
                            padding: '0.75rem 2rem',
                            borderRadius: 'var(--radius-full)',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 14px 0 rgba(0,136,204,0.39)'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Открыть Telegram Бота
                    </a>
                </motion.div>
            )}

            {contactInfo.method === 'email' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        background: 'var(--surface-color)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-md)',
                        maxWidth: '500px',
                        margin: '2rem auto 0 auto',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>Письмо отправлено</h3>
                    <p style={{ color: 'var(--secondary-color)' }}>
                        Мы отправили приветственное письмо на <b>{contactInfo.value}</b>. Проверьте ваш почтовый ящик.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}
