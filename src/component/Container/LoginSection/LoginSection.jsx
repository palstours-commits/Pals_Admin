import MainLayout from "../../../common/MainLayout";
import loginImg from "../../../assets/login-bg.png";
import logoImg from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  clearMessage,
  loginUser,
} from "../../../store/slice/authSlice";
import { notifyAlert } from "../../../utils/notificationService";
import { Eye, EyeOff } from "lucide-react";

const LoginSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, message, error, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (message) {
      notifyAlert({
        title: "Login Success",
        message,
        type: "success",
      });
      navigate("/");
      dispatch(clearMessage());
    }

    if (error) {
      notifyAlert({
        title: "Login Failed",
        message: error,
        type: "error",
      });
      dispatch(clearError());
    }
  }, [message, error]);

  return (
    <MainLayout>
      <section className="h-screen flex overflow-hidden">
        <div className="grid grid-cols-12 w-full h-full">
          <div className="col-span-4 bg-white flex flex-col justify-between items-center px-12 py-16">
            <div className="text-center mt-12">
              <img
                src="./navbar_logo.svg"
                alt="logo"
                className="mx-auto w-32"
              />
              <h3 className="mt-6 text-2xl font-semibold text-gray-800">
                Welcome back!
              </h3>
              <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                User Experience & Interface Design <br />
                Strategy SaaS Solutions
              </p>
            </div>
            <div className="mt-12">
              <img
                src={loginImg}
                alt="login illustration"
                className="w-full max-w-sm mx-auto"
              />
            </div>
          </div>
          <div className="col-span-8 relative flex items-center justify-center">
            <div
              className="absolute inset-0 bg-[#ead7d4]"
              style={{
                clipPath: "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            ></div>
            <div className="relative w-full max-w-md px-10">
              <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">
                Sign in your account
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="demo@example.com"
                    className="w-full mt-2 p-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Password<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="******"
                      className="w-full mt-2 p-3 pr-12 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 accent-red-600" />
                  <span className="text-sm text-gray-600">
                    Remember my preference
                  </span>
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition duration-300 shadow-md cursor-pointer"
                >
                  {loading ? "Login..." : "login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LoginSection;
