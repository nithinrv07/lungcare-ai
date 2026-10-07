import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  BookOpen, 
  ClipboardCheck, 
  Activity, 
  Settings, 
  FlaskConical,
  UserCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Language, translations } from '../utils/translations';

export type UserRole = 'researcher' | 'reviewer' | 'admin';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  pendingReviewCount: number;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  userRole,
  setUserRole,
  pendingReviewCount,
  onCloseMobile,
}) => {
  const t = translations[lang];

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const isReviewerOrAdmin = userRole === 'reviewer' || userRole === 'admin';

  return (
    <aside className="w-64 bg-white border-r border-[#DCE3D8] flex flex-col h-full shrink-0 select-none">
      {/* Brand & Lung Logo */}
      <div className="p-6 border-b border-[#DCE3D8] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#245C45] flex items-center justify-center text-white shadow-sm shrink-0">
          {/* Simple elegant lung icon SVG */}
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Trachea and Bronchi */}
            <path d="M12 2v6" />
            <path d="M12 8c-2 1.5-4 4-4 8 0 3 1.5 5 4 5s4-2 4-5c0-4-2-6.5-4-8z" strokeDasharray="1 1" opacity="0.3" />
            {/* Left Lung Lobe */}
            <path d="M11 8c-2.5 0-5 2-5 6.5 0 3.5 2.5 5.5 5 5.5" />
            {/* Right Lung Lobe */}
            <path d="M13 8c2.5 0 5 2 5 6.5 0 3.5-2.5 5.5-5 5.5" />
            {/* Central airway split */}
            <path d="M12 5.5l-2.5 2.5" />
            <path d="M12 5.5l2.5 2.5" />
          </svg>
        </div>
        <div>
          <span className="text-lg font-semibold tracking-tight text-[#183D30] block leading-tight">
            LungCare AI
          </span>
          <span className="text-xs text-[#607066] block">
            Thoracic ML Research
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {/* Core Nav Links */}
        <button
          onClick={() => handleNav('overview')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
            currentTab === 'overview'
              ? 'bg-[#E7EFE5] text-[#183D30]'
              : 'text-[#607066] hover:bg-[#F7F5EF] hover:text-[#24352B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-[#245C45]" />
            <span>{t.nav.overview}</span>
          </div>
        </button>

        <button
          onClick={() => handleNav('new-assessment')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
            currentTab === 'new-assessment'
              ? 'bg-[#E7EFE5] text-[#183D30]'
              : 'text-[#607066] hover:bg-[#F7F5EF] hover:text-[#24352B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <PlusCircle className="w-5 h-5 text-[#245C45]" />
            <span>{t.nav.newAssessment}</span>
          </div>
        </button>

        <button
          onClick={() => handleNav('history')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
            currentTab === 'history'
              ? 'bg-[#E7EFE5] text-[#183D30]'
              : 'text-[#607066] hover:bg-[#F7F5EF] hover:text-[#24352B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-[#245C45]" />
            <span>{t.nav.history}</span>
          </div>
        </button>

        <button
          onClick={() => handleNav('resources')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
            currentTab === 'resources'
              ? 'bg-[#E7EFE5] text-[#183D30]'
              : 'text-[#607066] hover:bg-[#F7F5EF] hover:text-[#24352B]'
          }`}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#245C45]" />
            <span>{t.nav.patientResources}</span>
          </div>
        </button>

        {/* Clinical Reviewer / Admin Tier Nav */}
        {isReviewerOrAdmin && (
          <>
            <div className="pt-4 pb-1 px-3">
              <span className="text-xs font-semibold text-[#607066] uppercase tracking-wider">
                Clinical Governance
              </span>
            </div>

            <button
              onClick={() => handleNav('review-queue')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                currentTab === 'review-queue'
                  ? 'bg-[#E7EFE5] text-[#183D30]'
                  : 'text-[#607066] hover:bg-[#F7F5EF] hover:text-[#24352B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardCheck className="w-5 h-5 text-[#245C45]" />
                <span>{t.nav.reviewQueue}</span>
              </div>
              {pendingReviewCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#946200]/10 text-[#946200]">
                  {pendingReviewCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNav('model-performance')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                currentTab === 'model-performance'
                  ? 'bg-[#E7EFE5] text-[#183D30]'
                  : 'text-[#607066] hover:bg-[#F7F5EF] hover:text-[#24352B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#245C45]" />
                <span>{t.nav.modelPerformance}</span>
              </div>
            </button>
          </>
        )}

        {/* Settings */}
        <div className="pt-3">
          <button
            onClick={() => handleNav('settings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
              currentTab === 'settings'
                ? 'bg-[#E7EFE5] text-[#183D30]'
                : 'text-[#607066] hover:bg-[#F7F5EF] hover:text-[#24352B]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-[#245C45]" />
              <span>{t.nav.settings}</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Role Switcher & User Profile */}
      <div className="p-4 border-t border-[#DCE3D8] space-y-3">
        {/* Role toggle for prototype demonstration */}
        <div className="bg-[#F7F5EF] p-2.5 rounded-xl border border-[#DCE3D8]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#607066]">Current Role:</span>
            <span className="text-xs font-mono font-medium text-[#183D30] uppercase">
              {userRole}
            </span>
          </div>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="w-full text-xs bg-white border border-[#DCE3D8] rounded-lg px-2 py-1.5 text-[#24352B] focus:outline-none focus:border-[#245C45]"
          >
            <option value="researcher">Clinical Researcher</option>
            <option value="reviewer">Medical Reviewer (MD)</option>
            <option value="admin">Principal Investigator / Admin</option>
          </select>
        </div>

        {/* User identification */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E7EFE5] text-[#183D30] font-semibold flex items-center justify-center text-sm border border-[#DCE3D8]">
            {userRole === 'reviewer' ? 'AR' : userRole === 'admin' ? 'KS' : 'NL'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#24352B] truncate">
              {userRole === 'reviewer' 
                ? 'Dr. Ananya Rao' 
                : userRole === 'admin' 
                ? 'Prof. K. Sundaram' 
                : 'N. Lakshman, MSc'}
            </p>
            <p className="text-xs text-[#607066] truncate">
              {userRole === 'reviewer' 
                ? 'Thoracic Radiologist' 
                : userRole === 'admin' 
                ? 'Lead Investigator' 
                : 'Research Fellow'}
            </p>
          </div>
        </div>

        {/* Discreet Research Prototype Label */}
        <div className="pt-1 flex items-center gap-1.5 text-xs text-[#607066]">
          <FlaskConical className="w-3.5 h-3.5 text-[#245C45] shrink-0" />
          <span className="font-medium">Research prototype</span>
          <span className="text-[#607066]/60">·</span>
          <span>v2.4-eval</span>
        </div>
      </div>
    </aside>
  );
};
