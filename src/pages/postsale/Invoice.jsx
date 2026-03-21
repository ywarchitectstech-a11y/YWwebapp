// import { useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { usePostSalesById } from "../../api/hooks/usePostSales";
// import html2pdf from "html2pdf.js";
// import styles from "./InvoicePage.module.scss";

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const fmt = (dt) => {
//   if (!dt) return "…………………";
//   return new Date(dt).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// };

// const fmtMoney = (val) => {
//   if (val == null) return "—";
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(val);
// };

// // ─── Company Constants ────────────────────────────────────────────────────────
// const COMPANY = {
//   name: "YW ARCHITECTS",
//   address:
//     "Office No.313, Fortuna Business Hub, Near Shivar Chouk, Pimple Saudagar, Pune - 411018",
//   phones: ["020 40038445", "9623901901"],
//   email: "yogeshrw24@gmail.com",
//   signatory: "Ar. Yogesh Wakchaure",
// };

// const BANK = {
//   name: "…………………",
//   accNo: "…………………",
//   ifsc: "…………………",
//   branch: "…………………",
//   chqName: "YW ARCHITECTS",
// };

// // ─── InvoicePage ──────────────────────────────────────────────────────────────
// export default function InvoicePage() {
//   const { postSalesId, invoiseId, type } = useParams(); // type = "proforma" | "tax"
//   const navigate = useNavigate();
//   const printRef = useRef();

//   const { data, isLoading, isError } = usePostSalesById(postSalesId);

//   // ── Loading ──
//   if (isLoading) {
//     return (
//       <div className={styles.loadingPage}>
//         <div className={styles.spinner} />
//         <p>Loading invoice...</p>
//       </div>
//     );
//   }

//   if (isError || !data) {
//     return (
//       <div className={styles.errorPage}>
//         <span>⚠️</span>
//         <h3>Invoice not found</h3>
//         <button onClick={() => navigate(-1)}>← Go Back</button>
//       </div>
//     );
//   }

//   // Pick correct invoice list based on type param
//   const invoiceList =
//     type === "tax" ? data.taxInvoices || [] : data.proformaInvoices || [];

//   // If invId param present, show that one; else show latest
//   const invoice = invoiceList[invoiseId - 1] || {};
//   const client = data.client || {};
//   const project = data.project || {};

//   const net = Number(invoice.netAmount || 0);
//   const cgst = Number(invoice.cgstAmount || 0);
//   const sgst = Number(invoice.sgstAmount || 0);
//   const gross = Number(invoice.grossAmount || 0);

//   const isTax = type === "tax";
//   const invoiceLabel = isTax ? "TAX INVOICE" : "PROFORMA INVOICE";

//   // ── Print ──
//   const handlePrint = () => {
//     window.print();
//   };

//   // ── PDF Download ──
//   const handleDownloadPDF = () => {
//     const opt = {
//       margin: [8, 8, 8, 8],
//       filename: `${invoiceLabel.replace(" ", "_")}_${invoice.invoiceNumber || postSalesId}.pdf`,
//       html2canvas: { scale: 2, useCORS: true },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//     };
//     html2pdf().set(opt).from(printRef.current).save();
//   };

//   return (
//     <div className={styles.pageShell}>
//       {/* ── Toolbar (hidden on print) ── */}
//       <div className={styles.toolbar}>
//         <button className={styles.backBtn} onClick={() => navigate(-1)}>
//           ← Back
//         </button>
//         <div className={styles.toolbarRight}>
//           <button className={styles.toolBtn} onClick={handlePrint}>
//             🖨 Print
//           </button>
//           <button
//             className={`${styles.toolBtn} ${styles.toolBtnPrimary}`}
//             onClick={handleDownloadPDF}
//           >
//             ⬇ Download PDF
//           </button>
//         </div>
//       </div>

//       {/* ── A4 Invoice Sheet ── */}
//       <div className={styles.a4Wrap}>
//         <div className={styles.invoiceSheet} ref={printRef}>
//           {/* ══ HEADER ══ */}
//           <div className={styles.header}>
//             <div className={styles.headerLeft}>
//               <div className={styles.companyName}>{COMPANY.name}</div>
//               <div className={styles.companyAddress}>
//                 Address :- {COMPANY.address}
//               </div>
//               <div className={styles.companyContact}>
//                 {COMPANY.phones.join(", ")}
//               </div>
//               <div className={styles.companyContact}>
//                 E-mail :- {COMPANY.email}
//               </div>
//             </div>
//             <div className={styles.headerRight}>
//               <div className={styles.invoiceTitle}>{invoiceLabel}</div>
//               <table className={styles.metaTable}>
//                 <tbody>
//                   <tr>
//                     <td className={styles.metaLabel}>Invoice No.</td>
//                     <td className={styles.metaValue}>
//                       {invoice.invoiceNumber || "…………………"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className={styles.metaLabel}>Date</td>
//                     <td className={styles.metaValue}>
//                       {fmt(invoice.issueDate)}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className={styles.metaLabel}>Valid Till</td>
//                     <td className={styles.metaValue}>
//                       {fmt(invoice.validTill)}
//                     </td>
//                   </tr>
//                   {invoice.status && (
//                     <tr>
//                       <td className={styles.metaLabel}>Status</td>
//                       <td className={styles.metaValue}>
//                         <span
//                           className={styles.statusPill}
//                           style={
//                             invoice.paid
//                               ? { background: "#dcfce7", color: "#14532d" }
//                               : { background: "#fef9c3", color: "#713f12" }
//                           }
//                         >
//                           {invoice.status}
//                         </span>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className={styles.dividerThick} />

//           {/* ══ GSTIN ROW ══ */}
//           <div className={styles.gstinRow}>
//             <span>
//               <strong>GSTIN:</strong>{" "}
//               {invoice.clientGstin || "………………………………………………"}
//             </span>
//           </div>

//           <div className={styles.divider} />

//           {/* ══ CLIENT DETAILS ══ */}
//           <div className={styles.clientSection}>
//             <div className={styles.clientSectionTitle}>DETAILS OF CLIENT</div>
//             <div className={styles.clientGrid}>
//               <div>
//                 <div className={styles.clientRow}>
//                   <span className={styles.clientLabel}>NAME</span>
//                   <span className={styles.clientValue}>
//                     {invoice.clientName || client.name || "………………………………………"}
//                   </span>
//                 </div>
//                 <div className={styles.clientRow}>
//                   <span className={styles.clientLabel}>Address</span>
//                   <span className={styles.clientValue}>
//                     {invoice.clientAddress || "………………………………………"}
//                   </span>
//                 </div>
//                 {invoice.clientEmail && (
//                   <div className={styles.clientRow}>
//                     <span className={styles.clientLabel}>Email</span>
//                     <span className={styles.clientValue}>
//                       {invoice.clientEmail}
//                     </span>
//                   </div>
//                 )}
//                 {invoice.clientPhone && (
//                   <div className={styles.clientRow}>
//                     <span className={styles.clientLabel}>Phone</span>
//                     <span className={styles.clientValue}>
//                       {invoice.clientPhone}
//                     </span>
//                   </div>
//                 )}
//               </div>
//               <div className={styles.clientGstinBlock}>
//                 <span className={styles.clientLabel}>GSTIN :-</span>
//                 <span className={styles.clientValue}>
//                   {invoice.clientGstin || "……………………………………"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className={styles.divider} />

//           {/* ══ DESCRIPTION TABLE ══ */}
//           <table className={styles.mainTable}>
//             <thead>
//               <tr>
//                 <th className={styles.thDesc}>Description</th>
//                 <th className={styles.thAmt}>Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className={styles.tdDesc}>
//                   <p className={styles.descPrimary}>
//                     Payment required as per the stages for the proposed
//                     residential &amp; commercial at, Sr. No.{" "}
//                     {project.projectName ? (
//                       <strong>{project.projectName}</strong>
//                     ) : (
//                       "…………………………"
//                     )}
//                   </p>
//                   {project.address && (
//                     <p className={styles.descSecondary}>{project.address}</p>
//                   )}
//                   {invoice.amountInWords && (
//                     <p className={styles.amountInWords}>
//                       <strong>Amount in Words:</strong> {invoice.amountInWords}
//                     </p>
//                   )}
//                 </td>
//                 <td className={styles.tdAmt}>&nbsp;</td>
//               </tr>
//             </tbody>
//           </table>

//           {/* ══ TOTALS TABLE ══ */}
//           <table className={styles.totalsTable}>
//             <tbody>
//               <tr>
//                 <td className={styles.totalsLabel}>Total Net Amount</td>
//                 <td className={styles.totalsValue}>
//                   {net > 0 ? `₹ ${fmtMoney(net)}` : "……………………………"}
//                 </td>
//               </tr>
//               <tr>
//                 <td className={styles.totalsLabel}>State Tax (SGST) 9%</td>
//                 <td className={styles.totalsValue}>
//                   {sgst > 0 ? `₹ ${fmtMoney(sgst)}` : "……………………………"}
//                 </td>
//               </tr>
//               <tr>
//                 <td className={styles.totalsLabel}>Central Tax (CGST) 9%</td>
//                 <td className={styles.totalsValue}>
//                   {cgst > 0 ? `₹ ${fmtMoney(cgst)}` : "……………………………"}
//                 </td>
//               </tr>
//               <tr className={styles.totalsGrandRow}>
//                 <td className={styles.totalsGrandLabel}>Gross Total Amount</td>
//                 <td className={styles.totalsGrandValue}>
//                   {gross > 0 ? `₹ ${fmtMoney(gross)}` : "……………………………"}
//                 </td>
//               </tr>
//               {invoice.amountInWords && (
//                 <tr>
//                   <td colSpan={2} className={styles.totalsWordsRow}>
//                     <strong>Amount In Words:</strong> {invoice.amountInWords}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* ══ PAYMENTS RECEIVED (Tax invoice only) ══ */}
//           {isTax && invoice.payments?.length > 0 && (
//             <>
//               <div className={styles.divider} />
//               <div className={styles.paymentsSection}>
//                 <div className={styles.paymentsSectionTitle}>
//                   PAYMENTS RECEIVED
//                 </div>
//                 <table className={styles.paymentsTable}>
//                   <thead>
//                     <tr>
//                       <th>Date</th>
//                       <th>Mode</th>
//                       <th>Transaction ID</th>
//                       <th>Amount</th>
//                       <th>Remarks</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {invoice.payments.map((p, i) => (
//                       <tr key={p.id || i}>
//                         <td>{fmt(p.paymentDate)}</td>
//                         <td>{p.paymentMode}</td>
//                         <td>
//                           <code>{p.transactionId || "—"}</code>
//                         </td>
//                         <td>
//                           <strong>₹ {fmtMoney(p.amountPaid)}</strong>
//                         </td>
//                         <td>{p.remarks || "—"}</td>
//                       </tr>
//                     ))}
//                     <tr className={styles.paymentsTotalRow}>
//                       <td colSpan={3}>
//                         <strong>Total Received</strong>
//                       </td>
//                       <td colSpan={2}>
//                         <strong>
//                           ₹{" "}
//                           {fmtMoney(
//                             invoice.payments.reduce(
//                               (s, p) => s + Number(p.amountPaid || 0),
//                               0,
//                             ),
//                           )}
//                         </strong>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}

//           <div className={styles.divider} />

//           {/* ══ BOTTOM ROW — Bank + Cheque + Signatory ══ */}
//           <div className={styles.bottomSection}>
//             {/* Payment details */}
//             <div className={styles.bankBlock}>
//               <div className={styles.blockTitle}>PAYMENT DETAILS</div>
//               <div className={styles.bankRow}>
//                 Please issue the cheque in favour of
//               </div>
//               <div className={styles.bankChequeName}>" {COMPANY.name} "</div>
//               <div className={styles.bankRow}>
//                 <strong>OR</strong>
//               </div>
//               <div className={styles.bankSubTitle}>RTGS DETAILS</div>
//               <table className={styles.bankTable}>
//                 <tbody>
//                   <tr>
//                     <td>ACCOUNT NAME</td>
//                     <td>{BANK.chqName}</td>
//                   </tr>
//                   <tr>
//                     <td>ACCOUNT NO.</td>
//                     <td>{BANK.accNo}</td>
//                   </tr>
//                   <tr>
//                     <td>IFSC CODE</td>
//                     <td>{BANK.ifsc}</td>
//                   </tr>
//                   <tr>
//                     <td>BRANCH</td>
//                     <td>{BANK.branch}</td>
//                   </tr>
//                   <tr>
//                     <td>BANK</td>
//                     <td>{BANK.name}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             {/* Signatory */}
//             <div className={styles.signatoryBlock}>
//               <div className={styles.signatoryLine} />
//               <div className={styles.signatoryName}>{COMPANY.signatory}</div>
//               <div className={styles.signatoryTitle}>Authorized Signatory</div>
//             </div>
//           </div>

//           {/* ══ FOOTER ══ */}
//           <div className={styles.footer}>
//             <div className={styles.footerThankYou}>
//               THANK YOU FOR YOUR BUSINESS!
//             </div>
//             <div className={styles.footerContact}>
//               {COMPANY.phones.join(" | ")} &nbsp;|&nbsp; {COMPANY.email}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostSalesById } from "../../api/hooks/usePostSales";
import html2pdf from "html2pdf.js";
import styles from "./InvoicePage.module.scss";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (dt) => {
  if (!dt) return "…………………";
  return new Date(dt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const fmtMoney = (val) => {
  if (val == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

// ─── Company Constants ────────────────────────────────────────────────────────
const COMPANY = {
  name: "YW ARCHITECTS",
  address:
    "Office No.313, Fortuna Business Hub, Near Shivar Chouk, Pimple Saudagar, Pune - 411018",
  phones: ["020 40038445", "9623901901"],
  email: "yogeshrw24@gmail.com",
  signatory: "Ar. Yogesh Wakchaure",
};

const BANK = {
  name: "…………………",
  accNo: "…………………",
  ifsc: "…………………",
  branch: "…………………",
  chqName: "YW ARCHITECTS",
};

// ─── InvoicePage ──────────────────────────────────────────────────────────────
export default function InvoicePage() {
  const { postSalesId, invoiseId, type } = useParams(); // type = "proforma" | "tax"
  const navigate = useNavigate();
  const printRef = useRef();

  const { data, isLoading, isError } = usePostSalesById(postSalesId);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
        <p>Loading invoice...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={styles.errorPage}>
        <span>⚠️</span>
        <h3>Invoice not found</h3>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  // Pick correct invoice list based on type param
  const invoiceList =
    type === "tax" ? data.taxInvoices || [] : data.proformaInvoices || [];

  // If invId param present, show that one; else show latest
  const invoice = invoiceList[invoiseId - 1] || {};
  const client = data.client || {};
  const project = data.project || {};

  const net = Number(invoice.netAmount || 0);
  const cgst = Number(invoice.cgstAmount || 0);
  const sgst = Number(invoice.sgstAmount || 0);
  const gross = Number(invoice.grossAmount || 0);

  // Use stored percentages if available, otherwise derive them from amounts
  const cgstPct =
    invoice.cgstPct != null
      ? Number(invoice.cgstPct)
      : net > 0 && cgst > 0
        ? parseFloat(((cgst / net) * 100).toFixed(2))
        : null;

  const sgstPct =
    invoice.sgstPct != null
      ? Number(invoice.sgstPct)
      : net > 0 && sgst > 0
        ? parseFloat(((sgst / net) * 100).toFixed(2))
        : null;

  const cgstLabel = `Central Tax (CGST)${cgstPct != null ? ` ${cgstPct}%` : ""}`;
  const sgstLabel = `State Tax (SGST)${sgstPct != null ? ` ${sgstPct}%` : ""}`;

  const isTax = type === "tax";
  const invoiceLabel = isTax ? "TAX INVOICE" : "PROFORMA INVOICE";

  // ── Print ──
  const handlePrint = () => {
    window.print();
  };

  // ── PDF Download ──
  const handleDownloadPDF = () => {
    const opt = {
      margin: [8, 8, 8, 8],
      filename: `${invoiceLabel.replace(" ", "_")}_${invoice.invoiceNumber || postSalesId}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(printRef.current).save();
  };

  return (
    <div className={styles.pageShell}>
      {/* ── Toolbar (hidden on print) ── */}
      <div className={styles.toolbar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className={styles.toolbarRight}>
          <button className={styles.toolBtn} onClick={handlePrint}>
            🖨 Print
          </button>
          <button
            className={`${styles.toolBtn} ${styles.toolBtnPrimary}`}
            onClick={handleDownloadPDF}
          >
            ⬇ Download PDF
          </button>
        </div>
      </div>

      {/* ── A4 Invoice Sheet ── */}
      <div className={styles.a4Wrap}>
        <div className={styles.invoiceSheet} ref={printRef}>
          {/* ══ HEADER ══ */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.companyName}>{COMPANY.name}</div>
              <div className={styles.companyAddress}>
                Address :- {COMPANY.address}
              </div>
              <div className={styles.companyContact}>
                {COMPANY.phones.join(", ")}
              </div>
              <div className={styles.companyContact}>
                E-mail :- {COMPANY.email}
              </div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.invoiceTitle}>{invoiceLabel}</div>
              <table className={styles.metaTable}>
                <tbody>
                  <tr>
                    <td className={styles.metaLabel}>Invoice No.</td>
                    <td className={styles.metaValue}>
                      {invoice.invoiceNumber || "…………………"}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.metaLabel}>Date</td>
                    <td className={styles.metaValue}>
                      {fmt(invoice.issueDate)}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.metaLabel}>Valid Till</td>
                    <td className={styles.metaValue}>
                      {fmt(invoice.validTill)}
                    </td>
                  </tr>
                  {invoice.status && (
                    <tr>
                      <td className={styles.metaLabel}>Status</td>
                      <td className={styles.metaValue}>
                        <span
                          className={styles.statusPill}
                          style={
                            invoice.paid
                              ? { background: "#dcfce7", color: "#14532d" }
                              : { background: "#fef9c3", color: "#713f12" }
                          }
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.dividerThick} />

          {/* ══ GSTIN ROW ══ */}
          <div className={styles.gstinRow}>
            <span>
              <strong>GSTIN:</strong>{" "}
              {invoice.clientGstin || "………………………………………………"}
            </span>
          </div>

          <div className={styles.divider} />

          {/* ══ CLIENT DETAILS ══ */}
          <div className={styles.clientSection}>
            <div className={styles.clientSectionTitle}>DETAILS OF CLIENT</div>
            <div className={styles.clientGrid}>
              <div>
                <div className={styles.clientRow}>
                  <span className={styles.clientLabel}>NAME</span>
                  <span className={styles.clientValue}>
                    {invoice.clientName || client.name || "………………………………………"}
                  </span>
                </div>
                <div className={styles.clientRow}>
                  <span className={styles.clientLabel}>Address</span>
                  <span className={styles.clientValue}>
                    {invoice.clientAddress || "………………………………………"}
                  </span>
                </div>
                {invoice.clientEmail && (
                  <div className={styles.clientRow}>
                    <span className={styles.clientLabel}>Email</span>
                    <span className={styles.clientValue}>
                      {invoice.clientEmail}
                    </span>
                  </div>
                )}
                {invoice.clientPhone && (
                  <div className={styles.clientRow}>
                    <span className={styles.clientLabel}>Phone</span>
                    <span className={styles.clientValue}>
                      {invoice.clientPhone}
                    </span>
                  </div>
                )}
              </div>
              <div className={styles.clientGstinBlock}>
                <span className={styles.clientLabel}>GSTIN :-</span>
                <span className={styles.clientValue}>
                  {invoice.clientGstin || "……………………………………"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* ══ DESCRIPTION TABLE ══ */}
          <table className={styles.mainTable}>
            <thead>
              <tr>
                <th className={styles.thDesc}>Description</th>
                <th className={styles.thAmt}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.tdDesc}>
                  <p className={styles.descPrimary}>
                    Payment required as per the stages for the proposed
                    residential &amp; commercial at, Sr. No.{" "}
                    {project.projectName ? (
                      <strong>{project.projectName}</strong>
                    ) : (
                      "…………………………"
                    )}
                  </p>
                  {project.address && (
                    <p className={styles.descSecondary}>{project.address}</p>
                  )}
                  {invoice.amountInWords && (
                    <p className={styles.amountInWords}>
                      <strong>Amount in Words:</strong> {invoice.amountInWords}
                    </p>
                  )}
                </td>
                <td className={styles.tdAmt}>&nbsp;</td>
              </tr>
            </tbody>
          </table>

          {/* ══ TOTALS TABLE ══ */}
          <table className={styles.totalsTable}>
            <tbody>
              <tr>
                <td className={styles.totalsLabel}>Total Net Amount</td>
                <td className={styles.totalsValue}>
                  {net > 0 ? `₹ ${fmtMoney(net)}` : "……………………………"}
                </td>
              </tr>
              <tr>
                {/* Dynamic label: "State Tax (SGST) 9%" uses actual stored % */}
                <td className={styles.totalsLabel}>{sgstLabel}</td>
                <td className={styles.totalsValue}>
                  {sgst > 0 ? `₹ ${fmtMoney(sgst)}` : "……………………………"}
                </td>
              </tr>
              <tr>
                {/* Dynamic label: "Central Tax (CGST) 9%" uses actual stored % */}
                <td className={styles.totalsLabel}>{cgstLabel}</td>
                <td className={styles.totalsValue}>
                  {cgst > 0 ? `₹ ${fmtMoney(cgst)}` : "……………………………"}
                </td>
              </tr>
              <tr className={styles.totalsGrandRow}>
                <td className={styles.totalsGrandLabel}>Gross Total Amount</td>
                <td className={styles.totalsGrandValue}>
                  {gross > 0 ? `₹ ${fmtMoney(gross)}` : "……………………………"}
                </td>
              </tr>
              {invoice.amountInWords && (
                <tr>
                  <td colSpan={2} className={styles.totalsWordsRow}>
                    <strong>Amount In Words:</strong> {invoice.amountInWords}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ══ PAYMENTS RECEIVED (Tax invoice only) ══ */}
          {isTax && invoice.payments?.length > 0 && (
            <>
              <div className={styles.divider} />
              <div className={styles.paymentsSection}>
                <div className={styles.paymentsSectionTitle}>
                  PAYMENTS RECEIVED
                </div>
                <table className={styles.paymentsTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Mode</th>
                      <th>Transaction ID</th>
                      <th>Amount</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.payments.map((p, i) => (
                      <tr key={p.id || i}>
                        <td>{fmt(p.paymentDate)}</td>
                        <td>{p.paymentMode}</td>
                        <td>
                          <code>{p.transactionId || "—"}</code>
                        </td>
                        <td>
                          <strong>₹ {fmtMoney(p.amountPaid)}</strong>
                        </td>
                        <td>{p.remarks || "—"}</td>
                      </tr>
                    ))}
                    <tr className={styles.paymentsTotalRow}>
                      <td colSpan={3}>
                        <strong>Total Received</strong>
                      </td>
                      <td colSpan={2}>
                        <strong>
                          ₹{" "}
                          {fmtMoney(
                            invoice.payments.reduce(
                              (s, p) => s + Number(p.amountPaid || 0),
                              0,
                            ),
                          )}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className={styles.divider} />

          {/* ══ BOTTOM ROW — Bank + Cheque + Signatory ══ */}
          <div className={styles.bottomSection}>
            {/* Payment details */}
            <div className={styles.bankBlock}>
              <div className={styles.blockTitle}>PAYMENT DETAILS</div>
              <div className={styles.bankRow}>
                Please issue the cheque in favour of
              </div>
              <div className={styles.bankChequeName}>" {COMPANY.name} "</div>
              <div className={styles.bankRow}>
                <strong>OR</strong>
              </div>
              <div className={styles.bankSubTitle}>RTGS DETAILS</div>
              <table className={styles.bankTable}>
                <tbody>
                  <tr>
                    <td>ACCOUNT NAME</td>
                    <td>{BANK.chqName}</td>
                  </tr>
                  <tr>
                    <td>ACCOUNT NO.</td>
                    <td>{BANK.accNo}</td>
                  </tr>
                  <tr>
                    <td>IFSC CODE</td>
                    <td>{BANK.ifsc}</td>
                  </tr>
                  <tr>
                    <td>BRANCH</td>
                    <td>{BANK.branch}</td>
                  </tr>
                  <tr>
                    <td>BANK</td>
                    <td>{BANK.name}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signatory */}
            <div className={styles.signatoryBlock}>
              <div className={styles.signatoryLine} />
              <div className={styles.signatoryName}>{COMPANY.signatory}</div>
              <div className={styles.signatoryTitle}>Authorized Signatory</div>
            </div>
          </div>

          {/* ══ FOOTER ══ */}
          <div className={styles.footer}>
            <div className={styles.footerThankYou}>
              THANK YOU FOR YOUR BUSINESS!
            </div>
            <div className={styles.footerContact}>
              {COMPANY.phones.join(" | ")} &nbsp;|&nbsp; {COMPANY.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
