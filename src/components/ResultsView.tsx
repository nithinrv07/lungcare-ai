import React, { useState, useRef } from 'react';
import { 
  FileDown, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  User, 
  Image as ImageIcon, 
  ClipboardCheck, 
  History as HistoryIcon, 
  Edit3, 
  Send, 
  ShieldAlert, 
  ExternalLink, 
  Clock, 
  Activity,
  Calendar,
  Eye,
  EyeOff,
  Stethoscope,
  FileText
} from 'lucide-react';
import { Assessment, FeatureAttribution, ReviewStatus } from '../types/assessment';
import { Language, translations } from '../utils/translations';
import { UserRole } from './Sidebar';

interface ResultsViewProps {
  assessment: Assessment;
  onNewAssessment: () => void;
  onViewHistory: () => void;
  onEditAndReassess: (assessment: Assessment) => void;
  onSubmitReviewModal: (assessment: Assessment) => void;
  onDownloadReport: (assessment: Assessment) => void;
  userRole: UserRole;
  lang: Language;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  assessment,
  onNewAssessment,
  onViewHistory,
  onEditAndReassess,
  onSubmitReviewModal,
  onDownloadReport,
  userRole,
  lang,
}) => {
  const t = translations[lang];

  // Image Explanation Viewer States
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(65);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Tooltip States
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Accordion Expand States
  const [expandedSection, setExpandedSection] = useState<Record<string, boolean>>({
    inputs: true,
    imageParams: false,
    limitations: false,
    reviewerNotes: true,
    versionHistory: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSection(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Zoom / Pan Handlers
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetView = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Status Banner Helpers
  const renderStatusBanner = () => {
    const banner = assessment.statusBanner;
    let bgColor = 'bg-[#E7EFE5]';
    let borderColor = 'border-[#DCE3D8]';
    let titleColor = 'text-[#183D30]';
    let icon = <CheckCircle2 className="w-5 h-5 text-[#245C45] shrink-0" />;

    if (banner.type === 'model_disagreement') {
      bgColor = 'bg-[#FFFBEB]';
      borderColor = 'border-[#FDE68A]';
      titleColor = 'text-[#946200]';
      icon = <AlertTriangle className="w-5 h-5 text-[#946200] shrink-0" />;
    } else if (banner.type === 'inconclusive' || banner.type === 'partial_results') {
      bgColor = 'bg-[#F7F5EF]';
      borderColor = 'border-[#DCE3D8]';
      titleColor = 'text-[#24352B]';
      icon = <Info className="w-5 h-5 text-[#607066] shrink-0" />;
    } else if (banner.type === 'unsupported_image' || banner.type === 'failed') {
      bgColor = 'bg-[#FEF2F2]';
      borderColor = 'border-[#FECACA]';
      titleColor = 'text-[#B33D3D]';
      icon = <AlertTriangle className="w-5 h-5 text-[#B33D3D] shrink-0" />;
    }

    return (
      <div className={`w-full rounded-2xl border ${borderColor} ${bgColor} p-4 md:p-5 flex items-start gap-3.5 shadow-xs`}>
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1 space-y-1">
          <h2 className={`text-base font-semibold ${titleColor} tracking-tight`}>
            {banner.title}
          </h2>
          <p className="text-sm text-[#607066] leading-relaxed">
            {banner.description}
          </p>
        </div>
      </div>
    );
  };

  const isPatientModelActive = assessment.patientModel.status === 'available';
  const isImageModelActive = assessment.imageModel.status === 'available';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. ASSESSMENT HEADER */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 md:p-8 space-y-4 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#607066]">
              <span className="font-semibold text-[#183D30] uppercase tracking-wider">
                {t.results.title}
              </span>
              <span>·</span>
              <span className="font-mono">{t.results.assessmentId}: <strong className="text-[#24352B]">{assessment.id}</strong></span>
              <span>·</span>
              <span>Version: <strong className="text-[#24352B] font-mono">{assessment.version}</strong></span>
              <span>·</span>
              <span>Mode: <strong className="text-[#24352B]">{assessment.mode === 'both' ? 'Dual-Modal' : assessment.mode === 'patient_only' ? 'Clinical Only' : 'CT Imaging Only'}</strong></span>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-[#183D30] tracking-tight">
              Patient Assessment Record
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#607066]">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#245C45]" />
                <span>Patient ID: <strong className="font-mono text-[#24352B]">{assessment.patientData?.patientId || 'Unlinked Anonymous'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#245C45]" />
                <span className="font-mono">{assessment.createdAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ClipboardCheck className="w-3.5 h-3.5 text-[#245C45]" />
                <span>
                  Review: {assessment.reviewRecord.status === 'completed' ? (
                    <strong className="text-[#245C45]">Reviewed by {assessment.reviewRecord.reviewerName}</strong>
                  ) : assessment.reviewRecord.status === 'discrepancy_flagged' ? (
                    <strong className="text-[#946200]">Discrepancy Flagged</strong>
                  ) : (
                    <strong className="text-[#946200]">Pending Medical Review</strong>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onDownloadReport(assessment)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCE3D8] bg-white text-sm font-semibold text-[#24352B] hover:bg-[#F7F5EF] transition-colors shadow-xs"
            >
              <FileDown className="w-4 h-4 text-[#245C45]" />
              <span>{t.results.downloadReport}</span>
            </button>
            <button
              onClick={onNewAssessment}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#245C45] text-white text-sm font-semibold hover:bg-[#183D30] transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.results.newAssessment}</span>
            </button>
          </div>
        </div>

        {/* Visible but Understated Disclaimer Note */}
        <div className="pt-3 border-t border-[#DCE3D8]/80 flex items-center gap-2 text-xs text-[#607066]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#946200]" />
          <span className="font-medium text-[#24352B]">
            Research prototype — model predictions are not a medical diagnosis.
          </span>
          <span className="text-[#607066]/70 hidden sm:inline">
            Inference outputs are probabilistic estimates for research study; clinical verification remains required.
          </span>
        </div>
      </div>

      {/* 2. FULL-WIDTH STATUS BANNER */}
      {renderStatusBanner()}

      {/* 3. DUAL MODEL OUTPUT CARDS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-semibold text-[#183D30]">
              {t.results.modelsHeading}
            </h3>
            <p className="text-xs text-[#607066] mt-0.5">
              Outputs from two distinct machine learning pipelines. Presented independently without artificial averaging.
            </p>
          </div>

          {/* Unaveraged notice flag */}
          <div className="inline-flex items-center gap-1.5 text-xs text-[#607066] bg-[#F7F5EF] px-3 py-1.5 rounded-lg border border-[#DCE3D8]">
            <Info className="w-3.5 h-3.5 text-[#245C45]" />
            <span>Dual independent models · No composite averaging</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: Patient-Data Model */}
          <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#DCE3D8] pb-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#607066] block">
                    {t.results.patientModelTitle}
                  </span>
                  <h4 className="text-base font-semibold text-[#183D30]">
                    {assessment.patientModel.name}
                  </h4>
                </div>
                <span className="text-xs font-mono font-medium text-[#607066] bg-[#F7F5EF] px-2 py-1 rounded-md border border-[#DCE3D8]">
                  {assessment.patientModel.version}
                </span>
              </div>

              {isPatientModelActive ? (
                <>
                  {/* Predicted Class */}
                  <div>
                    <span className="text-xs text-[#607066] block mb-1">Predicted Class:</span>
                    <div className="text-xl font-semibold text-[#183D30]">
                      {assessment.patientModel.predictedClass}
                    </div>
                  </div>

                  {/* Clearly Labelled Model Score */}
                  <div className="space-y-1.5 bg-[#F7F5EF]/60 p-4 rounded-xl border border-[#DCE3D8]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#24352B]">
                        <span>{assessment.patientModel.scoreLabel}:</span>
                        <div className="relative inline-block">
                          <button
                            onMouseEnter={() => setActiveTooltip('patient_score')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="text-[#607066] hover:text-[#24352B]"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </button>
                          {activeTooltip === 'patient_score' && (
                            <div className="absolute left-0 bottom-full mb-2 w-64 p-2.5 bg-[#183D30] text-white text-[11px] rounded-lg shadow-lg z-30 leading-snug">
                              {t.results.modelScoreTooltip}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-base text-[#183D30] tabular-nums">
                        {assessment.patientModel.score !== null ? assessment.patientModel.score.toFixed(2) : 'N/A'}
                      </span>
                    </div>

                    {/* Restrained horizontal score bar (no dramatic risk gauges) */}
                    {assessment.patientModel.score !== null && (
                      <div className="w-full h-2 bg-[#DCE3D8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#245C45] rounded-full transition-all"
                          style={{ width: `${Math.round(assessment.patientModel.score * 100)}%` }}
                        />
                      </div>
                    )}
                    <div className="flex justify-between text-[10px] text-[#607066] font-mono">
                      <span>0.0 Baseline</span>
                      <span>0.5 Medium</span>
                      <span>1.0 High</span>
                    </div>
                  </div>

                  {/* Explanation of Output */}
                  <div className="text-xs text-[#607066] leading-relaxed">
                    <strong className="text-[#24352B] font-semibold block mb-0.5">Model Rationale:</strong>
                    {assessment.patientModel.explanation}
                  </div>
                </>
              ) : (
                /* Not Included State */
                <div className="py-8 text-center space-y-2 bg-[#F7F5EF] rounded-xl border border-[#DCE3D8] p-4">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#607066] border border-[#DCE3D8] flex items-center justify-center mx-auto">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h5 className="font-semibold text-sm text-[#24352B]">
                    {t.results.notIncluded}
                  </h5>
                  <p className="text-xs text-[#607066] max-w-xs mx-auto">
                    {t.results.notIncludedDesc}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-[#DCE3D8]/80 text-[11px] text-[#607066] flex items-center justify-between">
              <span>Input Status: {isPatientModelActive ? 'Clinical data evaluated' : 'Omitted in protocol'}</span>
              <span className="font-mono text-[#245C45]">Tabular Gradient Boost</span>
            </div>
          </div>

          {/* CARD 2: Image Model */}
          <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#DCE3D8] pb-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#607066] block">
                    {t.results.imageModelTitle}
                  </span>
                  <h4 className="text-base font-semibold text-[#183D30]">
                    {assessment.imageModel.name}
                  </h4>
                </div>
                <span className="text-xs font-mono font-medium text-[#607066] bg-[#F7F5EF] px-2 py-1 rounded-md border border-[#DCE3D8]">
                  {assessment.imageModel.version}
                </span>
              </div>

              {isImageModelActive ? (
                <>
                  {/* Predicted Class */}
                  <div>
                    <span className="text-xs text-[#607066] block mb-1">Predicted Class:</span>
                    <div className="text-xl font-semibold text-[#183D30]">
                      {assessment.imageModel.predictedClass}
                    </div>
                  </div>

                  {/* Clearly Labelled Model Score */}
                  <div className="space-y-1.5 bg-[#F7F5EF]/60 p-4 rounded-xl border border-[#DCE3D8]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#24352B]">
                        <span>{assessment.imageModel.scoreLabel}:</span>
                        <div className="relative inline-block">
                          <button
                            onMouseEnter={() => setActiveTooltip('image_score')}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="text-[#607066] hover:text-[#24352B]"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </button>
                          {activeTooltip === 'image_score' && (
                            <div className="absolute right-0 bottom-full mb-2 w-64 p-2.5 bg-[#183D30] text-white text-[11px] rounded-lg shadow-lg z-30 leading-snug">
                              {t.results.modelScoreTooltip}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-base text-[#183D30] tabular-nums">
                        {assessment.imageModel.score !== null ? assessment.imageModel.score.toFixed(2) : 'Inconclusive'}
                      </span>
                    </div>

                    {/* Restrained horizontal score bar */}
                    {assessment.imageModel.score !== null && (
                      <div className="w-full h-2 bg-[#DCE3D8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#245C45] rounded-full transition-all"
                          style={{ width: `${Math.round(assessment.imageModel.score * 100)}%` }}
                        />
                      </div>
                    )}
                    <div className="flex justify-between text-[10px] text-[#607066] font-mono">
                      <span>0.0 Baseline</span>
                      <span>0.5 Suspicious</span>
                      <span>1.0 High</span>
                    </div>
                  </div>

                  {/* Explanation of Output */}
                  <div className="text-xs text-[#607066] leading-relaxed">
                    <strong className="text-[#24352B] font-semibold block mb-0.5">Radiological Rationale:</strong>
                    {assessment.imageModel.explanation}
                  </div>
                </>
              ) : (
                /* Not Included State */
                <div className="py-8 text-center space-y-2 bg-[#F7F5EF] rounded-xl border border-[#DCE3D8] p-4">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#607066] border border-[#DCE3D8] flex items-center justify-center mx-auto">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h5 className="font-semibold text-sm text-[#24352B]">
                    {t.results.notIncluded}
                  </h5>
                  <p className="text-xs text-[#607066] max-w-xs mx-auto">
                    {t.results.notIncludedDesc}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-[#DCE3D8]/80 text-[11px] text-[#607066] flex items-center justify-between">
              <span>Input Status: {isImageModelActive ? 'Thoracic CT slice evaluated' : 'Omitted in protocol'}</span>
              <span className="font-mono text-[#245C45]">DenseNet-121 3D Backbone</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. IMAGE EXPLANATION PANEL */}
      {isImageModelActive && assessment.imageData && (
        <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-5 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE3D8] pb-4">
            <div>
              <h3 className="text-xl font-semibold text-[#183D30] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#245C45]" />
                <span>{t.results.imageExplanationTitle}</span>
              </h3>
              <p className="text-xs text-[#607066] mt-0.5">
                Model attention saliency (Grad-CAM). Regions influencing the model, not confirmed tumour boundaries.
              </p>
            </div>

            {/* Interactive Image Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Original / Overlay Toggle */}
              {assessment.imageModel.hasExplanationOverlay && (
                <button
                  onClick={() => setShowOverlay(!showOverlay)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    showOverlay
                      ? 'bg-[#E7EFE5] text-[#183D30] border-[#245C45]/40'
                      : 'bg-white text-[#607066] border-[#DCE3D8] hover:text-[#24352B]'
                  }`}
                >
                  {showOverlay ? <Eye className="w-3.5 h-3.5 text-[#245C45]" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showOverlay ? 'Attention Overlay ON' : 'Original Only'}</span>
                </button>
              )}

              {/* Opacity Slider */}
              {assessment.imageModel.hasExplanationOverlay && showOverlay && (
                <div className="flex items-center gap-2 bg-[#F7F5EF] px-3 py-1.5 rounded-lg border border-[#DCE3D8] text-xs">
                  <Sliders className="w-3.5 h-3.5 text-[#607066]" />
                  <span className="text-[#607066]">Opacity:</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-16 accent-[#245C45] cursor-pointer"
                  />
                  <span className="font-mono text-[#24352B] w-7 text-right">{overlayOpacity}%</span>
                </div>
              )}

              {/* Zoom & Pan Tools */}
              <div className="flex items-center gap-1 bg-[#F7F5EF] p-1 rounded-lg border border-[#DCE3D8]">
                <button
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1 text-[#24352B] hover:bg-white rounded transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1 text-[#24352B] hover:bg-white rounded transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetView}
                  title="Reset Zoom and Pan"
                  className="p-1 text-[#24352B] hover:bg-white rounded transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Image Display Canvas Stage */}
          <div
            ref={imageContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative w-full h-[380px] md:h-[460px] bg-black rounded-xl overflow-hidden border border-[#DCE3D8] cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
          >
            {/* The Image Container with Zoom & Pan transform */}
            <div
              className="relative transition-transform duration-75"
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
              }}
            >
              {/* Base DICOM / CT Scan Image */}
              <img
                src={assessment.imageData.imageUri}
                alt="Thoracic Axial CT Slice"
                referrerPolicy="no-referrer"
                className="max-h-[360px] md:max-h-[440px] w-auto object-contain pointer-events-none"
              />

              {/* Saliency Attention Overlay (Grad-CAM heat map) */}
              {assessment.imageModel.hasExplanationOverlay && showOverlay && (
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-screen"
                  style={{ opacity: overlayOpacity / 100 }}
                >
                  {/* High fidelity SVG simulated Grad-CAM heatmap representing computational saliency in right lung field */}
                  <svg className="w-full h-full" viewBox="0 0 512 512" fill="none">
                    <defs>
                      <radialGradient id="gradcam1" cx="68%" cy="40%" r="20%" fx="68%" fy="40%">
                        <stop offset="0%" stopColor="#ff1744" stopOpacity="0.85" />
                        <stop offset="40%" stopColor="#ff9100" stopOpacity="0.65" />
                        <stop offset="75%" stopColor="#ffea00" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#00e676" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="gradcam2" cx="32%" cy="62%" r="14%" fx="32%" fy="62%">
                        <stop offset="0%" stopColor="#ff9100" stopOpacity="0.55" />
                        <stop offset="60%" stopColor="#ffea00" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00e676" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    {/* Primary focal saliency field */}
                    <circle cx="68%" cy="40%" r="75" fill="url(#gradcam1)" />
                    {/* Secondary minor activation area */}
                    <circle cx="32%" cy="62%" r="48" fill="url(#gradcam2)" />
                  </svg>
                </div>
              )}

              {/* Reviewer annotations pins if any */}
              {assessment.reviewRecord.annotations && assessment.reviewRecord.annotations.map(ann => (
                <div
                  key={ann.id}
                  style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group pointer-events-auto"
                >
                  <div className="w-5 h-5 rounded-full bg-[#946200] text-white flex items-center justify-center text-xs font-bold ring-4 ring-[#946200]/30 shadow-md">
                    !
                  </div>
                  <div className="hidden group-hover:block absolute left-full ml-2 top-0 w-48 p-2 bg-[#183D30] text-white text-xs rounded-lg shadow-lg z-30">
                    <p className="font-semibold text-amber-300">Clinician Note:</p>
                    <p>{ann.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Canvas HUD overlays */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white/90 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span>Zoom: {(zoomLevel * 100).toFixed(0)}%</span>
              <span className="mx-2 text-white/40">|</span>
              <span>{assessment.imageData.modality}</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white/90 px-3 py-1.5 rounded-lg text-xs font-mono">
              <span>Slice {assessment.imageData.sliceThickness || '1.25mm'}</span>
              <span className="mx-2 text-white/40">|</span>
              <span>{assessment.imageData.resolution}</span>
            </div>

            {/* Explanation Unavailable State Fallback */}
            {!assessment.imageModel.hasExplanationOverlay && (
              <div className="absolute top-3 right-3 bg-[#183D30]/90 text-white px-3 py-1.5 rounded-lg text-xs">
                Explanation overlay unavailable for this acquisition
              </div>
            )}
          </div>

          {/* Saliency Legend & Scientific Caption */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#607066] bg-[#F7F5EF] p-3.5 rounded-xl border border-[#DCE3D8]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#183D30]">Saliency Spectrum:</span>
              <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-600" />
              <span className="font-mono text-[11px]">Low → High Attention</span>
            </div>
            <div className="text-[11px] text-[#24352B]">
              <strong>Caution:</strong> Heatmap highlights computational feature saliency. It does <em>not</em> outline histological tumor margins.
            </div>
          </div>
        </div>
      )}

      {/* 5. PATIENT-DATA EXPLANATION PANEL */}
      {isPatientModelActive && assessment.patientModel.featureAttributions && (
        <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-5 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
          <div className="border-b border-[#DCE3D8] pb-3">
            <h3 className="text-xl font-semibold text-[#183D30] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#245C45]" />
              <span>{t.results.patientExplanationTitle}</span>
            </h3>
            <p className="text-xs text-[#607066] mt-0.5">
              {t.results.patientExplanationSubtitle} Each factor shows the entered clinical value and its directional impact on the predicted score.
            </p>
          </div>

          {/* Horizontal Contribution Bars */}
          <div className="space-y-3.5">
            {assessment.patientModel.featureAttributions.map((attr, idx) => (
              <div key={idx} className="bg-[#F7F5EF]/60 p-3.5 rounded-xl border border-[#DCE3D8] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#183D30]">{attr.feature}</span>
                    <span className="text-xs text-[#607066] bg-white px-2 py-0.5 rounded border border-[#DCE3D8]">
                      Value: {attr.enteredValue}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`font-semibold ${
                        attr.impact === 'increased'
                          ? 'text-[#946200]'
                          : attr.impact === 'decreased'
                          ? 'text-[#245C45]'
                          : 'text-[#607066]'
                      }`}
                    >
                      {attr.impact === 'increased' ? '+ Increased Score' : attr.impact === 'decreased' ? '- Decreased Score' : 'Neutral Influence'}
                    </span>
                    <span className="font-mono text-[#607066]">
                      ({attr.weight > 0 ? `+${attr.weight.toFixed(2)}` : attr.weight.toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Contribution bar */}
                <div className="w-full h-2 bg-[#DCE3D8] rounded-full overflow-hidden flex">
                  {attr.weight < 0 ? (
                    <div className="w-1/2 flex justify-end">
                      <div
                        className="h-full bg-[#245C45] rounded-l-full"
                        style={{ width: `${Math.min(Math.abs(attr.weight) * 200, 100)}%` }}
                      />
                    </div>
                  ) : (
                    <div className="w-1/2" />
                  )}

                  {attr.weight > 0 ? (
                    <div className="w-1/2">
                      <div
                        className="h-full bg-[#946200] rounded-r-full"
                        style={{ width: `${Math.min(attr.weight * 200, 100)}%` }}
                      />
                    </div>
                  ) : (
                    <div className="w-1/2" />
                  )}
                </div>

                <p className="text-xs text-[#607066]">
                  {attr.description}
                </p>
              </div>
            ))}
          </div>

          {/* Plain language note that model influence does not establish medical causation */}
          <div className="p-3.5 bg-[#F7F5EF] rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#245C45] shrink-0 mt-0.5" />
            <p>
              <strong>Statistical Factor Weighting:</strong> {t.results.causationDisclaimer} These contributions indicate mathematical importance inside the gradient boosting decision trees and must not be interpreted as definitive physical etiology.
            </p>
          </div>
        </div>
      )}

      {/* 6. PATIENT GUIDANCE (GENTLE SAGE-TINTED #E7EFE5 SECTION) */}
      <div className="bg-[#E7EFE5] rounded-2xl border border-[#DCE3D8] p-6 md:p-8 space-y-6 shadow-xs">
        <div className="border-b border-[#245C45]/20 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#245C45] uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>Clinical Advisory & Patient Next Steps</span>
          </div>
          <h3 className="text-2xl font-semibold text-[#183D30] tracking-tight">
            {t.results.guidanceHeading}
          </h3>
          <p className="text-xs text-[#607066] mt-1">
            {t.results.guidanceSubheading}
          </p>
        </div>

        {/* 5 Compact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Understanding This Result */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE3D8] space-y-2">
            <h4 className="font-semibold text-[#183D30] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#245C45]" />
              {t.results.guidanceCards.understanding}
            </h4>
            <p className="text-xs text-[#607066] leading-relaxed">
              This report represents experimental research analysis. A heightened model score flags areas that warrant physician inspection — it does not mean cancer is present. Many benign conditions (e.g. past infections, granulomas) generate similar statistical signals.
            </p>
          </div>

          {/* Card 2: Preparing for a Consultation */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE3D8] space-y-2">
            <h4 className="font-semibold text-[#183D30] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#245C45]" />
              {t.results.guidanceCards.consultation}
            </h4>
            <p className="text-xs text-[#607066] leading-relaxed">
              Bring your imaging scan files and this report to a licensed pulmonologist or primary physician. Note down the duration of any cough, breathing changes, personal exposure history, and family illnesses to discuss during your appointment.
            </p>
          </div>

          {/* Card 3: General Prevention Information */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE3D8] space-y-2">
            <h4 className="font-semibold text-[#183D30] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#245C45]" />
              {t.results.guidanceCards.prevention}
            </h4>
            <p className="text-xs text-[#607066] leading-relaxed">
              Smoking cessation dramatically reduces pulmonary risks regardless of age or pack-years. Minimize exposure to second-hand smoke, radon, and industrial dusts. Annual influenza and pneumococcal immunizations protect compromised airways.
            </p>
          </div>

          {/* Card 4: When to Seek Medical Help */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE3D8] space-y-2">
            <h4 className="font-semibold text-[#183D30] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#946200]" />
              {t.results.guidanceCards.whenToSeek}
            </h4>
            <p className="text-xs text-[#607066] leading-relaxed">
              Seek prompt medical care if you experience: coughing up blood (hemoptysis), unexplained weight loss, persistent chest pain that worsens with deep breathing, or sudden escalation in breathlessness.
            </p>
          </div>

          {/* Card 5: Trusted Resources */}
          <div className="bg-white rounded-xl p-5 border border-[#DCE3D8] space-y-2 md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold text-[#183D30] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#245C45]" />
              {t.results.guidanceCards.trustedResources}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-[#607066]">
              <div className="flex items-center gap-1.5 hover:text-[#183D30]">
                <ExternalLink className="w-3.5 h-3.5 text-[#245C45]" />
                <span className="font-medium">American Thoracic Society (ATS) Patient Education</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-[#183D30]">
                <ExternalLink className="w-3.5 h-3.5 text-[#245C45]" />
                <span className="font-medium">USPSTF Lung Cancer Screening Guidelines 2026</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-[#183D30]">
                <ExternalLink className="w-3.5 h-3.5 text-[#245C45]" />
                <span className="font-medium">Fleischner Society Pulmonary Nodule Recommendations</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-[#183D30]">
                <ExternalLink className="w-3.5 h-3.5 text-[#245C45]" />
                <span className="font-medium">Smokefree.gov Cessation Support Pathways</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. SUPPORTING DETAILS (EXPANDABLE ACCORDIONS) */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-4 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
        <h3 className="text-xl font-semibold text-[#183D30] border-b border-[#DCE3D8] pb-3">
          {t.results.supportingDetails}
        </h3>

        {/* Section A: Submitted Patient Inputs */}
        <div className="border border-[#DCE3D8] rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('inputs')}
            className="w-full px-4 py-3 bg-[#F7F5EF] flex items-center justify-between text-left text-sm font-semibold text-[#183D30] hover:bg-[#E7EFE5] transition-colors"
          >
            <span>{t.results.submittedInputs}</span>
            {expandedSection.inputs ? <ChevronUp className="w-4 h-4 text-[#607066]" /> : <ChevronDown className="w-4 h-4 text-[#607066]" />}
          </button>
          {expandedSection.inputs && (
            <div className="p-4 bg-white text-xs divide-y divide-[#DCE3D8]/60">
              {assessment.patientData ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
                  <div>
                    <span className="text-[#607066] block">Patient ID:</span>
                    <span className="font-semibold font-mono text-[#24352B]">{assessment.patientData.patientId}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Age / Sex:</span>
                    <span className="font-semibold text-[#24352B]">{assessment.patientData.age} yrs / {assessment.patientData.gender}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Smoking Status:</span>
                    <span className="font-semibold text-[#24352B]">{assessment.patientData.smokingStatus} ({assessment.patientData.smokingPackYears} pack-years)</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Cough Duration:</span>
                    <span className="font-semibold text-[#24352B]">{assessment.patientData.coughDurationMonths} months</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">mMRC Dyspnea Scale:</span>
                    <span className="font-semibold text-[#24352B]">Grade {assessment.patientData.shortnessOfBreathScale}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">COPD History:</span>
                    <span className="font-semibold text-[#24352B]">{assessment.patientData.copdHistory ? 'Positive' : 'Negative'}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Asbestos / Silica:</span>
                    <span className="font-semibold text-[#24352B]">{assessment.patientData.occupationalDustAsbestos ? 'Positive' : 'Negative'}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Hemoptysis:</span>
                    <span className="font-semibold text-[#24352B]">{assessment.patientData.hemoptysis ? 'Yes (Reported)' : 'No'}</span>
                  </div>
                </div>
              ) : (
                <div className="py-2 text-[#607066]">Patient tabular questionnaire omitted for this assessment.</div>
              )}
            </div>
          )}
        </div>

        {/* Section B: Uploaded Image Details */}
        <div className="border border-[#DCE3D8] rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('imageParams')}
            className="w-full px-4 py-3 bg-[#F7F5EF] flex items-center justify-between text-left text-sm font-semibold text-[#183D30] hover:bg-[#E7EFE5] transition-colors"
          >
            <span>{t.results.imageParameters}</span>
            {expandedSection.imageParams ? <ChevronUp className="w-4 h-4 text-[#607066]" /> : <ChevronDown className="w-4 h-4 text-[#607066]" />}
          </button>
          {expandedSection.imageParams && (
            <div className="p-4 bg-white text-xs">
              {assessment.imageData ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[#607066] block">File Name:</span>
                    <span className="font-mono font-semibold text-[#24352B] truncate block">{assessment.imageData.fileName}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Modality:</span>
                    <span className="font-semibold text-[#24352B]">{assessment.imageData.modality}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Matrix Resolution:</span>
                    <span className="font-semibold text-[#24352B]">{assessment.imageData.resolution}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Slice Thickness:</span>
                    <span className="font-semibold text-[#24352B]">{assessment.imageData.sliceThickness || '1.25 mm'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#607066] block">DICOM Series UID:</span>
                    <span className="font-mono text-[#24352B] break-all">{assessment.imageData.seriesUid}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#607066] block">Acquisition Timestamp:</span>
                    <span className="font-mono text-[#24352B]">{assessment.imageData.acquisitionDate}</span>
                  </div>
                </div>
              ) : (
                <div className="text-[#607066]">Thoracic imaging payload omitted for this assessment.</div>
              )}
            </div>
          )}
        </div>

        {/* Section C: Model Information and Limitations */}
        <div className="border border-[#DCE3D8] rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('limitations')}
            className="w-full px-4 py-3 bg-[#F7F5EF] flex items-center justify-between text-left text-sm font-semibold text-[#183D30] hover:bg-[#E7EFE5] transition-colors"
          >
            <span>{t.results.modelLimitations}</span>
            {expandedSection.limitations ? <ChevronUp className="w-4 h-4 text-[#607066]" /> : <ChevronDown className="w-4 h-4 text-[#607066]" />}
          </button>
          {expandedSection.limitations && (
            <div className="p-4 bg-white text-xs space-y-3">
              <div>
                <strong className="text-[#183D30] block mb-0.5">Clinical Tabular Model (v1.4.2):</strong>
                <p className="text-[#607066]">{assessment.patientModel.limitations}</p>
              </div>
              <div>
                <strong className="text-[#183D30] block mb-0.5">Computer Vision Model (v2.1.0):</strong>
                <p className="text-[#607066]">{assessment.imageModel.limitations}</p>
              </div>
              <div className="p-3 bg-[#F7F5EF] rounded-lg text-[#607066]">
                <strong>Regulatory Classification:</strong> This software is an investigational decision-support prototype. It has not received FDA 510(k) or CE mark clearance for primary autonomous diagnostic use.
              </div>
            </div>
          )}
        </div>

        {/* Section D: Reviewer Notes */}
        <div className="border border-[#DCE3D8] rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('reviewerNotes')}
            className="w-full px-4 py-3 bg-[#F7F5EF] flex items-center justify-between text-left text-sm font-semibold text-[#183D30] hover:bg-[#E7EFE5] transition-colors"
          >
            <span>{t.results.reviewerNotes}</span>
            {expandedSection.reviewerNotes ? <ChevronUp className="w-4 h-4 text-[#607066]" /> : <ChevronDown className="w-4 h-4 text-[#607066]" />}
          </button>
          {expandedSection.reviewerNotes && (
            <div className="p-4 bg-white text-xs space-y-3">
              {assessment.reviewRecord.clinicalNotes ? (
                <div className="p-3 bg-[#E7EFE5]/40 rounded-xl border border-[#DCE3D8] space-y-2">
                  <div className="flex items-center justify-between text-[#607066]">
                    <span className="font-semibold text-[#183D30]">
                      Reviewer: {assessment.reviewRecord.reviewerName} ({assessment.reviewRecord.reviewerRole})
                    </span>
                    <span className="font-mono">{assessment.reviewRecord.reviewedAt}</span>
                  </div>
                  <p className="text-[#24352B] leading-relaxed">
                    {assessment.reviewRecord.clinicalNotes}
                  </p>
                  {assessment.reviewRecord.recommendation && (
                    <div className="text-xs font-semibold text-[#245C45] pt-1">
                      Clinical Recommendation: {assessment.reviewRecord.recommendation}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[#607066] py-2 flex items-center justify-between">
                  <span>No physician notes logged yet. Assessment is pending formal review.</span>
                  {(userRole === 'reviewer' || userRole === 'admin') && (
                    <button
                      onClick={() => onSubmitReviewModal(assessment)}
                      className="px-3 py-1.5 rounded-lg bg-[#245C45] text-white text-xs font-semibold hover:bg-[#183D30]"
                    >
                      Add Medical Note
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section E: Assessment Version History */}
        <div className="border border-[#DCE3D8] rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('versionHistory')}
            className="w-full px-4 py-3 bg-[#F7F5EF] flex items-center justify-between text-left text-sm font-semibold text-[#183D30] hover:bg-[#E7EFE5] transition-colors"
          >
            <span>{t.results.versionHistory}</span>
            {expandedSection.versionHistory ? <ChevronUp className="w-4 h-4 text-[#607066]" /> : <ChevronDown className="w-4 h-4 text-[#607066]" />}
          </button>
          {expandedSection.versionHistory && (
            <div className="p-4 bg-white text-xs space-y-2">
              {assessment.versionHistory.map((ver, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-[#DCE3D8]/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#183D30]">{ver.version}</span>
                    <span className="text-[#24352B]">{ver.changes}</span>
                  </div>
                  <div className="text-[#607066] font-mono text-[11px]">
                    {ver.author} · {ver.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 8. ACTIONS BOTTOM BAR */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onDownloadReport(assessment)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCE3D8] bg-white text-xs md:text-sm font-semibold text-[#24352B] hover:bg-[#F7F5EF] transition-colors shadow-xs"
          >
            <FileDown className="w-4 h-4 text-[#245C45]" />
            <span>Download PDF Report</span>
          </button>

          <button
            onClick={onViewHistory}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCE3D8] bg-white text-xs md:text-sm font-semibold text-[#24352B] hover:bg-[#F7F5EF] transition-colors"
          >
            <HistoryIcon className="w-4 h-4 text-[#245C45]" />
            <span>{t.results.viewHistory}</span>
          </button>

          <button
            onClick={() => onEditAndReassess(assessment)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCE3D8] bg-white text-xs md:text-sm font-semibold text-[#24352B] hover:bg-[#F7F5EF] transition-colors"
          >
            <Edit3 className="w-4 h-4 text-[#245C45]" />
            <span>{t.results.editInputs}</span>
          </button>
        </div>

        {/* Submit for Review Button (Authorized for Reviewers or Researchers submitting) */}
        <div className="w-full sm:w-auto">
          <button
            onClick={() => onSubmitReviewModal(assessment)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#245C45] text-white text-xs md:text-sm font-semibold hover:bg-[#183D30] transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>
              {userRole === 'reviewer' || userRole === 'admin' 
                ? 'Sign Off / Add Clinical Review' 
                : t.results.submitReview}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
