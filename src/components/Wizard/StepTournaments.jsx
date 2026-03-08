import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { tournamentsData, sportsData } from '../../data/mock';

export default function StepTournaments({ selectedSports, selectedTournaments, setSelectedTournaments, onNext, onPrev }) {
    // Get sports that user selected, mapped to their names/icons
    const activeSports = selectedSports.map(id => sportsData.find(s => s.id === id));

    // By default, expand the first selected sport
    const [expandedSport, setExpandedSport] = useState(activeSports[0]?.id || null);

    const toggleTournament = (tournamentId) => {
        setSelectedTournaments(prev =>
            prev.includes(tournamentId)
                ? prev.filter(id => id !== tournamentId)
                : [...prev, tournamentId]
        );
    };

    const isTournamentSelected = (id) => selectedTournaments.includes(id);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
        >
            <div className="wizard-header">
                <h2 className="wizard-title">Выберите турниры</h2>
                <p className="wizard-subtitle">За какими событиями вы хотите следить?</p>
            </div>

            <div className="tournaments-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeSports.map((sport) => {
                    const tournaments = tournamentsData[sport.id] || [];
                    const isExpanded = expandedSport === sport.id;

                    return (
                        <div key={sport.id} className={`sport-accordion ${isExpanded ? 'expanded' : ''}`} style={{
                            background: 'var(--surface-color)',
                            borderRadius: 'var(--radius-xl)',
                            boxShadow: 'var(--shadow-sm)',
                            overflow: 'hidden',
                            border: `1px solid ${isExpanded ? 'var(--accent-color)' : 'var(--border-color)'}`
                        }}>
                            {/* Accordion Header */}
                            <button
                                onClick={() => setExpandedSport(isExpanded ? null : sport.id)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    color: 'var(--primary-color)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span>{sport.icon}</span>
                                    <span>{sport.name}</span>
                                </div>
                                <motion.div
                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronRight color="var(--secondary-color)" />
                                </motion.div>
                            </button>

                            {/* Accordion Body */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {tournaments.map(tournament => (
                                                <div
                                                    key={tournament.id}
                                                    onClick={() => toggleTournament(tournament.id)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '1rem',
                                                        borderRadius: 'var(--radius-lg)',
                                                        background: isTournamentSelected(tournament.id) ? 'rgba(49, 130, 206, 0.05)' : 'var(--bg-color)',
                                                        border: `1px solid ${isTournamentSelected(tournament.id) ? 'var(--accent-color)' : 'transparent'}`,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        position: 'relative'
                                                    }}
                                                >
                                                    <span style={{ fontWeight: isTournamentSelected(tournament.id) ? '600' : '400' }}>
                                                        {tournament.name}
                                                    </span>
                                                    {isTournamentSelected(tournament.id) && (
                                                        <Check className="checkmark" size={20} style={{ opacity: 1, transform: 'scale(1)', position: 'absolute', right: '1rem' }} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            <div className="actions-bar">
                <button className="btn" onClick={onPrev}>Назад</button>
                <button
                    className={`btn btn-primary ${selectedTournaments.length === 0 ? 'btn-disabled' : ''}`}
                    onClick={onNext}
                    disabled={selectedTournaments.length === 0}
                >
                    Далее
                </button>
            </div>
        </motion.div>
    );
}
