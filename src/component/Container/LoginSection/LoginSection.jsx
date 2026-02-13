import MainLayout from "../../../common/MainLayout";
import loginImg from "../../../assets/login-bg.png";
import logoImg from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const LoginSection = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
  };
  return (
    <MainLayout>
      <section className="min-h-screen flex">
        <div className="grid grid-cols-12 w-full">
          <div className="col-span-12 md:col-span-4  relative flex flex-col justify-between items-center p-10">
            <div className="text-center mt-20">
              <img src={logoImg} alt="logo" />
              <h3 className="mt-5 text-xl font-medium">Welcome back!</h3>
              <p className="text-gray-500 mt-3 text-sm">
                User Experience & Interface Design <br />
                Strategy SaaS Solutions
              </p>
            </div>
            <div>
              <img
                src={loginImg}
                alt="login illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 bg-[#f3e3e0] flex items-center justify-center p-6 rotate-">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-medium text-center mb-6">
                Sign in your account
              </h2>
              <form className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="demo@example.com"
                    className="w-full mt-2 p-3 rounded-md border  border-gray-300 outline-0"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Password<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="******"
                    className="w-full mt-2 p-3 rounded-md border border-gray-300 outline-0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm text-gray-600">
                    Remember my preference
                  </span>
                </div>
                <button
                  onClick={handleNavigate}
                  className="w-full bg-red-700 hover:bg-red-700 text-white py-3 rounded-2xl font-semibold transition cursor-pointer"
                >
                  Sign In
                </button>
                <p className="text-sm  text-gray-600">
                  Don’t have an account?{" "}
                  <span className="text-red-600 cursor-pointer">Sign up</span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LoginSection;
