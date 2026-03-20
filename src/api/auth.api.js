import api from "./axiosInstance";

/* ===============================
   LOGIN
================================ */


export const login = (email, password) => {
  return api.post("/auth/login", null, {
    params: {
      email: email,
      password: password,
    },
  });
};
/* ===============================
   ADMIN LOGIN
================================ */
export const adminLogin = (email, password) => {
  return api.post("/auth/adminlogin", null, {
    params: {
      email: email,
      password: password,
    },
  });
};
/* ===============================
   REFRESH TOKEN
================================ */

export const refreshToken = (refreshToken) => {
  return api.post("/auth/refresh", {
    refreshToken,
  });
};

/* ===============================
   LOGOUT
================================ */

export const logout = (refreshToken) => {
  return api.post("/auth/logout", {
    refreshToken,
  });
};

// ── CLIENT LOGIN ─────────────────────────────
export const clientLogin = (email, password) => {
  const params = new URLSearchParams();
  params.append("email", email);
  params.append("password", password);

  return api.post("/auth/clientlogin", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};