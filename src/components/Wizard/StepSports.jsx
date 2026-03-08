import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { sportsData } from '../../data/mock';

export default function StepSports({ selectedSports, setSelectedSports, onNext }) {
    const toggleSport = (sportId) => {
        setSelectedSports(prev =>
            prev.includes(sportId)
                ? prev.filter(id => id !== sportId)
                : [...prev, sportId]
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
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
                <h2 className="wizard-title">Какие виды спорта вам интересны?</h2>
                <p className="wizard-subtitle">Выберите один или несколько вариантов</p>
            </div>

            <motion.div
                className="sports-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {sportsData.map((sport) => {
                    const isSelected = selectedSports.includes(sport.id);

                    return (
                        <motion.div
                            key={sport.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`sport-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleSport(sport.id)}
                        >
                            {isSelected && <Check className="checkmark" size={24} />}
                            <div className="sport-icon-wrapper">
                                <span style={{ fontSize: '2rem' }}>{sport.icon}</span>
                            </div>
                            <span className="sport-name">{sport.name}</span>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div className="actions-bar" style={{ justifyContent: 'flex-end' }}>
                <button
                    className={`btn btn-primary ${selectedSports.length === 0 ? 'btn-disabled' : ''}`}
                    onClick={onNext}
                    disabled={selectedSports.length === 0}
                >
                    Далее
                </button>
            </div>
        </motion.div>
    );
}
