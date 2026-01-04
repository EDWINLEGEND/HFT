'use client';

import React, { createContext, useContext, useState } from 'react';

export type GraphStage = 'START' | 'TYPE_SELECTION' | 'UPLOAD' | 'FORM' | 'ANALYZING' | 'RESULTS';

export interface ApplicationContextType {
    currentStage: GraphStage;
    setStage: (stage: GraphStage) => void;
    completedMilestones: string[];
    markMilestoneComplete: (id: string) => void;
    refreshTrigger: number;
    triggerRefresh: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
    const [currentStage, setCurrentStage] = useState<GraphStage>('START');
    const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

    const setStage = (stage: GraphStage) => {
        setCurrentStage(stage);
        // Auto-complete logic based on stage progression
        if (stage === 'TYPE_SELECTION') markMilestoneComplete('app_created');
        if (stage === 'UPLOAD') markMilestoneComplete('project_selected');
        if (stage === 'FORM') markMilestoneComplete('details_filled');
        if (stage === 'RESULTS') markMilestoneComplete('compliance_check');
    };

    const markMilestoneComplete = (id: string) => {
        setCompletedMilestones(prev => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
    };

    return (
        <ApplicationContext.Provider value={{
            currentStage,
            setStage,
            completedMilestones,
            markMilestoneComplete,
            refreshTrigger,
            triggerRefresh
        }}>
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
