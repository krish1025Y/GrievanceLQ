import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Check,
  CheckCheck,
  Sparkles,
  Bot,
  Shield,
  FileText,
  MapPin,
  Clock,
  ArrowRight,
  RefreshCw,
  PhoneCall,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GrievanceRecord, CaseStatus } from '../types';
import { AppLanguage, TRANSLATIONS } from '../utils/translations';

interface WhatsAppBotIntakeProps {
  onAddGrievance: (newGrievance: GrievanceRecord) => void;
  onSelectGrievance: (grv: GrievanceRecord) => void;
  language: AppLanguage;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'citizen';
  text: string;
  timestamp: string;
  options?: string[];
  isVoice?: boolean;
  docketInfo?: {
    regNumber: string;
    department: string;
    category: string;
    priority: string;
    state: string;
    district: string;
  };
}

export const WhatsAppBotIntake: React.FC<WhatsAppBotIntakeProps> = ({
  onAddGrievance,
  onSelectGrievance,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं सीपीजीआरएएमएस एआई शिकायत निवारण सहायक हूँ। आप अपनी शिकायत किसी भी भाषा में यहाँ दर्ज कर सकते हैं या स्थिति की जांच कर सकते हैं।'
          : language === 'mr'
          ? 'नमस्कार! मी सीपीजीआरएएमएस तक्रार निवारण सहाय्यक आहे. आपण आपली तक्रार मराठी किंवा इतर भाषेत येथे नोंदवू शकता.'
          : 'Namaste! I am the CPGRAMS AI Grievance Assistant. You can lodge a new complaint or track your existing docket here.',
      timestamp: '10:00 AM',
      options: [
        language === 'hi'
          ? '🌾 पीएम-किसान सम्मान निधि किस्त नहीं आई'
          : language === 'mr'
          ? '🌾 पीएम-किसान निधी हप्ता मिळाला नाही'
          : '🌾 PM-KISAN 16th Installment Missing',
        language === 'hi'
          ? '🛣️ ग्रामीण सड़क मरम्मत एवं गड्ढे'
          : language === 'mr'
          ? '🛣️ गावातील रस्ता दुरुस्ती समस्या'
          : '🛣️ Rural PWD Road Repair Required',
        language === 'hi'
          ? '⚡ बिजली आपूर्ति व ट्रांसफार्मर खराबी'
          : language === 'mr'
          ? '⚡ वीज पुरवठा व ट्रान्सफॉर्मर बिघाड'
          : '⚡ Power Cut & Transformer Failure',
        language === 'hi'
          ? '🔍 शिकायत की स्थिति जांचें'
          : language === 'mr'
          ? '🔍 तक्रारीची स्थिती तपासा'
          : '🔍 Track Docket Status',
      ],
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentDockets, setRecentDockets] = useState<GrievanceRecord[]>([]);
  const [lastCreated, setLastCreated] = useState<GrievanceRecord | null>(null);

  // Quick Preset Handlers
  const handleQuickOption = (option: string) => {
    sendMessage(option);
  };

  const sendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'citizen',
      text,
      timestamp: timeNow,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsSubmitting(true);

    // AI Analysis & Response Simulation
    setTimeout(() => {
      processGrievanceNLP(text, timeNow);
      setIsSubmitting(false);
    }, 900);
  };

  // Simulate Voice Note Intake
  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceText =
        language === 'hi'
          ? 'हमारे गांव (पुणे, महाराष्ट्र) में मुख्य ट्रांसफार्मर 4 दिन से जला हुआ है, बिजली नहीं आ रही है।'
          : language === 'mr'
          ? 'आमच्या गावात (पुणे, महाराष्ट्र) ट्रान्सफॉर्मर जळाला आहे, ३ दिवसांपासून वीज नाही, कृपया तातडीने दुरुस्त करा.'
          : 'Our village main distribution transformer in Pune district has broken down for 4 days with zero electricity.';

      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'citizen',
        text: voiceText,
        timestamp: timeNow,
        isVoice: true,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsSubmitting(true);

      setTimeout(() => {
        processGrievanceNLP(voiceText, timeNow);
        setIsSubmitting(false);
      }, 1000);
    }, 1500);
  };

  const processGrievanceNLP = (text: string, timeNow: string) => {
    // Generate Registration Number
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const regNo = `DARPG/E/2026/${randNum}`;

    let dept = 'Ministry of Agriculture & Farmers Welfare';
    let cat = 'PM-KISAN Scheme';
    let district = 'Pune';
    let state = 'Maharashtra';
    let priority: 'High' | 'Critical' | 'Medium' = 'High';

    if (text.includes('बिजली') || text.includes('वीज') || text.includes('Power') || text.includes('Electricity') || text.includes('Transformer')) {
      dept = 'Ministry of Power (Discom Node)';
      cat = 'Transformer Burnout & Power Outage';
      priority = 'Critical';
    } else if (text.includes('सड़क') || text.includes('रस्ता') || text.includes('Road') || text.includes('PWD')) {
      dept = 'Ministry of Road Transport & Highways';
      cat = 'National Highway Repair & Demarcation';
      priority = 'Medium';
    } else if (text.includes('स्थिति') || text.includes('स्थिती') || text.includes('Track') || text.includes('status')) {
      // Tracking response
      const botResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text:
          language === 'hi'
            ? `आपकी शिकायत DARPG/E/2026/09421 'जांच जारी' (Investigation) स्थिति में है। नोडल अधिकारी श्री राजेश वर्मा, अधिशासी अभियंता को अग्रसारित किया गया है।`
            : language === 'mr'
            ? `आपली तक्रार DARPG/E/2026/09421 'तपास सुरू' स्थितीत आहे. नोडल अधिकारी श्री. राजेश वर्मा यांच्याकडे वर्ग करण्यात आली आहे.`
            : `Docket DARPG/E/2026/09421 is currently UNDER INVESTIGATION with Nodal Officer Rajesh Verma, Executive Engineer. SLA target: 3 days remaining.`,
        timestamp: timeNow,
      };
      setMessages((prev) => [...prev, botResponse]);
      return;
    }

    // New Docket Creation
    const newRecord: GrievanceRecord = {
      id: `grv-${Date.now()}`,
      registrationNumber: regNo,
      citizenName: 'Citizen via WhatsApp Bot (Verified)',
      citizenPhone: '+91 98230 44120',
      citizenEmail: 'citizen.bot@gov.in',
      state: state,
      district: district,
      ministry: 'Ministry of Citizen Services',
      department: dept,
      subDepartment: 'Citizen Field Services',
      category: cat,
      subCategory: 'Direct Ingestion',
      subject: text.slice(0, 75) + '...',
      description: text,
      status: 'Under Review' as CaseStatus,
      priority: priority,
      predictedRisk: priority === 'Critical' ? 'Critical' : 'Medium',
      predictedRiskScore: priority === 'Critical' ? 82 : 45,
      slaStatus: 'On Track',
      slaDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      slaRemainingMinutes: 10080,
      createdDate: new Date().toISOString().slice(0, 10),
      lastUpdated: new Date().toISOString().slice(0, 10),
      sentiment: 'Negative',
      sentimentScore: -0.4,
      sentimentKeywords: ['outage', 'delay', 'urgent', 'disruption'],
      prematureClosureRisk: false,
      appealCount: 0,
      recommendedAction: 'Immediate dispatch of mobile nodal squad and statutory acknowledgement receipt.',
      assignedOfficer: {
        name: 'Shri R. K. Meena, IAS',
        designation: 'Nodal Officer / Executive Magistrate',
        email: 'nodal.cpgrams@gov.in',
        phone: '+91 11 2309 2000',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString().slice(0, 10),
          stage: 'Ingested via WhatsApp Bot',
          actor: 'CPGRAMS AI WhatsApp Gateway',
          role: 'Automated Bot Gateway',
          description: `Citizen submitted via automated WhatsApp gateway. NLP parsed: ${dept} (${cat}).`,
          statusChange: 'Under Review',
        },
      ],
    };

    onAddGrievance(newRecord);
    setRecentDockets((prev) => [newRecord, ...prev.slice(0, 4)]);
    setLastCreated(newRecord);

    const botResponse: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'bot',
      text:
        language === 'hi'
          ? `✅ आपकी शिकायत सफलतापूर्वक पंजीकृत हो गई है!\n\n📋 पंजीकरण संख्या: ${regNo}\n🏢 संबंधित विभाग: ${dept}\n📍 कार्यक्षेत्र: ${district}, ${state}\n⏱️ अपेक्षित समाधान: 7 कार्यदिवस\n\nआपको एसएमएस और व्हाट्सएप पर नियमित अपडेट प्राप्त होंगे।`
          : language === 'mr'
          ? `✅ आपली तक्रार यशस्वीरित्या नोंदवली गेली आहे!\n\n📋 नोंदणी क्रमांक: ${regNo}\n🏢 संबंधित विभाग: ${dept}\n📍 कार्यक्षेत्र: ${district}, ${state}\n⏱️ निवारण कालावधी: ७ दिवस\n\nआपल्याला व्हॉट्सअॅपवर वेळोवेळी माहिती दिली जाईल.`
          : `✅ Your grievance has been registered on CPGRAMS!\n\n📋 Docket No: ${regNo}\n🏢 Department: ${dept}\n📍 Jurisdiction: ${district}, ${state}\n⏱️ Expected SLA: 7 Working Days\n\nLive tracking updates have been dispatched to your mobile.`,
      timestamp: timeNow,
      docketInfo: {
        regNumber: regNo,
        department: dept,
        category: cat,
        priority: priority,
        state: state,
        district: district,
      },
    };

    setMessages((prev) => [...prev, botResponse]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Info Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider flex items-center gap-1">
              <Bot size={13} className="text-slate-700" />
              CPGRAMS Conversational AI
            </span>
            <span className="text-xs text-slate-400 font-mono">WhatsApp Business API Gateway</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {t.whatsappBotTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            {t.whatsappBotSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 text-[#15803d] border border-emerald-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            <span>24/7 Citizen AI Active</span>
          </div>
        </div>
      </div>

      {/* Main Row: WhatsApp Device Frame (Left) + AI Parsing & Live Sync Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7-Cols: WhatsApp Chat Simulation */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[640px]">
          {/* WhatsApp Header */}
          <div className="bg-[#075e54] text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white text-[#075e54] flex items-center justify-center font-bold text-sm shadow-xs">
                  <Shield size={20} className="text-[#075e54]" />
                </div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#25d366] border-2 border-[#075e54] absolute -bottom-0.5 -right-0.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold leading-tight">CPGRAMS AI Helpdesk</h3>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#25d366] text-white flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </div>
                </div>
                <p className="text-[11px] text-emerald-100 opacity-90">Official DARPG Government Bot • Online</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono uppercase">
                {language.toUpperCase()}
              </span>
            </div>
          </div>

          {/* WhatsApp Message Area with Subtle Chat Wallpaper */}
          <div className="flex-1 bg-[#efeae2]/60 p-4 overflow-y-auto space-y-3">
            <div className="text-center my-1">
              <span className="bg-white/80 text-[10px] text-slate-500 px-3 py-1 rounded-full shadow-2xs border border-slate-200/60 font-medium">
                🔒 Messages are end-to-end encrypted and synced with DARPG CPGRAMS
              </span>
            </div>

            {messages.map((msg) => {
              const isUser = msg.sender === 'citizen';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl shadow-2xs text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#d9fdd3] text-slate-900 rounded-br-xs border border-emerald-200/60'
                        : 'bg-white text-slate-900 rounded-bl-xs border border-slate-200/70'
                    }`}
                  >
                    {msg.isVoice && (
                      <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-emerald-300/40 text-emerald-900 font-semibold text-[11px]">
                        <Mic size={13} className="text-emerald-700" />
                        <span>Voice Note Transcribed (NLP Engine)</span>
                      </div>
                    )}

                    <p className="whitespace-pre-line text-slate-800">{msg.text}</p>

                    {msg.docketInfo && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 bg-slate-50/80 p-2 rounded-xl text-[11px] space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>Docket ID:</span>
                          <span className="font-mono text-slate-900">{msg.docketInfo.regNumber}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Dept:</span>
                          <span className="truncate max-w-[140px] font-medium">{msg.docketInfo.department}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      {isUser && <CheckCheck size={13} className="text-blue-500" />}
                    </div>
                  </div>

                  {/* Optional Quick Buttons under Bot response */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 max-w-[90%]">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickOption(opt)}
                          className="text-[11px] bg-white hover:bg-slate-50 text-slate-800 font-medium px-3 py-1.5 rounded-full border border-slate-300/80 shadow-2xs transition-all text-left cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isSubmitting && (
              <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-xl border border-slate-200 w-fit text-xs text-slate-500 shadow-2xs">
                <RefreshCw size={14} className="animate-spin text-[#075e54]" />
                <span>CPGRAMS AI is analyzing grievance...</span>
              </div>
            )}
          </div>

          {/* Input & Voice Bar */}
          <div className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateVoice}
              disabled={isRecording || isSubmitting}
              className={`p-2.5 rounded-full transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={t.voiceNoteSimulation}
            >
              <Mic size={18} />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={t.typeMessage}
              className="flex-1 px-4 py-2 bg-slate-50 focus:bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={!inputVal.trim() || isSubmitting}
              className="p-2.5 bg-[#075e54] hover:bg-[#064e46] disabled:opacity-50 text-white rounded-full transition-colors cursor-pointer shadow-2xs"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right 5-Cols: AI Triage & Live Sync Console */}
        <div className="lg:col-span-5 space-y-5">
          {/* Real-time Triage Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-slate-800" />
                <h3 className="text-sm font-bold text-slate-900">
                  AI Entity Extraction & Docket Generator
                </h3>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                Zero-Touch Triage
              </span>
            </div>

            {lastCreated ? (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Generated Docket ID:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {lastCreated.registrationNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Assigned Ministry:</span>
                    <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
                      {lastCreated.department}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Category Issue:</span>
                    <span className="font-medium text-slate-700">{lastCreated.category}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Urgency Risk:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      lastCreated.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {lastCreated.priority}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectGrievance(lastCreated)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText size={14} />
                  <span>Inspect in Official Grievance CRM →</span>
                </button>
              </div>
            ) : (
              <div className="p-6 bg-slate-50/70 rounded-xl border border-dashed border-slate-200 text-center space-y-2">
                <Bot size={24} className="text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">
                  Send a WhatsApp message or simulate a voice note on the left to watch live AI extraction.
                </p>
              </div>
            )}
          </div>

          {/* Dockets Lodged via Bot Session */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live Synced Dockets (This Session)
              </h4>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-medium">
                {recentDockets.length} Lodged
              </span>
            </div>

            {recentDockets.length > 0 ? (
              <div className="space-y-2.5">
                {recentDockets.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => onSelectGrievance(doc)}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all cursor-pointer space-y-1 group"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-slate-900 group-hover:text-slate-700">
                        {doc.registrationNumber}
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-1 font-medium">{doc.subject}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>{doc.district}, {doc.state}</span>
                      <span className="text-slate-900 font-semibold flex items-center gap-0.5 group-hover:underline">
                        View CRM <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                No new WhatsApp cases registered yet. Use the bot to lodge one instantly.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
