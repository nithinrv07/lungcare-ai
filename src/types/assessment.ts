export type AssessmentMode = 'both' | 'patient_only' | 'image_only';

export type AnalysisStatus = 
  | 'completed'
  | 'partial'
  | 'disagreement'
  | 'inconclusive'
  | 'unsupported_image'
  | 'failed';

export type ReviewStatus = 
  | 'pending_review'
  | 'in_review'
  | 'completed'
  | 'discrepancy_flagged';

export interface PatientData {
  patientId: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  smokingStatus: 'current' | 'former' | 'never';
  smokingPackYears: number;
  coughDurationMonths: number;
  shortnessOfBreathScale: number; // mMRC scale 0-4
  copdHistory: boolean;
  familyLungCancer: boolean;
  occupationalDustAsbestos: boolean;
  hemoptysis: boolean; // coughing blood
  notes?: string;
}

export interface ImageData {
  modality: 'Axial High-Resolution Chest CT' | 'Posteroanterior Chest Radiograph (CXR)';
  fileName: string;
  fileSize: string;
  resolution: string;
  sliceThickness?: string;
  imageUri: string;
  attributionMapUri?: string;
  seriesUid: string;
  acquisitionDate: string;
}

export interface FeatureAttribution {
  feature: string;
  enteredValue: string;
  impact: 'increased' | 'decreased' | 'neutral';
  weight: number; // -1.0 to 1.0 (SHAP value representation)
  description: string;
}

export interface ModelOutput {
  name: string;
  version: string;
  status: 'available' | 'not_included' | 'inconclusive' | 'failed';
  predictedClass: string;
  score: number | null; // e.g. 0.72 (range 0.0 - 1.0)
  scoreLabel: string;
  explanation: string;
  limitations: string;
  featureAttributions?: FeatureAttribution[];
  hasExplanationOverlay?: boolean;
}

export interface StatusBannerInfo {
  type: 'completed_pending_review' | 'partial_results' | 'model_disagreement' | 'inconclusive' | 'unsupported_image' | 'failed';
  title: string;
  description: string;
}

export interface ReviewRecord {
  reviewerName?: string;
  reviewerRole?: string;
  reviewedAt?: string;
  status: ReviewStatus;
  clinicalNotes?: string;
  recommendation?: string;
  annotations?: Array<{
    id: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    text: string;
    date: string;
  }>;
}

export interface VersionEntry {
  version: string;
  date: string;
  changes: string;
  author: string;
}

export interface Assessment {
  id: string;
  version: string;
  createdAt: string;
  mode: AssessmentMode;
  status: AnalysisStatus;
  statusBanner: StatusBannerInfo;
  patientData?: PatientData;
  imageData?: ImageData;
  patientModel: ModelOutput;
  imageModel: ModelOutput;
  reviewRecord: ReviewRecord;
  versionHistory: VersionEntry[];
}
