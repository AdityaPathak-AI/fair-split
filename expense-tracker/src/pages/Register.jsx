import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import { register } from "../actions/ authActions"; // Update the import path
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CLEAR_ERROR, CLEAR_SUCCESS } from "../actions/types";
import { toast } from "react-toastify";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, success } = useSelector((state) => state.auth);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    setUserData({ ...userData, [event.target.name]: numericValue });
  };
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(register(userData));
  };

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch({ type: CLEAR_SUCCESS });
      navigate("../");
      return;
    }
    if (error) {
      toast.error(error);
      dispatch({ type: CLEAR_ERROR });
      return;
    }
  }, [success, error, dispatch]);

  return (
    <section className="h-full flex items-center justify-center text-white">
      <div className="form-wrapper lg:max-w-[80%] mx-auto p-6 border border-slate-400 rounded-md w-full">
        <div className="form-tile mb-8">
          <h2 className="text-center text-2xl font-medium">
            Register
          </h2>
        </div>
        <form action="" onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label
              htmlFor=""
              className="text-sm font-medium mb-2 block"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <Input
              name="username"
              onChange={handleChange}
              value={userData.username}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor=""
              className="text-sm font-medium mb-2 block"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              name="email"
              onChange={handleChange}
              type="email"
              value={userData.email}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor=""
              className="text-sm font-medium mb-2 block"
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <Input
              name="phone"
              onChange={handleInputChange}
              type="tel"
              value={userData.phone}
              maxLength={10}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor=""
              className="text-sm font-medium mb-2 block"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              name="password"
              onChange={handleChange}
              value={userData.password}
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor=""
              className="text-sm font-medium mb-2 block"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              name="confirmPassword"
              onChange={handleChange}
              value={userData.confirmPassword}
              required
            />
          </div>
          <div className="mt-8">
            <Button className="min-h-[50px] w-full border border-border rounded-md my-3 bg-background whitespace-normal overflow-auto flex items-center justify-center p-2 hover:bg-foreground transition ransition-all duration=300">Register</Button>
          </div>
        </form>

        <div className="mt-2 text-blue-600">
          <span className="text-white">Already a member?</span><Link to={"../"}> Sign in</Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
