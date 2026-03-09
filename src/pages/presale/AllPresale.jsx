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
    updateStatus(
      { srNumber, status: newStatus },
      {
        onSuccess: () => {
          setEditingStatus(null);
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
      <div className={styles.breadcrumb}>Pre-Sales &gt; All Pre-Sales</div>

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

                      <button
                        className={styles.statusEditBtn}
                        onClick={() => setEditingStatus(item.srNumber)}
                      >
                        Change
                      </button>

                      {editingStatus === item.srNumber && (
                        <select
                          className={styles.statusDropdown}
                          defaultValue={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.srNumber, e.target.value)
                          }
                        >
                          <option value="Onboarded">Onboarded</option>
                          <option value="Not Onboarded">Not Onboarded</option>
                        </select>
                      )}
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
