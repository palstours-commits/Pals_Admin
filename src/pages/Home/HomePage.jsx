"use client";
import { motion } from "framer-motion";
import { statusColor } from "../../utils/customColorCreate";
import { dummyGuests } from "../../utils/dummyMockData";
import { BiChevronDown } from "react-icons/bi";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("Newest");

  return (
    <div className="min-h-screen px-6 py-10 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="overflow-x-auto">
            <div className="flex items-center gap-6 text-sm font-medium whitespace-nowrap min-w-max">
              {["All Guest", "Pending", "Booked", "Canceled", "Refund"]?.map(
                (tab, idx) => (
                  <button
                    key={tab}
                    className={`pb-3 transition-all ${
                      idx === 0
                        ? "border-b-2 border-[#14532D] text-[#14532D]"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#14532D] text-white px-6 py-3 rounded-xl font-medium shadow-sm">
              02/13/2026
            </div>
            <div className="relative inline-block">
              <div
                onClick={() => setOpen(!open)}
                className="bg-white border border-gray-200 px-7  py-3 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
              >
                {sort}
                <BiChevronDown size={18} className="text-gray-400" />
              </div>
              {open && (
                <div className="absolute top-full mt-2 w-32 bg-gray-100 rounded-lg shadow-md py-2 z-50">
                  <div
                    onClick={() => {
                      setSort("Oldest");
                      setOpen(false);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-200 cursor-pointer"
                  >
                    Oldest
                  </div>

                  <div
                    onClick={() => {
                      setSort("Newest");
                      setOpen(false);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-200 cursor-pointer"
                  >
                    Newest
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded shadow mt-8 overflow-x-auto scrollbar-hide"
        >
          <div className="min-w-[1200px]">
            <div className="grid grid-cols-13 px-8 py-4 text-md font-bold text-black border-b border-gray-300">
              <div className="col-span-2">Guest</div>
              <div className="col-span-2">Date Order</div>
              <div className="col-span-2">Check In</div>
              <div className="col-span-2">Check Out</div>
              <div className="col-span-2">Special Request</div>
              <div className="col-span-1">Room Type</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Action</div>
            </div>
            {dummyGuests?.map((guest, index) => (
              <motion.div
                key={guest.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-13 px-8 py-5 text-sm items-center"
              >
                <div className="col-span-2">
                  <div className="font-semibold text-slate-800">
                    {guest.name}
                  </div>
                  <div className="text-xs text-red-500 mt-1">{guest.empId}</div>
                </div>

                <div className="col-span-2 text-slate-600">
                  {guest.dateOrder}
                </div>

                <div className="col-span-2">
                  <div className="font-semibold text-slate-800">
                    {guest.checkIn}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {guest.checkInTime}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="font-semibold text-slate-800">
                    {guest.checkOut}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {guest.checkOutTime}
                  </div>
                </div>

                <div className="col-span-2">
                  <button className="bg-[#EDF2F7] text-slate-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                    {guest.request}
                  </button>
                </div>

                <div className="col-span-1 text-slate-700 font-medium">
                  {guest.room}
                </div>
                <div className="col-span-1">
                  <span
                    className={`inline-flex justify-center min-w-[95px] px-4 mx-6 py-2 rounded-xl text-sm font-semibold ${statusColor(
                      guest.status,
                    )}`}
                  >
                    {guest.status}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end relative group">
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6h.01M12 12h.01M12 18h.01"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 top-10 w-36 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl">
                      Edit
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl">
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="flex items-center justify-around py-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">8</span> of{" "}
                <span className="font-medium">8</span> entries
              </p>
              <div className="flex items-center gap-3">
                <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-green-700 text-green-700 hover:bg-green-50 transition">
                  <ChevronLeft size={20} />
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-800 text-white font-semibold">
                  1
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-green-700 text-green-700 hover:bg-green-50 transition">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
