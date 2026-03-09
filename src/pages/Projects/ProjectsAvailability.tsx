import React from 'react';
import styles from './ManageProjects.module.scss';

export const ProjectsAvailability: React.FC = () => {
  return (
    <div className={styles.projectsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Projects Availability</h1>
      </div>
      <div className={styles.tableCard} style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
        <p>Projects availability tracking coming soon...</p>
      </div>
    </div>
  );
};

export default ProjectsAvailability;
