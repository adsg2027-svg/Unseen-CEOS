import { MapPin, Calendar, Briefcase, Award } from 'lucide-react';

export default function ProfileCard({ entrepreneur }) {
  const initials = entrepreneur.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="bg-white rounded-xl border border-warm-200 shadow-sm overflow-hidden">
      {/* Orange header — avatar is absolutely anchored to its bottom edge */}
      <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-700 relative">
        <div
          className="absolute -bottom-8 left-6 w-20 h-20 rounded-xl flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md"
          style={{ backgroundColor: entrepreneur.avatarColor }}
        >
          {initials}
        </div>
      </div>

      {/* Name / meta — entirely in the white section */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-warm-900">{entrepreneur.name}</h1>
        <p className="text-warm-600 font-medium">{entrepreneur.businessName}</p>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-warm-500">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {entrepreneur.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase size={14} />
            {entrepreneur.sector}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {entrepreneur.yearsInBusiness} years in business
          </span>
          <span className="flex items-center gap-1">
            <Award size={14} />
            {entrepreneur.registrationType}
          </span>
        </div>
      </div>
    </div>
  );
}
