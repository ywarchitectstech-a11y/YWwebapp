import { useState } from "react";
import { useCreatePreSales } from "../../api/hooks/usePreSales";
import styles from "./AddPreSales.module.scss";
import { useNavigate } from "react-router-dom";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";
import { useClientList } from "../../api/hooks/useClient";

const PreSalesPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreatePreSales();
  const [clientSearch, setClientSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExistingClient, setIsExistingClient] = useState(false);
  const { data: clients = [] } = useClientList();
  const filteredClients = clients.filter((c) =>
    c.name?.toLowerCase().includes(clientSearch.toLowerCase()),
  );
  const [formData, setFormData] = useState({
    client: {},
    personName: "",
    approachedVia: "",
    // status: "NEW",
    conclusion: "",
    quotations: [],
  });

  /* ===============================
     HANDLERS
  =============================== */

  const handleClientChange = (field, value) => {
    setFormData({
      ...formData,
      client: {
        ...formData.client,
        [field]: value,
      },
    });
  };

  const handleQuotationChange = (index, field, value) => {
    const updated = [...formData.quotations];
    updated[index][field] = value;
    setFormData({ ...formData, quotations: updated });
  };

  const addQuotation = () => {
    setFormData({
      ...formData,
      quotations: [
        ...formData.quotations,
        {
          quotationNumber: "",
          quotationDetails: "",
          sended: false,
          accepted: false,
        },
      ],
    });
  };

  // const handleSubmit = () => {
  //   const payload = {
  //     ...formData,
  //   };
  //   console.log(payload);

  //   mutate(
  //     {
  //       data: payload,
  //       existingClient: isExistingClient,
  //     },
  //     {
  //       onSuccess: () => {
  //         alert("PreSales Created Successfully");
  //         setFormData({
  //           client: {},
  //           personName: "",
  //           approachedVia: "",
  //           // status: "NEW",
  //           conclusion: "",
  //           quotations: [],
  //         });
  //       },
  //       onError: (error) => {
  //         console.log("FULL ERROR:", error);
  //         console.log("RESPONSE:", error.response?.data);
  //         alert(error.response?.data?.message || "Something went wrong");
  //       },
  //     },
  //   );
  // };
  const handleSubmit = () => {
    const payload = {
      ...formData,
    };

    console.log("PAYLOAD:", payload);

    const loadingToast = showLoading("Creating PreSales...");

    mutate(
      {
        data: payload,
        existingClient: isExistingClient,
      },
      {
        onSuccess: (res) => {
          dismissToast(loadingToast);

          showSuccess("PreSales Created Successfully");

          setFormData({
            client: {},
            personName: "",
            approachedVia: "",
            conclusion: "",
            quotations: [],
          });
          navigate("/presales/allpresales");
        },

        onError: (error) => {
          dismissToast(loadingToast);

          console.log("FULL ERROR:", error);
          console.log("RESPONSE:", error.response?.data);

          showError(
            // error.response?.data?.message ||
            "Failed to create PreSales",
          );
        },
      },
    );
  };
  /* ===============================
     UI
  =============================== */

  return (
    <div className={styles.pageWrapper}>
      {/* <div className={styles.breadcrumb}>Pre-Sales &gt; Add-Pre-Sale</div> */}

      <div className={styles.pageTitle}>Add Enquiry </div>

      {/* ===============================
          CLIENT SECTION
      =============================== */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Client Information</div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              checked={isExistingClient}
              onChange={() => setIsExistingClient(!isExistingClient)}
            />
            <span className={styles.customCheckbox}></span>
            <span className={styles.checkboxText}>Existing Client</span>
          </label>
        </div>
        <br />
        <div className={styles.gridTwo}>
          {!isExistingClient ? (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Client Name</label>
                <input
                  className={styles.input}
                  placeholder="Enter client name"
                  onChange={(e) => handleClientChange("name", e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  placeholder="Enter email"
                  onChange={(e) => handleClientChange("email", e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone</label>
                <input
                  className={styles.input}
                  placeholder="Enter phone"
                  onChange={(e) => handleClientChange("phone", e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Address</label>
                <input
                  className={styles.input}
                  placeholder="Enter address"
                  onChange={(e) =>
                    handleClientChange("address", e.target.value)
                  }
                />
              </div>
            </>
          ) : (
            <div className={styles.formGroup}>
              <label className={styles.label}>Search Client</label>

              <input
                className={styles.input}
                placeholder="Search client name..."
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  setShowDropdown(true);
                }}
              />

              {showDropdown && clientSearch && (
                <div className={styles.clientDropdown}>
                  {filteredClients.length === 0 && (
                    <div className={styles.clientItem}>No clients found</div>
                  )}

                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className={styles.clientItem}
                      onClick={() => {
                        handleClientChange("id", client.id);
                        setClientSearch(client.name);
                        setShowDropdown(false);
                      }}
                    >
                      <strong>{client.name}</strong>
                      <span>{client.phone}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===============================
          PRE-SALES DETAILS
      =============================== */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Enquiry Details</div>

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
              <option value="">Select</option>
              <option value="Call">Call</option>
              <option value="Meeting">Meeting</option>
              <option value="Reference">Reference</option>
              <option value="Website">Website</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Status</label>
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

      {/* ===============================
          QUOTATIONS
      =============================== */}
      {/* <div className={styles.card}>
        <div className={styles.sectionTitle}>Quotations</div>

        <button className={styles.buttonSecondary} onClick={addQuotation}>
          + Add Quotation
        </button>

        {formData.quotations.map((q, index) => (
          <div key={index} className={styles.card} style={{ marginTop: 16 }}>
            <input
              className={styles.input}
              placeholder="Quotation Number"
              onChange={(e) =>
                handleQuotationChange(index, "quotationNumber", e.target.value)
              }
            />

            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Quotation Details"
              onChange={(e) =>
                handleQuotationChange(index, "quotationDetails", e.target.value)
              }
            />
          </div>
        ))}
      </div> */}

      {/* ===============================
          ACTION BUTTONS
      =============================== */}
      <div className={styles.actionRow}>
        <button className={styles.buttonSecondary}>Save Draft</button>

        <button
          className={styles.buttonPrimary}
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Submit Enquiry"}
        </button>
      </div>
    </div>
  );
};

export default PreSalesPage;
