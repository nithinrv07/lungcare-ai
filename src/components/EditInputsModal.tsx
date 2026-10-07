import React, { useState } from 'react';
import { X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Assessment, PatientData } from '../types/assessment';
import { Language, translations } from '../utils/translations';

interface EditInputsModalProps {
  assessment: Assessment;
  onClose: () => void;
  onSaveNewVersion: (updatedAssessment: Assessment) => void;
  lang: Language;
}

export const EditInputsModal: React.FC<EditInputsModalProps> = ({
  assessment,
  onClose,
  onSaveNewVersion,
  lang,
}) => {
  const [age, setAge] = useState<number>(assessment.patientData?.age || 60);
  const [packYears, setPackYears] = useState<number>(assessment.patientData?.smokingPackYears || 20);
  const [coughDuration, setCoughDuration] = useState<number>(assessment.patientData?.coughDurationMonths || 0);
  const [breathScale, setBreathScale] = useState<number>(assessment.patientData?.shortnessOfBreathScale || 0);
  const [copdHistory, setCopdHistory] = useState<boolean>(assessment.patientData?.copdHistory || false);
  const [occupationalExposure, setOccupationalExposure] = useState<boolean>(assessment.patientData?.occupationalDustAsbestos || false);
  const [hemoptysis, setHemoptysis] = useState<boolean>(assessment.patientData?.hemoptysis || false);
  const [reasonForEdit, setReasonForEdit] = useState<string>('Corrected smoking pack-years and occupational history after secondary patient intake.');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine new version string (e.g. v1.0 -> v1.1)
    const currentVer = parseFloat(assessment.version.replace('v', '')) || 1.0;
    const newVer = `v${(currentVer + 0.1).toFixed(1)}`;

    // Recompute calibrated score
    let newScore = 0.55;
    if (packYears > 30) newScore += 0.15;
    if (copdHistory) newScore += 0.08;
    if (occupationalExposure) newScore += 0.07;
    if (hemoptysis) newScore += 0.1;

    const updatedPatientData: PatientData | undefined = assessment.patientData ? {
      ...assessment.patientData,
      age,
      smokingPackYears: packYears,
      coughDurationMonths: coughDuration,
      shortnessOfBreathScale: breathScale,
      copdHistory,
      occupationalDustAsbestos: occupationalExposure,
      hemoptysis,
    } : undefined;

    const updatedAssessment: Assessment = {
      ...assessment,
      version: newVer,
      patientData: updatedPatientData,
      patientModel: {
        ...assessment.patientModel,
        score: Math.min(Number(newScore.toFixed(2)), 0.99),
        predictedClass: newScore > 0.65 ? 'Elevated Risk Tier' : newScore > 0.35 ? 'Moderate Clinical Attention Tier' : 'Low Baseline Risk Tier',
        explanation: `Reassessed with updated clinical parameters: ${packYears} pack-years, cough duration ${coughDuration} mos, occupational exposure ${occupationalExposure ? 'Yes' : 'No'}.`,
        featureAttributions: assessment.patientModel.featureAttributions?.map(attr => {
          if (attr.feature.includes('Smoking Pack-Years')) {
            return {
              ...attr,
              enteredValue: `${packYears} pack-years`,
              weight: packYears > 20 ? 0.36 : 0.1,
            };
          }
          return attr;
        })
      },
      reviewRecord: {
        ...assessment.reviewRecord,
        status: 'pending_review', // reset to pending review on new version
      },
      statusBanner: {
        type: 'completed_pending_review',
        title: `Analysis updated (${newVer}) — pending medical review`,
        description: 'New model inference generated from revised patient variables. Requires renewed clinical verification.',
      },
      versionHistory: [
        ...assessment.versionHistory,
        {
          version: newVer,
          date: new Date().toLocaleString(),
          changes: `Inputs modified: ${reasonForEdit}`,
          author: 'Clinical Researcher',
        }
      ]
    };

    onSaveNewVersion(updatedAssessment);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DCE3D8] w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-[#DCE3D8] flex items-center justify-between bg-[#F7F5EF]">
          <div>
            <h3 className="font-semibold text-[#183D30] text-base">
              Edit Inputs & Create New Assessment Version
            </h3>
            <p className="text-xs text-[#607066]">
              Current: {assessment.version} → New Version will be created
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-[#607066] hover:text-[#24352B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-[#E7EFE5] rounded-xl border border-[#DCE3D8] text-[11px] text-[#183D30]">
            <strong>Version Control Policy:</strong> Editing patient inputs automatically branches a new version (e.g. v1.1) to preserve audit trails. Medical review status will reset to pending.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#24352B] mb-1">Age (years):</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#24352B] mb-1">Smoking Pack-Years:</label>
              <input
                type="number"
                value={packYears}
                onChange={(e) => setPackYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#24352B] mb-1">Cough Duration (months):</label>
              <input
                type="number"
                value={coughDuration}
                onChange={(e) => setCoughDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#24352B] mb-1">mMRC Dyspnea Scale (0-4):</label>
              <input
                type="number"
                min={0}
                max={4}
                value={breathScale}
                onChange={(e) => setBreathScale(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 font-medium text-[#24352B]">
              <input
                type="checkbox"
                checked={copdHistory}
                onChange={(e) => setCopdHistory(e.target.checked)}
                className="rounded text-[#245C45]"
              />
              <span>History of Chronic Obstructive Pulmonary Disease (COPD)</span>
            </label>
            <label className="flex items-center gap-2 font-medium text-[#24352B]">
              <input
                type="checkbox"
                checked={occupationalExposure}
                onChange={(e) => setOccupationalExposure(e.target.checked)}
                className="rounded text-[#245C45]"
              />
              <span>Occupational Asbestos or Mineral Dust Exposure</span>
            </label>
            <label className="flex items-center gap-2 font-medium text-[#24352B]">
              <input
                type="checkbox"
                checked={hemoptysis}
                onChange={(e) => setHemoptysis(e.target.checked)}
                className="rounded text-[#245C45]"
              />
              <span>Episode of Hemoptysis (Coughing blood)</span>
            </label>
          </div>

          <div>
            <label className="block font-semibold text-[#24352B] mb-1">
              Audit Note / Reason for Revision:
            </label>
            <textarea
              rows={2}
              value={reasonForEdit}
              onChange={(e) => setReasonForEdit(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#DCE3D8] text-xs text-[#24352B] focus:outline-none focus:border-[#245C45]"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#DCE3D8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DCE3D8] text-xs font-medium text-[#607066]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#245C45] text-white text-xs font-semibold hover:bg-[#183D30]"
            >
              Reassess & Save Version
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
