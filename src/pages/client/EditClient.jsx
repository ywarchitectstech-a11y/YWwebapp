import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClientById, useUpdateClient } from "../../api/hooks/useClient";
import styles from "./EditClient.module.scss";

const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useClientById(id);
  const { mutate, isPending } = useUpdateClient();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    GSTCertificate: "",
    PAN: "",
  });

  const [errors, setErrors] = useState({});

  /* ===============================
     LOAD PREVIOUS DATA PROPERLY
  =============================== */

  useEffect(() => {
    if (!data) return;

    setFormData({
      id: data.id ?? "",
      name: data.clientName ?? data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      address: data.address ?? "",
      GSTCertificate: data.GSTCertificate ?? "",
      PAN: data.PAN ?? "",
    });
  }, [data]);

  /* ===============================
     VALIDATION
  =============================== */

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Client name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (
      formData.GSTCertificate &&
      !/^[0-9A-Z]{15}$/.test(formData.GSTCertificate)
    ) {
      newErrors.GSTCertificate = "Invalid GST format";
    }

    if (formData.PAN && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.PAN)) {
      newErrors.PAN = "Invalid PAN format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ===============================
     INPUT HANDLER
  =============================== */

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ===============================
     SUBMIT
  =============================== */

  const handleSubmit = () => {
    if (!validate()) return;

    mutate(
      {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        GSTCertificate: formData.GSTCertificate,
        PAN: formData.PAN,
      },
      {
        onSuccess: () => {
          navigate("/clients/allclients");
        },
      },
    );
  };

  /* ===============================
     LOADING / ERROR
  =============================== */

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loading}>Loading Client Data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.error}>Failed to load client.</div>
      </div>
    );
  }

  /* ===============================
     UI
  =============================== */

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.breadcrumb}>Clients &gt; Edit Client</div>

      <div className={styles.pageTitle}>Edit Client</div>

      <div className={styles.card}>
        <div className={styles.formGrid}>
          {/* CLIENT NAME */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Client Name</label>
            <input
              className={`${styles.input} ${
                errors.name ? styles.errorInput : ""
              }`}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            {errors.name && (
              <span className={styles.errorText}>{errors.name}</span>
            )}
          </div>

          {/* EMAIL */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={`${styles.input} ${
                errors.email ? styles.errorInput : ""
              }`}
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          {/* PHONE */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone</label>
            <input
              type="tel"
              className={`${styles.input} ${
                errors.phone ? styles.errorInput : ""
              }`}
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            {errors.phone && (
              <span className={styles.errorText}>{errors.phone}</span>
            )}
          </div>

          {/* GST */}
          <div className={styles.formGroup}>
            <label className={styles.label}>GST Certificate</label>
            <input
              className={`${styles.input} ${
                errors.GSTCertificate ? styles.errorInput : ""
              }`}
              value={formData.GSTCertificate}
              onChange={(e) =>
                handleChange("GSTCertificate", e.target.value.toUpperCase())
              }
            />
            {errors.GSTCertificate && (
              <span className={styles.errorText}>{errors.GSTCertificate}</span>
            )}
          </div>

          {/* PAN */}
          <div className={styles.formGroup}>
            <label className={styles.label}>PAN</label>
            <input
              className={`${styles.input} ${
                errors.PAN ? styles.errorInput : ""
              }`}
              value={formData.PAN}
              onChange={(e) =>
                handleChange("PAN", e.target.value.toUpperCase())
              }
            />
            {errors.PAN && (
              <span className={styles.errorText}>{errors.PAN}</span>
            )}
          </div>

          {/* ADDRESS */}
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Address</label>
            <textarea
              className={styles.input}
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className={styles.actionRow}>
        <button className={styles.buttonSecondary} onClick={() => navigate(-1)}>
          Cancel
        </button>

        <button
          className={styles.buttonPrimary}
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update Client"}
        </button>
      </div>
    </div>
  );
};

export default EditClient;
