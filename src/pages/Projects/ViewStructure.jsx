import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectById } from "../../api/hooks/useProject";
import styles from "./ViewStructure.module.scss";

// ── Constants (same as Structure.jsx) ──────────────────────────────────────────
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
  BASEMENT: { color: "#6366f1", bg: "rgba(99,102,241,0.08)", icon: "🅱" },
  STILT: { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", icon: "⊟" },
  GROUND_FLOOR: { color: "#10b981", bg: "rgba(16,185,129,0.08)", icon: "G" },
  PODIUM: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", icon: "P" },
  TYPICAL_FLOOR: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)", icon: "⊞" },
  REFUGE_FLOOR: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", icon: "R" },
  SERVICE_FLOOR: { color: "#ec4899", bg: "rgba(236,72,153,0.08)", icon: "S" },
  AMENITY_FLOOR: { color: "#14b8a6", bg: "rgba(20,184,166,0.08)", icon: "A" },
  TERRACE: { color: "#7c5e0b", bg: "rgba(124,94,11,0.08)", icon: "T" },
};

const USAGE_COLORS = {
  RESIDENTIAL: { bg: "#dbeafe", color: "#1e40af" },
  COMMERCIAL: { bg: "#fef3c7", color: "#92400e" },
  PARKING: { bg: "#f3f4f6", color: "#374151" },
  SERVICES: { bg: "#fce7f3", color: "#9d174d" },
  MIXED: { bg: "#ede9fe", color: "#4c1d95" },
};

const STRUCT_ICONS = {
  TOWER: "🗼",
  WING: "🏢",
  BUILDING: "🏗",
  ROW_HOUSE: "🏘",
  BUNGALOW: "🏡",
  PODIUM_BLOCK: "⬛",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (dt) => {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ── Building Visualization (reused from Structure.jsx logic) ───────────────────
function BuildingViz({ levels, hoveredIdx, setHoveredIdx }) {
  const sorted = [...levels].sort(
    (a, b) =>
      LEVEL_ORDER.indexOf(a.levelType) - LEVEL_ORDER.indexOf(b.levelType),
  );

  if (!levels.length) {
    return (
      <div className={styles.emptyViz}>
        <div className={styles.emptyIcon}>🏢</div>
        <p className={styles.emptyTitle}>No levels defined</p>
        <p className={styles.emptyHint}>This structure has no level data yet</p>
      </div>
    );
  }

  return (
    <div className={styles.vizWrap}>
      <div className={styles.vizInner}>
        <div className={styles.sky} />
        <div className={styles.buildingWrap}>
          {[...sorted].reverse().map((lv, idx) => {
            const meta = LEVEL_META[lv.levelType] || LEVEL_META.TYPICAL_FLOOR;
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
                  {!isBase && !isTerrace && (
                    <div className={styles.windows}>
                      {[0, 1, 2].map((w) => (
                        <div
                          key={w}
                          className={styles.win}
                          style={{
                            borderColor: isHov ? meta.color : "#bfdbfe",
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

                <div
                  className={styles.side}
                  style={{
                    background: `linear-gradient(180deg,${meta.color}30,${meta.color}10)`,
                    borderColor: isHov ? meta.color : "#e5e7eb",
                  }}
                />

                {idx === 0 && (
                  <div
                    className={styles.topFace}
                    style={{ borderColor: isHov ? meta.color : "#e5e7eb" }}
                  />
                )}

                <div className={styles.floorLbl}>
                  <div
                    className={styles.lblLine}
                    style={{ background: isHov ? meta.color : "#d1d5db" }}
                  />
                  <div>
                    <div
                      className={styles.lblName}
                      style={{ color: isHov ? meta.color : "#374151" }}
                    >
                      {lv.levelLabel}
                    </div>
                    {lv.floorHeight && (
                      <div className={styles.lblSub}>{lv.floorHeight}m</div>
                    )}
                  </div>
                </div>

                {lv.floorHeight && (
                  <div className={styles.dim}>
                    <div
                      className={styles.dimTick}
                      style={{ background: "#9ca3af" }}
                    />
                    <span className={styles.dimVal}>{lv.floorHeight}m</span>
                    <div
                      className={styles.dimTick}
                      style={{ background: "#9ca3af" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
          <div className={styles.foundation}>
            <span className={styles.foundationTxt}>▬ Foundation Slab</span>
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
  );
}

// ── Level Detail Row ───────────────────────────────────────────────────────────
function LevelRow({ lv, isActive, onClick }) {
  const meta = LEVEL_META[lv.levelType] || LEVEL_META.TYPICAL_FLOOR;
  const usageCfg = USAGE_COLORS[lv.usageType] || null;

  return (
    <div
      className={`${styles.levelRow} ${isActive ? styles.levelRowActive : ""}`}
      onClick={onClick}
      style={{ borderLeftColor: isActive ? meta.color : "transparent" }}
    >
      <div className={styles.levelDot} style={{ background: meta.color }} />
      <div className={styles.levelInfo}>
        <div className={styles.levelTop}>
          <span className={styles.levelName}>{lv.levelLabel}</span>
          <span
            className={styles.levelTypeBadge}
            style={{ color: meta.color, background: meta.bg }}
          >
            {lv.levelType?.replace(/_/g, " ")}
          </span>
          {usageCfg && (
            <span
              className={styles.usageBadge}
              style={{ color: usageCfg.color, background: usageCfg.bg }}
            >
              {lv.usageType}
            </span>
          )}
        </div>
        <div className={styles.levelStats}>
          {lv.builtUpArea && <span>⊞ {lv.builtUpArea} sq.ft</span>}
          {lv.carpetArea && <span>⊟ {lv.carpetArea} sq.ft carpet</span>}
          {lv.floorHeight && <span>↑ {lv.floorHeight}m</span>}
          {lv.constructionStatus && <span>⚙ {lv.constructionStatus}</span>}
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
            <span className={styles.miniPct}>{lv.progressPercentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Level Detail Panel ─────────────────────────────────────────────────────────
function LevelDetailPanel({ lv }) {
  if (!lv)
    return (
      <div className={styles.detailEmpty}>
        <span>⊞</span>
        <p>Select a level to view its details</p>
      </div>
    );

  const meta = LEVEL_META[lv.levelType] || LEVEL_META.TYPICAL_FLOOR;
  const usageCfg = USAGE_COLORS[lv.usageType] || null;

  return (
    <div className={styles.detailPanel}>
      <div className={styles.detailHeader} style={{ borderColor: meta.color }}>
        <div
          className={styles.detailIcon}
          style={{ background: meta.bg, color: meta.color }}
        >
          {meta.icon}
        </div>
        <div>
          <h4 className={styles.detailTitle}>{lv.levelLabel}</h4>
          <div className={styles.detailBadges}>
            <span
              className={styles.levelTypeBadge}
              style={{ color: meta.color, background: meta.bg }}
            >
              {lv.levelType?.replace(/_/g, " ")}
            </span>
            {usageCfg && (
              <span
                className={styles.usageBadge}
                style={{ color: usageCfg.color, background: usageCfg.bg }}
              >
                {lv.usageType}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailField}>
          <span className={styles.detailLabel}>Level Number</span>
          <span className={styles.detailValue}>{lv.levelNumber ?? "—"}</span>
        </div>
        <div className={styles.detailField}>
          <span className={styles.detailLabel}>Floor Height</span>
          <span className={styles.detailValue}>
            {lv.floorHeight ? `${lv.floorHeight} m` : "—"}
          </span>
        </div>
        <div className={styles.detailField}>
          <span className={styles.detailLabel}>Built-Up Area</span>
          <span className={styles.detailValue}>
            {lv.builtUpArea ? `${lv.builtUpArea} sq.ft` : "—"}
          </span>
        </div>
        <div className={styles.detailField}>
          <span className={styles.detailLabel}>Carpet Area</span>
          <span className={styles.detailValue}>
            {lv.carpetArea ? `${lv.carpetArea} sq.ft` : "—"}
          </span>
        </div>
        <div className={styles.detailField} style={{ gridColumn: "1/-1" }}>
          <span className={styles.detailLabel}>Construction Status</span>
          <span className={styles.detailValue}>
            {lv.constructionStatus || "—"}
          </span>
        </div>
      </div>

      {lv.progressPercentage != null && (
        <div className={styles.detailProgress}>
          <div className={styles.detailProgressHead}>
            <span className={styles.detailLabel}>Construction Progress</span>
            <span
              className={styles.detailProgressPct}
              style={{ color: meta.color }}
            >
              {lv.progressPercentage}%
            </span>
          </div>
          <div className={styles.detailProgressBar}>
            <div
              className={styles.detailProgressFill}
              style={{
                width: `${lv.progressPercentage}%`,
                background: `linear-gradient(90deg, ${meta.color}99, ${meta.color})`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ViewStructure() {
  const { projectId, structureId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProjectById(projectId);

  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const [activeTab, setActiveTab] = useState("levels");

  const p = data?.data;
  const structure = p?.structures?.find(
    (s) => String(s.id) === String(structureId),
  );

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>Loading structure...</p>
        </div>
      </div>
    );
  }

  if (isError || !p || !structure) {
    return (
      <div className={styles.page}>
        <div className={styles.errorWrap}>
          <span>⚠️</span>
          <h3>Structure not found</h3>
          <button
            className={styles.btnBack}
            onClick={() => navigate(`/projects/view/${projectId}`)}
          >
            ← Back to Project
          </button>
        </div>
      </div>
    );
  }

  const levels = structure.levels || [];
  const sorted = [...levels].sort(
    (a, b) =>
      LEVEL_ORDER.indexOf(a.levelType) - LEVEL_ORDER.indexOf(b.levelType),
  );

  const structIcon = STRUCT_ICONS[structure.structureType] || "🏢";
  const usageCfg = USAGE_COLORS[structure.usageType] || null;

  // Stats
  const avgProgress = levels.length
    ? Math.round(
        levels.reduce((s, l) => s + (Number(l.progressPercentage) || 0), 0) /
          levels.length,
      )
    : 0;

  const levelTypeCount = levels.reduce((acc, l) => {
    acc[l.levelType] = (acc[l.levelType] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <div className={styles.heroCard}>
        <div className={styles.heroTopBar} />
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <button
              className={styles.btnBack}
              onClick={() => navigate(`/projects/view/${projectId}`)}
            >
              ← Back
            </button>
            <div className={styles.avatar}>{structIcon}</div>
            <div>
              <h1 className={styles.heroTitle}>
                {structure.structureName || "Structure"}
              </h1>
              <div className={styles.heroMeta}>
                {[
                  p.projectName,
                  structure.structureType?.replace(/_/g, " "),
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
                {usageCfg && (
                  <span
                    className={styles.badgeOutline}
                    style={{
                      background: usageCfg.bg,
                      color: usageCfg.color,
                      border: "none",
                    }}
                  >
                    {structure.usageType}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatVal}>{levels.length}</span>
              <span className={styles.heroStatLabel}>Levels</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatVal}>
                {structure.totalFloors ?? "—"}
              </span>
              <span className={styles.heroStatLabel}>Floors</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatVal}>
                {structure.totalBasements ?? "—"}
              </span>
              <span className={styles.heroStatLabel}>Basements</span>
            </div>
            <div className={styles.heroStat}>
              <span
                className={styles.heroStatVal}
                style={{
                  color:
                    avgProgress >= 75
                      ? "#10b981"
                      : avgProgress >= 40
                        ? "#f59e0b"
                        : "#6366f1",
                }}
              >
                {avgProgress}%
              </span>
              <span className={styles.heroStatLabel}>Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className={styles.tabBar}>
        {[
          { key: "levels", icon: "⊞", label: "Levels", count: levels.length },
          { key: "info", icon: "⬡", label: "Structure Info" },
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

      {/* ── Body ── */}
      <div className={styles.body}>
        {activeTab === "info" && (
          <div className={styles.infoGrid}>
            {/* Basic Info Card */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardIcon}>⬡</span>
                <h3 className={styles.cardTitle}>Basic Details</h3>
              </div>
              <div className={styles.infoList}>
                <InfoRow
                  label="Structure Name"
                  value={structure.structureName}
                />
                <InfoRow
                  label="Structure Type"
                  value={structure.structureType?.replace(/_/g, " ")}
                />
                <InfoRow label="Usage Type" value={structure.usageType} />
                <InfoRow
                  label="Built-Up Area"
                  value={
                    structure.builtUpArea
                      ? `${structure.builtUpArea} sq.ft`
                      : null
                  }
                />
                <InfoRow label="Total Floors" value={structure.totalFloors} />
                <InfoRow
                  label="Total Basements"
                  value={structure.totalBasements}
                />
              </div>
            </div>

            {/* Level Type Breakdown */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardIcon}>📊</span>
                <h3 className={styles.cardTitle}>Level Breakdown</h3>
              </div>
              <div className={styles.breakdownList}>
                {Object.entries(levelTypeCount).map(([type, count]) => {
                  const meta = LEVEL_META[type] || LEVEL_META.TYPICAL_FLOOR;
                  const pct = Math.round((count / levels.length) * 100);
                  return (
                    <div key={type} className={styles.breakdownRow}>
                      <div className={styles.breakdownLeft}>
                        <span
                          className={styles.breakdownDot}
                          style={{ background: meta.color }}
                        />
                        <span className={styles.breakdownType}>
                          {type.replace(/_/g, " ")}
                        </span>
                        <span className={styles.breakdownCount}>{count}</span>
                      </div>
                      <div className={styles.breakdownBar}>
                        <div
                          className={styles.breakdownFill}
                          style={{ width: `${pct}%`, background: meta.color }}
                        />
                      </div>
                    </div>
                  );
                })}
                {!levels.length && (
                  <p className={styles.noData}>No levels added yet</p>
                )}
              </div>
            </div>

            {/* Area Summary */}
            {levels.length > 0 && (
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>📐</span>
                  <h3 className={styles.cardTitle}>Area Summary</h3>
                </div>
                <div className={styles.infoList}>
                  <InfoRow
                    label="Total Built-Up (all levels)"
                    value={`${levels.reduce((s, l) => s + (Number(l.builtUpArea) || 0), 0).toLocaleString()} sq.ft`}
                  />
                  <InfoRow
                    label="Total Carpet (all levels)"
                    value={`${levels.reduce((s, l) => s + (Number(l.carpetArea) || 0), 0).toLocaleString()} sq.ft`}
                  />
                  <InfoRow
                    label="Avg. Floor Height"
                    value={
                      levels.filter((l) => l.floorHeight).length
                        ? `${(levels.filter((l) => l.floorHeight).reduce((s, l) => s + Number(l.floorHeight), 0) / levels.filter((l) => l.floorHeight).length).toFixed(2)} m`
                        : null
                    }
                  />
                  <InfoRow label="Overall Progress" value={`${avgProgress}%`} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "levels" && (
          <div className={styles.levelsLayout}>
            {/* Left — levels list */}
            <div className={styles.levelsLeft}>
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>⊞</span>
                  <h3 className={styles.cardTitle}>All Levels</h3>
                  <span className={styles.pill}>{levels.length}</span>
                </div>
                {sorted.length === 0 ? (
                  <div className={styles.emptyLevels}>
                    <span>⊞</span>
                    <p>No levels defined for this structure</p>
                  </div>
                ) : (
                  <div className={styles.levelRows}>
                    {sorted.map((lv, i) => (
                      <LevelRow
                        key={i}
                        lv={lv}
                        isActive={activeLevel === i}
                        onClick={() =>
                          setActiveLevel(activeLevel === i ? null : i)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Selected level detail (mobile / small) */}
              <div className={styles.detailMobile}>
                {activeLevel !== null && (
                  <LevelDetailPanel lv={sorted[activeLevel]} />
                )}
              </div>
            </div>

            {/* Center — level detail (desktop) */}
            <div className={styles.levelsCenter}>
              <div className={styles.card} style={{ minHeight: 300 }}>
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>📋</span>
                  <h3 className={styles.cardTitle}>Level Details</h3>
                </div>
                <LevelDetailPanel
                  lv={activeLevel !== null ? sorted[activeLevel] : null}
                />
              </div>
            </div>

            {/* Right — building viz */}
            <div className={styles.levelsRight}>
              <div className={styles.card} style={{ minHeight: 520 }}>
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>🏗</span>
                  <h3 className={styles.cardTitle}>Building Cross-Section</h3>
                  {levels.length > 0 && (
                    <span className={styles.pill}>
                      {levels.length} Level{levels.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <BuildingViz
                  levels={sorted}
                  hoveredIdx={hoveredIdx}
                  setHoveredIdx={setHoveredIdx}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helper ─────────────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value ?? "—"}</span>
    </div>
  );
}
