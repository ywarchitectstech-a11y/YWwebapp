import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PlaceholderPage.module.scss';

const getPageInfo = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const title = segments
    .map(s => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
    .join(' > ');
  
  return {
    title: title || 'Page',
    module: segments[0]?.charAt(0).toUpperCase() + segments[0]?.slice(1) || 'Module'
  };
};

export const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const { title, module } = getPageInfo(location.pathname);

  return (
    <div className={styles.placeholderPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>
      <div className={styles.contentCard}>
        <div className={styles.iconWrapper}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <h2 className={styles.title}>Coming Soon</h2>
        <p className={styles.description}>
          The {module} module is under development. This feature will be available soon with full functionality.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
