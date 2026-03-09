import React, { useState } from 'react';
import { Table, Pagination, StatusBadge } from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import { PlusIcon, FilterIcon, EditIcon, SearchIcon } from '../../components/Icons/Icons';
import styles from './ManageProjects.module.scss';

interface Project {
  id: number;
  projectName: string;
  companyName: string;
  projectType: string;
  projectStatus: string;
  availability: string;
}

const projectsData: Project[] = [
  { id: 1, projectName: 'Visions Indradhanu', companyName: 'Vision developers', projectType: 'Residential and commercial', projectStatus: 'Completed', availability: 'Completed' },
  { id: 2, projectName: 'Vastu Pooja', companyName: 'Navya developers', projectType: 'Residential and commercial', projectStatus: 'Completed', availability: 'Completed' },
  { id: 3, projectName: 'Maitri Nx', companyName: 'Vision developers', projectType: 'Residential and commercial', projectStatus: 'Completed', availability: 'Completed' },
  { id: 4, projectName: 'Maitri Nx', companyName: 'Vision developers', projectType: 'Residential and commercial', projectStatus: 'Completed', availability: 'Completed' },
  { id: 5, projectName: 'Visions Indradhanu', companyName: 'Vision developers', projectType: 'Residential and commercial', projectStatus: 'Completed', availability: 'Completed' },
  { id: 6, projectName: 'Vastu Pooja', companyName: 'Navya developers', projectType: 'Residential and commercial', projectStatus: 'Completed', availability: 'Completed' },
  { id: 7, projectName: 'Maitri Nx', companyName: 'Vision developers', projectType: 'Residential and commercial', projectStatus: 'Completed', availability: 'Completed' },
  { id: 8, projectName: 'Green Valley Township', companyName: 'Urban Developers', projectType: 'Township', projectStatus: 'Ongoing', availability: 'In Progress' },
  { id: 9, projectName: 'Skyline Heights', companyName: 'Royal Builders', projectType: 'Commercial', projectStatus: 'Pending', availability: 'Awaiting NOC' },
  { id: 10, projectName: 'Serene Gardens', companyName: 'Nature Homes', projectType: 'Residential', projectStatus: 'Ongoing', availability: 'Design Phase' },
];

const filterTags = [
  { id: 'all', label: 'All' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'mixed', label: 'Mixed Use' },
  { id: 'township', label: 'Township' },
];

export const ManageProjects: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const itemsPerPage = 7;
  const totalItems = 25;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const columns = [
    { 
      key: 'id', 
      header: 'Sr', 
      width: '60px',
      render: (_: Project, index: number) => (currentPage - 1) * itemsPerPage + index + 1 
    },
    { key: 'projectName', header: 'Project Name' },
    { key: 'companyName', header: 'Company Name' },
    { key: 'projectType', header: 'Project Type' },
    { 
      key: 'projectStatus', 
      header: 'Project Status',
      render: (item: Project) => <StatusBadge status={item.projectStatus} />
    },
    { 
      key: 'availability', 
      header: 'Project Status',
      render: (item: Project) => <StatusBadge status={item.availability} />
    },
    { 
      key: 'actions', 
      header: 'Check Availability',
      width: '140px',
      render: () => (
        <button className={styles.actionButton}>
          <EditIcon size={16} />
          Edit
        </button>
      )
    },
  ];

  const filteredData = projectsData.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         project.projectType.toLowerCase().includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={styles.projectsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Manage Projects</h1>
        <div className={styles.headerActions}>
          <Button 
            variant="primary" 
            leftIcon={<PlusIcon size={16} />}
            className={styles.addButton}
          >
            Add new Project
          </Button>
          <Button 
            variant="secondary" 
            leftIcon={<FilterIcon size={16} />}
            className={styles.filterButton}
          >
            Filters
          </Button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIconWrapper}>
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterTags}>
            {filterTags.map((tag) => (
              <button
                key={tag.id}
                className={`${styles.filterTag} ${activeFilter === tag.id ? styles.active : ''}`}
                onClick={() => setActiveFilter(tag.id)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredData.slice(0, itemsPerPage)}
          keyExtractor={(item) => item.id}
        />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ManageProjects;
