import { useParams, useNavigate } from "react-router-dom";
import {
  useQuotation,
  useMarkQuotationAccepted,
  useDeleteQuotation,
} from "../../api/hooks/useQuotation";
import styles from "./QuotationDetailPage.module.scss";
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

const fmtDateTime = (dt) => {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtCurrency = (val) => {
  if (val == null || val === "") return "—";
  return `₹${Number(val).toLocaleString("en-IN")}`;
};

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ label, value, highlight }) => (
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>{label}</span>
    <span
      className={`${styles.infoValue} ${highlight ? styles.infoValueHL : ""}`}
    >
      {value || "—"}
    </span>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function QuotationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: quotation, isLoading, isError } = useQuotation(id);
  const { mutate: acceptQuotation, isPending: accepting } =
    useMarkQuotationAccepted();
  const { mutate: deleteQuotation, isPending: deleting } = useDeleteQuotation();

  const handleAccept = () => {
    if (!window.confirm("Mark this quotation as accepted?")) return;
    const t = showLoading("Accepting quotation...");
    acceptQuotation(id, {
      onSuccess: () => {
        dismissToast(t);
        showSuccess("Quotation accepted!");
      },
      onError: (err) => {
        dismissToast(t);
        showError(err?.response?.data?.message || "Failed");
      },
    });
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        `Delete quotation ${quotation?.quotationNumber}? This cannot be undone.`,
      )
    )
      return;
    const t = showLoading("Deleting quotation...");
    deleteQuotation(id, {
      onSuccess: () => {
        dismissToast(t);
        showSuccess("Quotation deleted");
        navigate(-1);
      },
      onError: (err) => {
        dismissToast(t);
        showError(err?.response?.data?.message || "Failed");
      },
    });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>Loading quotation...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError || !quotation) {
    return (
      <div className={styles.page}>
        <div className={styles.errorWrap}>
          <span>⚠️</span>
          <h3>Quotation not found</h3>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const isAccepted = quotation.accepted === true;
  const isSent = quotation.sended === true;

  const statusLabel = isAccepted ? "Accepted" : isSent ? "Sent" : "Draft";
  const statusStyle = isAccepted
    ? { background: "#dcfce7", color: "#14532d", dot: "#22c55e" }
    : isSent
      ? { background: "#dbeafe", color: "#1e40af", dot: "#3b82f6" }
      : { background: "#f3f4f6", color: "#374151", dot: "#9ca3af" };

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <div className={styles.heroCard}>
        <div className={styles.heroAccent} />
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              ← Back
            </button>
            <div className={styles.heroIcon}>📄</div>
            <div>
              <h1 className={styles.heroTitle}>
                {quotation.quotationNumber || `QUOTE-${quotation.id}`}
              </h1>
              <div className={styles.heroBadges}>
                {/* Status */}
                <span
                  className={styles.statusBadge}
                  style={{
                    background: statusStyle.background,
                    color: statusStyle.color,
                  }}
                >
                  <span
                    className={styles.statusDot}
                    style={{ background: statusStyle.dot }}
                  />
                  {statusLabel}
                </span>

                {/* Sent indicator */}
                <span
                  className={styles.sentBadge}
                  style={
                    isSent
                      ? { background: "#dbeafe", color: "#1e40af" }
                      : { background: "#f3f4f6", color: "#6b7280" }
                  }
                >
                  {isSent ? "✓ Sent to Client" : "Not Sent"}
                </span>

                {/* Accepted indicator */}
                {isAccepted && (
                  <span className={styles.acceptedBadge}>✓ Accepted</span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.heroActions}>
            {!isAccepted && (
              <button
                className={styles.acceptBtn}
                onClick={handleAccept}
                disabled={accepting}
              >
                {accepting ? "Accepting..." : "✓ Accept Quotation"}
              </button>
            )}
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "🗑 Delete"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className={styles.grid}>
        {/* Core Details */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardIcon}>📋</span>
            <h3 className={styles.cardTitle}>Quotation Details</h3>
          </div>
          <div className={styles.cardBody}>
            <InfoRow
              label="Quotation Number"
              value={quotation.quotationNumber}
              highlight
            />
            <InfoRow label="ID" value={`#${quotation.id}`} />
            <InfoRow
              label="Date Issued"
              value={fmtDateTime(quotation.dateTimeIssued)}
            />
            <InfoRow
              label="Budget"
              value={fmtCurrency(quotation.budget)}
              highlight
            />
          </div>
        </div>

        {/* Status Card */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardIcon}>📊</span>
            <h3 className={styles.cardTitle}>Status</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.statusGrid}>
              {/* Sent */}
              <div
                className={`${styles.statusTile} ${isSent ? styles.statusTileActive : ""}`}
              >
                <span className={styles.statusTileIcon}>
                  {isSent ? "✓" : "○"}
                </span>
                <div>
                  <div className={styles.statusTileLabel}>Sent</div>
                  <div className={styles.statusTileVal}>
                    {isSent ? "Yes" : "No"}
                  </div>
                </div>
              </div>
              {/* Accepted */}
              <div
                className={`${styles.statusTile} ${isAccepted ? styles.statusTileAccepted : ""}`}
              >
                <span className={styles.statusTileIcon}>
                  {isAccepted ? "✓" : "○"}
                </span>
                <div>
                  <div className={styles.statusTileLabel}>Accepted</div>
                  <div className={styles.statusTileVal}>
                    {isAccepted ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quotation Details (if any) */}
        {quotation.quotationDetails && (
          <div className={`${styles.card} ${styles.cardFull}`}>
            <div className={styles.cardHead}>
              <span className={styles.cardIcon}>📝</span>
              <h3 className={styles.cardTitle}>Quotation Notes / Details</h3>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.detailsText}>{quotation.quotationDetails}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
