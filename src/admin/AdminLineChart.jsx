const money = (v) => `₦${Number(v || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

function AdminLineChart({ data = [], dataKey, title, subtitle, format = money, lineClass = "text-g3-purple", fillClass = "fill-g3-purple/10" }) {
  const width = 900;
  const height = 300;
  const padding = { top: 25, right: 30, bottom: 45, left: 75 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const values = data.map((item) => Number(item?.[dataKey] || 0));
  const maxValue = Math.max(...values, 1);
  const getX = (index) => data.length <= 1 ? padding.left + chartWidth / 2 : padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (value) => padding.top + chartHeight - (value / maxValue) * chartHeight;
  const points = data.map((item, index) => ({ x: getX(index), y: getY(Number(item?.[dataKey] || 0)), value: Number(item?.[dataKey] || 0), label: item?.label || item?.date || "" }));
  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = points.length ? [`${points[0].x},${padding.top + chartHeight}`, ...points.map((point) => `${point.x},${point.y}`), `${points[points.length - 1].x},${padding.top + chartHeight}`].join(" ") : "";
  const labelIndexes = data.length <= 7 ? data.map((_, i) => i) : [0, Math.floor(data.length / 4), Math.floor(data.length / 2), Math.floor((data.length * 3) / 4), data.length - 1];
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-g3-purple">Analytics</p>
          <h3 className="mt-1 text-base font-black">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-black/40">{subtitle}</p>}
        </div>
        <div className="text-right"><p className="text-xs font-black text-g3-purple">{format(total)}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-black/30">Total</p></div>
      </div>
      <div className="mt-6 overflow-x-auto">
        {!data.length ? <div className="flex h-64 items-center justify-center rounded-2xl bg-[#f8f6fb] text-sm font-bold text-black/35">No data for this period.</div> : (
          <svg viewBox={`0 0 ${width} ${height}`} className="h-64 min-w-[650px] w-full" role="img" aria-label={title}>
            {[0, .25, .5, .75, 1].map((ratio) => {
              const y = padding.top + chartHeight - ratio * chartHeight;
              return <g key={ratio}><line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="currentColor" className="text-black/5" /><text x={padding.left - 12} y={y + 4} textAnchor="end" fontSize="11" className="fill-black/35">{format(maxValue * ratio)}</text></g>;
            })}
            {points.length > 1 && <polygon points={areaPoints} className={fillClass} />}
            {points.length > 1 && <polyline points={linePoints} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={lineClass} />}
            {points.map((point, index) => <g key={`${point.label}-${index}`}><circle cx={point.x} cy={point.y} r="6" className={`fill-white stroke-g3-purple`} strokeWidth="3" /><title>{point.label}: {format(point.value)}</title></g>)}
            {labelIndexes.map((index) => { const point = points[index]; return point ? <text key={`label-${index}`} x={point.x} y={height - 12} textAnchor="middle" fontSize="11" className="fill-black/35">{point.label}</text> : null; })}
          </svg>
        )}
      </div>
    </div>
  );
}

export default AdminLineChart;
