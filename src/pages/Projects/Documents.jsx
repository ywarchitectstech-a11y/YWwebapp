import { useState, useEffect, useCallback } from "react";
import styles from "./Documents.module.scss";

// ─── Dummy Data ────────────────────────────────────────────────────────────────
const FOLDERS = [
  {
    id: 1,
    name: "Site Survey",
    count: 8,
    updated: "20 Feb 2026",
    color: "#7c5e0b",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
        caption: "Site Overview — East Wing",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
        caption: "Foundation Marking",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
        caption: "Perimeter Survey",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
        caption: "Aerial View — Full Plot",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
        caption: "Ground Level — North",
      },
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80",
        caption: "Soil Test Zone A",
      },
      {
        id: 7,
        url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
        caption: "Utility Mapping",
      },
      {
        id: 8,
        url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
        caption: "Boundary Stones",
      },
    ],
  },
  {
    id: 2,
    name: "Architectural Drawings",
    count: 6,
    updated: "18 Feb 2026",
    color: "#3b82f6",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        caption: "Floor Plan — Level 1",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1594818898109-44704851b68c?w=800&q=80",
        caption: "Elevation — South Facade",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1612965607446-25e1332775ae?w=800&q=80",
        caption: "Section AA",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        caption: "Roof Plan",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1574359411659-15573a027fd4?w=800&q=80",
        caption: "Detail — Staircase Core",
      },
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?w=800&q=80",
        caption: "Facade Detail",
      },
    ],
  },
  {
    id: 3,
    name: "Structural Drawings",
    count: 5,
    updated: "15 Feb 2026",
    color: "#10b981",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
        caption: "Column Layout Plan",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=800&q=80",
        caption: "Beam Schedule",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80",
        caption: "Foundation Detail",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
        caption: "Reinforcement Detail",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
        caption: "Slab Plan — B1",
      },
    ],
  },
  {
    id: 4,
    name: "3D Renders",
    count: 7,
    updated: "22 Feb 2026",
    color: "#8b5cf6",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        caption: "Exterior — Day Render",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        caption: "Living Room Interior",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        caption: "Bedroom Suite",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
        caption: "Kitchen — Open Plan",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        caption: "Exterior — Night Render",
      },
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        caption: "Aerial Perspective",
      },
      {
        id: 7,
        url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
        caption: "Lobby Entrance",
      },
    ],
  },
  {
    id: 5,
    name: "Construction Progress",
    count: 9,
    updated: "23 Feb 2026",
    color: "#ef4444",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=800&q=80",
        caption: "Week 1 — Ground Breaking",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
        caption: "Foundation Poured",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
        caption: "Column Casting — Floor 1",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1562114808-b4b33cf4e28a?w=800&q=80",
        caption: "Slab Shuttering",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
        caption: "Week 8 Overview",
      },
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
        caption: "Brick Masonry — West",
      },
      {
        id: 7,
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
        caption: "MEP Rough-In",
      },
      {
        id: 8,
        url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80",
        caption: "Plastering — Floor 3",
      },
      {
        id: 9,
        url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
        caption: "Terrace Waterproofing",
      },
    ],
  },
  {
    id: 6,
    name: "Interior Design",
    count: 6,
    updated: "19 Feb 2026",
    color: "#f59e0b",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
        caption: "Living Area Concept",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        caption: "Master Bedroom",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
        caption: "Modular Kitchen",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
        caption: "Bathroom Finishes",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&q=80",
        caption: "Children's Room",
      },
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
        caption: "Study Nook",
      },
    ],
  },
  {
    id: 7,
    name: "Approvals & NOC",
    count: 4,
    updated: "10 Feb 2026",
    color: "#14b8a6",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
        caption: "Municipal Approval — Page 1",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1568219557405-376e23e4f7cf?w=800&q=80",
        caption: "Fire NOC Certificate",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
        caption: "Environment Clearance",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
        caption: "Commencement Certificate",
      },
    ],
  },
  {
    id: 8,
    name: "Electrical Layout",
    count: 5,
    updated: "17 Feb 2026",
    color: "#ec4899",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
        caption: "DB Layout — Floor 1",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        caption: "Light Points Plan",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
        caption: "Power Layout",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        caption: "Panel Schedule",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80",
        caption: "Earthing Detail",
      },
    ],
  },
  {
    id: 9,
    name: "Plumbing & MEP",
    count: 5,
    updated: "16 Feb 2026",
    color: "#6366f1",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
        caption: "Water Supply Layout",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1562114808-b4b33cf4e28a?w=800&q=80",
        caption: "Drainage Isometric",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80",
        caption: "STP Detail",
      },
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
        caption: "HVAC — Floor 2",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
        caption: "Fire Sprinkler Plan",
      },
    ],
  },
];

// ─── Folder Icon SVG ───────────────────────────────────────────────────────────
function FolderIcon({ color }) {
  return (
    <svg
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.folderSvg}
    >
      <rect
        x="0"
        y="14"
        width="80"
        height="50"
        rx="6"
        fill={color}
        opacity="0.15"
      />
      <rect
        x="0"
        y="14"
        width="80"
        height="50"
        rx="6"
        fill="url(#folderGrad)"
        opacity="0.6"
      />
      <path
        d="M0 20C0 16.686 2.686 14 6 14H32L38 20H74C77.314 20 80 22.686 80 26V58C80 61.314 77.314 64 74 64H6C2.686 64 0 61.314 0 58V20Z"
        fill={color}
        opacity="0.2"
      />
      <path
        d="M0 20C0 16.686 2.686 14 6 14H32L38 20H74C77.314 20 80 22.686 80 26V58C80 61.314 77.314 64 74 64H6C2.686 64 0 61.314 0 58V20Z"
        fill={color}
        opacity="0.7"
      />
      <path
        d="M0 8C0 4.686 2.686 2 6 2H28C30 2 31.5 3 32.5 4.5L36 10H6C2.686 10 0 12.686 0 16V8Z"
        fill={color}
      />
      <rect x="0" y="10" width="36" height="4" fill={color} opacity="0.8" />
      {/* Shine */}
      <path
        d="M6 24H74C77.314 24 80 26.686 80 30V34C80 30.686 77.314 28 74 28H6C2.686 28 0 30.686 0 34V30C0 26.686 2.686 24 6 24Z"
        fill="white"
        opacity="0.1"
      />
      <defs>
        <linearGradient
          id="folderGrad"
          x1="0"
          y1="14"
          x2="80"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.2" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Documents() {
  const [activeFolder, setActiveFolder] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [search, setSearch] = useState("");
  const [imgLoaded, setImgLoaded] = useState({});

  const filtered = FOLDERS.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openFolder = (folder) => {
    setActiveFolder(folder);
    setLightboxIdx(null);
  };
  const closeFolder = () => {
    setActiveFolder(null);
    setLightboxIdx(null);
  };
  const openLightbox = (idx) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  const prevImg = useCallback(() => {
    if (lightboxIdx === null || !activeFolder) return;
    setLightboxIdx(
      (lightboxIdx - 1 + activeFolder.images.length) %
        activeFolder.images.length,
    );
  }, [lightboxIdx, activeFolder]);

  const nextImg = useCallback(() => {
    if (lightboxIdx === null || !activeFolder) return;
    setLightboxIdx((lightboxIdx + 1) % activeFolder.images.length);
  }, [lightboxIdx, activeFolder]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (lightboxIdx !== null) {
        if (e.key === "ArrowLeft") prevImg();
        if (e.key === "ArrowRight") nextImg();
        if (e.key === "Escape") closeLightbox();
      } else if (activeFolder) {
        if (e.key === "Escape") closeFolder();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, activeFolder, prevImg, nextImg]);

  const currentImg =
    lightboxIdx !== null && activeFolder
      ? activeFolder.images[lightboxIdx]
      : null;

  return (
    <div className={styles.page}>
      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <span className={styles.breadItem}>Projects</span>
        <span className={styles.breadSep}>›</span>
        <span className={styles.breadCurrent}>Documents</span>
      </div>

      {/* ── Hero Card ── */}
      <div className={styles.heroCard}>
        <div className={styles.heroTopBar} />
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <div className={styles.heroIconWrap}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 7C3 5.343 4.343 4 6 4H10L12 6H18C19.657 6 21 7.343 21 9V17C21 18.657 19.657 20 18 20H6C4.343 20 3 18.657 3 17V7Z"
                  fill="currentColor"
                  opacity="0.9"
                />
              </svg>
            </div>
            <div>
              <h1 className={styles.heroTitle}>Documents</h1>
              <p className={styles.heroSub}>
                {FOLDERS.length} folders ·{" "}
                {FOLDERS.reduce((s, f) => s + f.count, 0)} files total
              </p>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.searchWrap}>
              <svg
                className={styles.searchIcon}
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className={styles.searchInput}
                placeholder="Search folders…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className={styles.uploadBtn}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className={styles.statsRow}>
        {[
          { label: "Total Folders", value: FOLDERS.length, icon: "📁" },
          {
            label: "Total Files",
            value: FOLDERS.reduce((s, f) => s + f.count, 0),
            icon: "🖼",
          },
          { label: "Last Updated", value: "Today", icon: "🕐" },
          { label: "Storage Used", value: "2.4 GB", icon: "💾" },
        ].map((s, i) => (
          <div key={i} className={styles.statCard}>
            <span className={styles.statIcon}>{s.icon}</span>
            <div>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Folder Grid ── */}
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>All Folders</h2>
        <span className={styles.sectionCount}>
          {filtered.length} folder{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📂</div>
          <p>No folders match "{search}"</p>
        </div>
      ) : (
        <div className={styles.folderGrid}>
          {filtered.map((folder, i) => (
            <button
              key={folder.id}
              className={styles.folderCard}
              onClick={() => openFolder(folder)}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className={styles.folderIconArea}>
                <FolderIcon color={folder.color} />
                <span
                  className={styles.folderBadge}
                  style={{ background: folder.color }}
                >
                  {folder.count}
                </span>
              </div>
              <div className={styles.folderInfo}>
                <span className={styles.folderName}>{folder.name}</span>
                <span className={styles.folderMeta}>
                  {folder.count} files · {folder.updated}
                </span>
              </div>
              <div className={styles.folderArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Folder Gallery Modal ── */}
      {activeFolder && lightboxIdx === null && (
        <div className={styles.overlay} onClick={closeFolder}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHead}>
              <div className={styles.modalHeadLeft}>
                <div
                  className={styles.modalFolderIcon}
                  style={{
                    background: activeFolder.color + "22",
                    color: activeFolder.color,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 7C3 5.343 4.343 4 6 4H10L12 6H18C19.657 6 21 7.343 21 9V17C21 18.657 19.657 20 18 20H6C4.343 20 3 18.657 3 17V7Z" />
                  </svg>
                </div>
                <div>
                  <h2 className={styles.modalTitle}>{activeFolder.name}</h2>
                  <p className={styles.modalSub}>
                    {activeFolder.count} files · Updated {activeFolder.updated}
                  </p>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={closeFolder}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Color accent line */}
            <div
              className={styles.modalAccent}
              style={{
                background: `linear-gradient(90deg, ${activeFolder.color}, transparent)`,
              }}
            />

            {/* Image Grid */}
            <div className={styles.modalBody}>
              <div className={styles.imageGrid}>
                {activeFolder.images.map((img, idx) => (
                  <button
                    key={img.id}
                    className={styles.imgThumb}
                    onClick={() => openLightbox(idx)}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <img
                      src={img.url}
                      alt={img.caption}
                      className={`${styles.thumbImg} ${imgLoaded[`${activeFolder.id}-${idx}`] ? styles.thumbImgLoaded : ""}`}
                      onLoad={() =>
                        setImgLoaded((p) => ({
                          ...p,
                          [`${activeFolder.id}-${idx}`]: true,
                        }))
                      }
                      loading="lazy"
                    />
                    <div className={styles.thumbOverlay}>
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </div>
                    <div className={styles.thumbCaption}>{img.caption}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {activeFolder && lightboxIdx !== null && currentImg && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          {/* Top bar */}
          <div className={styles.lbBar} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lbBarLeft}>
              <button className={styles.lbBack} onClick={closeLightbox}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div>
                <div className={styles.lbFolderName}>{activeFolder.name}</div>
                <div className={styles.lbCaption}>{currentImg.caption}</div>
              </div>
            </div>
            <div className={styles.lbCounter}>
              {lightboxIdx + 1} / {activeFolder.images.length}
            </div>
          </div>

          {/* Image Area */}
          <div
            className={styles.lbImgArea}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev */}
            <button
              className={`${styles.lbArrow} ${styles.lbArrowLeft}`}
              onClick={prevImg}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className={styles.lbImgWrap}>
              <img
                key={currentImg.url}
                src={currentImg.url}
                alt={currentImg.caption}
                className={styles.lbImg}
              />
            </div>

            {/* Next */}
            <button
              className={`${styles.lbArrow} ${styles.lbArrowRight}`}
              onClick={nextImg}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className={styles.lbStrip} onClick={(e) => e.stopPropagation()}>
            {activeFolder.images.map((img, idx) => (
              <button
                key={img.id}
                className={`${styles.lbStripThumb} ${idx === lightboxIdx ? styles.lbStripThumbActive : ""}`}
                onClick={() => setLightboxIdx(idx)}
                style={{
                  borderColor:
                    idx === lightboxIdx ? activeFolder.color : "transparent",
                }}
              >
                <img src={img.url} alt={img.caption} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
