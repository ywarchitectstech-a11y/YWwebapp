import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverable?: boolean;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  noBorder?: boolean;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  hoverable = false 
}) => (
  <div className={`
    ${styles.card} 
    ${noPadding ? styles.noPadding : ''} 
    ${hoverable ? styles.hoverable : ''}
    ${className}
  `}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  title, 
  subtitle, 
  actions,
  noBorder = false 
}) => (
  <div className={`${styles.cardHeader} ${noBorder ? styles.noBorder : ''}`}>
    <div>
      <h3 className={styles.cardTitle}>{title}</h3>
      {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
    </div>
    {actions && <div className={styles.cardActions}>{actions}</div>}
  </div>
);

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`${styles.cardContent} ${className}`}>{children}</div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`${styles.cardFooter} ${className}`}>{children}</div>
);

export default Card;
