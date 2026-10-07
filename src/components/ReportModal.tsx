import React from 'react';
import { X, Printer, FileDown, ShieldCheck, User, Calendar, CheckCircle2 } from 'lucide-react';
import { Assessment } from '../types/assessment';
import { Language, translations } from '../utils/translations';

interface ReportModalProps {
  assessment: Assessment;
  onClose: () => void;
  lang: Language;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  assessment,
  onClose,
  lang,
}) => {
  const t = translations[lang];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-[#DCE3D8] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl my-auto">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-[#DCE3D8] flex items-center justify-between bg-[#F7F5EF] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#183D30]">
              Clinical Research Assessment Report
            </span>
            <span className="text-xs font-mono text-[#607066]">
              ({assessment.id})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#245C45] text-white text-xs font-semibold hover:bg-[#183D30] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#607066] hover:text-[#24352B] rounded-lg hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-sm text-[#24352B]" id="printable-report">
          {/* Header */}
          <div className="border-b border-[#DCE3D8] pb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#245C45] text-white flex items-center justify-center font-bold text-xs">
                  LC
                </div>
                <h1 className="text-xl font-bold text-[#183D30]">LungCare AI Research Registry</h1>
              </div>
              <p className="text-xs text-[#607066] mt-1">Multi-Modal Thoracic Inference & Observational Study</p>
            </div>

            <div className="text-right text-xs space-y-0.5">
              <div className="font-mono font-semibold text-[#183D30]">Report Ref: {assessment.id}</div>
              <div className="text-[#607066]">Version: {assessment.version}</div>
              <div className="text-[#607066]">Timestamp: {assessment.createdAt}</div>
            </div>
          </div>

          {/* Understated Mandatory Disclaimer */}
          <div className="p-3 bg-[#E7EFE5] rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#245C45] shrink-0" />
            <span>
              <strong>Research Prototype:</strong> Model predictions are computational associations and do not constitute an autonomous medical diagnosis or clinical prescription.
            </span>
          </div>

          {/* Patient Details & Acquisition Specs */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-[#F7F5EF] p-4 rounded-xl border border-[#DCE3D8]">
            <div className="space-y-1">
              <span className="font-semibold text-[#183D30] block">Patient Profile:</span>
              <div>Patient ID: <strong className="font-mono">{assessment.patientData?.patientId || 'Unlinked Anonymous'}</strong></div>
              <div>Age / Sex: <strong>{assessment.patientData ? `${assessment.patientData.age} yrs / ${assessment.patientData.gender}` : 'Not provided'}</strong></div>
              <div>Smoking: <strong>{assessment.patientData ? `${assessment.patientData.smokingStatus} (${assessment.patientData.smokingPackYears} pack-yrs)` : 'Not provided'}</strong></div>
              <div>Symptoms: <strong>{assessment.patientData ? `Cough ${assessment.patientData.coughDurationMonths} mos, mMRC Grade ${assessment.patientData.shortnessOfBreathScale}` : 'Not provided'}</strong></div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-[#183D30] block">Imaging Payload:</span>
              <div>Modality: <strong>{assessment.imageData?.modality || 'Not included in run'}</strong></div>
              <div>File: <span className="font-mono">{assessment.imageData?.fileName || 'N/A'}</span></div>
              <div>Matrix: <strong>{assessment.imageData?.resolution || 'N/A'} (Slice {assessment.imageData?.sliceThickness || 'N/A'})</strong></div>
              <div>Series UID: <span className="font-mono text-[10px] break-all">{assessment.imageData?.seriesUid || 'N/A'}</span></div>
            </div>
          </div>

          {/* Status & Review State */}
          <div className="border border-[#DCE3D8] p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#183D30]">Status Classification:</span>
              <span className="font-semibold font-mono text-[#245C45]">{assessment.statusBanner.title}</span>
            </div>
            <p className="text-xs text-[#607066]">{assessment.statusBanner.description}</p>
          </div>

          {/* Dual Model Outputs */}
          <div className="grid grid-cols-2 gap-4">
            {/* Model 1 */}
            <div className="border border-[#DCE3D8] p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between border-b border-[#DCE3D8] pb-1.5">
                <span className="font-semibold text-[#183D30] text-xs">Model 1: Clinical Tabular Predictor</span>
                <span className="text-[10px] font-mono text-[#607066]">{assessment.patientModel.version}</span>
              </div>
              <div className="text-xs space-y-1">
                <div>Predicted Class: <strong>{assessment.patientModel.predictedClass}</strong></div>
                {assessment.patientModel.score !== null && (
                  <div>Likelihood Index: <strong className="font-mono">{assessment.patientModel.score.toFixed(2)} / 1.00</strong></div>
                )}
                <p className="text-[#607066] text-[11px] pt-1">{assessment.patientModel.explanation}</p>
              </div>
            </div>

            {/* Model 2 */}
            <div className="border border-[#DCE3D8] p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between border-b border-[#DCE3D8] pb-1.5">
                <span className="font-semibold text-[#183D30] text-xs">Model 2: Chest CT Classifier</span>
                <span className="text-[10px] font-mono text-[#607066]">{assessment.imageModel.version}</span>
              </div>
              <div className="text-xs space-y-1">
                <div>Predicted Class: <strong>{assessment.imageModel.predictedClass}</strong></div>
                {assessment.imageModel.score !== null && (
                  <div>Likelihood Index: <strong className="font-mono">{assessment.imageModel.score.toFixed(2)} / 1.00</strong></div>
                )}
                <p className="text-[#607066] text-[11px] pt-1">{assessment.imageModel.explanation}</p>
              </div>
            </div>
          </div>

          {/* Clinician Review Record */}
          <div className="border border-[#DCE3D8] p-4 rounded-xl space-y-2 bg-[#F7F5EF]/60">
            <span className="font-semibold text-[#183D30] text-xs block">
              Physician Review & Clinical Recommendations:
            </span>
            {assessment.reviewRecord.clinicalNotes ? (
              <div className="text-xs space-y-1">
                <div className="text-[#607066]">
                  Signed by: <strong>{assessment.reviewRecord.reviewerName}</strong> ({assessment.reviewRecord.reviewerRole}) on {assessment.reviewRecord.reviewedAt}
                </div>
                <p className="text-[#24352B] italic">"{assessment.reviewRecord.clinicalNotes}"</p>
                {assessment.reviewRecord.recommendation && (
                  <div className="font-semibold text-[#245C45] pt-1">
                    Recommendation: {assessment.reviewRecord.recommendation}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#607066] italic">
                Formal physician review is currently pending.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#DCE3D8] flex items-center justify-between text-[11px] text-[#607066]">
            <span>LungCare AI Research Platform · Institutional Review Board Protocol 2026</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
