import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Layers, 
  FileText, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { Assessment, AssessmentMode, ReviewStatus } from '../types/assessment';
import { Language, translations } from '../utils/translations';

interface HistoryViewProps {
  assessments: Assessment[];
  onSelectAssessment: (assessmentId: string) => void;
  lang: Language;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  assessments,
  onSelectAssessment,
  lang,
}) => {
  const t = translations[lang];

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [reviewFilter, setReviewFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAssessments = assessments.filter((item) => {
    // Search query matches ID or Patient ID or Notes
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      !q || 
      item.id.toLowerCase().includes(q) || 
      (item.patientData?.patientId && item.patientData.patientId.toLowerCase().includes(q)) ||
      (item.imageData?.fileName && item.imageData.fileName.toLowerCase().includes(q));

    // Mode filter
    const matchesMode = modeFilter === 'all' || item.mode === modeFilter;

    // Review status filter
    const matchesReview = reviewFilter === 'all' || item.reviewRecord.status === reviewFilter;

    // Analysis status filter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesQuery && matchesMode && matchesReview && matchesStatus;
  });

  const getModeLabel = (mode: AssessmentMode) => {
    switch (mode) {
      case 'both': return 'Clinical + Image';
      case 'patient_only': return 'Clinical Only';
      case 'image_only': return 'Thoracic CT Only';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-1 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <h2 className="text-2xl font-semibold text-[#183D30]">
          Assessment History & Audit Registry
        </h2>
        <p className="text-xs text-[#607066]">
          Searchable research repository of all thoracic model inference runs and physician reviews.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-4 md:p-5 space-y-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#607066] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Assessment ID or Patient ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCE3D8] bg-[#F7F5EF]/60 text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
            />
          </div>

          {/* Mode Filter */}
          <div>
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] bg-[#F7F5EF]/60 text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
            >
              <option value="all">All Input Modes</option>
              <option value="both">Clinical + Image</option>
              <option value="patient_only">Clinical Details Only</option>
              <option value="image_only">Thoracic CT Image Only</option>
            </select>
          </div>

          {/* Review Status Filter */}
          <div>
            <select
              value={reviewFilter}
              onChange={(e) => setReviewFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] bg-[#F7F5EF]/60 text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
            >
              <option value="all">All Review States</option>
              <option value="pending_review">Pending Medical Review</option>
              <option value="completed">Reviewed & Signed Off</option>
              <option value="discrepancy_flagged">Discrepancy Flagged</option>
            </select>
          </div>

          {/* Analysis Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] bg-[#F7F5EF]/60 text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
            >
              <option value="all">All Pipeline Outcomes</option>
              <option value="completed">Analysis Completed</option>
              <option value="disagreement">Model Discrepancy</option>
              <option value="inconclusive">Inconclusive / Artifact</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#607066] pt-1">
          <span>
            Showing <strong className="text-[#183D30] font-mono">{filteredAssessments.length}</strong> of{' '}
            <strong className="text-[#183D30] font-mono">{assessments.length}</strong> total records
          </span>
          {(searchQuery || modeFilter !== 'all' || reviewFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setModeFilter('all');
                setReviewFilter('all');
                setStatusFilter('all');
              }}
              className="text-[#245C45] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Table (Desktop) */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] overflow-hidden shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F5EF] border-b border-[#DCE3D8] text-xs font-semibold text-[#607066]">
              <tr>
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Assessment & Patient ID</th>
                <th className="py-3 px-6">Input Mode</th>
                <th className="py-3 px-6">Model Findings</th>
                <th className="py-3 px-6">Medical Review Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE3D8]/70">
              {filteredAssessments.length > 0 ? (
                filteredAssessments.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectAssessment(item.id)}
                    className="hover:bg-[#F7F5EF]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 text-xs text-[#607066] font-mono whitespace-nowrap">
                      {item.createdAt}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-mono font-semibold text-[#183D30] text-sm">
                        {item.id}
                      </div>
                      <div className="text-xs text-[#607066]">
                        {item.patientData?.patientId || 'Unlinked Anonymous'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-[#24352B]">
                      <span className="font-medium">{getModeLabel(item.mode)}</span>
                    </td>
                    <td className="py-4 px-6 text-xs">
                      <div className="space-y-0.5">
                        {item.patientModel.status === 'available' && (
                          <div className="text-[#607066]">
                            Clinical: <span className="font-semibold text-[#183D30]">{item.patientModel.predictedClass}</span>
                          </div>
                        )}
                        {item.imageModel.status === 'available' && (
                          <div className="text-[#607066]">
                            Imaging: <span className="font-semibold text-[#183D30]">{item.imageModel.predictedClass}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {item.reviewRecord.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#245C45] bg-[#E7EFE5] px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Reviewed</span>
                        </span>
                      ) : item.reviewRecord.status === 'discrepancy_flagged' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#946200] bg-[#946200]/10 px-2 py-0.5 rounded-md">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Discrepancy</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#946200] bg-[#946200]/10 px-2 py-0.5 rounded-md">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAssessment(item.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#245C45] bg-[#E7EFE5] group-hover:bg-[#245C45] group-hover:text-white transition-all shadow-xs"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#607066] text-sm">
                    No assessments match the selected search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
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

                <div className="text-xs text-[#607066] flex justify-between">
                  <span>Patient ID: {item.patientData?.patientId || 'Unlinked'}</span>
                  <span>{getModeLabel(item.mode)}</span>
                </div>

                <div className="text-xs space-y-1">
                  {item.patientModel.status === 'available' && (
                    <div>Clinical: <span className="font-semibold text-[#24352B]">{item.patientModel.predictedClass}</span></div>
                  )}
                  {item.imageModel.status === 'available' && (
                    <div>Imaging: <span className="font-semibold text-[#24352B]">{item.imageModel.predictedClass}</span></div>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <div>
                    {item.reviewRecord.status === 'completed' ? (
                      <span className="text-xs font-medium text-[#245C45] bg-[#E7EFE5] px-2 py-0.5 rounded-md">
                        Reviewed
                      </span>
                    ) : item.reviewRecord.status === 'discrepancy_flagged' ? (
                      <span className="text-xs font-medium text-[#946200] bg-[#946200]/10 px-2 py-0.5 rounded-md">
                        Discrepancy
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-[#946200] bg-[#946200]/10 px-2 py-0.5 rounded-md">
                        Pending
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAssessment(item.id);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#245C45]"
                  >
                    <span>View Record</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#607066] text-sm">
              No matching assessments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
