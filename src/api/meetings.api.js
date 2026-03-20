import axiosInstance from "./axiosInstance";

/* =========================================
   CREATE MEETING
   POST /axiosInstance/meetings/create?projectId=1&createdBy=2
========================================= */

export const createMeeting = (projectId, createdBy, meetingData) => {
  return axiosInstance.post("/meetings/create", meetingData, {
    params: {
      projectId,
      createdBy,
    },
  });
};

/* =========================================
   GET MEETINGS BY PROJECT
   GET /axiosInstance/meetings/project/{projectId}
========================================= */

export const getMeetingsByProject = (projectId) => {
  return axiosInstance.get(`/meetings/project/${projectId}`);
};

/* =========================================
   GET SINGLE MEETING
   GET /axiosInstance/meetings/{meetingId}
========================================= */

export const getMeetingById = (meetingId) => {
  return axiosInstance.get(`/meetings/${meetingId}`);
};

/* =========================================
   UPDATE MEETING
   PUT /axiosInstance/meetings/update/{meetingId}
========================================= */

export const updateMeeting = (meetingId, meetingData) => {
  return axiosInstance.put(`/meetings/update/${meetingId}`, meetingData);
};

/* =========================================
   ADD ATTENDEE
   POST /axiosInstance/meetings/{meetingId}/attendee?userId=3
========================================= */

export const addAttendee = (meetingId, userId) => {
  return axiosInstance.post(`/meetings/${meetingId}/attendee`, null, {
    params: {
      userId,
    },
  });
};

/* =========================================
   SEND MESSAGE
   POST /axiosInstance/meetings/{meetingId}/message
========================================= */

export const sendMeetingMessage = (
  meetingId,
  senderId,
  messageData,
  replyToId = null
) => {
  return axiosInstance.post(`/meetings/${meetingId}/message`, messageData, {
    params: {
      senderId,
      replyToId,
    },
  });
};

/* =========================================
   GET MEETING MESSAGES
   GET /axiosInstance/meetings/{meetingId}/messages
========================================= */

export const getMeetingMessages = (meetingId) => {
  return axiosInstance.get(`/meetings/${meetingId}/messages`);
};

/* =========================================
   DELETE MEETING
   DELETE /axiosInstance/meetings/delete/{meetingId}
========================================= */

export const deleteMeeting = (meetingId) => {
  return axiosInstance.delete(`/meetings/delete/${meetingId}`);
};