// export interface NavSubItem {
//   id: string;
//   label: string;
//   path: string;
//   badge?: number;
// }

// export interface NavItem {
//   id: string;
//   label: string;
//   icon: string;
//   path?: string;
//   children?: NavSubItem[];
// }

// export const navigationData: NavItem[] = [
//   {
//     id: 'dashboard',
//     label: 'Dashboard',
//     icon: 'dashboard',
//     path: '/',
//   },
//   {
//     id: 'projects',
//     label: 'Projects',
//     icon: 'projects',
//     children: [
//       { id: 'manage-projects', label: 'Manage Projects', path: '/projects/manage' },
//       { id: 'add-project', label: 'Add Projects', path: '/projects/add' },
//       { id: 'all-quotations', label: "All Quotations ", path: '/projects/all-quotations' },
//     ],
//   },
//   {
//     id: 'preSales',
//     label: 'Pre Sales',
//     icon: 'preSales',
//     children: [
//       { id: 'presales-new', label: 'New', path: '/presales/new',
//         // badge: 5

//        },
//       // { id: 'presales-total-open', label: 'Total Open', path: '/presales/total-open' },
//       // { id: 'presales-bookings', label: 'Bookings', path: '/presales/bookings' },
//       { id: 'presales-all', label: 'All Presales', path: '/presales/allpresales' },
//     ],
//   },
//   {
//     id: 'postSales',
//     label: 'Postsales',
//     icon: 'postSales',
//     children: [
//       { id: 'postsales-new', label: 'New', path: '/postsales/new' },
//       { id: 'postsales-all', label: 'All PostSales', path: '/postsales/all' },
//       // { id: 'postsales-completed', label: 'Completed', path: '/postsales/completed' },
//       // { id: 'postsales-cancelled', label: 'Cancelled', path: '/postsales/cancelled' },
//       { id: 'postsales-invoices', label: 'Invoices', path: '/postsales/invoices' },
//       // { id: 'postsales-demand-letters', label: 'Demand Letters', path: '/postsales/demand-letters' },
//     ],
//   },
//   {
//     id: 'clients',
//     label: 'Clients',
//     icon: 'clients',
//     children: [
//       { id: 'manage-clients', label: 'Manage Clients', path: '/clients/allclients' },
//       { id: 'add-new-client', label: 'Add New Client', path: '/clients/add' },
//     ],
//   },
//   {
//     id: 'reports',
//     label: 'Reports',
//     icon: 'reports',
//     children: [
//       { id: 'inventory-report', label: 'Inventory Report', path: '/reports/inventory' },
//       { id: 'financial-report', label: 'Financial Report', path: '/reports/financial' },
//       { id: 'heading-wise-report', label: 'Heading Wise Report', path: '/reports/heading-wise' },
//       { id: 'stage-wise-report', label: 'Stage Wise Report', path: '/reports/stage-wise' },
//     ],
//   },
//   {
//     id: 'accounts',
//     label: 'Accounts',
//     icon: 'accounts',
//     children: [
//       { id: 'payment-receipts', label: 'Payment Receipts', path: '/accounts/payment-receipts' },
//       { id: 'payment-vouchers', label: 'Payment Vouchers', path: '/accounts/payment-vouchers' },
//       { id: 'bank-accounts', label: 'Bank Accounts', path: '/accounts/bank-accounts' },
//     ],
//   },
//   // {
//   //   id: 'bmsBilling',
//   //   label: 'BMS Billing',
//   //   icon: 'billing',
//   //   children: [
//   //     { id: 'billing-dashboard', label: 'Dashboard', path: '/bms-billing/dashboard' },
//   //     { id: 'tax-invoices', label: 'Tax Invoices', path: '/bms-billing/tax-invoices' },
//   //     { id: 'account-statement', label: 'Account Statement', path: '/bms-billing/account-statement' },
//   //     { id: 'billing-payment-receipts', label: 'Payment Receipts', path: '/bms-billing/payment-receipts' },
//   //     { id: 'billing-company', label: 'Billing Company', path: '/bms-billing/billing-company' },
//   //   ],
//   // },
//   {
//     id: 'hr',
//     label: 'HR',
//     icon: 'hr',
//     children: [
//       { id: 'manage-employees', label: 'Manage Employees', path: 'employees/all' },
//       { id: 'add-employee', label: 'Add New Employee', path: 'employees/add' },
//       // { id: 'data-reassign', label: 'Data Re-Assign', path: '/hr/data-reassign' },
//       // { id: 'employee-roles', label: 'Employee Roles', path: '/hr/employee-roles' },
//       // { id: 'import-employees', label: 'Import Employees', path: '/hr/import-employees' },
//       // { id: 'employees-location', label: 'Employees Location', path: '/hr/employees-location' },
//     ],
//   },
// ];

import type { UserRole } from "../store/userStore"; // adjust path as needed

export interface NavSubItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  badge?: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: NavSubItem[];
}

// ── Permission Map ────────────────────────────────────────────
// "ALL" = every role can see it
// Array = only those roles can see it
const NAV_PERMISSIONS: Record<string, UserRole[] | "ALL"> = {
  // Dashboard
  dashboard: "ALL",

  // Projects
  "manage-projects": [
    "ADMIN",
    "CO_FOUNDER",
    "SR_ARCHITECT",
    "JR_ARCHITECT",
    "SR_ENGINEER",
    "DRAFTSMAN",
    "LIAISON_MANAGER",
    "LIAISON_OFFICER",
    "LIAISON_ASSISTANT",
    "HR",
  ],
  "add-project": ["ADMIN", "CO_FOUNDER", "SR_ARCHITECT"],
  "all-quotations": [
    "ADMIN",
    "CO_FOUNDER",
    "SR_ARCHITECT",
    "JR_ARCHITECT",
    "CLIENT",
  ],

  // Pre Sales
  "presales-new": [
    "ADMIN",
    "CO_FOUNDER",
    "SR_ARCHITECT",
    "LIAISON_MANAGER",
    "LIAISON_OFFICER",
    "LIAISON_ASSISTANT",
    "HR",
  ],
  "presales-all": [
    "ADMIN",
    "CO_FOUNDER",
    "SR_ARCHITECT",
    "LIAISON_MANAGER",
    "LIAISON_OFFICER",
    "HR",
    "CLIENT",
  ],

  // Post Sales
  "postsales-new": ["ADMIN", "CO_FOUNDER", "SR_ARCHITECT", "HR"],
  "postsales-all": [
    "ADMIN",
    "CO_FOUNDER",
    "SR_ARCHITECT",
    "JR_ARCHITECT",
    "HR",
    "CLIENT",
  ],
  "postsales-invoices": ["ADMIN", "CO_FOUNDER", "HR"],

  // Clients
  "manage-clients": [
    "ADMIN",
    "CO_FOUNDER",
    "SR_ARCHITECT",
    "JR_ARCHITECT",
    "LIAISON_MANAGER",
    "LIAISON_OFFICER",
    "HR",
  ],
  "add-new-client": [
    "ADMIN",
    "CO_FOUNDER",
    "SR_ARCHITECT",
    "LIAISON_MANAGER",
    "HR",
  ],

  // Reports
  "inventory-report": ["ADMIN", "CO_FOUNDER"],
  "financial-report": ["ADMIN", "CO_FOUNDER"],
  "heading-wise-report": ["ADMIN", "CO_FOUNDER", "SR_ARCHITECT"],
  "stage-wise-report": [
    "ADMIN",
    "CO_FOUNDER",
    "SR_ARCHITECT",
    "JR_ARCHITECT",
    "SR_ENGINEER",
  ],

  // Accounts
  "payment-receipts": ["ADMIN", "CO_FOUNDER"],
  "payment-vouchers": ["ADMIN", "CO_FOUNDER"],
  "bank-accounts": ["ADMIN", "CO_FOUNDER"],

  // HR
  "active-employees": ["ADMIN", "CO_FOUNDER", "HR"],
  "manage-employees": ["ADMIN", "CO_FOUNDER", "HR"],
  // 'all-employees': ['ADMIN', 'CO_FOUNDER', 'HR'],
  "add-employee": ["ADMIN", "CO_FOUNDER", "HR"],
};

// ── Full nav definition ───────────────────────────────────────
export const navigationData: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
    path: "/",
  },

  {
    id: "preSales",
    label: "Enquiry",
    icon: "preSales",
    children: [
      {
        id: "presales-new",
        label: "New",
        path: "/presales/new",
        icon: "plus",
      },
      {
        id: "presales-all",
        label: "All Enquiry",
        path: "/presales/allpresales",
        icon: "list",
      },
    ],
  },

  {
    id: "postSales",
    label: "Projects",
    icon: "postSales",
    children: [
      {
        id: "postsales-new",
        label: "New",
        path: "/postsales/new",
        icon: "plus",
      },
      {
        id: "postsales-all",
        label: "All Projects",
        path: "/postsales/all",
        icon: "folder",
      },
      {
        id: "postsales-invoices",
        label: "Invoices",
        path: "/postsales/invoices",
        icon: "invoice",
      },
    ],
  },

  {
    id: "projects",
    label: "Sites",
    icon: "projects",
    children: [
      {
        id: "manage-projects",
        label: "Manage Sites",
        path: "/projects/manage",
        icon: "grid",
      },
    ],
  },

  {
    id: "clients",
    label: "Clients",
    icon: "clients",
    children: [
      {
        id: "manage-clients",
        label: "Manage Clients",
        path: "/clients/allclients",
        icon: "users",
      },
      {
        id: "add-new-client",
        label: "Add New Client",
        path: "/clients/add",
        icon: "userPlus",
      },
    ],
  },

  {
    id: "accounts",
    label: "Accounts",
    icon: "accounts",
    children: [
      {
        id: "payment-receipts",
        label: "Payment Receipts",
        path: "/accounts/payment-receipts",
        icon: "receipt",
      },
      {
        id: "payment-vouchers",
        label: "Payment Vouchers",
        path: "/accounts/payment-vouchers",
        icon: "voucher",
      },
      {
        id: "bank-accounts",
        label: "Bank Accounts",
        path: "/accounts/bank-accounts",
        icon: "bank",
      },
    ],
  },

  {
    id: "hr",
    label: "HR",
    icon: "hr",
    children: [
      {
        id: "manage-employees",
        label: "Manage Employees",
        path: "employees/all",
        icon: "hr",
      },
      {
        id: "active-employees",
        label: "Inactive Employees",
        path: "employees/active",
        icon: "userOff",
      },
      {
        id: "add-employee",
        label: "Add New Employee",
        path: "employees/add",
        icon: "userPlus",
      },
    ],
  },
];
// ── Filter function ───────────────────────────────────────────
function canAccess(itemId: string, role: UserRole): boolean {
  const rule = NAV_PERMISSIONS[itemId];
  if (!rule) return false;
  if (rule === "ALL") return true;
  return (rule as UserRole[]).includes(role);
}

export function getFilteredNavigation(role: UserRole): NavItem[] {
  return navigationData.reduce<NavItem[]>((acc, item) => {
    if (!item.children) {
      if (canAccess(item.id, role)) acc.push(item);
      return acc;
    }
    const allowedChildren = item.children.filter((child) =>
      canAccess(child.id, role),
    );
    if (allowedChildren.length > 0) {
      acc.push({ ...item, children: allowedChildren });
    }
    return acc;
  }, []);
}
