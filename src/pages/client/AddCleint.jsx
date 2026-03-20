import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateClient } from "../../api/hooks/useClient";
import styles from "./AddClientPage.module.scss";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";

const AddClient = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    GSTCertificate: "",
    PAN: "",
    password: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const loadingToast = showLoading("Updating client...");

    mutate(formData, {
      onSuccess: (res) => {
        dismissToast(loadingToast);

        showSuccess(res?.data?.message || "Client updated successfully");

        setTimeout(() => {
          navigate("/clients/allclients");
        }, 600);
      },

      onError: (error) => {
        dismissToast(loadingToast);

        showError(error?.response?.data?.message || "Failed to update client");
      },
    });
  };

  return (
    <div className={styles.pageWrapper}>
      {/* <div className={styles.breadcrumb}>Clients &gt; Add Client</div> */}

      <div className={styles.pageTitle}>Create New Client</div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Client Information</div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Client Name</label>
            <input
              className={styles.input}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
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
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="text"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone</label>
            <input
              className={styles.input}
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Address</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>GST Certificate</label>
            <input
              className={styles.input}
              value={formData.GSTCertificate}
              onChange={(e) => handleChange("GSTCertificate", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>PAN</label>
            <input
              className={styles.input}
              value={formData.PAN}
              onChange={(e) => handleChange("PAN", e.target.value)}
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
          {isPending ? "Creating..." : "Create Client"}
        </button>
      </div>
    </div>
  );
};

export default AddClient;
