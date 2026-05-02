export default function Card({ title, subtitle, icon: Icon, children, className = '', hoverable = false, padding = 'md' }) {
  const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' };
  const hoverClass = hoverable ? 'hover:shadow-md hover:border-primary-200 transition-all duration-200' : '';

  return (
    <div className={`bg-white rounded-xl border border-warm-200 shadow-sm ${paddings[padding]} ${hoverClass} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="p-2 bg-primary-50 rounded-lg">
              <Icon size={20} className="text-primary-500" />
            </div>
          )}
          <div>
            {title && <h3 className="font-semibold text-warm-900">{title}</h3>}
            {subtitle && <p className="text-sm text-warm-500">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
