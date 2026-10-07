import React, { useState } from 'react';
import { X, Send, AlertTriangle, CheckCircle2, ShieldCheck, Stethoscope } from 'lucide-react';
import { Assessment, ReviewStatus } from '../types/assessment';
import { Language, translations } from '../utils/translations';
import { UserRole } from './Sidebar';

interface ReviewModalProps {
  assessment: Assessment;
  onClose: () => void;
  onSaveReview: (updatedAssessment: Assessment) => void;
  userRole: UserRole;
  lang: Language;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  assessment,
  onClose,
  onSaveReview,
  userRole,
  lang,
}) => {
  const [reviewerName, setReviewerName] = useState<string>(
    assessment.reviewRecord.reviewerName || 
    (userRole === 'reviewer' ? 'Dr. Ananya Rao, MD' : userRole === 'admin' ? 'Prof. K. Sundaram, MD' : 'Dr. Pulmonologist, MD')
  );
  const [reviewerRole, setReviewerRole] = useState<string>(
    assessment.reviewRecord.reviewerRole || 'Thoracic Radiologist'
  );
  const [clinicalNotes, setClinicalNotes] = useState<string>(
    assessment.reviewRecord.clinicalNotes || ''
  );
  const [recommendation, setRecommendation] = useState<string>(
    assessment.reviewRecord.recommendation || 'Follow-up CT in 3 months'
  );
  const [reviewStatus, setReviewStatus] = useState<ReviewStatus>(
    assessment.reviewRecord.status === 'pending_review' ? 'completed' : assessment.reviewRecord.status
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedAssessment: Assessment = {
      ...assessment,
      reviewRecord: {
        ...assessment.reviewRecord,
        reviewerName,
        reviewerRole,
        reviewedAt: new Date().toLocaleString(),
        clinicalNotes,
        recommendation,
        status: reviewStatus,
      },
      versionHistory: [
        ...assessment.versionHistory,
        {
          version: assessment.version,
          date: new Date().toLocaleString(),
          changes: `Physician review updated with status: ${reviewStatus}.`,
          author: reviewerName,
        }
      ]
    };

    onSaveReview(updatedAssessment);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DCE3D8] w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#DCE3D8] flex items-center justify-between bg-[#F7F5EF]">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#245C45]" />
            <div>
              <h3 className="font-semibold text-[#183D30] text-base">
                Medical Review Sign-Off
              </h3>
              <p className="text-xs text-[#607066]">
                Assessment: <strong className="font-mono text-[#24352B]">{assessment.id}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#607066] hover:text-[#24352B] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#24352B] mb-1">
                Clinician Name:
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#24352B] mb-1">
                Specialty / Credential:
              </label>
              <input
                type="text"
                value={reviewerRole}
                onChange={(e) => setReviewerRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#24352B] mb-1">
              Review Status Decision:
            </label>
            <select
              value={reviewStatus}
              onChange={(e) => setReviewStatus(e.target.value as ReviewStatus)}
              className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
            >
              <option value="completed">Completed & Validated</option>
              <option value="discrepancy_flagged">Flag Discrepancy Between Modalities</option>
              <option value="in_review">Keep Under Active Review</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#24352B] mb-1">
              Clinical Recommendation:
            </label>
            <select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
            >
              <option value="Follow-up CT in 3 months">Repeat Low-Dose CT in 3 months (Fleischner Protocol)</option>
              <option value="Urgent Pulmonology Referral">Urgent Pulmonology Referral for Diagnostic Workup</option>
              <option value="Routine Annual Screen">Routine Annual Low-Dose Screening</option>
              <option value="Contrast PET-CT & Tissue Biopsy">Consider Contrast PET-CT / Tissue Biopsy</option>
              <option value="No Acute Action Required">No Acute Action Required</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#24352B] mb-1">
              Physician Narrative Notes & Observations:
            </label>
            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Document visual verification of CT nodule margins, correlation with smoking history, and clinical next steps..."
              className="w-full p-3 rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
              required
            />
          </div>

          <div className="p-3 bg-[#E7EFE5] rounded-xl border border-[#DCE3D8] text-[11px] text-[#183D30]">
            Reviewer notes will be recorded in the audit trail with physician attribution.
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#DCE3D8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DCE3D8] text-xs font-medium text-[#607066] hover:bg-[#F7F5EF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#245C45] text-white text-xs font-semibold hover:bg-[#183D30] transition-colors"
            >
              Submit Signed Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
