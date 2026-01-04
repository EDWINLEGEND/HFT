'use client';

import { useApplication } from "@/lib/context";

export default function SidebarTimeline() {
    const { completedMilestones } = useApplication();

    const sections = [
        {
            title: "Application Actions",
            items: [
                { id: 'app_created', label: 'Application created' },
                { id: 'project_selected', label: 'Project type selected' },
                { id: 'details_filled', label: 'Core details filled/edited' },
            ]
        },
        {
            title: "AI / Validation Actions",
            items: [
                { id: 'compliance_check', label: 'Compliance check run' },
            ]
        }
    ];

    return (
        <div className="pl-6 pr-2 py-4 space-y-4 animate-in slide-in-from-left-4 duration-500">
            {sections.map((section, secIdx) => (
                <div key={secIdx} className="relative">
                    {/* Header removed as per request */}

                    <div className="space-y-0 relative border-l border-[#E5E7EB] ml-3 pb-2 last:pb-0">
                        {section.items.map((item) => {
                            const isCompleted = completedMilestones.includes(item.id);

                            return (
                                <div key={item.id} className="relative pl-6 pb-4 last:pb-0 group">
                                    {/* Node */}
                                    <div className={`
                                        absolute -left-[5px] top-0.5 w-[9px] h-[9px] rounded-full border-2 transition-all duration-300 z-10
                                        ${isCompleted
                                            ? 'bg-[#505645] border-[#505645]'
                                            : 'bg-white border-[#D0D1C9]'}
                                    `}></div>

                                    <span className={`
                                        text-xs font-medium leading-none block transition-colors duration-300
                                        ${isCompleted ? 'text-[#1A1A1A]' : 'text-[#8A8A8A]'}
                                    `}>
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
