import React, { useState } from 'react';
import { Menu, Globe, User, Shield, ChevronDown, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { UserRole } from './Sidebar';

interface TopBarProps {
  pageTitle: string;
  lang: Language;
  setLang: (lang: Language) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenMobileMenu: () => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  pageTitle,
  lang,
  setLang,
  userRole,
  setUserRole,
  onOpenMobileMenu,
  isDemoMode,
  setIsDemoMode,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const t = translations[lang];

  return (
    <header className="h-16 bg-white border-b border-[#DCE3D8] px-4 md:px-8 flex items-center justify-between z-20 shrink-0">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open navigation drawer"
          className="md:hidden p-2 rounded-lg text-[#24352B] hover:bg-[#F7F5EF] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-[#183D30] tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Demo mode flag, Language Selector, and Profile Menu */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Demo Mode Toggle Button */}
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          title="Toggle Demo Mode"
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isDemoMode
              ? 'bg-[#E7EFE5] text-[#183D30] border-[#245C45]/30'
              : 'bg-white text-[#607066] border-[#DCE3D8] hover:text-[#24352B]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-[#245C45]' : 'bg-gray-400'}`} />
          <span>Demo Data</span>
        </button>

        {/* Language Selector (English / Tamil) */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            aria-label="Select Language"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#DCE3D8] text-sm font-medium text-[#24352B] hover:bg-[#F7F5EF] transition-colors"
          >
            <Globe className="w-4 h-4 text-[#245C45]" />
            <span className="hidden sm:inline">{lang === 'en' ? 'English' : 'தமிழ்'}</span>
            <span className="sm:hidden">{lang === 'en' ? 'EN' : 'TA'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#607066]" />
          </button>

          {langMenuOpen && (
            <div 
              className="absolute right-0 mt-1 w-36 bg-white border border-[#DCE3D8] rounded-xl shadow-lg py-1 z-30"
              onMouseLeave={() => setLangMenuOpen(false)}
            >
              <button
                onClick={() => { setLang('en'); setLangMenuOpen(false); }}
                className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-[#F7F5EF] ${
                  lang === 'en' ? 'font-semibold text-[#183D30]' : 'text-[#24352B]'
                }`}
              >
                <span>English</span>
                {lang === 'en' && <Check className="w-4 h-4 text-[#245C45]" />}
              </button>
              <button
                onClick={() => { setLang('ta'); setLangMenuOpen(false); }}
                className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-[#F7F5EF] ${
                  lang === 'ta' ? 'font-semibold text-[#183D30]' : 'text-[#24352B]'
                }`}
              >
                <span>தமிழ்</span>
                {lang === 'ta' && <Check className="w-4 h-4 text-[#245C45]" />}
              </button>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-1.5 md:px-3 md:py-1.5 rounded-xl border border-[#DCE3D8] hover:bg-[#F7F5EF] transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-[#245C45] text-white flex items-center justify-center text-xs font-semibold">
              {userRole === 'reviewer' ? 'AR' : userRole === 'admin' ? 'KS' : 'NL'}
            </div>
            <div className="hidden lg:block text-left text-xs">
              <span className="font-semibold text-[#24352B] block leading-none">
                {userRole === 'reviewer' ? 'Dr. Rao' : userRole === 'admin' ? 'Prof. Sundaram' : 'N. Lakshman'}
              </span>
              <span className="text-[#607066] uppercase text-[10px]">
                {userRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#607066] hidden sm:block" />
          </button>

          {profileMenuOpen && (
            <div 
              className="absolute right-0 mt-1 w-56 bg-white border border-[#DCE3D8] rounded-xl shadow-lg py-2 z-30 text-sm"
              onMouseLeave={() => setProfileMenuOpen(false)}
            >
              <div className="px-3 py-2 border-b border-[#DCE3D8]">
                <p className="font-semibold text-[#24352B]">
                  {userRole === 'reviewer' ? 'Dr. Ananya Rao' : userRole === 'admin' ? 'Prof. K. Sundaram' : 'N. Lakshman'}
                </p>
                <p className="text-xs text-[#607066]">
                  {userRole === 'reviewer' ? 'Thoracic Radiology (Authorized)' : userRole === 'admin' ? 'Principal Investigator' : 'Clinical Research Fellow'}
                </p>
              </div>

              <div className="px-3 py-2">
                <span className="text-xs font-medium text-[#607066] block mb-1">Switch View Role:</span>
                <button
                  onClick={() => { setUserRole('researcher'); setProfileMenuOpen(false); }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                    userRole === 'researcher' ? 'bg-[#E7EFE5] font-semibold text-[#183D30]' : 'hover:bg-[#F7F5EF] text-[#24352B]'
                  }`}
                >
                  Clinical Researcher
                </button>
                <button
                  onClick={() => { setUserRole('reviewer'); setProfileMenuOpen(false); }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                    userRole === 'reviewer' ? 'bg-[#E7EFE5] font-semibold text-[#183D30]' : 'hover:bg-[#F7F5EF] text-[#24352B]'
                  }`}
                >
                  Medical Reviewer (MD)
                </button>
                <button
                  onClick={() => { setUserRole('admin'); setProfileMenuOpen(false); }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                    userRole === 'admin' ? 'bg-[#E7EFE5] font-semibold text-[#183D30]' : 'hover:bg-[#F7F5EF] text-[#24352B]'
                  }`}
                >
                  Admin / Lead PI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
