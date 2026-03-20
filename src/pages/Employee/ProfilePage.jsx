import { useState, useEffect } from "react";
import { useEmployeeData } from "../../api/hooks/useEmployees";
import { useUpdateEmployee } from "../../api/hooks/useEmployees";
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

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { data: user, isLoading, isError } = useEmployeeData();
  const { mutate: updateEmployee, isPending } = useUpdateEmployee();

  const [form, setForm] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [isDirty, setIsDirty] = useState(false);

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
    // { key: "official", label: "Official", icon: "💼" },
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

          {/* Quick stats */}
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
              <Field label="Profile Image URL" full>
                <input
                  className={styles.input}
                  name="profileImage"
                  value={form.profileImage}
                  onChange={onChange}
                  placeholder="https://..."
                />
              </Field>
              {form.profileImage && (
                <div className={styles.imgPreviewWrap}>
                  <img
                    src={form.profileImage}
                    alt="Preview"
                    className={styles.imgPreview}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
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

            {/* Read-only reference */}
            <SectionCard title="Account Info" icon="🔒">
              <InfoRow label="User ID" value={`#${user.id}`} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Role" value={user.role} />
              <InfoRow label="Status" value={user.status} />
            </SectionCard>
          </div>
        )}

        {/* OFFICIAL TAB */}
        {activeTab === "official" && (
          <div className={styles.grid}>
            <SectionCard title="Employment Details" icon="💼">
              <div className={styles.formGrid}>
                {/* <Field label="Role">
                  <select
                    className={styles.select}
                    name="role"
                    value={form.role}
                    onChange={onChange}
                  >
                    <option value="">Select role</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field> */}
                {/* <Field label="Status">
                  <select
                    className={styles.select}
                    name="status"
                    value={form.status}
                    onChange={onChange}
                  >
                    <option value="">Select status</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="ON_LEAVE">ON_LEAVE</option>
                  </select>
                </Field> */}
                <Field label="Join Date">
                  <input
                    className={styles.input}
                    type="date"
                    name="joinDate"
                    value={form.joinDate}
                    onChange={onChange}
                  />
                </Field>
                <Field label="Leave Date">
                  <input
                    className={styles.input}
                    type="date"
                    name="leaveDate"
                    value={form.leaveDate}
                    onChange={onChange}
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="Work Summary" icon="📊">
              <InfoRow label="Join Date" value={user.joinDate} />
              <InfoRow
                label="Leave Date"
                value={user.leaveDate || "Still working"}
              />
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
    </div>
  );
}
