// import React from 'react';
// import { NavLink, useLocation } from 'react-router-dom';
// import { useSidebarStore } from '../../store/sidebarStore';
// import { navigationData } from '../../data/navigationData';
// import { iconMap, ChevronDownIcon, ChevronRightIcon } from '../Icons/Icons';
// import styles from './Sidebar.module.scss';
// import  logo from "../../assets/logo.png"
// const LogoIcon: React.FC = () => (
//   <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//     <rect width="40" height="40" rx="8" fill="#F59E0B" fillOpacity="0.1"/>
//     <path d="M12 28V16L20 10L28 16V28" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M16 28V22H24V28" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M20 10V6" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
//     <path d="M18 6H22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
//   </svg>
// );

// export const Sidebar: React.FC = () => {
//   const location = useLocation();
//   const { isCollapsed, isMobileOpen, expandedMenus, toggleCollapse, toggleMenu, closeMobile } = useSidebarStore();

//   const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId);

//   const isPathActive = (path: string) => location.pathname === path;

//   const isParentActive = (children?: { path: string }[]) => {
//     if (!children) return false;
//     return children.some(child => location.pathname.startsWith(child.path));
//   };

//   return (
//     <>
//       <div
//         className={`${styles.overlay} ${isMobileOpen ? styles.visible : ''}`}
//         onClick={closeMobile}
//       />

//       <aside
//         className={`
//           ${styles.sidebar}
//           ${isCollapsed ? styles.collapsed : ''}
//           ${isMobileOpen ? styles.mobileOpen : ''}
//         `}
//       >
//         <div className={styles.logoSection}>
//         <img className={styles.logoIcon} src={logo} alt="" />
//         </div>

//         <nav className={styles.navigation}>
//           {navigationData.map((item) => {
//             const IconComponent = iconMap[item.icon];
//             const hasChildren = item.children && item.children.length > 0;
//             const isExpanded = isMenuExpanded(item.id);
//             const isActive = item.path ? isPathActive(item.path) : isParentActive(item.children);

//             return (
//               <div key={item.id} className={styles.menuItem}>
//                 {hasChildren ? (
//                   <>
//                     <button
//                       className={`${styles.menuButton} ${isActive ? styles.active : ''}`}
//                       onClick={() => toggleMenu(item.id)}
//                     >
//                       <span className={styles.menuIcon}>
//                         {IconComponent && <IconComponent />}
//                       </span>
//                       <span className={styles.menuLabel}>{item.label}</span>
//                       <ChevronDownIcon
//                         className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}
//                         size={16}
//                       />
//                     </button>

//                     <div className={`${styles.subMenu} ${isExpanded ? styles.expanded : ''}`}>
//                       {item.children?.map((subItem) => (
//                         <div key={subItem.id} className={styles.subMenuItem}>
//                           <NavLink
//                             to={subItem.path}
//                             className={({ isActive }) =>
//                               `${styles.subMenuLink} ${isActive ? styles.active : ''}`
//                             }
//                             onClick={closeMobile}
//                           >
//                             <span className={styles.subMenuText}>{subItem.label}</span>
//                             {subItem.badge && (
//                               <span className={styles.badge}>{subItem.badge}</span>
//                             )}
//                           </NavLink>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 ) : (
//                   <NavLink
//                     to={item.path || '/'}
//                     className={({ isActive }) =>
//                       `${styles.menuButton} ${isActive ? styles.active : ''}`
//                     }
//                     onClick={closeMobile}
//                   >
//                     <span className={styles.menuIcon}>
//                       {IconComponent && <IconComponent />}
//                     </span>
//                     <span className={styles.menuLabel}>{item.label}</span>
//                   </NavLink>
//                 )}
//               </div>
//             );
//           })}
//         </nav>

//         <button
//           className={`${styles.collapseButton} ${isCollapsed ? styles.collapsed : ''}`}
//           onClick={toggleCollapse}
//           title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//         >
//           <ChevronRightIcon size={20} />
//         </button>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;

import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSidebarStore } from "../../store/sidebarStore";
import { useUserStore } from "../../store/userStore";
import { getFilteredNavigation } from "../../data/navigationData";
import { iconMap, ChevronDownIcon, ChevronRightIcon } from "../Icons/Icons";
import styles from "./Sidebar.module.scss";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
export const Sidebar: React.FC = () => {
  const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
  const location = useLocation();
  const {
    isCollapsed,
    isMobileOpen,
    expandedMenus,
    toggleCollapse,
    toggleMenu,
    closeMobile,
  } = useSidebarStore();
  const navigate = useNavigate();

  const userLogout = useUserStore((s) => s.logout);
  const { logout } = useAuth();
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    logout();
    userLogout();

    navigate("/login");
  };
  // ── Get role from store (which reads localStorage) ──────────
  const user = useUserStore((s) => s.user);

  // ── Filtered nav — recomputes only when role changes ────────
  const navItems = useMemo(() => {
    if (!user?.role) return [];
    return getFilteredNavigation(user.role);
  }, [user?.role]);

  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId);

  const isPathActive = (path: string) => location.pathname === path;

  const isParentActive = (children?: { path: string }[]) => {
    if (!children) return false;
    return children.some((child) => location.pathname.startsWith(child.path));
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isMobileOpen ? styles.visible : ""}`}
        onClick={closeMobile}
      />

      <aside
        className={`
          ${styles.sidebar}
          ${isCollapsed ? styles.collapsed : ""}
          ${isMobileOpen ? styles.mobileOpen : ""}
        `}
      >
        <div className={styles.logoSection}>
          <img className={styles.logoIcon} src={logo} alt="YW Architects" />
        </div>
        <nav className={styles.navigation}>
          {navItems.map((item) => {
            const IconComponent = iconMap[item.icon];
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = isMenuExpanded(item.id);
            const isActive = item.path
              ? isPathActive(item.path)
              : isParentActive(item.children);

            return (
              <div key={item.id} className={styles.menuItem}>
                {hasChildren ? (
                  <>
                    <button
                      className={`${styles.menuButton} ${isActive ? styles.active : ""}`}
                      onClick={() => toggleMenu(item.id)}
                    >
                      <span className={styles.menuIcon}>
                        {IconComponent && <IconComponent />}
                      </span>
                      <span className={styles.menuLabel}>{item.label}</span>
                      <ChevronDownIcon
                        className={`${styles.chevron} ${isExpanded ? styles.expanded : ""}`}
                        size={16}
                      />
                    </button>

                    <div
                      className={`${styles.subMenu} ${isExpanded ? styles.expanded : ""}`}
                    >
                      {item.children?.map((subItem) => (
                        <div key={subItem.id} className={styles.subMenuItem}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `${styles.subMenuLink} ${isActive ? styles.active : ""}`
                            }
                            onClick={closeMobile}
                          >
                            <span className={styles.subMenuText}>
                              {subItem.label}
                            </span>
                            {subItem.badge && (
                              <span className={styles.badge}>
                                {subItem.badge}
                              </span>
                            )}
                          </NavLink>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={item.path || "/"}
                    className={({ isActive }) =>
                      `${styles.menuButton} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeMobile}
                  >
                    <span className={styles.menuIcon}>
                      {IconComponent && <IconComponent />}
                    </span>
                    <span className={styles.menuLabel}>{item.label}</span>
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>
        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <span className={styles.menuIcon}>
              <LogoutIcon />
            </span>
            <span className={styles.menuLabel}>Logout</span>
          </button>
        </div>

        <button
          className={`${styles.collapseButton} ${isCollapsed ? styles.collapsed : ""}`}
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRightIcon size={20} />
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
