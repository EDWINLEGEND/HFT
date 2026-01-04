'use client';

import React, { createContext, useContext, useState } from 'react';

type GraphStage = 'START' | 'TYPE_SELECTION' | 'UPLOAD' | 'FORM' | 'ANALYZING' | 'RESULTS';

interface ApplicationContextType {
    currentStage: GraphStage;
    setStage: (stage: GraphStage) => void;
    completedMilestones: string[];
    markMilestoneComplete: (id: string) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
    const [currentStage, setCurrentStage] = useState<GraphStage>('START');
    const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);

    const setStage = (stage: GraphStage) => {
        setCurrentStage(stage);
        // Auto-complete logic based on stage progression
        if (stage === 'TYPE_SELECTION') markMilestoneComplete('app_created');
        if (stage === 'UPLOAD') markMilestoneComplete('project_selected');
        if (stage === 'ANALYZING' || stage === 'RESULTS') markMilestoneComplete('details_filled');
        if (stage === 'RESULTS') markMilestoneComplete('compliance_check');
    };

    const markMilestoneComplete = (id: string) => {
        setCompletedMilestones(prev => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
    };

    return (
        <ApplicationContext.Provider value={{ currentStage, setStage, completedMilestones, markMilestoneComplete }}>
            {children}
        </ApplicationContext.Provider>
    );
}

export function useApplication() {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
        throw new Error('useApplication must be used within an ApplicationProvider');
    }
    return context;
}
