import { ChevronLeft, ChevronRight } from "lucide-react";
const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-8 py-4">
      <p className="text-sm text-gray-600">
        Showing <span className="font-medium">{startIndex}</span> to{" "}
        <span className="font-medium">{endIndex}</span> of{" "}
        <span className="font-medium">{totalItems}</span> entries
      </p>

      <div className="flex items-center gap-3">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-12 h-12 flex items-center justify-center rounded-xl border border-green-700 text-green-700 disabled:opacity-40"
        >
          <ChevronLeft size={20} />
        </button>

        <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-800 text-white font-semibold">
          {currentPage}
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-12 h-12 flex items-center justify-center rounded-xl border border-green-700 text-green-700 disabled:opacity-40"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
