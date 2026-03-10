import { useState, useRef } from "react";
import {
  useUpdateSiteVisit,
  useAddVisitPhotos,
  useAddVisitDocuments,
  useDeleteVisitPhoto,
  useDeleteVisitDocument,
} from "../../api/hooks/useSiteVisit";

import styles from "./EditSiteVisitPopup.module.scss";

const TABS = [
  { id: "info", label: "Info", icon: "🗒️" },
  { id: "documents", label: "Documents", icon: "📎" },
];

export default function EditSiteVisitPopup({ visit, onClose }) {
  const { mutate: updateVisit, isPending } = useUpdateSiteVisit();
  const { mutate: addPhotos } = useAddVisitPhotos();
  const { mutate: addDocuments } = useAddVisitDocuments();
  const { mutate: deletePhoto } = useDeleteVisitPhoto();
  const { mutate: deleteDocument } = useDeleteVisitDocument();

  const [activeTab, setActiveTab] = useState("info");

  const [title, setTitle] = useState(visit.title || "");
  const [description, setDescription] = useState(visit.description || "");
  const [locationNote, setLocationNote] = useState(visit.locationNote || "");
  const [visitDateTime, setVisitDateTime] = useState(
    visit.visitDateTime?.slice(0, 16) || "",
  );

  const [newPhotos, setNewPhotos] = useState([]);
  const [newDocuments, setNewDocuments] = useState([]);

  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);

  // Count total docs for badge
  const totalDocs =
    (visit.photos?.length ?? 0) +
    (visit.documents?.length ?? 0) +
    newPhotos.length +
    newDocuments.length;

  const handleSubmit = () => {
    updateVisit(
      { id: visit.id, title, description, locationNote, visitDateTime },
      {
        onSuccess: () => {
          if (newPhotos.length) addPhotos(visit.id, newPhotos);
          if (newDocuments.length) addDocuments(visit.id, newDocuments);
          onClose();
        },
      },
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {/* ── HEADER ── */}
        <div className={styles.header}>
          <h3>Edit Site Visit</h3>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* ── TABS ── */}
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
              {tab.id === "documents" && totalDocs > 0 && (
                <span className={styles.tabBadge}>{totalDocs}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── BODY ── */}
        <div className={styles.body}>
          {/* ── INFO PANEL ── */}
          <div
            className={`${styles.tabPanel} ${activeTab === "info" ? styles.visible : ""}`}
          >
            <div className={styles.formGroup}>
              <label>Visit Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Foundation Inspection"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the site visit…"
              />
            </div>

            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label>Location Note</label>
                <input
                  value={locationNote}
                  onChange={(e) => setLocationNote(e.target.value)}
                  placeholder="e.g. Block B, Level 3"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Visit Date & Time</label>
                <input
                  type="datetime-local"
                  value={visitDateTime}
                  onChange={(e) => setVisitDateTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ── DOCUMENTS PANEL ── */}
          <div
            className={`${styles.tabPanel} ${activeTab === "documents" ? styles.visible : ""}`}
          >
            {/* Photos section */}
            <div>
              <p className={styles.sectionLabel}>Photos</p>
              <div className={styles.sectionCard}>
                {visit.photos?.length > 0 ? (
                  <div className={styles.photoGrid}>
                    {visit.photos.map((photo) => (
                      <div key={photo.id} className={styles.photoItem}>
                        <img src={photo.imageUrl} alt="" />
                        <button
                          className={styles.photoDeleteBtn}
                          title="Remove photo"
                          onClick={() =>
                            deletePhoto({
                              visitId: visit.id,
                              photoId: photo.id,
                            })
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>🖼️</span>
                    No photos yet
                  </div>
                )}

                {/* New photos preview */}
                {newPhotos.length > 0 && (
                  <div className={styles.photoGrid}>
                    {newPhotos.map((file, i) => (
                      <div key={i} className={styles.photoItem}>
                        <img src={URL.createObjectURL(file)} alt="" />
                        <button
                          className={styles.photoDeleteBtn}
                          title="Remove"
                          onClick={() =>
                            setNewPhotos((prev) =>
                              prev.filter((_, j) => j !== i),
                            )
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add photos */}
                <div className={styles.addRow}>
                  <div className={styles.addBtnWrapper}>
                    <button className={styles.addBtn}>
                      <span className={styles.addIcon}>＋</span> Add Photos
                    </button>
                    <input
                      type="file"
                      ref={photoInputRef}
                      accept="image/*"
                      multiple
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0,
                        cursor: "pointer",
                      }}
                      onChange={(e) =>
                        setNewPhotos((prev) => [...prev, ...e.target.files])
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Documents section */}
            <div>
              <p className={styles.sectionLabel}>Documents</p>
              <div className={styles.sectionCard}>
                {visit.documents?.length > 0 ? (
                  <div className={styles.docList}>
                    {visit.documents.map((doc) => (
                      <div key={doc.id} className={styles.docItem}>
                        <span className={styles.docIcon}>📄</span>
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.docName}
                          title={doc.documentName || "Document"}
                        >
                          {doc.documentName || "Document"}
                        </a>
                        <button
                          className={styles.docDeleteBtn}
                          title="Delete document"
                          onClick={() =>
                            deleteDocument({
                              visitId: visit.id,
                              documentId: doc.id,
                            })
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📁</span>
                    No documents yet
                  </div>
                )}

                {/* New docs preview */}
                {newDocuments.length > 0 && (
                  <div className={styles.docList}>
                    {newDocuments.map((file, i) => (
                      <div key={i} className={styles.docItem}>
                        <span className={styles.docIcon}>📄</span>
                        <span className={styles.docName}>{file.name}</span>
                        <button
                          className={styles.docDeleteBtn}
                          title="Remove"
                          onClick={() =>
                            setNewDocuments((prev) =>
                              prev.filter((_, j) => j !== i),
                            )
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add documents */}
                <div className={styles.addRow}>
                  <div className={styles.addBtnWrapper}>
                    <button className={styles.addBtn}>
                      <span className={styles.addIcon}>＋</span> Add Documents
                    </button>
                    <input
                      type="file"
                      ref={docInputRef}
                      multiple
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0,
                        cursor: "pointer",
                      }}
                      onChange={(e) =>
                        setNewDocuments((prev) => [...prev, ...e.target.files])
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Updating…" : "Update Visit"}
          </button>
        </div>
      </div>
    </div>
  );
}
