import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProject } from "../../api/hooks/useProject";
import styles from "./AddProject.module.scss";

const AddProject = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateProject();

  const [formData, setFormData] = useState({
    projectName: "",
    projectCode: "",
    projectDetails: "",
    priority: "MEDIUM",
    address: "",
    city: "",
    plotArea: "",
    totalBuiltUpArea: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.projectName.trim())
      newErrors.projectName = "Project name required";

    if (!formData.projectCode.trim())
      newErrors.projectCode = "Project code required";

    if (!formData.city.trim()) newErrors.city = "City required";

    if (!formData.address.trim()) newErrors.address = "Address required";

    if (!formData.plotArea) newErrors.plotArea = "Plot area required";

    if (!formData.totalBuiltUpArea)
      newErrors.totalBuiltUpArea = "Built-up area required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    mutate(
      {
        projectName: formData.projectName,
        projectCode: formData.projectCode,
        projectDetails: formData.projectDetails,
        priority: formData.priority,
        address: formData.address,
        city: formData.city,
        plotArea: Number(formData.plotArea),
        totalBuiltUpArea: Number(formData.totalBuiltUpArea),
      },
      {
        onSuccess: () => {
          navigate("/projects");
        },
      },
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.breadcrumb}>Projects &gt; Add Project</div>

      <div className={styles.pageTitle}>Create New Project</div>

      {/* BASIC INFO */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Basic Information</div>

        <div className={styles.gridTwo}>
          <div className={styles.formGroup}>
            <label>Project Name</label>
            <input
              value={formData.projectName}
              onChange={(e) => handleChange("projectName", e.target.value)}
            />
            {errors.projectName && (
              <span className={styles.error}>{errors.projectName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Project Code</label>
            <input
              value={formData.projectCode}
              onChange={(e) => handleChange("projectCode", e.target.value)}
            />
            {errors.projectCode && (
              <span className={styles.error}>{errors.projectCode}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
            >
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
              <option>CRITICAL</option>
            </select>
          </div>
        </div>
      </div>

      {/* LOCATION */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Location</div>

        <div className={styles.gridTwo}>
          <div className={styles.formGroup}>
            <label>Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            {errors.address && (
              <span className={styles.error}>{errors.address}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>City</label>
            <input
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
            {errors.city && <span className={styles.error}>{errors.city}</span>}
          </div>
        </div>
      </div>

      {/* AREA */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Area Information</div>

        <div className={styles.gridTwo}>
          <div className={styles.formGroup}>
            <label>Plot Area (sq.ft)</label>
            <input
              type="number"
              value={formData.plotArea}
              onChange={(e) => handleChange("plotArea", e.target.value)}
            />
            {errors.plotArea && (
              <span className={styles.error}>{errors.plotArea}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Total Built-up Area (sq.ft)</label>
            <input
              type="number"
              value={formData.totalBuiltUpArea}
              onChange={(e) => handleChange("totalBuiltUpArea", e.target.value)}
            />
            {errors.totalBuiltUpArea && (
              <span className={styles.error}>{errors.totalBuiltUpArea}</span>
            )}
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Project Details</div>

        <textarea
          value={formData.projectDetails}
          onChange={(e) => handleChange("projectDetails", e.target.value)}
        />
      </div>

      {/* ACTIONS */}
      <div className={styles.actionRow}>
        <button className={styles.secondaryBtn} onClick={() => navigate(-1)}>
          Cancel
        </button>

        <button
          className={styles.primaryBtn}
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Project"}
        </button>
      </div>
    </div>
  );
};

export default AddProject;
