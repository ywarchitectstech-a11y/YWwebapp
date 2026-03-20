// import { useState } from "react";
// import { usePostSalesList } from "../../api/hooks/usePostSales";
// import styles from "./AllPostSales.module.scss";
// import { useNavigate } from "react-router-dom";
// const AllPostSales = () => {
//   const navigate = useNavigate();
//   const [page, setPage] = useState(0);
//   const size = 10;

//   const { data, isLoading, isError } = usePostSalesList(page, size);
//   console.log(data);
//   const handleNext = () => {
//     if (data?.length === size) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (page > 0) {
//       setPage((prev) => prev - 1);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className={styles.PostSalesPage}>
//         <div className={styles.loading}>Loading PostSales...</div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className={styles.PostSalesPage}>
//         <div className={styles.error}>Failed to load PostSales.</div>
//       </div>
//     );
//   }
//   if (data == null) {
//     return <div>No Postsales </div>;
//   }
//   return (
//     <div className={styles.PostSalesPage}>
//       {/* <div className={styles.breadcrumb}>Sales &gt; Project</div> */}

//       <div className={styles.pageHeader}>
//         <h1 className={styles.pageTitle}>Project List</h1>
//       </div>

//       {data?.length === 0 ? (
//         <div className={styles.emptyState}>
//           <div className={styles.emptyIcon}>📄</div>
//           <div className={styles.emptyTitle}>No PostSales Found</div>
//           <div className={styles.emptyText}>
//             Converted PreSales will appear here.
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className={styles.tableWrapper}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   {/* <th>ID</th> */}
//                   <th>Client</th>
//                   <th>Phone</th>
//                   <th>Project</th>
//                   <th>Project Status</th>
//                   <th>Sale Status</th>
//                   <th>Notified</th>
//                   <th>Proforma</th>
//                   <th>Tax</th>
//                   <th>Payments</th>
//                   <th>Date</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {data.map((item, index) => {
//                   const paymentTotal =
//                     item.taxInvoices?.reduce(
//                       (sum, inv) =>
//                         sum +
//                         (inv.payments?.reduce(
//                           (pSum, p) => pSum + Number(p.amountPaid || 0),
//                           0,
//                         ) || 0),
//                       0,
//                     ) || 0;

//                   return (
//                     <tr key={item.id}>
//                       <td>{page * size + index + 1}</td>

//                       {/* <td>#{item.id}</td> */}

//                       <td>{item.client?.name || "—"}</td>

//                       <td>{item.client?.phone || "—"}</td>

//                       <td>
//                         {item.project?.projectName ||
//                           `Project #${item.project?.projectId}`}
//                       </td>

//                       <td>{item.project?.projectStatus || "—"}</td>

//                       <td>
//                         <span className={styles.badge}>
//                           {item.postSalesStatus || "—"}
//                         </span>
//                       </td>

//                       <td>
//                         {item.notified ? (
//                           <span className={styles.yes}>✓ Yes</span>
//                         ) : (
//                           <span className={styles.no}>No</span>
//                         )}
//                       </td>

//                       <td>{item.proformaInvoices?.length || 0}</td>

//                       <td>{item.taxInvoices?.length || 0}</td>

//                       <td>₹{paymentTotal.toLocaleString("en-IN")}</td>

//                       <td>
//                         {item.postSalesdateTime
//                           ? new Date(
//                               item.postSalesdateTime,
//                             ).toLocaleDateString()
//                           : "—"}
//                       </td>

//                       <td>
//                         <button
//                           className={styles.viewBtn}
//                           onClick={() => navigate(`/postsales/view/${item.id}`)}
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className={styles.pagination}>
//             <button onClick={handlePrev} disabled={page === 0}>
//               Prev
//             </button>

//             <span>Page {page + 1}</span>

//             <button onClick={handleNext} disabled={data.length < size}>
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AllPostSales;

import { useState } from "react";
import {
  usePostSalesList,
  usePostSalesByClient,
} from "../../api/hooks/usePostSales";
import styles from "./AllPostSales.module.scss";
import { useNavigate } from "react-router-dom";

const AllPostSales = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const size = 10;

  const user = JSON.parse(localStorage.getItem("user"));
  const clientId = user?.userId;
  const role = user?.role;

  // Admin / Employee API
  const {
    data: allProjects,
    isLoading: allLoading,
    isError: allError,
  } = usePostSalesList(page, size, {
    enabled: role !== "CLIENT",
  });

  // Client API
  const {
    data: clientProjects,
    isLoading: clientLoading,
    isError: clientError,
  } = usePostSalesByClient(clientId, page, size, {
    enabled: role === "CLIENT",
  });
  console.log(clientProjects);

  // Choose correct dataset
  const data = role === "CLIENT" ? clientProjects : allProjects;
  const isLoading = role === "CLIENT" ? clientLoading : allLoading;
  const isError = role === "CLIENT" ? clientError : allError;

  // Pagination
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
        <div className={styles.loading}>Loading Projects...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.PostSalesPage}>
        <div className={styles.error}>Failed to load Projects.</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.PostSalesPage}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📄</div>
          <div className={styles.emptyTitle}>No Projects Found</div>
          <div className={styles.emptyText}>
            Converted PreSales will appear here.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.PostSalesPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Project List</h1>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Phone</th>
              <th>Project</th>
              <th>Project Status</th>
              <th>Sale Status</th>
              <th>Notified</th>
              <th>Proforma</th>
              <th>Tax</th>
              <th>Payments</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => {
              const paymentTotal =
                item.taxInvoices?.reduce(
                  (sum, inv) =>
                    sum +
                    (inv.payments?.reduce(
                      (pSum, p) => pSum + Number(p.amountPaid || 0),
                      0,
                    ) || 0),
                  0,
                ) || 0;

              return (
                <tr key={item.id}>
                  <td>{page * size + index + 1}</td>

                  <td>{item.client?.name || "—"}</td>

                  <td>{item.client?.phone || "—"}</td>

                  <td>
                    {item.project?.projectName ||
                      `Project #${item.project?.projectId}`}
                  </td>

                  <td>{item.project?.projectStatus || "—"}</td>

                  <td>
                    <span className={styles.badge}>
                      {item.postSalesStatus || "—"}
                    </span>
                  </td>

                  <td>
                    {item.notified ? (
                      <span className={styles.yes}>✓ Yes</span>
                    ) : (
                      <span className={styles.no}>No</span>
                    )}
                  </td>

                  <td>{item.proformaInvoices?.length || 0}</td>

                  <td>{item.taxInvoices?.length || 0}</td>

                  <td>₹{paymentTotal.toLocaleString("en-IN")}</td>

                  <td>
                    {item.postSalesdateTime
                      ? new Date(item.postSalesdateTime).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => navigate(`/postsales/view/${item.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination only for Admin/Employee */}
      {role !== "CLIENT" && (
        <div className={styles.pagination}>
          <button onClick={handlePrev} disabled={page === 0}>
            Prev
          </button>

          <span>Page {page + 1}</span>

          <button onClick={handleNext} disabled={data.length < size}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllPostSales;
