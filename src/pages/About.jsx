import { Target, Users, BookOpen, ExternalLink, Heart } from 'lucide-react';
import { AGENCY_PARAMETERS } from '../data/mockData';
import Card from '../components/common/Card';
import T from '../components/common/T';

const teamMembers = [
  { name: 'Research Lead',  role: 'Field Coordination',   desc: 'Coordinates student researchers and NGO partnerships',             color: 'from-primary-400 to-primary-600' },
  { name: 'Data Analyst',   role: 'Scoring & Analytics',  desc: 'Manages agency scoring methodology and data analysis',             color: 'from-amber-400 to-amber-600'   },
  { name: 'Tech Lead',      role: 'Platform Development', desc: 'Builds and maintains The Unseen CEOs platform',                    color: 'from-blue-400 to-blue-600'     },
  { name: 'Outreach Lead',  role: 'Investor Relations',   desc: 'Connects shortlisted ventures with impact investors',              color: 'from-green-400 to-green-600'   },
];

const replicationSteps = [
  { step: 1, title: 'Partner with Local NGO',    desc: 'Identify an NGO working with women micro-entrepreneurs in your region'              },
  { step: 2, title: 'Train Student Researchers', desc: 'Recruit and train 4-6 students on the structured interview methodology'             },
  { step: 3, title: 'Conduct Interviews',         desc: 'Interview 40-50 women entrepreneurs using the standardized questionnaire'          },
  { step: 4, title: 'Upload to Platform',         desc: 'Enter interview data into the platform via CSV or manual entry'                    },
  { step: 5, title: 'Analyze Agency Scores',      desc: 'Review the 5-parameter scores to identify genuine women leaders'                  },
  { step: 6, title: 'Build Business Plans',       desc: 'Use AI-assisted templates to create investor-ready profiles for top entrepreneurs' },
  { step: 7, title: 'Present to Investors',       desc: 'Match 2-3 verified ventures with impact investors, MSME lenders, or angel funders' },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="absolute -top-6 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-20 h-16 bg-amber-200/20 rounded-full blur-lg pointer-events-none" />
        <div className="relative z-10 anim-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <Heart size={15} className="text-white/75" />
            <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">
              <T>Mission & Methodology</T>
            </p>
          </div>
          <h1 className="text-2xl font-bold text-white"><T>About The Unseen CEOs</T></h1>
          <p className="text-white/70 text-sm mt-1">
            <T>A student-built platform for genuine women-led growth in India's informal economy</T>
          </p>
        </div>
      </div>

      <div className="anim-fade-in-up delay-100">
        <Card className="mb-6">
          <div className="bg-gradient-to-r from-primary-50 to-amber-50 -m-6 p-8 rounded-xl">
            <blockquote className="text-lg text-warm-800 leading-relaxed italic">
              "<T>A student-built, digital platform that helps identify, support, and fund women who</T>
              <span className="font-semibold text-primary-700 not-italic"> <T>actually</T> </span>
              <T>run their businesses — not just appear on documents.</T>"
            </blockquote>
            <p className="text-sm text-warm-500 mt-4">
              <T>Across India's informal economy, millions of microbusinesses are legally registered in women's names — but most are not actually woman-led. The Unseen CEOs bridges this credibility gap for lenders, investors, and policymakers who want to fund genuine women-led ventures.</T>
            </p>
          </div>
        </Card>
      </div>

      <div className="anim-fade-in-up delay-200">
        <Card title={<T>Agency Score Methodology</T>} icon={Target} className="mb-6">
          <p className="text-sm text-warm-600 mb-4">
            <T>The Agency Score is a 5-parameter scorecard that identifies who genuinely leads the business. Each parameter is scored 1–5 through structured field interviews.</T>
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-200">
                  <th className="text-left py-2 px-3 text-warm-600 font-medium"><T>Parameter</T></th>
                  <th className="text-left py-2 px-3 text-warm-600 font-medium"><T>What It Measures</T></th>
                  <th className="text-center py-2 px-3 text-warm-600 font-medium"><T>Scale</T></th>
                </tr>
              </thead>
              <tbody>
                {AGENCY_PARAMETERS.map((param, i) => (
                  <tr key={param.key} className={`${i % 2 === 0 ? 'bg-warm-50' : ''} hover:bg-primary-50/50 transition-colors`}>
                    <td className="py-2.5 px-3 font-medium text-warm-800"><T>{param.label}</T></td>
                    <td className="py-2.5 px-3 text-warm-600"><T>{param.description}</T></td>
                    <td className="py-2.5 px-3 text-center text-warm-500">1–5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center hover:shadow-sm transition-shadow">
              <p className="text-sm font-semibold text-green-700"><T>High Agency</T></p>
              <p className="text-xs text-green-600 mt-0.5">76–100% (19–25 pts)</p>
              <p className="text-xs text-green-500 mt-1"><T>Genuinely leads the business</T></p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center hover:shadow-sm transition-shadow">
              <p className="text-sm font-semibold text-amber-700"><T>Moderate Agency</T></p>
              <p className="text-xs text-amber-600 mt-0.5">48–75% (12–18 pts)</p>
              <p className="text-xs text-amber-500 mt-1"><T>Shared decision-making</T></p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center hover:shadow-sm transition-shadow">
              <p className="text-sm font-semibold text-red-700"><T>Low Agency</T></p>
              <p className="text-xs text-red-600 mt-0.5">Below 48% (&lt;12 pts)</p>
              <p className="text-xs text-red-500 mt-1"><T>Name-only ownership</T></p>
            </div>
          </div>
        </Card>
      </div>

      <div className="anim-fade-in-up delay-300">
        <Card title={<T>Team</T>} icon={Users} className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamMembers.map((m, i) => (
              <div key={i} className="flex items-start gap-3 bg-warm-50 hover:bg-white rounded-xl p-4 border border-warm-100 hover:border-primary-100 hover:shadow-sm transition-all duration-200 group">
                <div className={`w-11 h-11 bg-gradient-to-br ${m.color} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
                  {m.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-warm-900"><T>{m.name}</T></p>
                  <p className="text-xs text-primary-600 font-medium"><T>{m.role}</T></p>
                  <p className="text-xs text-warm-500 mt-1"><T>{m.desc}</T></p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="anim-fade-in-up delay-400">
        <Card title={<T>Replication Toolkit</T>} icon={BookOpen} className="mb-6">
          <p className="text-sm text-warm-600 mb-5">
            <T>A step-by-step guide for other student teams to replicate this model with other NGOs in their region.</T>
          </p>
          <div className="relative pl-9">
            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-300 to-primary-100" />
            <div className="space-y-5">
              {replicationSteps.map(s => (
                <div key={s.step} className="relative group">
                  <div className="absolute -left-9 top-0.5 w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:scale-110 transition-transform duration-200">
                    {s.step}
                  </div>
                  <div className="bg-warm-50 hover:bg-primary-50/40 rounded-xl p-3 border border-warm-100 hover:border-primary-100 transition-colors duration-200">
                    <p className="text-sm font-semibold text-warm-800"><T>{s.title}</T></p>
                    <p className="text-xs text-warm-500 mt-0.5"><T>{s.desc}</T></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="anim-fade-in-up delay-500">
        <Card className="mb-6">
          <h3 className="font-semibold text-warm-900 mb-3"><T>Data Sources &amp; References</T></h3>
          <ul className="space-y-2 text-sm text-warm-600">
            <li className="flex items-start gap-2 hover:text-warm-800 transition-colors">
              <ExternalLink size={14} className="text-primary-400 mt-0.5 shrink-0" />
              <T>IFMR/SEWA (2022) — Study on financial decision-making power of Indian women micro-entrepreneurs</T>
            </li>
            <li className="flex items-start gap-2 hover:text-warm-800 transition-colors">
              <ExternalLink size={14} className="text-primary-400 mt-0.5 shrink-0" />
              <T>MUDRA Loan Scheme — Government of India microfinance program for micro-enterprises</T>
            </li>
            <li className="flex items-start gap-2 hover:text-warm-800 transition-colors">
              <ExternalLink size={14} className="text-primary-400 mt-0.5 shrink-0" />
              <T>Udyam Registration Portal — MSME registration for informal businesses</T>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
