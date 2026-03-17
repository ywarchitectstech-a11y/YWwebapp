import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePostSales } from "../../api/hooks/usePostSales";
import { useClientList } from "../../api/hooks/useClient";
import styles from "./CreatePostSales.module.scss";

// ─── Constants ────────────────────────────────────────────────────────────────
const POST_SALES_STATUSES = [
  { value: "CREATED", bg: "#e0f2fe", color: "#0369a1", dot: "#0284c7" },
  { value: "IN_PROGRESS", bg: "#fef9c3", color: "#854d0e", dot: "#ca8a04" },
  { value: "COMPLETED", bg: "#dcfce7", color: "#166534", dot: "#16a34a" },
  { value: "CANCELLED", bg: "#fee2e2", color: "#991b1b", dot: "#dc2626" },
  { value: "PENDING", bg: "#f3e8ff", color: "#6b21a8", dot: "#9333ea" },
];

const getStatusCfg = (val) =>
  POST_SALES_STATUSES.find((s) => s.value === val) || {
    bg: "#f3f4f6",
    color: "#374151",
    dot: "#6b7280",
  };

// ─── Small Reusable Components ────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = getStatusCfg(status);
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

const FormField = ({ label, required, error, hint, span2, children }) => (
  <div
    className={`${styles.formField} ${error ? styles.fieldError : ""} ${span2 ? styles.span2 : ""}`}
  >
    <label className={styles.fieldLabel}>
      {label}
      {required && <span className={styles.required}>*</span>}
    </label>
    {children}
    {hint && !error && <span className={styles.fieldHint}>{hint}</span>}
    {error && <span className={styles.errorMsg}>{error}</span>}
  </div>
);

// ─── Client Search Dropdown ───────────────────────────────────────────────────
const ClientSearch = ({ clients = [], selectedId, onSelect, error }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const selected = clients.find((c) => c.id === selectedId);

  const filtered = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(c.phone || "").includes(search),
  );

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (selected) {
    return (
      <div
        className={`${styles.selectedClientCard} ${error ? styles.inputError : ""}`}
      >
        <div className={styles.selectedAvatar}>
          {selected.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className={styles.selectedInfo}>
          <span className={styles.selectedName}>{selected.name}</span>
          <span className={styles.selectedMeta}>
            {[selected.email, selected.phone].filter(Boolean).join(" · ")}
          </span>
        </div>
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => {
            onSelect(null);
            setSearch("");
          }}
          title="Remove selection"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className={styles.clientSearchWrap} ref={wrapRef}>
      <input
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        placeholder="Search client name or phone..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <div className={styles.clientDropdown}>
          {filtered.length === 0 ? (
            <div className={styles.dropdownEmpty}>No clients found</div>
          ) : (
            filtered.slice(0, 8).map((c) => (
              <div
                key={c.id}
                className={styles.clientItem}
                onClick={() => {
                  onSelect(c.id);
                  setOpen(false);
                }}
              >
                <div className={styles.clientAvatar}>
                  {c.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className={styles.clientInfo}>
                  <strong>{c.name}</strong>
                  <span>{c.email}</span>
                </div>
                {c.phone && (
                  <span className={styles.clientPhone}>{c.phone}</span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const initialForm = {
  isExistingClient: true,
  // existing client
  clientId: null,
  // new client fields
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  clientAddress: "",
  // post-sale fields
  postSalesStatus: "CREATED",
  notified: false,
  remark: "",
};

const CreatePostSales = () => {
  const navigate = useNavigate();

  const {
    mutate: createPostSales,
    isPending,
    isError,
    error: apiError,
  } = useCreatePostSales();
  const { data: clientListData } = useClientList();
  // support both { data: [...] } and plain array response shapes
  const clients = Array.isArray(clientListData)
    ? clientListData
    : clientListData?.data || [];

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdId, setCreatedId] = useState(null);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (form.isExistingClient) {
      if (!form.clientId) e.clientId = "Please select an existing client";
    } else {
      if (!form.clientName.trim()) e.clientName = "Client name is required";
      if (!form.clientEmail.trim()) e.clientEmail = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.clientEmail))
        e.clientEmail = "Enter a valid email address";
      if (!form.clientPhone.trim()) e.clientPhone = "Phone number is required";
    }
    if (!form.postSalesStatus) e.postSalesStatus = "Please select a status";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Build payload ────────────────────────────────────────────────────────────
  // Backend (createPostSales service):
  //   ✓ requires client.id              → validates & fetches from DB
  //   ✓ auto-sets postSalesdateTime     → LocalDateTime.now()
  //   ✓ auto-creates project            → projectService.createQuickProject()
  //   ✓ accepts postSalesStatus, notified, remark
  //   ✗ preSales / acceptedQuotation    → NOT needed for direct post-sale
  //   ✗ project / invoices              → auto-created / managed separately
  const buildPayload = () => {
    const payload = {
      postSalesStatus: form.postSalesStatus,
      notified: form.notified,
      remark: form.remark.trim() || null,
    };

    if (form.isExistingClient) {
      payload.client = { id: Number(form.clientId) };
    } else {
      payload.client = {
        name: form.clientName.trim(),
        email: form.clientEmail.trim(),
        phone: Number(form.clientPhone),
        address: form.clientAddress.trim() || null,
      };
    }

    return payload;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    createPostSales(buildPayload(), {
      onSuccess: (res) => {
        setCreatedId(res?.data?.id ?? res?.id ?? null);
        navigate(`/postsales/view/${createdId}`);
        setSubmitSuccess(true);
      },
    });
  };

  // ── Success screen ───────────────────────────────────────────────────────────
  // if (submitSuccess) {
  //   return (
  //     <div className={styles.pageWrapper}>
  //       <div className={styles.successState}>
  //         <div className={styles.successRing}>
  //           <span className={styles.successIconChar}>◎</span>
  //         </div>
  //         <h2>Post-Sale Created!</h2>
  //         <p>Record saved. A project has been auto-created and linked.</p>
  //         {createdId && (
  //           <div className={styles.successId}>
  //             Record ID: <code>#{createdId}</code>
  //           </div>
  //         )}
  //         <div className={styles.successActions}>
  //           {createdId && (
  //             <button
  //               className={styles.primaryBtn}
  //               onClick={() => navigate(`/postsales/view/${createdId}`)}
  //             >
  //               ⬡ View Record
  //             </button>
  //           )}
  //           <button
  //             className={styles.primaryBtn}
  //             onClick={() => navigate("/postsales")}
  //           >
  //             ◈ All Post-Sales
  //           </button>
  //           <button
  //             className={styles.ghostBtn}
  //             onClick={() => {
  //               setForm(initialForm);
  //               setErrors({});
  //               setCreatedId(null);
  //               setSubmitSuccess(false);
  //             }}
  //           >
  //             + Create Another
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={styles.pageWrapper}>
      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroLogoFallback}>PS</div>
          <div className={styles.heroInfo}>
            <h1 className={styles.heroTitle}>New Post-Sale</h1>
            <div className={styles.heroMeta}>
              <span>Direct Entry</span>
              <span className={styles.dot}>·</span>
              <span>
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className={styles.heroBadges}>
              <StatusBadge status={form.postSalesStatus} />
              <div
                className={`${styles.notifiedPill} ${
                  form.notified ? styles.notifiedOn : styles.notifiedOff
                }`}
              >
                {form.notified ? "✓ Client Notified" : "⚠ Not Notified"}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.heroActions}>
          <button className={styles.ghostBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>

      {/* ── Form Body ───────────────────────────────────────────────────────── */}
      <div className={styles.formBody}>
        {/* ════ Card 1: Client Information ════ */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>◈</span>
            <h3>Client Information</h3>
          </div>

          {/* Existing / New toggle pills */}
          <div className={styles.clientModeRow}>
            <button
              type="button"
              className={`${styles.modeBtn} ${form.isExistingClient ? styles.modeBtnActive : ""}`}
              onClick={() => {
                set("isExistingClient", true);
                setErrors({});
              }}
            >
              <span>◈</span> Existing Client
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${!form.isExistingClient ? styles.modeBtnActive : ""}`}
              onClick={() => {
                set("isExistingClient", false);
                setErrors({});
              }}
            >
              <span>⊕</span> New Client
            </button>
          </div>

          {form.isExistingClient ? (
            /* ── Search existing client ── */
            <div className={styles.formGrid}>
              <FormField
                label="Search Client"
                required
                error={errors.clientId}
                hint="Type name or phone number to search"
                span2
              >
                <ClientSearch
                  clients={clients}
                  selectedId={form.clientId}
                  onSelect={(id) => set("clientId", id)}
                  error={!!errors.clientId}
                />
              </FormField>
            </div>
          ) : (
            /* ── New client fields ── */
            <div className={styles.formGrid}>
              <FormField label="Client Name" required error={errors.clientName}>
                <input
                  className={styles.input}
                  placeholder="Enter client name"
                  value={form.clientName}
                  onChange={(e) => set("clientName", e.target.value)}
                />
              </FormField>

              <FormField label="Email" required error={errors.clientEmail}>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="Enter email address"
                  value={form.clientEmail}
                  onChange={(e) => set("clientEmail", e.target.value)}
                />
              </FormField>

              <FormField label="Phone" required error={errors.clientPhone}>
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="Enter phone number"
                  value={form.clientPhone}
                  onChange={(e) => set("clientPhone", e.target.value)}
                />
              </FormField>

              <FormField label="Address" error={errors.clientAddress}>
                <input
                  className={styles.input}
                  placeholder="Enter address (optional)"
                  value={form.clientAddress}
                  onChange={(e) => set("clientAddress", e.target.value)}
                />
              </FormField>
            </div>
          )}
        </div>

        {/* ════ Card 2: Post-Sale Details ════ */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>⬡</span>
            <h3>Post-Sale Details</h3>
          </div>

          {/* Status */}
          <div
            className={`${styles.formField} ${errors.postSalesStatus ? styles.fieldError : ""}`}
          >
            <label className={styles.fieldLabel}>
              Status <span className={styles.required}>*</span>
            </label>
            <div className={styles.statusGrid}>
              {POST_SALES_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`${styles.statusCard} ${
                    form.postSalesStatus === s.value
                      ? styles.statusCardActive
                      : ""
                  }`}
                  style={
                    form.postSalesStatus === s.value
                      ? { background: s.bg, borderColor: s.dot, color: s.color }
                      : {}
                  }
                  onClick={() => set("postSalesStatus", s.value)}
                >
                  <span
                    className={styles.statusDot}
                    style={{ background: s.dot }}
                  />
                  {s.value.replace(/_/g, " ")}
                </button>
              ))}
            </div>
            {errors.postSalesStatus && (
              <span className={styles.errorMsg}>{errors.postSalesStatus}</span>
            )}
          </div>

          {/* Notified toggle */}
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Client Notified</span>
              <span className={styles.toggleHint}>
                Has the client been informed about this post-sale?
              </span>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${form.notified ? styles.toggleOn : styles.toggleOff}`}
              onClick={() => set("notified", !form.notified)}
              aria-label="Toggle notified"
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </div>

        {/* ════ Card 3: Remark ════ */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>✎</span>
            <h3>Remark</h3>
          </div>

          <FormField
            label="Internal Note"
            error={errors.remark}
            hint="Optional — internal use only, not visible to the client"
          >
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="e.g. Client confirmed via call. Project kickoff next week..."
              rows={4}
              maxLength={1000}
              value={form.remark}
              onChange={(e) => set("remark", e.target.value)}
            />
          </FormField>
          <div className={styles.charCount}>{form.remark.length} / 1000</div>
        </div>

        {/* ════ Auto-generated notice ════ */}
        <div className={styles.infoBox}>
          <span className={styles.infoBoxIcon}>◷</span>
          <div>
            <strong>Auto-generated on save</strong>
            <p>
              Date &amp; time and a linked project will be created automatically
              by the server. Invoices and payments can be added after creation.
            </p>
          </div>
        </div>

        {/* ════ API Error ════ */}
        {isError && (
          <div className={styles.apiError}>
            <span>⚠</span>
            <p>
              {apiError?.response?.data?.message ||
                apiError?.message ||
                "Failed to create post-sale. Please try again."}
            </p>
          </div>
        )}

        {/* ════ Actions ════ */}
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => navigate(-1)}
          >
            ← Cancel
          </button>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className={styles.spinner} /> Creating…
              </>
            ) : (
              "◎ Create Post-Sale"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostSales;
