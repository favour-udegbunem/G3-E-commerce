import { CalendarDays } from "lucide-react";

function AdminDateRange({ startDate, endDate, setStartDate, setEndDate, onApply, loading = false }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-g3-purple">Date range</p>
          <h3 className="mt-1 text-sm font-black">Map G3 activity by day</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-xs font-bold text-black/45">
            From
            <div className="relative mt-1.5">
              <CalendarDays size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
              <input type="date" value={startDate} max={endDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 rounded-xl border border-black/10 bg-white pl-9 pr-3 text-sm font-bold outline-none focus:border-g3-purple" />
            </div>
          </label>
          <label className="text-xs font-bold text-black/45">
            To
            <div className="relative mt-1.5">
              <CalendarDays size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
              <input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} className="h-11 rounded-xl border border-black/10 bg-white pl-9 pr-3 text-sm font-bold outline-none focus:border-g3-purple" />
            </div>
          </label>
          <button type="button" onClick={onApply} disabled={loading} className="h-11 rounded-xl bg-g3-purple px-5 text-xs font-black text-white transition hover:bg-g3-pink disabled:opacity-50">
            {loading ? "Loading..." : "Apply dates"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDateRange;
