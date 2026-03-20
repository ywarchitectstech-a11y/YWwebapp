// import { useState, useEffect } from "react";
// import { useEmployeeData } from "../../api/hooks/useEmployees";
// import { useUpdateMyProfile } from "../../api/hooks/useEmployees";
// import styles from "./ProfilePage.module.scss";
// import {
//   showSuccess,
//   showError,
//   showLoading,
//   dismissToast,
// } from "../../components/Notification/toast";

// // ── Helpers ────────────────────────────────────────────────────────────────────
// const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
// const GENDERS = ["MALE", "FEMALE", "OTHER"];
// const ROLES = ["ADMIN", "ARCHITECT", "ENGINEER", "INTERN", "MANAGER", "STAFF"];

// const getInitials = (user) => {
//   if (!user) return "?";
//   return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
// };

// const getFullName = (user) => {
//   if (!user) return "";
//   return [user.firstName, user.secondName, user.lastName]
//     .filter(Boolean)
//     .join(" ");
// };

// // ── Section Card ───────────────────────────────────────────────────────────────
// function SectionCard({ title, icon, children }) {
//   return (
//     <div className={styles.sectionCard}>
//       <div className={styles.sectionCardHead}>
//         <span className={styles.sectionCardIcon}>{icon}</span>
//         <h3 className={styles.sectionCardTitle}>{title}</h3>
//       </div>
//       <div className={styles.sectionCardBody}>{children}</div>
//     </div>
//   );
// }

// // ── Field ──────────────────────────────────────────────────────────────────────
// function Field({ label, required, children, full }) {
//   return (
//     <div className={`${styles.field} ${full ? styles.fieldFull : ""}`}>
//       <label className={styles.fieldLabel}>
//         {label}
//         {required && <span className={styles.req}> *</span>}
//       </label>
//       {children}
//     </div>
//   );
// }

// // ── Info Row (read-only display) ───────────────────────────────────────────────
// function InfoRow({ label, value }) {
//   return (
//     <div className={styles.infoRow}>
//       <span className={styles.infoRowLabel}>{label}</span>
//       <span className={styles.infoRowValue}>{value || "—"}</span>
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────────
// export default function ProfilePage() {
//   const { data: user, isLoading, isError } = useEmployeeData();
//   const { mutate: updateEmployee, isPending } = useUpdateMyProfile();

//   const [form, setForm] = useState(null);
//   const [activeTab, setActiveTab] = useState("personal");
//   const [isDirty, setIsDirty] = useState(false);

//   // Populate form when user data loads
//   useEffect(() => {
//     if (user) {
//       setForm({
//         firstName: user.firstName || "",
//         secondName: user.secondName || "",
//         lastName: user.lastName || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         gender: user.gender || "",
//         birthDate: user.birthDate || "",
//         bloodGroup: user.bloodGroup || "",
//         role: user.role || "",
//         status: user.status || "",
//         joinDate: user.joinDate || "",
//         leaveDate: user.leaveDate || "",
//         adharNumber: user.adharNumber || "",
//         panNumber: user.panNumber || "",
//         profileImage: user.profileImage || "",
//       });
//       setIsDirty(false);
//     }
//   }, [user]);

//   const onChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setIsDirty(true);
//   };

//   const handleReset = () => {
//     if (!user) return;
//     setForm({
//       firstName: user.firstName || "",
//       secondName: user.secondName || "",
//       lastName: user.lastName || "",
//       email: user.email || "",
//       phone: user.phone || "",
//       gender: user.gender || "",
//       birthDate: user.birthDate || "",
//       bloodGroup: user.bloodGroup || "",
//       role: user.role || "",
//       status: user.status || "",
//       joinDate: user.joinDate || "",
//       leaveDate: user.leaveDate || "",
//       adharNumber: user.adharNumber || "",
//       panNumber: user.panNumber || "",
//       profileImage: user.profileImage || "",
//     });
//     setIsDirty(false);
//   };

//   const handleSubmit = () => {
//     if (!form.firstName || !form.lastName || !form.email) {
//       showError("First name, last name and email are required");
//       return;
//     }
//     const loadingToast = showLoading("Updating profile...");
//     updateEmployee(
//       {
//         id: user.id,
//         data: {
//           ...form,
//           phone: form.phone ? Number(form.phone) : 0,
//           adharNumber: form.adharNumber ? Number(form.adharNumber) : 0,
//         },
//       },
//       {
//         onSuccess: () => {
//           dismissToast(loadingToast);
//           showSuccess("Profile updated successfully");
//           setIsDirty(false);
//         },
//         onError: (err) => {
//           dismissToast(loadingToast);
//           showError(err?.response?.data?.message || "Failed to update profile");
//         },
//       },
//     );
//   };

//   // ── Loading ──
//   if (isLoading || !form) {
//     return (
//       <div className={styles.page}>
//         <div className={styles.loadingWrap}>
//           <div className={styles.spinner} />
//           <p>Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   // ── Error ──
//   if (isError || !user) {
//     return (
//       <div className={styles.page}>
//         <div className={styles.errorWrap}>
//           <span className={styles.errorIcon}>⚠️</span>
//           <h3>Failed to load profile</h3>
//           <p>Could not fetch your profile data. Please refresh.</p>
//         </div>
//       </div>
//     );
//   }

//   const TABS = [
//     { key: "personal", label: "Personal", icon: "👤" },
//     { key: "contact", label: "Contact", icon: "📞" },
//     // { key: "official", label: "Official", icon: "💼" },
//     { key: "identity", label: "Identity", icon: "🪪" },
//   ];

//   return (
//     <div className={styles.page}>
//       {/* ── Hero / Profile Header ── */}
//       <div className={styles.heroCard}>
//         <div className={styles.heroTopBar} />
//         <div className={styles.heroContent}>
//           <div className={styles.heroLeft}>
//             {/* Avatar */}
//             <div className={styles.avatarWrap}>
//               {form.profileImage ? (
//                 <img
//                   src={form.profileImage}
//                   alt="Profile"
//                   className={styles.avatarImg}
//                 />
//               ) : (
//                 <div className={styles.avatarInitials}>{getInitials(user)}</div>
//               )}
//               <div className={styles.avatarStatus} />
//             </div>

//             {/* Name & Meta */}
//             <div className={styles.heroInfo}>
//               <h1 className={styles.heroName}>{getFullName(user)}</h1>
//               <div className={styles.heroChips}>
//                 {user.role && (
//                   <span className={styles.roleChip}>{user.role}</span>
//                 )}
//                 {user.status && (
//                   <span
//                     className={styles.statusChip}
//                     style={
//                       user.status === "ACTIVE"
//                         ? { background: "#dcfce7", color: "#14532d" }
//                         : { background: "#fee2e2", color: "#991b1b" }
//                     }
//                   >
//                     <span
//                       className={styles.statusDot}
//                       style={
//                         user.status === "ACTIVE"
//                           ? { background: "#22c55e" }
//                           : { background: "#ef4444" }
//                       }
//                     />
//                     {user.status}
//                   </span>
//                 )}
//                 {user.email && (
//                   <span className={styles.emailChip}>✉ {user.email}</span>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Quick stats */}
//           <div className={styles.heroStats}>
//             <div className={styles.heroStat}>
//               <span className={styles.heroStatVal}>
//                 {user.joinDate
//                   ? new Date(user.joinDate).toLocaleDateString("en-IN", {
//                       month: "short",
//                       year: "numeric",
//                     })
//                   : "—"}
//               </span>
//               <span className={styles.heroStatLabel}>Joined</span>
//             </div>
//             <div className={styles.heroStat}>
//               <span className={styles.heroStatVal}>{user.gender || "—"}</span>
//               <span className={styles.heroStatLabel}>Gender</span>
//             </div>
//             <div className={styles.heroStat}>
//               <span className={styles.heroStatVal}>
//                 {user.bloodGroup || "—"}
//               </span>
//               <span className={styles.heroStatLabel}>Blood</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Tabs ── */}
//       <div className={styles.tabBar}>
//         {TABS.map((t) => (
//           <button
//             key={t.key}
//             className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ""}`}
//             onClick={() => setActiveTab(t.key)}
//           >
//             <span>{t.icon}</span>
//             <span className={styles.tabLabel}>{t.label}</span>
//           </button>
//         ))}
//       </div>

//       {/* ── Dirty banner ── */}
//       {isDirty && (
//         <div className={styles.dirtyBanner}>
//           <span>⚠ You have unsaved changes</span>
//           <div className={styles.dirtyBannerActions}>
//             <button className={styles.resetBtn} onClick={handleReset}>
//               Discard
//             </button>
//             <button
//               className={styles.saveBtn}
//               onClick={handleSubmit}
//               disabled={isPending}
//             >
//               {isPending ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ── Tab Content ── */}
//       <div className={styles.tabContent}>
//         {/* PERSONAL TAB */}
//         {activeTab === "personal" && (
//           <div className={styles.grid}>
//             <SectionCard title="Name" icon="👤">
//               <div className={styles.formGrid}>
//                 <Field label="First Name" required>
//                   <input
//                     className={styles.input}
//                     name="firstName"
//                     value={form.firstName}
//                     onChange={onChange}
//                     placeholder="First name"
//                   />
//                 </Field>
//                 <Field label="Middle Name">
//                   <input
//                     className={styles.input}
//                     name="secondName"
//                     value={form.secondName}
//                     onChange={onChange}
//                     placeholder="Middle name"
//                   />
//                 </Field>
//                 <Field label="Last Name" required>
//                   <input
//                     className={styles.input}
//                     name="lastName"
//                     value={form.lastName}
//                     onChange={onChange}
//                     placeholder="Last name"
//                   />
//                 </Field>
//                 <Field label="Gender">
//                   <select
//                     className={styles.select}
//                     name="gender"
//                     value={form.gender}
//                     onChange={onChange}
//                   >
//                     <option value="">Select gender</option>
//                     {GENDERS.map((g) => (
//                       <option key={g} value={g}>
//                         {g}
//                       </option>
//                     ))}
//                   </select>
//                 </Field>
//                 <Field label="Date of Birth">
//                   <input
//                     className={styles.input}
//                     type="date"
//                     name="birthDate"
//                     value={form.birthDate}
//                     onChange={onChange}
//                   />
//                 </Field>
//                 <Field label="Blood Group">
//                   <select
//                     className={styles.select}
//                     name="bloodGroup"
//                     value={form.bloodGroup}
//                     onChange={onChange}
//                   >
//                     <option value="">Select blood group</option>
//                     {BLOOD_GROUPS.map((b) => (
//                       <option key={b} value={b}>
//                         {b}
//                       </option>
//                     ))}
//                   </select>
//                 </Field>
//               </div>
//             </SectionCard>

//             <SectionCard title="Profile Image" icon="🖼">
//               <Field label="Profile Image URL" full>
//                 <input
//                   className={styles.input}
//                   name="profileImage"
//                   value={form.profileImage}
//                   onChange={onChange}
//                   placeholder="https://..."
//                 />
//               </Field>
//               {form.profileImage && (
//                 <div className={styles.imgPreviewWrap}>
//                   <img
//                     src={form.profileImage}
//                     alt="Preview"
//                     className={styles.imgPreview}
//                     onError={(e) => (e.target.style.display = "none")}
//                   />
//                 </div>
//               )}
//             </SectionCard>
//           </div>
//         )}

//         {/* CONTACT TAB */}
//         {activeTab === "contact" && (
//           <div className={styles.grid}>
//             <SectionCard title="Contact Details" icon="📞">
//               <div className={styles.formGrid}>
//                 <Field label="Email Address" required full>
//                   <input
//                     className={styles.input}
//                     type="email"
//                     name="email"
//                     value={form.email}
//                     onChange={onChange}
//                     placeholder="email@example.com"
//                   />
//                 </Field>
//                 <Field label="Phone Number">
//                   <input
//                     className={styles.input}
//                     type="tel"
//                     name="phone"
//                     value={form.phone}
//                     onChange={onChange}
//                     placeholder="10-digit mobile number"
//                     maxLength={10}
//                   />
//                 </Field>
//               </div>
//             </SectionCard>

//             {/* Read-only reference */}
//             <SectionCard title="Account Info" icon="🔒">
//               <InfoRow label="User ID" value={`#${user.id}`} />
//               <InfoRow label="Email" value={user.email} />
//               <InfoRow label="Role" value={user.role} />
//               <InfoRow label="Status" value={user.status} />
//             </SectionCard>
//           </div>
//         )}

//         {/* OFFICIAL TAB */}
//         {activeTab === "official" && (
//           <div className={styles.grid}>
//             <SectionCard title="Employment Details" icon="💼">
//               <div className={styles.formGrid}>
//                 {/* <Field label="Role">
//                   <select
//                     className={styles.select}
//                     name="role"
//                     value={form.role}
//                     onChange={onChange}
//                   >
//                     <option value="">Select role</option>
//                     {ROLES.map((r) => (
//                       <option key={r} value={r}>
//                         {r}
//                       </option>
//                     ))}
//                   </select>
//                 </Field> */}
//                 {/* <Field label="Status">
//                   <select
//                     className={styles.select}
//                     name="status"
//                     value={form.status}
//                     onChange={onChange}
//                   >
//                     <option value="">Select status</option>
//                     <option value="ACTIVE">ACTIVE</option>
//                     <option value="INACTIVE">INACTIVE</option>
//                     <option value="ON_LEAVE">ON_LEAVE</option>
//                   </select>
//                 </Field> */}
//                 <Field label="Join Date">
//                   <input
//                     className={styles.input}
//                     type="date"
//                     name="joinDate"
//                     value={form.joinDate}
//                     onChange={onChange}
//                   />
//                 </Field>
//                 <Field label="Leave Date">
//                   <input
//                     className={styles.input}
//                     type="date"
//                     name="leaveDate"
//                     value={form.leaveDate}
//                     onChange={onChange}
//                   />
//                 </Field>
//               </div>
//             </SectionCard>

//             <SectionCard title="Work Summary" icon="📊">
//               <InfoRow label="Join Date" value={user.joinDate} />
//               <InfoRow
//                 label="Leave Date"
//                 value={user.leaveDate || "Still working"}
//               />
//               <InfoRow label="Role" value={user.role} />
//               <InfoRow label="Status" value={user.status} />
//             </SectionCard>
//           </div>
//         )}

//         {/* IDENTITY TAB */}
//         {activeTab === "identity" && (
//           <div className={styles.grid}>
//             <SectionCard title="Identity Documents" icon="🪪">
//               <div className={styles.identityNote}>
//                 <span>🔒</span>
//                 <p>Identity information is sensitive. Handle with care.</p>
//               </div>
//               <div className={styles.formGrid}>
//                 <Field label="Aadhaar Number">
//                   <input
//                     className={styles.input}
//                     type="number"
//                     name="adharNumber"
//                     value={form.adharNumber}
//                     onChange={onChange}
//                     placeholder="12-digit Aadhaar number"
//                   />
//                 </Field>
//                 <Field label="PAN Number">
//                   <input
//                     className={styles.input}
//                     name="panNumber"
//                     value={form.panNumber}
//                     onChange={onChange}
//                     placeholder="e.g. ABCDE1234F"
//                     style={{ textTransform: "uppercase" }}
//                   />
//                 </Field>
//               </div>
//             </SectionCard>

//             <SectionCard title="Document Status" icon="✅">
//               <InfoRow
//                 label="Aadhaar"
//                 value={user.adharNumber ? "✅ On file" : "❌ Not provided"}
//               />
//               <InfoRow
//                 label="PAN"
//                 value={user.panNumber ? "✅ On file" : "❌ Not provided"}
//               />
//             </SectionCard>
//           </div>
//         )}
//       </div>

//       {/* ── Footer Save Bar ── */}
//       <div className={styles.saveBar}>
//         <div className={styles.saveBarLeft}>
//           {isDirty ? (
//             <span className={styles.unsavedDot}>● Unsaved changes</span>
//           ) : (
//             <span className={styles.savedDot}>✓ All changes saved</span>
//           )}
//         </div>
//         <div className={styles.saveBarRight}>
//           <button
//             className={styles.resetBtn}
//             onClick={handleReset}
//             disabled={!isDirty || isPending}
//           >
//             Discard Changes
//           </button>
//           <button
//             className={styles.saveBtn}
//             onClick={handleSubmit}
//             disabled={!isDirty || isPending}
//           >
//             {isPending ? (
//               <>
//                 <span className={styles.btnSpinner} /> Saving...
//               </>
//             ) : (
//               "💾 Save Profile"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { useEmployeeData } from "../../api/hooks/useEmployees";
import { useUpdateMyProfile } from "../../api/hooks/useEmployees";
import { useUpdateMyPassword } from "../../api/hooks/useEmployees";
import { useUpdateMyProfileImage } from "../../api/hooks/useEmployees";
import styles from "./ProfilePage.module.scss";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";

// ── Helpers ────────────────────────────────────────────────────────────────────
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["MALE", "FEMALE", "OTHER"];
const ROLES = ["ADMIN", "ARCHITECT", "ENGINEER", "INTERN", "MANAGER", "STAFF"];

const getInitials = (user) => {
  if (!user) return "?";
  return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
};

const getFullName = (user) => {
  if (!user) return "";
  return [user.firstName, user.secondName, user.lastName]
    .filter(Boolean)
    .join(" ");
};

// ── Section Card ───────────────────────────────────────────────────────────────
function SectionCard({ title, icon, children }) {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionCardHead}>
        <span className={styles.sectionCardIcon}>{icon}</span>
        <h3 className={styles.sectionCardTitle}>{title}</h3>
      </div>
      <div className={styles.sectionCardBody}>{children}</div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────────────
function Field({ label, required, children, full }) {
  return (
    <div className={`${styles.field} ${full ? styles.fieldFull : ""}`}>
      <label className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.req}> *</span>}
      </label>
      {children}
    </div>
  );
}

// ── Info Row (read-only display) ───────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoRowLabel}>{label}</span>
      <span className={styles.infoRowValue}>{value || "—"}</span>
    </div>
  );
}

// ── Profile Image Upload ───────────────────────────────────────────────────────
// Standalone component — has its own mutation, does NOT touch the main form state.
// PUT /api/employees/updatemyprofileimage (multipart/form-data, part: "profileimage")
function ProfileImageUpload({ currentImage, userName, userInitials }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Keep preview in sync if parent data changes (e.g. on first load)
  useEffect(() => {
    if (currentImage && !preview) setPreview(currentImage);
  }, [currentImage]);

  const { mutate: uploadImage, isPending: isUploading } =
    useUpdateMyProfileImage();

  // ── Validate file ────────────────────────────────────────────────────────
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_SIZE_MB = 5;

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only JPG, PNG, WEBP or GIF files are allowed.";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File must be smaller than ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  // ── Process selected file ─────────────────────────────────────────────────
  const processFile = (file) => {
    if (!file) return;
    setUploadError("");
    setUploadSuccess(false);

    const err = validateFile(file);
    if (err) {
      setUploadError(err);
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to backend
    // PUT /api/employees/updatemyprofileimage
    // multipart/form-data, part name: "profileimage"
    const formData = new FormData();
    formData.append("profileimage", file);

    uploadImage(formData, {
      onSuccess: () => {
        setUploadSuccess(true);
        showSuccess("Profile photo updated!");
        setTimeout(() => setUploadSuccess(false), 3000);
      },
      onError: (err) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Upload failed. Please try again.";
        setUploadError(msg);
        showError(msg);
        // Revert preview on error
        setPreview(currentImage || null);
      },
    });
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleRemove = () => {
    setPreview(null);
    setUploadError("");
    setUploadSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={styles.imgUploadWrap}>
      {/* Current / preview image */}
      <div className={styles.imgUploadPreviewArea}>
        {preview ? (
          <div className={styles.imgUploadPreviewBox}>
            <img
              src={preview}
              alt={userName}
              className={styles.imgUploadPreview}
              onError={() => setPreview(null)}
            />
            {/* Remove button overlay */}
            {!isUploading && (
              <button
                className={styles.imgRemoveBtn}
                onClick={handleRemove}
                title="Remove photo"
                type="button"
              >
                ✕
              </button>
            )}
            {/* Upload overlay spinner */}
            {isUploading && (
              <div className={styles.imgUploadingOverlay}>
                <div className={styles.spinner} />
              </div>
            )}
            {/* Success tick */}
            {uploadSuccess && <div className={styles.imgSuccessOverlay}>✓</div>}
          </div>
        ) : (
          // Fallback initials avatar
          <div className={styles.imgUploadInitials}>
            {isUploading ? (
              <div className={styles.spinner} />
            ) : (
              <span>{userInitials}</span>
            )}
          </div>
        )}
      </div>

      {/* Drop zone / click to upload */}
      <div
        className={`${styles.imgDropZone} ${isDragOver ? styles.imgDropZoneActive : ""} ${isUploading ? styles.imgDropZoneDisabled : ""}`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter" && !isUploading && fileInputRef.current?.click()
        }
      >
        <span className={styles.imgDropIcon}>
          {isUploading ? "⏳" : isDragOver ? "📂" : "📤"}
        </span>
        <span className={styles.imgDropText}>
          {isUploading
            ? "Uploading…"
            : isDragOver
              ? "Drop image here"
              : "Click to upload or drag & drop"}
        </span>
        <span className={styles.imgDropHint}>
          JPG, PNG, WEBP or GIF · Max {MAX_SIZE_MB}MB
        </span>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={styles.imgFileInput}
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      {/* Error */}
      {uploadError && (
        <div className={styles.imgUploadError}>
          <span>⚠</span> {uploadError}
        </div>
      )}

      {/* Success */}
      {uploadSuccess && (
        <div className={styles.imgUploadSuccess}>
          <span>✓</span> Photo updated successfully!
        </div>
      )}
    </div>
  );
}

function ChangePasswordPopup({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Hook: mutationFn: ({ oldPassword, newPassword }) => userApi.updateMyPassword(...)
  const { mutate: updateMyPassword, isPending } = useUpdateMyPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // ── Validation ──────────────────────────────────────────────────────────
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    // Exact check as requested
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    // ── Call API ─────────────────────────────────────────────────────────────
    updateMyPassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setSuccess(true);
          showSuccess("Password changed successfully!");
          setTimeout(() => onClose(), 1800);
        },
        onError: (err) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Incorrect current password or server error.";
          setError(msg);
          showError(msg);
        },
      },
    );
  };

  // Close on overlay click
  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.pwPopupOverlay} onClick={handleOverlay}>
      <div className={styles.pwPopupBox}>
        {/* Header */}
        <div className={styles.pwPopupHeader}>
          <div className={styles.pwPopupHeaderLeft}>
            <div className={styles.pwPopupIcon}>🔐</div>
            <div>
              <h2 className={styles.pwPopupTitle}>Change Password</h2>
              <p className={styles.pwPopupSub}>
                Update your account password securely
              </p>
            </div>
          </div>
          <button
            className={styles.pwPopupClose}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className={styles.pwSuccess}>
            <div className={styles.pwSuccessIcon}>✓</div>
            <p className={styles.pwSuccessText}>
              Password updated successfully!
            </p>
            <small className={styles.pwSuccessSub}>
              Closing automatically…
            </small>
          </div>
        ) : (
          <form className={styles.pwForm} onSubmit={handleSubmit} noValidate>
            {/* Current Password */}
            <div className={styles.pwField}>
              <label className={styles.fieldLabel}>Current Password</label>
              <div className={styles.pwInputWrap}>
                <input
                  className={styles.input}
                  type={showOld ? "text" : "password"}
                  placeholder="Enter your current password"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.pwEyeBtn}
                  onClick={() => setShowOld((v) => !v)}
                  tabIndex={-1}
                  aria-label={showOld ? "Hide" : "Show"}
                >
                  {showOld ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className={styles.pwDivider} />

            {/* New Password */}
            <div className={styles.pwField}>
              <label className={styles.fieldLabel}>New Password</label>
              <div className={styles.pwInputWrap}>
                <input
                  className={styles.input}
                  type={showNew ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.pwEyeBtn}
                  onClick={() => setShowNew((v) => !v)}
                  tabIndex={-1}
                >
                  {showNew ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className={styles.pwField}>
              <label className={styles.fieldLabel}>Confirm New Password</label>
              <div className={styles.pwInputWrap}>
                <input
                  className={`${styles.input} ${
                    confirmPassword && newPassword !== confirmPassword
                      ? styles.inputError
                      : confirmPassword && newPassword === confirmPassword
                        ? styles.inputSuccess
                        : ""
                  }`}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.pwEyeBtn}
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                >
                  {showConfirm ? "🙈" : "👁"}
                </button>
              </div>
              {/* Inline match indicator */}
              {confirmPassword && (
                <span
                  className={
                    newPassword === confirmPassword
                      ? styles.pwMatchOk
                      : styles.pwMatchFail
                  }
                >
                  {newPassword === confirmPassword
                    ? "✓ Passwords match"
                    : "✕ Passwords do not match"}
                </span>
              )}
            </div>

            {/* Error banner */}
            {error && (
              <div className={styles.pwError}>
                <span>⚠</span> {error}
              </div>
            )}

            {/* Strength hint */}
            {newPassword && (
              <div className={styles.pwStrength}>
                <div className={styles.pwStrengthBars}>
                  {[1, 2, 3, 4].map((lvl) => {
                    const strength =
                      (newPassword.length >= 6 ? 1 : 0) +
                      (/[A-Z]/.test(newPassword) ? 1 : 0) +
                      (/[0-9]/.test(newPassword) ? 1 : 0) +
                      (/[^A-Za-z0-9]/.test(newPassword) ? 1 : 0);
                    const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];
                    return (
                      <div
                        key={lvl}
                        className={styles.pwStrengthBar}
                        style={{
                          background:
                            lvl <= strength ? colors[strength - 1] : "#e5e7eb",
                        }}
                      />
                    );
                  })}
                </div>
                <span className={styles.pwStrengthLabel}>
                  {(() => {
                    const s =
                      (newPassword.length >= 6 ? 1 : 0) +
                      (/[A-Z]/.test(newPassword) ? 1 : 0) +
                      (/[0-9]/.test(newPassword) ? 1 : 0) +
                      (/[^A-Za-z0-9]/.test(newPassword) ? 1 : 0);
                    return (
                      ["Weak", "Fair", "Good", "Strong"][s - 1] || "Too short"
                    );
                  })()}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className={styles.pwActions}>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={
                  isPending ||
                  (!!confirmPassword && newPassword !== confirmPassword)
                }
              >
                {isPending ? (
                  <>
                    <span className={styles.btnSpinner} /> Updating…
                  </>
                ) : (
                  "🔐 Update Password"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { data: user, isLoading, isError } = useEmployeeData();
  const { mutate: updateEmployee, isPending } = useUpdateMyProfile();

  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [isDirty, setIsDirty] = useState(false);
  // Controls the Change Password popup
  const [showPwPopup, setShowPwPopup] = useState(false);

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        secondName: user.secondName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        birthDate: user.birthDate || "",
        bloodGroup: user.bloodGroup || "",
        role: user.role || "",
        status: user.status || "",
        joinDate: user.joinDate || "",
        leaveDate: user.leaveDate || "",
        adharNumber: user.adharNumber || "",
        panNumber: user.panNumber || "",
        profileImage: user.profileImage || "",
      });
      setIsDirty(false);
    }
  }, [user]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleReset = () => {
    if (!user) return;
    setForm({
      firstName: user.firstName || "",
      secondName: user.secondName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      birthDate: user.birthDate || "",
      bloodGroup: user.bloodGroup || "",
      role: user.role || "",
      status: user.status || "",
      joinDate: user.joinDate || "",
      leaveDate: user.leaveDate || "",
      adharNumber: user.adharNumber || "",
      panNumber: user.panNumber || "",
      profileImage: user.profileImage || "",
    });
    setIsDirty(false);
  };

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.email) {
      showError("First name, last name and email are required");
      return;
    }
    const loadingToast = showLoading("Updating profile...");
    updateEmployee(
      {
        id: user.id,
        data: {
          ...form,
          phone: form.phone ? Number(form.phone) : 0,
          adharNumber: form.adharNumber ? Number(form.adharNumber) : 0,
        },
      },
      {
        onSuccess: () => {
          dismissToast(loadingToast);
          showSuccess("Profile updated successfully");
          setIsDirty(false);
        },
        onError: (err) => {
          dismissToast(loadingToast);
          showError(err?.response?.data?.message || "Failed to update profile");
        },
      },
    );
  };

  // ── Loading ──
  if (isLoading || !form) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError || !user) {
    return (
      <div className={styles.page}>
        <div className={styles.errorWrap}>
          <span className={styles.errorIcon}>⚠️</span>
          <h3>Failed to load profile</h3>
          <p>Could not fetch your profile data. Please refresh.</p>
        </div>
      </div>
    );
  }

  const TABS = [
    { key: "personal", label: "Personal", icon: "👤" },
    { key: "contact", label: "Contact", icon: "📞" },
    { key: "identity", label: "Identity", icon: "🪪" },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero / Profile Header ── */}
      <div className={styles.heroCard}>
        <div className={styles.heroTopBar} />
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            {/* Avatar */}
            <div className={styles.avatarWrap}>
              {form.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className={styles.avatarImg}
                />
              ) : (
                <div className={styles.avatarInitials}>{getInitials(user)}</div>
              )}
              <div className={styles.avatarStatus} />
            </div>

            {/* Name & Meta */}
            <div className={styles.heroInfo}>
              <h1 className={styles.heroName}>{getFullName(user)}</h1>
              <div className={styles.heroChips}>
                {user.role && (
                  <span className={styles.roleChip}>{user.role}</span>
                )}
                {user.status && (
                  <span
                    className={styles.statusChip}
                    style={
                      user.status === "ACTIVE"
                        ? { background: "#dcfce7", color: "#14532d" }
                        : { background: "#fee2e2", color: "#991b1b" }
                    }
                  >
                    <span
                      className={styles.statusDot}
                      style={
                        user.status === "ACTIVE"
                          ? { background: "#22c55e" }
                          : { background: "#ef4444" }
                      }
                    />
                    {user.status}
                  </span>
                )}
                {user.email && (
                  <span className={styles.emailChip}>✉ {user.email}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right side: quick stats + Change Password button */}
          <div className={styles.heroRight}>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatVal}>
                  {user.joinDate
                    ? new Date(user.joinDate).toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
                <span className={styles.heroStatLabel}>Joined</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatVal}>{user.gender || "—"}</span>
                <span className={styles.heroStatLabel}>Gender</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatVal}>
                  {user.bloodGroup || "—"}
                </span>
                <span className={styles.heroStatLabel}>Blood</span>
              </div>
            </div>

            {/* ── Change Password button ── */}
            <button
              className={styles.changePwBtn}
              onClick={() => setShowPwPopup(true)}
              title="Change your account password"
            >
              🔐 Change Password
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className={styles.tabBar}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span>{t.icon}</span>
            <span className={styles.tabLabel}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Dirty banner ── */}
      {isDirty && (
        <div className={styles.dirtyBanner}>
          <span>⚠ You have unsaved changes</span>
          <div className={styles.dirtyBannerActions}>
            <button className={styles.resetBtn} onClick={handleReset}>
              Discard
            </button>
            <button
              className={styles.saveBtn}
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* ── Tab Content ── */}
      <div className={styles.tabContent}>
        {/* PERSONAL TAB */}
        {activeTab === "personal" && (
          <div className={styles.grid}>
            <SectionCard title="Name" icon="👤">
              <div className={styles.formGrid}>
                <Field label="First Name" required>
                  <input
                    className={styles.input}
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    placeholder="First name"
                  />
                </Field>
                <Field label="Middle Name">
                  <input
                    className={styles.input}
                    name="secondName"
                    value={form.secondName}
                    onChange={onChange}
                    placeholder="Middle name"
                  />
                </Field>
                <Field label="Last Name" required>
                  <input
                    className={styles.input}
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    placeholder="Last name"
                  />
                </Field>
                <Field label="Gender">
                  <select
                    className={styles.select}
                    name="gender"
                    value={form.gender}
                    onChange={onChange}
                  >
                    <option value="">Select gender</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Date of Birth">
                  <input
                    className={styles.input}
                    type="date"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={onChange}
                  />
                </Field>
                <Field label="Blood Group">
                  <select
                    className={styles.select}
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={onChange}
                  >
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="Profile Image" icon="🖼">
              <ProfileImageUpload
                currentImage={form.profileImage}
                userName={getFullName(user)}
                userInitials={getInitials(user)}
              />
            </SectionCard>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === "contact" && (
          <div className={styles.grid}>
            <SectionCard title="Contact Details" icon="📞">
              <div className={styles.formGrid}>
                <Field label="Email Address" required full>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="email@example.com"
                  />
                </Field>
                <Field label="Phone Number">
                  <input
                    className={styles.input}
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="Account Info" icon="🔒">
              <InfoRow label="User ID" value={`#${user.id}`} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Role" value={user.role} />
              <InfoRow label="Status" value={user.status} />
            </SectionCard>
          </div>
        )}

        {/* IDENTITY TAB */}
        {activeTab === "identity" && (
          <div className={styles.grid}>
            <SectionCard title="Identity Documents" icon="🪪">
              <div className={styles.identityNote}>
                <span>🔒</span>
                <p>Identity information is sensitive. Handle with care.</p>
              </div>
              <div className={styles.formGrid}>
                <Field label="Aadhaar Number">
                  <input
                    className={styles.input}
                    type="number"
                    name="adharNumber"
                    value={form.adharNumber}
                    onChange={onChange}
                    placeholder="12-digit Aadhaar number"
                  />
                </Field>
                <Field label="PAN Number">
                  <input
                    className={styles.input}
                    name="panNumber"
                    value={form.panNumber}
                    onChange={onChange}
                    placeholder="e.g. ABCDE1234F"
                    style={{ textTransform: "uppercase" }}
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="Document Status" icon="✅">
              <InfoRow
                label="Aadhaar"
                value={user.adharNumber ? "✅ On file" : "❌ Not provided"}
              />
              <InfoRow
                label="PAN"
                value={user.panNumber ? "✅ On file" : "❌ Not provided"}
              />
            </SectionCard>
          </div>
        )}
      </div>

      {/* ── Footer Save Bar ── */}
      <div className={styles.saveBar}>
        <div className={styles.saveBarLeft}>
          {isDirty ? (
            <span className={styles.unsavedDot}>● Unsaved changes</span>
          ) : (
            <span className={styles.savedDot}>✓ All changes saved</span>
          )}
        </div>
        <div className={styles.saveBarRight}>
          <button
            className={styles.resetBtn}
            onClick={handleReset}
            disabled={!isDirty || isPending}
          >
            Discard Changes
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSubmit}
            disabled={!isDirty || isPending}
          >
            {isPending ? (
              <>
                <span className={styles.btnSpinner} /> Saving...
              </>
            ) : (
              "💾 Save Profile"
            )}
          </button>
        </div>
      </div>

      {/* ── Change Password Popup ── */}
      {showPwPopup && (
        <ChangePasswordPopup onClose={() => setShowPwPopup(false)} />
      )}
    </div>
  );
}
