# Resummetry PDF export quality pass

This build changes PDF generation in two important ways:

1. Rendering quality is increased from the previous capped device-pixel-ratio scale to a fixed 3x export scale, and each page is embedded as lossless PNG instead of JPEG. This keeps small resume text and thin rules noticeably sharper.
2. Multi-page export no longer cuts every page at a blind 1123px boundary. Resume sections are marked with `data-pdf-section` and the exporter searches near each nominal A4 boundary for a nearby section start, reducing section cuts at the bottom of one page and improving the top/bottom white space on following pages.

The exporter also keeps the existing Oklab/Oklch normalization for html2canvas compatibility and removes editor-only controls from the export clone.

## Recommended local verification

Create a deliberately long resume and export it as PDF. Check:
- text remains sharp when zoomed to 200-400%
- page 1 does not end in the middle of a section when a section heading is close to the page boundary
- page 2 starts cleanly and does not touch the paper edge
- all templates preserve their A4 width and right/left margins
- 2-3 page resumes do not show horizontal clipping

The uploaded two-page reference PDF is itself a jsPDF-generated document, so this pass focuses on matching its crisp visual appearance while improving the page-boundary behavior the reference demonstrates is important.
