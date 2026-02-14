import MainLayout from "../../../common/MainLayout";
import loginImg from "../../../assets/login-bg.png";
import logoImg from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const LoginSection = () => {
  const navigate = useNavigate();

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <MainLayout>
      <section className="h-screen flex overflow-hidden">
        <div className="grid grid-cols-12 w-full h-full">
          <div className="col-span-4 bg-white flex flex-col justify-between items-center px-12 py-16">
            <div className="text-center mt-12">
              <img src={logoImg} alt="logo" className="mx-auto w-32" />

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

              <form className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="demo@example.com"
                    className="w-full mt-2 p-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Password<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="******"
                    className="w-full mt-2 p-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 accent-red-600" />
                  <span className="text-sm text-gray-600">
                    Remember my preference
                  </span>
                </div>

                <button
                  onClick={handleNavigate}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition duration-300 shadow-md"
                >
                  Sign In
                </button>

                <p className="text-sm text-center text-gray-600">
                  Don’t have an account?{" "}
                  <span className="text-red-600 cursor-pointer font-medium">
                    Sign up
                  </span>
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
