"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dummySubMenu } from "../../../utils/dummyMockData";
import CreateSubMenu from "./CreateSubMenu";

const SubMenuSection = () => {
  const [services, setServices] = useState(dummySubMenu);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = services.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="min-h-screen px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">SubMenu List</h2>

            <button
              onClick={() => setOpenModal(true)}
              className="bg-green-800 text-white px-6 py-2 rounded-md cursor-pointer"
            >
              + Create SubMenu
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded shadow overflow-x-auto"
          >
            <div>
              <div className="grid grid-cols-4 px-7 py-4 font-bold border-b border-gray-300">
                <div>Name</div>
                <div>Created</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>
              {currentServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-4 px-8 py-5 items-center text-sm"
                >
                  <div className="font-medium">{service.name}</div>
                  <div>{service.createdAt}</div>

                  <div>
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                        service.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>

                  <div className="flex justify-end relative group">
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      ⋮
                    </button>
                    <div className="absolute right-0 top-0 w-44 bg-white rounded-xl shadow-lg border border-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        Update
                      </button>

                      <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-xl cursor-pointer">
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="flex justify-between items-center px-8 py-4">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, services.length)} of{" "}
                  {services.length}
                </p>

                <div className="flex gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className={`w-10 h-10 rounded-lg ${
                      currentPage ? "bg-green-800 text-white" : "border"
                    }`}
                  >
                    {currentPage}
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {openModal && <CreateSubMenu onClose={() => setOpenModal(false)} />}
    </>
  );
};

export default SubMenuSection;
