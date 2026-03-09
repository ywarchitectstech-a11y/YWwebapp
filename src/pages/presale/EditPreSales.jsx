import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  usePreSalesList,
  useUpdatePreSales,
} from "../../api/hooks/usePreSales";
import styles from "./EditPreSales.module.scss";

const EditPreSales = () => {
  const { srNumber } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = usePreSalesList();
  const { mutate, isPending } = useUpdatePreSales();

  const [formData, setFormData] = useState({
    srNumber: "",
    clientName: "",
    personName: "",
    approachedVia: "",
    status: "",
    conclusion: "",
    dateTime: "",
  });

  useEffect(() => {
    if (data) {
      const current = data.find((item) => item.srNumber === Number(srNumber));

      if (current) {
        setFormData({
          srNumber: current.srNumber,
          clientName: current.client?.name,
          personName: current.personName,
          approachedVia: current.approachedVia,
          status: current.status,
          conclusion: current.conclusion,
          dateTime: current.dateTime,
        });
      }
    }
  }, [data, srNumber]);

  const handleUpdate = () => {
    mutate(
      {
        srNumber: formData.srNumber,
        personName: formData.personName,
        approachedVia: formData.approachedVia,
        status: formData.status,
        conclusion: formData.conclusion,
      },
      {
        onSuccess: () => {
          navigate("/presales/allpresales");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.breadcrumb}>Pre-Sales &gt; Edit Pre-Sale</div>

      <div className={styles.pageTitle}>Edit Pre-Sales Entry</div>

      {/* CLIENT INFO (READ ONLY) */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Client Information</div>

        <div className={styles.gridTwo}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Client Name</label>
            <input
              className={styles.input}
              value={formData.clientName}
              disabled
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Created Date</label>
            <input
              className={styles.input}
              value={
                formData.dateTime
                  ? new Date(formData.dateTime).toLocaleString()
                  : ""
              }
              disabled
            />
          </div>
        </div>
      </div>

      {/* PRE-SALES DETAILS */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Pre-Sales Details</div>

        <div className={styles.gridTwo}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Person Name</label>
            <input
              className={styles.input}
              value={formData.personName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personName: e.target.value,
                })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Approached Via</label>
            <select
              className={styles.input}
              value={formData.approachedVia}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  approachedVia: e.target.value,
                })
              }
            >
              <option value="Call">Call</option>
              <option value="Meeting">Meeting</option>
              <option value="Reference">Reference</option>
              <option value="Website">Website</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.input}
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                })
              }
            >
              <option value="NEW">NEW</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup} style={{ marginTop: 16 }}>
          <label className={styles.label}>Conclusion</label>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            value={formData.conclusion}
            onChange={(e) =>
              setFormData({
                ...formData,
                conclusion: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className={styles.actionRow}>
        <button className={styles.buttonSecondary} onClick={() => navigate(-1)}>
          Cancel
        </button>

        <button
          className={styles.buttonPrimary}
          onClick={handleUpdate}
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default EditPreSales;
