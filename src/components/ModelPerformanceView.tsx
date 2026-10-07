import React from 'react';
import { 
  Activity, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  Info,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface ModelPerformanceViewProps {
  lang: Language;
}

export const ModelPerformanceView: React.FC<ModelPerformanceViewProps> = ({ lang }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-2 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#245C45] bg-[#E7EFE5] px-3 py-1 rounded-lg">
          <Activity className="w-3.5 h-3.5" />
          <span>Research Model Validation & Calibration Auditing</span>
        </div>
        <h2 className="text-2xl font-semibold text-[#183D30]">
          Model Telemetry & Cohort Benchmarks
        </h2>
        <p className="text-xs text-[#607066] max-w-3xl">
          Empirical validation metrics across retrospective research cohorts. Dual models are calibrated against peer-reviewed benchmark datasets with cross-validation rigor.
        </p>
      </div>

      {/* Model 1: Clinical Tabular Model Benchmarks */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-5 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE3D8] pb-3">
          <div>
            <span className="text-xs font-semibold text-[#607066] uppercase tracking-wider block">Model 1</span>
            <h3 className="text-lg font-semibold text-[#183D30]">
              Clinical Tabular Risk Predictor (v1.4.2)
            </h3>
            <p className="text-xs text-[#607066]">Gradient-boosted decision trees trained on NLST & UK Biobank cohorts (n=48,200 subjects).</p>
          </div>
          <span className="text-xs font-mono font-medium text-[#245C45] bg-[#E7EFE5] px-2.5 py-1 rounded-lg self-start sm:self-auto">
            AUC: 0.841 (95% CI: 0.82–0.86)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#DCE3D8]">
            <span className="text-xs text-[#607066] block">Sensitivity (Threshold 0.50):</span>
            <span className="text-2xl font-mono font-bold text-[#183D30]">82.4%</span>
            <span className="text-[10px] text-[#607066] block mt-0.5">True Positive Recall</span>
          </div>
          <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#DCE3D8]">
            <span className="text-xs text-[#607066] block">Specificity (Threshold 0.50):</span>
            <span className="text-2xl font-mono font-bold text-[#183D30]">79.1%</span>
            <span className="text-[10px] text-[#607066] block mt-0.5">True Negative Rate</span>
          </div>
          <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#DCE3D8]">
            <span className="text-xs text-[#607066] block">Brier Calibration Score:</span>
            <span className="text-2xl font-mono font-bold text-[#183D30]">0.088</span>
            <span className="text-[10px] text-[#607066] block mt-0.5">Well-calibrated probability</span>
          </div>
          <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#DCE3D8]">
            <span className="text-xs text-[#607066] block">Primary Influencer:</span>
            <span className="text-sm font-semibold text-[#183D30] block mt-2">Pack-Years (SHAP 36%)</span>
            <span className="text-[10px] text-[#607066] block">Cumulative tobacco index</span>
          </div>
        </div>
      </div>

      {/* Model 2: Volumetric Chest CT Nodule Classifier Benchmarks */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-5 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE3D8] pb-3">
          <div>
            <span className="text-xs font-semibold text-[#607066] uppercase tracking-wider block">Model 2</span>
            <h3 className="text-lg font-semibold text-[#183D30]">
              Volumetric Chest CT Nodule Classifier (v2.1.0)
            </h3>
            <p className="text-xs text-[#607066]">DenseNet-121 3D volumetric backbone validated on LIDC-IDRI database (1,018 thoracic CT scans).</p>
          </div>
          <span className="text-xs font-mono font-medium text-[#245C45] bg-[#E7EFE5] px-2.5 py-1 rounded-lg self-start sm:self-auto">
            AUC: 0.887 (95% CI: 0.86–0.91)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#DCE3D8]">
            <span className="text-xs text-[#607066] block">Nodule Detection Sensitivity:</span>
            <span className="text-2xl font-mono font-bold text-[#183D30]">89.2%</span>
            <span className="text-[10px] text-[#607066] block mt-0.5">Lesions &ge; 4mm</span>
          </div>
          <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#DCE3D8]">
            <span className="text-xs text-[#607066] block">Specificity per Scan:</span>
            <span className="text-2xl font-mono font-bold text-[#183D30]">84.6%</span>
            <span className="text-[10px] text-[#607066] block mt-0.5">Benign discrimination</span>
          </div>
          <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#DCE3D8]">
            <span className="text-xs text-[#607066] block">False Positives / Scan:</span>
            <span className="text-2xl font-mono font-bold text-[#183D30]">0.42</span>
            <span className="text-[10px] text-[#607066] block mt-0.5">Average phantom nodule rate</span>
          </div>
          <div className="bg-[#F7F5EF] p-4 rounded-xl border border-[#DCE3D8]">
            <span className="text-xs text-[#607066] block">Attention Map Method:</span>
            <span className="text-sm font-semibold text-[#183D30] block mt-2">Grad-CAM Attribution</span>
            <span className="text-[10px] text-[#607066] block">Last convolutional layer</span>
          </div>
        </div>
      </div>

      {/* Discrepancy & Fusion Research Notice */}
      <div className="bg-[#E7EFE5] rounded-2xl border border-[#DCE3D8] p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#245C45] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Multi-Modal Architecture Guidelines</span>
        </div>
        <p className="text-xs text-[#24352B] leading-relaxed">
          <strong>Why models are presented independently without composite averaging:</strong> Clinical validation demonstrates that averaging multimodal probabilities introduces confounding errors when non-smokers present with incidental parenchymal findings, or when heavy smokers have clear baseline CT slices. Reporting each model's raw probability index alongside human physician sign-off ensures maximum diagnostic transparency and safety.
        </p>
      </div>
    </div>
  );
};
