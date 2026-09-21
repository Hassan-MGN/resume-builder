# Resummetry PDF Export

Resummetry now uses `@react-pdf/renderer` for downloadable PDFs instead of rasterizing the browser preview with html2canvas/jsPDF.

The PDF renderer builds an A4 document from the same resume data, template selection, theme colors, section order and document scale used by the workspace. Text remains real PDF text, so output is sharper at high zoom and page boundaries are controlled by A4 `<Page>` containers rather than by screenshot slicing.

Install dependencies with:

```bash
npm install
```

Then run:

```bash
npm run dev
```

The app calls `pdf(...).toBlob()` when the PDF button is pressed. This is supported by react-pdf's browser renderer and its built-in A4 page-wrapping model.
