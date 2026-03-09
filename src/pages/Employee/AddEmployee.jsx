import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateEmployee } from "../../api/hooks/useEmployees";
import styles from "./AddEmployeePage.module.scss";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateEmployee();

  const [formData, setFormData] = useState({
    firstName: "",
    // secondName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    birthDate: "",
    gender: "",
    bloodGroup: "",
    joinDate: "",
    adharNumber: "",
    panNumber: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const loadingToast = showLoading("Creating employee...");

    mutate(formData, {
      onSuccess: (res) => {
        dismissToast(loadingToast);

        showSuccess(res?.data?.message || "Employee created successfully");

        setTimeout(() => {
          navigate("/employees/all");
        }, 600);
      },

      onError: (error) => {
        dismissToast(loadingToast);

        showError(
          error?.response?.data?.message || "Failed to create employee",
        );
      },
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.breadcrumb}>Employees &gt; Add Employee</div>

      <div className={styles.pageTitle}>Create New Employee</div>

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
          {/* 
          <div className={styles.formGroup}>
            <label className={styles.label}>Second Name</label>
            <input
              className={styles.input}
              value={formData.secondName}
              onChange={(e) => handleChange("secondName", e.target.value)}
            />
          </div> */}

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
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
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
              <option value="CO_FOUNDER">Co-Founder</option>
              <option value="SR_ARCHITECT">Sr. Architect</option>
              <option value="JR_ARCHITECT">Jr. Architect</option>
              <option value="SR_ENGINEER">Sr. Engineer</option>
              <option value="DRAFTSMAN">Draftsman</option>
              <option value="LIAISON_MANAGER">Liaison Manager</option>
              <option value="LIAISON_OFFICER">Liaison Officer</option>
              <option value="LIAISON_ASSISTANT">Liaison Assistant</option>
              <option value="HR">HR</option>
              <option value="ADMIN">Admin</option>
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

            <select
              className={styles.input}
              value={formData.bloodGroup}
              onChange={(e) => handleChange("bloodGroup", e.target.value)}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
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
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Employee"}
        </button>
      </div>
    </div>
  );
};

export default AddEmployee;
