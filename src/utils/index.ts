export const formatAmount = (value: number): string => {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
