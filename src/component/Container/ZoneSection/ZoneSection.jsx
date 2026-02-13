"use client";
import { MoreVertical, Calendar, Mail, Phone, Info } from "lucide-react";
import { packages } from "../../../utils/dummyMockData";

const Zonesection = () => {
  return (
    <div className="min-h-screen ">
      <div className="w-full  px-6 py-4 flex items-center justify-between">
        <button className="bg-red-800 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl transition">
          + New Task
        </button>
        <div className="flex items-center gap-4">
          <button className="bg-green-800 hover:bg-green-900 text-white p-3 rounded-xl transition">
            <Mail size={18} />
          </button>
          <button className="bg-green-800 hover:bg-green-900 text-white p-3 rounded-xl transition">
            <Phone size={18} />
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition">
            <Info size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {packages?.map((data, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
          >
            <div className="relative h-64 w-full">
              <img
                src={data.image}
                alt="card"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-red-500 font-semibold text-sm">
                  {data.id}
                </span>
                <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
              </div>

              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                {data.title}
              </h2>

              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <Calendar className="w-4 h-4" />
                <span>{data.createdAt}</span>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            <div className="p-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Deadline Date :</span>
                <span className="font-medium text-gray-800">
                  {data.deadline}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Client Name :</span>
                <span className="font-medium text-gray-800">
                  {data.clientName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Location :</span>
                <span className="font-medium text-gray-800">
                  {data.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Zonesection;
