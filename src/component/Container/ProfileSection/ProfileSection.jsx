import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "../../../store/slice/authSlice";

const ProfileSection = () => {
  const dispatch = useDispatch();
  const { adminData, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!adminData) return null;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <img src="./navbar_logo.svg" alt="logo" className="mx-auto w-32 mb-6" />
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {adminData.firstName} {adminData.lastName}
        </h2>
        <p className="text-gray-500">{adminData.email}</p>
      </div>
      <div className="space-y-4">
        <ProfileItem label="First Name" value={adminData.firstName} />
        <ProfileItem label="Last Name" value={adminData.lastName} />
        <ProfileItem label="Email" value={adminData.email} />
        <ProfileItem
          label="Account Type"
          value={adminData.type === 1 ? "Admin" : "User"}
        />
        <ProfileItem
          label="Status"
          value={adminData.status === 1 ? "Active" : "Inactive"}
        />
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-200 pb-2">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);

export default ProfileSection;
