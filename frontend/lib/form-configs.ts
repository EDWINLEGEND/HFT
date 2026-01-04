/**
 * Form Field Configurations for Type-Specific Applications
 * Each application type has its own set of fields mapped to regulation requirements
 */

export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
    required: boolean;
    placeholder?: string;
    options?: string[];
    regulationRef?: string; // Reference to regulation section
    helpText?: string;
    unit?: string; // Display unit (e.g., "KLD", "meters", "%")
}

export interface FormSection {
    title: string;
    description?: string;
    regulationCategory: string;
    fields: FormField[];
}

// ============================================
// MANUFACTURING FORM CONFIGURATION
// ============================================
export const MANUFACTURING_FORM: FormSection[] = [
    {
        title: 'Water & Effluent Management',
        regulationCategory: 'PCB Standards 1.1',
        description: 'Zero Liquid Discharge (ZLD) compliance requirements',
        fields: [
            {
                id: 'water_source',
                label: 'Water Source',
                type: 'text',
                required: true,
                placeholder: 'e.g., Municipal + Borewell',
                regulationRef: 'PCB 1.1'
            },
            {
                id: 'etp_capacity',
                label: 'ETP Capacity',
                type: 'number',
                required: true,
                placeholder: '10',
                unit: 'KLD',
                helpText: 'Mandatory if discharge > 10 KLD',
                regulationRef: 'Water Act 1974'
            },
            {
                id: 'zld_system',
                label: 'ZLD System Type',
                type: 'select',
                required: true,
                options: ['RO + MEE', 'ATFD', 'Hybrid System', 'None (< 10 KLD)'],
                regulationRef: 'PCB 1.1'
            },
            {
                id: 'drainage_method',
                label: 'Drainage Method',
                type: 'text',
                required: true,
                placeholder: 'e.g., Zero Liquid Discharge',
                regulationRef: 'PCB 1.1'
            }
        ]
    },
    {
        title: 'Air Pollution Control',
        regulationCategory: 'PCB Standards 1.2',
        fields: [
            {
                id: 'stack_height',
                label: 'Stack Height',
                type: 'number',
                required: true,
                unit: 'meters',
                placeholder: '30',
                helpText: 'Minimum 30m or H = 14(Q)^0.3',
                regulationRef: 'Air Act 1981'
            },
            {
                id: 'air_pollution_control',
                label: 'APCD Type',
                type: 'select',
                required: false,
                options: ['ESP', 'Bag Filter', 'Scrubber', 'Cyclone', 'Not Applicable'],
                regulationRef: 'PCB 1.2'
            }
        ]
    },
    {
        title: 'Hazardous Waste Management',
        regulationCategory: 'HW Rules 2016',
        fields: [
            {
                id: 'hazardous_waste_types',
                label: 'Waste Categories',
                type: 'textarea',
                required: false,
                placeholder: 'e.g., Category 5.1 (Used Oil), Category 33.1 (Empty Drums)',
                regulationRef: 'HW Rules 2.1'
            },
            {
                id: 'hazardous_waste_quantity',
                label: 'Annual Quantity',
                type: 'text',
                required: false,
                placeholder: 'e.g., 500 L/year',
                regulationRef: 'HW Rules 2.1'
            },
            {
                id: 'tsdf_authorization',
                label: 'TSDF Authorization',
                type: 'text',
                required: false,
                placeholder: 'Name of authorized TSDF',
                regulationRef: 'HW Rules 2.2'
            }
        ]
    },
    {
        title: 'Factory Safety & Labor Welfare',
        regulationCategory: 'Factory Act 1948',
        fields: [
            {
                id: 'worker_count',
                label: 'Maximum Workers',
                type: 'number',
                required: true,
                placeholder: '150',
                regulationRef: 'Factory Act 3.1'
            },
            {
                id: 'ventilation_acph',
                label: 'Ventilation (ACPH)',
                type: 'number',
                required: true,
                placeholder: '6',
                unit: 'ACPH',
                helpText: 'Minimum 6 air changes per hour',
                regulationRef: 'Factory Act 3.1'
            },
            {
                id: 'fire_hydrant_count',
                label: 'Fire Hydrants',
                type: 'number',
                required: false,
                placeholder: '4',
                regulationRef: 'Factory Act 3.1'
            }
        ]
    }
];

// ============================================
// COMMERCIAL FORM CONFIGURATION
// ============================================
export const COMMERCIAL_FORM: FormSection[] = [
    {
        title: 'Building Specifications',
        regulationCategory: 'Building Bye-Laws',
        fields: [
            {
                id: 'building_height',
                label: 'Building Height',
                type: 'number',
                required: true,
                unit: 'meters',
                placeholder: '45',
                regulationRef: 'NBC 2016'
            }
        ]
    },
    {
        title: 'Fire & Life Safety',
        regulationCategory: 'Fire Safety Norms',
        description: 'Compliance with Fire NOC requirements',
        fields: [
            {
                id: 'sprinkler_coverage',
                label: 'Sprinkler Coverage',
                type: 'select',
                required: true,
                options: ['All Floors + Basements', 'Basements Only', 'Not Installed'],
                regulationRef: 'Fire Safety 1.1'
            },
            {
                id: 'staircase_width',
                label: 'Staircase Width',
                type: 'number',
                required: true,
                unit: 'meters',
                placeholder: '1.5',
                helpText: 'Minimum 1.50m for commercial',
                regulationRef: 'Fire Safety 1.2'
            },
            {
                id: 'travel_distance',
                label: 'Max Travel Distance to Exit',
                type: 'number',
                required: true,
                unit: 'meters',
                placeholder: '30',
                helpText: 'Maximum 30m from any point',
                regulationRef: 'Fire Safety 1.2'
            },
            {
                id: 'refuge_area_height',
                label: 'Refuge Area at Height',
                type: 'number',
                required: false,
                unit: 'meters',
                placeholder: '24',
                helpText: 'Required at 24m and every 15m thereafter',
                regulationRef: 'Fire Safety 1.2'
            }
        ]
    },
    {
        title: 'Parking & Traffic',
        regulationCategory: 'Parking Standards 2.1',
        fields: [
            {
                id: 'total_ecs',
                label: 'Total Parking Spaces (ECS)',
                type: 'number',
                required: true,
                placeholder: '240',
                helpText: '1 ECS per 50 sq.m for offices',
                regulationRef: 'Parking 2.1'
            },
            {
                id: 'ev_charging_bays',
                label: 'EV Charging Bays',
                type: 'number',
                required: true,
                placeholder: '48',
                helpText: 'Minimum 20% of total parking',
                regulationRef: 'Parking 2.1'
            },
            {
                id: 'basement_levels',
                label: 'Basement Levels',
                type: 'number',
                required: false,
                placeholder: '2',
                regulationRef: 'Parking 2.1'
            }
        ]
    },
    {
        title: 'Energy & Accessibility',
        regulationCategory: 'ECBC & Accessibility',
        fields: [
            {
                id: 'shgc_value',
                label: 'Glass SHGC Value',
                type: 'number',
                required: false,
                placeholder: '0.25',
                helpText: 'Must be < 0.25 for glass facade',
                regulationRef: 'ECBC 3.1'
            },
            {
                id: 'accessible_entrance',
                label: 'Accessible Main Entrance',
                type: 'checkbox',
                required: true,
                helpText: 'Width > 1200mm',
                regulationRef: 'Accessibility 4.1'
            },
            {
                id: 'accessible_toilets',
                label: 'Accessible Toilets',
                type: 'number',
                required: true,
                placeholder: '1',
                helpText: 'At least 1 unisex toilet on ground floor',
                regulationRef: 'Accessibility 4.1'
            }
        ]
    }
];

// ============================================
// RESIDENTIAL FORM CONFIGURATION
// ============================================
export const RESIDENTIAL_FORM: FormSection[] = [
    {
        title: 'Project Overview',
        regulationCategory: 'Environmental Clearance',
        fields: [
            {
                id: 'dwelling_units',
                label: 'Number of Dwelling Units',
                type: 'number',
                required: true,
                placeholder: '120',
                regulationRef: 'EC 1.1'
            },
            {
                id: 'building_height',
                label: 'Building Height',
                type: 'number',
                required: true,
                unit: 'meters',
                placeholder: '28',
                regulationRef: 'Building Bye-Laws 4'
            },
            {
                id: 'ec_category',
                label: 'EC Category',
                type: 'select',
                required: true,
                options: ['Not Required (< 20,000 sq.m)', 'B2 (20k-150k sq.m)', 'B1 (> 150k sq.m)'],
                helpText: 'Based on total built-up area',
                regulationRef: 'EC 1.1'
            }
        ]
    },
    {
        title: 'Green Cover & Landscaping',
        regulationCategory: 'Green Cover 2',
        fields: [
            {
                id: 'tree_count',
                label: 'Trees to be Planted',
                type: 'number',
                required: true,
                placeholder: '275',
                helpText: '1 tree per 80 sq.m of plot area',
                regulationRef: 'Green Cover 2.1'
            },
            {
                id: 'green_cover_percentage',
                label: 'Green Cover',
                type: 'number',
                required: true,
                unit: '%',
                placeholder: '15',
                helpText: 'Minimum 15% unpaved area',
                regulationRef: 'Green Cover 2.1'
            }
        ]
    },
    {
        title: 'Water Management',
        regulationCategory: 'Water Sustainability 3',
        fields: [
            {
                id: 'rwh_pits_count',
                label: 'Rainwater Harvesting Pits',
                type: 'number',
                required: true,
                placeholder: '4',
                helpText: 'Minimum 2 pits for area > 500 sq.m',
                regulationRef: 'RWH 3.1'
            },
            {
                id: 'rwh_storage_capacity',
                label: 'RWH Storage Capacity',
                type: 'number',
                required: false,
                unit: 'liters',
                placeholder: '50000',
                helpText: '20 liters per sq.m of roof area',
                regulationRef: 'RWH 3.1'
            },
            {
                id: 'grey_water_recycling',
                label: 'Grey Water Recycling System',
                type: 'checkbox',
                required: true,
                helpText: 'Mandatory for projects > 50 units',
                regulationRef: 'Water 3.2'
            },
            {
                id: 'dual_plumbing',
                label: 'Dual Plumbing System',
                type: 'checkbox',
                required: false,
                helpText: 'For recycled water distribution',
                regulationRef: 'Water 3.2'
            }
        ]
    },
    {
        title: 'Waste Management & Energy',
        regulationCategory: 'Waste & Energy 5-6',
        fields: [
            {
                id: 'owc_capacity',
                label: 'OWC Capacity',
                type: 'number',
                required: true,
                unit: 'kg/day',
                placeholder: '200',
                helpText: 'Organic Waste Converter mandatory for > 50 units',
                regulationRef: 'Waste 5'
            },
            {
                id: 'segregation_system',
                label: 'Waste Segregation System',
                type: 'select',
                required: true,
                options: ['3-Bin System (Wet/Dry/Hazardous)', '2-Bin System', 'Not Implemented'],
                regulationRef: 'Waste 5'
            },
            {
                id: 'solar_water_heater_coverage',
                label: 'Solar Water Heater Coverage',
                type: 'text',
                required: true,
                placeholder: 'Top 3 floors',
                helpText: 'Mandatory for top 3 floors minimum',
                regulationRef: 'Energy 6'
            }
        ]
    }
];

// ============================================
// WAREHOUSING FORM CONFIGURATION
// ============================================
export const WAREHOUSING_FORM: FormSection[] = [
    {
        title: 'Warehouse Specifications',
        regulationCategory: 'Structural Safety 1',
        fields: [
            {
                id: 'warehouse_type',
                label: 'Warehouse Type',
                type: 'select',
                required: true,
                options: ['FMCG Storage', 'Cold Storage', 'Hazardous Materials', 'General Logistics'],
                regulationRef: 'Classification'
            },
            {
                id: 'floor_load_capacity',
                label: 'Floor Load Capacity',
                type: 'number',
                required: true,
                unit: 'Tonnes/sq.m',
                placeholder: '7',
                helpText: 'Minimum 5 T/sq.m for industrial grade',
                regulationRef: 'Structural 1.1'
            },
            {
                id: 'clear_height',
                label: 'Clear Height',
                type: 'number',
                required: true,
                unit: 'meters',
                placeholder: '12',
                helpText: 'Minimum 9m for pallet racking',
                regulationRef: 'Structural 1.2'
            },
            {
                id: 'flooring_type',
                label: 'Flooring Type',
                type: 'select',
                required: true,
                options: ['VDF (Vacuum Dewatered)', 'Laser Screed FM2', 'Standard Concrete', 'Epoxy Coated'],
                regulationRef: 'Structural 1.1'
            }
        ]
    },
    {
        title: 'Fire Safety Systems',
        regulationCategory: 'Fire Safety 2',
        description: 'High hazard storage protection requirements',
        fields: [
            {
                id: 'sprinkler_type',
                label: 'Sprinkler System Type',
                type: 'select',
                required: true,
                options: ['ESFR (Early Suppression Fast Response)', 'Standard Sprinklers', 'In-Rack Sprinklers', 'Not Installed'],
                helpText: 'ESFR mandatory for rack storage > 4m',
                regulationRef: 'Fire 2.1'
            },
            {
                id: 'fire_tank_capacity',
                label: 'Fire Water Tank Capacity',
                type: 'number',
                required: true,
                unit: 'liters',
                placeholder: '600000',
                helpText: 'Minimum 2,00,000 liters',
                regulationRef: 'Fire 2.1'
            },
            {
                id: 'compartment_size',
                label: 'Fire Compartment Size',
                type: 'number',
                required: false,
                unit: 'sq.m',
                placeholder: '2500',
                helpText: 'Maximum 2500 sq.m per compartment',
                regulationRef: 'Fire 2.2'
            },
            {
                id: 'fire_wall_rating',
                label: 'Fire Wall Rating',
                type: 'number',
                required: false,
                unit: 'hours',
                placeholder: '4',
                helpText: '4-hour fire rating required',
                regulationRef: 'Fire 2.2'
            }
        ]
    },
    {
        title: 'Loading & Operations',
        regulationCategory: 'Docking 3',
        fields: [
            {
                id: 'dock_count',
                label: 'Number of Dock Levelers',
                type: 'number',
                required: true,
                placeholder: '10',
                helpText: '1 dock per 1000 sq.m',
                regulationRef: 'Docking 3.1'
            },
            {
                id: 'dock_height',
                label: 'Dock Height',
                type: 'number',
                required: true,
                unit: 'meters',
                placeholder: '1.2',
                helpText: 'Standard dock height',
                regulationRef: 'Docking 3.1'
            },
            {
                id: 'turning_radius',
                label: 'Turning Radius',
                type: 'number',
                required: true,
                unit: 'meters',
                placeholder: '25',
                helpText: 'Minimum 25m for 40ft trailers',
                regulationRef: 'Docking 3.1'
            }
        ]
    },
    {
        title: 'Safety & Amenities',
        regulationCategory: 'Safety 4-6',
        fields: [
            {
                id: 'lighting_lux',
                label: 'Lighting Level',
                type: 'number',
                required: true,
                unit: 'Lux',
                placeholder: '200',
                helpText: '200 Lux in aisles, 300 in staging areas',
                regulationRef: 'Lighting 4'
            },
            {
                id: 'cctv_coverage',
                label: 'CCTV Coverage',
                type: 'checkbox',
                required: true,
                helpText: '100% coverage of entry/exit and loading bays',
                regulationRef: 'Security 5'
            },
            {
                id: 'battery_charging_room',
                label: 'Separate Battery Charging Room',
                type: 'checkbox',
                required: false,
                helpText: 'Ventilated room for forklift batteries',
                regulationRef: 'Electrical 4'
            }
        ]
    }
];

// Helper function to get form configuration by type
export function getFormConfig(applicationType: string): FormSection[] {
    switch (applicationType) {
        case 'Manufacturing':
            return MANUFACTURING_FORM;
        case 'Commercial':
            return COMMERCIAL_FORM;
        case 'Residential':
            return RESIDENTIAL_FORM;
        case 'Warehousing':
            return WAREHOUSING_FORM;
        default:
            return [];
    }
}

// Helper to get all field IDs for a type
export function getFieldIds(applicationType: string): string[] {
    const config = getFormConfig(applicationType);
    return config.flatMap(section => section.fields.map(field => field.id));
}
