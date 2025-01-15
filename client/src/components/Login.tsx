import React, { useState } from "react";
import { Formik, FormikHelpers } from "formik";
import { toast } from "react-toastify";
import { NewUser } from "../utils/types";
import { useNavigate } from "react-router-dom";
import { CirclesWithBar } from 'react-loader-spinner'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../utils/store"; 
import { loginUser, signUpUser } from "../utils/slices/user";

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const handleButtonClick = async (
    values: NewUser,
    setSubmitting: FormikHelpers<NewUser>["setSubmitting"]
  ) => {
    try {
      if (isSignUp) {
        const result = await dispatch(signUpUser(values)).unwrap();
        toast.success(result.message);
        setIsSignUp(false);
      } else {
        const result = await dispatch(loginUser(values)).unwrap();
        toast.success(`Welcome back! ${result.name}`);
        navigate("/home");
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-slate-900 justify-center items-center">
      <div className="rounded-[10px] bg-slate-700 h-auto w-auto shadow-xl p-5">
        <p className="font-bold text-center mb-5 text-xl text-slate-200">
          {isSignUp ? "Sign up" : "Sign in"}
        </p>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validate={(values) => {
            const errors: Partial<NewUser> = {};
            if (!values.email) {
              errors.email = "Email is required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            if (!values.password) {
              errors.password = "Password is required";
            } else if (values.password.length < 6) {
              errors.password = "Password must be at least 6 characters";
            }
            if (isSignUp && !values.name) {
              errors.name = "Name is required for sign-up";
            }
            return errors;
          }}
          onSubmit={(values: NewUser, { setSubmitting }: any) => {
            handleButtonClick(values, setSubmitting);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 items-center"
            >
              {isSignUp && (
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder="Enter your name"
                    className="block mb-2 font-medium text-slate-100 p-2 w-[300px] bg-slate-900 rounded"
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-400 text-sm font-semibold">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className="block mb-2 font-medium text-slate-100 p-2 w-[300px] bg-slate-900 rounded"
                />
                {errors.email && touched.email && (
                  <p className="text-red-400 text-sm font-semibold">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="block mb-2 font-medium text-slate-100 p-2 w-[300px] bg-slate-900 rounded"
                />
                {errors.password && touched.password && (
                  <p className="text-red-400 text-sm font-semibold">
                    {errors.password}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 rounded-full font-bold text-white p-2 w-[140px] flex items-center justify-center gap-3"
              >
                {loading && (
                  <CirclesWithBar
                    height="25"
                    width="25"
                    color="#ffffff"
                    outerCircleColor="#ffffff"
                    innerCircleColor="#ffffff"
                    barColor="#ffffff"
                    ariaLabel="circles-with-bar-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                )}
                <p>{isSignUp ? "Sign Up" : "Sign In"}</p>
              </button>
              <p className="text-slate-100 text-sm font-medium mt-2">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <span
                      className="text-blue-400 cursor-pointer"
                      onClick={() => setIsSignUp(false)}
                    >
                      Sign In
                    </span>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <span
                      className="text-blue-400 cursor-pointer"
                      onClick={() => setIsSignUp(true)}
                    >
                      Sign Up
                    </span>
                  </>
                )}
              </p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
