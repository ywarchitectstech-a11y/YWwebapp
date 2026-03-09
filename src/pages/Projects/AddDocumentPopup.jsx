// import { useState } from "react";
// import { useAddStageDocument } from "../../api/hooks/useStageDocuments";
// import styles from "./AddDocumentPopup.module.scss";

// export default function AddDocumentPopup({ stage, onClose }) {
//   const [documentName, setDocumentName] = useState("");
//   const [documentType, setDocumentType] = useState("");
//   const [file, setFile] = useState(null);
//   const { mutate, isPending } = useAddStageDocument();

//   const handleUpload = () => {
//     if (!documentName || !documentType || !file) {
//       alert("Please select document name, type and file");
//       return;
//     }

//     mutate(
//       {
//         stageId: stage.id,
//         documentName,
//         documentType,
//         file,
//       },
//       {
//         onSuccess: () => {
//           onClose();
//         },
//       },
//     );
//   };

//   return (
//     <div className={styles.overlay} onClick={onClose}>
//       <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
//         <div className={styles.header}>
//           <h3>Add Document</h3>
//           <button onClick={onClose}>✕</button>
//         </div>

//         <div className={styles.body}>
//           <div className={styles.field}>
//             <label>Stage</label>
//             <span>{stage.customStageName || stage.stageName}</span>
//           </div>

//           <div className={styles.field}>
//             <label>Document Name</label>
//             <select onChange={(e) => setDocumentType(e.target.value)}>
//               <option value="">Select Type</option>
//               <option value="APPLICATION">Application</option>
//               <option value="NOC">NOC</option>
//               <option value="CERTIFICATE">Certificate</option>
//               <option value="DRAWING">Drawing</option>
//               <option value="LEGAL_DOCUMENT">Legal Document</option>
//               <option value="REPORT">Report</option>
//               <option value="CLEARANCE">Clearance</option>
//               <option value="RECEIPT">Receipt</option>
//               <option value="OTHER">Other</option>
//             </select>
//           </div>

//           <div className={styles.field}>
//             <label>Upload File</label>
//             <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//           </div>
//         </div>

//         <div className={styles.footer}>
//           <button className={styles.cancelBtn} onClick={onClose}>
//             Cancel
//           </button>

//           <button
//             className={styles.uploadBtn}
//             onClick={handleUpload}
//             disabled={isPending}
//           >
//             {isPending ? "Uploading..." : "Upload Document"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useAddStageDocument } from "../../api/hooks/useStageDocuments";
import styles from "./AddDocumentPopup.module.scss";

export default function AddDocumentPopup({ stage, onClose }) {
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const { mutate, isPending } = useAddStageDocument();

  const handleUpload = () => {
    if (!documentName || !documentType || !file) {
      alert("Please fill required fields and upload file");
      return;
    }

    mutate(
      {
        stageId: stage.id,
        documentName,
        documentType,
        description,
        file,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h3>Add Document</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Stage */}
          <div className={styles.field}>
            <label>Stage</label>
            <span>{stage.customStageName || stage.stageName}</span>
          </div>

          {/* Document Name */}
          <div className={styles.field}>
            <label>Document Name</label>
            <input
              type="text"
              placeholder="Enter document name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
          </div>

          {/* Document Type */}
          <div className={styles.field}>
            <label>Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="APPLICATION">Application</option>
              <option value="NOC">NOC</option>
              <option value="CERTIFICATE">Certificate</option>
              <option value="DRAWING">Drawing</option>
              <option value="LEGAL_DOCUMENT">Legal Document</option>
              <option value="REPORT">Report</option>
              <option value="CLEARANCE">Clearance</option>
              <option value="RECEIPT">Receipt</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label>Description</label>
            <textarea
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div className={styles.field}>
            <label>Upload File</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            className={styles.uploadBtn}
            onClick={handleUpload}
            disabled={isPending}
          >
            {isPending ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      </div>
    </div>
  );
}
