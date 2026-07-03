import React, { Suspense, lazy } from 'react';

// Lazy-load so three.js and the model stay out of the initial bundle;
// the page paints first and the deer streams in behind it.
const PersonaModel = lazy(() => import('./PersonaModel'));

interface PersonaProps {
    activeSection: string;
}

export const Persona: React.FC<PersonaProps> = ({ activeSection }) => (
    <Suspense fallback={null}>
        <PersonaModel activeSection={activeSection} />
    </Suspense>
);
