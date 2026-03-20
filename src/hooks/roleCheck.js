export const canManage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const allowedRoles = ["ADMIN", "CO_FOUNDER", "HR"];

  return allowedRoles.includes(role);
};