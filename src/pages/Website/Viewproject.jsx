import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useProjectById } from "../../api/hooks/useWebsite";
import { websiteApi } from "../../api/website.api";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";
import styles from "./ViewProject.module.scss";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusColor = (status) => {
  if (!status) return "default";
  const s = status.toLowerCase().trim();
  if (s.includes("complet")) return "completed";
  if (s.includes("progress") || s.includes("ongoing")) return "inprogress";
  if (s.includes("upcoming") || s.includes("planned")) return "upcoming";
  return "default";
};

// ─── Image Slot ───────────────────────────────────────────────────────────────
// imageUrl = plain string URL — project.hero / project.full / project.left / project.right
// variant  = "hero" | "full" | "panel"
const ImageSlot = ({
  label,
  hint,
  imageUrl,
  onUpload,
  isUploading,
  variant = "panel",
}) => {
  const ref = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Only image files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showError("Image must be under 10 MB");
      return;
    }
    onUpload(file);
  };

  const hasImage = !!imageUrl;

  return (
    <div className={`${styles.imageSlot} ${styles[`imageSlot_${variant}`]}`}>
      {/* Label + replace button */}
      <div className={styles.imageSlotHeader}>
        <span className={styles.imageSlotLabel}>{label}</span>
        {hasImage && (
          <button
            className={styles.replaceBtnInline}
            onClick={() => ref.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className={styles.spinnerSm} /> Uploading…
              </>
            ) : (
              "🔄 Replace"
            )}
          </button>
        )}
      </div>

      {/* Image or empty upload card */}
      {hasImage ? (
        <div className={styles.imageSlotFilled}>
          <img src={imageUrl} alt={label} className={styles.slotImg} />
        </div>
      ) : (
        <div
          className={styles.imageSlotEmpty}
          onClick={() => !isUploading && ref.current?.click()}
        >
          {isUploading ? (
            <>
              <span className={styles.spinnerPrimary} />
              <span className={styles.slotEmptyTitle}>Uploading…</span>
            </>
          ) : (
            <>
              <span className={styles.slotEmptyIcon}>📤</span>
              <span className={styles.slotEmptyTitle}>Add {label}</span>
              {hint && <span className={styles.slotEmptyHint}>{hint}</span>}
            </>
          )}
        </div>
      )}

      <input
        ref={ref}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
};

// ─── Gallery Image Card ───────────────────────────────────────────────────────
// gallery item: { id, url } or plain string
const GalleryCard = ({ image, index, onDelete, isDeleting }) => {
  const url = typeof image === "string" ? image : image?.imageUrl;
  const imgId = image?.id ?? image?._id;
  return (
    <div
      className={`${styles.galleryCard} ${isDeleting ? styles.galleryCardDeleting : ""}`}
    >
      <img
        src={url}
        alt={`Gallery ${index + 1}`}
        className={styles.galleryCardImg}
      />
      <div className={styles.galleryCardOverlay}>
        <button
          className={styles.galleryDeleteBtn}
          onClick={() => {
            if (!imgId) {
              showError("Invalid image ID");
              return;
            }
            onDelete(imgId);
          }}
          disabled={isDeleting}
          title="Remove"
        >
          {isDeleting ? <span className={styles.spinnerWhite} /> : "🗑"}
        </button>
      </div>
      <span className={styles.galleryCardOrder}>{index + 1}</span>
    </div>
  );
};

// ─── Gallery Add Card ─────────────────────────────────────────────────────────
const GalleryAddCard = ({ onAdd, isUploading }) => {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => {
      if (!f.type.startsWith("image/")) {
        showError(`${f.name}: not an image`);
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        showError(`${f.name}: must be < 10 MB`);
        return false;
      }
      return true;
    });
    if (valid.length) onAdd(valid);
  };

  return (
    <div
      className={`${styles.galleryAddCard} ${drag ? styles.galleryAddCardDrag : ""}`}
      onClick={() => !isUploading && ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      {isUploading ? (
        <>
          <span className={styles.spinnerPrimary} />
          <span className={styles.galleryAddText}>Uploading…</span>
        </>
      ) : (
        <>
          <span className={styles.galleryAddIcon}>{drag ? "📂" : "＋"}</span>
          <span className={styles.galleryAddText}>Add Photos</span>
          <span className={styles.galleryAddHint}>Drop or click</span>
        </>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className={styles.hiddenInput}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
};

// ─── Stat Tile ────────────────────────────────────────────────────────────────
const Stat = ({ icon, label, value }) =>
  value?.toString().trim() ? (
    <div className={styles.stat}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue}>{value}</div>
      </div>
    </div>
  ) : null;

// ─── Card ─────────────────────────────────────────────────────────────────────
const Card = ({ icon, title, children, accent }) => (
  <div className={`${styles.card} ${accent ? styles.cardAccent : ""}`}>
    <div className={styles.cardHead}>
      <span className={styles.cardIcon}>{icon}</span>
      <h3 className={styles.cardTitle}>{title}</h3>
    </div>
    <div className={styles.cardBody}>{children}</div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ViewProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project, isLoading, isError } = useProjectById(id);

  const [uploading, setUploading] = useState({
    hero: false,
    full: false,
    left: false,
    right: false,
    gallery: false,
  });
  const [deletingGalleryId, setDeletingGalleryId] = useState(null);

  const setSlot = (key, val) => setUploading((p) => ({ ...p, [key]: val }));
  const invalidate = () => {
    queryClient.invalidateQueries(["websiteProjectId", id]);
    queryClient.invalidateQueries(["websiteProjects"]);
  };

  // ── Single image uploads ───────────────────────────────────────────────────
  const uploadImage = async (slotKey, apiFn, file) => {
    setSlot(slotKey, true);
    const t = showLoading(`Uploading ${slotKey} image…`);
    const fd = new FormData();
    fd.append(`${slotKey}Image`, file);
    try {
      await apiFn(project.id, fd);
      dismissToast(t);
      showSuccess("Image updated!");
      invalidate();
    } catch (err) {
      dismissToast(t);
      showError(err?.response?.data?.message || "Upload failed");
    } finally {
      setSlot(slotKey, false);
    }
  };

  const handleHero = (f) => uploadImage("hero", websiteApi.updateHeroImage, f);
  const handleFull = (f) => uploadImage("full", websiteApi.updateFullImage, f);
  const handleLeft = (f) => uploadImage("left", websiteApi.updateLeftImage, f);
  const handleRight = (f) =>
    uploadImage("right", websiteApi.updateRightImage, f);

  // ── Gallery add ────────────────────────────────────────────────────────────
  const handleGalleryAdd = async (files) => {
    setSlot("gallery", true);
    const t = showLoading(`Uploading ${files.length} photo(s)…`);
    const fd = new FormData();
    files.forEach((f) => fd.append("galleryImages", f));
    try {
      await websiteApi.addGalleryImages(project.id, fd);
      dismissToast(t);
      showSuccess(`${files.length} photo(s) added`);
      invalidate();
    } catch (err) {
      dismissToast(t);
      showError(err?.response?.data?.message || "Gallery upload failed");
    } finally {
      setSlot("gallery", false);
    }
  };

  // ── Gallery delete ─────────────────────────────────────────────────────────
  const handleGalleryDelete = async (imageId) => {
    setDeletingGalleryId(imageId);
    const t = showLoading("Removing photo…");
    try {
      await websiteApi.deleteGalleryImage(project.id, imageId);
      dismissToast(t);
      showSuccess("Photo removed");
      invalidate();
    } catch (err) {
      dismissToast(t);
      showError(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingGalleryId(null);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonHeader} />
        <div className={styles.layout}>
          <div className={styles.colMain}>
            {[160, 130, 180].map((h, i) => (
              <div key={i} className={styles.skeleton} style={{ height: h }} />
            ))}
          </div>
          <div className={styles.colSide}>
            {[220, 320].map((h, i) => (
              <div key={i} className={styles.skeleton} style={{ height: h }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError || !project) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <span>⚠️</span>
          <p>Failed to load project. Please try again.</p>
          <button className={styles.ghostBtn} onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const gallery = Array.isArray(project.gallery) ? project.gallery : [];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <div className={styles.breadcrumb}>
              Projects &rsaquo; <span>{project.title}</span>
            </div>
            <h1 className={styles.pageTitle}>{project.title}</h1>
            <div className={styles.pageMeta}>
              <code className={styles.slugBadge}>/{project.slug}</code>
              {project.srNo && (
                <span className={styles.srBadge}>#{project.srNo}</span>
              )}
              <span
                className={`${styles.statusBadge} ${styles[`status_${statusColor(project.status)}`]}`}
              >
                {project.status?.trim() || "No Status"}
              </span>
            </div>
          </div>
        </div>
        <button
          className={styles.editBtn}
          onClick={() => navigate(`/website/projects/edit/${project.id}`)}
        >
          ✏️ Edit Details
        </button>
      </div>

      {/* Two-column layout */}
      <div className={styles.layout}>
        {/* ═══ LEFT — details + gallery ═══ */}
        <div className={styles.colMain}>
          {/* Project Details */}
          <Card icon="📋" title="Project Details" accent>
            <div className={styles.statsGrid}>
              <Stat icon="🏷️" label="Category" value={project.category} />
              <Stat
                icon="⚙️"
                label="Project Type"
                value={project.projectType}
              />
              <Stat icon="📍" label="Location" value={project.location} />
              <Stat icon="👤" label="Client" value={project.client} />
              <Stat
                icon="🔧"
                label="Scope of Work"
                value={project.scopeOfWork}
              />
            </div>
          </Card>

          {/* Size */}
          {(project.size?.plotArea ||
            project.size?.builtUpArea ||
            project.size?.towerFloors ||
            project.size?.commercialFloors) && (
            <Card icon="📐" title="Project Size">
              <div className={styles.sizeGrid}>
                {project.size?.plotArea && (
                  <div className={styles.sizeTile}>
                    <span className={styles.sizeTileLabel}>Plot Area</span>
                    <span className={styles.sizeTileValue}>
                      {project.size.plotArea}
                    </span>
                    <span className={styles.sizeTileUnit}>sq ft</span>
                  </div>
                )}
                {project.size?.builtUpArea && (
                  <div className={styles.sizeTile}>
                    <span className={styles.sizeTileLabel}>Built-up Area</span>
                    <span className={styles.sizeTileValue}>
                      {project.size.builtUpArea}
                    </span>
                    <span className={styles.sizeTileUnit}>sq ft</span>
                  </div>
                )}
                {project.size?.towerFloors && (
                  <div className={styles.sizeTile}>
                    <span className={styles.sizeTileLabel}>Tower Floors</span>
                    <span className={styles.sizeTileValue}>
                      {project.size.towerFloors}
                    </span>
                  </div>
                )}
                {project.size?.commercialFloors && (
                  <div className={styles.sizeTile}>
                    <span className={styles.sizeTileLabel}>
                      Commercial Floors
                    </span>
                    <span className={styles.sizeTileValue}>
                      {project.size.commercialFloors}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Description */}
          {project.description?.length > 0 && (
            <Card icon="✍️" title="Description">
              <div className={styles.descList}>
                {project.description.map((para, i) => (
                  <p key={i} className={styles.descPara}>
                    {para}
                  </p>
                ))}
              </div>
            </Card>
          )}

          {/* Services */}
          {project.servicesProvided?.length > 0 && (
            <Card icon="🔧" title="Services Provided">
              <div className={styles.servicesList}>
                {project.servicesProvided.map((s, i) => (
                  <span key={i} className={styles.serviceTag}>
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Gallery */}
          <Card
            icon="🎨"
            title={`Gallery (${gallery.length} photo${gallery.length !== 1 ? "s" : ""})`}
          >
            <p className={styles.imageNote}>
              Hover a photo and click 🗑 to remove it. Use the ＋ card or drag
              &amp; drop to add more.
            </p>
            <div className={styles.galleryGrid}>
              {gallery.map((img, i) => (
                <GalleryCard
                  key={img?.id ?? img?._id ?? i}
                  image={img}
                  index={i}
                  onDelete={handleGalleryDelete}
                  isDeleting={deletingGalleryId === (img?.id ?? img?._id ?? i)}
                />
              ))}
              <GalleryAddCard
                onAdd={handleGalleryAdd}
                isUploading={uploading.gallery}
              />
            </div>
          </Card>
        </div>

        {/* ═══ RIGHT — images sidebar ═══ */}
        <div className={styles.colSide}>
          {/* Hero */}
          <Card icon="🖼️" title="Hero Image" accent>
            <p className={styles.imageNote}>
              Main banner at the top of the project page. 1920 × 1080+
              recommended.
            </p>
            <ImageSlot
              label="Hero Image"
              hint="1920 × 1080 · Max 10 MB"
              imageUrl={project.hero}
              onUpload={handleHero}
              isUploading={uploading.hero}
              variant="hero"
            />
          </Card>

          {/* Layout images */}
          <Card icon="🗃️" title="Layout Images">
            <p className={styles.imageNote}>
              Full-width strip + Left &amp; Right panel pair.
            </p>
            <div className={styles.layoutSlots}>
              <ImageSlot
                label="Full Width"
                hint="1920 px wide"
                imageUrl={project.full}
                onUpload={handleFull}
                isUploading={uploading.full}
                variant="full"
              />
              <div className={styles.splitSlots}>
                <ImageSlot
                  label="Left Panel"
                  hint="960 px"
                  imageUrl={project.left}
                  onUpload={handleLeft}
                  isUploading={uploading.left}
                  variant="panel"
                />
                <ImageSlot
                  label="Right Panel"
                  hint="960 px"
                  imageUrl={project.right}
                  onUpload={handleRight}
                  isUploading={uploading.right}
                  variant="panel"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
