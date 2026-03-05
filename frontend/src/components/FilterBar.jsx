// FilterBar — chọn filter All / Active / Done + nút clear completed
// Props:
//   filter         — 'all' | 'active' | 'done'
//   setFilter      — hàm đổi filter
//   counts         — { all, active, done }
//   onClearDone    — xoá hết todo đã hoàn thành

export default function FilterBar({ filter, setFilter, counts, onClearDone }) {
  const filters = [
    { key: 'all',    label: 'All',    count: counts.all    },
    { key: 'active', label: 'Active', count: counts.active },
    { key: 'done',   label: 'Done',   count: counts.done   },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-tabs">
        {filters.map(f => (
          <button
            key={f.key}
            className={`filter-tab ${filter === f.key ? 'filter-tab--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span className="filter-count">{f.count}</span>
          </button>
        ))}
      </div>

      {counts.done > 0 && (
        <button className="btn-clear" onClick={onClearDone}>
          Clear done
        </button>
      )}
    </div>
  );
}
