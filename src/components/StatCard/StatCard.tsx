import './StatCard.scss';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconColor: string;
}

function StatCard({ title, value, icon, iconColor }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card__body">
        <div className="stat-card__text">
          <span className="stat-card__title">{title}</span>
          <span className="stat-card__value">{value}</span>
        </div>
        <div className="stat-card__icon" style={{ color: iconColor, borderColor: `${iconColor}33` }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
