import React, { useState } from 'react';
import { 
  Check, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Layers, 
  AlertCircle, 
  Save, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  RefreshCw, 
  Info,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Assessment, AssessmentMode, PatientData, ImageData } from '../types/assessment';
import { Language, translations } from '../utils/translations';

interface NewAssessmentViewProps {
  onAssessmentCreated: (newAssessment: Assessment) => void;
  onCancel: () => void;
  lang: Language;
}

export const NewAssessmentView: React.FC<NewAssessmentViewProps> = ({
  onAssessmentCreated,
  onCancel,
  lang,
}) => {
  const t = translations[lang];

  // Wizard Step: 1 = Mode, 2 = Inputs, 3 = Review, 4 = Analyzing
  const [step, setStep] = useState<number>(1);
  const [mode, setMode] = useState<AssessmentMode>('both');

  // Form State
  const [patientId, setPatientId] = useState<string>('PT-91042');
  const [age, setAge] = useState<number>(62);
  const [gender, setGender] = useState<'female' | 'male' | 'other'>('male');
  const [smokingStatus, setSmokingStatus] = useState<'current' | 'former' | 'never'>('current');
  const [packYears, setPackYears] = useState<number>(32);
  const [coughDuration, setCoughDuration] = useState<number>(5);
  const [breathScale, setBreathScale] = useState<number>(2);
  const [copdHistory, setCopdHistory] = useState<boolean>(true);
  const [familyCancer, setFamilyCancer] = useState<boolean>(false);
  const [occupationalExposure, setOccupationalExposure] = useState<boolean>(true);
  const [hemoptysis, setHemoptysis] = useState<boolean>(false);
  const [clinicalNotes, setClinicalNotes] = useState<string>('Evaluation for chronic productive cough in high-risk occupational worker.');

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUri, setImagePreviewUri] = useState<string>(
    '/src/assets/images/chest_ct_scan_axial_1791324003541.jpg'
  );
  const [imageModality, setImageModality] = useState<'Axial High-Resolution Chest CT' | 'Posteroanterior Chest Radiograph (CXR)'>(
    'Axial High-Resolution Chest CT'
  );
  const [imageFileName, setImageFileName] = useState<string>('CHEST_CT_AXIAL_512_SL14.dcm');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveDraftMessage, setSaveDraftMessage] = useState<string>('');

  // Analysis simulation progress
  const [pipelineProgress, setPipelineProgress] = useState<number>(0);
  const [pipelineStatusText, setPipelineStatusText] = useState<string>('');

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (mode === 'both' || mode === 'patient_only') {
      if (!patientId.trim()) newErrors.patientId = 'Patient identifier is required.';
      if (age < 18 || age > 110) newErrors.age = 'Age must be between 18 and 110.';
      if (packYears < 0) newErrors.packYears = 'Pack-years cannot be negative.';
      if (coughDuration < 0) newErrors.coughDuration = 'Cough duration cannot be negative.';
    }
    if (mode === 'both' || mode === 'image_only') {
      if (!imagePreviewUri) {
        newErrors.image = 'A thoracic imaging file must be uploaded or selected for this mode.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    } else if (step === 3) {
      runAnalysisPipeline();
    }
  };

  const handlePrevStep = () => {
    if (step > 1 && step < 4) {
      setStep(step - 1);
    }
  };

  const handleSaveDraft = () => {
    const draftData = {
      mode,
      patientId,
      age,
      gender,
      smokingStatus,
      packYears,
      coughDuration,
      breathScale,
      copdHistory,
      familyCancer,
      occupationalExposure,
      hemoptysis,
      clinicalNotes,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('lungcare_draft', JSON.stringify(draftData));
      setSaveDraftMessage('Draft saved locally. You can resume this session anytime.');
      setTimeout(() => setSaveDraftMessage(''), 4000);
    } catch (e) {
      setSaveDraftMessage('Saved to session memory.');
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processUploadedFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const processUploadedFile = (file: File) => {
    setImageFile(file);
    setImageFileName(file.name);
    // Create local object URL for preview
    const url = URL.createObjectURL(file);
    setImagePreviewUri(url);
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUri('');
    setImageFileName('');
  };

  const handleLoadSampleScan = () => {
    setImageFile(null);
    setImagePreviewUri('/src/assets/images/chest_ct_scan_axial_1791324003541.jpg');
    setImageFileName('SAMPLE_AXIAL_CHEST_CT_1.25MM.dcm');
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const runAnalysisPipeline = () => {
    setStep(4);
    setPipelineProgress(15);
    setPipelineStatusText('Standardizing input tensors & validating DICOM coordinate matrices...');

    setTimeout(() => {
      setPipelineProgress(45);
      setPipelineStatusText(
        mode === 'image_only'
          ? 'Running volumetric thoracic nodule segmentation (Model v2.1)...'
          : 'Extracting SHAP feature attributions from clinical parameters (Model v1.4)...'
      );
    }, 700);

    setTimeout(() => {
      setPipelineProgress(78);
      setPipelineStatusText(
        mode === 'both'
          ? 'Running dual-model inference: Computer vision encoder & Tabular risk predictor...'
          : 'Calibrating prediction probability distributions against validation baseline...'
      );
    }, 1400);

    setTimeout(() => {
      setPipelineProgress(100);
      setPipelineStatusText('Inference complete. Synthesizing explainability overlays and clinical audit trail...');

      setTimeout(() => {
        // Construct new assessment
        const newId = `LCA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const patientDataObj: PatientData | undefined =
          mode === 'both' || mode === 'patient_only'
            ? {
                patientId,
                age,
                gender,
                smokingStatus,
                smokingPackYears: packYears,
                coughDurationMonths: coughDuration,
                shortnessOfBreathScale: breathScale,
                copdHistory,
                familyLungCancer: familyCancer,
                occupationalDustAsbestos: occupationalExposure,
                hemoptysis,
                notes: clinicalNotes,
              }
            : undefined;

        const imageDataObj: ImageData | undefined =
          mode === 'both' || mode === 'image_only'
            ? {
                modality: imageModality,
                fileName: imageFileName || 'CHEST_CT_AXIAL_PT91042.dcm',
                fileSize: imageFile ? `${(imageFile.size / (1024 * 1024)).toFixed(1)} MB` : '14.2 MB',
                resolution: '512 × 512 px',
                sliceThickness: '1.25 mm',
                imageUri: imagePreviewUri || '/src/assets/images/chest_ct_scan_axial_1791324003541.jpg',
                attributionMapUri: 'gradcam_active',
                seriesUid: `1.2.840.113619.2.55.3.${Math.floor(1000000 + Math.random() * 9000000)}`,
                acquisitionDate: '2026-10-06 14:30 EDT',
              }
            : undefined;

        // Realistic clinical score computation
        let calculatedPatientScore = 0.68;
        if (packYears > 30) calculatedPatientScore += 0.08;
        if (copdHistory) calculatedPatientScore += 0.04;
        if (coughDuration > 6) calculatedPatientScore += 0.04;
        if (smokingStatus === 'never') calculatedPatientScore = 0.16;

        const patientModelOutput = {
          name: 'Clinical Tabular Risk Predictor',
          version: 'v1.4.2',
          status: (mode === 'both' || mode === 'patient_only' ? 'available' : 'not_included') as any,
          predictedClass:
            mode === 'image_only'
              ? 'Not Evaluated'
              : calculatedPatientScore > 0.65
              ? 'Elevated Risk Tier'
              : calculatedPatientScore > 0.35
              ? 'Moderate Clinical Attention Tier'
              : 'Low Baseline Risk Tier',
          score: mode === 'image_only' ? null : Number(calculatedPatientScore.toFixed(2)),
          scoreLabel: 'Model Likelihood Index',
          explanation:
            mode === 'image_only'
              ? 'Patient questionnaire was not included in this image-only run.'
              : `Clinical weighting reflects ${packYears} pack-year smoking history, ${age}-year age profile, and ${coughDuration}-month cough symptom report.`,
          limitations: 'Trained on NLST & UK Biobank cohorts. Predictive performance may vary in atypical populations.',
          featureAttributions:
            mode !== 'image_only'
              ? [
                  {
                    feature: `Smoking Pack-Years (${packYears} yrs)`,
                    enteredValue: `${packYears} pack-years`,
                    impact: (packYears > 15 ? 'increased' : 'decreased') as 'increased' | 'decreased' | 'neutral',
                    weight: packYears > 15 ? 0.34 : -0.25,
                    description: 'Cumulative tobacco consumption factor in statistical cohort.',
                  },
                  {
                    feature: `Age (${age} years)`,
                    enteredValue: `${age} years`,
                    impact: (age > 55 ? 'increased' : 'decreased') as 'increased' | 'decreased' | 'neutral',
                    weight: age > 55 ? 0.21 : -0.18,
                    description: 'Age demographic alignment within thoracic research cohort.',
                  },
                  {
                    feature: 'Occupational Particulate / Asbestos',
                    enteredValue: occupationalExposure ? 'Reported' : 'None',
                    impact: (occupationalExposure ? 'increased' : 'decreased') as 'increased' | 'decreased' | 'neutral',
                    weight: occupationalExposure ? 0.18 : -0.12,
                    description: 'Environmental exposure risk weighting.',
                  },
                  {
                    feature: `Cough Duration (${coughDuration} mos)`,
                    enteredValue: `${coughDuration} months`,
                    impact: (coughDuration > 2 ? 'increased' : 'neutral') as 'increased' | 'decreased' | 'neutral',
                    weight: coughDuration > 2 ? 0.12 : 0.0,
                    description: 'Symptom chronicity indicator.',
                  },
                ]
              : undefined,
        };

        const imageModelOutput = {
          name: 'Volumetric Chest CT Nodule Classifier',
          version: 'v2.1.0',
          status: (mode === 'both' || mode === 'image_only' ? 'available' : 'not_included') as any,
          predictedClass:
            mode === 'patient_only'
              ? 'Not Evaluated'
              : 'Suspicious Parenchymal Finding',
          score: mode === 'patient_only' ? null : 0.74,
          scoreLabel: 'Model Likelihood Index',
          explanation:
            mode === 'patient_only'
              ? 'Chest imaging was not included in this clinical-only run.'
              : 'Deep convolutional features flagged focal non-calcified parenchymal opacity in axial slice reconstruction.',
          limitations: 'Cannot confirm histopathology. Requires clinical correlation and radiological review.',
          hasExplanationOverlay: mode !== 'patient_only',
        };

        const createdAssessment: Assessment = {
          id: newId,
          version: 'v1.0',
          createdAt: '2026-10-06 14:48 EDT',
          mode,
          status: 'completed',
          statusBanner: {
            type: 'completed_pending_review',
            title: 'Analysis complete — pending medical review',
            description: 'Dual machine-learning analysis completed successfully. Results are ready for clinician inspection.',
          },
          patientData: patientDataObj,
          imageData: imageDataObj,
          patientModel: patientModelOutput,
          imageModel: imageModelOutput,
          reviewRecord: {
            status: 'pending_review',
            annotations: [],
          },
          versionHistory: [
            {
              version: 'v1.0',
              date: '2026-10-06 14:48 EDT',
              changes: 'New assessment run initialized via researcher portal.',
              author: 'Researcher Intake',
            },
          ],
        };

        onAssessmentCreated(createdAssessment);
      }, 500);
    }, 2200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stepper Header */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-[#183D30]">
              {t.newAssessment.title}
            </h2>
            <p className="text-xs text-[#607066]">
              Standardized research intake protocol for dual-model thoracic evaluation.
            </p>
          </div>
          {step < 4 && (
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE3D8] text-xs font-medium text-[#24352B] hover:bg-[#F7F5EF] transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-[#245C45]" />
              <span>{t.newAssessment.buttons.saveDraft}</span>
            </button>
          )}
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { num: 1, label: t.newAssessment.steps.step1 },
            { num: 2, label: t.newAssessment.steps.step2 },
            { num: 3, label: t.newAssessment.steps.step3 },
            { num: 4, label: t.newAssessment.steps.step4 },
          ].map((item) => (
            <div key={item.num} className="space-y-1.5">
              <div
                className={`h-2 rounded-full transition-all ${
                  step >= item.num ? 'bg-[#245C45]' : 'bg-[#DCE3D8]'
                }`}
              />
              <span
                className={`text-xs block truncate ${
                  step === item.num
                    ? 'font-semibold text-[#183D30]'
                    : step > item.num
                    ? 'text-[#245C45]'
                    : 'text-[#607066]'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {saveDraftMessage && (
          <div className="mt-3 p-2 bg-[#E7EFE5] rounded-lg text-xs font-medium text-[#183D30] flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#245C45]" />
            <span>{saveDraftMessage}</span>
          </div>
        )}
      </div>

      {/* STEP 1: Choose Assessment Mode */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-6 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
          <div>
            <h3 className="text-lg font-semibold text-[#183D30]">
              Step 1: Choose Assessment Input Mode
            </h3>
            <p className="text-sm text-[#607066] mt-1">
              Select which clinical modalities are available for this research evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mode 1: Both */}
            <div
              onClick={() => setMode('both')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                mode === 'both'
                  ? 'border-[#245C45] bg-[#E7EFE5]/40 shadow-sm'
                  : 'border-[#DCE3D8] hover:border-[#245C45]/50 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#245C45] text-white flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-[#183D30] text-base mb-1">
                {t.newAssessment.modes.both}
              </h4>
              <p className="text-xs text-[#607066] leading-relaxed">
                {t.newAssessment.modes.bothDesc}
              </p>
              <div className="mt-4 pt-3 border-t border-[#DCE3D8]/80 text-[11px] font-semibold text-[#245C45] flex items-center justify-between">
                <span>Both Models Active</span>
                {mode === 'both' && <CheckCircle2 className="w-4 h-4 text-[#245C45]" />}
              </div>
            </div>

            {/* Mode 2: Patient details only */}
            <div
              onClick={() => setMode('patient_only')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                mode === 'patient_only'
                  ? 'border-[#245C45] bg-[#E7EFE5]/40 shadow-sm'
                  : 'border-[#DCE3D8] hover:border-[#245C45]/50 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#245C45] border border-[#DCE3D8] flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-[#183D30] text-base mb-1">
                {t.newAssessment.modes.patientOnly}
              </h4>
              <p className="text-xs text-[#607066] leading-relaxed">
                {t.newAssessment.modes.patientOnlyDesc}
              </p>
              <div className="mt-4 pt-3 border-t border-[#DCE3D8]/80 text-[11px] font-semibold text-[#245C45] flex items-center justify-between">
                <span>Clinical Model Only</span>
                {mode === 'patient_only' && <CheckCircle2 className="w-4 h-4 text-[#245C45]" />}
              </div>
            </div>

            {/* Mode 3: Image only */}
            <div
              onClick={() => setMode('image_only')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                mode === 'image_only'
                  ? 'border-[#245C45] bg-[#E7EFE5]/40 shadow-sm'
                  : 'border-[#DCE3D8] hover:border-[#245C45]/50 bg-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#F7F5EF] text-[#245C45] border border-[#DCE3D8] flex items-center justify-center mb-3">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-[#183D30] text-base mb-1">
                {t.newAssessment.modes.imageOnly}
              </h4>
              <p className="text-xs text-[#607066] leading-relaxed">
                {t.newAssessment.modes.imageOnlyDesc}
              </p>
              <div className="mt-4 pt-3 border-t border-[#DCE3D8]/80 text-[11px] font-semibold text-[#245C45] flex items-center justify-between">
                <span>Vision Model Only</span>
                {mode === 'image_only' && <CheckCircle2 className="w-4 h-4 text-[#245C45]" />}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#DCE3D8]">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-[#607066] hover:text-[#24352B]"
            >
              Cancel
            </button>
            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#245C45] text-white text-sm font-semibold hover:bg-[#183D30] transition-colors"
            >
              <span>{t.newAssessment.buttons.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Add Patient Details and/or Image */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Patient Details Section */}
          {(mode === 'both' || mode === 'patient_only') && (
            <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-5 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
              <div className="border-b border-[#DCE3D8] pb-3">
                <h3 className="text-lg font-semibold text-[#183D30] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#245C45]" />
                  <span>Clinical Questionnaire & Patient Parameters</span>
                </h3>
                <p className="text-xs text-[#607066] mt-0.5">
                  Parameters validated against Clinical Tabular Risk Predictor v1.4 schema.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {/* Patient ID */}
                <div>
                  <label className="block text-xs font-semibold text-[#24352B] mb-1">
                    {t.newAssessment.patientFields.patientId} *
                  </label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] bg-[#F7F5EF]/50 text-[#24352B] font-mono text-sm focus:outline-none focus:border-[#245C45]"
                    placeholder="e.g. PT-91042"
                  />
                  {errors.patientId && <span className="text-xs text-red-600 block mt-1">{errors.patientId}</span>}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-[#24352B] mb-1">
                    {t.newAssessment.patientFields.age} (years) *
                  </label>
                  <input
                    type="number"
                    value={age}
                    min={18}
                    max={110}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] bg-[#F7F5EF]/50 text-[#24352B] font-mono text-sm focus:outline-none focus:border-[#245C45]"
                  />
                  {errors.age && <span className="text-xs text-red-600 block mt-1">{errors.age}</span>}
                </div>

                {/* Biological Sex */}
                <div>
                  <label className="block text-xs font-semibold text-[#24352B] mb-1">
                    {t.newAssessment.patientFields.gender}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] bg-[#F7F5EF]/50 text-[#24352B] text-sm focus:outline-none focus:border-[#245C45]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Not Specified</option>
                  </select>
                </div>

                {/* Smoking Status */}
                <div>
                  <label className="block text-xs font-semibold text-[#24352B] mb-1">
                    {t.newAssessment.patientFields.smokingStatus}
                  </label>
                  <select
                    value={smokingStatus}
                    onChange={(e) => setSmokingStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] bg-[#F7F5EF]/50 text-[#24352B] text-sm focus:outline-none focus:border-[#245C45]"
                  >
                    <option value="current">Current Smoker</option>
                    <option value="former">Former Smoker (Quit &gt; 1 yr)</option>
                    <option value="never">Never Smoked (&lt; 100 cigarettes)</option>
                  </select>
                </div>

                {/* Smoking Pack-Years */}
                <div>
                  <label className="block text-xs font-semibold text-[#24352B] mb-1">
                    {t.newAssessment.patientFields.packYears} (pack-years)
                  </label>
                  <input
                    type="number"
                    value={packYears}
                    min={0}
                    disabled={smokingStatus === 'never'}
                    onChange={(e) => setPackYears(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] bg-[#F7F5EF]/50 text-[#24352B] font-mono text-sm focus:outline-none focus:border-[#245C45] disabled:opacity-50"
                  />
                  <p className="text-[11px] text-[#607066] mt-0.5">
                    {t.newAssessment.patientFields.packYearsHelp}
                  </p>
                </div>

                {/* Cough Duration */}
                <div>
                  <label className="block text-xs font-semibold text-[#24352B] mb-1">
                    {t.newAssessment.patientFields.coughDuration}
                  </label>
                  <input
                    type="number"
                    value={coughDuration}
                    min={0}
                    onChange={(e) => setCoughDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] bg-[#F7F5EF]/50 text-[#24352B] font-mono text-sm focus:outline-none focus:border-[#245C45]"
                  />
                  <p className="text-[11px] text-[#607066] mt-0.5">
                    {t.newAssessment.patientFields.coughHelp}
                  </p>
                </div>

                {/* Breathlessness mMRC scale */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#24352B] mb-1">
                    {t.newAssessment.patientFields.breathScale}
                  </label>
                  <select
                    value={breathScale}
                    onChange={(e) => setBreathScale(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] bg-[#F7F5EF]/50 text-[#24352B] text-sm focus:outline-none focus:border-[#245C45]"
                  >
                    <option value={0}>0 — Breathless only with strenuous exercise</option>
                    <option value={1}>1 — Short of breath when hurrying on the level or walking up slight hill</option>
                    <option value={2}>2 — Walks slower than peers due to breathlessness or stops for breath</option>
                    <option value={3}>3 — Stops for breath after walking ~100m or after a few minutes on level</option>
                    <option value={4}>4 — Too breathless to leave the house or breathless when dressing/undressing</option>
                  </select>
                </div>

                {/* Clinical checkboxes */}
                <div className="sm:col-span-3 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#F7F5EF]/60 p-4 rounded-xl border border-[#DCE3D8]">
                  <label className="flex items-center gap-2 text-xs font-medium text-[#24352B] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={copdHistory}
                      onChange={(e) => setCopdHistory(e.target.checked)}
                      className="rounded text-[#245C45] focus:ring-[#245C45]"
                    />
                    <span>{t.newAssessment.patientFields.copd}</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-[#24352B] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={familyCancer}
                      onChange={(e) => setFamilyCancer(e.target.checked)}
                      className="rounded text-[#245C45] focus:ring-[#245C45]"
                    />
                    <span>{t.newAssessment.patientFields.familyCancer}</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-[#24352B] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={occupationalExposure}
                      onChange={(e) => setOccupationalExposure(e.target.checked)}
                      className="rounded text-[#245C45] focus:ring-[#245C45]"
                    />
                    <span>{t.newAssessment.patientFields.occupationalExposure}</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-[#24352B] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hemoptysis}
                      onChange={(e) => setHemoptysis(e.target.checked)}
                      className="rounded text-[#245C45] focus:ring-[#245C45]"
                    />
                    <span>{t.newAssessment.patientFields.hemoptysis}</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Thoracic Imaging Upload Section */}
          {(mode === 'both' || mode === 'image_only') && (
            <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-5 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
              <div className="border-b border-[#DCE3D8] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-[#183D30] flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#245C45]" />
                    <span>{t.newAssessment.imageUpload.title}</span>
                  </h3>
                  <p className="text-xs text-[#607066] mt-0.5">
                    Modality required: Axial High-Resolution Chest CT (thin slice ≤ 1.5mm) or CXR PA view.
                  </p>
                </div>

                {/* Modality Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#607066] font-medium">Modality:</span>
                  <select
                    value={imageModality}
                    onChange={(e) => setImageModality(e.target.value as any)}
                    className="bg-[#F7F5EF] border border-[#DCE3D8] rounded-lg px-2.5 py-1 text-[#183D30] font-medium text-xs focus:outline-none focus:border-[#245C45]"
                  >
                    <option value="Axial High-Resolution Chest CT">Axial Chest CT (Recommended)</option>
                    <option value="Posteroanterior Chest Radiograph (CXR)">Chest Radiograph (PA CXR)</option>
                  </select>
                </div>
              </div>

              {/* Upload Drop Zone / Preview Area */}
              {imagePreviewUri ? (
                <div className="bg-[#F7F5EF] rounded-2xl border border-[#DCE3D8] p-4 flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-36 h-36 bg-black rounded-xl overflow-hidden shrink-0 border border-[#DCE3D8] shadow-sm relative group">
                    <img
                      src={imagePreviewUri}
                      alt="Uploaded thoracic scan preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                      Inspection Preview
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-left w-full">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#245C45]" />
                      <span className="text-xs font-semibold text-[#245C45] uppercase tracking-wider">
                        {t.newAssessment.imageUpload.selectedImage}
                      </span>
                    </div>
                    <div className="font-mono text-sm font-semibold text-[#183D30] break-all">
                      {imageFileName || 'CHEST_CT_AXIAL_SLICE.dcm'}
                    </div>
                    <div className="text-xs text-[#607066] flex flex-wrap gap-x-3 gap-y-1">
                      <span>Modality: {imageModality}</span>
                      <span>·</span>
                      <span>Target Matrix: 512×512</span>
                      <span>·</span>
                      <span>Bit Depth: 16-bit signed</span>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE3D8] bg-white text-xs font-semibold text-[#24352B] hover:bg-[#F7F5EF] transition-colors shadow-xs">
                        <RefreshCw className="w-3.5 h-3.5 text-[#245C45]" />
                        <span>{t.newAssessment.imageUpload.replaceImage}</span>
                        <input
                          type="file"
                          accept=".dcm,.png,.jpg,.jpeg,.dicom"
                          onChange={handleFileInput}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50/50 text-xs font-semibold text-[#B33D3D] hover:bg-red-100/60 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t.newAssessment.imageUpload.removeImage}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
                    isDragOver
                      ? 'border-[#245C45] bg-[#E7EFE5]/40'
                      : 'border-[#DCE3D8] hover:border-[#245C45]/60 bg-[#F7F5EF]/40'
                  }`}
                >
                  <input
                    type="file"
                    id="image-file-input"
                    accept=".dcm,.png,.jpg,.jpeg,.dicom"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <label htmlFor="image-file-input" className="cursor-pointer block space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#E7EFE5] text-[#245C45] flex items-center justify-center mx-auto shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#183D30]">
                        {t.newAssessment.imageUpload.dragText}
                      </p>
                      <p className="text-xs text-[#607066] mt-1">
                        DICOM (.dcm), PNG, or JPEG · Maximum 50 MB
                      </p>
                    </div>
                  </label>

                  <div className="mt-4 pt-4 border-t border-[#DCE3D8]/80 flex items-center justify-center gap-2">
                    <span className="text-xs text-[#607066]">{t.newAssessment.imageUpload.presetScans}</span>
                    <button
                      type="button"
                      onClick={handleLoadSampleScan}
                      className="text-xs font-semibold text-[#245C45] hover:underline bg-[#E7EFE5] px-2.5 py-1 rounded-md"
                    >
                      Load Sample Diagnostic CT Scan
                    </button>
                  </div>
                </div>
              )}

              {errors.image && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#B33D3D] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.image}</span>
                </div>
              )}

              {/* Modality Match Guidance Notice */}
              <div className="p-3.5 bg-[#F7F5EF] rounded-xl border border-[#DCE3D8] text-xs text-[#607066] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#245C45] shrink-0 mt-0.5" />
                <p>
                  <strong>Clinical Modality Protocol:</strong> The model is trained on thoracic CT axial slices (LIDC-IDRI standard). Please ensure thoracic cross-sections are oriented properly. Do not upload abdominal CT or microscopic histopathology slides as they are outside model validation bounds.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handlePrevStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#DCE3D8] bg-white text-sm font-medium text-[#24352B] hover:bg-[#F7F5EF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.newAssessment.buttons.back}</span>
            </button>
            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#245C45] text-white text-sm font-semibold hover:bg-[#183D30] transition-colors shadow-sm"
            >
              <span>Review Assessment Inputs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review Inputs */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-6 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
          <div className="border-b border-[#DCE3D8] pb-4">
            <h3 className="text-lg font-semibold text-[#183D30]">
              Step 3: Review Inputs Before Analysis
            </h3>
            <p className="text-xs text-[#607066] mt-0.5">
              Verify all submitted modalities. Once submitted, inputs will execute through the machine learning pipeline and generate version v1.0.
            </p>
          </div>

          <div className="space-y-4">
            {/* Input Mode Summary */}
            <div className="p-4 bg-[#F7F5EF] rounded-xl border border-[#DCE3D8] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#607066] block font-medium">Selected Mode:</span>
                <span className="text-sm font-semibold text-[#183D30]">
                  {mode === 'both' ? 'Dual-Modal (Patient Details + Thoracic CT)' : mode === 'patient_only' ? 'Patient Details Only' : 'Thoracic CT Imaging Only'}
                </span>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-[#245C45] hover:underline"
              >
                Change Mode
              </button>
            </div>

            {/* Patient details summary */}
            {(mode === 'both' || mode === 'patient_only') && (
              <div className="p-4 bg-white rounded-xl border border-[#DCE3D8] space-y-3">
                <div className="flex items-center justify-between border-b border-[#DCE3D8] pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#607066]">
                    Patient Clinical Profile
                  </span>
                  <button onClick={() => setStep(2)} className="text-xs font-semibold text-[#245C45] hover:underline">
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[#607066] block">Patient ID:</span>
                    <span className="font-mono font-semibold text-[#24352B]">{patientId}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Age & Sex:</span>
                    <span className="font-semibold text-[#24352B]">{age} yrs, {gender}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Smoking:</span>
                    <span className="font-semibold text-[#24352B]">{smokingStatus} ({packYears} pack-yrs)</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Cough Duration:</span>
                    <span className="font-semibold text-[#24352B]">{coughDuration} months</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Dyspnea Scale:</span>
                    <span className="font-semibold text-[#24352B]">mMRC Grade {breathScale}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">COPD History:</span>
                    <span className="font-semibold text-[#24352B]">{copdHistory ? 'Reported' : 'None'}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Asbestos Exposure:</span>
                    <span className="font-semibold text-[#24352B]">{occupationalExposure ? 'Reported' : 'None'}</span>
                  </div>
                  <div>
                    <span className="text-[#607066] block">Hemoptysis:</span>
                    <span className="font-semibold text-[#24352B]">{hemoptysis ? 'Yes (Reported)' : 'None'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Imaging summary */}
            {(mode === 'both' || mode === 'image_only') && (
              <div className="p-4 bg-white rounded-xl border border-[#DCE3D8] space-y-3">
                <div className="flex items-center justify-between border-b border-[#DCE3D8] pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#607066]">
                    Thoracic Imaging Payload
                  </span>
                  <button onClick={() => setStep(2)} className="text-xs font-semibold text-[#245C45] hover:underline">
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black rounded-lg overflow-hidden shrink-0 border border-[#DCE3D8]">
                    <img src={imagePreviewUri} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <div className="font-mono font-semibold text-[#183D30]">{imageFileName}</div>
                    <div className="text-[#607066]">Modality: {imageModality}</div>
                    <div className="text-[#607066]">Matrix: 512 × 512 px · Standard slice reconstruction</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#DCE3D8]">
            <button
              onClick={handlePrevStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#DCE3D8] bg-white text-sm font-medium text-[#24352B] hover:bg-[#F7F5EF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Edit</span>
            </button>
            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#245C45] text-white text-base font-semibold hover:bg-[#183D30] transition-colors shadow-sm"
            >
              <span>{t.newAssessment.buttons.runAnalysis}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Running Analysis Pipeline */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-[#DCE3D8] p-8 md:p-12 text-center space-y-6 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
          <div className="w-16 h-16 rounded-2xl bg-[#E7EFE5] text-[#245C45] flex items-center justify-center mx-auto animate-pulse">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-[#183D30]">
              {t.newAssessment.buttons.analyzing}
            </h3>
            <p className="text-sm text-[#607066]">
              {pipelineStatusText}
            </p>
          </div>

          {/* Real-time pipeline progress bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="h-3 bg-[#F7F5EF] border border-[#DCE3D8] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-[#245C45] rounded-full transition-all duration-300"
                style={{ width: `${pipelineProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#607066] font-mono">
              <span>Pipeline Stage {pipelineProgress < 40 ? '1/3' : pipelineProgress < 80 ? '2/3' : '3/3'}</span>
              <span>{pipelineProgress}%</span>
            </div>
          </div>

          <div className="p-4 bg-[#F7F5EF] rounded-xl border border-[#DCE3D8] max-w-md mx-auto text-xs text-[#607066] text-left">
            <div className="font-semibold text-[#183D30] mb-1">Standard Research Checklist:</div>
            <ul className="space-y-1 list-disc list-inside">
              <li>Executing feature normalization & quality verification</li>
              <li>Dual-model parallel inference pass</li>
              <li>Calculating local attribution explainability maps</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
