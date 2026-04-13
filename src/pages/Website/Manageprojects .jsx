import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAllProjects, useDeleteProject } from "../../api/hooks/useWebsite";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";
import styles from "./ManageProjects.module.scss";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusColor = (status) => {
  if (!status) return "default";
  const s = status.toLowerCase();
  if (s.includes("complet")) return "completed";
  if (s.includes("progress") || s.includes("ongoing")) return "inprogress";
  if (s.includes("upcoming") || s.includes("planned")) return "upcoming";
  return "default";
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span className={`${styles.badge} ${styles[`badge_${statusColor(status)}`]}`}>
    {status || "—"}
  </span>
);

const EmptyState = ({ query }) => (
  <div className={styles.empty}>
    <span className={styles.emptyIcon}>🏗</span>
    <p className={styles.emptyTitle}>
      {query ? "No projects match your search" : "No projects yet"}
    </p>
    <p className={styles.emptySub}>
      {query
        ? "Try a different keyword or clear the search."
        : "Add your first website project to get started."}
    </p>
  </div>
);

const DeleteModal = ({ project, onConfirm, onCancel, isPending }) => (
  <div className={styles.modalBackdrop} onClick={onCancel}>
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalIcon}>🗑</div>
      <h3 className={styles.modalTitle}>Delete Project?</h3>
      <p className={styles.modalBody}>
        You're about to permanently delete <strong>"{project?.title}"</strong>.
        This action cannot be undone and will remove all associated images.
      </p>
      <div className={styles.modalActions}>
        <button
          className={styles.ghostBtn}
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          className={styles.dangerBtn}
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className={styles.spinner} /> Deleting…
            </>
          ) : (
            "Yes, Delete"
          )}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ManageProjects() {
  const navigate = useNavigate();
  const { data: projects = [], isLoading, isError } = useAllProjects();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("srNo");
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Derived data ──────────────────────────────────────────────────────────
  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean))),
  ];

  const filtered = projects
    .filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.client?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q);
      const matchCat =
        categoryFilter === "All" || p.category === categoryFilter;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "srNo") return (a.srNo ?? 999) - (b.srNo ?? 999);
      if (sortBy === "title")
        return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "category")
        return (a.category || "").localeCompare(b.category || "");
      return 0;
    });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDelete = () => {
    if (!deleteTarget) return;
    const t = showLoading("Deleting project…");
    deleteProject(deleteTarget.id, {
      onSuccess: () => {
        dismissToast(t);
        showSuccess(`"${deleteTarget.title}" deleted successfully`);
        setDeleteTarget(null);
      },
      onError: (err) => {
        dismissToast(t);
        showError(err?.response?.data?.message || "Failed to delete project");
        setDeleteTarget(null);
      },
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div>
            <h1 className={styles.pageTitle}>Manage Projects</h1>
            <p className={styles.pageSub}>
              {projects.length} project{projects.length !== 1 ? "s" : ""} on the
              website
            </p>
          </div>
        </div>
        <div className={styles.pageHeaderRight}>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate("/website/projects/add")}
          >
            + Add Project
          </button>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className={styles.filtersBar}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Search by title, category, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className={styles.clearSearch}
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className={styles.categoryChips}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.chip} ${
                categoryFilter === cat ? styles.chipActive : ""
              }`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className={styles.sortWrap}>
          <label className={styles.sortLabel}>Sort:</label>
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="srNo">Display Order</option>
            <option value="title">Title A–Z</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className={styles.loadingState}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : isError ? (
        <div className={styles.errorState}>
          <span>⚠️</span>
          <p>Failed to load projects. Please try again.</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState query={search} />
      ) : (
        <div className={styles.tableWrap}>
          {/* Results count */}
          {(search || categoryFilter !== "All") && (
            <p className={styles.resultCount}>
              Showing {filtered.length} of {projects.length} projects
            </p>
          )}

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thSr}>#</th>
                <th className={styles.thImage}>Image</th>
                <th className={styles.thTitle}>Title</th>
                <th className={styles.thCategory}>Category</th>
                <th className={styles.thStatus}>Status</th>
                <th className={styles.thLocation}>Location</th>
                <th className={styles.thType}>Type</th>
                <th className={styles.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <tr key={project.id} className={styles.row}>
                  {/* Sr No */}
                  <td className={styles.tdSr}>
                    <span className={styles.srNo}>{project.srNo ?? "—"}</span>
                  </td>

                  {/* Hero Image */}
                  <td className={styles.tdImage}>
                    {project.heroImage?.url ? (
                      <img
                        src={project.heroImage.url}
                        alt={project.title}
                        className={styles.thumb}
                      />
                    ) : (
                      <div className={styles.thumbPlaceholder}>🏛</div>
                    )}
                  </td>

                  {/* Title + Slug */}
                  <td className={styles.tdTitle}>
                    <span className={styles.projectTitle}>{project.title}</span>
                    <span className={styles.projectSlug}>/{project.slug}</span>
                  </td>

                  {/* Category */}
                  <td className={styles.tdCategory}>
                    <span className={styles.categoryTag}>
                      {project.category || "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className={styles.tdStatus}>
                    <StatusBadge status={project.status} />
                  </td>

                  {/* Location */}
                  <td className={styles.tdLocation}>
                    {project.location ? (
                      <span className={styles.metaText}>
                        📍 {project.location}
                      </span>
                    ) : (
                      <span className={styles.metaEmpty}>—</span>
                    )}
                  </td>

                  {/* Type */}
                  <td className={styles.tdType}>
                    <span className={styles.metaText}>
                      {project.projectType || "—"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className={styles.tdActions}>
                    <div className={styles.actionGroup}>
                      {/* View */}
                      <button
                        className={`${styles.actionBtn} ${styles.viewBtn}`}
                        title="View on website"
                        onClick={() =>
                          navigate(`/website/projects/${project.id}`)
                        }
                      >
                        👁 View
                      </button>

                      {/* Edit */}
                      <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        title="Edit project"
                        onClick={() =>
                          navigate(`/website/projects/edit/${project.id}`)
                        }
                      >
                        ✏️ Edit
                      </button>

                      {/* Delete */}
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Delete project"
                        onClick={() => setDeleteTarget(project)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <DeleteModal
          project={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
