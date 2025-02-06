import { format } from 'date-fns';

export const formatDate = (timestamp?: string) => {
  if (!timestamp) return '';
  const date = new Date(Number(timestamp));
  return format(date, 'yyyy-MM-dd');
};
