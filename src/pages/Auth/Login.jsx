// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useLogin } from "../../api/hooks/useAuth";
// // import { useAuth } from "../../components/AuthContext";

// // import styles from "./LoginPage.module.scss";

// // import {
// //   showError,
// //   showSuccess,
// //   showLoading,
// //   dismissToast,
// // } from "../../components/Notification/toast";

// // const LoginPage = () => {
// //   const navigate = useNavigate();
// //   const { login } = useAuth();

// //   const { mutate, isPending } = useLogin();

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");

// //   const handleLogin = () => {
// //     const loadingToast = showLoading("Logging in...");

// //     mutate(
// //       { email, password },
// //       {
// //         onSuccess: (res) => {
// //           dismissToast(loadingToast);

// //           const { accessToken, refreshToken } = res.data;

// //           login(accessToken, refreshToken);

// //           showSuccess("Login successful");

// //           navigate("/");
// //         },

// //         onError: (error) => {
// //           dismissToast(loadingToast);

// //           showError(error?.response?.data || "Invalid email or password");
// //         },
// //       },
// //     );
// //   };

// //   return (
// //     <div className={styles.loginPage}>
// //       <div className={styles.loginCard}>
// //         <h2>YW Architects</h2>

// //         <input
// //           className={styles.input}
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //         />

// //         <input
// //           className={styles.input}
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //         />

// //         <button
// //           className={styles.loginBtn}
// //           onClick={handleLogin}
// //           disabled={isPending}
// //         >
// //           {isPending ? "Logging in..." : "Login"}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginPage;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLogin } from "../../api/hooks/useAuth";
// import { useAuth } from "../../components/AuthContext";
// import logo from "../../assets/logo.png";
// import styles from "./LoginPage.module.scss";
// import { useUserStore } from "../../store/userStore";
// import { jwtDecode } from "jwt-decode";
// import {
//   showError,
//   showSuccess,
//   showLoading,
//   dismissToast,
// } from "../../components/Notification/toast";

// // ── SVG Icons (inline, no extra dep) ──────────────────────────
// const BuildingIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect x="3" y="3" width="18" height="18" rx="2" />
//     <path d="M9 22V12h6v10" />
//     <path d="M9 7h.01M12 7h.01M15 7h.01" />
//   </svg>
// );

// const MailIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect x="2" y="4" width="20" height="16" rx="2" />
//     <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
//   </svg>
// );

// const LockIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//     <path d="M7 11V7a5 5 0 0 1 10 0v4" />
//   </svg>
// );

// const EyeIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// const EyeOffIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
//     <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
//     <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
//     <line x1="2" x2="22" y1="2" y2="22" />
//   </svg>
// );

// const ArrowRightIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     width="16"
//     height="16"
//   >
//     <path d="M5 12h14M12 5l7 7-7 7" />
//   </svg>
// );

// // ── Component ─────────────────────────────────────────────────
// const LoginPage = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const { mutate, isPending } = useLogin();
//   const setUser = useUserStore((s) => s.setUser);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = () => {
//     const loadingToast = showLoading("Logging in...");

//     mutate(
//       { email, password },
//       {
//         onSuccess: (res) => {
//           dismissToast(loadingToast);

//           const { accessToken, refreshToken } = res.data;

//           const decoded = jwtDecode(accessToken);

//           const userData = {
//             email: decoded.sub,
//             role: decoded.role,
//             userId: decoded.userId,
//           };

//           // store user data
//           localStorage.setItem("user", JSON.stringify(userData));
//           // update Zustand store
//           setUser(userData);
//           // update auth state
//           login(accessToken, refreshToken);

//           showSuccess("Login successful");

//           navigate("/");
//         },
//       },
//     );
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !isPending) handleLogin();
//   };

//   return (
//     <div className={styles.loginPage}>
//       <div className={styles.blob} />

//       <div className={styles.loginCard}>
//         {/* Brand */}
//         <div className={styles.brandHeader}>
//           <div className={styles.logoMark}>
//             {/* <BuildingIcon /> */}
//             <img src={logo} alt="" />
//           </div>
//           <h1 className={styles.brandName}>YW Architects</h1>
//           {/* <p className={styles.brandTagline}>Project Management Studio</p> */}
//         </div>

//         {/* Form heading */}
//         <h2 className={styles.formTitle}>Welcome back</h2>
//         <p className={styles.formSubtitle}>
//           Sign in to your account to continue
//         </p>

//         {/* Fields */}
//         <div className={styles.fieldGroup}>
//           {/* Email */}
//           <div className={styles.fieldWrapper}>
//             <label className={styles.fieldLabel} htmlFor="email">
//               Email address
//             </label>
//             <div className={styles.inputWrapper}>
//               <span className={styles.inputIcon}>
//                 <MailIcon />
//               </span>
//               <input
//                 id="email"
//                 className={styles.input}
//                 type="email"
//                 placeholder="you@ywarchitects.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 autoComplete="email"
//                 disabled={isPending}
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div className={styles.fieldWrapper}>
//             <label className={styles.fieldLabel} htmlFor="password">
//               Password
//             </label>
//             <div className={styles.inputWrapper}>
//               <span className={styles.inputIcon}>
//                 <LockIcon />
//               </span>
//               <input
//                 id="password"
//                 className={`${styles.input} ${styles.hasRightAction}`}
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 autoComplete="current-password"
//                 disabled={isPending}
//               />
//               <button
//                 type="button"
//                 className={styles.passwordToggle}
//                 onClick={() => setShowPassword((v) => !v)}
//                 tabIndex={-1}
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           className={styles.loginBtn}
//           onClick={handleLogin}
//           disabled={isPending || !email || !password}
//         >
//           {isPending ? (
//             <>
//               <span className={styles.spinner} />
//               Signing in…
//             </>
//           ) : (
//             <>
//               Sign In
//               <ArrowRightIcon />
//             </>
//           )}
//         </button>

//         {/* Footer */}
//         <div className={styles.cardFooter}>
//           <span className={styles.footerText}>YW Architects Dashboard</span>
//           <span className={styles.footerVersion}>· v1.0</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLogin } from "../../api/hooks/useAuth";
// import { useAuth } from "../../components/AuthContext";

// import styles from "./LoginPage.module.scss";

// import {
//   showError,
//   showSuccess,
//   showLoading,
//   dismissToast,
// } from "../../components/Notification/toast";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const { mutate, isPending } = useLogin();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = () => {
//     const loadingToast = showLoading("Logging in...");

//     mutate(
//       { email, password },
//       {
//         onSuccess: (res) => {
//           dismissToast(loadingToast);

//           const { accessToken, refreshToken } = res.data;

//           login(accessToken, refreshToken);

//           showSuccess("Login successful");

//           navigate("/");
//         },

//         onError: (error) => {
//           dismissToast(loadingToast);

//           showError(error?.response?.data || "Invalid email or password");
//         },
//       },
//     );
//   };

//   return (
//     <div className={styles.loginPage}>
//       <div className={styles.loginCard}>
//         <h2>YW Architects</h2>

//         <input
//           className={styles.input}
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           className={styles.input}
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           className={styles.loginBtn}
//           onClick={handleLogin}
//           disabled={isPending}
//         >
//           {isPending ? "Logging in..." : "Login"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../api/hooks/useAuth";
import { useAuth } from "../../components/AuthContext";
import logo from "../../assets/logo.png";
import styles from "./LoginPage.module.scss";
import { useUserStore } from "../../store/userStore";
import { jwtDecode } from "jwt-decode";
import {
  showError,
  showSuccess,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";

// ── SVG Icons (inline, no extra dep) ──────────────────────────
const BuildingIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 22V12h6v10" />
    <path d="M9 7h.01M12 7h.01M15 7h.01" />
  </svg>
);

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mutate, isPending } = useLogin();
  const setUser = useUserStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const loadingToast = showLoading("Logging in...");

    mutate(
      { email, password },
      {
        onSuccess: (res) => {
          dismissToast(loadingToast);

          const { accessToken, refreshToken } = res.data;

          const decoded = jwtDecode(accessToken);

          const userData = {
            email: decoded.sub,
            role: decoded.role,
            userId: decoded.userId,
          };

          // store user data
          localStorage.setItem("user", JSON.stringify(userData));
          // update Zustand store
          setUser(userData);
          // update auth state
          login(accessToken, refreshToken);

          showSuccess("Login successful");

          navigate("/");
        },
      },
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isPending) handleLogin();
  };

  return (
    <div className={styles.loginPage}>
      {/* ── Client Portal Button — fixed top-right corner ── */}
      <button
        className={styles.clientPortalBtn}
        onClick={() => navigate("/clientlogin")}
        title="Client Portal Login"
      >
        <span className={styles.clientPortalIcon}>
          {/* Person / client icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <span className={styles.clientPortalLabel}>Client Portal</span>
        <span className={styles.clientPortalArrow}>→</span>
      </button>

      <div className={styles.blob} />

      <div className={styles.loginCard}>
        {/* Brand */}
        <div className={styles.brandHeader}>
          <div className={styles.logoMark}>
            {/* <BuildingIcon /> */}
            <img src={logo} alt="" />
          </div>
          <h1 className={styles.brandName}>YW Architects</h1>
          {/* <p className={styles.brandTagline}>Project Management Studio</p> */}
        </div>

        {/* Form heading */}
        <h2 className={styles.formTitle}>Welcome back</h2>
        <p className={styles.formSubtitle}>
          Sign in to your account to continue
        </p>

        {/* Fields */}
        <div className={styles.fieldGroup}>
          {/* Email */}
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel} htmlFor="email">
              Email address
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <MailIcon />
              </span>
              <input
                id="email"
                className={styles.input}
                type="email"
                placeholder="you@ywarchitects.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.fieldWrapper}>
            <label className={styles.fieldLabel} htmlFor="password">
              Password
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <LockIcon />
              </span>
              <input
                id="password"
                className={`${styles.input} ${styles.hasRightAction}`}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
                disabled={isPending}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          className={styles.loginBtn}
          onClick={handleLogin}
          disabled={isPending || !email || !password}
        >
          {isPending ? (
            <>
              <span className={styles.spinner} />
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowRightIcon />
            </>
          )}
        </button>

        {/* Footer */}
        <div className={styles.cardFooter}>
          <span className={styles.footerText}>YW Architects Dashboard</span>
          <span className={styles.footerVersion}>· v1.0</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
