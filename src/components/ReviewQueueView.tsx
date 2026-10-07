import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Calendar, 
  FileText,
  Search,
  Check
} from 'lucide-react';
import { Assessment, ReviewStatus } from '../types/assessment';
import { Language, translations } from '../utils/translations';

interface ReviewQueueViewProps {
  assessments: Assessment[];
  onSelectAssessment: (assessmentId: string) => void;
  onOpenReviewModal: (assessment: Assessment) => void;
  lang: Language;
}

export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({
  assessments,
  onSelectAssessment,
  onOpenReviewModal,
  lang,
}) => {
  const [tabFilter, setTabFilter] = useState<'pending' | 'flagged' | 'completed'>('pending');

  const pendingList = assessments.filter(a => a.reviewRecord.status === 'pending_review');
  const flaggedList = assessments.filter(a => a.reviewRecord.status === 'discrepancy_flagged');
  const completedList = assessments.filter(a => a.reviewRecord.status === 'completed');

  const activeList = 
    tabFilter === 'pending' ? pendingList : 
    tabFilter === 'flagged' ? flaggedList : 
    completedList;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-2 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#245C45] bg-[#E7EFE5] px-3 py-1 rounded-lg">
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>Authorized Physician Clinical Queue</span>
        </div>
        <h2 className="text-2xl font-semibold text-[#183D30]">
          Medical Review & Quality Assurance Queue
        </h2>
        <p className="text-xs text-[#607066] max-w-3xl">
          Clinical sign-off workflow. Physicians evaluate model outputs, verify image segmentations, resolve cross-modality discrepancies, and document clinical recommendations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DCE3D8] pb-1 text-sm font-medium">
        <button
          onClick={() => setTabFilter('pending')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-colors border-b-2 ${
            tabFilter === 'pending'
              ? 'border-[#245C45] text-[#183D30] font-semibold bg-white'
              : 'border-transparent text-[#607066] hover:text-[#24352B]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#946200]" />
          <span>Pending Evaluation</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#946200]/10 text-[#946200] font-mono">
            {pendingList.length}
          </span>
        </button>

        <button
          onClick={() => setTabFilter('flagged')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-colors border-b-2 ${
            tabFilter === 'flagged'
              ? 'border-[#946200] text-[#946200] font-semibold bg-white'
              : 'border-transparent text-[#607066] hover:text-[#24352B]'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-[#946200]" />
          <span>Discrepancies Flagged</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#946200]/10 text-[#946200] font-mono">
            {flaggedList.length}
          </span>
        </button>

        <button
          onClick={() => setTabFilter('completed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-colors border-b-2 ${
            tabFilter === 'completed'
              ? 'border-[#245C45] text-[#245C45] font-semibold bg-white'
              : 'border-transparent text-[#607066] hover:text-[#24352B]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-[#245C45]" />
          <span>Completed Reviews</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E7EFE5] text-[#245C45] font-mono">
            {completedList.length}
          </span>
        </button>
      </div>

      {/* Queue Cards */}
      <div className="space-y-4">
        {activeList.length > 0 ? (
          activeList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#DCE3D8] p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:border-[#245C45]/60 transition-all"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-base text-[#183D30]">
                    {item.id}
                  </span>
                  <span className="text-xs text-[#607066]">·</span>
                  <span className="text-xs font-mono text-[#607066]">
                    Patient: {item.patientData?.patientId || 'Unlinked CT Slice'}
                  </span>
                  <span className="text-xs text-[#607066]">·</span>
                  <span className="text-xs text-[#607066] font-mono">
                    {item.createdAt}
                  </span>
                  {item.status === 'disagreement' && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FFFBEB] text-[#946200] border border-[#FDE68A]">
                      Model Discrepancy
                    </span>
                  )}
                </div>

                {/* Model Predictions summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F7F5EF] p-3 rounded-xl border border-[#DCE3D8]">
                  <div>
                    <span className="text-[#607066] block font-medium">Clinical Questionnaire Model:</span>
                    <span className="font-semibold text-[#183D30]">
                      {item.patientModel.predictedClass} {item.patientModel.score !== null && `(${item.patientModel.score.toFixed(2)})`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#607066] block font-medium">Radiological CT Model:</span>
                    <span className="font-semibold text-[#183D30]">
                      {item.imageModel.predictedClass} {item.imageModel.score !== null && `(${item.imageModel.score.toFixed(2)})`}
                    </span>
                  </div>
                </div>

                {/* Clinical Notes if already signed off */}
                {item.reviewRecord.clinicalNotes && (
                  <div className="text-xs text-[#607066] bg-[#E7EFE5]/40 p-3 rounded-xl border border-[#DCE3D8]">
                    <strong className="text-[#183D30] block">Reviewer Note ({item.reviewRecord.reviewerName}):</strong>
                    {item.reviewRecord.clinicalNotes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => onSelectAssessment(item.id)}
                  className="px-4 py-2 rounded-xl border border-[#DCE3D8] text-xs font-semibold text-[#24352B] hover:bg-[#F7F5EF] transition-colors"
                >
                  View Assessment
                </button>
                <button
                  onClick={() => onOpenReviewModal(item)}
                  className="px-5 py-2 rounded-xl bg-[#245C45] text-white text-xs font-semibold hover:bg-[#183D30] transition-colors shadow-xs"
                >
                  {item.reviewRecord.status === 'completed' ? 'Edit Review' : 'Perform Review'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-[#DCE3D8] p-12 text-center text-[#607066] text-sm">
            <CheckCircle2 className="w-8 h-8 text-[#245C45] mx-auto mb-2" />
            <p className="font-semibold text-[#183D30]">All items in this queue are clear.</p>
            <p className="text-xs mt-1">Check other review tabs or wait for new model inferences to arrive.</p>
          </div>
        )}
      </div>
    </div>
  );
};
