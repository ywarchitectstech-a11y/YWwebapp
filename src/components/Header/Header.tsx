// import React, { useState, useEffect, useRef } from "react"; // Added hooks
// import { useLocation } from "react-router-dom";
// import { useSidebarStore } from "../../store/sidebarStore";
// import { useUserStore } from "../../store/userStore";
// import {
//   MenuIcon,
//   BellIcon,
//   RefreshIcon,
//   PowerIcon,
//   ChevronDownIcon,
// } from "../Icons/Icons";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../components/AuthContext";
// import styles from "./Header.module.scss";
// const getBreadcrumbs = (pathname: string) => {
//   const paths = pathname.split("/").filter(Boolean);
//   const breadcrumbs: { label: string; path: string }[] = [];

//   let currentPath = "";
//   paths.forEach((segment) => {
//     currentPath += `/${segment}`;
//     const label = segment
//       .split("-")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//     breadcrumbs.push({ label, path: currentPath });
//   });

//   return breadcrumbs;
// };

// export const Header: React.FC = () => {
//   const navigate = useNavigate();

//   const location = useLocation();
//   const { isCollapsed, toggleMobile } = useSidebarStore();
//   const { user } = useUserStore();
//   const [isVisible, setIsVisible] = useState(true);
//   const lastScrollY = useRef(0); // Using ref prevents unnecessary re-renders
//   const userLogout = useUserStore((s) => s.logout);
//   const { logout } = useAuth();

//   const handleLogout = () => {
//     const confirmLogout = window.confirm("Are you sure you want to logout?");
//     if (!confirmLogout) return;

//     logout();
//     userLogout();

//     navigate("/login");
//   };
//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       // 1. Always show at the very top
//       if (currentScrollY < 10) {
//         setIsVisible(true);
//         lastScrollY.current = currentScrollY;
//         return;
//       }

//       // 2. Determine direction and distance scrolled
//       const scrollingDown = currentScrollY > lastScrollY.current;
//       const scrollDistance = Math.abs(currentScrollY - lastScrollY.current);

//       // Only toggle if we've scrolled more than 5px (prevents jitter)
//       if (scrollDistance > 5) {
//         if (scrollingDown && currentScrollY > 80) {
//           setIsVisible(false);
//         } else {
//           setIsVisible(true);
//         }
//       }

//       lastScrollY.current = currentScrollY;
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
//   const breadcrumbs = getBreadcrumbs(location.pathname);
//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <header
//       className={`
//       ${styles.header}
//       ${isCollapsed ? styles.sidebarCollapsed : ""}
//       ${!isVisible ? styles.headerHidden : ""}
//     `}
//     >
//       {" "}
//       <div className={styles.leftSection}>
//         <button
//           className={styles.mobileMenuButton}
//           onClick={toggleMobile}
//           aria-label="Open menu"
//         >
//           <MenuIcon size={20} />
//         </button>

//         {/* {breadcrumbs.length > 0 && (
//           <nav className={styles.breadcrumb}>
//             <a href="/" className={styles.breadcrumbLink}>
//               Dashboard
//             </a>
//             {breadcrumbs.map((crumb, index) => (
//               <React.Fragment key={crumb.path}>
//                 <span className={styles.breadcrumbSeparator}>&gt;</span>
//                 {index === breadcrumbs.length - 1 ? (
//                   <span className={styles.breadcrumbCurrent}>
//                     {crumb.label}
//                   </span>
//                 ) : (
//                   <a href={crumb.path} className={styles.breadcrumbLink}>
//                     {crumb.label}
//                   </a>
//                 )}
//               </React.Fragment>
//             ))}
//           </nav>
//         )} */}
//       </div>
//       <div className={styles.rightSection}>
//         <button
//           className={styles.iconButton}
//           title="Refresh"
//           onClick={() => window.location.reload()}
//         >
//           <RefreshIcon size={18} />
//         </button>
//         {/*
//         <button className={styles.iconButton} title="Notifications">
//           <BellIcon size={18} />
//           <span className={styles.notificationBadge}>3</span>
//         </button> */}

//         <button
//           className={styles.iconButton}
//           title="Logout"
//           onClick={handleLogout}
//         >
//           <PowerIcon size={18} />
//         </button>

//         <div className={styles.userSection}>
//           <div className={styles.avatar}>
//             {user?.avatar ? (
//               <img src={user.avatar} alt={user.name} />
//             ) : (
//               getInitials(user?.name || "User")
//             )}
//           </div>
//           <div className={styles.userInfo}>
//             <div className={styles.userName}>{user?.name}</div>
//           </div>
//           <ChevronDownIcon className={styles.userChevron} size={16} />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebarStore } from "../../store/sidebarStore";
import { useUserStore } from "../../store/userStore";
import {
  MenuIcon,
  RefreshIcon,
  PowerIcon,
  ChevronDownIcon,
} from "../Icons/Icons";
import { useAuth } from "../../components/AuthContext";
import { useEmployeeData } from "../../api/hooks/useEmployees";
import { useClientProfile } from "../../api/hooks/useClient";
import { useUpdateMyPassword } from "../../api/hooks/useClient";
import { isClient, isEmployee, canManage } from "../../hooks/roleCheck";
import styles from "./Header.module.scss";

// ─── Password Popup (client only) ─────────────────────────────────────────────
const ChangePasswordPopup: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { mutate: updatePassword, isPending } = useUpdateMyPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation — exactly as requested
    if (!oldPassword || !newPassword) {
      alert("All fields required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    updatePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => onClose(), 1800);
        },
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to update password. Please check your current password.",
          );
        },
      },
    );
  };

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.popupOverlay} onClick={handleOverlayClick}>
      <div className={styles.popupBox}>
        {/* Header */}
        <div className={styles.popupHeader}>
          <div className={styles.popupHeaderLeft}>
            <div className={styles.popupIconWrap}>🔐</div>
            <div>
              <h2 className={styles.popupTitle}>Change Password</h2>
              <p className={styles.popupSub}>Update your account password</p>
            </div>
          </div>
          <button
            className={styles.popupClose}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className={styles.popupSuccess}>
            <span className={styles.successIcon}>✓</span>
            <p>Password updated successfully!</p>
          </div>
        ) : (
          <form className={styles.popupForm} onSubmit={handleSubmit}>
            {/* Current Password */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Current Password</label>
              <div className={styles.passwordWrap}>
                <input
                  type={showOld ? "text" : "password"}
                  className={styles.formInput}
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowOld((v) => !v)}
                  tabIndex={-1}
                >
                  {showOld ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>New Password</label>
              <div className={styles.passwordWrap}>
                <input
                  type={showNew ? "text" : "password"}
                  className={styles.formInput}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowNew((v) => !v)}
                  tabIndex={-1}
                >
                  {showNew ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Confirm New Password</label>
              <div className={styles.passwordWrap}>
                <input
                  type="password"
                  className={styles.formInput}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Error message */}
            {error && <p className={styles.formError}>⚠ {error}</p>}

            {/* Actions */}
            <div className={styles.popupActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className={styles.btnSpinner} /> Updating…
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── Avatar component ─────────────────────────────────────────────────────────
// Shows profile image if available, otherwise first initial of the name.
const AvatarDisplay: React.FC<{
  profileImage?: string | null;
  name: string;
}> = ({ profileImage, name }) => {
  // First initial only
  const initial = (name || "U").charAt(0).toUpperCase();

  if (profileImage) {
    return <img src={profileImage} alt={name} className={styles.avatarImg} />;
  }
  return <span className={styles.avatarInitial}>{initial}</span>;
};

// ─── Header ───────────────────────────────────────────────────────────────────
export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleMobile } = useSidebarStore();
  const { user: storeUser } = useUserStore();
  const userLogout = useUserStore((s) => s.logout);
  const { logout } = useAuth();

  const [isVisible, setIsVisible] = useState(true);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const lastScrollY = useRef(0);

  // ── Role detection ──────────────────────────────────────────────────────
  const clientUser = isClient();
  const employeeUser = isEmployee();

  // ── Fetch profile data based on role ────────────────────────────────────
  // Employee / Admin / HR / CO_FOUNDER → useEmployeeData
  // UserDTO: { firstName, secondName, lastName, profileImage, role }
  const { data: empData } = useEmployeeData();

  // Client → useClientProfile (GET /api/clients/getclient)
  // ClientDTO: { name, email, ... } — no profileImage field
  const { data: clientData } = useClientProfile();

  // ── Resolved display values ──────────────────────────────────────────────
  const displayName: string = (() => {
    if (clientUser && clientData?.name) return clientData.name;
    if (employeeUser && empData) {
      return [empData.firstName, empData.secondName, empData.lastName]
        .filter(Boolean)
        .join(" ");
    }
    return storeUser?.name || "User";
  })();

  // profileImage only exists on UserDTO (employee), not ClientDTO
  const profileImage: string | null = employeeUser
    ? (empData?.profileImage ?? null)
    : null;

  // ── Scroll hide/show ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollDistance = Math.abs(currentScrollY - lastScrollY.current);
      if (scrollDistance > 5) {
        setIsVisible(scrollingDown && currentScrollY > 80 ? false : true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout();
    userLogout();
    navigate("/login");
  };

  // ── Avatar click behaviour ────────────────────────────────────────────────
  // Employee / Admin / HR / CO_FOUNDER → navigate to /employee/profile
  // Client → open Change Password popup
  const handleAvatarClick = () => {
    if (clientUser) {
      setShowPasswordPopup(true);
    } else {
      // Only employees, admins, co-founders, HR go to profile
      navigate("/profile");
    }
  };

  return (
    <>
      <header
        className={[
          styles.header,
          isCollapsed ? styles.sidebarCollapsed : "",
          !isVisible ? styles.headerHidden : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Left */}
        <div className={styles.leftSection}>
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobile}
            aria-label="Open menu"
          >
            <MenuIcon size={20} />
          </button>
        </div>

        {/* Right */}
        <div className={styles.rightSection}>
          <button
            className={styles.iconButton}
            title="Refresh"
            onClick={() => window.location.reload()}
          >
            <RefreshIcon size={18} />
          </button>

          <button
            className={styles.iconButton}
            title="Logout"
            onClick={handleLogout}
          >
            <PowerIcon size={18} />
          </button>

          {/* User Section — clickable avatar */}
          <div
            className={styles.userSection}
            onClick={handleAvatarClick}
            title={clientUser ? "Change Password" : "View Profile"}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleAvatarClick()}
          >
            <div className={styles.avatar}>
              <AvatarDisplay profileImage={profileImage} name={displayName} />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{displayName}</div>
              {/* Role sub-label */}
              {clientUser ? (
                <div className={styles.userRole}>Client</div>
              ) : empData?.role ? (
                <div className={styles.userRole}>
                  {empData.role
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </div>
              ) : null}
            </div>
            <ChevronDownIcon className={styles.userChevron} size={16} />
          </div>
        </div>
      </header>

      {/* Change Password Popup — clients only */}
      {showPasswordPopup && (
        <ChangePasswordPopup onClose={() => setShowPasswordPopup(false)} />
      )}
    </>
  );
};

export default Header;
