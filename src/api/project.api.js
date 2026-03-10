import api from "./axiosInstance";

export const createProject = (data) =>
  api.post("/projects", data);

export const quickCreateProject = (data) =>
  api.post("/projects/quick", data);

export const getProjectById = (projectId) =>
  api.get(`/projects/${projectId}`);
export const getAllProjects = (page = 0, size = 10) => {
  return api.get("/projects/getallprojects", {
    params: {
      page,
      size,
    },
  });
};
/* =====================================================
   UPDATE FULL PROJECT (MULTIPART)
   PUT /api/projects/{projectId}
===================================================== */

export const updateProject = (
  projectId,
  projectData,
  logoFile
) => {
  const formData = new FormData();

  // project object must be stringified
  formData.append(
    "project",
    new Blob([JSON.stringify(projectData)], {
      type: "application/json",
    })
  );

  if (logoFile) {
    formData.append("logo", logoFile);
  }

  return api.put(`/projects/${projectId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =====================================================
   UPDATE PROJECT STATUS
   PUT /api/projects/{projectId}/status
===================================================== */

export const updateProjectStatus = (
  projectId,
  status
) => {
  return api.put(
    `/projects/${projectId}/status`,
    { status }
  );
};

/* =====================================================
   UPDATE PROJECT PRIORITY
   PUT /api/projects/{projectId}/priority
===================================================== */

export const updateProjectPriority = (
  projectId,
  priority
) => {
  return api.put(
    `/projects/${projectId}/priority`,
    { priority }
  );
};

/* =====================================================
   UPDATE PROJECT DETAILS
   PUT /api/projects/{projectId}/details
===================================================== */

export const updateProjectDetails = (
  projectId,
  payload
) => {
  // payload: { projectName, projectDetails, address, city }
  return api.put(
    `/projects/${projectId}/details`,
    payload
  );
};

/* =====================================================
   UPDATE PROJECT LOCATION
   PUT /api/projects/{projectId}/location
===================================================== */

export const updateProjectLocation = (
  projectId,
  payload
) => {
  // payload: { address, city, latitude, longitude }
  return api.put(
    `/projects/${projectId}/location`,
    payload
  );
};

/* =====================================================
   UPDATE PROJECT AREA
   PUT /api/projects/{projectId}/area
===================================================== */

export const updateProjectArea = (
  projectId,
  payload
) => {
  // payload: { plotArea, totalBuiltUpArea, totalCarpetArea }
  return api.put(
    `/projects/${projectId}/area`,
    payload
  );
};

/* =====================================================
   SET PROJECT DATES
   PUT /api/projects/{projectId}/dates
===================================================== */

export const setProjectDates = (
  projectId,
  payload
) => {
  // payload: { startDate, expectedEndDate }
  return api.put(
    `/projects/${projectId}/dates`,
    payload
  );
};

/* ===============================
   GET ALL PROJECTS (PAGINATION)
================================ */


export const addUsersToProject = (projectId, userIds) => {
  return api.put(`/projects/addusers/${projectId}`, userIds);
};