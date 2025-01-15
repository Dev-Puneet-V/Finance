import React, { useState } from "react";
import axios from "axios";
import { Formik, FormikHelpers } from "formik";
import { toast } from "react-toastify";
import { NewUser } from "../utils/types";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleButtonClick = async (
    values: NewUser,
    setSubmitting: FormikHelpers<NewUser>["setSubmitting"]
  ) => {
    try {
      if (isSignUp) {
        let response = await axios.post(
          "http://localhost:3000/api/user/signup",
          values
        );
        const data = response.data;
        toast.success(data.message);
        setIsSignUp(false);
      } else {
        let response = await axios.post(
          "http://localhost:3000/api/user/login",
          values
        );
        const data = response.data;
        toast.success("Welcome back! " + data?.name);
        navigate("home");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(errorMessage);
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
          onSubmit={(
            values: NewUser,
            { setSubmitting }: FormikHelpers<NewUser>
          ) => {
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
                className="bg-slate-900 rounded-full font-bold text-white p-2 w-[100px]"
              >
                {isSignUp ? "Sign Up" : "Sign In"}
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
