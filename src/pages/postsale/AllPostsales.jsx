import { useState } from "react";
import { usePostSalesList } from "../../api/hooks/usePostSales";
import styles from "./AllPostSales.module.scss";
import { useNavigate } from "react-router-dom";
const AllPostSales = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const size = 10;

  const { data, isLoading, isError } = usePostSalesList(page, size);
  console.log(data);
  const handleNext = () => {
    if (data?.length === size) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.PostSalesPage}>
        <div className={styles.loading}>Loading PostSales...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.PostSalesPage}>
        <div className={styles.error}>Failed to load PostSales.</div>
      </div>
    );
  }
  if (data == null) {
    return <div>No Postsales </div>;
  }
  return (
    <div className={styles.PostSalesPage}>
      <div className={styles.breadcrumb}>Sales &gt; Post-Sales</div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Post-Sales List</h1>
      </div>

      {data?.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📄</div>
          <div className={styles.emptyTitle}>No PostSales Found</div>
          <div className={styles.emptyText}>
            Converted PreSales will appear here.
          </div>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id}>
                    <td>{page * size + index + 1}</td>
                    <td>{item.client?.name}</td>
                    <td>{item.projectName || "-"}</td>
                    <td>
                      <span className={`${styles.badge}`}>{item.status}</span>
                    </td>
                    <td>
                      {item.dateTime
                        ? new Date(item.dateTime).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      {" "}
                      <button
                        className={styles.viewBtn}
                        onClick={() => navigate(`/postsales/view/${item.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button onClick={handlePrev} disabled={page === 0}>
              Prev
            </button>

            <span>Page {page + 1}</span>

            <button onClick={handleNext} disabled={data.length < size}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllPostSales;
