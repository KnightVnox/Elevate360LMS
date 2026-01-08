// SCORM Type Definitions

export type SCORMVersion = '1.2' | '2004';

export interface SCORMManifest {
  identifier: string;
  version?: string;
  title: string;
  organizations: SCORMOrganization[];
  resources: SCORMResource[];
  metadata?: SCORMMetadata;
}

export interface SCORMOrganization {
  identifier: string;
  title: string;
  items: SCORMItem[];
}

export interface SCORMItem {
  identifier: string;
  identifierref?: string;
  title: string;
  items?: SCORMItem[];
  parameters?: string;
}

export interface SCORMResource {
  identifier: string;
  type: string;
  href?: string;
  files: SCORMFile[];
}

export interface SCORMFile {
  href: string;
}

export interface SCORMSco {
  identifier: string;
  title: string;
  launchUrl: string;
  entryPoint: string;
  metadata?: any;
  orderIndex: number;
}

export interface SCORMPackage {
  version: SCORMVersion;
  manifest: SCORMManifest;
  scos: SCORMSco[];
  organizationIdentifier: string;
}

export interface SCORMMetadata {
  schema?: string;
  schemaversion?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  general?: any;
  technical?: any;
  educational?: any;
  rights?: any;
}

// CMI Data Model (Common for both versions)
export interface CMIData {
  // Core Data Model Elements
  student_id?: string;
  student_name?: string;
  lesson_location?: string;
  lesson_status?: 'passed' | 'completed' | 'failed' | 'incomplete' | 'browsed' | 'not attempted';
  score?: {
    raw?: number;
    min?: number;
    max?: number;
    scaled?: number;
  };
  time?: {
    session_time?: string; // Format: HH:MM:SS.SS
    total_time?: string;
  };
  entry?: 'ab-initio' | 'resume' | '';
  exit?: 'time-out' | 'suspend' | 'logout' | 'normal' | '';
  suspend_data?: string;
  launch_data?: string;
  comments?: string;
  comments_from_lms?: string;
  interactions?: CMIDataInteraction[];
  objectives?: CMIDataObjective[];
  
  // SCORM 2004 specific
  completion_status?: 'completed' | 'incomplete' | 'not attempted' | 'unknown';
  success_status?: 'passed' | 'failed' | 'unknown';
}

export interface CMIDataInteraction {
  id: string;
  type: 'true-false' | 'choice' | 'fill-in' | 'numeric' | 'likert' | 'sequencing' | 'long-fill-in' | 'matching' | 'performance' | 'other';
  student_response?: string;
  result?: 'correct' | 'incorrect' | 'unanticipated' | 'neutral';
  time?: string;
  weighting?: number;
  correct_responses?: string[];
  latency?: string;
  description?: string;
}

export interface CMIDataObjective {
  id: string;
  score?: {
    raw?: number;
    min?: number;
    max?: number;
    scaled?: number;
  };
  success_status?: 'passed' | 'failed' | 'unknown';
  completion_status?: 'completed' | 'incomplete' | 'not attempted' | 'unknown';
  progress_measure?: number;
  description?: string;
}

export interface SCORMValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  manifest?: SCORMManifest;
}

export interface SCORMImportResult {
  success: boolean;
  packageId?: string;
  courseId?: string;
  scos?: SCORMSco[];
  errors?: string[];
  warnings?: string[];
}


