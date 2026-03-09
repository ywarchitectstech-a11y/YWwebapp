import { useState } from "react";
import styles from "./StructureViewerPopup.module.scss";

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

export default function StructureViewerPopup({ structure, onClose }) {
  const [hovered, setHovered] = useState(null);

  if (!structure) return null;

  const sorted = [...structure.levels].sort(
    (a, b) =>
      LEVEL_ORDER.indexOf(a.levelType) - LEVEL_ORDER.indexOf(b.levelType),
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2>{structure.structureName}</h2>
            <p>
              {structure.structureType} • {structure.usageType} •{" "}
              {structure.builtUpArea} sq.ft
            </p>
          </div>

          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          {/* LEFT SIDE */}
          <div className={styles.details}>
            <div className={styles.card}>
              <h3>Structure Details</h3>

              <div className={styles.infoGrid}>
                <div>
                  <span>Total Floors</span>
                  <strong>{structure.totalFloors}</strong>
                </div>

                <div>
                  <span>Basements</span>
                  <strong>{structure.totalBasements}</strong>
                </div>

                <div>
                  <span>Usage</span>
                  <strong>{structure.usageType}</strong>
                </div>

                <div>
                  <span>Built-up Area</span>
                  <strong>{structure.builtUpArea} sq.ft</strong>
                </div>
              </div>
            </div>

            {/* LEVEL LIST */}
            <div className={styles.card}>
              <h3>Levels</h3>

              <div className={styles.levelList}>
                {sorted.map((lv, i) => {
                  const meta =
                    LEVEL_META[lv.levelType] || LEVEL_META.TYPICAL_FLOOR;

                  return (
                    <div
                      key={lv.id}
                      className={styles.levelRow}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <span
                        className={styles.levelDot}
                        style={{ background: meta.color }}
                      />

                      <div className={styles.levelInfo}>
                        <strong>{lv.levelLabel}</strong>
                        <span>{lv.levelType.replace(/_/g, " ")}</span>
                      </div>

                      <div className={styles.levelMeta}>
                        {lv.usageType || "-"}
                      </div>

                      <div className={styles.levelProgress}>
                        {lv.progressPercentage ?? 0}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE VISUAL */}
          <div className={styles.visual}>
            <div className={styles.building}>
              {[...sorted].reverse().map((lv, idx) => {
                const meta =
                  LEVEL_META[lv.levelType] || LEVEL_META.TYPICAL_FLOOR;

                return (
                  <div
                    key={lv.id}
                    className={styles.floor}
                    style={{ borderTopColor: meta.color }}
                  >
                    <span>{lv.levelLabel}</span>
                  </div>
                );
              })}

              <div className={styles.foundation}>Foundation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
