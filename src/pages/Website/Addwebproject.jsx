import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProject } from "../../api/hooks/useWebsite";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";
import styles from "./AddWebProject.module.scss";

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Auto-generate slug from title: "Adhya Radha Krishna" → "adhya-radha-krishna"
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// ─── Sub-components ───────────────────────────────────────────────────────────
const Card = ({ title, icon, children, accent = false }) => (
  <div className={`${styles.card} ${accent ? styles.cardAccent : ""}`}>
    <div className={styles.cardHead}>
      <span className={styles.cardIcon}>{icon}</span>
      <h3 className={styles.cardTitle}>{title}</h3>
    </div>
    <div className={styles.cardBody}>{children}</div>
  </div>
);

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

// ─── Single Image Dropzone ─────────────────────────────────────────────────────
const ImageDropzone = ({ label, partName, file, onChange, hint }) => {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  const preview = file ? URL.createObjectURL(file) : null;

  const handle = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      showError("Only image files allowed");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      showError("Image must be < 10MB");
      return;
    }
    onChange(partName, f);
  };

  return (
    <div className={styles.dzWrap}>
      <label className={styles.dzLabel}>{label}</label>
      <div
        className={`${styles.dz} ${drag ? styles.dzDrag : ""} ${file ? styles.dzFilled : ""}`}
        onClick={() => !file && ref.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files?.[0]);
        }}
      >
        {preview ? (
          <>
            <img src={preview} alt={label} className={styles.dzPreview} />
            <button
              type="button"
              className={styles.dzRemove}
              onClick={(e) => {
                e.stopPropagation();
                onChange(partName, null);
              }}
            >
              ✕
            </button>
          </>
        ) : (
          <div className={styles.dzEmpty}>
            <span className={styles.dzIcon}>{drag ? "📂" : "📤"}</span>
            <span className={styles.dzText}>Drop or click to upload</span>
            {hint && <span className={styles.dzHint}>{hint}</span>}
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className={styles.dzInput}
          onChange={(e) => {
            handle(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
};

// ─── Multi-image Gallery Dropzone ─────────────────────────────────────────────
const GalleryDropzone = ({ files, onChange }) => {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);

  const addFiles = (newFiles) => {
    const valid = Array.from(newFiles).filter((f) => {
      if (!f.type.startsWith("image/")) {
        showError(`${f.name}: not an image`);
        return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        showError(`${f.name}: must be < 10MB`);
        return false;
      }
      return true;
    });
    onChange([...files, ...valid]);
  };

  const remove = (i) => onChange(files.filter((_, idx) => idx !== i));

  return (
    <div className={styles.galleryWrap}>
      <div
        className={`${styles.galleryDz} ${drag ? styles.dzDrag : ""}`}
        onClick={() => ref.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <span className={styles.dzIcon}>{drag ? "📂" : "🖼"}</span>
        <span className={styles.dzText}>
          Drop images or click to add gallery photos
        </span>
        <span className={styles.dzHint}>
          Multiple images allowed · Max 10MB each
        </span>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          className={styles.dzInput}
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {files.length > 0 && (
        <div className={styles.galleryGrid}>
          {files.map((f, i) => (
            <div key={i} className={styles.galleryItem}>
              <img
                src={URL.createObjectURL(f)}
                alt={`gallery-${i}`}
                className={styles.galleryThumb}
              />
              <button
                type="button"
                className={styles.galleryRemove}
                onClick={() => remove(i)}
              >
                ✕
              </button>
              <span className={styles.galleryOrder}>{i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Dynamic List Input (description paragraphs / services) ───────────────────
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

// ─── Initial Form State ───────────────────────────────────────────────────────
const initialForm = {
  // Identity
  srNo: "",
  slug: "",
  title: "",
  category: "",
  // Stats
  status: "",
  projectType: "",
  location: "",
  scopeOfWork: "",
  client: "",
  // Size
  size: {
    plotArea: "",
    builtUpArea: "",
    towerFloors: "",
    commercialFloors: "",
  },
  // Content
  description: [],
  servicesProvided: [],
};

const initialFiles = {
  heroImage: null,
  fullImage: null,
  leftImage: null,
  rightImage: null,
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AddWebProject() {
  const navigate = useNavigate();
  const { mutate: createProject, isPending } = useCreateProject();

  const [form, setFormState] = useState(initialForm);
  const [files, setFiles] = useState(initialFiles);
  const [galleryFiles, setGallery] = useState([]);
  const [errors, setErrors] = useState({});

  // ── Field helpers ─────────────────────────────────────────────────────────
  const set = (field, value) => {
    setFormState((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug from title if slug hasn't been manually edited
      if (field === "title" && !prev._slugManual) {
        next.slug = slugify(value);
      }
      if (field === "slug") {
        next._slugManual = true;
        next.slug = slugify(value);
      }
      return next;
    });
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const setSize = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      size: { ...prev.size, [field]: value },
    }));
  };

  const setFile = (partName, file) => {
    setFiles((prev) => ({ ...prev, [partName]: file }));
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (!files.heroImage) e.heroImage = "Hero image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Build multipart payload ────────────────────────────────────────────────
  // Backend expects:
  //   Part "projectData" = JSON string of WebProjectDTO
  //   Parts "heroImage", "fullImage", "leftImage", "rightImage" = files
  //   Part "galleryImages" = multiple files
  const buildFormData = () => {
    const projectData = {
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

    const fd = new FormData();
    fd.append("projectData", JSON.stringify(projectData));

    if (files.heroImage) fd.append("heroImage", files.heroImage);
    if (files.fullImage) fd.append("fullImage", files.fullImage);
    if (files.leftImage) fd.append("leftImage", files.leftImage);
    if (files.rightImage) fd.append("rightImage", files.rightImage);
    galleryFiles.forEach((f) => fd.append("galleryImages", f));

    return fd;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!validate()) {
      showError("Please fill in the required fields");
      return;
    }

    const t = showLoading("Creating website project…");

    createProject(buildFormData(), {
      onSuccess: (res) => {
        dismissToast(t);
        showSuccess("Project created successfully!");
        const id = res?.data?.id || res?.id;
        navigate(id ? `/website/projects/${id}` : "/website/projects");
      },
      onError: (err) => {
        dismissToast(t);
        showError(err?.response?.data?.message || "Failed to create project");
      },
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <h1 className={styles.pageTitle}>Add Website Project</h1>
            <p className={styles.pageSub}>
              Create a new project entry for the public website
            </p>
          </div>
        </div>
        <div className={styles.pageHeaderRight}>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className={styles.spinner} /> Publishing…
              </>
            ) : (
              "🌐 Publish Project"
            )}
          </button>
        </div>
      </div>

      {/* ── Form Body ── */}
      <div className={styles.formBody}>
        {/* ══ LEFT COLUMN ══ */}
        <div className={styles.colMain}>
          {/* ── Card 1: Identity ── */}
          <Card title="Project Identity" icon="🏷" accent>
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
                hint="URL-friendly ID — auto-generated from title. e.g. adhya-radha-krishna"
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
                hint="Controls order on website listing page"
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

          {/* ── Card 2: Project Stats ── */}
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

          {/* ── Card 3: Size ── */}
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

          {/* ── Card 4: Content ── */}
          <Card title="Project Content" icon="✍">
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
        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div className={styles.colSide}>
          {/* ── Card 5: Hero Image (required) ── */}
          <Card title="Hero Image" icon="🖼" accent>
            <p className={styles.imageNote}>
              Main banner shown at the top of the project page. High-res
              recommended (1920×1080+).
            </p>
            <ImageDropzone
              label=""
              partName="heroImage"
              file={files.heroImage}
              onChange={setFile}
              hint="1920 × 1080 recommended · Max 10MB"
            />
            {errors.heroImage && (
              <span className={styles.errMsg}>{errors.heroImage}</span>
            )}
          </Card>

          {/* ── Card 6: Layout Images ── */}
          <Card title="Layout Images" icon="🗃">
            <p className={styles.imageNote}>
              Used in the 3-image layout: Full-width + Left + Right split.
            </p>
            <div className={styles.layoutGrid}>
              <ImageDropzone
                label="Full Width"
                partName="fullImage"
                file={files.fullImage}
                onChange={setFile}
                hint="1920px wide"
              />
              <ImageDropzone
                label="Left Panel"
                partName="leftImage"
                file={files.leftImage}
                onChange={setFile}
                hint="960px wide"
              />
              <ImageDropzone
                label="Right Panel"
                partName="rightImage"
                file={files.rightImage}
                onChange={setFile}
                hint="960px wide"
              />
            </div>
          </Card>

          {/* ── Card 7: Gallery ── */}
          <Card title="Gallery Images" icon="🎨">
            <p className={styles.imageNote}>
              Additional photos shown in the project gallery carousel. Ordered
              as uploaded.
            </p>
            <GalleryDropzone files={galleryFiles} onChange={setGallery} />
          </Card>
        </div>
      </div>

      {/* ── Bottom action bar ── */}
      <div className={styles.actionBar}>
        <button
          className={styles.ghostBtn}
          onClick={() => navigate(-1)}
          disabled={isPending}
        >
          ← Cancel
        </button>
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className={styles.spinner} /> Publishing…
            </>
          ) : (
            "🌐 Publish Project"
          )}
        </button>
      </div>
    </div>
  );
}
