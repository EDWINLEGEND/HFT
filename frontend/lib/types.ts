/**
 * TypeScript type definitions for CivicAssist API
 * Phase 4: Frontend Implementation
 */

// Base Application Interface
export interface BaseApplication {
  industry_name: string;
  industry_type: 'Manufacturing' | 'Commercial' | 'Residential' | 'Warehousing';
  square_feet: string;
  total_area: number;
  documents: string[];
  document_url?: string;
}

// Manufacturing-Specific Fields
export interface ManufacturingApplication extends BaseApplication {
  industry_type: 'Manufacturing';
  // Water & Pollution Control
  water_source: string;
  drainage_method: string;
  etp_capacity?: number; // KLD
  zld_system?: string; // Type of ZLD system
  effluent_quality?: string; // pH, BOD, COD values
  // Air Pollution
  stack_height?: number; // meters
  air_pollution_control?: string; // APCD type
  // Hazardous Waste
  hazardous_waste_types?: string;
  hazardous_waste_quantity?: string;
  tsdf_authorization?: string;
  // Factory Safety
  worker_count?: number;
  ventilation_acph?: number;
  fire_hydrant_count?: number;
  emergency_plan?: string;
}

// Commercial-Specific Fields
export interface CommercialApplication extends BaseApplication {
  industry_type: 'Commercial';
  building_height?: number; // meters
  // Fire Safety
  sprinkler_coverage?: string;
  staircase_width?: number; // meters
  travel_distance?: number; // meters to nearest exit
  refuge_area_height?: number; // meters
  fire_alarm_system?: string;
  // Parking
  total_ecs?: number; // Equivalent Car Spaces
  ev_charging_bays?: number;
  basement_levels?: number;
  parking_area?: number; // sq.ft
  // Energy & Accessibility
  shgc_value?: number; // Solar Heat Gain Coefficient
  lighting_power_density?: number; // W/sq.m
  accessible_entrance?: boolean;
  accessible_toilets?: number;
}

// Residential-Specific Fields
export interface ResidentialApplication extends BaseApplication {
  industry_type: 'Residential';
  dwelling_units?: number;
  // Environmental
  ec_category?: string; // B1/B2
  tree_count?: number;
  green_cover_percentage?: number;
  // Water Management
  rwh_pits_count?: number;
  rwh_storage_capacity?: number; // liters
  grey_water_recycling?: boolean;
  dual_plumbing?: boolean;
  // Waste & Energy
  owc_capacity?: number; // kg/day
  segregation_system?: string; // 3-bin, etc.
  solar_water_heater_coverage?: string; // floors covered
  // Setbacks
  building_height?: number; // meters
  setback_compliance?: string;
}

// Warehousing-Specific Fields
export interface WarehousingApplication extends BaseApplication {
  industry_type: 'Warehousing';
  warehouse_type?: string; // FMCG, Cold Storage, etc.
  // Structural
  floor_load_capacity?: number; // Tonnes/sq.m
  clear_height?: number; // meters
  flooring_type?: string; // VDF, etc.
  // Fire Safety
  sprinkler_type?: string; // ESFR, etc.
  fire_tank_capacity?: number; // liters
  compartment_size?: number; // sq.m
  fire_wall_rating?: number; // hours
  // Loading & Operations
  dock_count?: number;
  dock_height?: number; // meters
  turning_radius?: number; // meters
  // Lighting & Safety
  lighting_lux?: number;
  cctv_coverage?: boolean;
  battery_charging_room?: boolean;
}

// Discriminated Union for Type Safety
export type ApplicationData =
  | ManufacturingApplication
  | CommercialApplication
  | ResidentialApplication
  | WarehousingApplication;

// Legacy compatibility
export type IndustrialApplication = ApplicationData;

// Compliance Report Types
export interface ComplianceIssue {
  issue_type: 'missing_document' | 'violation' | 'ambiguity';
  severity: 'low' | 'medium' | 'high';
  description: string;
  regulation_reference?: string;
  department?: string;
}

export interface ComplianceReport {
  application_id?: string;
  status: 'compliant' | 'partial' | 'non_compliant';
  confidence_score: number; // 0.0-1.0
  issues: ComplianceIssue[];
  missing_documents: string[];
  recommendations: string[];
  regulation_coverage: number; // 0.0-1.0
  generated_at: string;
}

// Application Persistence Types
export interface ApplicationSubmission {
  application_data: IndustrialApplication;
  compliance_report?: ComplianceReport | null; // Optional for drafts
  submission_reason?: string;
  status?: string; // Allow sending status (e.g. pending)
}

export interface SavedApplication extends ApplicationSubmission {
  id: string;
  submitted_at: string;
  status: string;
  // Officer Review Fields
  officer_action?: string;
  officer_notes?: string;
  rejection_reason?: string;
  time_saved_seconds: number;

  // Phase 2: Accept/Override Tracking
  issue_overrides?: Record<string, { accepted: boolean | null; reason?: string }>;
}

// Regulation Search Types
export interface RegulationMetadata {
  regulation_name: string;
  source_file: string;
  department: string;
  clause_id: string;
  chunk_index: number;
}

export interface RegulationSearchResponse {
  query: string;
  results: string[];
  metadatas: RegulationMetadata[];
  distances: number[];
  count: number;
}

// System Types
export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

export interface VersionResponse {
  api_version: string;
  app_name: string;
}

// UI Helper Types
export type ComplianceStatus = 'compliant' | 'partial' | 'non_compliant';
export type RiskLevel = 'low' | 'medium' | 'high';
export type IssueType = 'missing_document' | 'violation' | 'ambiguity';
