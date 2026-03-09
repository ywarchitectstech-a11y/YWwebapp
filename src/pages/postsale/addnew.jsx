// import { useState } from "react";
// import styles from "./AddProjectPage.module.scss";

// const AddProjectPage = () => {
//   const [step, setStep] = useState(1);

//   const [projectData, setProjectData] = useState({
//     basic: {},
//     client: {},
//     structure: [],
//     nocs: {},
//     team: {},
//   });

//   const next = () => setStep(step + 1);
//   const back = () => setStep(step - 1);

//   return (
//     <div className={styles.container}>
//       {/* STEPPER */}
//       <div className={styles.stepper}>
//         {["Basic", "Client & Site", "Structure", "NOCs", "Team", "Review"].map(
//           (label, index) => (
//             <div
//               key={label}
//               className={`${styles.step} ${
//                 step >= index + 1 ? styles.active : ""
//               }`}
//             >
//               {label}
//             </div>
//           ),
//         )}
//       </div>

//       {/* STEP CONTENT */}
//       {step === 1 && (
//         <BasicDetails
//           data={projectData.basic}
//           setData={(val) => setProjectData({ ...projectData, basic: val })}
//           onNext={next}
//         />
//       )}

//       {step === 2 && (
//         <ClientSiteDetails
//           data={projectData.client}
//           setData={(val) => setProjectData({ ...projectData, client: val })}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 3 && (
//         <ProjectStructure
//           data={projectData.structure}
//           setData={(val) => setProjectData({ ...projectData, structure: val })}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 4 && (
//         <NOCDetails
//           data={projectData.nocs}
//           setData={(val) => setProjectData({ ...projectData, nocs: val })}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 5 && (
//         <TeamAssignment
//           data={projectData.team}
//           setData={(val) => setProjectData({ ...projectData, team: val })}
//           onNext={next}
//           onBack={back}
//         />
//       )}

//       {step === 6 && (
//         <ReviewProject
//           data={projectData}
//           onBack={back}
//           onSubmit={() => console.log(projectData)}
//         />
//       )}
//     </div>
//   );
// };

// export default AddProjectPage;
// const BasicDetails = ({ data, setData, onNext }) => {
//   return (
//     <div className={styles.card}>
//       <h2>Project Basic Details</h2>

//       <div className={styles.grid}>
//         <input
//           placeholder="Project Name"
//           onChange={(e) => setData({ ...data, projectName: e.target.value })}
//         />
//         <input placeholder="Project Code" />
//         <select>
//           <option>Residential</option>
//           <option>Commercial</option>
//           <option>Mixed Use</option>
//           <option>Institutional</option>
//         </select>
//         <input type="date" />
//         <input type="date" />
//       </div>

//       <div className={styles.actions}>
//         <button onClick={onNext}>Save & Continue</button>
//       </div>
//     </div>
//   );
// };
// const ClientSiteDetails = ({ data, setData, onNext, onBack }) => {
//   return (
//     <div className={styles.card}>
//       <h2>Client & Site Details</h2>

//       <div className={styles.grid}>
//         <input placeholder="Client Name" />
//         <input placeholder="Developer / Owner" />
//         <input placeholder="Contact Number" />
//         <input placeholder="Email" />
//         <input placeholder="Site Address" />
//         <input placeholder="Survey / CTS No" />
//         <input placeholder="Plot Area (sq.m)" />
//         <select>
//           <option>7/12 Available</option>
//           <option>Yes</option>
//           <option>No</option>
//         </select>
//       </div>

//       <div className={styles.actions}>
//         <button onClick={onBack}>Back</button>
//         <button onClick={onNext}>Save & Continue</button>
//       </div>
//     </div>
//   );
// };
// const ProjectStructure = ({ data, setData, onNext, onBack }) => {
//   const addWing = () => setData([...data, { wingName: "", buildings: [] }]);

//   return (
//     <div className={styles.card}>
//       <h2>Project Structure</h2>

//       {data.map((wing, wIndex) => (
//         <div key={wIndex} className={styles.subCard}>
//           <input
//             placeholder="Wing Name"
//             onChange={(e) => {
//               const updated = [...data];
//               updated[wIndex].wingName = e.target.value;
//               setData(updated);
//             }}
//           />
//         </div>
//       ))}

//       <button onClick={addWing}>+ Add Wing</button>

//       <div className={styles.actions}>
//         <button onClick={onBack}>Back</button>
//         <button onClick={onNext}>Save & Continue</button>
//       </div>
//     </div>
//   );
// };
// const NOCDetails = ({ data, setData, onNext, onBack }) => {
//   const toggle = (key) => setData({ ...data, [key]: !data[key] });

//   return (
//     <div className={styles.card}>
//       <h2>Statutory & NOC Scope</h2>

//       {[
//         "Water NOC",
//         "Drainage NOC",
//         "Fire NOC",
//         "Garden NOC",
//         "Environmental Clearance",
//         "Airport Height NOC",
//       ].map((noc) => (
//         <label key={noc} className={styles.checkbox}>
//           <input type="checkbox" onChange={() => toggle(noc)} />
//           {noc}
//         </label>
//       ))}

//       <div className={styles.actions}>
//         <button onClick={onBack}>Back</button>
//         <button onClick={onNext}>Save & Continue</button>
//       </div>
//     </div>
//   );
// };
// const TeamAssignment = ({ onNext, onBack }) => {
//   return (
//     <div className={styles.card}>
//       <h2>Team Assignment</h2>

//       <div className={styles.grid}>
//         <select>
//           <option>Project Manager</option>
//         </select>
//         <select>
//           <option>Senior Architect</option>
//         </select>
//         <select>
//           <option>Junior Architect</option>
//         </select>
//         <select>
//           <option>Liaison Officer</option>
//         </select>
//       </div>

//       <div className={styles.actions}>
//         <button onClick={onBack}>Back</button>
//         <button onClick={onNext}>Save & Continue</button>
//       </div>
//     </div>
//   );
// };
// const ReviewProject = ({ data, onBack, onSubmit }) => {
//   return (
//     <div className={styles.card}>
//       <h2>Review Project</h2>

//       <pre className={styles.review}>{JSON.stringify(data, null, 2)}</pre>

//       <div className={styles.actions}>
//         <button onClick={onBack}>Back</button>
//         <button onClick={onSubmit}>Create Project</button>
//       </div>
//     </div>
//   );
// };

// NEW FORM
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePostSales } from "../../api/hooks/usePostSales";
import styles from "./AddProjectPage.module.scss";

const AddPostSales = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreatePostSales();

  const [formData, setFormData] = useState({
    projectId: "",
    remark: "",
    postSalesStatus: "INITIATED",
  });

  const handleSubmit = () => {
    if (!formData.projectId) {
      alert("Project ID required");
      return;
    }

    const payload = {
      project: {
        projectId: Number(formData.projectId),
      },
      remark: formData.remark,
      postSalesStatus: formData.postSalesStatus,
    };

    mutate(payload, {
      onSuccess: () => {
        navigate("/postsales/all");
      },
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.breadcrumb}>Billing &gt; Add Post-Sales</div>

      <div className={styles.pageTitle}>Create Post-Sales Entry</div>

      {/* ===============================
          PROJECT SECTION
      =============================== */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Project Information</div>

        <div className={styles.gridTwo}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Project ID *</label>
            <input
              className={styles.input}
              placeholder="Enter project ID"
              value={formData.projectId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  projectId: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* ===============================
          POST SALES DETAILS
      =============================== */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Post-Sales Details</div>

        <div className={styles.gridTwo}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.input}
              value={formData.postSalesStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  postSalesStatus: e.target.value,
                })
              }
            >
              <option value="INITIATED">INITIATED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup} style={{ marginTop: 16 }}>
          <label className={styles.label}>Remark</label>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            placeholder="Enter billing remark..."
            value={formData.remark}
            onChange={(e) =>
              setFormData({
                ...formData,
                remark: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* ===============================
          AUTO INFO
      =============================== */}
      <div className={styles.infoCard}>
        <div className={styles.infoText}>
          • Client will be auto-fetched from Project • PostSales dateTime will
          be auto-generated • Invoices can be added later
        </div>
      </div>

      {/* ===============================
          ACTIONS
      =============================== */}
      <div className={styles.actionRow}>
        <button className={styles.buttonSecondary} onClick={() => navigate(-1)}>
          Cancel
        </button>

        <button
          className={styles.buttonPrimary}
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create PostSales"}
        </button>
      </div>
    </div>
  );
};

export default AddPostSales;
