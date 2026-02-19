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
  getDashboardRecent,
} from "../../../store/slice/dashboardSlice";
import { statusColor } from "../../../utils/customColorCreate";
import { Link } from "react-router-dom";

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

const tabs = [
  { key: "enquiry", label: "Enquiries" },
  { key: "booking", label: "Bookings" },
  { key: "contactus", label: "Contact Us" },
];

const HomeSection = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("enquiry");
  const { counts, loading, bookings, recent } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(getDashboardCounts());
    dispatch(getDashboardBookings());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDashboardRecent(activeTab));
  }, [dispatch, activeTab]);

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
          <BookingList item={bookings} />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Reservation Stats</h2>
            <div className="flex gap-6 text-sm font-medium">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`pb-1 border-b-2 transition ${
                    activeTab === key
                      ? "border-green-600 text-green-600"
                      : "border-transparent text-gray-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {recent?.length > 0 ? (
            recent.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-6 items-center px-6 py-4 border-b border-gray-300 text-sm bg-white"
              >
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-gray-600 truncate">{item.email}</div>
                <div className="text-gray-600">{item.phone}</div>
                <div className="text-gray-500">
                  {new Date(item.date).toLocaleDateString("en-GB")}
                </div>
                <span
                  className={`rounded-xl px-4 py-1 text-xs font-semibold  ${statusColor(
                    item.enquiryStatus,
                  )}`}
                >
                  {item.enquiryStatus}
                </span>
                <div className="text-right">
                  <Link to="/booking" className="text-blue-600 hover:underline">
                    View
                  </Link >
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-6">
              No recent data found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
