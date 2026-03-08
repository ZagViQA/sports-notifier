import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, AtSign, ArrowRight } from 'lucide-react';

export default function StepContact({ contactInfo, setContactInfo, onNext, onPrev, isSubmitting }) {
    const [method, setMethod] = useState(contactInfo.method || 'telegram');
    const [value, setValue] = useState(contactInfo.value || '');

    const handleChangeMethod = (newMethod) => {
        setMethod(newMethod);
        setValue(''); // Reset value when switching methods
    };

    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValid = method === 'telegram'
        ? value.trim().length > 0
        : isEmailValid(value);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid) {
            setContactInfo({ method, value });
            onNext();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
        >
            <div className="wizard-header">
                <h2 className="wizard-title">Куда присылать уведомления?</h2>
                <p className="wizard-subtitle">Выберите удобный способ связи</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => handleChangeMethod('telegram')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem 2rem',
                        borderRadius: 'var(--radius-full)',
                        border: `2px solid ${method === 'telegram' ? '#0088cc' : 'var(--border-color)'}`,
                        background: method === 'telegram' ? 'rgba(0, 136, 204, 0.05)' : 'var(--surface-color)',
                        color: method === 'telegram' ? '#0088cc' : 'var(--primary-color)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flex: 1,
                        maxWidth: '200px',
                        justifyContent: 'center'
                    }}
                >
                    <Send size={20} />
                    Telegram
                </button>

                <button
                    onClick={() => handleChangeMethod('email')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem 2rem',
                        borderRadius: 'var(--radius-full)',
                        border: `2px solid ${method === 'email' ? 'var(--accent-color)' : 'var(--border-color)'}`,
                        background: method === 'email' ? 'rgba(49, 130, 206, 0.05)' : 'var(--surface-color)',
                        color: method === 'email' ? 'var(--accent-color)' : 'var(--primary-color)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flex: 1,
                        maxWidth: '200px',
                        justifyContent: 'center'
                    }}
                >
                    <AtSign size={20} />
                    Email
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '400px', margin: '0 auto' }}>

                <div style={{ width: '100%', position: 'relative' }}>
                    {method === 'telegram' ? (
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary-color)', fontWeight: '600' }}>@</span>
                            <input
                                type="text"
                                placeholder="Ваш username в Telegram"
                                value={value.replace('@', '')}
                                onChange={(e) => setValue(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 2.5rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '2px solid var(--border-color)',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease',
                                    background: 'var(--surface-color)',
                                    color: 'var(--primary-color)'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#0088cc'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                            />
                        </div>
                    ) : (
                        <input
                            type="email"
                            placeholder="ваша@почта.com"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-lg)',
                                border: '2px solid var(--border-color)',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s ease',
                                background: 'var(--surface-color)',
                                color: 'var(--primary-color)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        />
                    )}

                    <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--secondary-color)', textAlign: 'center' }}>
                        Мы не передаем ваши данные третьим лицам.
                    </p>
                </div>

            </form>

            <div className="actions-bar">
                <button className="btn" onClick={onPrev} disabled={isSubmitting}>Назад</button>
                <button
                    className={`btn btn-primary ${!isValid || isSubmitting ? 'btn-disabled' : ''}`}
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting}
                    style={{ background: method === 'telegram' ? '#0088cc' : 'var(--primary-color)' }}
                >
                    {isSubmitting ? 'Сохраняем...' : (
                        <>Подписаться <ArrowRight size={18} /></>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
