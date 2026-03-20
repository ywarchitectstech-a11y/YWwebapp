import { useState } from "react";
import {
  useCreateProforma,
  useDeleteProforma,
  useMarkProformaSent,
  useMarkProformaPaid,
  useConvertToTaxInvoice,
} from "../../api/hooks/useInvoices";
import styles from "./ProformaTab.module.scss";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";
import { useNavigate } from "react-router-dom";

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

// Status config — DRAFT → SENT → PAID → CONVERTED
const STATUS_CFG = {
  DRAFT: { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af", label: "Draft" },
  SENT: { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6", label: "Sent" },
  PAID: { bg: "#dcfce7", color: "#14532d", dot: "#22c55e", label: "Paid" },
  CONVERTED: {
    bg: "#ede9fe",
    color: "#4c1d95",
    dot: "#7c3aed",
    label: "Converted",
  },
};

// ─── Add Proforma Popup ───────────────────────────────────────────────────────
const AddProformaPopup = ({ postSalesId, onClose }) => {
  const { mutate: createProforma, isPending } = useCreateProforma();

  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    clientGstin: "",
    netAmount: "",
    cgstAmount: "",
    sgstAmount: "",
    grossAmount: "",
    amountInWords: "",
    validTill: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Auto-calculate gross when net/cgst/sgst change
  const handleAmountChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    const net = parseFloat(updated.netAmount) || 0;
    const cgst = parseFloat(updated.cgstAmount) || 0;
    const sgst = parseFloat(updated.sgstAmount) || 0;
    updated.grossAmount = (net + cgst + sgst).toFixed(2);
    setForm(updated);
  };

  const handleSubmit = () => {
    if (!form.netAmount || !form.grossAmount) {
      showError("Net amount and gross amount are required");
      return;
    }
    const t = showLoading("Creating proforma invoice...");
    createProforma(
      {
        postSalesId,
        data: {
          ...form,
          netAmount: form.netAmount ? parseFloat(form.netAmount) : null,
          cgstAmount: form.cgstAmount ? parseFloat(form.cgstAmount) : null,
          sgstAmount: form.sgstAmount ? parseFloat(form.sgstAmount) : null,
          grossAmount: form.grossAmount ? parseFloat(form.grossAmount) : null,
          validTill: form.validTill || null,
        },
      },
      {
        onSuccess: () => {
          dismissToast(t);
          showSuccess("Proforma invoice created");
          onClose();
        },
        onError: (err) => {
          dismissToast(t);
          showError(
            err?.response?.data?.message || "Failed to create proforma",
          );
        },
      },
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.popupHeader}>
          <div className={styles.popupHeaderLeft}>
            <span className={styles.popupHeaderIcon}>◑</span>
            <div>
              <h3 className={styles.popupTitle}>New Proforma Invoice</h3>
              <p className={styles.popupSub}>
                Invoice number will be auto-generated
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
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
              <span className={styles.autoCalcNote}>Gross auto-calculated</span>
            </div>
            <div className={styles.formGrid}>
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
              <div className={styles.formGroup}>
                <label className={styles.label}>CGST (₹)</label>
                <input
                  className={styles.input}
                  type="number"
                  name="cgstAmount"
                  placeholder="0.00"
                  value={form.cgstAmount}
                  onChange={handleAmountChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>SGST (₹)</label>
                <input
                  className={styles.input}
                  type="number"
                  name="sgstAmount"
                  placeholder="0.00"
                  value={form.sgstAmount}
                  onChange={handleAmountChange}
                />
              </div>
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
                  onChange={onChange}
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

            {/* Visual breakdown preview */}
            {(form.netAmount || form.cgstAmount || form.sgstAmount) && (
              <div className={styles.amountPreview}>
                <span className={styles.amountPreviewItem}>
                  <span className={styles.amountPreviewLabel}>Net</span>
                  <span className={styles.amountPreviewVal}>
                    ₹{form.netAmount || 0}
                  </span>
                </span>
                <span className={styles.amountPreviewOp}>+</span>
                <span className={styles.amountPreviewItem}>
                  <span className={styles.amountPreviewLabel}>CGST</span>
                  <span className={styles.amountPreviewVal}>
                    ₹{form.cgstAmount || 0}
                  </span>
                </span>
                <span className={styles.amountPreviewOp}>+</span>
                <span className={styles.amountPreviewItem}>
                  <span className={styles.amountPreviewLabel}>SGST</span>
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

        {/* Footer */}
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
              "◑ Create Proforma"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Proforma Invoice Card ────────────────────────────────────────────────────
const ProformaCard = ({ inv, index, onDeleted }) => {
  const [expanded, setExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();
  const { mutate: markSent } = useMarkProformaSent();
  const { mutate: markPaid } = useMarkProformaPaid();
  const { mutate: convert } = useConvertToTaxInvoice();
  const { mutate: deleteProforma } = useDeleteProforma();

  const cfg = STATUS_CFG[inv.status] || STATUS_CFG.DRAFT;
  const isConverted = inv.convertedToTaxInvoice === true;
  const canSend = inv.status === "DRAFT";
  const canPaid = inv.status === "SENT";
  const canConvert = inv.paid && !isConverted;

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
        `Delete proforma ${inv.invoiceNumber}? This cannot be undone.`,
      )
    )
      return;
    doAction(deleteProforma, inv.id, "Delete", { onSuccess: onDeleted });
  };

  return (
    <div
      className={`${styles.card} ${expanded ? styles.cardExpanded : ""} ${inv.paid ? styles.cardPaid : ""} ${isConverted ? styles.cardConverted : ""}`}
    >
      {/* Left accent */}
      <div className={styles.cardAccent} style={{ background: cfg.dot }} />

      <div className={styles.cardInner}>
        {/* ── Row 1: Number + Status + Amount + Toggle ── */}
        <div className={styles.cardTop} onClick={() => setExpanded(!expanded)}>
          <div className={styles.cardTopLeft}>
            <span className={styles.cardIndex}>#{index + 1}</span>
            <span className={styles.cardNumber}>
              {inv.invoiceNumber || `PI-${inv.id}`}
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
            {isConverted && (
              <span className={styles.convertedBadge}>⇄ Converted to Tax</span>
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
        </div>

        {/* ── Expanded body ── */}
        {expanded && (
          <div className={styles.cardBody}>
            {/* Tax breakdown */}
            <div className={styles.breakdown}>
              <div className={styles.breakdownItem}>
                <span className={styles.breakdownLabel}>Net Amount</span>
                <span className={styles.breakdownVal}>
                  {fmtMoney(inv.netAmount)}
                </span>
              </div>
              <span className={styles.breakdownOp}>+</span>
              <div className={styles.breakdownItem}>
                <span className={styles.breakdownLabel}>CGST</span>
                <span className={styles.breakdownVal}>
                  {fmtMoney(inv.cgstAmount)}
                </span>
              </div>
              <span className={styles.breakdownOp}>+</span>
              <div className={styles.breakdownItem}>
                <span className={styles.breakdownLabel}>SGST</span>
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

            {/* Client + Dates grid */}
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
                {isConverted && (
                  <div className={styles.detailRow}>
                    <span>Tax Invoice</span>
                    <span style={{ color: "#7c3aed", fontWeight: 600 }}>
                      #{inv.taxInvoiceId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Amount in words */}
            {inv.amountInWords && (
              <div className={styles.amountWords}>
                <span className={styles.amountWordsLabel}>In Words:</span>
                {inv.amountInWords}
              </div>
            )}

            {/* ── Workflow Action Bar ── */}
            <div className={styles.workflowBar}>
              <div className={styles.workflowSteps}>
                {/* Step 1: Mark Sent */}
                <div className={styles.workflowStep}>
                  <button
                    className={`${styles.actionBtnBlue} ${!canSend ? styles.actionBtnDone : ""}`}
                    onClick={() =>
                      canSend && doAction(markSent, inv.id, "Mark Sent")
                    }
                    disabled={!!actionLoading || !canSend}
                    title={
                      inv.status !== "DRAFT"
                        ? `Already ${cfg.label} — cannot mark sent again`
                        : "Send this proforma to the client"
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
                </div>
                <button
                  className={styles.actionBtnView}
                  onClick={() =>
                    navigate(`/postsales/${inv.postSalesId}/invoice/proforma`)
                  }
                >
                  👁 View Invoice
                </button>
                {/* Step 2: Mark Paid */}
                <div className={styles.workflowStep}>
                  <button
                    className={`${styles.actionBtnGreen} ${inv.paid ? styles.actionBtnDone : ""}`}
                    onClick={() => doAction(markPaid, inv.id, "Mark Paid")}
                    // disabled={!!actionLoading || !canPaid}
                    title={
                      inv.paid
                        ? "Already marked as paid"
                        : inv.status === "DRAFT"
                          ? "Mark as Sent first before marking as paid"
                          : "Mark this proforma as paid by client"
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
                  <span className={styles.workflowArrow}>→</span>
                </div>

                {/* Step 3: Convert to Tax Invoice */}
                <div className={styles.workflowStep}>
                  <button
                    className={`${styles.actionBtnPurple} ${isConverted ? styles.actionBtnDone : ""}`}
                    onClick={() =>
                      doAction(convert, inv.id, "Convert to Tax Invoice")
                    }
                    disabled={!canConvert}
                    title={
                      isConverted
                        ? `Already converted — Tax Invoice #${inv.taxInvoiceId}`
                        : !inv.paid
                          ? "Proforma must be marked as Paid before converting to Tax Invoice"
                          : "Convert this paid proforma to a tax invoice"
                    }
                  >
                    {actionLoading === "Convert to Tax Invoice" ? (
                      <span className={styles.btnSpinner} />
                    ) : isConverted ? (
                      `⇄ Tax #${inv.taxInvoiceId}`
                    ) : (
                      "⇄ Convert to Tax"
                    )}
                  </button>
                </div>
              </div>

              {/* Delete — right side */}
              <button
                className={styles.actionBtnDelete}
                onClick={handleDelete}
                disabled={!!actionLoading || isConverted}
                title={
                  isConverted
                    ? "Cannot delete — already converted to a tax invoice"
                    : "Permanently delete this proforma invoice"
                }
              >
                {actionLoading === "Delete" ? (
                  <span className={styles.btnSpinner} />
                ) : (
                  "🗑"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main ProformaTab ─────────────────────────────────────────────────────────
export default function ProformaTab({ postSalesId, invoices = [], onRefetch }) {
  const [showAddPopup, setShowAddPopup] = useState(false);

  const paidCount = invoices.filter((i) => i.paid).length;
  const totalValue = invoices.reduce(
    (s, i) => s + Number(i.grossAmount || 0),
    0,
  );
  const paidValue = invoices
    .filter((i) => i.paid)
    .reduce((s, i) => s + Number(i.grossAmount || 0), 0);

  const handleCloseAdd = () => {
    setShowAddPopup(false);
    onRefetch?.();
  };

  return (
    <div className={styles.wrapper}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h3 className={styles.sectionTitle}>Proforma Invoices</h3>
          {invoices.length > 0 && (
            <span className={styles.countChip}>{invoices.length}</span>
          )}
        </div>
        <button className={styles.addBtn} onClick={() => setShowAddPopup(true)}>
          + New Proforma
        </button>
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
            <span className={styles.statVal}>{fmtMoney(paidValue)}</span>
            <span className={styles.statLabel}>Paid Value</span>
          </div>
        </div>
      )}

      {/* ── Invoice list / Empty ── */}
      {invoices.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>◑</span>
          <p className={styles.emptyTitle}>No proforma invoices yet</p>
          <p className={styles.emptyHint}>
            Create a proforma invoice to start the billing process
          </p>
          <button
            className={styles.addBtn}
            onClick={() => setShowAddPopup(true)}
          >
            + New Proforma
          </button>
        </div>
      ) : (
        <div className={styles.cardList}>
          {invoices.map((inv, i) => (
            <ProformaCard
              key={inv.id}
              inv={inv}
              index={i}
              onDeleted={onRefetch}
            />
          ))}
        </div>
      )}

      {/* ── Add Popup ── */}
      {showAddPopup && (
        <AddProformaPopup postSalesId={postSalesId} onClose={handleCloseAdd} />
      )}
    </div>
  );
}
