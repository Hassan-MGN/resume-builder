import React from "react";
import { pdf } from "@react-pdf/renderer";
import { ResumePdfDocument, PDF_TEMPLATE_CONFIG } from "./ResumePdfDocument";

export const generateResumePdf = async ({ resume, template, theme, layout }) => {
  if (!resume || typeof resume !== "object") {
    throw new Error("Resume data was not found.");
  }

  const safeTemplate = Object.prototype.hasOwnProperty.call(PDF_TEMPLATE_CONFIG, template)
    ? template
    : "Professional";

  const document = React.createElement(ResumePdfDocument, {
    resume,
    template: safeTemplate,
    theme,
    layout,
  });

  const instance = pdf(document);
  const blob = await instance.toBlob();

  if (!(blob instanceof Blob) || blob.size < 100) {
    throw new Error("PDF generation returned an invalid or empty file.");
  }

  return blob;
};
