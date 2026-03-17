import { useState } from "react";
import styles from "./StructurePage.module.scss";
import { useParams } from "react-router-dom";
import { useCreateStructure } from "../../api/hooks/useStructure";
import { useNavigate } from "react-router-dom";

import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";
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
const LEVEL_TYPES = [
  "BASEMENT",
  "STILT",
  "GROUND_FLOOR",
  "PODIUM",
  "TYPICAL_FLOOR",
  "REFUGE_FLOOR",
  "SERVICE_FLOOR",
  "AMENITY_FLOOR",
  "TERRACE",
];
const LEVEL_ORDER = [
  "BASEMENT",
  "STILT",
  "GROUND_FLOOR",
  "PODIUM",
  "TYPICAL_FLOOR",
  "REFUGE_FLOOR",
  "SERVICE_FLOOR",
  "AMENITY_FLOOR",
  "TERRACE",
];

const LEVEL_META = {
  BASEMENT: { color: "#6366f1", bg: "rgba(99,102,241,0.08)" },
  STILT: { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
  GROUND_FLOOR: { color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  PODIUM: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  TYPICAL_FLOOR: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
  REFUGE_FLOOR: { color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
  SERVICE_FLOOR: { color: "#ec4899", bg: "rgba(236,72,153,0.08)" },
  AMENITY_FLOOR: { color: "#14b8a6", bg: "rgba(20,184,166,0.08)" },
  TERRACE: { color: "#7c5e0b", bg: "rgba(124,94,11,0.08)" },
};

const initStructure = {
  structureName: "",
  structureType: "",
  usageType: "",
  totalFloors: "",
  totalBasements: "",
  builtUpArea: "",
};
const initLevel = {
  levelLabel: "",
  levelNumber: "",
  levelType: "",
  usageType: "",
  builtUpArea: "",
  carpetArea: "",
  floorHeight: "",
  constructionStatus: "",
  progressPercentage: "",
};

export default function Structure() {
  const { projectId } = useParams();
  const { mutate: createStructureApi, isPending } = useCreateStructure();
  const navigate = useNavigate();
  const [structure, setStructure] = useState(initStructure);
  const [levels, setLevels] = useState([]);
  const [levelForm, setLevelForm] = useState(initLevel);
  const [activeTab, setActiveTab] = useState("structure");
  const [editingIdx, setEditingIdx] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const onStructure = (e) =>
    setStructure({ ...structure, [e.target.name]: e.target.value });
  const onLevel = (e) =>
    setLevelForm({ ...levelForm, [e.target.name]: e.target.value });

  const sorted = [...levels].sort(
    (a, b) =>
      LEVEL_ORDER.indexOf(a.levelType) - LEVEL_ORDER.indexOf(b.levelType),
  );

  const addOrUpdate = () => {
    if (!levelForm.levelLabel || !levelForm.levelType) return;
    if (editingIdx !== null) {
      const u = [...levels];
      u[editingIdx] = levelForm;
      setLevels(u);
      setEditingIdx(null);
    } else {
      setLevels([...levels, levelForm]);
    }
    setLevelForm(initLevel);
  };

  const editLevel = (oi) => {
    setLevelForm(levels[oi]);
    setEditingIdx(oi);
    setActiveTab("level");
  };
  const removeLevel = (oi) => {
    setLevels(levels.filter((_, i) => i !== oi));
    if (editingIdx === oi) {
      setEditingIdx(null);
      setLevelForm(initLevel);
    }
  };

  const initials = structure.structureName
    ? structure.structureName[0].toUpperCase()
    : "S";

  return (
    <div className={styles.page}>
      {/* ── Breadcrumb ── */}
      {/* <div className={styles.breadcrumb}>
        <span className={styles.breadItem}>Projects</span>
        <span className={styles.breadSep}>›</span>
        <span className={styles.breadItem}>Structures</span>
        <span className={styles.breadSep}>›</span>
        <span className={styles.breadCurrent}>New Structure</span>
      </div> */}

      {/* ── Hero Card ── */}
      <div className={styles.heroCard}>
        <div className={styles.heroTopBar} />
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <h1 className={styles.heroTitle}>
                {structure.structureName || "New Structure"}
              </h1>
              <div className={styles.heroMeta}>
                {[
                  structure.structureType?.replace("_", " "),
                  structure.usageType,
                  structure.builtUpArea ? `${structure.builtUpArea} sq.ft` : "",
                ]
                  .filter(Boolean)
                  .join("  ·  ")}
              </div>
              <div className={styles.heroBadges}>
                <span className={styles.badge}>
                  ⊞ {levels.length} Level{levels.length !== 1 ? "s" : ""}
                </span>
                {structure.totalFloors && (
                  <span className={styles.badgeOutline}>
                    ↑ {structure.totalFloors} Floors
                  </span>
                )}
                {structure.totalBasements && (
                  <span className={styles.badgeOutline}>
                    ↓ {structure.totalBasements} Basements
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.btnBack}>← Back</button>
            <button
              className={styles.btnPrimary}
              onClick={() => {
                const loadingToast = showLoading("Creating structure...");

                createStructureApi(
                  {
                    projectId,
                    structure: {
                      ...structure,
                      usageType: structure.usageType || null,
                      levels: levels.map((lv) => ({
                        ...lv,
                        usageType: lv.usageType || null,
                      })),
                    },
                  },
                  {
                    onSuccess: () => {
                      dismissToast(loadingToast);
                      showSuccess("Structure created successfully");

                      navigate(`/projects/view/${projectId}`);
                    },

                    onError: (error) => {
                      dismissToast(loadingToast);
                      showError(
                        error?.response?.data?.message ||
                          "Failed to create structure",
                      );
                    },
                  },
                );
              }}
            >
              {isPending ? "Saving..." : "⊙ Save Structure"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className={styles.tabBar}>
        {[
          { key: "structure", icon: "⬡", label: "Structure Info" },
          { key: "level", icon: "⊞", label: "Add Level", count: levels.length },
        ].map((t) => (
          <button
            key={t.key}
            className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span>{t.icon}</span> {t.label}
            {t.count > 0 && <span className={styles.tabCount}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Body Grid ── */}
      <div className={styles.grid}>
        {/* ── LEFT ── */}
        <div className={styles.left}>
          {activeTab === "structure" && (
            <>
              {/* Basic Details */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>⬡</span>
                  <h3 className={styles.cardTitle}>Basic Details</h3>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.fieldGrid}>
                    <Field label="Structure Name">
                      <input
                        className={styles.input}
                        name="structureName"
                        value={structure.structureName}
                        onChange={onStructure}
                        placeholder="e.g. Wing A, Tower 1"
                      />
                    </Field>
                    <Field label="Structure Type">
                      <select
                        className={styles.select}
                        name="structureType"
                        value={structure.structureType}
                        onChange={onStructure}
                      >
                        <option value="">Select type</option>
                        {STRUCTURE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Usage Type">
                      <select
                        className={styles.select}
                        name="usageType"
                        value={structure.usageType}
                        onChange={onStructure}
                      >
                        <option value="">Select usage</option>
                        {USAGE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Built-up Area (sq.ft)">
                      <input
                        className={styles.input}
                        type="number"
                        name="builtUpArea"
                        value={structure.builtUpArea}
                        onChange={onStructure}
                        placeholder="0.00"
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Floor Config */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>⊟</span>
                  <h3 className={styles.cardTitle}>Floor Configuration</h3>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.fieldGrid}>
                    <Field label="Total Floors">
                      <input
                        className={styles.input}
                        type="number"
                        name="totalFloors"
                        value={structure.totalFloors}
                        onChange={onStructure}
                        placeholder="e.g. 15"
                      />
                    </Field>
                    <Field label="Total Basements">
                      <input
                        className={styles.input}
                        type="number"
                        name="totalBasements"
                        value={structure.totalBasements}
                        onChange={onStructure}
                        placeholder="e.g. 2"
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <button
                className={styles.btnPrimary}
                style={{ alignSelf: "flex-start" }}
                onClick={() => setActiveTab("level")}
              >
                Continue → Add Levels
              </button>
            </>
          )}

          {activeTab === "level" && (
            <>
              {/* Level Form */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>⊞</span>
                  <h3 className={styles.cardTitle}>
                    {editingIdx !== null ? "Edit Level" : "Add New Level"}
                  </h3>
                  {editingIdx !== null && (
                    <button
                      className={styles.cancelBtn}
                      onClick={() => {
                        setEditingIdx(null);
                        setLevelForm(initLevel);
                      }}
                    >
                      ✕ Cancel
                    </button>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.fieldGrid}>
                    <Field label="Level Label">
                      <input
                        className={styles.input}
                        name="levelLabel"
                        value={levelForm.levelLabel}
                        onChange={onLevel}
                        placeholder="e.g. B1, Ground, 5th Floor"
                      />
                    </Field>
                    <Field label="Level Number">
                      <input
                        className={styles.input}
                        type="number"
                        name="levelNumber"
                        value={levelForm.levelNumber}
                        onChange={onLevel}
                        placeholder="-1, 0, 1, 2 …"
                      />
                    </Field>
                    <Field label="Level Type">
                      <select
                        className={styles.select}
                        name="levelType"
                        value={levelForm.levelType}
                        onChange={onLevel}
                      >
                        <option value="">Select type</option>
                        {LEVEL_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Usage Type">
                      <select
                        className={styles.select}
                        name="usageType"
                        value={levelForm.usageType}
                        onChange={onLevel}
                      >
                        <option value="">Select usage</option>
                        {USAGE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Built-up Area (sq.ft)">
                      <input
                        className={styles.input}
                        type="number"
                        name="builtUpArea"
                        value={levelForm.builtUpArea}
                        onChange={onLevel}
                        placeholder="0.00"
                      />
                    </Field>
                    <Field label="Carpet Area (sq.ft)">
                      <input
                        className={styles.input}
                        type="number"
                        name="carpetArea"
                        value={levelForm.carpetArea}
                        onChange={onLevel}
                        placeholder="0.00"
                      />
                    </Field>
                    <Field label="Floor Height (m)">
                      <input
                        className={styles.input}
                        type="number"
                        name="floorHeight"
                        value={levelForm.floorHeight}
                        onChange={onLevel}
                        placeholder="3.00"
                      />
                    </Field>
                    <Field label="Construction Status">
                      <input
                        className={styles.input}
                        name="constructionStatus"
                        value={levelForm.constructionStatus}
                        onChange={onLevel}
                        placeholder="e.g. In Progress"
                      />
                    </Field>
                    <Field
                      label={`Progress — ${levelForm.progressPercentage || 0}%`}
                      full
                    >
                      <input
                        className={styles.range}
                        type="range"
                        min="0"
                        max="100"
                        name="progressPercentage"
                        value={levelForm.progressPercentage || 0}
                        onChange={onLevel}
                      />
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${levelForm.progressPercentage || 0}%`,
                          }}
                        />
                      </div>
                    </Field>
                  </div>
                </div>
              </div>

              <button
                className={styles.btnPrimary}
                style={{ alignSelf: "flex-start" }}
                onClick={addOrUpdate}
              >
                {editingIdx !== null
                  ? "⊙ Update Level"
                  : "+ Add Level to Building"}
              </button>

              {/* Levels List */}
              {levels.length > 0 && (
                <div className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardIcon}>⊟</span>
                    <h3 className={styles.cardTitle}>Added Levels</h3>
                    <span className={styles.pill}>{levels.length}</span>
                  </div>
                  <div className={styles.levelRows}>
                    {sorted.map((lv, i) => {
                      const meta =
                        LEVEL_META[lv.levelType] || LEVEL_META.TYPICAL_FLOOR;
                      const origIdx = levels.indexOf(lv);
                      return (
                        <div key={i} className={styles.levelRow}>
                          <div
                            className={styles.levelDot}
                            style={{ background: meta.color }}
                          />
                          <div className={styles.levelInfo}>
                            <span className={styles.levelName}>
                              {lv.levelLabel}
                            </span>
                            <span
                              className={styles.levelTypeBadge}
                              style={{ color: meta.color, background: meta.bg }}
                            >
                              {lv.levelType?.replace(/_/g, " ")}
                            </span>
                            <span className={styles.levelMeta}>
                              {[
                                lv.floorHeight && `${lv.floorHeight}m`,
                                lv.builtUpArea && `${lv.builtUpArea} sq.ft`,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </div>
                          {lv.progressPercentage > 0 && (
                            <div className={styles.miniTrack}>
                              <div
                                className={styles.miniFill}
                                style={{
                                  width: `${lv.progressPercentage}%`,
                                  background: meta.color,
                                }}
                              />
                            </div>
                          )}
                          <div className={styles.rowActions}>
                            <button
                              className={styles.iconBtn}
                              onClick={() => editLevel(origIdx)}
                            >
                              ✏
                            </button>
                            <button
                              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                              onClick={() => removeLevel(origIdx)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── RIGHT — Building Viz ── */}
        <div className={styles.right}>
          <div
            className={styles.card}
            style={{ height: "100%", minHeight: 520 }}
          >
            <div className={styles.cardHead}>
              <span className={styles.cardIcon}>🏗</span>
              <h3 className={styles.cardTitle}>Building Cross-Section</h3>
              {levels.length > 0 && (
                <span className={styles.pill}>
                  {levels.length} Level{levels.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {levels.length === 0 ? (
              <div className={styles.emptyViz}>
                <div className={styles.emptyIcon}>🏢</div>
                <p className={styles.emptyTitle}>No levels added yet</p>
                <p className={styles.emptyHint}>
                  Add levels from the left panel to see your building take shape
                  here
                </p>
              </div>
            ) : (
              <div className={styles.vizWrap}>
                <div className={styles.vizInner}>
                  {/* Sky */}
                  <div className={styles.sky} />

                  <div className={styles.buildingWrap}>
                    {[...sorted].reverse().map((lv, idx) => {
                      const meta =
                        LEVEL_META[lv.levelType] || LEVEL_META.TYPICAL_FLOOR;
                      const isBase = lv.levelType === "BASEMENT";
                      const isTerrace = lv.levelType === "TERRACE";
                      const sortedIdx = sorted.length - 1 - idx;
                      const isHov = hoveredIdx === sortedIdx;

                      return (
                        <div
                          key={idx}
                          className={`${styles.floor} ${isBase ? styles.floorBase : ""} ${isTerrace ? styles.floorTerrace : ""} ${isHov ? styles.floorHov : ""}`}
                          onMouseEnter={() => setHoveredIdx(sortedIdx)}
                          onMouseLeave={() => setHoveredIdx(null)}
                        >
                          {/* Front face */}
                          <div
                            className={styles.face}
                            style={{
                              background: isHov
                                ? `linear-gradient(135deg,${meta.bg},rgba(255,255,255,0.6))`
                                : "#fff",
                              borderTopColor: meta.color,
                              borderColor: isHov ? meta.color : "#e5e7eb",
                            }}
                          >
                            <div
                              className={styles.topSlab}
                              style={{ background: meta.color }}
                            />

                            {/* Pillars */}
                            <div className={styles.pillars}>
                              {[0, 1, 2, 3].map((p) => (
                                <div
                                  key={p}
                                  className={styles.pillar}
                                  style={{
                                    opacity: isHov ? 0.7 : 0.25,
                                    background: meta.color,
                                  }}
                                />
                              ))}
                            </div>

                            {/* Windows */}
                            {!isBase && !isTerrace && (
                              <div className={styles.windows}>
                                {[0, 1, 2].map((w) => (
                                  <div
                                    key={w}
                                    className={styles.win}
                                    style={{
                                      borderColor: isHov
                                        ? meta.color
                                        : "#bfdbfe",
                                      background: isHov
                                        ? meta.bg
                                        : "rgba(219,234,254,0.4)",
                                    }}
                                  />
                                ))}
                              </div>
                            )}

                            {isBase && (
                              <div
                                className={styles.hatch}
                                style={{
                                  backgroundImage: `repeating-linear-gradient(45deg,${meta.color}18 0,${meta.color}18 1px,transparent 0,transparent 50%)`,
                                  backgroundSize: "8px 8px",
                                }}
                              />
                            )}

                            {isTerrace && (
                              <div
                                className={styles.parapet}
                                style={{ borderColor: meta.color }}
                              />
                            )}

                            {/* Progress bar at bottom */}
                            {lv.progressPercentage > 0 && (
                              <div className={styles.floorProg}>
                                <div
                                  className={styles.floorProgFill}
                                  style={{
                                    width: `${lv.progressPercentage}%`,
                                    background: meta.color,
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Right side 3D */}
                          <div
                            className={styles.side}
                            style={{
                              background: `linear-gradient(180deg,${meta.color}30,${meta.color}10)`,
                              borderColor: isHov ? meta.color : "#e5e7eb",
                            }}
                          />

                          {/* Top face (topmost only) */}
                          {idx === 0 && (
                            <div
                              className={styles.topFace}
                              style={{
                                borderColor: isHov ? meta.color : "#e5e7eb",
                              }}
                            />
                          )}

                          {/* Right label */}
                          <div className={styles.floorLbl}>
                            <div
                              className={styles.lblLine}
                              style={{
                                background: isHov ? meta.color : "#d1d5db",
                              }}
                            />
                            <div>
                              <div
                                className={styles.lblName}
                                style={{
                                  color: isHov ? meta.color : "#374151",
                                }}
                              >
                                {lv.levelLabel}
                              </div>
                              {lv.floorHeight && (
                                <div className={styles.lblSub}>
                                  {lv.floorHeight}m
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Left dimension */}
                          {lv.floorHeight && (
                            <div className={styles.dim}>
                              <div
                                className={styles.dimTick}
                                style={{ background: "#9ca3af" }}
                              />
                              <span className={styles.dimVal}>
                                {lv.floorHeight}m
                              </span>
                              <div
                                className={styles.dimTick}
                                style={{ background: "#9ca3af" }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Foundation */}
                    <div className={styles.foundation}>
                      <span className={styles.foundationTxt}>
                        ▬ Foundation Slab
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className={styles.legend}>
                  {[...new Set(levels.map((l) => l.levelType))].map((type) => {
                    const m = LEVEL_META[type] || LEVEL_META.TYPICAL_FLOOR;
                    return (
                      <span
                        key={type}
                        className={styles.chip}
                        style={{
                          background: m.bg,
                          color: m.color,
                          borderColor: `${m.color}33`,
                        }}
                      >
                        <span
                          className={styles.chipDot}
                          style={{ background: m.color }}
                        />
                        {type.replace(/_/g, " ")}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component
function Field({ label, children, full }) {
  return (
    <div
      style={{
        gridColumn: full ? "1/-1" : undefined,
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
      }}
    >
      <label
        style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "#6b7280",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
