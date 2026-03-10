import {
  usePreSalesList,
  useDeletePreSales,
  useUpdatePreSalesStatus,
} from "../../api/hooks/usePreSales";
import { useConvertToPostSales } from "../../api/hooks/usePostSales";
import styles from "./AllPreSales.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";

const AllPreSales = () => {
  const { data, isLoading, isError, error } = usePreSalesList();
  const navigate = useNavigate();
  const { mutate: deletePreSale } = useDeletePreSales();

  const { mutate } = useConvertToPostSales();

  const [editingStatus, setEditingStatus] = useState(null);

  const { mutate: updateStatus } = useUpdatePreSalesStatus();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openConvertModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };
  const handleConfirmConvert = () => {
    const loadingToast = showLoading("Converting to PostSales...");

    mutate(selectedId, {
      onSuccess: () => {
        dismissToast(loadingToast);
        showSuccess("Converted to PostSales successfully");
        setIsModalOpen(false);
      },
      onError: (error) => {
        console.log("ERROR OBJECT:", error);
        console.log("RESPONSE:", error?.response?.data);
        dismissToast(loadingToast);
        showError(error?.response?.data?.message || "Conversion failed");
      },
    });
  };
  const handleStatusChange = (srNumber, newStatus) => {
    const loadingToast = showLoading("Updating status...");
    updateStatus(
      { srNumber, status: newStatus },
      {
        onSuccess: () => {
          dismissToast(loadingToast);
          showSuccess("Status updated successfully");
          setEditingStatus(null);
        },
        onError: (error) => {
          dismissToast(loadingToast);
          showError(
            error?.response?.data?.message || "Failed to update status",
          );
        },
      },
    );
  };
  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loading}>Loading PreSales...</div>
      </div>
    );
  }

  if (isError) {
    console.log("ERROR OBJECT:", error);
    console.log("RESPONSE:", error?.response?.data);

    return (
      <div className={styles.pageWrapper}>
        <div className={styles.error}>Something went wrong.</div>
      </div>
    );
  }

  const handleEdit = (item) => {
    navigate(`/presales/edit/${item.srNumber}`);
  };
  return (
    <div className={styles.pageWrapper}>
      {/* <div className={styles.breadcrumb}>Pre-Sales &gt; All Pre-Sales</div> */}

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Pre-Sales List</h1>
      </div>

      {data?.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📄</div>
          <div className={styles.emptyTitle}>No PreSales Found</div>
          <div className={styles.emptyText}>
            Start by adding a new PreSales entry.
          </div>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Client</th>
                <th>Person</th>
                <th>Approached Via</th>
                <th>Status</th>
                <th>Date</th>
                <th>Convert </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((item, index) => (
                <tr key={item.srNumber}>
                  <td>{index + 1} </td>
                  <td>{item.client?.name}</td>
                  <td>{item.personName}</td>
                  <td>{item.approachedVia}</td>
                  <td>
                    <div className={styles.statusWrapper}>
                      <span
                        className={`${styles.badge} ${
                          item.status === "Onboarded"
                            ? styles.badgeSuccess
                            : styles.badgeDanger
                        }`}
                      >
                        {item.status}
                      </span>

                      {/* <button
                        className={styles.statusEditBtn}
                        onClick={() => setEditingStatus(item.srNumber)}
                      >
                        Change
                      </button> */}

                      {/* {editingStatus && (
                        <StatusChangeModal
                          currentStatus={
                            data?.find(
                              (item) => item.srNumber === editingStatus,
                            )?.status ?? ""
                          }
                          onCancel={() => setEditingStatus(null)}
                          onConfirm={(newStatus) => {
                            handleStatusChange(editingStatus, newStatus);
                            setEditingStatus(null);
                          }}
                        />
                      )} */}
                    </div>
                  </td>

                  <td>{new Date(item.dateTime).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={styles.convertBtn}
                      onClick={() => openConvertModal(item.srNumber)}
                    >
                      Convert
                    </button>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={() => {
                          if (window.confirm("Are you sure?")) {
                            deletePreSale(item.srNumber);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h3>Convert to PostSales</h3>

            <p>
              Are you sure you want to convert this PreSales into PostSales?
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className={styles.confirmBtn}
                onClick={handleConfirmConvert}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPreSales;

const StatusChangeModal = ({ currentStatus, onCancel, onConfirm }) => {
  const [selected, setSelected] = useState(currentStatus);

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.statusModal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.statusModalHeader}>
          <div className={styles.statusModalIcon}>🔄</div>
          <div>
            <h3 className={styles.statusModalTitle}>Change Status</h3>
            <p className={styles.statusModalSub}>
              Select a new status for this record
            </p>
          </div>
          <button className={styles.statusModalClose} onClick={onCancel}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Options */}
        <div className={styles.statusOptions}>
          {["Onboarded", "Not Onboarded"].map((opt) => (
            <button
              key={opt}
              className={`${styles.statusOption} ${selected === opt ? styles.statusOptionSelected : ""}`}
              onClick={() => setSelected(opt)}
            >
              <span className={styles.statusOptionRadio}>
                {selected === opt && (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <circle cx="5" cy="5" r="4" fill="currentColor" />
                  </svg>
                )}
              </span>
              <span className={styles.statusOptionLabel}>{opt}</span>
              {opt === "Onboarded" && (
                <span
                  className={styles.statusOptionBadge}
                  style={{ background: "#dcfce7", color: "#14532d" }}
                >
                  Active
                </span>
              )}
              {opt === "Not Onboarded" && (
                <span
                  className={styles.statusOptionBadge}
                  style={{ background: "#fef9c3", color: "#713f12" }}
                >
                  Pending
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.statusModalFooter}>
          <button className={styles.statusCancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.statusConfirmBtn}
            onClick={() => onConfirm(selected)}
            disabled={selected === currentStatus}
          >
            Apply Change
          </button>
        </div>
      </div>
    </div>
  );
};
