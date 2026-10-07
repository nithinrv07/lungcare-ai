import React from 'react';
import { Settings, Shield, Globe, Database, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { UserRole } from './Sidebar';

interface SettingsViewProps {
  lang: Language;
  setLang: (lang: Language) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  onResetSampleData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  lang,
  setLang,
  userRole,
  setUserRole,
  isDemoMode,
  setIsDemoMode,
  onResetSampleData,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-1 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <h2 className="text-2xl font-semibold text-[#183D30]">
          Application Settings & Protocol Preferences
        </h2>
        <p className="text-xs text-[#607066]">
          Configure research environment, active user privileges, localization, and data integrity modes.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        {/* Language Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE3D8]">
          <div>
            <h3 className="text-sm font-semibold text-[#183D30] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#245C45]" />
              <span>Language & Clinical Terminology</span>
            </h3>
            <p className="text-xs text-[#607066] mt-0.5">
              Select primary language for patient guidance, instructions, and report generation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                lang === 'en'
                  ? 'bg-[#E7EFE5] text-[#183D30] border-[#245C45]'
                  : 'bg-white text-[#607066] border-[#DCE3D8] hover:text-[#24352B]'
              }`}
            >
              English (US)
            </button>
            <button
              onClick={() => setLang('ta')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                lang === 'ta'
                  ? 'bg-[#E7EFE5] text-[#183D30] border-[#245C45]'
                  : 'bg-white text-[#607066] border-[#DCE3D8] hover:text-[#24352B]'
              }`}
            >
              தமிழ் (Tamil)
            </button>
          </div>
        </div>

        {/* User Role & Permissions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE3D8]">
          <div>
            <h3 className="text-sm font-semibold text-[#183D30] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#245C45]" />
              <span>User Role & Clinical Authorization</span>
            </h3>
            <p className="text-xs text-[#607066] mt-0.5">
              Review Queue and Model Performance panels are accessible to authorized reviewers and administrators.
            </p>
          </div>
          <div>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="text-xs bg-[#F7F5EF] border border-[#DCE3D8] rounded-xl px-3 py-2 text-[#24352B] font-medium focus:outline-none focus:border-[#245C45]"
            >
              <option value="researcher">Clinical Researcher</option>
              <option value="reviewer">Medical Reviewer (MD)</option>
              <option value="admin">Principal Investigator / Admin</option>
            </select>
          </div>
        </div>

        {/* Demo Mode & Sample Data */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DCE3D8]">
          <div>
            <h3 className="text-sm font-semibold text-[#183D30] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#245C45]" />
              <span>Demo Mode Isolation</span>
            </h3>
            <p className="text-xs text-[#607066] mt-0.5">
              Isolates simulated test data from live research registries to maintain clinical integrity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                isDemoMode
                  ? 'bg-[#E7EFE5] text-[#183D30] border-[#245C45]'
                  : 'bg-white text-[#607066] border-[#DCE3D8]'
              }`}
            >
              {isDemoMode ? 'Demo Mode Active' : 'Production Mode'}
            </button>
            <button
              onClick={onResetSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#DCE3D8] text-[#24352B] hover:bg-[#F7F5EF] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#245C45]" />
              <span>Reset Samples</span>
            </button>
          </div>
        </div>

        {/* Research Specifications */}
        <div className="p-4 bg-[#F7F5EF] rounded-xl border border-[#DCE3D8] space-y-2 text-xs text-[#607066]">
          <span className="font-semibold text-[#183D30] block">System Pipeline Specifications:</span>
          <div>Model 1: Clinical Tabular Gradient Booster (v1.4.2) · Trained on NLST/UK Biobank</div>
          <div>Model 2: Volumetric Chest CT Convolutional Classifier (v2.1.0) · Trained on LIDC-IDRI</div>
          <div>Explainability: Integrated SHAP Values & High-Resolution Grad-CAM Feature Attribution</div>
        </div>
      </div>
    </div>
  );
};
