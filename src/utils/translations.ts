export type AppLanguage = 'en' | 'hi' | 'mr';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  welcomeExecutive: string;
  portalSubtitle: string;
  locationDelhi: string;
  searchPlaceholder: string;
  exportReport: string;
  incidentAlerts: string;
  pendingCases: string;
  noRecordsFound: string;
  
  // Tabs
  tabDashboard: string;
  tabDashboardSub: string;
  tabMaps: string;
  tabMapsSub: string;
  tabGrievances: string;
  tabGrievancesSub: string;
  tabPredictive: string;
  tabPredictiveSub: string;
  tabWhatsAppBot: string;
  tabWhatsAppBotSub: string;
  
  // Dashboard & Metrics
  nationalOverview: string;
  deepDiveGis: string;
  slaResolutionRate: string;
  targetMet: string;
  statutoryCompliance: string;
  citizenRedressals: string;
  highVolume: string;
  quarterGrowth: string;
  viewRegistry: string;
  todaysActionPlan: string;
  activeTasks: string;
  takeAction: string;
  impact: string;
  
  // WhatsApp Bot
  whatsappBotTitle: string;
  whatsappBotSubtitle: string;
  lodgeGrievance: string;
  trackGrievance: string;
  typeMessage: string;
  send: string;
  voiceNoteSimulation: string;
  liveSyncWithCpgrams: string;
  
  // Filters & Common
  filterAll: string;
  statusUnderReview: string;
  statusInvestigation: string;
  statusActionTaken: string;
  statusResolved: string;
  statusAppealed: string;
  criticalRisk: string;
  
  // Time Horizon
  timeHorizon: string;
  horizon30d: string;
  horizon90d: string;
  horizon6m: string;
  horizon1y: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    appTitle: 'CPGRAMS AI',
    appSubtitle: 'Executive Grievance Co-pilot',
    welcomeExecutive: 'Welcome back, Apex Executive!',
    portalSubtitle: 'DARPG Centralised Public Grievance Redress and Monitoring System',
    locationDelhi: '28.6139° N, 77.2090° E • New Delhi Secretariat',
    searchPlaceholder: 'Search grievance registration ID, citizen, district...',
    exportReport: 'Export Briefing',
    incidentAlerts: 'SLA Incident Alerts',
    pendingCases: 'Pending',
    noRecordsFound: 'No grievance records found.',
    
    tabDashboard: 'Dashboard',
    tabDashboardSub: 'Overview & Key Metrics',
    tabMaps: 'Geospatial Map',
    tabMapsSub: 'Districts & SLA Zones',
    tabGrievances: 'Grievance Directory',
    tabGrievancesSub: 'Citizen Cases & Redressal',
    tabPredictive: 'AI & Time Horizon',
    tabPredictiveSub: 'Surge Forecasts & Trends',
    tabWhatsAppBot: 'WhatsApp AI Bot',
    tabWhatsAppBotSub: 'Citizen Intake & Lodging',
    
    nationalOverview: 'National Overview',
    deepDiveGis: 'Deep-dive GIS',
    slaResolutionRate: 'SLA Resolution Rate',
    targetMet: 'Target Met',
    statutoryCompliance: 'Target >85% statutory compliance achieved across 15 hubs',
    citizenRedressals: 'Citizen Redressals Completed',
    highVolume: 'High Volume',
    quarterGrowth: '+12.4% vs last quarter',
    viewRegistry: 'View Registry →',
    todaysActionPlan: "Today's Action Plan",
    activeTasks: 'Tasks',
    takeAction: 'Take Action',
    impact: 'Impact',
    
    whatsappBotTitle: 'CPGRAMS AI WhatsApp Bot Assistant',
    whatsappBotSubtitle: 'Citizen multi-lingual grievance lodging, voice note NLP triage, and automatic DARPG docket registration.',
    lodgeGrievance: 'Lodge New Grievance',
    trackGrievance: 'Track Existing Docket',
    typeMessage: 'Type message or grievance in English / Hindi / Marathi...',
    send: 'Send',
    voiceNoteSimulation: 'Simulate Voice Note',
    liveSyncWithCpgrams: 'Live Sync with CPGRAMS Portal',
    
    filterAll: 'All Cases',
    statusUnderReview: 'Under Review',
    statusInvestigation: 'Investigation',
    statusActionTaken: 'Action Taken',
    statusResolved: 'Resolved',
    statusAppealed: 'Appealed',
    criticalRisk: 'Critical Risk',
    
    timeHorizon: 'Time Horizon Range',
    horizon30d: '30 Days Horizon',
    horizon90d: '90 Days (Quarterly)',
    horizon6m: '6 Months (Bi-Annual)',
    horizon1y: '1 Year (Annual Cycle)',
  },
  hi: {
    appTitle: 'सीपीजीआरएएमएस एआई',
    appSubtitle: 'शीर्ष शिकायत निवारण सह-पायलट',
    welcomeExecutive: 'स्वागत है, शीर्ष अधिकारी!',
    portalSubtitle: 'डीएआरपीजी केंद्रीकृत लोक शिकायत निवारण और निगरानी प्रणाली',
    locationDelhi: '28.6139° उत्तर, 77.2090° पूर्व • नई दिल्ली सचिवालय',
    searchPlaceholder: 'शिकायत पंजीकरण संख्या, नागरिक, जिला खोजें...',
    exportReport: 'ब्रीफिंग निर्यात करें',
    incidentAlerts: 'एसएलए उल्लंघन सूचनाएं',
    pendingCases: 'लंबित',
    noRecordsFound: 'कोई शिकायत रिकॉर्ड नहीं मिला।',
    
    tabDashboard: 'डैशबोर्ड',
    tabDashboardSub: 'राष्ट्रीय अवलोकन और मुख्य मेट्रिक्स',
    tabMaps: 'भू-स्थानिक मानचित्र',
    tabMapsSub: 'जिला एवं एसएलए क्षेत्र',
    tabGrievances: 'शिकायत निर्देशिका',
    tabGrievancesSub: 'नागरिक मामले एवं निवारण',
    tabPredictive: 'एआई एवं समय सीमा',
    tabPredictiveSub: 'पूर्वानुमान एवं रुझान',
    tabWhatsAppBot: 'व्हाट्सएप एआई बॉट',
    tabWhatsAppBotSub: 'नागरिक शिकायत दर्ज करें',
    
    nationalOverview: 'राष्ट्रीय अवलोकन',
    deepDiveGis: 'विस्तृत जीआईएस देखें',
    slaResolutionRate: 'एसएलए समाधान दर',
    targetMet: 'लक्ष्य प्राप्त',
    statutoryCompliance: '15 केंद्रों में >85% वैधानिक अनुपालन लक्ष्य हासिल किया गया',
    citizenRedressals: 'कुल नागरिक निवारण पूर्ण',
    highVolume: 'उच्च मात्रा',
    quarterGrowth: '+12.4% पिछली तिमाही की तुलना में',
    viewRegistry: 'पंजी देखें →',
    todaysActionPlan: 'आज की कार्य योजना',
    activeTasks: 'कार्य',
    takeAction: 'कार्रवाई करें',
    impact: 'प्रभाव',
    
    whatsappBotTitle: 'सीपीजीआरएएमएस एआई व्हाट्सएप बॉट सहायक',
    whatsappBotSubtitle: 'नागरिकों के लिए बहुभाषी शिकायत पंजीकरण, वॉयस नोट एनएलपी वर्गीकरण और स्वचालित पंजीकरण संख्या।',
    lodgeGrievance: 'नई शिकायत दर्ज करें',
    trackGrievance: 'शिकायत की स्थिति जांचें',
    typeMessage: 'हिंदी / अंग्रेजी / मराठी में संदेश या शिकायत लिखें...',
    send: 'भेजें',
    voiceNoteSimulation: 'वॉयस नोट सिमुलेट करें',
    liveSyncWithCpgrams: 'सीपीजीआरएएमएस के साथ लाइव सिंक',
    
    filterAll: 'सभी मामले',
    statusUnderReview: 'समीक्षाधीन',
    statusInvestigation: 'जांच जारी',
    statusActionTaken: 'कार्रवाई की गई',
    statusResolved: 'निराकृत',
    statusAppealed: 'पुनर्विचारित',
    criticalRisk: 'गंभीर जोखिम',
    
    timeHorizon: 'समय सीमा चयन',
    horizon30d: '30 दिन की सीमा',
    horizon90d: '90 दिन (तिमाही)',
    horizon6m: '6 महीने (अर्ध-वार्षिक)',
    horizon1y: '1 वर्ष (वार्षिक चक्र)',
  },
  mr: {
    appTitle: 'सीपीजीआरएएमएस एआय',
    appSubtitle: 'कार्यकारी तक्रार निवारण सहाय्यक',
    welcomeExecutive: 'स्वागत आहे, मुख्य अधिकारी!',
    portalSubtitle: 'डीएआरपीजी केंद्रीय लोक तक्रार निवारण व सनियंत्रण प्रणाली',
    locationDelhi: '28.6139° उत्तर, 77.2090° पूर्व • नवी दिल्ली सचिवालय',
    searchPlaceholder: 'तक्रार नोंदणी क्रमांक, नागरिक, जिल्हा शोधा...',
    exportReport: 'अहवाल डाउनलोड करा',
    incidentAlerts: 'एसएलए उल्लंघन अलर्ट',
    pendingCases: 'प्रलंबित',
    noRecordsFound: 'कोणतीही तक्रार सापडली नाही.',
    
    tabDashboard: 'डॅशबोर्ड',
    tabDashboardSub: 'राष्ट्रीय विहंगावलोकन आणि मेट्रिक्स',
    tabMaps: 'भौगोलिक नकाशा',
    tabMapsSub: 'जिल्हा आणि एसएलए झोन',
    tabGrievances: 'तक्रार निर्देशिका',
    tabGrievancesSub: 'नागरिक प्रकरणे आणि निवारण',
    tabPredictive: 'एआय आणि कालमर्यादा',
    tabPredictiveSub: 'अंदाज आणि ट्रेंड्स',
    tabWhatsAppBot: 'व्हॉट्सअॅप एआय बॉट',
    tabWhatsAppBotSub: 'नागरिक तक्रार नोंदणी',
    
    nationalOverview: 'राष्ट्रीय विहंगावलोकन',
    deepDiveGis: 'सविस्तर जीआयएस पहा',
    slaResolutionRate: 'एसएलए निवारण दर',
    targetMet: 'लक्ष्य पूर्ण',
    statutoryCompliance: '15 केंद्रांमध्ये >85% कायदेशीर अनुपालन पूर्ण झाले',
    citizenRedressals: 'पूर्ण झालेली नागरिक निवारणे',
    highVolume: 'मोठी संख्या',
    quarterGrowth: '+12.4% मागील तिमाहीपेक्षा जास्त',
    viewRegistry: 'नोंदवही पहा →',
    todaysActionPlan: 'आजची कृती योजना',
    activeTasks: 'कार्ये',
    takeAction: 'कृती करा',
    impact: 'प्रभाव',
    
    whatsappBotTitle: 'सीपीजीआरएएमएस एआय व्हॉट्सअॅप बॉट सहाय्यक',
    whatsappBotSubtitle: 'नागरिकांसाठी बहुभाषिक तक्रार नोंदणी, व्हॉइस नोट एनएलपी वर्गीकरण आणि त्वरित नोंदणी क्रमांक.',
    lodgeGrievance: 'नवीन तक्रार नोंदवा',
    trackGrievance: 'तक्रारीची स्थिती तपासा',
    typeMessage: 'मराठी / हिंदी / इंग्रजी मध्ये संदेश किंवा तक्रार टाईप करा...',
    send: 'पाठवा',
    voiceNoteSimulation: 'व्हॉइस नोट सिमुलेट करा',
    liveSyncWithCpgrams: 'सीपीजीआरएएमएस सोबत थेट जोडणी',
    
    filterAll: 'सर्व प्रकरणे',
    statusUnderReview: 'पुनरावलोकनाखाली',
    statusInvestigation: 'तपास सुरू',
    statusActionTaken: 'कारवाई केली',
    statusResolved: 'निवारण झाले',
    statusAppealed: 'पुनर्विचार अर्ज',
    criticalRisk: 'अति-गंभीर',
    
    timeHorizon: 'कालमर्यादा श्रेणी',
    horizon30d: '30 दिवसांची मर्यादा',
    horizon90d: '90 दिवस (त्रैमासिक)',
    horizon6m: '6 महिने (अर्ध-वार्षिक)',
    horizon1y: '1 वर्ष (वार्षिक चक्र)',
  }
};
