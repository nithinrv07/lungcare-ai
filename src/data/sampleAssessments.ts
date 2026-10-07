import { Assessment } from '../types/assessment';

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: "LCA-2026-0842",
    version: "v1.0",
    createdAt: "2026-10-06 11:24 EDT",
    mode: "both",
    status: "completed",
    statusBanner: {
      type: "completed_pending_review",
      title: "Analysis complete — pending medical review",
      description: "Dual model inference finished successfully. Outputs indicate areas for clinical attention. Formal pulmonology review is currently pending."
    },
    patientData: {
      patientId: "PT-84210",
      age: 64,
      gender: "male",
      smokingStatus: "current",
      smokingPackYears: 36,
      coughDurationMonths: 7,
      shortnessOfBreathScale: 2,
      copdHistory: true,
      familyLungCancer: false,
      occupationalDustAsbestos: true,
      hemoptysis: false,
      notes: "Referred from occupational screening clinic following subacute productive cough."
    },
    imageData: {
      modality: "Axial High-Resolution Chest CT",
      fileName: "CHEST_CT_AXIAL_PT84210_SER04_SL18.dcm",
      fileSize: "14.2 MB",
      resolution: "512 × 512 px",
      sliceThickness: "1.25 mm",
      imageUri: "/src/assets/images/chest_ct_scan_axial_1791324003541.jpg",
      attributionMapUri: "gradcam_active",
      seriesUid: "1.2.840.113619.2.55.3.2831164",
      acquisitionDate: "2026-10-05 14:15 EDT"
    },
    patientModel: {
      name: "Clinical Tabular Risk Predictor",
      version: "v1.4.2",
      status: "available",
      predictedClass: "Elevated Risk Tier",
      score: 0.73,
      scoreLabel: "Model Likelihood Index",
      explanation: "Significant clinical weighting driven by 36 pack-year smoking history, persistent 7-month cough duration, and known asbestos particulate exposure.",
      limitations: "Trained on NLST & UK Biobank cohorts (n=48,200). Predictive performance may vary in patients with active interstitial lung disease.",
      featureAttributions: [
        {
          feature: "Smoking Pack-Years (36 yrs)",
          enteredValue: "36 pack-years",
          impact: "increased",
          weight: 0.38,
          description: "Elevated cumulative exposure index contributes strongest positive weight to risk classification."
        },
        {
          feature: "Age (64 years)",
          enteredValue: "64 years",
          impact: "increased",
          weight: 0.22,
          description: "Patient age falls within the higher-incidence demographic bracket for pulmonary abnormalities."
        },
        {
          feature: "Occupational Asbestos Exposure",
          enteredValue: "Present",
          impact: "increased",
          weight: 0.19,
          description: "Synergistic risk factor combined with tobacco consumption according to epidemiologic weights."
        },
        {
          feature: "Persistent Cough Duration (7 mos)",
          enteredValue: "7 months",
          impact: "increased",
          weight: 0.14,
          description: "Subacute to chronic presentation increases probability score slightly."
        },
        {
          feature: "Absence of Hemoptysis",
          enteredValue: "Absent",
          impact: "decreased",
          weight: -0.11,
          description: "Lack of frank hemoptysis moderates acute risk index calculation."
        },
        {
          feature: "Absence of Family History",
          enteredValue: "Absent",
          impact: "decreased",
          weight: -0.09,
          description: "No direct first-degree relative genetic predisposition reported."
        }
      ]
    },
    imageModel: {
      name: "Volumetric Chest CT Nodule Classifier",
      version: "v2.1.0",
      status: "available",
      predictedClass: "Suspicious Parenchymal Finding",
      score: 0.78,
      scoreLabel: "Model Likelihood Index",
      explanation: "Computer vision backbone detected focal non-calcified solid attenuation with irregular margins in the right upper lobe zone.",
      limitations: "Trained on LIDC-IDRI and internal thoracic CT sets. Cannot differentiate benign inflammatory granulomas from malignant lesions without longitudinal follow-up.",
      hasExplanationOverlay: true
    },
    reviewRecord: {
      status: "pending_review",
      clinicalNotes: "",
      recommendation: undefined,
      annotations: []
    },
    versionHistory: [
      {
        version: "v1.0",
        date: "2026-10-06 11:24 EDT",
        changes: "Initial assessment execution with multi-modal inputs.",
        author: "System Pipeline (Ingestion)"
      }
    ]
  },
  {
    id: "LCA-2026-0791",
    version: "v1.0",
    createdAt: "2026-10-05 16:40 EDT",
    mode: "both",
    status: "disagreement",
    statusBanner: {
      type: "model_disagreement",
      title: "Models returned different results — review required",
      description: "Clinical questionnaire model evaluated low-risk profile, whereas high-resolution CT imaging flagged an unexpected focal nodule. Specialist medical review is essential."
    },
    patientData: {
      patientId: "PT-79104",
      age: 48,
      gender: "female",
      smokingStatus: "never",
      smokingPackYears: 0,
      coughDurationMonths: 0,
      shortnessOfBreathScale: 0,
      copdHistory: false,
      familyLungCancer: false,
      occupationalDustAsbestos: false,
      hemoptysis: false,
      notes: "Incidental finding on pre-operative spinal clearance CT scan."
    },
    imageData: {
      modality: "Axial High-Resolution Chest CT",
      fileName: "CT_CHEST_INCIDENTAL_PT79104.dcm",
      fileSize: "13.8 MB",
      resolution: "512 × 512 px",
      sliceThickness: "1.0 mm",
      imageUri: "/src/assets/images/chest_ct_scan_axial_1791324003541.jpg",
      attributionMapUri: "gradcam_active",
      seriesUid: "1.2.840.113619.2.55.3.1904221",
      acquisitionDate: "2026-10-05 09:30 EDT"
    },
    patientModel: {
      name: "Clinical Tabular Risk Predictor",
      version: "v1.4.2",
      status: "available",
      predictedClass: "Low Baseline Risk Tier",
      score: 0.18,
      scoreLabel: "Model Likelihood Index",
      explanation: "Absence of tobacco use, young age (48), and complete lack of pulmonary symptoms result in low epidemiological baseline score.",
      limitations: "Clinical model relies on self-reported risk factors; non-smoker adenocarcinoma risks can be underestimated.",
      featureAttributions: [
        {
          feature: "Never Smoker (0 pack-years)",
          enteredValue: "0 pack-years",
          impact: "decreased",
          weight: -0.42,
          description: "Zero tobacco exposure significantly lowers baseline statistical risk tier."
        },
        {
          feature: "Age (48 years)",
          enteredValue: "48 years",
          impact: "decreased",
          weight: -0.24,
          description: "Sub-50 age bracket correlates with lower general incidence in clinical cohort data."
        },
        {
          feature: "No Respiratory Symptoms",
          enteredValue: "None reported",
          impact: "decreased",
          weight: -0.19,
          description: "Absence of cough or dyspnea contributes negatively to clinical risk prediction."
        }
      ]
    },
    imageModel: {
      name: "Volumetric Chest CT Nodule Classifier",
      version: "v2.1.0",
      status: "available",
      predictedClass: "Suspicious Parenchymal Finding",
      score: 0.82,
      scoreLabel: "Model Likelihood Index",
      explanation: "Visual encoder flagged a 7.2mm subsolid ground-glass opacity with internal vascular distortion in the left lower lobe.",
      limitations: "Subsolid opacities can represent focal infection or organizing pneumonia. Histological or follow-up CT verification required.",
      hasExplanationOverlay: true
    },
    reviewRecord: {
      reviewerName: "Dr. Ananya Rao, MD",
      reviewerRole: "Thoracic Radiologist",
      reviewedAt: "2026-10-05 18:15 EDT",
      status: "discrepancy_flagged",
      clinicalNotes: "Confirmed focal ground-glass lesion in left lower lobe measuring approx 7.4mm. Given never-smoker status, differential includes persistent focal inflammation vs early atypical adenomatous hyperplasia. Recommend repeat low-dose thin-section CT in 3 months per Fleischner Society guidelines.",
      recommendation: "Follow-up CT in 3 months",
      annotations: [
        {
          id: "ann-1",
          x: 68,
          y: 42,
          text: "Focal ground-glass attenuation 7.4mm. Recommend thin-section reassessment.",
          date: "2026-10-05"
        }
      ]
    },
    versionHistory: [
      {
        version: "v1.0",
        date: "2026-10-05 16:40 EDT",
        changes: "Initial assessment execution.",
        author: "System Pipeline (Ingestion)"
      }
    ]
  },
  {
    id: "LCA-2026-0640",
    version: "v1.0",
    createdAt: "2026-10-04 10:15 EDT",
    mode: "image_only",
    status: "completed",
    statusBanner: {
      type: "completed_pending_review",
      title: "Analysis complete — pending medical review",
      description: "Image-only inference completed. Patient clinical history was not requested for this protocol run."
    },
    imageData: {
      modality: "Axial High-Resolution Chest CT",
      fileName: "CHEST_CT_ANON_SLICE22.dcm",
      fileSize: "12.4 MB",
      resolution: "512 × 512 px",
      sliceThickness: "1.5 mm",
      imageUri: "/src/assets/images/chest_ct_scan_axial_1791324003541.jpg",
      attributionMapUri: "gradcam_active",
      seriesUid: "1.2.840.113619.2.55.3.8812903",
      acquisitionDate: "2026-10-04 09:00 EDT"
    },
    patientModel: {
      name: "Clinical Tabular Risk Predictor",
      version: "v1.4.2",
      status: "not_included",
      predictedClass: "Not Evaluated",
      score: null,
      scoreLabel: "Model Likelihood Index",
      explanation: "Patient tabular questionnaire was omitted for this image-only assessment run.",
      limitations: "Clinical model disabled."
    },
    imageModel: {
      name: "Volumetric Chest CT Nodule Classifier",
      version: "v2.1.0",
      status: "available",
      predictedClass: "Benign / Low Suspicion Morphology",
      score: 0.22,
      scoreLabel: "Model Likelihood Index",
      explanation: "Symmetrical lung parenchyma without focal non-calcified nodular opacities exceeding 4mm threshold.",
      limitations: "Trained on standard axial reconstruction algorithms.",
      hasExplanationOverlay: true
    },
    reviewRecord: {
      reviewerName: "Dr. K. Sundaram, MD",
      reviewerRole: "Consultant Pulmonologist",
      reviewedAt: "2026-10-04 14:30 EDT",
      status: "completed",
      clinicalNotes: "Normal bilateral lung volumes. No dominant pulmonary nodules, pleural effusion, or lymphadenopathy identified.",
      recommendation: "Routine Annual Screen",
      annotations: []
    },
    versionHistory: [
      {
        version: "v1.0",
        date: "2026-10-04 10:15 EDT",
        changes: "Image-only research protocol run.",
        author: "Protocol Coordinator"
      }
    ]
  },
  {
    id: "LCA-2026-0518",
    version: "v1.0",
    createdAt: "2026-10-03 14:02 EDT",
    mode: "patient_only",
    status: "completed",
    statusBanner: {
      type: "completed_pending_review",
      title: "Analysis complete — pending medical review",
      description: "Patient questionnaire analysis completed. Thoracic imaging was not submitted for this community triage run."
    },
    patientData: {
      patientId: "PT-51882",
      age: 58,
      gender: "female",
      smokingStatus: "former",
      smokingPackYears: 22,
      coughDurationMonths: 2,
      shortnessOfBreathScale: 1,
      copdHistory: false,
      familyLungCancer: true,
      occupationalDustAsbestos: false,
      hemoptysis: false,
      notes: "Community screening intake."
    },
    patientModel: {
      name: "Clinical Tabular Risk Predictor",
      version: "v1.4.2",
      status: "available",
      predictedClass: "Moderate Clinical Attention Tier",
      score: 0.49,
      scoreLabel: "Model Likelihood Index",
      explanation: "Moderate risk probability based on former 22 pack-year smoking history, maternal lung cancer history, and mild exertion dyspnea.",
      limitations: "Clinical risk prediction does not confirm or exclude anatomical nodules without dedicated low-dose CT screening.",
      featureAttributions: [
        {
          feature: "Family History of Lung Malignancy",
          enteredValue: "First-degree relative",
          impact: "increased",
          weight: 0.28,
          description: "Elevated genetic risk weighting according to family pedigree factors."
        },
        {
          feature: "Former Smoker (22 pack-years)",
          enteredValue: "Quit 6 yrs ago",
          impact: "increased",
          weight: 0.21,
          description: "Prior tobacco exposure sustains residual risk over baseline non-smoker levels."
        },
        {
          feature: "Age (58 years)",
          enteredValue: "58 years",
          impact: "increased",
          weight: 0.12,
          description: "Eligible for standard USPSTF lung screening evaluation."
        },
        {
          feature: "Absence of Asbestos Exposure",
          enteredValue: "None",
          impact: "decreased",
          weight: -0.15,
          description: "No compounding environmental toxin exposure noted."
        }
      ]
    },
    imageModel: {
      name: "Volumetric Chest CT Nodule Classifier",
      version: "v2.1.0",
      status: "not_included",
      predictedClass: "Not Evaluated",
      score: null,
      scoreLabel: "Model Likelihood Index",
      explanation: "Chest imaging was not uploaded for this clinical questionnaire assessment run.",
      limitations: "Image model disabled."
    },
    reviewRecord: {
      status: "pending_review",
      clinicalNotes: "",
      annotations: []
    },
    versionHistory: [
      {
        version: "v1.0",
        date: "2026-10-03 14:02 EDT",
        changes: "Patient-data only questionnaire assessment.",
        author: "Community Health Nurse"
      }
    ]
  },
  {
    id: "LCA-2026-0309",
    version: "v1.0",
    createdAt: "2026-10-01 08:50 EDT",
    mode: "both",
    status: "inconclusive",
    statusBanner: {
      type: "inconclusive",
      title: "Inconclusive assessment — image artifact detected",
      description: "Severe respiratory motion artifact degraded the signal-to-noise ratio in the uploaded CT volume. The model cannot provide a reliable evaluation."
    },
    patientData: {
      patientId: "PT-30911",
      age: 71,
      gender: "male",
      smokingStatus: "current",
      smokingPackYears: 45,
      coughDurationMonths: 4,
      shortnessOfBreathScale: 3,
      copdHistory: true,
      familyLungCancer: false,
      occupationalDustAsbestos: false,
      hemoptysis: true,
      notes: "Severe dyspnea during acquisition caused breath-hold failure."
    },
    imageData: {
      modality: "Axial High-Resolution Chest CT",
      fileName: "CHEST_CT_MOTION_ARTIFACT.dcm",
      fileSize: "8.1 MB",
      resolution: "512 × 512 px",
      sliceThickness: "2.5 mm",
      imageUri: "/src/assets/images/chest_ct_scan_axial_1791324003541.jpg",
      seriesUid: "1.2.840.113619.2.55.3.3091104",
      acquisitionDate: "2026-10-01 08:30 EDT"
    },
    patientModel: {
      name: "Clinical Tabular Risk Predictor",
      version: "v1.4.2",
      status: "available",
      predictedClass: "High Clinical Risk Tier",
      score: 0.84,
      scoreLabel: "Model Likelihood Index",
      explanation: "Severe clinical indicators: 45 pack-year smoking history, hemoptysis episode, and grade 3 dyspnea warrant urgent evaluation.",
      limitations: "Clinical model indicates high urgency irrespective of imaging artifact."
    },
    imageModel: {
      name: "Volumetric Chest CT Nodule Classifier",
      version: "v2.1.0",
      status: "inconclusive",
      predictedClass: "Inconclusive / Artifact Degradation",
      score: null,
      scoreLabel: "Model Likelihood Index",
      explanation: "Quality check rejected scan: Motion blur coefficient exceeds 0.42 threshold. Reliable parenchymal segmentation cannot be performed.",
      limitations: "Re-scan with optimized breath-hold protocol required.",
      hasExplanationOverlay: false
    },
    reviewRecord: {
      reviewerName: "Dr. Ananya Rao, MD",
      reviewerRole: "Thoracic Radiologist",
      reviewedAt: "2026-10-01 10:10 EDT",
      status: "completed",
      clinicalNotes: "Scan non-diagnostic due to motion artifact. Given hemoptysis and 45-pack-year history, patient requires urgent clinical review and repeat diagnostic CT with coaching for breath-hold.",
      recommendation: "Urgent Pulmonology Referral",
      annotations: []
    },
    versionHistory: [
      {
        version: "v1.0",
        date: "2026-10-01 08:50 EDT",
        changes: "Initial assessment execution flagged for non-diagnostic image.",
        author: "Automated QA Gate"
      }
    ]
  }
];
