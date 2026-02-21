"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReports } from "../../../store/slice/reportSlice";
import ReportChart from "../../../common/ReportChart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportSection = () => {
  const dispatch = useDispatch();
  const { summaryCounts, chartData } = useSelector((state) => state.report);

  const [filterType, setFilterType] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    dispatch(
      getReports({
        filterType,
        month: filterType === "monthly" ? month : undefined,
        year,
      }),
    );
  }, [dispatch, filterType, month, year]);

  const downloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    let y = 40;
    doc.setFontSize(20);
    doc.text("Report Dashboard", 40, y);
    y += 30;

    doc.setFontSize(11);
    doc.text(
      `Report Type: ${filterType.toUpperCase()} | ${
        filterType === "monthly"
          ? `Month: ${new Date(0, month - 1).toLocaleString("default", {
              month: "long",
            })}`
          : ""
      } | Year: ${year}`,
      40,
      y,
    );
    y += 30;

    doc.setFontSize(16);
    doc.text("Summary Overview", 40, y);
    y += 15;

    autoTable(doc, {
      startY: y,
      head: [["Bookings", "Enquiries", "Hotels", "Packages"]],
      body: [
        [
          summaryCounts?.bookingCount ?? 0,
          summaryCounts?.enquiryCount ?? 0,
          summaryCounts?.hotelCount ?? 0,
          summaryCounts?.PackageCount ?? 0,
        ],
      ],
      theme: "grid",
      styles: {
        fontSize: 11,
        cellPadding: 8,
        halign: "center",
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
      },
    });

    y = doc.lastAutoTable.finalY + 30;

    doc.setFontSize(16);
    doc.text("Report Chart Data", 40, y);
    y += 15;

    const chartTableData =
      chartData?.map((item) => [
        item.module || "N/A",
        `Week ${item.week ?? "-"}`,
        item.count ?? 0,
      ]) || [];
    autoTable(doc, {
      startY: y,
      head: [["Module", "Week", "Count"]],
      body: chartTableData,
      theme: "grid",
      styles: {
        fontSize: 11,
        cellPadding: 6,
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left" },
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
      },
    });
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      40,
      pageHeight - 30,
    );

    doc.save(`report-${filterType}-${year}.pdf`);
  };

  return (
    <div className="p-10 space-y-6">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border   border-gray-300 p-2 rounded"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {filterType === "monthly" && (
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          )}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-300   p-2 rounded w-24"
          />
        </div>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-red-600 text-sm  cursor-pointer text-white rounded-lg hover:bg-red-700"
        >
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h4>Bookings</h4>
          <p className="text-2xl font-bold">
            {summaryCounts?.bookingCount ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h4>Enquiries</h4>
          <p className="text-2xl font-bold">
            {summaryCounts?.enquiryCount ?? 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h4>Hotels</h4>
          <p className="text-2xl font-bold">{summaryCounts?.hotelCount ?? 0}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h4>Packages</h4>
          <p className="text-2xl font-bold">
            {summaryCounts?.PackageCount ?? 0}
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Report Chart</h3>
        <ReportChart data={chartData} />
      </div>
    </div>
  );
};

export default ReportSection;
