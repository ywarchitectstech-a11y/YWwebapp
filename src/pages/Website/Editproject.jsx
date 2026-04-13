import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  useProjectById,
  useUpdateProjectDetails,
  useUpdateHeroImage,
  useUpdateFullImage,
  useUpdateLeftImage,
  useUpdateRightImage,
  useAddGalleryImages,
  useDeleteGalleryImage,
} from "../../api/hooks/useWebsite";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";
import styles from "./EditProject.module.scss";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// ─── Card ─────────────────────────────────────────────────────────────────────
const Card = ({ title, icon, children, accent = false }) => (
  <div className={`${styles.card} ${accent ? styles.cardAccent : ""}`}>
    <div className={styles.cardHead}>
      <span className={styles.cardIcon}>{icon}</span>
      <h3 className={styles.cardTitle}>{title}</h3>
    </div>
    <div className={styles.cardBody}>{children}</div>
  </div>
);

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ label, required, hint, error, full, children }) => (
  <div
    className={`${styles.field} ${full ? styles.fieldFull : ""} ${error ? styles.fieldErr : ""}`}
  >
    <label className={styles.label}>
      {label}
      {required && <span className={styles.req}>*</span>}
    </label>
    {children}
    {hint && !error && <span className={styles.hint}>{hint}</span>}
    {error && <span className={styles.errMsg}>{error}</span>}
  </div>
);

// ─── ListInput ────────────────────────────────────────────────────────────────
const ListInput = ({ label, items, onChange, placeholder, icon }) => {
  const add = () => onChange([...items, ""]);
  const update = (i, val) =>
    onChange(items.map((x, idx) => (idx === i ? val : x)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className={styles.listInput}>
      <div className={styles.listInputHead}>
        <span>
          {icon} {label}
        </span>
        <button type="button" className={styles.addItemBtn} onClick={add}>
          + Add
        </button>
      </div>
      {items.length === 0 && (
        <div className={styles.listEmpty}>
          No items yet — click + Add to start
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} className={styles.listRow}>
          <span className={styles.listRowNum}>{i + 1}</span>
          {placeholder.includes("paragraph") ? (
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              rows={3}
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
            />
          ) : (
            <input
              className={styles.input}
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
            />
          )}
          <button
            type="button"
            className={styles.removeItemBtn}
            onClick={() => remove(i)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

// ─── ImageEditSlot ────────────────────────────────────────────────────────────
// currentUrl  = existing saved URL (project.hero / .full / .left / .right)
// pendingFile = File selected locally, not yet uploaded
// variant     = "hero" | "full" | "panel"
const ImageEditSlot = ({
  label,
  hint,
  currentUrl,
  pendingFile,
  onSelect,
  onClearPending,
  isUploading,
  variant = "panel",
}) => {
  const ref = useRef(null);

  const previewSrc = pendingFile
    ? URL.createObjectURL(pendingFile)
    : currentUrl || null;
  const hasImage = !!previewSrc;
  const isPending = !!pendingFile;

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
    onSelect(file);
  };

  return (
    <div className={`${styles.imageSlot} ${styles[`imageSlot_${variant}`]}`}>
      {/* Label + action buttons */}
      <div className={styles.imageSlotHeader}>
        <span className={styles.imageSlotLabel}>{label}</span>
        <div className={styles.imageSlotActions}>
          {isPending && !isUploading && (
            <button
              type="button"
              className={styles.clearPendingBtn}
              onClick={onClearPending}
            >
              ✕ Discard
            </button>
          )}
          {hasImage && !isUploading && (
            <button
              type="button"
              className={styles.replaceBtnInline}
              onClick={() => ref.current?.click()}
            >
              🔄 {isPending ? "Change" : "Replace"}
            </button>
          )}
          {isUploading && (
            <span className={styles.uploadingBadge}>
              <span className={styles.spinnerSm} /> Saving…
            </span>
          )}
        </div>
      </div>

      {/* Image / empty card */}
      {hasImage ? (
        <div
          className={`${styles.imageSlotFilled} ${isPending ? styles.imageSlotPending : ""}`}
        >
          <img src={previewSrc} alt={label} className={styles.slotImg} />
          {isPending && (
            <div className={styles.pendingBanner}>
              ⚡ Unsaved — click "Save Images" to upload
            </div>
          )}
        </div>
      ) : (
        <div
          className={styles.imageSlotEmpty}
          onClick={() => !isUploading && ref.current?.click()}
        >
          <span className={styles.slotEmptyIcon}>📤</span>
          <span className={styles.slotEmptyTitle}>Add {label}</span>
          {hint && <span className={styles.slotEmptyHint}>{hint}</span>}
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

// ─── GalleryEditGrid ──────────────────────────────────────────────────────────
const GalleryEditGrid = ({
  existing,
  pendingNew,
  deletingId,
  uploadingGallery,
  onDeleteExisting,
  onAddPending,
  onRemovePending,
}) => {
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
    if (valid.length) onAddPending(valid);
  };

  return (
    <div className={styles.galleryGrid}>
      {/* Existing saved photos */}
      {existing.map((img, i) => {
        const imgId = img?.id ?? img?._id;
        const imgUrl = typeof img === "string" ? img : img?.imageUrl;
        const isDeleting = deletingId === imgId;
        return (
          <div
            key={imgId}
            className={`${styles.galleryCard} ${isDeleting ? styles.galleryCardDeleting : ""}`}
          >
            <img
              src={imgUrl}
              alt={`Gallery ${i + 1}`}
              className={styles.galleryCardImg}
            />
            <div className={styles.galleryCardOverlay}>
              <button
                type="button"
                className={styles.galleryDeleteBtn}
                onClick={() => onDeleteExisting(imgId)}
                disabled={isDeleting}
                title="Delete"
              >
                {isDeleting ? <span className={styles.spinnerWhite} /> : "🗑"}
              </button>
            </div>
            <span className={styles.galleryCardOrder}>{i + 1}</span>
          </div>
        );
      })}

      {/* Pending new photos */}
      {pendingNew.map((file, i) => (
        <div
          key={`pending-${i}`}
          className={`${styles.galleryCard} ${styles.galleryCardPending}`}
        >
          <img
            src={URL.createObjectURL(file)}
            alt={`New ${i + 1}`}
            className={styles.galleryCardImg}
          />
          <div className={styles.galleryCardOverlay}>
            <button
              type="button"
              className={styles.galleryDeleteBtn}
              onClick={() => onRemovePending(i)}
              title="Remove"
            >
              ✕
            </button>
          </div>
          <span className={styles.galleryPendingBadge}>New</span>
        </div>
      ))}

      {/* Add card */}
      <div
        className={`${styles.galleryAddCard} ${drag ? styles.galleryAddCardDrag : ""}`}
        onClick={() => !uploadingGallery && ref.current?.click()}
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
        {uploadingGallery ? (
          <>
            <span className={styles.spinnerPrimary} />
            <span className={styles.galleryAddText}>Uploading…</span>
          </>
        ) : (
          <>
            <span className={styles.galleryAddIcon}>{drag ? "📂" : "＋"}</span>
            <span className={styles.galleryAddText}>Add Photos</span>
            <span className={styles.galleryAddHint}>
              Drop or click · Max 10 MB each
            </span>
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
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const invalidateProject = () => {
    queryClient.invalidateQueries(["websiteProjectId", id]);
    queryClient.invalidateQueries(["websiteProjects"]);
  };
  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: project, isLoading, isError } = useProjectById(id);

  // ── Mutations (all via hooks — no direct websiteApi calls) ────────────────
  const { mutateAsync: saveDetails, isPending: isSavingDetails } =
    useUpdateProjectDetails();
  const { mutateAsync: uploadHero, isPending: isUploadingHero } =
    useUpdateHeroImage();
  const { mutateAsync: uploadFull, isPending: isUploadingFull } =
    useUpdateFullImage();
  const { mutateAsync: uploadLeft, isPending: isUploadingLeft } =
    useUpdateLeftImage();
  const { mutateAsync: uploadRight, isPending: isUploadingRight } =
    useUpdateRightImage();
  const { mutateAsync: addGallery, isPending: isUploadingGallery } =
    useAddGalleryImages();
  const { mutateAsync: deleteGallery, isPending: isDeletingGallery } =
    useDeleteGalleryImage();

  // ── Form state ────────────────────────────────────────────────────────────
  const [form, setFormState] = useState(null);
  const [errors, setErrors] = useState({});

  // ── Pending images (selected locally, not yet uploaded) ───────────────────
  const [pendingImages, setPendingImages] = useState({
    hero: null,
    full: null,
    left: null,
    right: null,
  });
  const [pendingGallery, setPendingGallery] = useState([]);
  const [deletingGalleryId, setDeletingGalleryId] = useState(null);

  // ── Populate form once project loads (only first time) ────────────────────
  useEffect(() => {
    if (!project || form) return;
    setFormState({
      srNo: project.srNo?.toString() ?? "",
      slug: project.slug ?? "",
      title: project.title ?? "",
      category: project.category ?? "",
      status: project.status?.trim() ?? "",
      projectType: project.projectType ?? "",
      location: project.location ?? "",
      scopeOfWork: project.scopeOfWork ?? "",
      client: project.client?.trim() ?? "",
      size: {
        plotArea: project.size?.plotArea ?? "",
        builtUpArea: project.size?.builtUpArea ?? "",
        towerFloors: project.size?.towerFloors ?? "",
        commercialFloors: project.size?.commercialFloors ?? "",
      },
      description: project.description ?? [],
      servicesProvided: project.servicesProvided ?? [],
      _slugManual: true, // never auto-overwrite slug on edit
    });
  }, [project, form]);

  // ── Field helpers ─────────────────────────────────────────────────────────
  const set = (field, value) => {
    setFormState((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !prev._slugManual) next.slug = slugify(value);
      if (field === "slug") {
        next._slugManual = true;
        next.slug = slugify(value);
      }
      return next;
    });
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const setSize = (field, value) =>
    setFormState((prev) => ({
      ...prev,
      size: { ...prev.size, [field]: value },
    }));

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (!form.category.trim()) e.category = "Category is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Save Details (JSON — text fields only) ────────────────────────────────
  const handleSaveDetails = async () => {
    if (!validate()) {
      showError("Please fill in the required fields");
      return;
    }

    const payload = {
      srNo: form.srNo ? Number(form.srNo) : null,
      slug: form.slug.trim(),
      title: form.title.trim(),
      category: form.category.trim(),
      status: form.status || null,
      projectType: form.projectType || null,
      location: form.location || null,
      scopeOfWork: form.scopeOfWork || null,
      client: form.client || null,
      size: {
        plotArea: form.size.plotArea || null,
        builtUpArea: form.size.builtUpArea || null,
        towerFloors: form.size.towerFloors || null,
        commercialFloors: form.size.commercialFloors || null,
      },
      description: form.description.filter(Boolean),
      servicesProvided: form.servicesProvided.filter(Boolean),
    };

    const t = showLoading("Saving details…");
    try {
      await saveDetails({ id: project.id, data: payload });
      dismissToast(t);
      showSuccess("Details saved!");
    } catch (err) {
      dismissToast(t);
      showError(err?.response?.data?.message || "Save failed");
    }
  };

  // ── Save all pending images ───────────────────────────────────────────────
  // Each hook handles FormData building & cache invalidation internally.
  const handleSaveImages = async () => {
    const hasSomething =
      Object.values(pendingImages).some(Boolean) || pendingGallery.length > 0;

    if (!hasSomething) {
      showError("No new images selected to save");
      return;
    }

    // Single-image slots — run sequentially
    const slotJobs = [
      pendingImages.hero && {
        key: "hero",
        mutate: uploadHero,
        file: pendingImages.hero,
      },
      pendingImages.full && {
        key: "full",
        mutate: uploadFull,
        file: pendingImages.full,
      },
      pendingImages.left && {
        key: "left",
        mutate: uploadLeft,
        file: pendingImages.left,
      },
      pendingImages.right && {
        key: "right",
        mutate: uploadRight,
        file: pendingImages.right,
      },
    ].filter(Boolean);

    for (const { key, mutate, file } of slotJobs) {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      const t = showLoading(`Uploading ${label} image…`);
      try {
        // Hook receives { id, file } — builds FormData + sets correct Content-Type internally
        await mutate({ id: project.id, file });
        invalidateProject();
        dismissToast(t);
        showSuccess(`${label} image updated!`);
        setPendingImages((p) => ({ ...p, [key]: null }));
      } catch (err) {
        dismissToast(t);
        showError(err?.response?.data?.message || `${label} upload failed`);
      }
    }

    // Gallery — batch upload
    if (pendingGallery.length > 0) {
      const t = showLoading(
        `Uploading ${pendingGallery.length} gallery photo(s)…`,
      );
      try {
        // Hook receives { id, files } — builds FormData internally
        await addGallery({ id: project.id, files: pendingGallery });
        dismissToast(t);
        invalidateProject();
        showSuccess(`${pendingGallery.length} photo(s) added to gallery`);
        setPendingGallery([]);
      } catch (err) {
        dismissToast(t);
        showError(err?.response?.data?.message || "Gallery upload failed");
      }
    }
  };

  // ── Delete existing gallery photo ─────────────────────────────────────────
  const handleGalleryDelete = async (imageId) => {
    setDeletingGalleryId(imageId);
    const t = showLoading("Removing photo…");
    try {
      // Hook receives { id, imageId }
      await deleteGallery({ id: project.id, imageId });
      invalidateProject();
      dismissToast(t);
      showSuccess("Photo removed");
    } catch (err) {
      dismissToast(t);
      showError(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingGalleryId(null);
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const hasPendingImages =
    Object.values(pendingImages).some(Boolean) || pendingGallery.length > 0;

  const isAnyImageUploading =
    isUploadingHero ||
    isUploadingFull ||
    isUploadingLeft ||
    isUploadingRight ||
    isUploadingGallery;

  const pendingLabels = [
    pendingImages.hero && "Hero",
    pendingImages.full && "Full Width",
    pendingImages.left && "Left Panel",
    pendingImages.right && "Right Panel",
    pendingGallery.length && `${pendingGallery.length} gallery photo(s)`,
  ]
    .filter(Boolean)
    .join(", ");

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading || !form) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonHeader} />
        <div className={styles.layout}>
          <div className={styles.colMain}>
            {[200, 160, 240].map((h, i) => (
              <div key={i} className={styles.skeleton} style={{ height: h }} />
            ))}
          </div>
          <div className={styles.colSide}>
            {[260, 380].map((h, i) => (
              <div key={i} className={styles.skeleton} style={{ height: h }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
              Projects &rsaquo;{" "}
              <span
                className={styles.breadcrumbLink}
                onClick={() => navigate(`/website/projects/view/${project.id}`)}
              >
                {project.title}
              </span>{" "}
              &rsaquo; <span>Edit</span>
            </div>
            <h1 className={styles.pageTitle}>Edit Project</h1>
            <p className={styles.pageSub}>
              Update details and manage images for{" "}
              <strong>{project.title}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className={styles.layout}>
        {/* ═══ LEFT — text fields ═══ */}
        <div className={styles.colMain}>
          {/* Identity */}
          <Card title="Project Identity" icon="🏷️" accent>
            <div className={styles.grid2}>
              <Field label="Project Title" required error={errors.title} full>
                <input
                  className={styles.input}
                  placeholder="e.g. Adhya Radha Krishna Residence"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </Field>
              <Field
                label="Slug"
                required
                error={errors.slug}
                hint="URL-friendly ID · auto-generated from title"
              >
                <input
                  className={styles.input}
                  placeholder="adhya-radha-krishna"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                />
              </Field>
              <Field
                label="Category"
                required
                error={errors.category}
                hint="e.g. Residential, Commercial, Interior"
              >
                <input
                  className={styles.input}
                  placeholder="Residential"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                />
              </Field>
              <Field
                label="Display Order (Sr No)"
                hint="Controls order on website listing"
              >
                <input
                  className={styles.input}
                  type="number"
                  min="1"
                  placeholder="1"
                  value={form.srNo}
                  onChange={(e) => set("srNo", e.target.value)}
                />
              </Field>
            </div>
          </Card>

          {/* Details */}
          <Card title="Project Details" icon="📋">
            <div className={styles.grid2}>
              <Field
                label="Status"
                hint="e.g. Completed, In Progress, Upcoming"
              >
                <input
                  className={styles.input}
                  placeholder="Completed"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                />
              </Field>
              <Field
                label="Project Type"
                hint="e.g. Architecture, Interior, Renovation"
              >
                <input
                  className={styles.input}
                  placeholder="Architecture"
                  value={form.projectType}
                  onChange={(e) => set("projectType", e.target.value)}
                />
              </Field>
              <Field label="Location">
                <input
                  className={styles.input}
                  placeholder="e.g. Pune, Maharashtra"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </Field>
              <Field label="Client Name">
                <input
                  className={styles.input}
                  placeholder="Client or organisation name"
                  value={form.client}
                  onChange={(e) => set("client", e.target.value)}
                />
              </Field>
              <Field label="Scope of Work" full>
                <input
                  className={styles.input}
                  placeholder="e.g. Architecture, Structural, Interior Design"
                  value={form.scopeOfWork}
                  onChange={(e) => set("scopeOfWork", e.target.value)}
                />
              </Field>
            </div>
          </Card>

          {/* Size */}
          <Card title="Project Size" icon="📐">
            <div className={styles.grid2}>
              <Field label="Plot Area" hint="e.g. 5000 sq ft">
                <input
                  className={styles.input}
                  placeholder="5000 sq ft"
                  value={form.size.plotArea}
                  onChange={(e) => setSize("plotArea", e.target.value)}
                />
              </Field>
              <Field label="Built-up Area" hint="e.g. 12000 sq ft">
                <input
                  className={styles.input}
                  placeholder="12000 sq ft"
                  value={form.size.builtUpArea}
                  onChange={(e) => setSize("builtUpArea", e.target.value)}
                />
              </Field>
              <Field label="Tower Floors" hint="e.g. G+12">
                <input
                  className={styles.input}
                  placeholder="G+12"
                  value={form.size.towerFloors}
                  onChange={(e) => setSize("towerFloors", e.target.value)}
                />
              </Field>
              <Field label="Commercial Floors" hint="e.g. 3">
                <input
                  className={styles.input}
                  placeholder="3"
                  value={form.size.commercialFloors}
                  onChange={(e) => setSize("commercialFloors", e.target.value)}
                />
              </Field>
            </div>
          </Card>

          {/* Content */}
          <Card title="Project Content" icon="✍️">
            <ListInput
              label="Description Paragraphs"
              icon="📝"
              items={form.description}
              onChange={(v) => set("description", v)}
              placeholder="Enter a description paragraph…"
            />
            <div className={styles.divider} />
            <ListInput
              label="Services Provided"
              icon="🔧"
              items={form.servicesProvided}
              onChange={(v) => set("servicesProvided", v)}
              placeholder="e.g. Structural Design"
            />
          </Card>

          {/* Save Details inline button */}
          <div className={styles.saveDetailsRow}>
            <button
              className={styles.saveDetailsBtn}
              onClick={handleSaveDetails}
              disabled={isSavingDetails}
            >
              {isSavingDetails ? (
                <>
                  <span className={styles.spinner} /> Saving Details…
                </>
              ) : (
                "💾 Save Details"
              )}
            </button>
          </div>
        </div>

        {/* ═══ RIGHT — images ═══ */}
        <div className={styles.colSide}>
          {/* Hero */}
          <Card title="Hero Image" icon="🖼️" accent>
            <p className={styles.imageNote}>
              Main banner at top of project page. 1920 × 1080+ recommended.
            </p>
            <ImageEditSlot
              label="Hero Image"
              hint="1920 × 1080 · Max 10 MB"
              variant="hero"
              currentUrl={project.hero}
              pendingFile={pendingImages.hero}
              onSelect={(f) => setPendingImages((p) => ({ ...p, hero: f }))}
              onClearPending={() =>
                setPendingImages((p) => ({ ...p, hero: null }))
              }
              isUploading={isUploadingHero}
            />
          </Card>

          {/* Layout Images */}
          <Card title="Layout Images" icon="🗃️">
            <p className={styles.imageNote}>
              Full-width strip + Left &amp; Right panel pair.
            </p>
            <div className={styles.layoutSlots}>
              <ImageEditSlot
                label="Full Width"
                hint="1920 px wide"
                variant="full"
                currentUrl={project.full}
                pendingFile={pendingImages.full}
                onSelect={(f) => setPendingImages((p) => ({ ...p, full: f }))}
                onClearPending={() =>
                  setPendingImages((p) => ({ ...p, full: null }))
                }
                isUploading={isUploadingFull}
              />
              <div className={styles.splitSlots}>
                <ImageEditSlot
                  label="Left Panel"
                  hint="960 px"
                  variant="panel"
                  currentUrl={project.left}
                  pendingFile={pendingImages.left}
                  onSelect={(f) => setPendingImages((p) => ({ ...p, left: f }))}
                  onClearPending={() =>
                    setPendingImages((p) => ({ ...p, left: null }))
                  }
                  isUploading={isUploadingLeft}
                />
                <ImageEditSlot
                  label="Right Panel"
                  hint="960 px"
                  variant="panel"
                  currentUrl={project.right}
                  pendingFile={pendingImages.right}
                  onSelect={(f) =>
                    setPendingImages((p) => ({ ...p, right: f }))
                  }
                  onClearPending={() =>
                    setPendingImages((p) => ({ ...p, right: null }))
                  }
                  isUploading={isUploadingRight}
                />
              </div>
            </div>
          </Card>

          {/* Gallery */}
          <Card
            title={`Gallery (${gallery.length} saved${pendingGallery.length ? ` + ${pendingGallery.length} pending` : ""})`}
            icon="🎨"
          >
            <p className={styles.imageNote}>
              Click 🗑 to delete a saved photo instantly. Photos marked{" "}
              <strong>New</strong> will upload when you click "Save Images".
            </p>
            <GalleryEditGrid
              existing={gallery}
              pendingNew={pendingGallery}
              deletingId={deletingGalleryId}
              uploadingGallery={isUploadingGallery}
              onDeleteExisting={handleGalleryDelete}
              onAddPending={(files) =>
                setPendingGallery((p) => [...p, ...files])
              }
              onRemovePending={(i) =>
                setPendingGallery((p) => p.filter((_, idx) => idx !== i))
              }
            />
          </Card>

          {/* Pending images banner */}
          {hasPendingImages && (
            <div className={styles.saveImagesRow}>
              <div className={styles.saveImagesInfo}>
                {pendingLabels} ready to upload
              </div>
              <button
                className={styles.saveImagesBtn}
                onClick={handleSaveImages}
                disabled={isAnyImageUploading}
              >
                {isAnyImageUploading ? (
                  <>
                    <span className={styles.spinner} /> Uploading…
                  </>
                ) : (
                  "☁️ Save Images"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className={styles.actionBar}>
        <button className={styles.ghostBtn} onClick={() => navigate(-1)}>
          ← Cancel
        </button>
        <div className={styles.actionBarRight}>
          {hasPendingImages && (
            <button
              className={styles.saveImagesBtn}
              onClick={handleSaveImages}
              disabled={isAnyImageUploading}
            >
              {isAnyImageUploading ? (
                <>
                  <span className={styles.spinner} /> Uploading…
                </>
              ) : (
                "☁️ Save Images"
              )}
            </button>
          )}
          <button
            className={styles.saveDetailsBtn}
            onClick={handleSaveDetails}
            disabled={isSavingDetails}
          >
            {isSavingDetails ? (
              <>
                <span className={styles.spinner} /> Saving…
              </>
            ) : (
              "💾 Save Details"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
