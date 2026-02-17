export const statusColor = (status = "") => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "pending":
      return "bg-[#FDF1E6] text-[#F2994A]";

    case "booked":
    case "confirmed":
      return "bg-[#E6F7EC] text-[#27AE60]";

    case "canceled":
    case "cancelled":
      return "bg-[#FDEAEA] text-[#EB5757]";

    case "refund":
      return "bg-[#FBE9E9] text-[#EB5757]";

    default:
      return "bg-gray-100 text-gray-600";
  }
};
