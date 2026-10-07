import React, { useState } from 'react';
import { 
  PlusCircle, 
  ArrowUpRight, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Layers, 
  User, 
  ArrowRight,
  Filter,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Assessment, AssessmentMode, ReviewStatus } from '../types/assessment';
import { Language, translations } from '../utils/translations';

interface OverviewViewProps {
  assessments: Assessment[];
  onSelectAssessment: (assessmentId: string) => void;
  onStartNewAssessment: () => void;
  lang: Language;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  assessments,
  onSelectAssessment,
  onStartNewAssessment,
  lang,
}) => {
  const [filterMode, setFilterMode] = useState<string>('all');
  const t = translations[lang];

  // Derived metrics without fabricating diagnostic stats
  const totalCount = assessments.length;
  const pendingCount = assessments.filter(a => a.reviewRecord.status === 'pending_review').length;
  const completedReviewCount = assessments.filter(a => a.reviewRecord.status === 'completed' || a.reviewRecord.status === 'discrepancy_flagged').length;
  const latestAssessment = assessments[0];

  const filteredAssessments = assessments.filter(a => {
    if (filterMode === 'all') return true;
    if (filterMode === 'pending') return a.reviewRecord.status === 'pending_review';
    if (filterMode === 'disagreement') return a.status === 'disagreement';
    if (filterMode === 'both') return a.mode === 'both';
    return true;
  });

  const getModeLabel = (mode: AssessmentMode) => {
    switch (mode) {
      case 'both': return 'Clinical + Image';
      case 'patient_only': return 'Clinical Data Only';
      case 'image_only': return 'Thoracic CT Only';
    }
  };

  const getAnalysisStatusBadge = (status: Assessment['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#183D30]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#245C45]" />
            Pipeline Completed
          </span>
        );
      case 'disagreement':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#946200]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#946200]" />
            Model Discrepancy
          </span>
        );
      case 'inconclusive':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#607066]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Inconclusive / Artifact
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#946200]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#946200]" />
            Partial Modality
          </span>
        );
      case 'unsupported_image':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B33D3D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B33D3D]" />
            Unsupported Format
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B33D3D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B33D3D]" />
            Pipeline Failed
          </span>
        );
    }
  };

  const getReviewStatusBadge = (review: Assessment['reviewRecord']) => {
    switch (review.status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#245C45] bg-[#E7EFE5] px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Reviewed ({review.reviewerName?.split(',')[0] || 'Clinician'})
          </span>
        );
      case 'discrepancy_flagged':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#946200] bg-[#946200]/10 px-2 py-0.5 rounded-md">
            <AlertTriangle className="w-3.5 h-3.5" />
            Reviewed · Discrepancy Flagged
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#607066] bg-slate-100 px-2 py-0.5 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            Under Evaluation
          </span>
        );
      case 'pending_review':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#946200] bg-[#946200]/10 px-2 py-0.5 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            Pending Medical Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcoming Header Section */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#607066] bg-[#F7F5EF] px-3 py-1 rounded-lg border border-[#DCE3D8]">
            <span className="w-2 h-2 rounded-full bg-[#245C45]" />
            Research Platform · Protocol Multi-Modal ML v2.4
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#183D30] tracking-tight">
            {t.overview.heading}
          </h2>
          <p className="text-[#607066] text-base leading-relaxed">
            {t.overview.subheading} Model outputs assist clinical research teams by quantifying risk attributes from patient history and thoracic CT slices.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={onStartNewAssessment}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#245C45] text-white text-base font-semibold hover:bg-[#183D30] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#245C45]/50 active:scale-[0.99]"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t.overview.startNew}</span>
          </button>
        </div>
      </div>

      {/* 4 Compact Stat Cards (Separating analysis completion from medical review) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Assessments */}
        <div className="bg-white rounded-2xl border border-[#DCE3D8] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[#607066] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t.overview.totalAssessments}
            </span>
            <div className="p-2 bg-[#F7F5EF] rounded-xl text-[#245C45]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-[#183D30] font-mono tabular-nums">
            {totalCount}
          </div>
          <p className="text-xs text-[#607066] mt-2">
            Multi-modal runs logged in active registry
          </p>
        </div>

        {/* Pending Medical Review */}
        <div className="bg-white rounded-2xl border border-[#DCE3D8] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[#607066] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t.overview.pendingReview}
            </span>
            <div className="p-2 bg-[#946200]/10 rounded-xl text-[#946200]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-[#946200] font-mono tabular-nums">
            {pendingCount}
          </div>
          <p className="text-xs text-[#607066] mt-2">
            Awaiting physician review & validation
          </p>
        </div>

        {/* Completed Reviews */}
        <div className="bg-white rounded-2xl border border-[#DCE3D8] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-[#607066] mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t.overview.completedReviews}
            </span>
            <div className="p-2 bg-[#E7EFE5] rounded-xl text-[#245C45]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-[#245C45] font-mono tabular-nums">
            {completedReviewCount}
          </div>
          <p className="text-xs text-[#607066] mt-2">
            Signed off with clinical annotations
          </p>
        </div>

        {/* Latest Assessment Quick Access */}
        <div 
          onClick={() => latestAssessment && onSelectAssessment(latestAssessment.id)}
          className="bg-white rounded-2xl border border-[#DCE3D8] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.02)] cursor-pointer hover:border-[#245C45] transition-all group"
        >
          <div className="flex items-center justify-between text-[#607066] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t.overview.latestAssessment}
            </span>
            <div className="p-2 bg-[#F7F5EF] rounded-xl text-[#245C45] group-hover:bg-[#E7EFE5] transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          {latestAssessment ? (
            <div>
              <div className="text-base font-semibold text-[#183D30] font-mono">
                {latestAssessment.id}
              </div>
              <div className="text-xs text-[#607066] mt-1 flex items-center gap-1.5">
                <span>{latestAssessment.patientData?.patientId || 'Imaging slice'}</span>
                <span>·</span>
                <span>{getModeLabel(latestAssessment.mode)}</span>
              </div>
              <span className="text-xs font-semibold text-[#245C45] mt-2.5 inline-flex items-center gap-1 group-hover:underline">
                View result analysis →
              </span>
            </div>
          ) : (
            <p className="text-xs text-[#607066]">No assessments run yet</p>
          )}
        </div>
      </div>

      {/* Disclaimers & Integrity Banner */}
      <div className="bg-[#E7EFE5] rounded-2xl border border-[#DCE3D8] p-4.5 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-[#245C45] shrink-0 mt-0.5" />
        <div className="text-xs text-[#24352B] leading-relaxed">
          <strong className="font-semibold text-[#183D30]">Research Rigor Notice:</strong> Machine-learning inference scores are mathematical associations generated from training cohorts. They do not constitute an autonomous medical diagnosis or clinical prescription. Analysis completion and medical review are strictly decoupled; patient management must be guided by licensed physician consultation.
        </div>
      </div>

      {/* Recent Assessments Table Card */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] overflow-hidden shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
        {/* Table Header & Controls */}
        <div className="p-5 md:p-6 border-b border-[#DCE3D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[#183D30]">
              {t.overview.recentTableTitle}
            </h3>
            <p className="text-xs text-[#607066] mt-0.5">
              Ordered by timestamp. Click any record to inspect dual-model predictions and feature explanations.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#F7F5EF] rounded-xl border border-[#DCE3D8] self-start sm:self-auto text-xs font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-[#183D30] font-semibold shadow-xs'
                  : 'text-[#607066] hover:text-[#24352B]'
              }`}
            >
              All Runs ({totalCount})
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === 'pending'
                  ? 'bg-white text-[#183D30] font-semibold shadow-xs'
                  : 'text-[#607066] hover:text-[#24352B]'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilterMode('disagreement')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === 'disagreement'
                  ? 'bg-white text-[#183D30] font-semibold shadow-xs'
                  : 'text-[#607066] hover:text-[#24352B]'
              }`}
            >
              Discrepancies
            </button>
            <button
              onClick={() => setFilterMode('both')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterMode === 'both'
                  ? 'bg-white text-[#183D30] font-semibold shadow-xs'
                  : 'text-[#607066] hover:text-[#24352B]'
              }`}
            >
              Multi-Modal
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F5EF] border-b border-[#DCE3D8] text-xs font-semibold text-[#607066]">
              <tr>
                <th className="py-3 px-6">{t.overview.tableColumns.date}</th>
                <th className="py-3 px-6">{t.overview.tableColumns.id}</th>
                <th className="py-3 px-6">{t.overview.tableColumns.mode}</th>
                <th className="py-3 px-6">{t.overview.tableColumns.analysisStatus}</th>
                <th className="py-3 px-6">{t.overview.tableColumns.reviewStatus}</th>
                <th className="py-3 px-6 text-right">{t.overview.tableColumns.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE3D8]/70">
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-[#F7F5EF]/60 transition-colors group cursor-pointer"
                    onClick={() => onSelectAssessment(item.id)}
                  >
                    <td className="py-4 px-6 text-[#607066] text-xs font-mono whitespace-nowrap">
                      {item.createdAt}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#183D30] font-mono text-sm">
                        {item.id}
                      </div>
                      <div className="text-xs text-[#607066]">
                        {item.patientData?.patientId || 'Unlinked Image'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-[#24352B]">
                      <span className="font-medium">{getModeLabel(item.mode)}</span>
                    </td>
                    <td className="py-4 px-6">
                      {getAnalysisStatusBadge(item.status)}
                    </td>
                    <td className="py-4 px-6">
                      {getReviewStatusBadge(item.reviewRecord)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAssessment(item.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#245C45] bg-[#E7EFE5] group-hover:bg-[#245C45] group-hover:text-white transition-all shadow-xs"
                      >
                        <span>{t.overview.viewResults}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#607066] text-sm">
                    {t.overview.emptyNotice}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="md:hidden divide-y divide-[#DCE3D8]">
          {filteredAssessments.length > 0 ? (
            filteredAssessments.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelectAssessment(item.id)}
                className="p-4 space-y-3 hover:bg-[#F7F5EF] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-sm text-[#183D30]">
                    {item.id}
                  </span>
                  <span className="text-xs text-[#607066] font-mono">
                    {item.createdAt}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#607066]">Mode:</span>
                  <span className="font-medium text-[#24352B]">{getModeLabel(item.mode)}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#607066]">Analysis:</span>
                  <div>{getAnalysisStatusBadge(item.status)}</div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#607066]">Review:</span>
                  <div>{getReviewStatusBadge(item.reviewRecord)}</div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAssessment(item.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-[#245C45] bg-[#E7EFE5]"
                  >
                    <span>{t.overview.viewResults}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#607066] text-sm">
              {t.overview.emptyNotice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
