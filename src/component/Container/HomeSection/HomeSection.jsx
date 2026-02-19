"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bed, Layers, MapPin, ListTree, Package } from "lucide-react";

import StatCard from "../../../common/AnimatedNumber";
import { Calendar } from "../../../common/Calendar";
import { BookingList } from "../../../common/BookingList";
import {
  getDashboardBookings,
  getDashboardCounts,
} from "../../../store/slice/dashboardSlice";

const statsConfig = [
  {
    key: "bookingCount",
    label: "Bookings",
    icon: Bed,
    iconBg: "bg-red-500",
    iconColor: "text-white",
  },
  {
    key: "menuCount",
    label: "Menus",
    icon: Layers,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    key: "zoneCount",
    label: "Zones",
    icon: MapPin,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    key: "subMenuCount",
    label: "Sub Menus",
    icon: ListTree,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    key: "packageCount",
    label: "Packages",
    icon: Package,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
];

const statsData = {
  Daily: [
    { title: "Contact", value: 128, change: "+2.5%" },
    { title: "Flight", value: 64, change: "+1.2%" },
    { title: "Hotel", value: 92, change: "+3.1%" },
  ],
  Weekly: [
    { title: "Contact", value: 842, change: "+4.8%" },
    { title: "Flight", value: 410, change: "+2.6%" },
    { title: "Hotel", value: 675, change: "+5.4%" },
  ],
  Monthly: [
    { title: "Contact", value: 3451, change: "+6.2%" },
    { title: "Flight", value: 2041, change: "+3.9%" },
    { title: "Hotel", value: 2890, change: "+7.1%" },
  ],
};

const HomeSection = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Monthly");
  const { counts, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardCounts());
    dispatch(getDashboardBookings());
  }, [dispatch]);

  const handleCalendarChange = (date) => {
    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };
    dispatch(getDashboardBookings(formatDate(date)));
  };

  return (
    <div className="px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        {statsConfig?.map((item) => {
          const Icon = item.icon;
          return (
            <StatCard
              key={item.key}
              value={counts?.[item.key] || 0}
              label={item.label}
              icon={<Icon className={`h-6 w-6 ${item.iconColor}`} />}
              iconBg={item.iconBg}
              loading={loading}
            />
          );
        })}
      </div>
      <div className="grid md:grid-cols-2 my-10 gap-6">
        <div className=" rounded-2xl bg-white p-6 shadow-md">
          <Calendar onChange={handleCalendarChange} />
          <div className="my-6 h-px bg-gray-100" />
          <BookingList />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Reservation Stats</h2>
            <div className="flex gap-6 text-sm font-medium">
              {["Daily", "Weekly", "Monthly"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-1 border-b-2 transition ${
                    activeTab === tab
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-6 items-center px-6 py-4 border-b border-gray-300 text-sm bg-white">
            <div className="font-medium text-gray-800">Prakash S</div>
            <div className="text-gray-600 truncate">
              prakashfrontend2503@gmail.com
            </div>
            <div className="text-gray-600">7339628276</div>
            <div className="text-gray-500">18/02/2026</div>
            <div className="text-gray-500">Hello</div>
            <div className="text-right">
              <button className="text-blue-600 hover:underline">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
