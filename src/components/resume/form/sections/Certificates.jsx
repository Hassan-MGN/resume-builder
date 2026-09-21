import { AnimatePresence } from "framer-motion";


import ItemCard from "../ui/ItemCard";
import Input from "../ui/Input";
import AddButton from "../ui/AddButton";

const Certificates = ({
  certificates,
  updateArrayItem,
  removeArrayItem,
  addCertificate,
  openSection,
  toggleSection,
}) => {
  return (
    <>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {certificates.map((certificate, index) => (
              <ItemCard key={index} index={index} title={ certificate.name || `Certificate ${index + 1}`} subtitle={certificate.issuer || "Professional certification"} onRemove={() => removeArrayItem("certificates",index)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Certificate Name" placeholder="AWS Certified Developer" value={certificate.name} onChange={(value) => updateArrayItem("certificates", index, "name", value)}/>
                  <Input label="Issuing Organization" placeholder="Amazon Web Services" value={certificate.issuer} onChange={(value) => updateArrayItem("certificates",index,"issuer",value)}/>
                  <Input label="Issue Date" placeholder="Jan 2025" value={certificate.issueDate} onChange={(value) => updateArrayItem("certificates",index,"issueDate",value)}/>
                  <Input label="Expiry Date" placeholder="Jan 2028 / Does not expire" value={certificate.expiryDate} onChange={(value) => updateArrayItem("certificates",index,"expiryDate",value)}/>
                  <Input label="Credential ID" placeholder="ABC123XYZ" value={certificate.credentialId} onChange={(value) => updateArrayItem("certificates",index,"credentialId",value)}/>
                  <Input label="Credential URL" placeholder="https://..." value={certificate.credentialUrl} onChange={(value) => updateArrayItem("certificates", index, "credentialUrl",value)}/>
                </div>
              </ItemCard>
            )
          )}
        </AnimatePresence>
      </div>
      <AddButton onClick={addCertificate}>+ Add certificate</AddButton>
    </>
  );
};

export default Certificates