import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEmployeeById,
  useUpdateEmployee,
} from "../../api/hooks/useEmployees";
import styles from "./EditEmployeePage.module.scss";

import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useEmployeeById(id);
  const { mutate, isPending } = useUpdateEmployee();

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    birthDate: "",
    gender: "",
    bloodGroup: "",
    joinDate: "",
    adharNumber: "",
    panNumber: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        firstName: data.firstName || "",
        secondName: data.secondName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "",
        birthDate: data.birthDate || "",
        gender: data.gender || "",
        bloodGroup: data.bloodGroup || "",
        joinDate: data.joinDate || "",
        adharNumber: data.adharNumber || "",
        panNumber: data.panNumber || "",
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdate = () => {
    const loadingToast = showLoading("Updating employee...");

    mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          dismissToast(loadingToast);
          showSuccess("Employee updated successfully");

          setTimeout(() => {
            navigate("/employees/all");
          }, 600);
        },
        onError: (error) => {
          dismissToast(loadingToast);
          showError(error?.response?.data?.message || "Update failed");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loading}>Loading employee...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.breadcrumb}>Employees &gt; Edit Employee</div>

      <div className={styles.pageTitle}>Edit Employee</div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Employee Information</div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>First Name</label>
            <input
              className={styles.input}
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Second Name</label>
            <input
              className={styles.input}
              value={formData.secondName}
              onChange={(e) => handleChange("secondName", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Last Name</label>
            <input
              className={styles.input}
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Phone</label>
            <input
              className={styles.input}
              type="number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Role</label>
            <select
              className={styles.input}
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="ARCHITECT">Architect</option>
              <option value="ENGINEER">Engineer</option>
              <option value="SITE_MANAGER">Site Manager</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Join Date</label>
            <input
              className={styles.input}
              type="date"
              value={formData.joinDate}
              onChange={(e) => handleChange("joinDate", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Birth Date</label>
            <input
              className={styles.input}
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Gender</label>
            <select
              className={styles.input}
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Blood Group</label>
            <input
              className={styles.input}
              value={formData.bloodGroup}
              onChange={(e) => handleChange("bloodGroup", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Aadhar Number</label>
            <input
              className={styles.input}
              value={formData.adharNumber}
              onChange={(e) => handleChange("adharNumber", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>PAN Number</label>
            <input
              className={styles.input}
              value={formData.panNumber}
              onChange={(e) => handleChange("panNumber", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.actionRow}>
        <button className={styles.buttonSecondary} onClick={() => navigate(-1)}>
          Cancel
        </button>

        <button
          className={styles.buttonPrimary}
          onClick={handleUpdate}
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update Employee"}
        </button>
      </div>
    </div>
  );
};

export default EditEmployee;
