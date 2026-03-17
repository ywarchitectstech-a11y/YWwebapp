// import {
//   usePreSalesList,
//   useDeletePreSales,
//   useUpdatePreSalesStatus,
// } from "../../api/hooks/usePreSales";
// import { useConvertToPostSales } from "../../api/hooks/usePostSales";
// import styles from "./AllPreSales.module.scss";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// import {
//   showSuccess,
//   showError,
//   showLoading,
//   dismissToast,
// } from "../../components/Notification/toast";

// const AllPreSales = () => {
//   const { data, isLoading, isError, error } = usePreSalesList();
//   const navigate = useNavigate();
//   const { mutate: deletePreSale } = useDeletePreSales();

//   const { mutate } = useConvertToPostSales();

//   const [editingStatus, setEditingStatus] = useState(null);

//   const { mutate: updateStatus } = useUpdatePreSalesStatus();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);

//   const openConvertModal = (id) => {
//     setSelectedId(id);
//     setIsModalOpen(true);
//   };
//   const handleConfirmConvert = () => {
//     const loadingToast = showLoading("Converting to PostSales...");

//     mutate(selectedId, {
//       onSuccess: () => {
//         dismissToast(loadingToast);
//         showSuccess("Converted to PostSales successfully");
//         setIsModalOpen(false);
//       },
//       onError: (error) => {
//         console.log("ERROR OBJECT:", error);
//         console.log("RESPONSE:", error?.response?.data);
//         dismissToast(loadingToast);
//         showError(error?.response?.data?.message || "Conversion failed");
//       },
//     });
//   };
//   const handleStatusChange = (srNumber, newStatus) => {
//     const loadingToast = showLoading("Updating status...");
//     updateStatus(
//       { srNumber, status: newStatus },
//       {
//         onSuccess: () => {
//           dismissToast(loadingToast);
//           showSuccess("Status updated successfully");
//           setEditingStatus(null);
//         },
//         onError: (error) => {
//           dismissToast(loadingToast);
//           showError(
//             error?.response?.data?.message || "Failed to update status",
//           );
//         },
//       },
//     );
//   };
//   if (isLoading) {
//     return (
//       <div className={styles.pageWrapper}>
//         <div className={styles.loading}>Loading PreSales...</div>
//       </div>
//     );
//   }

//   if (isError) {
//     console.log("ERROR OBJECT:", error);
//     console.log("RESPONSE:", error?.response?.data);

//     return (
//       <div className={styles.pageWrapper}>
//         <div className={styles.error}>Something went wrong.</div>
//       </div>
//     );
//   }

//   const handleEdit = (item) => {
//     navigate(`/presales/edit/${item.srNumber}`);
//   };
//   return (
//     <div className={styles.pageWrapper}>
//       {/* <div className={styles.breadcrumb}>Pre-Sales &gt; All Pre-Sales</div> */}

//       <div className={styles.pageHeader}>
//         <h1 className={styles.pageTitle}>Enquiry List</h1>
//       </div>

//       {data?.length === 0 ? (
//         <div className={styles.emptyState}>
//           <div className={styles.emptyIcon}>📄</div>
//           <div className={styles.emptyTitle}>No PreSales Found</div>
//           <div className={styles.emptyText}>
//             Start by adding a new PreSales entry.
//           </div>
//         </div>
//       ) : (
//         <div className={styles.tableWrapper}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Sr No</th>
//                 <th>Client</th>
//                 <th>Person</th>
//                 <th>Approached Via</th>
//                 <th>Status</th>
//                 <th>Date</th>
//                 <th>Convert </th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {data?.map((item, index) => (
//                 <tr key={item.srNumber}>
//                   <td>{index + 1} </td>
//                   <td>{item.client?.name}</td>
//                   <td>{item.personName}</td>
//                   <td>{item.approachedVia}</td>
//                   <td>
//                     <div className={styles.statusWrapper}>
//                       <span
//                         className={`${styles.badge} ${
//                           item.status === "Onboarded"
//                             ? styles.badgeSuccess
//                             : styles.badgeDanger
//                         }`}
//                       >
//                         {item.status}
//                       </span>

//                       {/* <button
//                         className={styles.statusEditBtn}
//                         onClick={() => setEditingStatus(item.srNumber)}
//                       >
//                         Change
//                       </button> */}

//                       {/* {editingStatus && (
//                         <StatusChangeModal
//                           currentStatus={
//                             data?.find(
//                               (item) => item.srNumber === editingStatus,
//                             )?.status ?? ""
//                           }
//                           onCancel={() => setEditingStatus(null)}
//                           onConfirm={(newStatus) => {
//                             handleStatusChange(editingStatus, newStatus);
//                             setEditingStatus(null);
//                           }}
//                         />
//                       )} */}
//                     </div>
//                   </td>

//                   <td>{new Date(item.dateTime).toLocaleDateString()}</td>
//                   <td>
//                     <button
//                       className={styles.convertBtn}
//                       onClick={() => openConvertModal(item.srNumber)}
//                     >
//                       Convert
//                     </button>
//                   </td>
//                   <td>
//                     <div className={styles.actionButtons}>
//                       <button
//                         className={styles.editBtn}
//                         onClick={() => handleEdit(item)}
//                       >
//                         Edit
//                       </button>

//                       <button
//                         className={styles.deleteBtn}
//                         onClick={() => {
//                           if (window.confirm("Are you sure?")) {
//                             deletePreSale(item.srNumber);
//                           }
//                         }}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       {isModalOpen && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalBox}>
//             <h3>Convert to Project</h3>

//             <p>
//               Are you sure you want to convert this PreSales into PostSales?
//             </p>

//             <div className={styles.modalActions}>
//               <button
//                 className={styles.cancelBtn}
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Cancel
//               </button>

//               <button
//                 className={styles.confirmBtn}
//                 onClick={handleConfirmConvert}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllPreSales;

// const StatusChangeModal = ({ currentStatus, onCancel, onConfirm }) => {
//   const [selected, setSelected] = useState(currentStatus);

//   return (
//     <div className={styles.modalOverlay} onClick={onCancel}>
//       <div className={styles.statusModal} onClick={(e) => e.stopPropagation()}>
//         {/* Header */}
//         <div className={styles.statusModalHeader}>
//           <div className={styles.statusModalIcon}>🔄</div>
//           <div>
//             <h3 className={styles.statusModalTitle}>Change Status</h3>
//             <p className={styles.statusModalSub}>
//               Select a new status for this record
//             </p>
//           </div>
//           <button className={styles.statusModalClose} onClick={onCancel}>
//             <svg
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//             >
//               <line x1="18" y1="6" x2="6" y2="18" />
//               <line x1="6" y1="6" x2="18" y2="18" />
//             </svg>
//           </button>
//         </div>

//         {/* Options */}
//         <div className={styles.statusOptions}>
//           {["Onboarded", "Not Onboarded"].map((opt) => (
//             <button
//               key={opt}
//               className={`${styles.statusOption} ${selected === opt ? styles.statusOptionSelected : ""}`}
//               onClick={() => setSelected(opt)}
//             >
//               <span className={styles.statusOptionRadio}>
//                 {selected === opt && (
//                   <svg width="10" height="10" viewBox="0 0 10 10">
//                     <circle cx="5" cy="5" r="4" fill="currentColor" />
//                   </svg>
//                 )}
//               </span>
//               <span className={styles.statusOptionLabel}>{opt}</span>
//               {opt === "Onboarded" && (
//                 <span
//                   className={styles.statusOptionBadge}
//                   style={{ background: "#dcfce7", color: "#14532d" }}
//                 >
//                   Active
//                 </span>
//               )}
//               {opt === "Not Onboarded" && (
//                 <span
//                   className={styles.statusOptionBadge}
//                   style={{ background: "#fef9c3", color: "#713f12" }}
//                 >
//                   Pending
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className={styles.statusModalFooter}>
//           <button className={styles.statusCancelBtn} onClick={onCancel}>
//             Cancel
//           </button>
//           <button
//             className={styles.statusConfirmBtn}
//             onClick={() => onConfirm(selected)}
//             disabled={selected === currentStatus}
//           >
//             Apply Change
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

import {
  usePreSalesList,
  useDeletePreSales,
  useUpdatePreSalesStatus,
} from "../../api/hooks/usePreSales";
import {
  useQuotationsByPreSale,
  useCreateQuotation,
} from "../../api/hooks/useQuotation";
import { useConvertToPostSales } from "../../api/hooks/usePostSales";
import styles from "./AllPreSales.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (dt) => {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fmtCurrency = (val) => {
  if (val == null || val === "") return "—";
  return `₹${Number(val).toLocaleString("en-IN")}`;
};

// ─── PreSale Detail Popup ─────────────────────────────────────────────────────
const PreSaleDetailPopup = ({ item, onClose }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showQuotationForm, setShowQuotationForm] = useState(false);

  const { data: quotations = [], isLoading: isQuotLoading } =
    useQuotationsByPreSale(item.srNumber);

  const { mutate: createQuotation, isPending: creatingQuot } =
    useCreateQuotation();

  const [quotForm, setQuotForm] = useState({
    title: "",
    amount: "",
    validTill: "",
    notes: "",
    status: "DRAFT",
  });

  const onQuotChange = (e) =>
    setQuotForm({ ...quotForm, [e.target.name]: e.target.value });

  const handleAddQuotation = () => {
    if (!quotForm.title || !quotForm.amount) return;
    const loadingToast = showLoading("Adding quotation...");
    createQuotation(
      { preSalesId: item.srNumber, quotation: quotForm },
      {
        onSuccess: () => {
          dismissToast(loadingToast);
          showSuccess("Quotation added successfully");
          setShowQuotationForm(false);
          setQuotForm({
            title: "",
            amount: "",
            validTill: "",
            notes: "",
            status: "DRAFT",
          });
        },
        onError: (err) => {
          dismissToast(loadingToast);
          showError(err?.response?.data?.message || "Failed to add quotation");
        },
      },
    );
  };

  const QUOT_STATUS_CFG = {
    DRAFT: { bg: "#f3f4f6", color: "#374151" },
    SENT: { bg: "#dbeafe", color: "#1e40af" },
    ACCEPTED: { bg: "#dcfce7", color: "#14532d" },
    REJECTED: { bg: "#fee2e2", color: "#991b1b" },
    REVISED: { bg: "#fef3c7", color: "#92400e" },
  };

  return (
    <div className={styles.detailOverlay} onClick={onClose}>
      <div className={styles.detailPopup} onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className={styles.detailHeader}>
          <div className={styles.detailHeaderLeft}>
            <div className={styles.detailAvatar}>
              {(item.personName || item.client?.name || "?")[0].toUpperCase()}
            </div>
            <div>
              <h2 className={styles.detailName}>{item.personName || "—"}</h2>
              <div className={styles.detailSubRow}>
                {item.client?.name && (
                  <span className={styles.detailClientChip}>
                    🏢 {item.client.name}
                  </span>
                )}
                <span
                  className={styles.detailStatusBadge}
                  style={
                    item.status === "Onboarded"
                      ? { background: "#dcfce7", color: "#166534" }
                      : { background: "#fee2e2", color: "#b91c1c" }
                  }
                >
                  {item.status}
                </span>
              </div>
            </div>
          </div>
          <button className={styles.detailClose} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className={styles.detailTabs}>
          {[
            { key: "details", label: "Details", icon: "📋" },
            {
              key: "quotations",
              label: "Quotations",
              icon: "📄",
              count: quotations.length,
            },
          ].map((t) => (
            <button
              key={t.key}
              className={`${styles.detailTab} ${activeTab === t.key ? styles.detailTabActive : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.icon} {t.label}
              {t.count > 0 && (
                <span className={styles.detailTabCount}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className={styles.detailBody}>
          {/* ── DETAILS TAB ── */}
          {activeTab === "details" && (
            <div className={styles.detailGrid}>
              {/* Core Info */}
              <div className={styles.detailSection}>
                <div className={styles.detailSectionTitle}>🙋 Basic Info</div>
                <div className={styles.detailFields}>
                  <DetailField label="SR Number" value={item.srNumber} mono />
                  <DetailField label="Person Name" value={item.personName} />
                  <DetailField label="Client" value={item.client?.name} />
                  <DetailField label="Email" value={item.email} />
                  <DetailField label="Phone" value={item.phone} />
                  <DetailField label="Date" value={fmt(item.dateTime)} />
                </div>
              </div>

              {/* Enquiry Info */}
              <div className={styles.detailSection}>
                <div className={styles.detailSectionTitle}>📬 Enquiry Info</div>
                <div className={styles.detailFields}>
                  <DetailField
                    label="Approached Via"
                    value={item.approachedVia}
                  />
                  <DetailField label="Source" value={item.source} />
                  <DetailField
                    label="Project Interest"
                    value={item.projectInterest}
                  />
                  <DetailField
                    label="Budget"
                    value={fmtCurrency(item.budget)}
                  />
                  <DetailField
                    label="Follow-up Date"
                    value={fmt(item.followUpDate)}
                  />
                  <DetailField label="Assigned To" value={item.assignedTo} />
                </div>
              </div>

              {/* Requirements */}
              {(item.requirements || item.remarks || item.notes) && (
                <div
                  className={`${styles.detailSection} ${styles.detailSectionFull}`}
                >
                  <div className={styles.detailSectionTitle}>
                    📝 Notes & Requirements
                  </div>
                  <div className={styles.detailFields}>
                    {item.requirements && (
                      <DetailField
                        label="Requirements"
                        value={item.requirements}
                        full
                      />
                    )}
                    {item.remarks && (
                      <DetailField label="Remarks" value={item.remarks} full />
                    )}
                    {item.notes && (
                      <DetailField label="Notes" value={item.notes} full />
                    )}
                  </div>
                </div>
              )}

              {/* Location */}
              {(item.location || item.preferredArea || item.city) && (
                <div className={styles.detailSection}>
                  <div className={styles.detailSectionTitle}>
                    📍 Location Preference
                  </div>
                  <div className={styles.detailFields}>
                    <DetailField label="City" value={item.city} />
                    <DetailField label="Location" value={item.location} />
                    <DetailField
                      label="Preferred Area"
                      value={item.preferredArea}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── QUOTATIONS TAB ── */}
          {activeTab === "quotations" && (
            <div className={styles.quotSection}>
              {/* Top bar */}
              <div className={styles.quotHeader}>
                <span className={styles.quotHeaderTitle}>
                  Quotations
                  {quotations.length > 0 && (
                    <span className={styles.quotCount}>
                      {quotations.length}
                    </span>
                  )}
                </span>
                <button
                  className={styles.addQuotBtn}
                  onClick={() => setShowQuotationForm(!showQuotationForm)}
                >
                  {showQuotationForm ? "✕ Cancel" : "+ Add Quotation"}
                </button>
              </div>

              {/* Add Quotation Form */}
              {showQuotationForm && (
                <div className={styles.quotForm}>
                  <div className={styles.quotFormTitle}>New Quotation</div>
                  <div className={styles.quotFormGrid}>
                    <div className={styles.quotFormGroup}>
                      <label>
                        Title <span className={styles.req}>*</span>
                      </label>
                      <input
                        className={styles.quotInput}
                        name="title"
                        placeholder="e.g. Design Proposal Phase 1"
                        value={quotForm.title}
                        onChange={onQuotChange}
                      />
                    </div>
                    <div className={styles.quotFormGroup}>
                      <label>
                        Amount (₹) <span className={styles.req}>*</span>
                      </label>
                      <input
                        className={styles.quotInput}
                        type="number"
                        name="amount"
                        placeholder="0.00"
                        value={quotForm.amount}
                        onChange={onQuotChange}
                      />
                    </div>
                    <div className={styles.quotFormGroup}>
                      <label>Valid Till</label>
                      <input
                        className={styles.quotInput}
                        type="date"
                        name="validTill"
                        value={quotForm.validTill}
                        onChange={onQuotChange}
                      />
                    </div>
                    <div className={styles.quotFormGroup}>
                      <label>Status</label>
                      <select
                        className={styles.quotInput}
                        name="status"
                        value={quotForm.status}
                        onChange={onQuotChange}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="SENT">Sent</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="REVISED">Revised</option>
                      </select>
                    </div>
                    <div
                      className={`${styles.quotFormGroup} ${styles.quotFormFull}`}
                    >
                      <label>Notes</label>
                      <textarea
                        className={styles.quotTextarea}
                        name="notes"
                        placeholder="Any additional notes..."
                        value={quotForm.notes}
                        onChange={onQuotChange}
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className={styles.quotFormActions}>
                    <button
                      className={styles.quotCancelBtn}
                      onClick={() => setShowQuotationForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.quotSubmitBtn}
                      onClick={handleAddQuotation}
                      disabled={
                        creatingQuot || !quotForm.title || !quotForm.amount
                      }
                    >
                      {creatingQuot ? "Saving..." : "Save Quotation"}
                    </button>
                  </div>
                </div>
              )}

              {/* Quotation List */}
              {isQuotLoading ? (
                <div className={styles.quotLoading}>Loading quotations...</div>
              ) : quotations.length === 0 ? (
                <div className={styles.quotEmpty}>
                  <span>📄</span>
                  <p>No quotations yet</p>
                  <small>Click "Add Quotation" to create one</small>
                </div>
              ) : (
                <div className={styles.quotList}>
                  {quotations.map((q, i) => {
                    const cfg =
                      QUOT_STATUS_CFG[q.status] || QUOT_STATUS_CFG.DRAFT;
                    return (
                      <div key={q.id || i} className={styles.quotCard}>
                        <div className={styles.quotCardTop}>
                          <div className={styles.quotCardLeft}>
                            <span className={styles.quotCardNum}>#{i + 1}</span>
                            <div>
                              <div className={styles.quotCardTitle}>
                                {q.title}
                              </div>
                              {q.notes && (
                                <div className={styles.quotCardNotes}>
                                  {q.notes}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className={styles.quotCardRight}>
                            <span
                              className={styles.quotStatusBadge}
                              style={{ background: cfg.bg, color: cfg.color }}
                            >
                              {q.status}
                            </span>
                          </div>
                        </div>
                        <div className={styles.quotCardMeta}>
                          <span className={styles.quotCardAmount}>
                            {fmtCurrency(q.amount)}
                          </span>
                          {q.validTill && (
                            <span className={styles.quotCardDate}>
                              Valid till: {fmt(q.validTill)}
                            </span>
                          )}
                          {q.createdAt && (
                            <span className={styles.quotCardDate}>
                              Created: {fmt(q.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Detail Field helper ──────────────────────────────────────────────────────
const DetailField = ({ label, value, mono, full }) => (
  <div
    className={`${styles.detailField} ${full ? styles.detailFieldFull : ""}`}
  >
    <span className={styles.detailFieldLabel}>{label}</span>
    <span
      className={styles.detailFieldValue}
      style={mono ? { fontFamily: "monospace", fontSize: "12px" } : {}}
    >
      {value || "—"}
    </span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AllPreSales = () => {
  const { data, isLoading, isError, error } = usePreSalesList();
  const navigate = useNavigate();
  const { mutate: deletePreSale } = useDeletePreSales();
  const { mutate } = useConvertToPostSales();
  const [editingStatus, setEditingStatus] = useState(null);
  const { mutate: updateStatus } = useUpdatePreSalesStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [viewItem, setViewItem] = useState(null); // ← NEW

  const openConvertModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleConfirmConvert = () => {
    const loadingToast = showLoading("Converting to PostSales...");
    mutate(selectedId, {
      onSuccess: () => {
        dismissToast(loadingToast);
        showSuccess("Converted to PostSales successfully");
        setIsModalOpen(false);
      },
      onError: (error) => {
        dismissToast(loadingToast);
        showError(error?.response?.data?.message || "Conversion failed");
      },
    });
  };

  const handleStatusChange = (srNumber, newStatus) => {
    const loadingToast = showLoading("Updating status...");
    updateStatus(
      { srNumber, status: newStatus },
      {
        onSuccess: () => {
          dismissToast(loadingToast);
          showSuccess("Status updated successfully");
          setEditingStatus(null);
        },
        onError: (error) => {
          dismissToast(loadingToast);
          showError(
            error?.response?.data?.message || "Failed to update status",
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loading}>Loading PreSales...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.error}>Something went wrong.</div>
      </div>
    );
  }

  const handleEdit = (item) => {
    navigate(`/presales/edit/${item.srNumber}`);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Enquiry List</h1>
      </div>

      {data?.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📄</div>
          <div className={styles.emptyTitle}>No PreSales Found</div>
          <div className={styles.emptyText}>
            Start by adding a new PreSales entry.
          </div>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Client</th>
                <th>Person</th>
                <th>Approached Via</th>
                <th>Status</th>
                <th>Date</th>
                <th>Convert</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr key={item.srNumber}>
                  <td>{index + 1}</td>
                  <td>{item.client?.name}</td>
                  <td>{item.personName}</td>
                  <td>{item.approachedVia}</td>
                  <td>
                    <div className={styles.statusWrapper}>
                      <span
                        className={`${styles.badge} ${
                          item.status === "Onboarded"
                            ? styles.badgeSuccess
                            : styles.badgeDanger
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td>{new Date(item.dateTime).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={styles.convertBtn}
                      onClick={() => openConvertModal(item.srNumber)}
                    >
                      Convert
                    </button>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      {/* ← NEW VIEW BUTTON */}
                      <button
                        className={styles.viewBtn}
                        onClick={() => setViewItem(item)}
                      >
                        View
                      </button>

                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={() => {
                          if (window.confirm("Are you sure?")) {
                            deletePreSale(item.srNumber);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Convert Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Convert to Project</h3>
            <p>
              Are you sure you want to convert this PreSales into PostSales?
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirmConvert}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ← NEW VIEW POPUP */}
      {viewItem && (
        <PreSaleDetailPopup item={viewItem} onClose={() => setViewItem(null)} />
      )}
    </div>
  );
};

export default AllPreSales;

// ─── Status Change Modal (unchanged) ─────────────────────────────────────────
const StatusChangeModal = ({ currentStatus, onCancel, onConfirm }) => {
  const [selected, setSelected] = useState(currentStatus);

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.statusModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.statusModalHeader}>
          <div className={styles.statusModalIcon}>🔄</div>
          <div>
            <h3 className={styles.statusModalTitle}>Change Status</h3>
            <p className={styles.statusModalSub}>
              Select a new status for this record
            </p>
          </div>
          <button className={styles.statusModalClose} onClick={onCancel}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className={styles.statusOptions}>
          {["Onboarded", "Not Onboarded"].map((opt) => (
            <button
              key={opt}
              className={`${styles.statusOption} ${selected === opt ? styles.statusOptionSelected : ""}`}
              onClick={() => setSelected(opt)}
            >
              <span className={styles.statusOptionRadio}>
                {selected === opt && (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <circle cx="5" cy="5" r="4" fill="currentColor" />
                  </svg>
                )}
              </span>
              <span className={styles.statusOptionLabel}>{opt}</span>
              {opt === "Onboarded" && (
                <span
                  className={styles.statusOptionBadge}
                  style={{ background: "#dcfce7", color: "#14532d" }}
                >
                  Active
                </span>
              )}
              {opt === "Not Onboarded" && (
                <span
                  className={styles.statusOptionBadge}
                  style={{ background: "#fef9c3", color: "#713f12" }}
                >
                  Pending
                </span>
              )}
            </button>
          ))}
        </div>
        <div className={styles.statusModalFooter}>
          <button className={styles.statusCancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.statusConfirmBtn}
            onClick={() => onConfirm(selected)}
            disabled={selected === currentStatus}
          >
            Apply Change
          </button>
        </div>
      </div>
    </div>
  );
};
