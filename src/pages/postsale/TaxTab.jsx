// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   useCreateTaxInvoice,
//   useDeleteTaxInvoice,
//   useMarkTaxInvoiceSent,
//   useMarkTaxInvoicePaid,
// } from "../../api/hooks/useInvoices";
// import styles from "./TaxTab.module.scss";
// import {
//   showSuccess,
//   showError,
//   showLoading,
//   dismissToast,
// } from "../../components/Notification/toast";
// import { canManage } from "../../hooks/roleCheck";
// import { usePostSalesById } from "../../api/hooks/usePostSales";
// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const fmt = (dt) => {
//   if (!dt) return "—";
//   return new Date(dt).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const fmtMoney = (val) => {
//   if (val == null) return "—";
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 2,
//   }).format(val);
// };

// // Status config — DRAFT → SENT → PAID
// const STATUS_CFG = {
//   DRAFT: { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af", label: "Draft" },
//   SENT: { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6", label: "Sent" },
//   PAID: { bg: "#dcfce7", color: "#14532d", dot: "#22c55e", label: "Paid" },
//   PARTIAL: {
//     bg: "#fef9c3",
//     color: "#854d0e",
//     dot: "#ca8a04",
//     label: "Partial",
//   },
// };

// // Payment mode badge colors
// const MODE_CFG = {
//   CASH: { bg: "#dcfce7", color: "#14532d" },
//   RTGS: { bg: "#dbeafe", color: "#1e40af" },
//   NEFT: { bg: "#ede9fe", color: "#4c1d95" },
//   IMPS: { bg: "#fef9c3", color: "#713f12" },
//   CHEQUE: { bg: "#f3f4f6", color: "#374151" },
//   UPI: { bg: "#fce7f3", color: "#9d174d" },
//   BANK_TRANSFER: { bg: "#e0f2fe", color: "#075985" },
// };

// // ─── Add Tax Invoice Popup ────────────────────────────────────────────────────
// const AddTaxInvoicePopup = ({ postSalesId, onClose }) => {
//   const { mutate: createTaxInvoice, isPending } = useCreateTaxInvoice();
//   const { data: postSalesData } = usePostSalesById(postSalesId);

//   const [form, setForm] = useState({
//     clientName: "",
//     clientEmail: "",
//     clientPhone: "",
//     clientAddress: "",
//     clientGstin: "",
//     netAmount: "",
//     cgstAmount: "",
//     sgstAmount: "",
//     grossAmount: "",
//     amountInWords: "",
//     validTill: "",
//   });
//   useEffect(() => {
//     console.log(postSalesData?.client);
//     const client = postSalesData?.client;

//     if (!client) return;

//     setForm((prev) => ({
//       ...prev,
//       clientName: client.name || "",
//       clientEmail: client.email || "",
//       clientPhone: client.phone || "",
//     }));
//   }, [postSalesData]);
//   const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   // Auto-calculate gross when net/cgst/sgst change
//   const handleAmountChange = (e) => {
//     const updated = { ...form, [e.target.name]: e.target.value };
//     const net = parseFloat(updated.netAmount) || 0;
//     const cgst = parseFloat(updated.cgstAmount) || 0;
//     const sgst = parseFloat(updated.sgstAmount) || 0;
//     updated.grossAmount = (net + cgst + sgst).toFixed(2);
//     setForm(updated);
//   };

//   const handleSubmit = () => {
//     if (!form.netAmount || !form.grossAmount) {
//       showError("Net amount and gross amount are required");
//       return;
//     }
//     const t = showLoading("Creating tax invoice...");
//     createTaxInvoice(
//       {
//         postSalesId,
//         data: {
//           ...form,
//           netAmount: form.netAmount ? parseFloat(form.netAmount) : null,
//           cgstAmount: form.cgstAmount ? parseFloat(form.cgstAmount) : null,
//           sgstAmount: form.sgstAmount ? parseFloat(form.sgstAmount) : null,
//           grossAmount: form.grossAmount ? parseFloat(form.grossAmount) : null,
//           validTill: form.validTill || null,
//         },
//       },
//       {
//         onSuccess: () => {
//           dismissToast(t);
//           showSuccess("Tax invoice created");
//           onClose();
//         },
//         onError: (err) => {
//           dismissToast(t);
//           showError(
//             err?.response?.data?.message || "Failed to create tax invoice",
//           );
//         },
//       },
//     );
//   };

//   return (
//     <div className={styles.overlay} onClick={onClose}>
//       <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
//         {/* ── Header ── */}
//         <div className={styles.popupHeader}>
//           <div className={styles.popupHeaderLeft}>
//             <span className={styles.popupHeaderIcon}>◐</span>
//             <div>
//               <h3 className={styles.popupTitle}>New Tax Invoice</h3>
//               <p className={styles.popupSub}>
//                 Invoice number will be auto-generated
//               </p>
//             </div>
//           </div>
//           <button className={styles.closeBtn} onClick={onClose}>
//             ✕
//           </button>
//         </div>

//         {/* ── Body ── */}
//         <div className={styles.popupBody}>
//           {/* Client Details */}
//           <div className={styles.formSection}>
//             <div className={styles.formSectionTitle}>👤 Client Details</div>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Client Name</label>
//                 <input
//                   className={styles.input}
//                   name="clientName"
//                   placeholder="Full name"
//                   value={form.clientName}
//                   onChange={onChange}
//                 />
//               </div>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Client Email</label>
//                 <input
//                   className={styles.input}
//                   type="email"
//                   name="clientEmail"
//                   placeholder="email@example.com"
//                   value={form.clientEmail}
//                   onChange={onChange}
//                 />
//               </div>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Client Phone</label>
//                 <input
//                   className={styles.input}
//                   name="clientPhone"
//                   placeholder="+91 XXXXXXXXXX"
//                   value={form.clientPhone}
//                   onChange={onChange}
//                 />
//               </div>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>GSTIN</label>
//                 <input
//                   className={styles.input}
//                   name="clientGstin"
//                   placeholder="e.g. 27AAAAA0000A1Z5"
//                   value={form.clientGstin}
//                   onChange={onChange}
//                   style={{ textTransform: "uppercase" }}
//                 />
//               </div>
//               <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
//                 <label className={styles.label}>Address</label>
//                 <textarea
//                   className={styles.textarea}
//                   name="clientAddress"
//                   placeholder="Full billing address"
//                   rows={2}
//                   value={form.clientAddress}
//                   onChange={onChange}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Amount Details */}
//           <div className={styles.formSection}>
//             <div className={styles.formSectionTitle}>
//               💰 Amount Details
//               <span className={styles.autoCalcNote}>Gross auto-calculated</span>
//             </div>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>
//                   Net Amount (₹) <span className={styles.req}>*</span>
//                 </label>
//                 <input
//                   className={styles.input}
//                   type="number"
//                   name="netAmount"
//                   placeholder="0.00"
//                   value={form.netAmount}
//                   onChange={handleAmountChange}
//                 />
//               </div>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>CGST (₹)</label>
//                 <input
//                   className={styles.input}
//                   type="number"
//                   name="cgstAmount"
//                   placeholder="0.00"
//                   value={form.cgstAmount}
//                   onChange={handleAmountChange}
//                 />
//               </div>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>SGST (₹)</label>
//                 <input
//                   className={styles.input}
//                   type="number"
//                   name="sgstAmount"
//                   placeholder="0.00"
//                   value={form.sgstAmount}
//                   onChange={handleAmountChange}
//                 />
//               </div>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>
//                   Gross Amount (₹) <span className={styles.req}>*</span>
//                 </label>
//                 <input
//                   className={`${styles.input} ${styles.inputHighlight}`}
//                   type="number"
//                   name="grossAmount"
//                   placeholder="Auto-calculated"
//                   value={form.grossAmount}
//                   onChange={onChange}
//                 />
//               </div>
//               <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
//                 <label className={styles.label}>Amount in Words</label>
//                 <input
//                   className={styles.input}
//                   name="amountInWords"
//                   placeholder="e.g. Rupees Fifty Thousand Only"
//                   value={form.amountInWords}
//                   onChange={onChange}
//                 />
//               </div>
//             </div>

//             {/* Live breakdown preview */}
//             {(form.netAmount || form.cgstAmount || form.sgstAmount) && (
//               <div className={styles.amountPreview}>
//                 <span className={styles.amountPreviewItem}>
//                   <span className={styles.amountPreviewLabel}>Net</span>
//                   <span className={styles.amountPreviewVal}>
//                     ₹{form.netAmount || 0}
//                   </span>
//                 </span>
//                 <span className={styles.amountPreviewOp}>+</span>
//                 <span className={styles.amountPreviewItem}>
//                   <span className={styles.amountPreviewLabel}>CGST</span>
//                   <span className={styles.amountPreviewVal}>
//                     ₹{form.cgstAmount || 0}
//                   </span>
//                 </span>
//                 <span className={styles.amountPreviewOp}>+</span>
//                 <span className={styles.amountPreviewItem}>
//                   <span className={styles.amountPreviewLabel}>SGST</span>
//                   <span className={styles.amountPreviewVal}>
//                     ₹{form.sgstAmount || 0}
//                   </span>
//                 </span>
//                 <span className={styles.amountPreviewOp}>=</span>
//                 <span
//                   className={`${styles.amountPreviewItem} ${styles.amountPreviewTotal}`}
//                 >
//                   <span className={styles.amountPreviewLabel}>Gross</span>
//                   <span className={styles.amountPreviewVal}>
//                     ₹{form.grossAmount || 0}
//                   </span>
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Validity */}
//           <div className={styles.formSection}>
//             <div className={styles.formSectionTitle}>📅 Validity</div>
//             <div className={styles.formGrid}>
//               <div className={styles.formGroup}>
//                 <label className={styles.label}>Valid Till</label>
//                 <input
//                   className={styles.input}
//                   type="date"
//                   name="validTill"
//                   value={form.validTill}
//                   onChange={onChange}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── Footer ── */}
//         <div className={styles.popupFooter}>
//           <button className={styles.cancelBtn} onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className={styles.submitBtn}
//             onClick={handleSubmit}
//             disabled={isPending}
//           >
//             {isPending ? (
//               <>
//                 <span className={styles.btnSpinner} /> Creating...
//               </>
//             ) : (
//               "◐ Create Tax Invoice"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Tax Invoice Card ─────────────────────────────────────────────────────────
// const TaxCard = ({ inv, index, postSalesId, onDeleted }) => {
//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);
//   const [actionLoading, setActionLoading] = useState(null);

//   const { mutate: markSent } = useMarkTaxInvoiceSent();
//   const { mutate: markPaid } = useMarkTaxInvoicePaid();
//   const { mutate: deleteTax } = useDeleteTaxInvoice();

//   const cfg = STATUS_CFG[inv.status] || STATUS_CFG.DRAFT;
//   const canSend = inv.status === "DRAFT";
//   const canPaid = inv.status === "SENT" || inv.status === "PARTIAL";

//   // Payment totals
//   const totalReceived = (inv.payments || []).reduce(
//     (s, p) => s + Number(p.amountPaid || 0),
//     0,
//   );
//   const outstanding = Number(inv.grossAmount || 0) - totalReceived;

//   // Whether this was converted from a proforma
//   const fromProforma =
//     inv.convertedFromProformaNumber || inv.convertedFromProformaId;

//   const doAction = (mutate, id, label, opts = {}) => {
//     setActionLoading(label);
//     const t = showLoading(`${label}...`);
//     mutate(id, {
//       onSuccess: () => {
//         dismissToast(t);
//         showSuccess(`${label} successful`);
//         setActionLoading(null);
//         opts.onSuccess?.();
//       },
//       onError: (err) => {
//         dismissToast(t);
//         showError(err?.response?.data?.message || `${label} failed`);
//         setActionLoading(null);
//       },
//     });
//   };

//   const handleDelete = () => {
//     if (
//       !window.confirm(
//         `Delete tax invoice ${inv.invoiceNumber}? This cannot be undone.`,
//       )
//     )
//       return;
//     doAction(deleteTax, inv.id, "Delete", { onSuccess: onDeleted });
//   };

//   const handlePreview = () => {
//     navigate(`/postsales/${postSalesId}/invoice/${inv.id}/tax`);
//   };

//   return (
//     <div
//       className={`${styles.card}
//         ${expanded ? styles.cardExpanded : ""}
//         ${inv.paid ? styles.cardPaid : ""}
//         ${inv.status === "PARTIAL" ? styles.cardPartial : ""}
//       `}
//     >
//       {/* Left accent */}
//       <div className={styles.cardAccent} style={{ background: cfg.dot }} />

//       <div className={styles.cardInner}>
//         {/* ── Row 1: Number + Status + Amount + Toggle ── */}
//         <div className={styles.cardTop} onClick={() => setExpanded(!expanded)}>
//           <div className={styles.cardTopLeft}>
//             <span className={styles.cardIndex}>#{index + 1}</span>
//             <span className={styles.cardNumber}>
//               {inv.invoiceNumber || `TI-${inv.id}`}
//             </span>
//             <span
//               className={styles.statusBadge}
//               style={{ background: cfg.bg, color: cfg.color }}
//             >
//               <span
//                 className={styles.statusDot}
//                 style={{ background: cfg.dot }}
//               />
//               {cfg.label}
//             </span>
//             {inv.notified && (
//               <span className={styles.notifiedBadge}>✓ Notified</span>
//             )}
//             {fromProforma && (
//               <span className={styles.fromProformaBadge}>
//                 ↩ From{" "}
//                 {inv.convertedFromProformaNumber ||
//                   `PI-${inv.convertedFromProformaId}`}
//               </span>
//             )}
//             {inv.payments?.length > 0 && (
//               <span className={styles.paymentCountBadge}>
//                 💳 {inv.payments.length} payment
//                 {inv.payments.length > 1 ? "s" : ""}
//               </span>
//             )}
//           </div>

//           <div className={styles.cardTopRight}>
//             <span className={styles.grossAmount}>
//               {fmtMoney(inv.grossAmount)}
//             </span>
//             <span
//               className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}
//             >
//               ›
//             </span>
//           </div>
//         </div>

//         {/* ── Row 2: Meta chips ── */}
//         <div className={styles.cardMeta}>
//           {inv.issueDate && (
//             <span className={styles.metaChip}>🗓 {fmt(inv.issueDate)}</span>
//           )}
//           {inv.validTill && (
//             <span className={styles.metaChip}>
//               ⏳ Valid till {fmt(inv.validTill)}
//             </span>
//           )}
//           {inv.clientName && (
//             <span className={styles.metaChip}>👤 {inv.clientName}</span>
//           )}
//           {inv.netAmount != null && (
//             <span className={styles.metaChip}>
//               Net: {fmtMoney(inv.netAmount)}
//             </span>
//           )}
//           {outstanding > 0 && !inv.paid && (
//             <span
//               className={styles.metaChip}
//               style={{ background: "#fee2e2", color: "#b91c1c" }}
//             >
//               Due: {fmtMoney(outstanding)}
//             </span>
//           )}
//         </div>

//         {/* ── Expanded body ── */}
//         {expanded && (
//           <div className={styles.cardBody}>
//             {/* Amount breakdown */}
//             <div className={styles.breakdown}>
//               <div className={styles.breakdownItem}>
//                 <span className={styles.breakdownLabel}>Net Amount</span>
//                 <span className={styles.breakdownVal}>
//                   {fmtMoney(inv.netAmount)}
//                 </span>
//               </div>
//               <span className={styles.breakdownOp}>+</span>
//               <div className={styles.breakdownItem}>
//                 <span className={styles.breakdownLabel}>CGST</span>
//                 <span className={styles.breakdownVal}>
//                   {fmtMoney(inv.cgstAmount)}
//                 </span>
//               </div>
//               <span className={styles.breakdownOp}>+</span>
//               <div className={styles.breakdownItem}>
//                 <span className={styles.breakdownLabel}>SGST</span>
//                 <span className={styles.breakdownVal}>
//                   {fmtMoney(inv.sgstAmount)}
//                 </span>
//               </div>
//               <span className={styles.breakdownOp}>=</span>
//               <div
//                 className={`${styles.breakdownItem} ${styles.breakdownItemTotal}`}
//               >
//                 <span className={styles.breakdownLabel}>Gross Total</span>
//                 <span className={styles.breakdownVal}>
//                   {fmtMoney(inv.grossAmount)}
//                 </span>
//               </div>
//             </div>

//             {/* Client + Invoice Info grid */}
//             <div className={styles.detailGrid}>
//               <div className={styles.detailSection}>
//                 <div className={styles.detailSectionTitle}>👤 Client</div>
//                 <div className={styles.detailRow}>
//                   <span>Name</span>
//                   <span>{inv.clientName || "—"}</span>
//                 </div>
//                 <div className={styles.detailRow}>
//                   <span>Email</span>
//                   <span>{inv.clientEmail || "—"}</span>
//                 </div>
//                 <div className={styles.detailRow}>
//                   <span>Phone</span>
//                   <span>{inv.clientPhone || "—"}</span>
//                 </div>
//                 <div className={styles.detailRow}>
//                   <span>GSTIN</span>
//                   <span style={{ fontFamily: "monospace" }}>
//                     {inv.clientGstin || "—"}
//                   </span>
//                 </div>
//                 {inv.clientAddress && (
//                   <div className={styles.detailRow}>
//                     <span>Address</span>
//                     <span>{inv.clientAddress}</span>
//                   </div>
//                 )}
//               </div>

//               <div className={styles.detailSection}>
//                 <div className={styles.detailSectionTitle}>📋 Invoice Info</div>
//                 <div className={styles.detailRow}>
//                   <span>Issue Date</span>
//                   <span>{fmt(inv.issueDate)}</span>
//                 </div>
//                 <div className={styles.detailRow}>
//                   <span>Valid Till</span>
//                   <span>{fmt(inv.validTill)}</span>
//                 </div>
//                 <div className={styles.detailRow}>
//                   <span>Status</span>
//                   <span style={{ color: cfg.color, fontWeight: 600 }}>
//                     {cfg.label}
//                   </span>
//                 </div>
//                 <div className={styles.detailRow}>
//                   <span>Notified</span>
//                   <span>{inv.notified ? "✓ Yes" : "No"}</span>
//                 </div>
//                 {fromProforma && (
//                   <div className={styles.detailRow}>
//                     <span>From Proforma</span>
//                     <span style={{ fontFamily: "monospace" }}>
//                       {inv.convertedFromProformaNumber ||
//                         `#${inv.convertedFromProformaId}`}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Payment summary */}
//             {inv.payments?.length > 0 && (
//               <div className={styles.paymentsSummary}>
//                 <div className={styles.paymentsSummaryHead}>
//                   <span className={styles.paymentsSummaryTitle}>
//                     💳 Payments Received
//                   </span>
//                   <div className={styles.paymentsSummaryAmounts}>
//                     <span className={styles.paymentsSummaryReceived}>
//                       {fmtMoney(totalReceived)} received
//                     </span>
//                     {outstanding > 0 && (
//                       <span className={styles.paymentsSummaryDue}>
//                         {fmtMoney(outstanding)} due
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <div className={styles.paymentsProgressWrap}>
//                   <div
//                     className={styles.paymentsProgressBar}
//                     style={{
//                       width: `${Math.min(
//                         (totalReceived / Number(inv.grossAmount || 1)) * 100,
//                         100,
//                       )}%`,
//                     }}
//                   />
//                 </div>

//                 {inv.payments.map((p, pi) => {
//                   const mCfg = MODE_CFG[p.paymentMode] || {
//                     bg: "#f3f4f6",
//                     color: "#374151",
//                   };
//                   return (
//                     <div key={p.id || pi} className={styles.paymentRow}>
//                       <div className={styles.paymentRowLeft}>
//                         <span
//                           className={styles.paymentModeBadge}
//                           style={{ background: mCfg.bg, color: mCfg.color }}
//                         >
//                           {p.paymentMode}
//                         </span>
//                         <span className={styles.paymentDate}>
//                           {fmt(p.paymentDate)}
//                         </span>
//                         {p.transactionId && (
//                           <code className={styles.paymentTxn}>
//                             {p.transactionId}
//                           </code>
//                         )}
//                         {p.remarks && (
//                           <span className={styles.paymentRemarks}>
//                             {p.remarks}
//                           </span>
//                         )}
//                       </div>
//                       <span className={styles.paymentAmt}>
//                         {fmtMoney(p.amountPaid)}
//                       </span>
//                     </div>
//                   );
//                 })}

//                 <div className={styles.paymentsTotal}>
//                   <span>Total Received</span>
//                   <strong>{fmtMoney(totalReceived)}</strong>
//                 </div>
//               </div>
//             )}

//             {/* Amount in words */}
//             {inv.amountInWords && (
//               <div className={styles.amountWords}>
//                 <span className={styles.amountWordsLabel}>In Words:</span>
//                 {inv.amountInWords}
//               </div>
//             )}

//             {/* ── Workflow Bar ── */}
//             <div className={styles.workflowBar}>
//               <div className={styles.workflowSteps}>
//                 {/* Step 1: Mark Sent */}
//                 {/* <div className={styles.workflowStep}>
//                   <button
//                     className={`${styles.actionBtnBlue} ${!canSend ? styles.actionBtnDone : ""}`}
//                     onClick={() =>
//                       canSend && doAction(markSent, inv.id, "Mark Sent")
//                     }
//                     disabled={!!actionLoading || !canSend}
//                     title={
//                       inv.status !== "DRAFT"
//                         ? `Already ${cfg.label} — cannot mark sent again`
//                         : "Send this tax invoice to the client"
//                     }
//                   >
//                     {actionLoading === "Mark Sent" ? (
//                       <span className={styles.btnSpinner} />
//                     ) : inv.status !== "DRAFT" ? (
//                       "✓ Sent"
//                     ) : (
//                       "📤 Mark Sent"
//                     )}
//                   </button>
//                   <span className={styles.workflowArrow}>→</span>
//                 </div> */}

//                 {/* Step 2: Mark Paid */}
//                 <div className={styles.workflowStep}>
//                   <button
//                     className={`${styles.actionBtnGreen} ${inv.paid ? styles.actionBtnDone : ""}`}
//                     onClick={() => doAction(markPaid, inv.id, "Mark Paid")}
//                     disabled={!!actionLoading || inv.outstanding !== 0}
//                     title={
//                       inv.outstanding !== 0
//                         ? "Outstanding must be 0 to mark as paid"
//                         : "Mark as paid"
//                     }
//                   >
//                     {actionLoading === "Mark Paid" ? (
//                       <span className={styles.btnSpinner} />
//                     ) : inv.paid ? (
//                       "✓ Paid"
//                     ) : (
//                       "✓ Mark Paid"
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Right side — Preview + Delete */}
//               <div className={styles.workflowRight}>
//                 <button
//                   className={styles.actionBtnPreview}
//                   onClick={handlePreview}
//                   title="Open full invoice preview — print or download as PDF"
//                 >
//                   👁 Preview Invoice
//                 </button>
//                 <button
//                   className={styles.actionBtnDelete}
//                   onClick={handleDelete}
//                   disabled={!!actionLoading}
//                   title="Permanently delete this tax invoice"
//                 >
//                   {actionLoading === "Delete" ? (
//                     <span className={styles.btnSpinner} />
//                   ) : (
//                     "🗑"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ─── Main TaxTab ──────────────────────────────────────────────────────────────
// export default function TaxTab({ postSalesId, invoices = [], onRefetch }) {
//   const [showAddPopup, setShowAddPopup] = useState(false);

//   const paidCount = invoices.filter((i) => i.paid).length;
//   const totalValue = invoices.reduce(
//     (s, i) => s + Number(i.grossAmount || 0),
//     0,
//   );
//   const totalReceived = invoices.reduce(
//     (s, i) =>
//       s +
//       (i.payments || []).reduce((ps, p) => ps + Number(p.amountPaid || 0), 0),
//     0,
//   );
//   const outstanding = totalValue - totalReceived;

//   const handleCloseAdd = () => {
//     setShowAddPopup(false);
//     onRefetch?.();
//   };

//   return (
//     <div className={styles.wrapper}>
//       {/* ── Top bar ── */}
//       <div className={styles.topBar}>
//         <div className={styles.topBarLeft}>
//           <h3 className={styles.sectionTitle}>Tax Invoices</h3>
//           {invoices.length > 0 && (
//             <span className={styles.countChip}>{invoices.length}</span>
//           )}
//         </div>
//         {canManage() && (
//           <button
//             className={styles.addBtn}
//             onClick={() => setShowAddPopup(true)}
//           >
//             + New Tax Invoice
//           </button>
//         )}
//       </div>

//       {/* ── Stats row ── */}
//       {invoices.length > 0 && (
//         <div className={styles.statsRow}>
//           <div className={styles.statCard}>
//             <span className={styles.statVal}>{invoices.length}</span>
//             <span className={styles.statLabel}>Total</span>
//           </div>
//           <div className={`${styles.statCard} ${styles.statGreen}`}>
//             <span className={styles.statVal}>{paidCount}</span>
//             <span className={styles.statLabel}>Paid</span>
//           </div>
//           <div className={`${styles.statCard} ${styles.statAmber}`}>
//             <span className={styles.statVal}>
//               {invoices.length - paidCount}
//             </span>
//             <span className={styles.statLabel}>Pending</span>
//           </div>
//           <div className={`${styles.statCard} ${styles.statBlue}`}>
//             <span className={styles.statVal}>{fmtMoney(totalValue)}</span>
//             <span className={styles.statLabel}>Total Value</span>
//           </div>
//           <div className={`${styles.statCard} ${styles.statGreen}`}>
//             <span className={styles.statVal}>{fmtMoney(totalReceived)}</span>
//             <span className={styles.statLabel}>Received</span>
//           </div>
//           <div
//             className={`${styles.statCard} ${outstanding > 0 ? styles.statRed : styles.statGreen}`}
//           >
//             <span className={styles.statVal}>{fmtMoney(outstanding)}</span>
//             <span className={styles.statLabel}>Outstanding</span>
//           </div>
//         </div>
//       )}

//       {/* ── Invoice list / Empty ── */}
//       {invoices.length === 0 ? (
//         <div className={styles.emptyState}>
//           <span className={styles.emptyIcon}>◐</span>
//           <p className={styles.emptyTitle}>No tax invoices yet</p>
//           <p className={styles.emptyHint}>
//             Create a tax invoice directly, or convert a paid proforma invoice
//           </p>
//           {canManage() && (
//             <button
//               className={styles.addBtn}
//               onClick={() => setShowAddPopup(true)}
//             >
//               + New Tax Invoice
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className={styles.cardList}>
//           {invoices.map((inv, i) => (
//             <TaxCard
//               key={inv.id}
//               inv={inv}
//               index={i}
//               postSalesId={postSalesId}
//               onDeleted={onRefetch}
//             />
//           ))}
//         </div>
//       )}

//       {/* ── Add Popup ── */}
//       {showAddPopup && (
//         <AddTaxInvoicePopup
//           postSalesId={postSalesId}
//           onClose={handleCloseAdd}
//         />
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateTaxInvoice,
  useDeleteTaxInvoice,
  useMarkTaxInvoiceSent,
  useMarkTaxInvoicePaid,
} from "../../api/hooks/useInvoices";
import styles from "./TaxTab.module.scss";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";
import { canManage } from "../../hooks/roleCheck";
import { usePostSalesById } from "../../api/hooks/usePostSales";
// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (dt) => {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fmtMoney = (val) => {
  if (val == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(val);
};

// Status config — DRAFT → SENT → PAID
const STATUS_CFG = {
  DRAFT: { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af", label: "Draft" },
  SENT: { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6", label: "Sent" },
  PAID: { bg: "#dcfce7", color: "#14532d", dot: "#22c55e", label: "Paid" },
  PARTIAL: {
    bg: "#fef9c3",
    color: "#854d0e",
    dot: "#ca8a04",
    label: "Partial",
  },
};

// Payment mode badge colors
const MODE_CFG = {
  CASH: { bg: "#dcfce7", color: "#14532d" },
  RTGS: { bg: "#dbeafe", color: "#1e40af" },
  NEFT: { bg: "#ede9fe", color: "#4c1d95" },
  IMPS: { bg: "#fef9c3", color: "#713f12" },
  CHEQUE: { bg: "#f3f4f6", color: "#374151" },
  UPI: { bg: "#fce7f3", color: "#9d174d" },
  BANK_TRANSFER: { bg: "#e0f2fe", color: "#075985" },
};

// ─── Compute CGST/SGST amounts from percentages ───────────────────────────────
const calcTaxAmounts = (netAmount, cgstPct, sgstPct) => {
  const net = parseFloat(netAmount) || 0;
  const cgst = parseFloat(cgstPct) || 0;
  const sgst = parseFloat(sgstPct) || 0;
  const cgstAmount = (net * cgst) / 100;
  const sgstAmount = (net * sgst) / 100;
  const grossAmount = (net + cgstAmount + sgstAmount).toFixed(2);
  return {
    cgstAmount: cgstAmount.toFixed(2),
    sgstAmount: sgstAmount.toFixed(2),
    grossAmount,
  };
};

// ─── Add Tax Invoice Popup ────────────────────────────────────────────────────
const AddTaxInvoicePopup = ({ postSalesId, onClose }) => {
  const { mutate: createTaxInvoice, isPending } = useCreateTaxInvoice();
  const { data: postSalesData } = usePostSalesById(postSalesId);

  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    clientGstin: "",
    netAmount: "",
    cgstPct: "",
    sgstPct: "",
    cgstAmount: "",
    sgstAmount: "",
    grossAmount: "",
    amountInWords: "",
    validTill: "",
  });

  useEffect(() => {
    console.log(postSalesData?.client);
    const client = postSalesData?.client;

    if (!client) return;

    setForm((prev) => ({
      ...prev,
      clientName: client.name || "",
      clientEmail: client.email || "",
      clientPhone: client.phone || "",
    }));
  }, [postSalesData]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Re-calculate whenever net amount or either tax % changes
  const handleAmountChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    const { cgstAmount, sgstAmount, grossAmount } = calcTaxAmounts(
      updated.netAmount,
      updated.cgstPct,
      updated.sgstPct,
    );
    updated.cgstAmount = cgstAmount;
    updated.sgstAmount = sgstAmount;
    updated.grossAmount = grossAmount;
    setForm(updated);
  };

  const handleSubmit = () => {
    if (!form.netAmount || !form.grossAmount) {
      showError("Net amount and gross amount are required");
      return;
    }
    const t = showLoading("Creating tax invoice...");
    createTaxInvoice(
      {
        postSalesId,
        data: {
          ...form,
          netAmount: form.netAmount ? parseFloat(form.netAmount) : null,
          // Send both percentage and computed rupee amounts
          cgstPct: form.cgstPct ? parseFloat(form.cgstPct) : null,
          sgstPct: form.sgstPct ? parseFloat(form.sgstPct) : null,
          cgstAmount: form.cgstAmount ? parseFloat(form.cgstAmount) : null,
          sgstAmount: form.sgstAmount ? parseFloat(form.sgstAmount) : null,
          grossAmount: form.grossAmount ? parseFloat(form.grossAmount) : null,
          validTill: form.validTill || null,
        },
      },
      {
        onSuccess: () => {
          dismissToast(t);
          showSuccess("Tax invoice created");
          onClose();
        },
        onError: (err) => {
          dismissToast(t);
          showError(
            err?.response?.data?.message || "Failed to create tax invoice",
          );
        },
      },
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className={styles.popupHeader}>
          <div className={styles.popupHeaderLeft}>
            <span className={styles.popupHeaderIcon}>◐</span>
            <div>
              <h3 className={styles.popupTitle}>New Tax Invoice</h3>
              <p className={styles.popupSub}>
                Invoice number will be auto-generated
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className={styles.popupBody}>
          {/* Client Details */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>👤 Client Details</div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Client Name</label>
                <input
                  className={styles.input}
                  name="clientName"
                  placeholder="Full name"
                  value={form.clientName}
                  onChange={onChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Client Email</label>
                <input
                  className={styles.input}
                  type="email"
                  name="clientEmail"
                  placeholder="email@example.com"
                  value={form.clientEmail}
                  onChange={onChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Client Phone</label>
                <input
                  className={styles.input}
                  name="clientPhone"
                  placeholder="+91 XXXXXXXXXX"
                  value={form.clientPhone}
                  onChange={onChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>GSTIN</label>
                <input
                  className={styles.input}
                  name="clientGstin"
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  value={form.clientGstin}
                  onChange={onChange}
                  style={{ textTransform: "uppercase" }}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>Address</label>
                <textarea
                  className={styles.textarea}
                  name="clientAddress"
                  placeholder="Full billing address"
                  rows={2}
                  value={form.clientAddress}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          {/* Amount Details */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>
              💰 Amount Details
              <span className={styles.autoCalcNote}>
                CGST &amp; SGST amounts auto-calculated from %
              </span>
            </div>
            <div className={styles.formGrid}>
              {/* Net Amount */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Net Amount (₹) <span className={styles.req}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="number"
                  name="netAmount"
                  placeholder="0.00"
                  value={form.netAmount}
                  onChange={handleAmountChange}
                />
              </div>

              {/* CGST % + computed ₹ */}
              <div className={styles.formGroup}>
                <label className={styles.label}>CGST (%)</label>
                <div className={styles.taxInputRow}>
                  <input
                    className={styles.input}
                    type="number"
                    name="cgstPct"
                    placeholder="e.g. 9"
                    min="0"
                    max="100"
                    step="0.01"
                    value={form.cgstPct}
                    onChange={handleAmountChange}
                  />
                  {form.cgstAmount !== "" && form.cgstAmount !== "0.00" && (
                    <span className={styles.taxComputedAmt}>
                      = ₹{form.cgstAmount}
                    </span>
                  )}
                </div>
              </div>

              {/* SGST % + computed ₹ */}
              <div className={styles.formGroup}>
                <label className={styles.label}>SGST (%)</label>
                <div className={styles.taxInputRow}>
                  <input
                    className={styles.input}
                    type="number"
                    name="sgstPct"
                    placeholder="e.g. 9"
                    min="0"
                    max="100"
                    step="0.01"
                    value={form.sgstPct}
                    onChange={handleAmountChange}
                  />
                  {form.sgstAmount !== "" && form.sgstAmount !== "0.00" && (
                    <span className={styles.taxComputedAmt}>
                      = ₹{form.sgstAmount}
                    </span>
                  )}
                </div>
              </div>

              {/* Gross (read-only, auto-calculated) */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Gross Amount (₹) <span className={styles.req}>*</span>
                </label>
                <input
                  className={`${styles.input} ${styles.inputHighlight}`}
                  type="number"
                  name="grossAmount"
                  placeholder="Auto-calculated"
                  value={form.grossAmount}
                  readOnly
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>Amount in Words</label>
                <input
                  className={styles.input}
                  name="amountInWords"
                  placeholder="e.g. Rupees Fifty Thousand Only"
                  value={form.amountInWords}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* Live breakdown preview */}
            {(form.netAmount || form.cgstPct || form.sgstPct) && (
              <div className={styles.amountPreview}>
                <span className={styles.amountPreviewItem}>
                  <span className={styles.amountPreviewLabel}>Net</span>
                  <span className={styles.amountPreviewVal}>
                    ₹{form.netAmount || 0}
                  </span>
                </span>
                <span className={styles.amountPreviewOp}>+</span>
                <span className={styles.amountPreviewItem}>
                  <span className={styles.amountPreviewLabel}>
                    CGST {form.cgstPct ? `${form.cgstPct}%` : ""}
                  </span>
                  <span className={styles.amountPreviewVal}>
                    ₹{form.cgstAmount || 0}
                  </span>
                </span>
                <span className={styles.amountPreviewOp}>+</span>
                <span className={styles.amountPreviewItem}>
                  <span className={styles.amountPreviewLabel}>
                    SGST {form.sgstPct ? `${form.sgstPct}%` : ""}
                  </span>
                  <span className={styles.amountPreviewVal}>
                    ₹{form.sgstAmount || 0}
                  </span>
                </span>
                <span className={styles.amountPreviewOp}>=</span>
                <span
                  className={`${styles.amountPreviewItem} ${styles.amountPreviewTotal}`}
                >
                  <span className={styles.amountPreviewLabel}>Gross</span>
                  <span className={styles.amountPreviewVal}>
                    ₹{form.grossAmount || 0}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Validity */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>📅 Validity</div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Valid Till</label>
                <input
                  className={styles.input}
                  type="date"
                  name="validTill"
                  value={form.validTill}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className={styles.popupFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className={styles.btnSpinner} /> Creating...
              </>
            ) : (
              "◐ Create Tax Invoice"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Tax Invoice Card ─────────────────────────────────────────────────────────
const TaxCard = ({ inv, index, postSalesId, onDeleted }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const { mutate: markSent } = useMarkTaxInvoiceSent();
  const { mutate: markPaid } = useMarkTaxInvoicePaid();
  const { mutate: deleteTax } = useDeleteTaxInvoice();

  const cfg = STATUS_CFG[inv.status] || STATUS_CFG.DRAFT;
  const canSend = inv.status === "DRAFT";
  const canPaid = inv.status === "SENT" || inv.status === "PARTIAL";

  // Payment totals
  const totalReceived = (inv.payments || []).reduce(
    (s, p) => s + Number(p.amountPaid || 0),
    0,
  );
  const outstanding = Number(inv.grossAmount || 0) - totalReceived;

  // Whether this was converted from a proforma
  const fromProforma =
    inv.convertedFromProformaNumber || inv.convertedFromProformaId;

  const doAction = (mutate, id, label, opts = {}) => {
    setActionLoading(label);
    const t = showLoading(`${label}...`);
    mutate(id, {
      onSuccess: () => {
        dismissToast(t);
        showSuccess(`${label} successful`);
        setActionLoading(null);
        opts.onSuccess?.();
      },
      onError: (err) => {
        dismissToast(t);
        showError(err?.response?.data?.message || `${label} failed`);
        setActionLoading(null);
      },
    });
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        `Delete tax invoice ${inv.invoiceNumber}? This cannot be undone.`,
      )
    )
      return;
    doAction(deleteTax, inv.id, "Delete", { onSuccess: onDeleted });
  };

  const handlePreview = () => {
    navigate(`/postsales/${postSalesId}/invoice/${inv.id}/tax`);
  };

  return (
    <div
      className={`${styles.card}
        ${expanded ? styles.cardExpanded : ""}
        ${inv.paid ? styles.cardPaid : ""}
        ${inv.status === "PARTIAL" ? styles.cardPartial : ""}
      `}
    >
      {/* Left accent */}
      <div className={styles.cardAccent} style={{ background: cfg.dot }} />

      <div className={styles.cardInner}>
        {/* ── Row 1: Number + Status + Amount + Toggle ── */}
        <div className={styles.cardTop} onClick={() => setExpanded(!expanded)}>
          <div className={styles.cardTopLeft}>
            <span className={styles.cardIndex}>#{index + 1}</span>
            <span className={styles.cardNumber}>
              {inv.invoiceNumber || `TI-${inv.id}`}
            </span>
            <span
              className={styles.statusBadge}
              style={{ background: cfg.bg, color: cfg.color }}
            >
              <span
                className={styles.statusDot}
                style={{ background: cfg.dot }}
              />
              {cfg.label}
            </span>
            {inv.notified && (
              <span className={styles.notifiedBadge}>✓ Notified</span>
            )}
            {fromProforma && (
              <span className={styles.fromProformaBadge}>
                ↩ From{" "}
                {inv.convertedFromProformaNumber ||
                  `PI-${inv.convertedFromProformaId}`}
              </span>
            )}
            {inv.payments?.length > 0 && (
              <span className={styles.paymentCountBadge}>
                💳 {inv.payments.length} payment
                {inv.payments.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className={styles.cardTopRight}>
            <span className={styles.grossAmount}>
              {fmtMoney(inv.grossAmount)}
            </span>
            <span
              className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}
            >
              ›
            </span>
          </div>
        </div>

        {/* ── Row 2: Meta chips ── */}
        <div className={styles.cardMeta}>
          {inv.issueDate && (
            <span className={styles.metaChip}>🗓 {fmt(inv.issueDate)}</span>
          )}
          {inv.validTill && (
            <span className={styles.metaChip}>
              ⏳ Valid till {fmt(inv.validTill)}
            </span>
          )}
          {inv.clientName && (
            <span className={styles.metaChip}>👤 {inv.clientName}</span>
          )}
          {inv.netAmount != null && (
            <span className={styles.metaChip}>
              Net: {fmtMoney(inv.netAmount)}
            </span>
          )}
          {outstanding > 0 && !inv.paid && (
            <span
              className={styles.metaChip}
              style={{ background: "#fee2e2", color: "#b91c1c" }}
            >
              Due: {fmtMoney(outstanding)}
            </span>
          )}
        </div>

        {/* ── Expanded body ── */}
        {expanded && (
          <div className={styles.cardBody}>
            {/* Amount breakdown — show % alongside ₹ amounts */}
            <div className={styles.breakdown}>
              <div className={styles.breakdownItem}>
                <span className={styles.breakdownLabel}>Net Amount</span>
                <span className={styles.breakdownVal}>
                  {fmtMoney(inv.netAmount)}
                </span>
              </div>
              <span className={styles.breakdownOp}>+</span>
              <div className={styles.breakdownItem}>
                <span className={styles.breakdownLabel}>
                  CGST{inv.cgstPct != null ? ` (${inv.cgstPct}%)` : ""}
                </span>
                <span className={styles.breakdownVal}>
                  {fmtMoney(inv.cgstAmount)}
                </span>
              </div>
              <span className={styles.breakdownOp}>+</span>
              <div className={styles.breakdownItem}>
                <span className={styles.breakdownLabel}>
                  SGST{inv.sgstPct != null ? ` (${inv.sgstPct}%)` : ""}
                </span>
                <span className={styles.breakdownVal}>
                  {fmtMoney(inv.sgstAmount)}
                </span>
              </div>
              <span className={styles.breakdownOp}>=</span>
              <div
                className={`${styles.breakdownItem} ${styles.breakdownItemTotal}`}
              >
                <span className={styles.breakdownLabel}>Gross Total</span>
                <span className={styles.breakdownVal}>
                  {fmtMoney(inv.grossAmount)}
                </span>
              </div>
            </div>

            {/* Client + Invoice Info grid */}
            <div className={styles.detailGrid}>
              <div className={styles.detailSection}>
                <div className={styles.detailSectionTitle}>👤 Client</div>
                <div className={styles.detailRow}>
                  <span>Name</span>
                  <span>{inv.clientName || "—"}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Email</span>
                  <span>{inv.clientEmail || "—"}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Phone</span>
                  <span>{inv.clientPhone || "—"}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>GSTIN</span>
                  <span style={{ fontFamily: "monospace" }}>
                    {inv.clientGstin || "—"}
                  </span>
                </div>
                {inv.clientAddress && (
                  <div className={styles.detailRow}>
                    <span>Address</span>
                    <span>{inv.clientAddress}</span>
                  </div>
                )}
              </div>

              <div className={styles.detailSection}>
                <div className={styles.detailSectionTitle}>📋 Invoice Info</div>
                <div className={styles.detailRow}>
                  <span>Issue Date</span>
                  <span>{fmt(inv.issueDate)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Valid Till</span>
                  <span>{fmt(inv.validTill)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span>Status</span>
                  <span style={{ color: cfg.color, fontWeight: 600 }}>
                    {cfg.label}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span>Notified</span>
                  <span>{inv.notified ? "✓ Yes" : "No"}</span>
                </div>
                {fromProforma && (
                  <div className={styles.detailRow}>
                    <span>From Proforma</span>
                    <span style={{ fontFamily: "monospace" }}>
                      {inv.convertedFromProformaNumber ||
                        `#${inv.convertedFromProformaId}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment summary */}
            {inv.payments?.length > 0 && (
              <div className={styles.paymentsSummary}>
                <div className={styles.paymentsSummaryHead}>
                  <span className={styles.paymentsSummaryTitle}>
                    💳 Payments Received
                  </span>
                  <div className={styles.paymentsSummaryAmounts}>
                    <span className={styles.paymentsSummaryReceived}>
                      {fmtMoney(totalReceived)} received
                    </span>
                    {outstanding > 0 && (
                      <span className={styles.paymentsSummaryDue}>
                        {fmtMoney(outstanding)} due
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.paymentsProgressWrap}>
                  <div
                    className={styles.paymentsProgressBar}
                    style={{
                      width: `${Math.min(
                        (totalReceived / Number(inv.grossAmount || 1)) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>

                {inv.payments.map((p, pi) => {
                  const mCfg = MODE_CFG[p.paymentMode] || {
                    bg: "#f3f4f6",
                    color: "#374151",
                  };
                  return (
                    <div key={p.id || pi} className={styles.paymentRow}>
                      <div className={styles.paymentRowLeft}>
                        <span
                          className={styles.paymentModeBadge}
                          style={{ background: mCfg.bg, color: mCfg.color }}
                        >
                          {p.paymentMode}
                        </span>
                        <span className={styles.paymentDate}>
                          {fmt(p.paymentDate)}
                        </span>
                        {p.transactionId && (
                          <code className={styles.paymentTxn}>
                            {p.transactionId}
                          </code>
                        )}
                        {p.remarks && (
                          <span className={styles.paymentRemarks}>
                            {p.remarks}
                          </span>
                        )}
                      </div>
                      <span className={styles.paymentAmt}>
                        {fmtMoney(p.amountPaid)}
                      </span>
                    </div>
                  );
                })}

                <div className={styles.paymentsTotal}>
                  <span>Total Received</span>
                  <strong>{fmtMoney(totalReceived)}</strong>
                </div>
              </div>
            )}

            {/* Amount in words */}
            {inv.amountInWords && (
              <div className={styles.amountWords}>
                <span className={styles.amountWordsLabel}>In Words:</span>
                {inv.amountInWords}
              </div>
            )}

            {/* ── Workflow Bar ── */}
            <div className={styles.workflowBar}>
              <div className={styles.workflowSteps}>
                {/* Step 1: Mark Sent */}
                {/* <div className={styles.workflowStep}>
                  <button
                    className={`${styles.actionBtnBlue} ${!canSend ? styles.actionBtnDone : ""}`}
                    onClick={() =>
                      canSend && doAction(markSent, inv.id, "Mark Sent")
                    }
                    disabled={!!actionLoading || !canSend}
                    title={
                      inv.status !== "DRAFT"
                        ? `Already ${cfg.label} — cannot mark sent again`
                        : "Send this tax invoice to the client"
                    }
                  >
                    {actionLoading === "Mark Sent" ? (
                      <span className={styles.btnSpinner} />
                    ) : inv.status !== "DRAFT" ? (
                      "✓ Sent"
                    ) : (
                      "📤 Mark Sent"
                    )}
                  </button>
                  <span className={styles.workflowArrow}>→</span>
                </div> */}

                {/* Step 2: Mark Paid */}
                <div className={styles.workflowStep}>
                  <button
                    className={`${styles.actionBtnGreen} ${inv.paid ? styles.actionBtnDone : ""}`}
                    onClick={() => doAction(markPaid, inv.id, "Mark Paid")}
                    disabled={!!actionLoading || inv.outstanding !== 0}
                    title={
                      inv.outstanding !== 0
                        ? "Outstanding must be 0 to mark as paid"
                        : "Mark as paid"
                    }
                  >
                    {actionLoading === "Mark Paid" ? (
                      <span className={styles.btnSpinner} />
                    ) : inv.paid ? (
                      "✓ Paid"
                    ) : (
                      "✓ Mark Paid"
                    )}
                  </button>
                </div>
              </div>

              {/* Right side — Preview + Delete */}
              <div className={styles.workflowRight}>
                <button
                  className={styles.actionBtnPreview}
                  onClick={handlePreview}
                  title="Open full invoice preview — print or download as PDF"
                >
                  👁 Preview Invoice
                </button>
                <button
                  className={styles.actionBtnDelete}
                  onClick={handleDelete}
                  disabled={!!actionLoading}
                  title="Permanently delete this tax invoice"
                >
                  {actionLoading === "Delete" ? (
                    <span className={styles.btnSpinner} />
                  ) : (
                    "🗑"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main TaxTab ──────────────────────────────────────────────────────────────
export default function TaxTab({ postSalesId, invoices = [], onRefetch }) {
  const [showAddPopup, setShowAddPopup] = useState(false);

  const paidCount = invoices.filter((i) => i.paid).length;
  const totalValue = invoices.reduce(
    (s, i) => s + Number(i.grossAmount || 0),
    0,
  );
  const totalReceived = invoices.reduce(
    (s, i) =>
      s +
      (i.payments || []).reduce((ps, p) => ps + Number(p.amountPaid || 0), 0),
    0,
  );
  const outstanding = totalValue - totalReceived;

  const handleCloseAdd = () => {
    setShowAddPopup(false);
    onRefetch?.();
  };

  return (
    <div className={styles.wrapper}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h3 className={styles.sectionTitle}>Tax Invoices</h3>
          {invoices.length > 0 && (
            <span className={styles.countChip}>{invoices.length}</span>
          )}
        </div>
        {canManage() && (
          <button
            className={styles.addBtn}
            onClick={() => setShowAddPopup(true)}
          >
            + New Tax Invoice
          </button>
        )}
      </div>

      {/* ── Stats row ── */}
      {invoices.length > 0 && (
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statVal}>{invoices.length}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={`${styles.statCard} ${styles.statGreen}`}>
            <span className={styles.statVal}>{paidCount}</span>
            <span className={styles.statLabel}>Paid</span>
          </div>
          <div className={`${styles.statCard} ${styles.statAmber}`}>
            <span className={styles.statVal}>
              {invoices.length - paidCount}
            </span>
            <span className={styles.statLabel}>Pending</span>
          </div>
          <div className={`${styles.statCard} ${styles.statBlue}`}>
            <span className={styles.statVal}>{fmtMoney(totalValue)}</span>
            <span className={styles.statLabel}>Total Value</span>
          </div>
          <div className={`${styles.statCard} ${styles.statGreen}`}>
            <span className={styles.statVal}>{fmtMoney(totalReceived)}</span>
            <span className={styles.statLabel}>Received</span>
          </div>
          <div
            className={`${styles.statCard} ${outstanding > 0 ? styles.statRed : styles.statGreen}`}
          >
            <span className={styles.statVal}>{fmtMoney(outstanding)}</span>
            <span className={styles.statLabel}>Outstanding</span>
          </div>
        </div>
      )}

      {/* ── Invoice list / Empty ── */}
      {invoices.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>◐</span>
          <p className={styles.emptyTitle}>No tax invoices yet</p>
          <p className={styles.emptyHint}>
            Create a tax invoice directly, or convert a paid proforma invoice
          </p>
          {canManage() && (
            <button
              className={styles.addBtn}
              onClick={() => setShowAddPopup(true)}
            >
              + New Tax Invoice
            </button>
          )}
        </div>
      ) : (
        <div className={styles.cardList}>
          {invoices.map((inv, i) => (
            <TaxCard
              key={inv.id}
              inv={inv}
              index={i}
              postSalesId={postSalesId}
              onDeleted={onRefetch}
            />
          ))}
        </div>
      )}

      {/* ── Add Popup ── */}
      {showAddPopup && (
        <AddTaxInvoicePopup
          postSalesId={postSalesId}
          onClose={handleCloseAdd}
        />
      )}
    </div>
  );
}
