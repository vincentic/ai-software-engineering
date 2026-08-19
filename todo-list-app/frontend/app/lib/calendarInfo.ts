type SolarTerm = {
  name: string;
  month: number;
  day: number;
};

const SOLAR_TERMS: SolarTerm[] = [
  { name: "小寒", month: 1, day: 5 },
  { name: "大寒", month: 1, day: 20 },
  { name: "立春", month: 2, day: 4 },
  { name: "雨水", month: 2, day: 19 },
  { name: "惊蛰", month: 3, day: 5 },
  { name: "春分", month: 3, day: 20 },
  { name: "清明", month: 4, day: 4 },
  { name: "谷雨", month: 4, day: 20 },
  { name: "立夏", month: 5, day: 5 },
  { name: "小满", month: 5, day: 21 },
  { name: "芒种", month: 6, day: 5 },
  { name: "夏至", month: 6, day: 21 },
  { name: "小暑", month: 7, day: 7 },
  { name: "大暑", month: 7, day: 22 },
  { name: "立秋", month: 8, day: 7 },
  { name: "处暑", month: 8, day: 23 },
  { name: "白露", month: 9, day: 7 },
  { name: "秋分", month: 9, day: 23 },
  { name: "寒露", month: 10, day: 8 },
  { name: "霜降", month: 10, day: 23 },
  { name: "立冬", month: 11, day: 7 },
  { name: "小雪", month: 11, day: 22 },
  { name: "大雪", month: 12, day: 7 },
  { name: "冬至", month: 12, day: 22 },
];

function dateFromTerm(year: number, term: SolarTerm) {
  return new Date(year, term.month - 1, term.day);
}

function formatMonthDay(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function getIsoWeek(date: Date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getSolarTermRange(date: Date) {
  const year = date.getFullYear();
  const ranges = [
    ...SOLAR_TERMS.map((term) => ({ term, date: dateFromTerm(year, term) })),
    { term: SOLAR_TERMS[0], date: dateFromTerm(year + 1, SOLAR_TERMS[0]) },
  ];

  let current = { term: SOLAR_TERMS[SOLAR_TERMS.length - 1], date: dateFromTerm(year - 1, SOLAR_TERMS[SOLAR_TERMS.length - 1]) };
  let next = ranges[0];

  for (let index = 0; index < ranges.length; index += 1) {
    if (date >= ranges[index].date) {
      current = ranges[index];
      next = ranges[index + 1] || { term: SOLAR_TERMS[0], date: dateFromTerm(year + 1, SOLAR_TERMS[0]) };
    }
  }

  const endDate = new Date(next.date);
  endDate.setDate(endDate.getDate() - 1);

  return `${current.term.name} ${formatMonthDay(current.date)}-${formatMonthDay(endDate)}`;
}

export function getCalendarInfo(date = new Date()) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    week: getIsoWeek(date),
    solarTermRange: getSolarTermRange(date),
  };
}
