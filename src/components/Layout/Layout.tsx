import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSidebarStore } from '../../store/sidebarStore';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Layout.module.scss';

export const Layout: React.FC = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={`${styles.mainWrapper} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
        <Header />
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
