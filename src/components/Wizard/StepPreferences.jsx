import { motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import { notificationPreferences } from '../../data/mock';

export default function StepPreferences({ preferences, setPreferences, onNext, onPrev }) {

    const togglePreference = (prefId) => {
        setPreferences(prev =>
            prev.includes(prefId)
                ? prev.filter(id => id !== prefId)
                : [...prev, prefId]
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
        >
            <div className="wizard-header">
                <h2 className="wizard-title">Настройка уведомлений</h2>
                <p className="wizard-subtitle">Когда вы хотите получать оповещения о матчах?</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {notificationPreferences.map((pref) => {
                    const isSelected = preferences.includes(pref.id);

                    return (
                        <motion.div
                            key={pref.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => togglePreference(pref.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1rem',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-xl)',
                                background: 'var(--surface-color)',
                                border: `2px solid ${isSelected ? 'var(--accent-color)' : 'transparent'}`,
                                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: isSelected ? 'var(--accent-color)' : 'var(--bg-color)',
                                color: isSelected ? 'white' : 'var(--secondary-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Bell size={20} />
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem', color: isSelected ? 'var(--accent-color)' : 'var(--primary-color)' }}>
                                    {pref.label}
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--secondary-color)', lineHeight: '1.4' }}>
                                    {pref.description}
                                </p>
                            </div>

                            {isSelected && (
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--accent-color)' }}>
                                    <Check size={20} />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className="actions-bar">
                <button className="btn" onClick={onPrev}>Назад</button>
                <button
                    className={`btn btn-primary ${preferences.length === 0 ? 'btn-disabled' : ''}`}
                    onClick={onNext}
                    disabled={preferences.length === 0}
                >
                    Далее
                </button>
            </div>
        </motion.div>
    );
}
