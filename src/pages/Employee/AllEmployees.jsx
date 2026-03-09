import {
  useEmployeeList,
  useDeleteEmployee,
  useActivateEmployee,
} from "../../api/hooks/useEmployees";
import styles from "./AllEmployees.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";

// ── Icons ─────────────────────────────────────────────────────
const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ViewIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ToggleIcon = ({ active }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {active ? (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="10" y1="15" x2="10" y2="9" />
        <line x1="14" y1="15" x2="14" y2="9" />
      </>
    ) : (
      <>
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </>
    )}
  </svg>
);

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────
const formatRole = (role) =>
  role
    ?.replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "—";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

// ── View Detail Modal ─────────────────────────────────────────
const ViewModal = ({ emp, onClose }) => {
  if (!emp) return null;
  const isActive = emp.status === "ACTIVE";

  const sections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Employee ID", value: emp.id },
        { label: "First Name", value: emp.firstName || "—" },
        { label: "Middle Name", value: emp.secondName || "—" },
        { label: "Last Name", value: emp.lastName || "—" },
        {
          label: "Gender",
          value: emp.gender
            ? emp.gender.charAt(0) + emp.gender.slice(1).toLowerCase()
            : "—",
        },
        { label: "Blood Group", value: emp.bloodGroup?.toUpperCase() || "—" },
        { label: "Birth Date", value: fmtDate(emp.birthDate) },
      ],
    },
    {
      title: "Contact",
      fields: [
        { label: "Email", value: emp.email || "—" },
        { label: "Phone", value: emp.phone || "—" },
      ],
    },
    {
      title: "Employment",
      fields: [
        { label: "Role", value: formatRole(emp.role) },
        { label: "Status", value: emp.status, isStatus: true },
        { label: "Join Date", value: fmtDate(emp.joinDate) },
        { label: "Leave Date", value: fmtDate(emp.leaveDate) },
        {
          label: "Projects",
          value:
            emp.projects?.length > 0
              ? emp.projects.join(", ")
              : "No projects assigned",
        },
      ],
    },
    {
      title: "Identity Documents",
      fields: [
        { label: "Aadhar Number", value: emp.adharNumber || "—" },
        { label: "PAN Number", value: emp.panNumber || "—" },
      ],
    },
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.viewModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.viewModalHeader}>
          <div className={styles.viewModalMeta}>
            <h2 className={styles.viewModalName}>
              {[emp.firstName, emp.secondName, emp.lastName]
                .filter(Boolean)
                .join(" ")}
            </h2>
            <span className={styles.viewModalRole}>{formatRole(emp.role)}</span>
            <span
              className={`${styles.statusPill} ${isActive ? styles.active : styles.inactive}`}
            >
              {emp.status}
            </span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.viewModalBody}>
          {sections.map((section) => (
            <div key={section.title} className={styles.viewSection}>
              <div className={styles.viewSectionTitle}>{section.title}</div>
              <div className={styles.viewModalGrid}>
                {section.fields.map(({ label, value, isStatus }) => (
                  <div key={label} className={styles.viewField}>
                    <span className={styles.viewFieldLabel}>{label}</span>
                    {isStatus ? (
                      <span
                        className={`${styles.statusPill} ${value === "ACTIVE" ? styles.active : styles.inactive}`}
                      >
                        {value}
                      </span>
                    ) : (
                      <span className={styles.viewFieldValue}>{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Delete Confirm Modal ──────────────────────────────────────
const DeleteModal = ({ onCancel, onConfirm }) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modalBox}>
      <div className={styles.modalIcon}>🗑️</div>
      <h3 className={styles.modalTitle}>Delete Employee</h3>
      <p className={styles.modalText}>
        This action cannot be undone. Are you sure you want to permanently
        delete this employee?
      </p>
      <div className={styles.modalActions}>
        <button className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.confirmBtn} onClick={onConfirm}>
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

// ── Toggle Status Confirm Modal ───────────────────────────────
const ToggleModal = ({ emp, onCancel, onConfirm }) => {
  const isActive = emp?.status === "ACTIVE";
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalIcon}>{isActive ? "⏸️" : "▶️"}</div>
        <h3 className={styles.modalTitle}>
          {isActive ? "Deactivate Employee" : "Activate Employee"}
        </h3>
        <p className={styles.modalText}>
          {isActive
            ? "This will mark the employee as Inactive. They will lose system access."
            : "This will mark the employee as Active again."}
        </p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={isActive ? styles.confirmBtn : styles.activateBtn}
            onClick={onConfirm}
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────
const AllEmployees = () => {
  const { data, isLoading, isError } = useEmployeeList();
  const { mutate: deleteEmployee } = useDeleteEmployee();
  const { mutate: activateEmployee } = useActivateEmployee();
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [toggleModal, setToggleModal] = useState({ open: false, emp: null });
  const [viewEmployee, setViewEmployee] = useState(null);

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = () => {
    const loadingToast = showLoading("Deleting employee...");
    deleteEmployee(deleteModal.id, {
      onSuccess: () => {
        dismissToast(loadingToast);
        showSuccess("Employee deleted successfully");
        setDeleteModal({ open: false, id: null });
      },
      onError: (error) => {
        dismissToast(loadingToast);
        showError(error?.response?.data?.message || "Delete failed");
      },
    });
  };

  // ── Toggle Active / Inactive ──────────────────────────────
  // Deactivate  → deleteEmployee(id)
  // Activate    → activateEmployee(id)
  const handleToggleStatus = () => {
    const emp = toggleModal.emp;
    const isActive = emp.status === "ACTIVE";

    if (isActive) {
      const loadingToast = showLoading("Deactivating employee...");
      deleteEmployee(emp.id, {
        onSuccess: () => {
          dismissToast(loadingToast);
          showSuccess("Employee deactivated successfully");
          setToggleModal({ open: false, emp: null });
        },
        onError: (error) => {
          dismissToast(loadingToast);
          showError(error?.response?.data?.message || "Deactivation failed");
        },
      });
    } else {
      const loadingToast = showLoading("Activating employee...");
      activateEmployee(emp.id, {
        onSuccess: () => {
          dismissToast(loadingToast);
          showSuccess("Employee activated successfully");
          setToggleModal({ open: false, emp: null });
        },
        onError: (error) => {
          dismissToast(loadingToast);
          showError(error?.response?.data?.message || "Activation failed");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.stateBox}>
          <div className={styles.spinner} />
          <span>Loading employees…</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.stateBox}>
          <span className={styles.errorText}>⚠ Failed to load employees.</span>
        </div>
      </div>
    );
  }

  const employees = data ?? [];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.breadcrumb}>Employees &gt; All Employees</div>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Employees List</h1>
          <p className={styles.pageSubtitle}>
            {employees.length} total members
          </p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => navigate("/employees/add")}
        >
          + Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>👨‍💼</div>
          <div className={styles.emptyTitle}>No Employees Found</div>
          <div className={styles.emptyText}>
            Start by adding a new employee.
          </div>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          {/* Desktop Table */}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => {
                const isActive = emp.status === "ACTIVE";
                return (
                  <tr
                    key={emp.id}
                    className={!isActive ? styles.inactiveRow : ""}
                  >
                    <td className={styles.indexCell}>{index + 1}</td>
                    <td>
                      <span>
                        {emp.firstName} {emp.lastName}
                      </span>
                    </td>
                    <td className={styles.emailCell}>{emp.email}</td>
                    <td>{emp.phone || "—"}</td>
                    <td>
                      <span className={styles.roleChip}>
                        {formatRole(emp.role)}
                      </span>
                    </td>
                    <td>{fmtDate(emp.joinDate)}</td>
                    <td>
                      <span
                        className={`${styles.statusPill} ${isActive ? styles.active : styles.inactive}`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.viewBtn}
                          onClick={() => setViewEmployee(emp)}
                          title="View details"
                        >
                          <ViewIcon />
                          <span>View</span>
                        </button>
                        <button
                          className={styles.editBtn}
                          onClick={() => navigate(`/employees/edit/${emp.id}`)}
                          title="Edit employee"
                        >
                          <EditIcon />
                          <span>Edit</span>
                        </button>
                        <button
                          className={
                            isActive ? styles.deactivateBtn : styles.activateBtn
                          }
                          onClick={() => setToggleModal({ open: true, emp })}
                          title={isActive ? "Deactivate" : "Activate"}
                        >
                          <ToggleIcon active={isActive} />
                          <span>{isActive ? "Deactivate" : "Activate"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className={styles.mobileCards}>
            {employees.map((emp) => {
              const isActive = emp.status === "ACTIVE";
              return (
                <div
                  key={emp.id}
                  className={`${styles.mobileCard} ${!isActive ? styles.inactiveCard : ""}`}
                >
                  <div className={styles.mobileCardHeader}>
                    <div className={styles.mobileCardMeta}>
                      <strong>
                        {emp.firstName} {emp.lastName}
                      </strong>
                      <span className={styles.roleChip}>
                        {formatRole(emp.role)}
                      </span>
                    </div>
                    <span
                      className={`${styles.statusPill} ${isActive ? styles.active : styles.inactive}`}
                    >
                      {emp.status}
                    </span>
                  </div>
                  <div className={styles.mobileCardBody}>
                    <span>{emp.email}</span>
                    <span>{emp.phone || "—"}</span>
                  </div>
                  <div className={styles.mobileCardActions}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => setViewEmployee(emp)}
                    >
                      <ViewIcon /> View
                    </button>
                    <button
                      className={styles.editBtn}
                      onClick={() => navigate(`/employees/edit/${emp.id}`)}
                    >
                      <EditIcon /> Edit
                    </button>
                    <button
                      className={
                        isActive ? styles.deactivateBtn : styles.activateBtn
                      }
                      onClick={() => setToggleModal({ open: true, emp })}
                    >
                      <ToggleIcon active={isActive} />
                      {isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewEmployee && (
        <ViewModal emp={viewEmployee} onClose={() => setViewEmployee(null)} />
      )}

      {deleteModal.open && (
        <DeleteModal
          onCancel={() => setDeleteModal({ open: false, id: null })}
          onConfirm={handleDelete}
        />
      )}

      {toggleModal.open && (
        <ToggleModal
          emp={toggleModal.emp}
          onCancel={() => setToggleModal({ open: false, emp: null })}
          onConfirm={handleToggleStatus}
        />
      )}
    </div>
  );
};

export default AllEmployees;
