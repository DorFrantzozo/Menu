/**
 * Helper to calculate the exact UTC Date for midnight in Asia/Jerusalem
 * @param {Date} dateObj - The reference date
 * @returns {Date} A new Date object representing 00:00:00 in Asia/Jerusalem
 */
export const getJerusalemMidnight = (dateObj) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const parts = formatter.formatToParts(dateObj);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  
  // Israel offset is either +03:00 (summer) or +02:00 (winter)
  const baseStr = `${year}-${month}-${day}T00:00:00`;
  let utcDate = new Date(`${baseStr}+03:00`);
  
  // Verify if +03:00 resulted in midnight Jerusalem time
  const checkHour = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem', hour: 'numeric', hour12: false
  }).format(utcDate);
  
  if (checkHour !== '24' && checkHour !== '0' && checkHour !== '00') {
     utcDate = new Date(`${baseStr}+02:00`);
  }
  return utcDate;
};
