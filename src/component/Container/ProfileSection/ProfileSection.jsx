import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "../../../store/slice/authSlice";

const ProfileSection = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMe());
  }, []);
  return <div>ProfileSection</div>;
};

export default ProfileSection;
