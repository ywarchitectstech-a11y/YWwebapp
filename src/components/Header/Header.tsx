import React, { useState, useEffect, useRef } from "react"; // Added hooks
import { useLocation } from "react-router-dom";
import { useSidebarStore } from "../../store/sidebarStore";
import { useUserStore } from "../../store/userStore";
import {
  MenuIcon,
  BellIcon,
  RefreshIcon,
  PowerIcon,
  ChevronDownIcon,
} from "../Icons/Icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import styles from "./Header.module.scss";
const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; path: string }[] = [];

  let currentPath = "";
  paths.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    breadcrumbs.push({ label, path: currentPath });
  });

  return breadcrumbs;
};

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { isCollapsed, toggleMobile } = useSidebarStore();
  const { user } = useUserStore();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0); // Using ref prevents unnecessary re-renders
  const userLogout = useUserStore((s) => s.logout);
  const { logout } = useAuth();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    logout();
    userLogout();

    navigate("/login");
  };
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Always show at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // 2. Determine direction and distance scrolled
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollDistance = Math.abs(currentScrollY - lastScrollY.current);

      // Only toggle if we've scrolled more than 5px (prevents jitter)
      if (scrollDistance > 5) {
        if (scrollingDown && currentScrollY > 80) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={`
      ${styles.header} 
      ${isCollapsed ? styles.sidebarCollapsed : ""}
      ${!isVisible ? styles.headerHidden : ""}
    `}
    >
      {" "}
      <div className={styles.leftSection}>
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobile}
          aria-label="Open menu"
        >
          <MenuIcon size={20} />
        </button>

        {/* {breadcrumbs.length > 0 && (
          <nav className={styles.breadcrumb}>
            <a href="/" className={styles.breadcrumbLink}>
              Dashboard
            </a>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <span className={styles.breadcrumbSeparator}>&gt;</span>
                {index === breadcrumbs.length - 1 ? (
                  <span className={styles.breadcrumbCurrent}>
                    {crumb.label}
                  </span>
                ) : (
                  <a href={crumb.path} className={styles.breadcrumbLink}>
                    {crumb.label}
                  </a>
                )}
              </React.Fragment>
            ))}
          </nav>
        )} */}
      </div>
      <div className={styles.rightSection}>
        <button
          className={styles.iconButton}
          title="Refresh"
          onClick={() => window.location.reload()}
        >
          <RefreshIcon size={18} />
        </button>
        {/*         
        <button className={styles.iconButton} title="Notifications">
          <BellIcon size={18} />
          <span className={styles.notificationBadge}>3</span>
        </button> */}

        <button
          className={styles.iconButton}
          title="Logout"
          onClick={handleLogout}
        >
          <PowerIcon size={18} />
        </button>

        <div className={styles.userSection}>
          <div className={styles.avatar}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              getInitials(user?.name || "User")
            )}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name}</div>
          </div>
          <ChevronDownIcon className={styles.userChevron} size={16} />
        </div>
      </div>
    </header>
  );
};

export default Header;
