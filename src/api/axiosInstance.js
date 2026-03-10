// // // services/axiosInstance.js
// // import axios from "axios";

// // const axiosInstance = axios.create({
// //   baseURL: "http://localhost:8080/api",
// //   headers: {
// //     "Content-Type": "application/json"
// //   }
// // });

// // export default axiosInstance;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   validateStatus: function (status) {
//     return status >= 200 && status < 400; // ✅ now 302 is accepted
//   },
// });
// /* ===============================
//    REQUEST LOGGER
// ================================= */

// api.interceptors.request.use(
//   (config) => {
//     console.log("🚀 API REQUEST START");
//     console.log("URL:", `${config.baseURL}${config.url}`);
//     console.log("METHOD:", config.method?.toUpperCase());
//     console.log("HEADERS:", config.headers);

//     if (config.params) {
//       console.log("QUERY PARAMS:", config.params);
//     }

//     if (config.data) {
//       console.log("PAYLOAD:", config.data);
//     }

//     console.log("🚀 API REQUEST END");

//     return config;
//   },
//   (error) => {
//     console.error("❌ REQUEST ERROR:", error);
//     return Promise.reject(error);
//   }
// );

// /* ===============================
//    RESPONSE LOGGER
// ================================= */

// api.interceptors.response.use(
//   (response) => {
//     console.log("✅ API RESPONSE START");
//     console.log("URL:", response.config.url);
//     console.log("STATUS:", response.status);
//     console.log("RESPONSE DATA:", response.data);
//     console.log("✅ API RESPONSE END");

//     return response;
//   },
//   (error) => {
//     console.error("❌ API ERROR START");

//     if (error.response) {
//       console.error("URL:", error.config?.url);
//       console.error("STATUS:", error.response.status);
//       console.error("RESPONSE DATA:", error.response.data);
//     } else if (error.request) {
//       console.error("NO RESPONSE RECEIVED:", error.request);
//     } else {
//       console.error("ERROR MESSAGE:", error.message);
//     }

//     console.error("❌ API ERROR END");

//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "https://api.ywarchitects.com:443/api",
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: function (status) {
    return status >= 200 && status < 400; // accept 302
  },
});

/* ===============================
   REQUEST LOGGER + TOKEN
================================= */

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("accessToken");

    // ❌ Do NOT attach token for login
    if (token && !config.url.includes("/auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("🚀 API REQUEST START");
    console.log("URL:", `${config.baseURL}${config.url}`);
    console.log("METHOD:", config.method?.toUpperCase());
    console.log("HEADERS:", config.headers);

    if (config.params) {
      console.log("QUERY PARAMS:", config.params);
    }

    if (config.data) {
      console.log("PAYLOAD:", config.data);
    }

    console.log("🚀 API REQUEST END");

    return config;
  },
  (error) => {
    console.error("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

/* ===============================
   RESPONSE LOGGER
================================= */

api.interceptors.response.use(
  (response) => {
    console.log("✅ API RESPONSE START");
    console.log("URL:", response.config.url);
    console.log("STATUS:", response.status);
    console.log("RESPONSE DATA:", response.data);
    console.log("✅ API RESPONSE END");

    return response;
  },
  (error) => {
    console.error("❌ API ERROR START");

    if (error.response) {
      console.error("URL:", error.config?.url);
      console.error("STATUS:", error.response.status);
      console.error("RESPONSE DATA:", error.response.data);
    } else if (error.request) {
      console.error("NO RESPONSE RECEIVED:", error.request);
    } else {
      console.error("ERROR MESSAGE:", error.message);
    }

    console.error("❌ API ERROR END");

    return Promise.reject(error);
  }
);

export default api;