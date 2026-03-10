import { useState } from "react";
import styles from "./AddEmployeeToProjectPopup.module.scss";
import { useAddUsersToProject } from "../../api/hooks/useProject";

export default function AddEmployeeToProjectPopup({
  projectId,
  employees,
  onClose,
}) {
  const { mutate, isPending } = useAddUsersToProject();
  console.log(employees);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const filtered = employees.filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleSelect = (emp) => {
    if (selected.find((s) => s.id === emp.id)) {
      setSelected(selected.filter((s) => s.id !== emp.id));
    } else {
      setSelected([...selected, emp]);
    }
  };

  const handleAdd = () => {
    const userIds = selected.map((u) => u.id);

    mutate(
      { projectId, userIds },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Add Employees</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Search */}
        <input
          className={styles.search}
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Search Results */}
        <div className={styles.results}>
          {filtered.map((emp) => (
            <div
              key={emp.id}
              className={styles.resultItem}
              onClick={() => toggleSelect(emp)}
            >
              <span>{emp.name}</span>
              <span className={styles.email}>{emp.email}</span>
            </div>
          ))}
        </div>

        {/* Selected */}
        {selected.length > 0 && (
          <div className={styles.selected}>
            <h4>Selected</h4>

            <div className={styles.selectedList}>
              {selected.map((emp) => (
                <div key={emp.id} className={styles.selectedItem}>
                  {emp.name}

                  <button
                    onClick={() =>
                      setSelected(selected.filter((s) => s.id !== emp.id))
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className={styles.addBtn}
          onClick={handleAdd}
          disabled={!selected.length || isPending}
        >
          {isPending ? "Adding..." : "Add Employees"}
        </button>
      </div>
    </div>
  );
}
