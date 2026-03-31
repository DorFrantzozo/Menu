export const paymentColumns = [
  {
    label: "תאריך",
    key: "paymentDate",
    render: (val) => new Date(val).toLocaleDateString("he-IL"),
  },
  {
    label: "תיאור",
    key: "description",
  },
  {
    label: "סכום",
    key: "amount",
    render: (val, row) =>
      `${val} ${row.currency === "ILS" ? "₪" : row.currency}`,
  },
  {
    label: "מסמך",
    key: "documentNumber",
  },
  {
    label: "פעולות",
    key: "documentUrl",
    render: (url) => (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-100"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        הורדת חשבונית
      </a>
    ),
  },
];
