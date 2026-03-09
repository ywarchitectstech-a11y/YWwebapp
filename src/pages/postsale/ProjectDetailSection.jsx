// ─── ProjectDetailSection.jsx ─────────────────────────────────────────────────
// Drop this component into your ViewPostSales file.
// Usage: <ProjectDetailSection project={data.project} navigate={navigate} />
// NOTE: Add the fields below to ProjectLiteDTO.java if not already present:
//   address, city, latitude, longitude, googlePlace,
//   plotArea, totalBuiltUpArea, totalCarpetArea,
//   projectDetails, priority, projectCreatedDateTime
import pStyles from "./ProjectDetailSection.module.scss";
const priorityColors = {
  HIGH: { bg: "#fee2e2", color: "#991b1b" },
  MEDIUM: { bg: "#fef9c3", color: "#854d0e" },
  LOW: { bg: "#dcfce7", color: "#166534" },
};

const ProjectDetailSection = ({ project, navigate }) => {
  if (!project) return null;

  const priority = project.priority?.toUpperCase();
  const pColor = priorityColors[priority] || {
    bg: "#f3f4f6",
    color: "#374151",
  };

  const hasLocation = project.address || project.city || project.latitude;
  const hasArea =
    project.plotArea || project.totalBuiltUpArea || project.totalCarpetArea;
  const hasDates =
    project.projectCreatedDateTime ||
    project.projectStartDateTime ||
    project.projectExpectedEndDate ||
    project.projectEndDateTime;

  return (
    <div className={pStyles.wrapper}>
      {/* ── Section Label ── */}
      <div className={pStyles.sectionLabel}>
        <span className={pStyles.labelLine} />
        <span className={pStyles.labelText}>Linked Project</span>
        <span className={pStyles.labelLine} />
      </div>

      {/* ── Top Strip: Identity ── */}
      <div className={pStyles.identityStrip}>
        <div className={pStyles.stripLogo}>
          {project.logoUrl ? (
            <img src={project.logoUrl} alt="project logo" />
          ) : (
            <span>{project.projectName?.charAt(0) || "P"}</span>
          )}
        </div>

        <div className={pStyles.stripInfo}>
          <h2 className={pStyles.projName}>
            {project.projectName || "Unnamed Project"}
          </h2>
          <div className={pStyles.stripMeta}>
            {project.projectCode && (
              <code className={pStyles.metaChip}>{project.projectCode}</code>
            )}
            {project.permanentProjectId && (
              <code className={pStyles.metaChip}>
                {project.permanentProjectId}
              </code>
            )}
            {project.city && (
              <span className={pStyles.metaChip}>📍 {project.city}</span>
            )}
            {priority && (
              <span
                className={pStyles.priorityChip}
                style={{ background: pColor.bg, color: pColor.color }}
              >
                {priority} PRIORITY
              </span>
            )}
          </div>
          {project.projectDetails && (
            <p className={pStyles.projDetails}>{project.projectDetails}</p>
          )}
        </div>

        <div className={pStyles.stripStatus}>
          <span className={pStyles.statusLabel}>Status</span>
          {/* <StatusBadge status={project.projectStatus} /> */}
          <button
            className={pStyles.viewBtn}
            onClick={() => navigate(`/projects/${project.projectId}`)}
          >
            Open Project ↗
          </button>
        </div>
      </div>

      {/* ── Three column grid ── */}
      <div className={pStyles.triGrid}>
        {/* Column 1 — Timeline */}
        {hasDates && (
          <div className={pStyles.triCard}>
            <div className={pStyles.triCardHead}>
              <span className={pStyles.triIcon}>◷</span>
              Timeline
            </div>
            <div className={pStyles.timelineList}>
              {project.projectCreatedDateTime && (
                <div className={pStyles.timelineRow}>
                  <div
                    className={pStyles.tlDot}
                    style={{ background: "#94a3b8" }}
                  />
                  <div>
                    <span className={pStyles.tlLabel}>Created</span>
                    <span className={pStyles.tlVal}>
                      {fmt(project.projectCreatedDateTime)}
                    </span>
                  </div>
                </div>
              )}
              {project.projectStartDateTime && (
                <div className={pStyles.timelineRow}>
                  <div
                    className={pStyles.tlDot}
                    style={{ background: "#3b82f6" }}
                  />
                  <div>
                    <span className={pStyles.tlLabel}>Started</span>
                    <span className={pStyles.tlVal}>
                      {fmt(project.projectStartDateTime)}
                    </span>
                  </div>
                </div>
              )}
              {project.projectExpectedEndDate && (
                <div className={pStyles.timelineRow}>
                  <div
                    className={pStyles.tlDot}
                    style={{ background: "#f59e0b" }}
                  />
                  <div>
                    <span className={pStyles.tlLabel}>Expected End</span>
                    <span className={pStyles.tlVal}>
                      {fmt(project.projectExpectedEndDate)}
                    </span>
                  </div>
                </div>
              )}
              {project.projectEndDateTime && (
                <div className={pStyles.timelineRow}>
                  <div
                    className={pStyles.tlDot}
                    style={{ background: "#10b981" }}
                  />
                  <div>
                    <span className={pStyles.tlLabel}>Completed</span>
                    <span className={pStyles.tlVal}>
                      {fmt(project.projectEndDateTime)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Column 2 — Area Metrics */}
        {hasArea && (
          <div className={pStyles.triCard}>
            <div className={pStyles.triCardHead}>
              <span className={pStyles.triIcon}>◻</span>
              Area Details
            </div>
            <div className={pStyles.areaGrid}>
              {project.plotArea != null && (
                <div
                  className={pStyles.areaTile}
                  style={{ "--tile-color": "#3b82f6" }}
                >
                  <span className={pStyles.areaVal}>{project.plotArea}</span>
                  <span className={pStyles.areaUnit}>sq.ft</span>
                  <span className={pStyles.areaLabel}>Plot Area</span>
                </div>
              )}
              {project.totalBuiltUpArea != null && (
                <div
                  className={pStyles.areaTile}
                  style={{ "--tile-color": "#8b5cf6" }}
                >
                  <span className={pStyles.areaVal}>
                    {project.totalBuiltUpArea}
                  </span>
                  <span className={pStyles.areaUnit}>sq.ft</span>
                  <span className={pStyles.areaLabel}>Built-Up Area</span>
                </div>
              )}
              {project.totalCarpetArea != null && (
                <div
                  className={pStyles.areaTile}
                  style={{ "--tile-color": "#10b981" }}
                >
                  <span className={pStyles.areaVal}>
                    {project.totalCarpetArea}
                  </span>
                  <span className={pStyles.areaUnit}>sq.ft</span>
                  <span className={pStyles.areaLabel}>Carpet Area</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Column 3 — Location */}
        {hasLocation && (
          <div className={pStyles.triCard}>
            <div className={pStyles.triCardHead}>
              <span className={pStyles.triIcon}>◈</span>
              Location
            </div>
            <div className={pStyles.locationBody}>
              {project.address && (
                <div className={pStyles.locRow}>
                  <span className={pStyles.locIcon}>📍</span>
                  <span className={pStyles.locVal}>{project.address}</span>
                </div>
              )}
              {project.city && (
                <div className={pStyles.locRow}>
                  <span className={pStyles.locIcon}>🏙</span>
                  <span className={pStyles.locVal}>{project.city}</span>
                </div>
              )}
              {project.latitude && project.longitude && (
                <div className={pStyles.locRow}>
                  <span className={pStyles.locIcon}>🌐</span>
                  <code className={pStyles.coords}>
                    {project.latitude?.toFixed(5)},{" "}
                    {project.longitude?.toFixed(5)}
                  </code>
                </div>
              )}
              {project.googlePlace && (
                <a
                  href={`https://maps.google.com/?q=${project.googlePlace}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={pStyles.mapsLink}
                >
                  Open in Google Maps ↗
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailSection;
