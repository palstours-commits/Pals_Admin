const bookings = [
  {
    id: 1,
    title: "Queen Bed A-12324",
    user: "James Sukardi",
    time: "12min ago",
    badge: "3",
    color: "bg-green-900",
  },
  {
    id: 2,
    title: "Deluxe Room B-1324",
    user: "Angela Moss",
    time: "12min ago",
    badge: "16, 17, 18",
    color: "bg-red-500",
  },
  {
    id: 3,
    title: "King Big C-2445",
    user: "JGeovanny",
    time: "12min ago",
    badge: "3",
    color: "bg-orange-400",
  },
];

export function BookingList() {
  return (
    <div className="mt-6 space-y-6">
      {bookings?.map((b) => (
        <div key={b.id} className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{b.title}</h3>
            <p className="text-sm text-gray-500">
              {b.user} · {b.time}
            </p>
          </div>

          <span
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${b.color}`}
          >
            {b.badge}
          </span>
        </div>
      ))}
    </div>
  );
}
