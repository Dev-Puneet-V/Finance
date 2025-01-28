import { useFormik } from "formik";
import Modal from "./Modal";
import * as Yup from "yup";
import { CirclesWithBar } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, setInitState } from "../utils/slices/transaction";
import { AppDispatch, RootState } from "../utils/store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
interface CreateTranactionProps {
  onClose: () => void;
}
const CreateTransaction: React.FC<CreateTranactionProps> = ({onClose}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.transaction);
  
  const formik = useFormik({
    initialValues: {
      amount: "",
      category: "",
      description: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .min(1, "Amount must be greater than 0")
        .required("Amount is required"),
      category: Yup.string()
        .oneOf(["credit", "debit"], "Invalid category")
        .required("Category is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values) => {
      dispatch(createTransaction(values));
    },
  });
  useEffect(() => {
    if (loading === "loaded") {
      toast.success(`Trasaction created successfully😊`)
      dispatch(setInitState())
      onClose();
    } else if (error) {
      toast.error("Transaction creation failed🥲")
      dispatch(setInitState());
    }
  }, [loading]);
  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Transaction">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.amount}
            className={`p-2 mt-1 block w-full rounded-md bg-gray-700 text-gray-300 border-gray-600 focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm ${
              formik.touched.amount && formik.errors.amount
                ? "border-red-500"
                : ""
            }`}
          />
          {formik.touched.amount && formik.errors.amount ? (
            <p className="mt-2 text-sm text-red-600">{formik.errors.amount}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Category
          </label>
          <select
            name="category"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category}
            className={`p-2 mt-1 block w-full rounded-md bg-gray-700 text-gray-300 border-gray-600 focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm ${
              formik.touched.category && formik.errors.category
                ? "border-red-500"
                : ""
            }`}
          >
            <option value="" label="Select category" />
            <option value="credit" label="Credit" />
            <option value="debit" label="Debit" />
          </select>
          {formik.touched.category && formik.errors.category ? (
            <p className="mt-2 text-sm text-red-600">
              {formik.errors.category}
            </p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className={`p-2 mt-1 block w-full rounded-md bg-gray-700 text-gray-300 border-gray-600 focus:ring-blue-500 focus:border-blue-500 shadow-sm sm:text-sm ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : ""
            }`}
          />
          {formik.touched.description && formik.errors.description ? (
            <p className="mt-2 text-sm text-red-600">
              {formik.errors.description}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading === "loading"}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none flex items-center justify-center gap-3"
        >
          {loading === "loading" && (
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
          <p>{loading === "loading" ? "Processing" : "Submit"}</p>
        </button>
      </form>
    </Modal>
  );
};

export { CreateTransaction };
