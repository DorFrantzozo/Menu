

import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 },  // עליה איטית מאוד ל-5 משתמשים בלבד
    { duration: '1m', target: 10 }, // שהייה בשיא של 10 משתמשים (זה מספיק לבדיקה קלה)
    { duration: '30s', target: 0 },  // ירידה איטית
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // אם יותר מ-1% מהבקשות נכשלות, הבדיקה תסומן כנכשלת
  },
};

// רשימת הנתונים של המסעדות שלך (החלף את ה-IDs בערכים האמיתיים)
const restaurants = [
  { slug: 'dor', id: '67e2e60aee40e14703cfbddf' },
  { slug: 'test2', id: '69b00a31fadcc0e1b4f9004e' }

];

export default function () {
  const resInfo = restaurants[Math.floor(Math.random() * restaurants.length)];
  
  // כאן תשים את ה-URL של Railway שלך
  const url = `https://menu-app.up.railway.app/api/dish/getAllDishes/${resInfo.id}`;
  
  const res = http.get(url);

  check(res, {
    'is status 200': (r) => r.status === 200,
    'has dishes': (r) => r.body && r.body.length > 0,
  });

  // מרווח נשימה: כל "לקוח" מחכה בין 3 ל-5 שניות בין סריקה לסריקה
  // זה מוודא שהשרת לא יקבל "מבול" של בקשות
  sleep(Math.random() * 2 + 3);
}