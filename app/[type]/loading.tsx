/** โครงหน้าตารางระหว่างรอ server render — กันหน้าค้าง/ว่าง */
export default function AssetTableLoading() {
  return (
    <div className="panel" aria-busy="true" aria-label="กำลังโหลด">
      <div className="toolbar">
        <div className="search">
          <div className="sk" style={{ height: 48, width: "100%" }} />
        </div>
        <div className="sk" style={{ height: 48, width: 180 }} />
        <div className="sk" style={{ height: 48, width: 130 }} />
        <div className="sk" style={{ height: 48, width: 130 }} />
      </div>
      <div className="card">
        <div className="tablewrap" style={{ padding: 16 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              className="sk"
              key={i}
              style={{ height: 20, margin: "14px 0" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
