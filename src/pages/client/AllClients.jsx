import { Link, useNavigate } from "react-router-dom";
import { useClientList, useDeleteClient } from "../../api/hooks/useClient";
import styles from "./AllClientsPage.module.scss";

const DEFAULT_IMAGE =
  "https://i.pinimg.com/222x/8a/e9/e9/8ae9e92fa4e69967aa61bf2bda967b7b.jpg";

const AllClientsPage = () => {
  const navigate = useNavigate();

  const { data: clients, isLoading } = useClientList();
  const { mutate: deleteClient } = useDeleteClient();
  console.log(clients);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?",
    );

    if (confirmDelete) {
      deleteClient(id);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loading}>Loading Clients...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>Sales &gt; Clients</div>

      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>All Clients</h1>

        <Link to="/clients/add" className={styles.addButton}>
          + Add Client
        </Link>
      </div>

      {/* Cards */}
      <div className={styles.clientGrid}>
        {clients?.map((client) => (
          <div key={client.id} className={styles.clientCard}>
            {console.log(client)}
            {/* Profile Image */}
            <div className={styles.profileSection}>
              <img
                src={client.image ? client.image : DEFAULT_IMAGE}
                alt="client"
                className={styles.profileImage}
              />
            </div>

            {/* Info */}
            <div className={styles.clientInfo}>
              <div className={styles.clientName}>
                {client.clientName || client.name}
              </div>

              <div className={styles.clientSub}>
                {client.email || "No Email"}
              </div>

              <div className={styles.clientSub}>
                {client.phone || "No Phone"}
              </div>
            </div>

            {/* Actions */}
            <div className={styles.cardActions}>
              <button
                className={styles.editBtn}
                onClick={() => navigate(`/clients/update/${client.id}`)}
              >
                Edit
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(client.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllClientsPage;
