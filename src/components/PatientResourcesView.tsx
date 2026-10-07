import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Stethoscope, 
  CheckCircle2, 
  ExternalLink, 
  Heart, 
  FileCheck, 
  AlertCircle,
  FileQuestion,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Language, translations } from '../utils/translations';

interface PatientResourcesViewProps {
  lang: Language;
}

export const PatientResourcesView: React.FC<PatientResourcesViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 md:p-8 space-y-2 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#245C45] bg-[#E7EFE5] px-3 py-1 rounded-lg">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Patient Knowledge & Clinical Guidance Hub</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#183D30] tracking-tight">
          Pulmonary Health & Screening Guide
        </h2>
        <p className="text-sm text-[#607066] max-w-3xl leading-relaxed">
          Clinically reviewed information to help patients and families understand screening technologies, interpret research models responsibly, and formulate productive discussions with healthcare providers.
        </p>
        <div className="text-xs text-[#607066] pt-1">
          Last reviewed: <strong>October 2026</strong> by Pulmonary Advisory Panel.
        </div>
      </div>

      {/* Guide Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Low-Dose CT vs Standard X-Ray */}
        <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-3 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <div className="w-10 h-10 rounded-xl bg-[#E7EFE5] text-[#245C45] flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#183D30]">
            Low-Dose CT (LDCT) vs Chest X-Ray
          </h3>
          <p className="text-xs text-[#607066] leading-relaxed">
            Conventional chest X-rays produce two-dimensional projection images where small early nodules can be hidden behind the ribs or heart. Low-Dose Computed Tomography (LDCT) creates fine axial slices (1.0–1.5mm) using up to 80% less radiation than diagnostic CT, enabling early detection before symptoms appear.
          </p>
        </div>

        {/* Pillar 2: Understanding Screening Eligibility */}
        <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-3 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <div className="w-10 h-10 rounded-xl bg-[#E7EFE5] text-[#245C45] flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#183D30]">
            USPSTF 2026 Screening Criteria
          </h3>
          <p className="text-xs text-[#607066] leading-relaxed">
            The US Preventive Services Task Force recommends annual LDCT screening for adults aged <strong>50 to 80 years</strong> who have a <strong>20 pack-year smoking history</strong> and currently smoke or have quit within the past 15 years.
          </p>
        </div>

        {/* Pillar 3: Why Model Scores ≠ Cancer Diagnosis */}
        <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 space-y-3 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <div className="w-10 h-10 rounded-xl bg-[#E7EFE5] text-[#245C45] flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#183D30]">
            Why AI Models Are Not Diagnoses
          </h3>
          <p className="text-xs text-[#607066] leading-relaxed">
            Computational models recognize numerical patterns in pixel densities and questionnaire weights. Over 90% of lung nodules identified on screening CT scans turn out to be harmless, non-cancerous scars or benign granulomas. Only a biopsy and clinical follow-up can confirm pathology.
          </p>
        </div>
      </div>

      {/* Questions to Ask Your Doctor */}
      <div className="bg-[#E7EFE5] rounded-2xl border border-[#DCE3D8] p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-[#245C45]" />
          <h3 className="text-lg font-semibold text-[#183D30]">
            Checklist: Questions to Ask During Your Medical Consultation
          </h3>
        </div>
        <p className="text-xs text-[#607066]">
          Take this list to your primary care physician or pulmonology visit:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {[
            "Does my smoking or occupational history qualify me for low-dose CT screening under national guidelines?",
            "If a nodule was noted on my CT, what is its size, density (solid vs ground-glass), and recommended follow-up interval?",
            "Are there non-cancerous explanations (like previous chest infections or valley fever) that explain my symptoms?",
            "What structured smoking cessation programs and nicotine replacement therapies are recommended for me?",
            "At what point would additional imaging (such as contrast PET-CT) or a tissue biopsy be indicated?",
            "What respiratory symptoms should prompt an immediate urgent care or emergency room evaluation?"
          ].map((question, i) => (
            <div key={i} className="bg-white p-3.5 rounded-xl border border-[#DCE3D8] flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#E7EFE5] text-[#245C45] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-xs text-[#24352B] leading-relaxed font-medium">
                {question}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white rounded-2xl border border-[#DCE3D8] p-6 md:p-8 space-y-4 shadow-[0_2px_8px_rgba(36,92,69,0.04)]">
        <h3 className="text-xl font-semibold text-[#183D30] border-b border-[#DCE3D8] pb-3">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {[
            {
              q: "What does an 'Elevated Risk' or 'Suspicious Finding' prediction actually mean?",
              a: "It means the machine-learning model found image features (such as a round density) or historical clinical markers (such as high pack-years) that commonly occur in patients needing closer medical scrutiny. It does not mean you have a tumor. It suggests you should discuss whether a follow-up scan or specialist consult is warranted."
            },
            {
              q: "Why do the two models sometimes give different results?",
              a: "The Patient Questionnaire model evaluates epidemiological factors (your age, pack-years, and symptoms). The Imaging model evaluates a single CT cross-section. For example, a young non-smoker has low questionnaire risk, but might coincidentally have an incidental nodule on CT. When models disagree, a medical doctor reviews both to make a balanced clinical decision."
            },
            {
              q: "How does smoking pack-years calculation work?",
              a: "One pack-year equals smoking 20 cigarettes (one pack) per day for one full year. If someone smoked half a pack per day for 30 years, their score is 15 pack-years. If someone smoked two packs per day for 10 years, their score is 20 pack-years."
            },
            {
              q: "Can non-smokers develop lung abnormalities?",
              a: "Yes. While tobacco exposure is the single largest preventable factor, non-smokers can develop pulmonary nodules and lung disease due to radon gas exposure, second-hand smoke, occupational silica or asbestos, ambient particulate pollution (PM2.5), and genetic family histories."
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-[#DCE3D8] rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 bg-[#F7F5EF] flex items-center justify-between text-left text-sm font-semibold text-[#183D30] hover:bg-[#E7EFE5] transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#607066]" /> : <ChevronDown className="w-4 h-4 text-[#607066]" />}
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-white text-xs text-[#607066] leading-relaxed border-t border-[#DCE3D8]">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
