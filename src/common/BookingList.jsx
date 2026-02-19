import { statusColor } from "../utils/customColorCreate";

export function BookingList({ item = [] }) { 
 return (
    <div className="mt-6 space-y-6">
      {item?.slice(0, 5)?.map((b) => (
        <div
          key={b._id}
          className="flex items-center justify-between rounded-lg border border-gray-300 p-4"
        >
          <div>
            <h3 className="font-semibold text-gray-900">
              {b.name} ({b.numberOfPersons} Persons)
            </h3>

            <p className="text-sm text-gray-500">
              {b.email} · {b.phone}
            </p>

            <p className="text-xs text-gray-400">
              {new Date(b.date).toLocaleDateString()} · Updated{" "}
              {new Date(b.updatedAt).toLocaleTimeString()}
            </p>
          </div>
          <span
            className={`rounded-xl px-4 py-1 text-xs font-semibold  ${statusColor(
              b.enquiryStatus,
            )}`}
          >
            {b.enquiryStatus}
          </span>
        </div>
      ))}
    </div>
  );
}
