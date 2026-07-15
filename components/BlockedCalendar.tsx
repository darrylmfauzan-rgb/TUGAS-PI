import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
} from "date-fns";

type Range = {
  check_in_date: string;
  check_out_date: string;
  status: string;
  created_at: string;
};

const normalizeDate = (dateString: string) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getRangeForDate = (date: Date, ranges: Range[]) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return ranges.find((r) => {
    const start = normalizeDate(r.check_in_date);
    const end = normalizeDate(r.check_out_date);
    return normalizedDate >= start && normalizedDate < end;
  });
};

export const BlockedCalendar = ({
  blockedRanges,
  months = 3,
}: {
  blockedRanges: Range[];
  months?: number;
}) => {
  const monthsArr = Array.from({ length: months }).map((_, i) =>
    addMonths(new Date(), i),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {monthsArr.map((m, idx) => {
        const start = startOfMonth(m);
        const end = endOfMonth(m);
        const days = eachDayOfInterval({ start, end });
        return (
          <div key={idx} className="bg-card p-3 rounded-md">
            <div className="text-center font-semibold mb-2">
              {format(m, "MMMM yyyy")}
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-muted-foreground">
                  {d}
                </div>
              ))}
              {days.map((day) => {
                const range = getRangeForDate(day, blockedRanges);
                const isPending = range?.status === "pending";
                const className = isPending
                  ? "bg-yellow-400 text-black"
                  : range
                    ? "bg-red-600 text-white"
                    : "bg-transparent text-foreground";

                return (
                  <div
                    key={day.toISOString()}
                    className={`h-8 flex items-center justify-center rounded ${className}`}
                  >
                    {format(day, "d")}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlockedCalendar;
