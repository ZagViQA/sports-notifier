import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';

import StepSports from './components/Wizard/StepSports';
import StepTournaments from './components/Wizard/StepTournaments';
import StepPreferences from './components/Wizard/StepPreferences';
import StepContact from './components/Wizard/StepContact';
import StepSuccess from './components/Wizard/StepSuccess';

function App() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4; // Not counting Success step in indicator

    // State for wizard data
    const [selectedSports, setSelectedSports] = useState([]);
    const [selectedTournaments, setSelectedTournaments] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [contactInfo, setContactInfo] = useState({ method: 'telegram', value: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const submitData = async () => {
        setIsSubmitting(true);

        try {
            let createdUserId = null;

            if (contactInfo.method === 'telegram') {
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .insert([{}])
                    .select()
                    .single();

                if (userError) throw userError;
                createdUserId = userData.id;
            } else {
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .insert([{ email: contactInfo.value }])
                    .select()
                    .single();

                if (userError) throw userError;
                createdUserId = userData.id;
            }

            const { error: subError } = await supabase
                .from('subscriptions')
                .insert([{
                    user_id: createdUserId,
                    sports: selectedSports,
                    tournaments: selectedTournaments,
                    preferences: preferences
                }]);

            if (subError) throw subError;

            if (contactInfo.method === 'telegram') {
                setContactInfo(prev => ({ ...prev, userId: createdUserId }));
            }

            nextStep();

        } catch (err) {
            console.error('Error saving data:', err);
            alert('Произошла ошибка при сохранении. Проверьте консоль, возможно вы не применили SQL скрипт.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="bg-shape bg-shape-1"></div>
            <div className="bg-shape bg-shape-2"></div>

            <div className="wizard-container glass" style={{
                marginTop: 'var(--spacing-10)',
                marginBottom: 'var(--spacing-10)',
                borderRadius: 'var(--radius-2xl)',
                position: 'relative',
                zIndex: 1,
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* Step Indicator (Hide on Success Step) */}
                {currentStep <= totalSteps && (
                    <div className="steps-indicator">
                        {Array.from({ length: totalSteps }).map((_, index) => {
                            const stepNumber = index + 1;
                            return (
                                <div
                                    key={stepNumber}
                                    className={`step-dot ${stepNumber === currentStep ? 'active' : ''} ${stepNumber < currentStep ? 'completed' : ''}`}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Wizard Content with AnimatePresence for exit animations */}
                <div style={{ flex: 1, position: 'relative' }}>
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <StepSports
                                key="step1"
                                selectedSports={selectedSports}
                                setSelectedSports={setSelectedSports}
                                onNext={nextStep}
                            />
                        )}

                        {currentStep === 2 && (
                            <StepTournaments
                                key="step2"
                                selectedSports={selectedSports}
                                selectedTournaments={selectedTournaments}
                                setSelectedTournaments={setSelectedTournaments}
                                onNext={nextStep}
                                onPrev={prevStep}
                            />
                        )}

                        {currentStep === 3 && (
                            <StepPreferences
                                key="step3"
                                preferences={preferences}
                                setPreferences={setPreferences}
                                onNext={nextStep}
                                onPrev={prevStep}
                            />
                        )}

                        {currentStep === 4 && (
                            <StepContact
                                key="step4"
                                contactInfo={contactInfo}
                                setContactInfo={setContactInfo}
                                onNext={submitData}
                                onPrev={prevStep}
                                isSubmitting={isSubmitting}
                            />
                        )}

                        {currentStep === 5 && (
                            <StepSuccess
                                key="step5"
                                contactInfo={contactInfo}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}

export default App;
