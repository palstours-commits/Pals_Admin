"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCareerStatus,
  clearCareerError,
  clearCareerMessage,
} from "../../../store/slice/careerSlice";
import { notifyAlert } from "../../../utils/notificationService";

const CreateCareer = ({ career, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, error, message } = useSelector(
    (state) => state.career,
  );

  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (career) {
      setStatus(career.status);
    }
  }, [career]);

  useEffect(() => {
    if (message) {
      notifyAlert({ title: "Success", message, type: "success" });
      dispatch(clearCareerMessage());
      onClose();
    }

    if (error) {
      notifyAlert({ title: "Error", message: error, type: "error" });
      dispatch(clearCareerError());
    }
  }, [message, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateCareerStatus({
        id: career._id,
        data: { status },
      }),
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-6">Update Career Status</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border px-4 py-3 rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2 border rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-green-800 text-white rounded-xl"
            >
              {actionLoading ? "Please wait..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCareer;
