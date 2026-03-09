import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [telegramChatId, setTelegramChatId] = useState(null);

    useEffect(() => {
        // Check active session on mount
        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                navigate('/login');
            } else {
                setUser(session.user);
                fetchSubscriptionsAndUser(session.user);
            }
        };
        getSession();
    }, [navigate]);

    const fetchSubscriptionsAndUser = async (authUser) => {
        try {
            // Check if user exists in public.users
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('email', authUser.email)
                .single();

            let targetUserId = authUser.id;

            if (!userData) {
                // First login: create row in public.users to hold future telegram_chat_id
                const { data: newUser } = await supabase
                    .from('users')
                    .insert([{ id: authUser.id, email: authUser.email }])
                    .select()
                    .single();
                if (newUser) {
                    targetUserId = newUser.id;
                }
            } else {
                targetUserId = userData.id;
                setTelegramChatId(userData.telegram_chat_id);
            }

            // Fetch subs
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', targetUserId);

            if (error) throw error;
            setSubscriptions(data || []);
        } catch (error) {
            console.error('Error fetching subs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Вы уверены, что хотите удалить эту подписку?')) return;

        try {
            const { error } = await supabase
                .from('subscriptions')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setSubscriptions(prev => prev.filter(sub => sub.id !== id));
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Не удалось удалить подписку');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Загрузка...</div>;
    }

    // Replace with your actual bot username
    const botUsername = 'sports_notifier_bot';

    // We use targetUserId which is usually authUser.id for the deeplink
    const tgLink = `https://t.me/${botUsername}?start=${user?.id}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="wizard-container glass"
            style={{
                marginTop: 'var(--spacing-10)',
                maxWidth: '800px',
                padding: 'var(--spacing-8)',
                position: 'relative',
                zIndex: 1
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
                <h2>Мои подписки</h2>
                <button
                    onClick={handleLogout}
                    className="btn btn-outline"
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                    <LogOut size={16} /> Выйти
                </button>
            </div>

            <p className="text-muted" style={{ marginBottom: 'var(--spacing-6)' }}>
                Вы вошли как <strong>{user?.email}</strong>. Ниже список всех ваших активных уведомлений.
            </p>

            {!telegramChatId && (
                <div style={{
                    background: 'rgba(33, 150, 243, 0.1)',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-4)',
                    marginBottom: 'var(--spacing-8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-4)'
                }}>
                    <div>
                        <h4 style={{ margin: '0 0 var(--spacing-2) 0', color: '#64b5f6' }}>Уведомления отключены</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                            У вас еще не привязан Telegram к этому email. Если вы создавали подписки ранее,
                            привяжите Telegram сейчас, и они автоматически появятся в этом списке!
                        </p>
                    </div>
                    <a
                        href={tgLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        Привязать Telegram
                    </a>
                </div>
            )}

            {subscriptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-10)', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)' }}>
                    <Bell size={48} color="rgba(255,255,255,0.3)" style={{ marginBottom: 'var(--spacing-4)' }} />
                    <h3>У вас пока нет подписок</h3>
                    <p className="text-muted" style={{ marginBottom: 'var(--spacing-4)' }}>Настройте свою первую рассылку!</p>
                    {telegramChatId && (
                        <button onClick={() => navigate('/')} className="btn btn-primary">
                            Создать подписку
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    {subscriptions.map((sub, index) => (
                        <div key={sub.id} style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-4)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h4 style={{ margin: '0 0 var(--spacing-2) 0', fontSize: '1.1rem' }}>
                                    Подписка #{index + 1}
                                </h4>
                                <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                                    <div>
                                        <span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>Виды спорта</span>
                                        <strong>{sub.sports.join(', ')}</strong>
                                    </div>
                                    <div>
                                        <span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>Турниров выбрано</span>
                                        <strong>{sub.tournaments.length}</strong>
                                    </div>
                                    <div>
                                        <span className="text-muted" style={{ fontSize: '0.8rem', display: 'block' }}>Время уведомлений</span>
                                        <strong>{sub.preferences.join(' + ')}</strong>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(sub.id)}
                                style={{
                                    background: 'rgba(244, 67, 54, 0.1)',
                                    color: '#f44336',
                                    border: 'none',
                                    padding: 'var(--spacing-3)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(244, 67, 54, 0.2)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(244, 67, 54, 0.1)'}
                                title="Удалить подписку"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    <div style={{ marginTop: 'var(--spacing-4)', textAlign: 'center' }}>
                        <button onClick={() => navigate('/')} className="btn btn-outline">
                            + Добавить еще одну
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default Dashboard;
