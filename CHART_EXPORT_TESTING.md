# 🧪 Chart Export Testing Guide

## Fixed Issue
✅ **Chart instance access fixed** - PNG and SVG exports now work correctly by capturing ECharts instances via the `(chartInit)` event.

---

## How It Works

### Chart Instance Capture
Each chart now properly stores its ECharts instance when it initializes:

```typescript
// Template
<div echarts
  [options]="workflowStatusOption"
  (chartInit)="onChartInit($event, 'workflow-status')">
</div>

// Component
private chartInstances = new Map<string, any>();

onChartInit(chartInstance: any, chartId: string): void {
  this.chartInstances.set(chartId, chartInstance);
}
```

### Export Flow
1. User clicks export button in chart toolbar
2. Dropdown shows 3 format options
3. User selects format (CSV, PNG, or JSON)
4. System retrieves stored chart instance
5. Export service generates file
6. Browser downloads file automatically

---

## Testing Checklist

### ✅ CSV Export Testing
Navigate to **Analytics** tab and test each chart:

1. **Workflow Status Chart**
   - Click export dropdown → Select "Export CSV"
   - ✓ File downloads as `workflow-status_YYYYMMDD.csv`
   - ✓ Contains columns: Status, Count, Percentage
   - ✓ Data matches chart visualization
   - ✓ Opens correctly in Excel/Google Sheets

2. **Workload by Department Chart**
   - Click export → CSV
   - ✓ Contains: Department, Project Count
   - ✓ All departments listed

3. **Budget Utilization Chart**
   - Click export → CSV
   - ✓ Contains: Project, Start Date, Budget Allocated, Budget Spent, Utilization %
   - ✓ Dates formatted correctly

4. **Delay Analysis Chart**
   - Click export → CSV
   - ✓ Contains: Project, Delay Days, Status, Department
   - ✓ Only delayed projects included

5. **Risk vs Reward Chart**
   - Click export → CSV
   - ✓ Contains: Project, Risk Score, Reward Score, Department, Status
   - ✓ All projects included

6. **Efficiency Heatmap**
   - Click export → CSV
   - ✓ Contains: Department, Region, Avg Efficiency %, Project Count
   - ✓ One row per dept-region combination

7. **Resource Allocation Chart**
   - Click export → CSV
   - ✓ Contains: Department, Avg Progress %, Avg Efficiency %, etc.
   - ✓ All metrics calculated correctly

8. **Task Phase Distribution**
   - Click export → CSV
   - ✓ Contains: Department, Planning, Execution, Monitoring, Closure
   - ✓ Phase counts correct

### ✅ JSON Export Testing
Repeat for all 8 charts:
- Click export → Select "Export JSON"
- ✓ File downloads as `{chart-name}_YYYYMMDD.json`
- ✓ Valid JSON format
- ✓ Contains `title`, `exportedAt`, `headers`, `data` properties
- ✓ Data property is array of objects
- ✓ Can be parsed by JSON.parse()

### ✅ PNG Export Testing
**IMPORTANT**: This was the main bug fix!

For each chart:
1. Click export dropdown → Select "Export PNG"
2. ✓ File downloads as `{chart-name}_YYYYMMDD.png`
3. ✓ Image quality is high (2x pixel ratio)
4. ✓ Chart appears correctly in image
5. ✓ Colors match original chart
6. ✓ Text is readable
7. ✓ Background is white
8. ✓ No truncation or clipping

**Test Cases**:
- Small screen (reduce browser width)
- Dark mode (toggle dark mode before export)
- After filtering data (apply filters, then export)

### ~~SVG Export Testing~~
**Note**: SVG export has been removed and is no longer available in the UI.

### ✅ Fullscreen Mode Testing
For each chart:
1. Click fullscreen button (⛶ icon)
2. ✓ Chart card enters fullscreen
3. ✓ Chart resizes to fill screen
4. ✓ Toolbar remains visible
5. ✓ Click fullscreen again (X icon)
6. ✓ Returns to normal view
7. ✓ Press ESC key
8. ✓ Exits fullscreen

### ✅ Browser Compatibility
Test exports in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

### ✅ Edge Cases
1. **Empty Data**
   - Filter to show 0 projects
   - Try exporting
   - ✓ CSV/JSON export with headers only
   - ✓ PNG/SVG shows empty chart gracefully

2. **Large Dataset**
   - Generate 100+ projects
   - Export all formats
   - ✓ CSV contains all rows
   - ✓ PNG/SVG render without issues

3. **Special Characters**
   - Projects with names containing: `,`, `"`, `\n`
   - Export to CSV
   - ✓ Special characters properly escaped
   - ✓ Opens correctly in Excel

4. **Rapid Clicks**
   - Click export → CSV multiple times quickly
   - ✓ Multiple files download
   - ✓ Each has unique timestamp
   - ✓ No errors in console

5. **Network Offline**
   - Disconnect internet
   - Try all exports
   - ✓ All exports work (client-side only)

---

## Expected Results

### CSV Files
```csv
Status,Count,Percentage
On Track,12,25.0%
In Progress,30,62.5%
Delayed,4,8.3%
Blocked,2,4.2%
```

### JSON Files
```json
{
  "title": "Workflow Status",
  "exportedAt": "2026-01-06T18:53:19.882Z",
  "headers": ["Status", "Count", "Percentage"],
  "data": [
    {
      "Status": "On Track",
      "Count": 12,
      "Percentage": "25.0%"
    }
  ]
}
```

### PNG Files
- High resolution (2x pixel ratio)
- White background
- Crisp text and graphics
- Typical size: 50-200 KB depending on chart complexity

### SVG Files
- Scalable vector format
- Can zoom infinitely without quality loss
- Editable in design software
- Typical size: 10-100 KB

---

## Common Issues & Solutions

### Issue: PNG export shows blank image
**Solution**: ✅ Fixed! Chart instances now properly captured via `(chartInit)` event

### Issue: SVG export fails
**Solution**: ✅ Fixed! Using proper ECharts instance reference

### Issue: CSV has garbled characters in Excel
**Solution**: Open with "From Text/CSV" and select UTF-8 encoding

### Issue: Fullscreen doesn't work
**Solution**: Check browser supports Fullscreen API (all modern browsers do)

### Issue: Export dropdown doesn't close
**Solution**: Click outside dropdown or press ESC key

---

## Performance Benchmarks

| Operation | Expected Time | File Size |
|-----------|---------------|-----------|
| CSV Export | < 100ms | 1-10 KB |
| JSON Export | < 100ms | 2-20 KB |
| PNG Export | < 500ms | 50-200 KB |
| SVG Export | < 500ms | 10-100 KB |
| Fullscreen Toggle | Instant | N/A |

---

## Accessibility Testing

### Keyboard Navigation
1. Tab to chart toolbar
2. ✓ Export button receives focus
3. ✓ Focus indicator visible
4. Press Enter
5. ✓ Dropdown opens
6. Press Arrow Down
7. ✓ Navigate through options
8. Press Enter
9. ✓ Export triggered
10. Press ESC
11. ✓ Dropdown closes

### Screen Reader
1. Navigate to chart with screen reader
2. ✓ Chart title announced
3. ✓ Export button announced with label
4. ✓ Dropdown options announced
5. ✓ Fullscreen button announced

---

## Success Criteria

All exports should:
- ✅ Download without errors
- ✅ Generate valid files
- ✅ Contain accurate data
- ✅ Have proper filenames with timestamps
- ✅ Work in all major browsers
- ✅ Be accessible via keyboard
- ✅ Show toast notifications

---

## Next Steps After Testing

Once all tests pass:
1. Mark all todos as completed
2. Document any edge cases found
3. Consider adding automated tests
4. Move to next roadmap feature (Advanced Filters)

---

## Automated Testing (Future)

Consider adding E2E tests:
```typescript
describe('Chart Exports', () => {
  it('should export workflow status chart as CSV', () => {
    cy.visit('/analytics');
    cy.get('[data-testid="workflow-chart-export"]').click();
    cy.contains('Export CSV').click();
    cy.readFile('downloads/workflow-status_*.csv').should('exist');
  });
});
```
