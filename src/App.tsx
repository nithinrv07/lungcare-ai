/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, UserRole } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { LiveAssessmentView } from './components/LiveAssessmentView';
import { ResultsView } from './components/ResultsView';
import { HistoryView } from './components/HistoryView';
import { PatientResourcesView } from './components/PatientResourcesView';
import { ReviewQueueView } from './components/ReviewQueueView';
import { ModelPerformanceView } from './components/ModelPerformanceView';
import { SettingsView } from './components/SettingsView';
import { ReportModal } from './components/ReportModal';
import { ReviewModal } from './components/ReviewModal';
import { EditInputsModal } from './components/EditInputsModal';
import { INITIAL_ASSESSMENTS } from './data/sampleAssessments';
import { Assessment } from './types/assessment';
import { Language, translations } from './utils/translations';
import { X } from 'lucide-react';

export default function App() {
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    try {
      const saved = localStorage.getItem('lungcare_assessments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    return INITIAL_ASSESSMENTS;
  });

  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('LCA-2026-0842');
  const [lang, setLang] = useState<Language>('en');
  const [userRole, setUserRole] = useState<UserRole>('researcher');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Modals state
  const [reportModalAssessment, setReportModalAssessment] = useState<Assessment | null>(null);
  const [reviewModalAssessment, setReviewModalAssessment] = useState<Assessment | null>(null);
  const [editModalAssessment, setEditModalAssessment] = useState<Assessment | null>(null);

  // Persist assessments
  useEffect(() => {
    try {
      localStorage.setItem('lungcare_assessments', JSON.stringify(assessments));
    } catch (e) {
      // Ignore
    }
  }, [assessments]);

  // Selected assessment object
  const activeAssessment = assessments.find(a => a.id === selectedAssessmentId) || assessments[0];

  const handleSelectAssessment = (id: string) => {
    setSelectedAssessmentId(id);
    setCurrentTab('results');
  };

  const handleAssessmentCreated = (newAssessment: Assessment) => {
    setAssessments(prev => [newAssessment, ...prev]);
    setSelectedAssessmentId(newAssessment.id);
    setCurrentTab('results');
  };

  const handleSaveReview = (updated: Assessment) => {
    setAssessments(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    setReviewModalAssessment(null);
  };

  const handleSaveNewVersion = (updated: Assessment) => {
    setAssessments(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    setEditModalAssessment(null);
    setSelectedAssessmentId(updated.id);
  };

  const handleResetSampleData = () => {
    setAssessments(INITIAL_ASSESSMENTS);
    setSelectedAssessmentId('LCA-2026-0842');
    localStorage.removeItem('lungcare_assessments');
  };

  const pendingCount = assessments.filter(a => a.reviewRecord.status === 'pending_review').length;
  const t = translations[lang];

  const getPageTitle = () => {
    switch (currentTab) {
      case 'overview': return t.nav.overview;
      case 'new-assessment': return t.nav.newAssessment;
      case 'results': return t.results.title;
      case 'history': return t.nav.history;
      case 'resources': return t.nav.patientResources;
      case 'review-queue': return t.nav.reviewQueue;
      case 'model-performance': return t.nav.modelPerformance;
      case 'settings': return t.nav.settings;
      default: return 'LungCare AI';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F5EF] text-[#24352B]">
      {/* Desktop Sidebar (approx 240px-256px wide) */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          lang={lang}
          userRole={userRole}
          setUserRole={setUserRole}
          pendingReviewCount={pendingCount}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white z-10 shadow-2xl flex flex-col">
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#607066] hover:bg-[#F7F5EF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={(tab) => {
                setCurrentTab(tab);
                setMobileMenuOpen(false);
              }}
              lang={lang}
              userRole={userRole}
              setUserRole={setUserRole}
              pendingReviewCount={pendingCount}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <TopBar
          pageTitle={getPageTitle()}
          lang={lang}
          setLang={setLang}
          userRole={userRole}
          setUserRole={setUserRole}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          isDemoMode={currentTab === 'new-assessment' ? false : isDemoMode}
          setIsDemoMode={setIsDemoMode}
        />

        {/* Scrollable Main Stage */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8">
          {currentTab === 'overview' && (
            <OverviewView
              assessments={assessments}
              onSelectAssessment={handleSelectAssessment}
              onStartNewAssessment={() => setCurrentTab('new-assessment')}
              lang={lang}
            />
          )}

          {currentTab === 'new-assessment' && (
            <LiveAssessmentView />

          )}

          {currentTab === 'results' && activeAssessment && (
            <ResultsView
              assessment={activeAssessment}
              onNewAssessment={() => setCurrentTab('new-assessment')}
              onViewHistory={() => setCurrentTab('history')}
              onEditAndReassess={(a) => setEditModalAssessment(a)}
              onSubmitReviewModal={(a) => setReviewModalAssessment(a)}
              onDownloadReport={(a) => setReportModalAssessment(a)}
              userRole={userRole}
              lang={lang}
            />
          )}

          {currentTab === 'history' && (
            <HistoryView
              assessments={assessments}
              onSelectAssessment={handleSelectAssessment}
              lang={lang}
            />
          )}

          {currentTab === 'resources' && (
            <PatientResourcesView lang={lang} />
          )}

          {currentTab === 'review-queue' && (
            <ReviewQueueView
              assessments={assessments}
              onSelectAssessment={handleSelectAssessment}
              onOpenReviewModal={(a) => setReviewModalAssessment(a)}
              lang={lang}
            />
          )}

          {currentTab === 'model-performance' && (
            <ModelPerformanceView lang={lang} />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              lang={lang}
              setLang={setLang}
              userRole={userRole}
              setUserRole={setUserRole}
              isDemoMode={isDemoMode}
              setIsDemoMode={setIsDemoMode}
              onResetSampleData={handleResetSampleData}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {reportModalAssessment && (
        <ReportModal
          assessment={reportModalAssessment}
          onClose={() => setReportModalAssessment(null)}
          lang={lang}
        />
      )}

      {reviewModalAssessment && (
        <ReviewModal
          assessment={reviewModalAssessment}
          onClose={() => setReviewModalAssessment(null)}
          onSaveReview={handleSaveReview}
          userRole={userRole}
          lang={lang}
        />
      )}

      {editModalAssessment && (
        <EditInputsModal
          assessment={editModalAssessment}
          onClose={() => setEditModalAssessment(null)}
          onSaveNewVersion={handleSaveNewVersion}
          lang={lang}
        />
      )}
    </div>
  );
}
