export const fmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});
export const fullDate = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : fullDate.format(date);
}

export function formatMonth(value) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}-01T00:00:00`));
}

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export function workingDays(a, b) {
  let n = 0;
  for (let d = new Date(a); d <= b; d = addDays(d, 1)) {
    if (d.getDay() % 6 !== 0) n++;
  }
  return n;
}