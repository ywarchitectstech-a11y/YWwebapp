import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostSalesById } from "../../api/hooks/usePostSales";
import styles from "./ViewPostSales.module.scss";
import ProjectDetailSection from "./ProjectDetailSection.jsx";
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

const statusColors = {
  CREATED: { bg: "#e0f2fe", color: "#0369a1", dot: "#0284c7" },
  IN_PROGRESS: { bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04" },
  COMPLETED: { bg: "#dcfce7", color: "#166534", dot: "#16a34a" },
  ON_HOLD: { bg: "#fce7f3", color: "#9d174d", dot: "#db2777" },
  CANCELLED: { bg: "#fee2e2", color: "#991b1b", dot: "#dc2626" },
};

const StatusBadge = ({ status }) => {
  const s = statusColors[status] || {
    bg: "#f3f4f6",
    color: "#374151",
    dot: "#6b7280",
  };
  return (
    <span
      className={styles.statusBadge}
      style={{ background: s.bg, color: s.color }}
    >
      <span className={styles.statusDot} style={{ background: s.dot }} />
      {status?.replace(/_/g, " ") || "—"}
    </span>
  );
};

const InfoField = ({ label, value, mono }) => (
  <div className={styles.infoField}>
    <span className={styles.fieldLabel}>{label}</span>
    <span
      className={styles.fieldValue}
      style={mono ? { fontFamily: "monospace", letterSpacing: "0.04em" } : {}}
    >
      {value || "—"}
    </span>
  </div>
);

const EmptyState = ({ icon, text }) => (
  <div className={styles.emptyState}>
    <span className={styles.emptyIcon}>{icon}</span>
    <p>{text}</p>
  </div>
);

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "overview", label: "Overview", icon: "⬡" },
  { key: "client", label: "Client", icon: "◈" },
  { key: "project", label: "Sites", icon: "◻" },
  { key: "proforma", label: "Proforma Invoices", icon: "◑" },
  { key: "tax", label: "Tax Invoices", icon: "◐" },
  { key: "payments", label: "Payments", icon: "◎" },
];

// ─── Tab Panels ───────────────────────────────────────────────────────────────
const OverviewTab = ({ data, onMarkNotified, onUpdateRemark }) => {
  const [remark, setRemark] = useState(data.remark || "");
  const [editing, setEditing] = useState(false);

  return (
    <div className={styles.tabContent}>
      <div className={styles.overviewGrid}>
        {/* Status card */}
        <div className={`${styles.card} ${styles.statusCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>◈</span>
            <h3>Sale Status</h3>
          </div>
          <div className={styles.statusRow}>
            <StatusBadge status={data.postSalesStatus} />
            <div
              className={`${styles.notifiedPill} ${data.notified ? styles.notifiedOn : styles.notifiedOff}`}
              title={
                data.notified
                  ? "Client has been notified"
                  : "Client not yet notified"
              }
            >
              {data.notified ? "✓ Notified" : "⚠ Not Notified"}
            </div>
          </div>
          {!data.notified && (
            <button className={styles.actionBtn} onClick={onMarkNotified}>
              <span>⊕</span> Mark as Notified
            </button>
          )}
        </div>

        {/* Key dates */}
        <div className={`${styles.card} ${styles.datesCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>◷</span>
            <h3>Timeline</h3>
          </div>
          <div className={styles.dateList}>
            <div className={styles.dateRow}>
              <span>Converted On</span>
              <strong>{fmt(data.postSalesdateTime)}</strong>
            </div>
            {data.project?.projectStartDateTime && (
              <div className={styles.dateRow}>
                <span>Project Start</span>
                <strong>{fmt(data.project.projectStartDateTime)}</strong>
              </div>
            )}
            {data.project?.projectExpectedEndDate && (
              <div className={styles.dateRow}>
                <span>Expected End</span>
                <strong>{fmt(data.project.projectExpectedEndDate)}</strong>
              </div>
            )}
            {data.project?.projectEndDateTime && (
              <div className={styles.dateRow}>
                <span>Actual End</span>
                <strong>{fmt(data.project.projectEndDateTime)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* IDs */}
        <div className={`${styles.card} ${styles.idsCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>⬡</span>
            <h3>Identifiers</h3>
          </div>
          <InfoField label="Post-Sale ID" value={`#${data.id}`} mono />
          <InfoField
            label="Project Code"
            value={data.project?.projectCode}
            mono
          />
          <InfoField
            label="Permanent ID"
            value={data.project?.permanentProjectId}
            mono
          />
        </div>

        {/* Remark */}
        <div className={`${styles.card} ${styles.remarkCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>✎</span>
            <h3>Remark</h3>
            {!editing && (
              <button
                className={styles.editBtn}
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
          {editing ? (
            <div className={styles.remarkEdit}>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={4}
                placeholder="Add a remark..."
                className={styles.remarkTextarea}
              />
              <div className={styles.remarkActions}>
                <button
                  className={styles.saveBtn}
                  onClick={() => {
                    onUpdateRemark(remark);
                    setEditing(false);
                  }}
                >
                  Save
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    setRemark(data.remark || "");
                    setEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className={styles.remarkText}>
              {data.remark || <em>No remark added yet.</em>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ClientTab = ({ client }) => {
  if (!client)
    return <EmptyState icon="◈" text="No client information available." />;
  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <div className={styles.clientHero}>
          <div className={styles.clientAvatar}>
            {client.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <h2 className={styles.clientName}>{client.name}</h2>
            <span className={styles.clientId}>Client #{client.id}</span>
          </div>
        </div>
        <div className={styles.infoGrid}>
          <InfoField label="Email" value={client.email} />
          <InfoField label="Phone" value={client.phone} />
        </div>
      </div>
    </div>
  );
};

const ProjectTab = ({ project, navigate }) => {
  if (!project)
    return (
      <div className={styles.tabContent}>
        <EmptyState icon="◻" text="No project linked yet." />
      </div>
    );
  return (
    <div className={styles.tabContent}>
      <div className={styles.card}>
        <div className={styles.projectHero}>
          {project.logoUrl ? (
            <img
              src={project.logoUrl}
              alt="logo"
              className={styles.projectLogo}
            />
          ) : (
            <div className={styles.projectLogoPlaceholder}>
              {project.projectName?.charAt(0) || "P"}
            </div>
          )}
          <div>
            <h2 className={styles.projectName}>
              {project.projectName || "Unnamed Project"}
            </h2>
            <StatusBadge status={project.projectStatus} />
          </div>
        </div>
        <div className={styles.infoGrid}>
          <InfoField label="Project Code" value={project.projectCode} mono />
          <InfoField
            label="Permanent ID"
            value={project.permanentProjectId}
            mono
          />
          <InfoField
            label="Start Date"
            value={fmt(project.projectStartDateTime)}
          />
          <InfoField
            label="Expected End"
            value={fmt(project.projectExpectedEndDate)}
          />
          <InfoField
            label="Actual End"
            value={fmt(project.projectEndDateTime)}
          />
        </div>
        <div className={styles.projectActions}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate(`/projects/edit/${project.projectId}`)}
          >
            ⬡ Edit Project
          </button>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate(`/projects/docs`)}
          >
            ⬡ View Documents
          </button>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate(`/projects//view/${project.projectId}`)}
          >
            ⬡ View Full Project
          </button>
        </div>
      </div>
    </div>
  );
};

const InvoiceCard = ({ inv, type }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.invoiceCard} ${open ? styles.invoiceOpen : ""}`}>
      <div className={styles.invoiceHeader} onClick={() => setOpen(!open)}>
        <div className={styles.invoiceLeft}>
          <span className={styles.invoiceNum}>
            {inv.invoiceNumber || `#${inv.id}`}
          </span>
          <span
            className={`${styles.paidBadge} ${inv.paid ? styles.paidTrue : styles.paidFalse}`}
          >
            {inv.paid ? "Paid" : "Unpaid"}
          </span>
          {inv.notified && (
            <span className={styles.notifiedMini}>Notified</span>
          )}
        </div>
        <div className={styles.invoiceRight}>
          <span className={styles.invoiceAmount}>
            {fmtMoney(inv.grossAmount)}
          </span>
          <span className={styles.chevron}>{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div className={styles.invoiceBody}>
          <div className={styles.invoiceGrid}>
            <InfoField label="Issue Date" value={fmt(inv.issueDate)} />
            <InfoField label="Valid Till" value={fmt(inv.validTill)} />
            <InfoField label="Net Amount" value={fmtMoney(inv.netAmount)} />
            <InfoField label="CGST" value={fmtMoney(inv.cgstAmount)} />
            <InfoField label="SGST" value={fmtMoney(inv.sgstAmount)} />
            <InfoField label="Gross Amount" value={fmtMoney(inv.grossAmount)} />
          </div>
          {inv.amountInWords && (
            <div className={styles.amountWords}>
              <span>In Words:</span> {inv.amountInWords}
            </div>
          )}
          {type === "tax" && inv.convertedFromProformaId && (
            <div className={styles.linkedProforma}>
              Converted from Proforma #{inv.convertedFromProformaId}
            </div>
          )}
          {/* Payments nested inside tax invoice */}
          {type === "tax" && inv.payments?.length > 0 && (
            <div className={styles.paymentsNested}>
              <h4>Payments ({inv.payments.length})</h4>
              {inv.payments.map((p) => (
                <div key={p.id} className={styles.paymentRow}>
                  <div className={styles.paymentLeft}>
                    <span className={styles.paymentMode}>{p.paymentMode}</span>
                    <span className={styles.paymentDate}>
                      {fmt(p.paymentDate)}
                    </span>
                  </div>
                  <div className={styles.paymentRight}>
                    <strong>{fmtMoney(p.amountPaid)}</strong>
                    {p.transactionId && (
                      <code className={styles.txnId}>{p.transactionId}</code>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProformaTab = ({ invoices }) => {
  if (!invoices?.length)
    return <EmptyState icon="◑" text="No proforma invoices yet." />;
  return (
    <div className={styles.tabContent}>
      <div className={styles.invoiceStats}>
        <div className={styles.statBox}>
          <span>{invoices.length}</span>
          <label>Total</label>
        </div>
        <div className={styles.statBox}>
          <span>{invoices.filter((i) => i.paid).length}</span>
          <label>Paid</label>
        </div>
        <div className={styles.statBox}>
          <span>
            {fmtMoney(invoices.reduce((s, i) => s + (i.grossAmount || 0), 0))}
          </span>
          <label>Total Value</label>
        </div>
      </div>
      {invoices.map((inv) => (
        <InvoiceCard key={inv.id} inv={inv} type="proforma" />
      ))}
    </div>
  );
};

const TaxTab = ({ invoices }) => {
  if (!invoices?.length)
    return <EmptyState icon="◐" text="No tax invoices yet." />;
  return (
    <div className={styles.tabContent}>
      <div className={styles.invoiceStats}>
        <div className={styles.statBox}>
          <span>{invoices.length}</span>
          <label>Total</label>
        </div>
        <div className={styles.statBox}>
          <span>{invoices.filter((i) => i.paid).length}</span>
          <label>Paid</label>
        </div>
        <div className={styles.statBox}>
          <span>
            {fmtMoney(invoices.reduce((s, i) => s + (i.grossAmount || 0), 0))}
          </span>
          <label>Total Value</label>
        </div>
      </div>
      {invoices.map((inv) => (
        <InvoiceCard key={inv.id} inv={inv} type="tax" />
      ))}
    </div>
  );
};

const PaymentsTab = ({ taxInvoices }) => {
  const allPayments =
    taxInvoices?.flatMap((ti) =>
      (ti.payments || []).map((p) => ({
        ...p,
        invoiceNumber: ti.invoiceNumber || `#${ti.id}`,
      })),
    ) || [];

  if (!allPayments.length)
    return <EmptyState icon="◎" text="No payments recorded yet." />;

  const total = allPayments.reduce((s, p) => s + Number(p.amountPaid || 0), 0);

  return (
    <div className={styles.tabContent}>
      <div className={styles.invoiceStats}>
        <div className={styles.statBox}>
          <span>{allPayments.length}</span>
          <label>Payments</label>
        </div>
        <div className={styles.statBox}>
          <span>{fmtMoney(total)}</span>
          <label>Total Received</label>
        </div>
      </div>
      <div className={styles.card}>
        <table className={styles.payTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice</th>
              <th>Mode</th>
              <th>Txn ID</th>
              <th>Amount</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {allPayments.map((p) => (
              <tr key={p.id}>
                <td>{fmt(p.paymentDate)}</td>
                <td>
                  <code>{p.invoiceNumber}</code>
                </td>
                <td>
                  <span className={styles.modeBadge}>{p.paymentMode}</span>
                </td>
                <td>
                  <code className={styles.txnId}>{p.transactionId || "—"}</code>
                </td>
                <td>
                  <strong>{fmtMoney(p.amountPaid)}</strong>
                </td>
                <td className={styles.remarksCell}>{p.remarks || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ViewPostSales = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isLoading, isError, refetch } = usePostSalesById(id);

  const handleMarkNotified = async () => {
    try {
      await fetch(`/api/postsales/${id}/notify`, { method: "PUT" });
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRemark = async (remark) => {
    try {
      await fetch(
        `/api/postsales/${id}/remark?remark=${encodeURIComponent(remark)}`,
        {
          method: "PUT",
        },
      );
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.skeletonHero} />
        <div className={styles.skeletonTabs} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.errorState}>
          <span>⚠</span>
          <h2>Failed to load Post-Sale</h2>
          <p>The record may not exist or an error occurred.</p>
          <button className={styles.primaryBtn} onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabCounts = {
    proforma: data.proformaInvoices?.length || 0,
    tax: data.taxInvoices?.length || 0,
    payments:
      data.taxInvoices?.reduce((s, ti) => s + (ti.payments?.length || 0), 0) ||
      0,
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <span onClick={() => navigate("/sales")} className={styles.breadLink}>
          Sales
        </span>
        <span className={styles.sep}>›</span>
        <span
          onClick={() => navigate("/postsales")}
          className={styles.breadLink}
        >
          Post-Sales
        </span>
        <span className={styles.sep}>›</span>
        <span>#{data.id}</span>
      </div>

      {/* ── Hero Header ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroLogoWrap}>
            {data.project?.logoUrl ? (
              <img
                src={data.project.logoUrl}
                alt="project"
                className={styles.heroLogo}
              />
            ) : (
              <div className={styles.heroLogoFallback}>
                {data.project?.projectName?.charAt(0) ||
                  data.client?.name?.charAt(0) ||
                  "P"}
              </div>
            )}
          </div>
          <div className={styles.heroInfo}>
            <h1 className={styles.heroTitle}>
              {data.project?.projectName ||
                data.client?.name ||
                "Post-Sale Record"}
            </h1>
            <div className={styles.heroMeta}>
              <span>#{data.id}</span>
              {data.project?.projectCode && (
                <>
                  <span className={styles.dot}>·</span>
                  <span>{data.project.projectCode}</span>
                </>
              )}
              <span className={styles.dot}>·</span>
              <span>{fmt(data.postSalesdateTime)}</span>
            </div>
            <div className={styles.heroBadges}>
              <StatusBadge status={data.postSalesStatus} />
              <div
                className={`${styles.notifiedPill} ${data.notified ? styles.notifiedOn : styles.notifiedOff}`}
              >
                {data.notified ? "✓ Client Notified" : "⚠ Not Notified"}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroActions}>
          <button className={styles.ghostBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
          {data.project?.projectId && (
            <button
              className={styles.primaryBtn}
              onClick={() =>
                navigate(`/projects/view/${data.project.projectId}`)
              }
            >
              ⬡ View Site
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabBar}>
        {TABS.map((tab) => {
          const count = tabCounts[tab.key];
          return (
            <button
              key={tab.key}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
              {count > 0 && <span className={styles.tabCount}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div className={styles.tabPanel}>
        {activeTab === "overview" && (
          <OverviewTab
            data={data}
            onMarkNotified={handleMarkNotified}
            onUpdateRemark={handleUpdateRemark}
          />
        )}
        {activeTab === "client" && <ClientTab client={data.client} />}
        {activeTab === "project" && (
          <ProjectTab project={data.project} navigate={navigate} />
        )}
        {activeTab === "proforma" && (
          <ProformaTab invoices={data.proformaInvoices} />
        )}
        {activeTab === "tax" && <TaxTab invoices={data.taxInvoices} />}
        {activeTab === "payments" && (
          <PaymentsTab taxInvoices={data.taxInvoices} />
        )}
      </div>
      {/* <ProjectDetailSection project={data.project} navigate={navigate} /> */}
    </div>
  );
};

export default ViewPostSales;
