import { useState } from "react";
import { useMakeInvoicePaid } from "../../api/hooks/useInvoices";
import styles from "./PaymentsTab.module.scss";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";

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

// PaymentMode matches backend enum
const PAYMENT_MODES = [
  "CASH",
  "RTGS",
  "NEFT",
  "IMPS",
  "CHEQUE",
  "UPI",
  "BANK_TRANSFER",
];

const MODE_CFG = {
  CASH: { bg: "#dcfce7", color: "#14532d" },
  RTGS: { bg: "#dbeafe", color: "#1e40af" },
  NEFT: { bg: "#ede9fe", color: "#4c1d95" },
  IMPS: { bg: "#fef9c3", color: "#713f12" },
  CHEQUE: { bg: "#f3f4f6", color: "#374151" },
  UPI: { bg: "#fce7f3", color: "#9d174d" },
  BANK_TRANSFER: { bg: "#e0f2fe", color: "#075985" },
};

// ─── Add Payment Popup ────────────────────────────────────────────────────────
const AddPaymentPopup = ({ taxInvoices, onClose }) => {
  const { mutate: makeInvoicePaid, isPending } = useMakeInvoicePaid();

  const [form, setForm] = useState({
    invoiceNumber: taxInvoices.length === 1 ? taxInvoices[0].invoiceNumber : "",
    paymentDate: new Date().toISOString().split("T")[0],
    amountPaid: "",
    paymentMode: "RTGS",
    transactionId: "",
    remarks: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // When invoice is selected, auto-fill outstanding amount
  const handleInvoiceChange = (e) => {
    const selectedNum = e.target.value;
    const inv = taxInvoices.find((ti) => ti.invoiceNumber === selectedNum);
    if (inv) {
      const paid = (inv.payments || []).reduce(
        (s, p) => s + Number(p.amountPaid || 0),
        0,
      );
      const outstanding = Number(inv.grossAmount || 0) - paid;
      setForm((prev) => ({
        ...prev,
        invoiceNumber: selectedNum,
        amountPaid: outstanding > 0 ? outstanding.toFixed(2) : "",
      }));
    } else {
      setForm((prev) => ({ ...prev, invoiceNumber: selectedNum }));
    }
  };

  const selectedInvoice = taxInvoices.find(
    (ti) => ti.invoiceNumber === form.invoiceNumber,
  );
  const alreadyPaid = selectedInvoice
    ? (selectedInvoice.payments || []).reduce(
        (s, p) => s + Number(p.amountPaid || 0),
        0,
      )
    : 0;
  const outstanding = selectedInvoice
    ? Number(selectedInvoice.grossAmount || 0) - alreadyPaid
    : null;

  const handleSubmit = () => {
    if (!form.invoiceNumber) {
      showError("Select a tax invoice");
      return;
    }
    if (!form.amountPaid) {
      showError("Enter payment amount");
      return;
    }
    if (!form.paymentMode) {
      showError("Select payment mode");
      return;
    }
    if (!form.paymentDate) {
      showError("Enter payment date");
      return;
    }

    const t = showLoading("Recording payment...");
    makeInvoicePaid(
      {
        invoiceNumber: form.invoiceNumber,
        paymentData: {
          paymentDate: form.paymentDate,
          amountPaid: parseFloat(form.amountPaid),
          paymentMode: form.paymentMode,
          transactionId: form.transactionId || null,
          remarks: form.remarks || null,
        },
      },
      {
        onSuccess: () => {
          dismissToast(t);
          showSuccess("Payment recorded successfully");
          onClose();
        },
        onError: (err) => {
          dismissToast(t);
          showError(err?.response?.data?.message || "Failed to record payment");
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
            <span className={styles.popupHeaderIcon}>💳</span>
            <div>
              <h3 className={styles.popupTitle}>Record Payment</h3>
              <p className={styles.popupSub}>
                Add a payment against a tax invoice
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.popupBody}>
          {/* Invoice Selection */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>📄 Tax Invoice</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Select Invoice <span className={styles.req}>*</span>
              </label>
              {taxInvoices.length === 0 ? (
                <div className={styles.noInvoicesNote}>
                  ⚠ No tax invoices found. Create a tax invoice first.
                </div>
              ) : (
                <select
                  className={styles.select}
                  name="invoiceNumber"
                  value={form.invoiceNumber}
                  onChange={handleInvoiceChange}
                >
                  <option value="">— Select tax invoice —</option>
                  {taxInvoices.map((ti) => {
                    const paid = (ti.payments || []).reduce(
                      (s, p) => s + Number(p.amountPaid || 0),
                      0,
                    );
                    const out = Number(ti.grossAmount || 0) - paid;
                    return (
                      <option key={ti.id} value={ti.invoiceNumber}>
                        {ti.invoiceNumber} — {fmtMoney(ti.grossAmount)}
                        {ti.paid
                          ? " ✓ Paid"
                          : ` (Outstanding: ${fmtMoney(out)})`}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            {/* Invoice summary strip */}
            {selectedInvoice && (
              <div className={styles.invoiceSummary}>
                <div className={styles.invoiceSummaryItem}>
                  <span className={styles.invoiceSummaryLabel}>Gross</span>
                  <span className={styles.invoiceSummaryVal}>
                    {fmtMoney(selectedInvoice.grossAmount)}
                  </span>
                </div>
                <div className={styles.invoiceSummaryDivider} />
                <div className={styles.invoiceSummaryItem}>
                  <span className={styles.invoiceSummaryLabel}>
                    Paid so far
                  </span>
                  <span
                    className={styles.invoiceSummaryVal}
                    style={{ color: "#14532d" }}
                  >
                    {fmtMoney(alreadyPaid)}
                  </span>
                </div>
                <div className={styles.invoiceSummaryDivider} />
                <div className={styles.invoiceSummaryItem}>
                  <span className={styles.invoiceSummaryLabel}>
                    Outstanding
                  </span>
                  <span
                    className={styles.invoiceSummaryVal}
                    style={{
                      color: outstanding > 0 ? "#b91c1c" : "#14532d",
                      fontWeight: 700,
                    }}
                  >
                    {fmtMoney(outstanding)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Details */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>💰 Payment Details</div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Amount Paid (₹) <span className={styles.req}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="number"
                  name="amountPaid"
                  placeholder="0.00"
                  value={form.amountPaid}
                  onChange={onChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Payment Date <span className={styles.req}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="date"
                  name="paymentDate"
                  value={form.paymentDate}
                  onChange={onChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Payment Mode <span className={styles.req}>*</span>
                </label>
                <select
                  className={styles.select}
                  name="paymentMode"
                  value={form.paymentMode}
                  onChange={onChange}
                >
                  {PAYMENT_MODES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Transaction ID / Cheque No.
                </label>
                <input
                  className={styles.input}
                  name="transactionId"
                  placeholder="UTR / Reference number"
                  value={form.transactionId}
                  onChange={onChange}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>Remarks</label>
                <input
                  className={styles.input}
                  name="remarks"
                  placeholder="Optional note about this payment"
                  value={form.remarks}
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
            disabled={
              isPending || !form.invoiceNumber || taxInvoices.length === 0
            }
          >
            {isPending ? (
              <>
                <span className={styles.btnSpinner} /> Recording...
              </>
            ) : (
              "💳 Record Payment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main PaymentsTab ─────────────────────────────────────────────────────────
export default function PaymentsTab({ taxInvoices = [], onRefetch }) {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [filterInvoice, setFilterInvoice] = useState("ALL");

  // Flatten all payments from all tax invoices, attaching invoice info
  const allPayments = taxInvoices.flatMap((ti) =>
    (ti.payments || []).map((p) => ({
      ...p,
      invoiceNumber: ti.invoiceNumber || `#${ti.id}`,
      invoiceId: ti.id,
      invoiceGross: ti.grossAmount,
    })),
  );

  // Sort newest first
  const sortedPayments = [...allPayments].sort(
    (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate),
  );

  const filtered =
    filterInvoice === "ALL"
      ? sortedPayments
      : sortedPayments.filter((p) => p.invoiceNumber === filterInvoice);

  // Stats
  const totalReceived = allPayments.reduce(
    (s, p) => s + Number(p.amountPaid || 0),
    0,
  );
  const totalGross = taxInvoices.reduce(
    (s, ti) => s + Number(ti.grossAmount || 0),
    0,
  );
  const outstanding = totalGross - totalReceived;

  // Mode breakdown
  const byMode = allPayments.reduce((acc, p) => {
    const m = p.paymentMode || "OTHER";
    acc[m] = (acc[m] || 0) + Number(p.amountPaid || 0);
    return acc;
  }, {});

  const handleClose = () => {
    setShowAddPopup(false);
    onRefetch?.();
  };

  return (
    <div className={styles.wrapper}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h3 className={styles.sectionTitle}>Payments</h3>
          {allPayments.length > 0 && (
            <span className={styles.countChip}>{allPayments.length}</span>
          )}
        </div>
        <button
          className={styles.addBtn}
          onClick={() => setShowAddPopup(true)}
          disabled={taxInvoices.length === 0}
          title={taxInvoices.length === 0 ? "Create a tax invoice first" : ""}
        >
          + Record Payment
        </button>
      </div>

      {/* ── Stats row ── */}
      {allPayments.length > 0 && (
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statVal}>{allPayments.length}</span>
            <span className={styles.statLabel}>Total Payments</span>
          </div>
          <div className={`${styles.statCard} ${styles.statGreen}`}>
            <span className={styles.statVal}>{fmtMoney(totalReceived)}</span>
            <span className={styles.statLabel}>Total Received</span>
          </div>
          <div className={`${styles.statCard} ${styles.statBlue}`}>
            <span className={styles.statVal}>{fmtMoney(totalGross)}</span>
            <span className={styles.statLabel}>Invoice Value</span>
          </div>
          <div
            className={`${styles.statCard} ${outstanding > 0 ? styles.statRed : styles.statGreen}`}
          >
            <span className={styles.statVal}>{fmtMoney(outstanding)}</span>
            <span className={styles.statLabel}>Outstanding</span>
          </div>
        </div>
      )}

      {/* ── Mode breakdown chips ── */}
      {Object.keys(byMode).length > 0 && (
        <div className={styles.modeBreakdown}>
          {Object.entries(byMode).map(([mode, amt]) => {
            const cfg = MODE_CFG[mode] || { bg: "#f3f4f6", color: "#374151" };
            return (
              <span
                key={mode}
                className={styles.modeChip}
                style={{ background: cfg.bg, color: cfg.color }}
              >
                <span className={styles.modeChipMode}>{mode}</span>
                <span className={styles.modeChipAmt}>{fmtMoney(amt)}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* ── Filter by invoice ── */}
      {taxInvoices.length > 1 && allPayments.length > 0 && (
        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>Filter:</span>
          <div className={styles.filterChips}>
            <button
              className={`${styles.filterChip} ${filterInvoice === "ALL" ? styles.filterChipActive : ""}`}
              onClick={() => setFilterInvoice("ALL")}
            >
              All Invoices
            </button>
            {taxInvoices.map((ti) => (
              <button
                key={ti.id}
                className={`${styles.filterChip} ${filterInvoice === ti.invoiceNumber ? styles.filterChipActive : ""}`}
                onClick={() => setFilterInvoice(ti.invoiceNumber)}
              >
                {ti.invoiceNumber}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {allPayments.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>💳</span>
          <p className={styles.emptyTitle}>No payments recorded yet</p>
          <p className={styles.emptyHint}>
            {taxInvoices.length === 0
              ? "Create a tax invoice first before recording payments"
              : "Record a payment against one of the tax invoices"}
          </p>
          {taxInvoices.length > 0 && (
            <button
              className={styles.addBtn}
              onClick={() => setShowAddPopup(true)}
            >
              + Record Payment
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ── Payment cards list ── */}
          <div className={styles.paymentList}>
            {filtered.map((p, i) => {
              const modeCfg = MODE_CFG[p.paymentMode] || {
                bg: "#f3f4f6",
                color: "#374151",
              };
              return (
                <div key={p.id || i} className={styles.paymentCard}>
                  {/* Left color accent based on payment mode */}
                  <div
                    className={styles.paymentAccent}
                    style={{ background: modeCfg.color }}
                  />

                  <div className={styles.paymentCardBody}>
                    {/* Row 1 — amount + mode + date */}
                    <div className={styles.paymentCardTop}>
                      <div className={styles.paymentCardLeft}>
                        <span className={styles.paymentAmount}>
                          {fmtMoney(p.amountPaid)}
                        </span>
                        <span
                          className={styles.modeBadge}
                          style={{
                            background: modeCfg.bg,
                            color: modeCfg.color,
                          }}
                        >
                          {p.paymentMode}
                        </span>
                      </div>
                      <span className={styles.paymentDate}>
                        {fmt(p.paymentDate)}
                      </span>
                    </div>

                    {/* Row 2 — invoice link + txn id + remarks */}
                    <div className={styles.paymentCardMeta}>
                      <span className={styles.metaItem}>
                        <span className={styles.metaItemLabel}>Invoice</span>
                        <code className={styles.metaItemCode}>
                          {p.invoiceNumber}
                        </code>
                      </span>
                      {p.transactionId && (
                        <span className={styles.metaItem}>
                          <span className={styles.metaItemLabel}>Txn ID</span>
                          <code className={styles.metaItemCode}>
                            {p.transactionId}
                          </code>
                        </span>
                      )}
                      {p.remarks && (
                        <span className={styles.metaItem}>
                          <span className={styles.metaItemLabel}>Note</span>
                          <span className={styles.metaItemText}>
                            {p.remarks}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Running total footer ── */}
          {filtered.length > 0 && (
            <div className={styles.totalRow}>
              <span>
                {filtered.length} payment{filtered.length !== 1 ? "s" : ""}
                {filterInvoice !== "ALL" && ` on ${filterInvoice}`}
              </span>
              <span className={styles.totalAmt}>
                {fmtMoney(
                  filtered.reduce((s, p) => s + Number(p.amountPaid || 0), 0),
                )}
              </span>
            </div>
          )}
        </>
      )}

      {/* ── Add Popup ── */}
      {showAddPopup && (
        <AddPaymentPopup taxInvoices={taxInvoices} onClose={handleClose} />
      )}
    </div>
  );
}
