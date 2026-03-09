import React from 'react';
import styles from './Tabs.module.scss';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  iconType?: 'total' | 'today' | 'pending' | 'upcoming';
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon && (
            <span className={`${styles.tabIcon} ${tab.iconType ? styles[tab.iconType] : ''}`}>
              {tab.icon}
            </span>
          )}
          <span className={styles.tabLabel}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
