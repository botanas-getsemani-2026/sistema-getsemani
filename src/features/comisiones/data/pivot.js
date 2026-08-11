export function buildDailyVendorPivot(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return { days: [], vendors: [], cells: {}, dayTotals: {}, grandTotal: 0 }
  }

  const daySet = new Set()
  const vendorSet = new Set()
  const cells = {}

  for (const row of rows) {
    const day = row.dia
    const vendor = row.vendedor
    if (!day || !vendor) continue
    daySet.add(day)
    vendorSet.add(vendor)
    if (!cells[vendor]) cells[vendor] = {}
    cells[vendor][day] = (cells[vendor][day] ?? 0) + Number(row.total ?? 0)
  }

  const days = [...daySet].sort()
  const vendors = [...vendorSet].sort()

  const dayTotals = {}
  for (const day of days) {
    dayTotals[day] = vendors.reduce((acc, vendor) => acc + (cells[vendor]?.[day] ?? 0), 0)
  }

  const grandTotal = Object.values(dayTotals).reduce((acc, v) => acc + v, 0)

  return { days, vendors, cells, dayTotals, grandTotal }
}
