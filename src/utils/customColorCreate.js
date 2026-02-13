export const statusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-[#FDF1E6] text-[#F2994A]";
    case "Booked":
      return "bg-[#E6F7EC] text-[#27AE60]";
    case "Canceled":
      return "bg-[#FDEAEA] text-[#EB5757]";
    case "Refund":
      return "bg-[#FBE9E9] text-[#EB5757]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};
