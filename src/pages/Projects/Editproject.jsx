import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectById } from "../../api/hooks/useProject";
import { useUpdateProject } from "../../api/hooks/useProject";
import styles from "./EditProject.module.scss";

// ─── Constants ────────────────────────────────────────────────────────────────
const PROJECT_STATUSES = [
  "PLANNING",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
];
const PRIORITIES = ["HIGH", "MEDIUM", "LOW"];
const STRUCTURE_TYPES = [
  "TOWER",
  "WING",
  "BUILDING",
  "ROW_HOUSE",
  "BUNGALOW",
  "PODIUM_BLOCK",
];
const USAGE_TYPES = [
  "RESIDENTIAL",
  "COMMERCIAL",
  "PARKING",
  "SERVICES",
  "MIXED",
];

const STATUS_CONFIG = {
  PLANNING: {
    label: "Planning",
    bg: "#dbeafe",
    color: "#1e40af",
    dot: "#3b82f6",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "#fef3c7",
    color: "#92400e",
    dot: "#f59e0b",
  },
  ON_HOLD: {
    label: "On Hold",
    bg: "#fee2e2",
    color: "#991b1b",
    dot: "#ef4444",
  },
  COMPLETED: {
    label: "Completed",
    bg: "#dcfce7",
    color: "#14532d",
    dot: "#22c55e",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "#f3f4f6",
    color: "#374151",
    dot: "#9ca3af",
  },
};

const PRIORITY_CONFIG = {
  HIGH: { label: "High", bg: "#fee2e2", color: "#991b1b" },
  MEDIUM: { label: "Medium", bg: "#fef9c3", color: "#713f12" },
  LOW: { label: "Low", bg: "#dcfce7", color: "#14532d" },
};

const toDatetimeLocal = (dt) => {
  if (!dt) return "";
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fromDatetimeLocal = (s) => {
  if (!s) return null;
  return new Date(s).toISOString().slice(0, 19);
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className={styles.skeletonWrap}>
    <div className={styles.skeletonHero} />
    <div className={styles.skeletonTabs} />
    <div className={styles.skeletonBody} />
  </div>
);

// ─── Form Components ──────────────────────────────────────────────────────────
const FormField = ({ label, required, hint, error, children }) => (
  <div className={`${styles.formField} ${error ? styles.formFieldError : ""}`}>
    <label className={styles.formLabel}>
      {label}
      {required && <span className={styles.required}>*</span>}
    </label>
    {children}
    {hint && !error && <span className={styles.formHint}>{hint}</span>}
    {error && <span className={styles.formError}>{error}</span>}
  </div>
);

const Input = ({
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  step,
  ...rest
}) => (
  <input
    className={styles.input}
    type={type}
    value={value ?? ""}
    onChange={(e) =>
      onChange(
        type === "number"
          ? e.target.value === ""
            ? null
            : Number(e.target.value)
          : e.target.value,
      )
    }
    placeholder={placeholder}
    min={min}
    step={step}
    {...rest}
  />
);

const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    className={styles.textarea}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
  />
);

const Select = ({ value, onChange, options }) => (
  <select
    className={styles.select}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
  >
    <option value="">— Select —</option>
    {options.map((o) => (
      <option key={o.value ?? o} value={o.value ?? o}>
        {o.label ?? o}
      </option>
    ))}
  </select>
);

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "identity", label: "Identity", icon: "🏗" },
  { key: "location", label: "Location", icon: "📍" },
  { key: "area", label: "Areas", icon: "📐" },
  { key: "timeline", label: "Timeline", icon: "◷" },
  { key: "structures", label: "Structures", icon: "🏢" },
  { key: "logo", label: "Logo", icon: "🖼" },
];

// ─── Identity Tab ─────────────────────────────────────────────────────────────
const IdentityTab = ({ form, setForm, errors }) => (
  <div className={styles.sectionGrid}>
    <div className={styles.sectionCard}>
      <div className={styles.sectionHead}>Project Identity</div>

      <FormField label="Project Name" required error={errors.projectName}>
        <Input
          value={form.projectName}
          onChange={(v) => setForm((f) => ({ ...f, projectName: v }))}
          placeholder="e.g. ABC Heights Residential Complex"
        />
      </FormField>

      <FormField
        label="Project Code"
        hint="Unique short code for internal tracking"
      >
        <Input
          value={form.projectCode}
          onChange={(v) => setForm((f) => ({ ...f, projectCode: v }))}
          placeholder="e.g. ABC-2026-001"
        />
      </FormField>

      <FormField
        label="Permanent Project ID"
        hint="Government-issued or registry ID"
      >
        <Input
          value={form.permanentProjectId}
          onChange={(v) => setForm((f) => ({ ...f, permanentProjectId: v }))}
          placeholder="e.g. MH-PUNE-2026-00123"
        />
      </FormField>

      <FormField label="Project Details / Description">
        <Textarea
          value={form.projectDetails}
          onChange={(v) => setForm((f) => ({ ...f, projectDetails: v }))}
          placeholder="Describe the project scope, client requirements, special notes..."
          rows={4}
        />
      </FormField>
    </div>

    <div className={styles.sectionCard}>
      <div className={styles.sectionHead}>Status & Priority</div>

      <FormField label="Project Status" required>
        <div className={styles.statusGrid}>
          {PROJECT_STATUSES.map((s) => {
            const cfg = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                type="button"
                className={`${styles.statusChip} ${form.projectStatus === s ? styles.statusChipActive : ""}`}
                style={
                  form.projectStatus === s
                    ? {
                        background: cfg.bg,
                        color: cfg.color,
                        borderColor: cfg.dot,
                      }
                    : {}
                }
                onClick={() => setForm((f) => ({ ...f, projectStatus: s }))}
              >
                <span
                  className={styles.statusDot}
                  style={{ background: cfg.dot }}
                />
                {cfg.label}
              </button>
            );
          })}
        </div>
      </FormField>

      <FormField label="Priority" required>
        <div className={styles.priorityGrid}>
          {PRIORITIES.map((p) => {
            const cfg = PRIORITY_CONFIG[p];
            return (
              <button
                key={p}
                type="button"
                className={`${styles.priorityChip} ${form.priority === p ? styles.priorityChipActive : ""}`}
                style={
                  form.priority === p
                    ? { background: cfg.bg, color: cfg.color }
                    : {}
                }
                onClick={() => setForm((f) => ({ ...f, priority: p }))}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </FormField>
    </div>
  </div>
);

// ─── Location Tab ─────────────────────────────────────────────────────────────
const LocationTab = ({ form, setForm, errors }) => (
  <div className={styles.sectionGrid}>
    <div className={styles.sectionCard} style={{ gridColumn: "1 / -1" }}>
      <div className={styles.sectionHead}>📍 Address & Location</div>

      <div className={styles.twoCol}>
        <FormField label="Address" required error={errors.address}>
          <Textarea
            value={form.address}
            onChange={(v) => setForm((f) => ({ ...f, address: v }))}
            placeholder="Survey No. 42/3, Baner Road, Near..."
            rows={2}
          />
        </FormField>

        <FormField label="City" required error={errors.city}>
          <Input
            value={form.city}
            onChange={(v) => setForm((f) => ({ ...f, city: v }))}
            placeholder="e.g. Pune"
          />
        </FormField>
      </div>

      <div className={styles.twoCol}>
        <FormField label="Latitude" hint="e.g. 18.5629">
          <Input
            type="number"
            value={form.latitude}
            onChange={(v) => setForm((f) => ({ ...f, latitude: v }))}
            placeholder="18.5629"
            step="0.0001"
          />
        </FormField>

        <FormField label="Longitude" hint="e.g. 73.7799">
          <Input
            type="number"
            value={form.longitude}
            onChange={(v) => setForm((f) => ({ ...f, longitude: v }))}
            placeholder="73.7799"
            step="0.0001"
          />
        </FormField>
      </div>

      <FormField
        label="Google Maps Place / Link"
        hint="Paste the Google Maps share link or place name"
      >
        <Input
          value={form.googlePlace}
          onChange={(v) => setForm((f) => ({ ...f, googlePlace: v }))}
          placeholder="https://maps.google.com/... or place name"
        />
      </FormField>

      {(form.latitude || form.longitude) && (
        <div className={styles.mapPreview}>
          <a
            href={`https://maps.google.com/?q=${form.latitude},${form.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapLink}
          >
            🗺 Open coordinates in Google Maps ↗
          </a>
        </div>
      )}
    </div>
  </div>
);

// ─── Area Tab ─────────────────────────────────────────────────────────────────
const AreaTab = ({ form, setForm }) => {
  const efficiency =
    form.totalBuiltUpArea && form.totalCarpetArea
      ? ((form.totalCarpetArea / form.totalBuiltUpArea) * 100).toFixed(1)
      : null;

  return (
    <div className={styles.sectionGrid}>
      <div className={styles.sectionCard} style={{ gridColumn: "1 / -1" }}>
        <div className={styles.sectionHead}>📐 Area Measurements (sq.ft)</div>

        <div className={styles.threeCol}>
          <FormField label="Plot Area" hint="Total land area in sq.ft">
            <Input
              type="number"
              value={form.plotArea}
              onChange={(v) => setForm((f) => ({ ...f, plotArea: v }))}
              placeholder="e.g. 5000"
              min="0"
              step="0.01"
            />
          </FormField>

          <FormField
            label="Total Built-Up Area"
            hint="Including all floors, walls, balconies"
          >
            <Input
              type="number"
              value={form.totalBuiltUpArea}
              onChange={(v) => setForm((f) => ({ ...f, totalBuiltUpArea: v }))}
              placeholder="e.g. 12000"
              min="0"
              step="0.01"
            />
          </FormField>

          <FormField
            label="Total Carpet Area"
            hint="Usable area excluding walls"
          >
            <Input
              type="number"
              value={form.totalCarpetArea}
              onChange={(v) => setForm((f) => ({ ...f, totalCarpetArea: v }))}
              placeholder="e.g. 9600"
              min="0"
              step="0.01"
            />
          </FormField>
        </div>

        {/* Area Visual Summary */}
        {(form.plotArea || form.totalBuiltUpArea || form.totalCarpetArea) && (
          <div className={styles.areaSummary}>
            <div className={styles.areaSummaryHead}>Area Summary</div>
            <div className={styles.areaBarWrap}>
              {form.plotArea && (
                <div className={styles.areaBarRow}>
                  <span>Plot</span>
                  <div className={styles.areaBarTrack}>
                    <div
                      className={styles.areaBarFill}
                      style={{ width: "100%", background: "#dbeafe" }}
                    />
                  </div>
                  <span>{Number(form.plotArea).toLocaleString()} sq.ft</span>
                </div>
              )}
              {form.totalBuiltUpArea && form.plotArea && (
                <div className={styles.areaBarRow}>
                  <span>Built-Up</span>
                  <div className={styles.areaBarTrack}>
                    <div
                      className={styles.areaBarFill}
                      style={{
                        width: `${Math.min(100, (form.totalBuiltUpArea / form.plotArea) * 100)}%`,
                        background: "#c7d2fe",
                      }}
                    />
                  </div>
                  <span>
                    {Number(form.totalBuiltUpArea).toLocaleString()} sq.ft
                  </span>
                </div>
              )}
              {form.totalCarpetArea && form.plotArea && (
                <div className={styles.areaBarRow}>
                  <span>Carpet</span>
                  <div className={styles.areaBarTrack}>
                    <div
                      className={styles.areaBarFill}
                      style={{
                        width: `${Math.min(100, (form.totalCarpetArea / form.plotArea) * 100)}%`,
                        background: "#bbf7d0",
                      }}
                    />
                  </div>
                  <span>
                    {Number(form.totalCarpetArea).toLocaleString()} sq.ft
                  </span>
                </div>
              )}
            </div>
            {efficiency && (
              <div className={styles.areaEfficiency}>
                Carpet efficiency: <strong>{efficiency}%</strong> of built-up
                area
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Timeline Tab ─────────────────────────────────────────────────────────────
const TimelineTab = ({ form, setForm }) => (
  <div className={styles.sectionGrid}>
    <div className={styles.sectionCard} style={{ gridColumn: "1 / -1" }}>
      <div className={styles.sectionHead}>◷ Project Timeline</div>

      <div className={styles.timelineGrid}>
        {/* Created */}
        <div className={styles.tlEditRow}>
          <div className={styles.tlEditDot} style={{ background: "#94a3b8" }} />
          <div className={styles.tlEditContent}>
            <FormField
              label="Project Created"
              hint="Auto-set on creation, can be adjusted"
            >
              <input
                type="datetime-local"
                className={styles.input}
                value={toDatetimeLocal(form.projectCreatedDateTime)}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    projectCreatedDateTime: fromDatetimeLocal(e.target.value),
                  }))
                }
              />
            </FormField>
          </div>
        </div>

        {/* Start */}
        <div className={styles.tlEditRow}>
          <div className={styles.tlEditDot} style={{ background: "#3b82f6" }} />
          <div className={styles.tlEditContent}>
            <FormField
              label="Project Start Date"
              hint="When work actually commenced on-site"
            >
              <input
                type="datetime-local"
                className={styles.input}
                value={toDatetimeLocal(form.projectStartDateTime)}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    projectStartDateTime: fromDatetimeLocal(e.target.value),
                  }))
                }
              />
            </FormField>
          </div>
        </div>

        {/* Expected End */}
        <div className={styles.tlEditRow}>
          <div className={styles.tlEditDot} style={{ background: "#f59e0b" }} />
          <div className={styles.tlEditContent}>
            <FormField
              label="Expected End Date"
              hint="Planned handover / completion date"
            >
              <input
                type="datetime-local"
                className={styles.input}
                value={toDatetimeLocal(form.projectExpectedEndDate)}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    projectExpectedEndDate: fromDatetimeLocal(e.target.value),
                  }))
                }
              />
            </FormField>
          </div>
        </div>

        {/* Actual End */}
        <div className={styles.tlEditRow}>
          <div className={styles.tlEditDot} style={{ background: "#22c55e" }} />
          <div className={styles.tlEditContent}>
            <FormField
              label="Actual End Date"
              hint="Leave blank if project is still ongoing"
            >
              <input
                type="datetime-local"
                className={styles.input}
                value={toDatetimeLocal(form.projectEndDateTime)}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    projectEndDateTime: fromDatetimeLocal(e.target.value),
                  }))
                }
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Visual Timeline Bar */}
      {form.projectStartDateTime && form.projectExpectedEndDate && (
        <div className={styles.tlBarSection}>
          <div className={styles.tlBarLabel}>Project Duration</div>
          <div className={styles.tlBarRow}>
            <span className={styles.tlBarDate}>
              {new Date(form.projectStartDateTime).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <div className={styles.tlBarTrack}>
              {form.projectEndDateTime ? (
                <div
                  className={styles.tlBarFill}
                  title="Completed"
                  style={{
                    width: "100%",
                    background: "linear-gradient(90deg, #3b82f6, #22c55e)",
                  }}
                />
              ) : (
                (() => {
                  const start = new Date(form.projectStartDateTime).getTime();
                  const end = new Date(form.projectExpectedEndDate).getTime();
                  const now = Date.now();
                  const pct = Math.min(
                    100,
                    Math.max(0, ((now - start) / (end - start)) * 100),
                  );
                  return (
                    <>
                      <div
                        className={styles.tlBarFill}
                        style={{
                          width: `${pct}%`,
                          background:
                            "linear-gradient(90deg, #3b82f6, #f59e0b)",
                        }}
                      />
                      <div
                        className={styles.tlBarNow}
                        style={{ left: `${pct}%` }}
                        title="Today"
                      />
                    </>
                  );
                })()
              )}
            </div>
            <span className={styles.tlBarDate}>
              {new Date(form.projectExpectedEndDate).toLocaleDateString(
                "en-IN",
                { day: "2-digit", month: "short", year: "numeric" },
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
);

// ─── Structures Tab ───────────────────────────────────────────────────────────
const StructuresTab = ({ form, setForm }) => {
  const addStructure = () => {
    setForm((f) => ({
      ...f,
      structures: [
        ...(f.structures || []),
        {
          id: null,
          structureName: "",
          structureType: "",
          usageType: "",
          totalFloors: null,
          totalBasements: null,
          builtUpArea: null,
        },
      ],
    }));
  };

  const removeStructure = (idx) => {
    setForm((f) => ({
      ...f,
      structures: (f.structures || []).filter((_, i) => i !== idx),
    }));
  };

  const updateStructure = (idx, field, value) => {
    setForm((f) => {
      const updated = [...(f.structures || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...f, structures: updated };
    });
  };

  const structures = form.structures || [];

  return (
    <div className={styles.sectionGrid}>
      <div className={styles.sectionCard} style={{ gridColumn: "1 / -1" }}>
        <div className={styles.sectionHeadRow}>
          <div className={styles.sectionHead}>🏢 Building Structures</div>
          <button
            type="button"
            className={styles.addBtn}
            onClick={addStructure}
          >
            + Add Structure
          </button>
        </div>

        {structures.length === 0 ? (
          <div className={styles.emptyStructures}>
            <span>🏗</span>
            <p>No structures added yet.</p>
            <button
              type="button"
              className={styles.addBtnLarge}
              onClick={addStructure}
            >
              + Add First Structure
            </button>
          </div>
        ) : (
          <div className={styles.structuresList}>
            {structures.map((s, idx) => (
              <div key={idx} className={styles.structureCard}>
                <div className={styles.structureCardHead}>
                  <span className={styles.structureNum}>
                    Structure {idx + 1}
                  </span>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeStructure(idx)}
                  >
                    ✕ Remove
                  </button>
                </div>

                <div className={styles.structureGrid}>
                  <FormField label="Structure Name">
                    <Input
                      value={s.structureName}
                      onChange={(v) => updateStructure(idx, "structureName", v)}
                      placeholder="e.g. Wing A, Tower 1, Villa 3"
                    />
                  </FormField>

                  <FormField label="Structure Type">
                    <Select
                      value={s.structureType}
                      onChange={(v) => updateStructure(idx, "structureType", v)}
                      options={STRUCTURE_TYPES.map((t) => ({
                        value: t,
                        label: t.replace(/_/g, " "),
                      }))}
                    />
                  </FormField>

                  <FormField label="Usage Type">
                    <Select
                      value={s.usageType}
                      onChange={(v) => updateStructure(idx, "usageType", v)}
                      options={USAGE_TYPES.map((t) => ({ value: t, label: t }))}
                    />
                  </FormField>

                  <FormField label="Total Floors" hint="Above ground">
                    <Input
                      type="number"
                      value={s.totalFloors}
                      onChange={(v) => updateStructure(idx, "totalFloors", v)}
                      placeholder="e.g. 12"
                      min="0"
                    />
                  </FormField>

                  <FormField label="Total Basements">
                    <Input
                      type="number"
                      value={s.totalBasements}
                      onChange={(v) =>
                        updateStructure(idx, "totalBasements", v)
                      }
                      placeholder="e.g. 2"
                      min="0"
                    />
                  </FormField>

                  <FormField label="Built-Up Area (sq.ft)">
                    <Input
                      type="number"
                      value={s.builtUpArea}
                      onChange={(v) => updateStructure(idx, "builtUpArea", v)}
                      placeholder="e.g. 3500"
                      min="0"
                      step="0.01"
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Logo Tab ─────────────────────────────────────────────────────────────────
const LogoTab = ({
  form,
  logoFile,
  setLogoFile,
  logoPreview,
  setLogoPreview,
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const currentImage = logoPreview || form.logoUrl;

  return (
    <div className={styles.sectionGrid}>
      <div className={styles.sectionCard} style={{ gridColumn: "1 / -1" }}>
        <div className={styles.sectionHead}>🖼 Project Logo</div>

        <div className={styles.logoSection}>
          {/* Current Preview */}
          <div className={styles.logoPreviewWrap}>
            {currentImage ? (
              <div className={styles.logoPreviewBox}>
                <img
                  src={currentImage}
                  alt="Logo preview"
                  className={styles.logoPreviewImg}
                />
                {logoPreview && <div className={styles.logoNewBadge}>New</div>}
              </div>
            ) : (
              <div className={styles.logoPlaceholder}>
                <span>{(form.projectName || "P")[0].toUpperCase()}</span>
              </div>
            )}
            <div className={styles.logoPreviewMeta}>
              {logoFile ? (
                <>
                  <p className={styles.logoFileName}>{logoFile.name}</p>
                  <p className={styles.logoFileSize}>
                    {(logoFile.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    type="button"
                    className={styles.removeLogo}
                    onClick={clearLogo}
                  >
                    Remove new logo
                  </button>
                </>
              ) : form.logoUrl ? (
                <p className={styles.logoFileName}>Current logo from server</p>
              ) : (
                <p className={styles.logoNoFile}>No logo uploaded</p>
              )}
            </div>
          </div>

          {/* Upload Zone */}
          <div
            className={styles.dropzone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className={styles.dropzoneIcon}>📤</span>
            <p className={styles.dropzoneText}>Drag & drop a logo image here</p>
            <p className={styles.dropzoneHint}>
              or click to browse — PNG, JPG, SVG (max 5MB)
            </p>
            <button type="button" className={styles.browseBtn}>
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
          </div>
        </div>

        {form.logoUrl && (
          <div className={styles.currentLogoInfo}>
            <strong>Current logo URL:</strong>
            <code className={styles.logoUrl}>{form.logoUrl}</code>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EditProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProjectById(projectId);
  const {
    mutate: updateProject,
    isPending,
    isSuccess,
    isError: updateError,
  } = useUpdateProject();

  const [activeTab, setActiveTab] = useState("identity");
  const [form, setForm] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null | "saving" | "saved" | "error"

  // Populate form once data loads
  useEffect(() => {
    const p = data?.data;
    if (!p) return;
    setForm({
      projectName: p.projectName || "",
      projectCode: p.projectCode || "",
      permanentProjectId: p.permanentProjectId || "",
      projectDetails: p.projectDetails || "",
      projectStatus: p.projectStatus || "PLANNING",
      priority: p.priority || "MEDIUM",
      address: p.address || "",
      city: p.city || "",
      latitude: p.latitude ?? null,
      longitude: p.longitude ?? null,
      googlePlace: p.googlePlace || "",
      plotArea: p.plotArea ?? null,
      totalBuiltUpArea: p.totalBuiltUpArea ?? null,
      totalCarpetArea: p.totalCarpetArea ?? null,
      projectCreatedDateTime: p.projectCreatedDateTime || null,
      projectStartDateTime: p.projectStartDateTime || null,
      projectExpectedEndDate: p.projectExpectedEndDate || null,
      projectEndDateTime: p.projectEndDateTime || null,
      logoUrl: p.logoUrl || "",
      structures: (p.structures || []).map((s) => ({
        id: s.id,
        structureName: s.structureName || "",
        structureType: s.structureType || "",
        usageType: s.usageType || "",
        totalFloors: s.totalFloors ?? null,
        totalBasements: s.totalBasements ?? null,
        builtUpArea: s.builtUpArea ?? null,
      })),
    });
  }, [data]);

  // Track dirty state
  useEffect(() => {
    if (form) setDirty(true);
  }, [form]);

  const validate = () => {
    const e = {};
    if (!form.projectName?.trim()) e.projectName = "Project name is required";
    if (!form.address?.trim()) e.address = "Address is required";
    if (!form.city?.trim()) e.city = "City is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      // Switch to the tab that has errors
      if (errors.projectName) setActiveTab("identity");
      else if (errors.address || errors.city) setActiveTab("location");
      return;
    }

    setSaveStatus("saving");

    // Build the Project object to send as multipart "project" part
    const projectData = {
      projectName: form.projectName,
      projectCode: form.projectCode || null,
      permanentProjectId: form.permanentProjectId || null,
      projectDetails: form.projectDetails || null,
      projectStatus: form.projectStatus,
      priority: form.priority,
      address: form.address,
      city: form.city,
      latitude: form.latitude,
      longitude: form.longitude,
      googlePlace: form.googlePlace || null,
      plotArea: form.plotArea,
      totalBuiltUpArea: form.totalBuiltUpArea,
      totalCarpetArea: form.totalCarpetArea,
      projectCreatedDateTime: form.projectCreatedDateTime,
      projectStartDateTime: form.projectStartDateTime,
      projectExpectedEndDate: form.projectExpectedEndDate,
      projectEndDateTime: form.projectEndDateTime,
      structures: (form.structures || []).map((s) => ({
        ...(s.id ? { id: s.id } : {}),
        structureName: s.structureName || null,
        structureType: s.structureType || null,
        usageType: s.usageType || null,
        totalFloors: s.totalFloors,
        totalBasements: s.totalBasements,
        builtUpArea: s.builtUpArea,
      })),
    };

    updateProject(
      { projectId: Number(projectId), projectData, logoFile },
      {
        onSuccess: () => {
          setSaveStatus("saved");
          setDirty(false);
          setTimeout(() => setSaveStatus(null), 3000);
        },
        onError: () => {
          setSaveStatus("error");
          setTimeout(() => setSaveStatus(null), 4000);
        },
      },
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const p = data?.data;

  if (isLoading)
    return (
      <div className={styles.pageWrapper}>
        <Skeleton />
      </div>
    );

  if (isError || (!isLoading && !p)) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.errorState}>
          <span>⚠️</span>
          <h3>Failed to load project</h3>
          <p>Unable to fetch project data for editing.</p>
          <button onClick={() => navigate(-1)} className={styles.errBtn}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!form)
    return (
      <div className={styles.pageWrapper}>
        <Skeleton />
      </div>
    );

  const projectInitial = (form.projectName ||
    p?.projectName ||
    "P")[0].toUpperCase();
  const statusCfg = STATUS_CONFIG[form.projectStatus] || STATUS_CONFIG.PLANNING;
  const priorityCfg = PRIORITY_CONFIG[form.priority] || null;

  const tabHasError = {
    identity: !!errors.projectName,
    location: !!(errors.address || errors.city),
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ── Breadcrumb ── */}
      <nav className={styles.breadcrumb}>
        <span
          className={styles.breadLink}
          onClick={() => navigate("/projects")}
        >
          Projects
        </span>
        <span className={styles.sep}>›</span>
        <span
          className={styles.breadLink}
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          {p?.projectName || `Project #${projectId}`}
        </span>
        <span className={styles.sep}>›</span>
        <span>Edit</span>
      </nav>

      {/* ── Hero Header ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroLogo}>
            {logoPreview || form.logoUrl ? (
              <img src={logoPreview || form.logoUrl} alt="logo" />
            ) : (
              <span>{projectInitial}</span>
            )}
          </div>
          <div className={styles.heroMeta}>
            <div className={styles.heroEditBadge}>✏️ Editing Project</div>
            <h1 className={styles.heroTitle}>
              {form.projectName || (
                <span className={styles.heroPlaceholder}>
                  Enter project name...
                </span>
              )}
            </h1>
            <div className={styles.heroChips}>
              {form.projectCode && (
                <code className={styles.chip}>{form.projectCode}</code>
              )}
              {form.city && <span className={styles.chip}>📍 {form.city}</span>}
              <span
                className={styles.chip}
                style={{ background: statusCfg.bg, color: statusCfg.color }}
              >
                <span
                  className={styles.statusDot}
                  style={{ background: statusCfg.dot }}
                />
                {statusCfg.label}
              </span>
              {priorityCfg && (
                <span
                  className={styles.chip}
                  style={{
                    background: priorityCfg.bg,
                    color: priorityCfg.color,
                  }}
                >
                  {priorityCfg.label} PRIORITY
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className={styles.savingSpinner} />
                Saving...
              </>
            ) : (
              "💾 Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* ── Save Status Toast ── */}
      {saveStatus && (
        <div className={`${styles.toast} ${styles[`toast_${saveStatus}`]}`}>
          {saveStatus === "saving" && "⏳ Saving changes..."}
          {saveStatus === "saved" && "✅ Changes saved successfully!"}
          {saveStatus === "error" && "❌ Failed to save. Please try again."}
        </div>
      )}

      {/* ── Tabs ── */}
      <div className={styles.tabsWrap}>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""} ${tabHasError[tab.key] ? styles.tabError : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
              {tabHasError[tab.key] && <span className={styles.tabErrorDot} />}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className={styles.tabContent}>
        {activeTab === "identity" && (
          <IdentityTab form={form} setForm={setForm} errors={errors} />
        )}
        {activeTab === "location" && (
          <LocationTab form={form} setForm={setForm} errors={errors} />
        )}
        {activeTab === "area" && <AreaTab form={form} setForm={setForm} />}
        {activeTab === "timeline" && (
          <TimelineTab form={form} setForm={setForm} />
        )}
        {activeTab === "structures" && (
          <StructuresTab form={form} setForm={setForm} />
        )}
        {activeTab === "logo" && (
          <LogoTab
            form={form}
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            logoPreview={logoPreview}
            setLogoPreview={setLogoPreview}
          />
        )}
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarLeft}>
          {dirty && (
            <span className={styles.unsavedDot}>● Unsaved changes</span>
          )}
        </div>
        <div className={styles.bottomBarRight}>
          <button
            type="button"
            className={styles.cancelBtnSm}
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            Discard
          </button>
          <button
            type="button"
            className={styles.saveBtnSm}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
