// import { useState } from "react";
// import { useCreateSiteVisit } from "../../api/hooks/useSiteVisit";
// import styles from "./AddSiteVisitPopup.module.scss";

// export default function AddSiteVisitPopup({ projectId, onClose }) {
//   const { mutate, isPending } = useCreateSiteVisit();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [locationNote, setLocationNote] = useState("");
//   const [visitDateTime, setVisitDateTime] = useState("");

//   const [photos, setPhotos] = useState([]);
//   const [documents, setDocuments] = useState([]);

//   const handleSubmit = () => {
//     mutate(
//       {
//         projectId,
//         title,
//         description,
//         locationNote,
//         visitDateTime,
//         photos,
//         documents,
//       },
//       {
//         onSuccess: () => {
//           onClose();
//         },
//       },
//     );
//   };

//   return (
//     <div className={styles.popupOverlay} onClick={onClose}>
//       <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
//         <div className={styles.popupHeader}>
//           <h3>Add Site Visit</h3>
//           <button onClick={onClose}>✕</button>
//         </div>

//         <div className={styles.popupContent}>
//           <input
//             placeholder="Visit Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           <textarea
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />

//           <input
//             placeholder="Location Note"
//             value={locationNote}
//             onChange={(e) => setLocationNote(e.target.value)}
//           />

//           <input
//             type="datetime-local"
//             value={visitDateTime}
//             onChange={(e) => setVisitDateTime(e.target.value)}
//           />

//           <label>Photos</label>
//           <input
//             type="file"
//             multiple
//             onChange={(e) => setPhotos([...e.target.files])}
//           />

//           <label>Documents</label>
//           <input
//             type="file"
//             multiple
//             onChange={(e) => setDocuments([...e.target.files])}
//           />
//         </div>

//         <div className={styles.popupFooter}>
//           <button onClick={onClose}>Cancel</button>

//           <button onClick={handleSubmit} disabled={isPending}>
//             {isPending ? "Saving..." : "Create Visit"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useCreateSiteVisit } from "../../api/hooks/useSiteVisit";
import styles from "./AddSiteVisitPopup.module.scss";

export default function AddSiteVisitPopup({ projectId, onClose }) {
  const { mutate, isPending } = useCreateSiteVisit();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationNote, setLocationNote] = useState("");
  const [visitDateTime, setVisitDateTime] = useState("");

  const [photos, setPhotos] = useState([]);
  const [documents, setDocuments] = useState([]);

  const handleSubmit = () => {
    mutate(
      {
        projectId,
        title,
        description,
        locationNote,
        visitDateTime,
        photos,
        documents,
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
        {/* HEADER */}
        <div className={styles.header}>
          <h3>Add Site Visit</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className={styles.body}>
          <div className={styles.formGroup}>
            <label>Visit Title</label>
            <input
              type="text"
              placeholder="Foundation inspection"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              rows="3"
              placeholder="Enter visit description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Location Note</label>
              <input
                type="text"
                placeholder="Basement / Terrace"
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Visit Date</label>
              <input
                type="datetime-local"
                value={visitDateTime}
                onChange={(e) => setVisitDateTime(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Photos</label>
              <input
                type="file"
                multiple
                onChange={(e) => setPhotos([...e.target.files])}
              />
            </div>
            <br />
            <div className={styles.formGroup}>
              <label>Documents</label>
              <input
                type="file"
                multiple
                onChange={(e) => setDocuments([...e.target.files])}
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Create Visit"}
          </button>
        </div>
      </div>
    </div>
  );
}
