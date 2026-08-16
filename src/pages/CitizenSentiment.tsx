import React, { useState } from 'react';
import {
  SmilePlus,
  Frown,
  Meh,
  Smile,
  Heart,
  Flame,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Filter,
  Quote,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { KPICard } from '../components/common/KPICard';
import { CITIZEN_SENTIMENT_DATA, FEEDBACK_QUOTES } from '../data/mockData';

export const CitizenSentiment: React.FC = () => {
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<'all' | 'Positive' | 'Negative' | 'Neutral'>('all');

  const sentimentDonut = [
    { name: 'Positive Sentiment', value: CITIZEN_SENTIMENT_DATA.overallPositive, color: '#10b981' },
    { name: 'Neutral / Formal', value: CITIZEN_SENTIMENT_DATA.overallNeutral, color: '#64748b' },
    { name: 'Negative / Distressed', value: CITIZEN_SENTIMENT_DATA.overallNegative, color: '#ef4444' },
  ];

  const emotionData = [
    { name: 'Frustration', percentage: 42, color: '#ef4444', icon: '😤' },
    { name: 'Anger / Distress', percentage: 24, color: '#f97316', icon: '😠' },
    { name: 'Hopeful & Patient', percentage: 18, color: '#3b82f6', icon: '🙏' },
    { name: 'Gratitude & Relief', percentage: 16, color: '#10b981', icon: '💐' },
  ];

  const filteredQuotes = FEEDBACK_QUOTES.filter((q) => {
    if (selectedSentimentFilter !== 'all' && q.sentiment !== selectedSentimentFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded border border-purple-200 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={13} className="text-purple-600" />
              Multilingual NLP Voice of Citizen
            </span>
            <span className="text-xs text-slate-400 font-mono">Bhashini & Indic-BERT Powered</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Citizen Sentiment & Public Perception Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time sentiment scoring extracted from grievance descriptions, IVRS post-resolution feedback, and appellate notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono">
            Analyzed Feedback: <strong className="text-blue-700">1,25,456 Submissions</strong>
          </div>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Overall Positive Sentiment"
          value="38.2%"
          changePct={4.1}
          progressPct={38.2}
          icon={<Smile size={18} />}
          accentColor="emerald"
          tooltipText="Citizen communications expressing satisfaction or affirmative outcomes."
        />
        <KPICard
          title="Neutral / Administrative"
          value="28.4%"
          subValue="Standard Queries"
          icon={<Meh size={18} />}
          accentColor="slate"
          tooltipText="Matter-of-fact inquiries and procedural clarifications."
        />
        <KPICard
          title="Negative / Distressed"
          value="33.4%"
          changePct={-3.8}
          isInverseMetric={true}
          icon={<Frown size={18} />}
          accentColor="rose"
          tooltipText="Complaints exhibiting acute administrative frustration or financial distress."
        />
        <KPICard
          title="Post-Disposal Star Rating"
          value="3.8 / 5.0"
          subValue="Based on 48,000 IVRS Calls"
          icon={<Heart size={18} />}
          accentColor="purple"
          tooltipText="Direct citizen satisfaction rating gathered via automated IVRS call-backs."
        />
      </div>

      {/* Grid: Sentiment Donut + Emotion Breakdown + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sentiment Donut */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sentiment Distribution</h3>
            <p className="text-xs text-slate-500 mb-2">Ingested citizen text classified via NLP model.</p>

            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentDonut}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sentimentDonut.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 font-mono">38.2%</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Positive</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
            <div>
              <span className="block text-[10px] text-slate-400">Positive</span>
              <span className="font-bold text-emerald-600 font-mono">38.2%</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Neutral</span>
              <span className="font-bold text-slate-600 font-mono">28.4%</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Negative</span>
              <span className="font-bold text-rose-600 font-mono">33.4%</span>
            </div>
          </div>
        </div>

        {/* Emotion Breakdown */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Emotional Resonance Breakdown</h3>
            <p className="text-xs text-slate-500 mb-4">Deep linguistic emotion classification.</p>

            <div className="space-y-3">
              {emotionData.map((emo) => (
                <div key={emo.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <span>{emo.icon}</span>
                      <span>{emo.name}</span>
                    </span>
                    <span className="font-mono text-slate-900">{emo.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${emo.percentage}%`, backgroundColor: emo.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Derived from conversational semantic tone weighting.
          </div>
        </div>

        {/* Sentiment Trend Over Time */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Monthly Sentiment Trajectory</h3>
          <p className="text-xs text-slate-500 mb-3">Positive vs. Negative sentiment trend.</p>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CITIZEN_SENTIMENT_DATA.trend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[20, 60]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="positive" name="Positive %" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="negative" name="Negative %" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Semantic Keyword Cloud & Keyword Frequency */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Semantic Keyword Cloud & Root Expression Density
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key n-grams extracted from citizen text. Click any keyword tag to inspect grievance frequency.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          {CITIZEN_SENTIMENT_DATA.keywords.map((kw) => (
            <div
              key={kw.word}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                kw.sentiment === 'Positive'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : kw.sentiment === 'Negative'
                  ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{kw.word}</span>
              <span className="font-mono text-[10px] opacity-75 bg-white/60 px-1 rounded">
                {kw.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Voice of Citizen Live Feed */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Quote size={16} className="text-blue-600" />
              Voice of Citizen — Verified Public Feedback Feed
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct excerpts from citizen submissions and post-resolution satisfaction audits.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedSentimentFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedSentimentFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              All Quotes ({FEEDBACK_QUOTES.length})
            </button>
            <button
              onClick={() => setSelectedSentimentFilter('Positive')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedSentimentFilter === 'Positive' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
              }`}
            >
              Positive
            </button>
            <button
              onClick={() => setSelectedSentimentFilter('Negative')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedSentimentFilter === 'Negative' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800'
              }`}
            >
              Distressed / Negative
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuotes.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                item.sentiment === 'Positive'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : item.sentiment === 'Negative'
                  ? 'bg-rose-50/40 border-rose-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{item.citizenName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.sentiment === 'Positive'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.sentiment === 'Negative'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {item.sentiment} ({item.score > 0 ? `+${item.score}` : item.score})
                  </span>
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium text-slate-700 truncate max-w-[150px]">{item.department}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
