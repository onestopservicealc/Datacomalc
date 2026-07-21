/** โครงหน้าภาพรวมระหว่างรอ server render — กันหน้าค้าง/ว่าง */
export default function DashboardLoading() {
  return (
    <div className="panel" aria-busy="true" aria-label="กำลังโหลด">
      <div className="stats">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="stat" key={i}>
            <div className="sk" style={{ height: 14, width: "60%" }} />
            <div className="sk" style={{ height: 34, width: "40%", marginTop: 10 }} />
          </div>
        ))}
      </div>
      <div className="grid2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="block" key={i}>
            <div className="sk" style={{ height: 16, width: "45%", marginBottom: 16 }} />
            {Array.from({ length: 6 }).map((_, j) => (
              <div className="sk" key={j} style={{ height: 14, margin: "11px 0" }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
