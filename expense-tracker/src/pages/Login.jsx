import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { login } from "../actions/ authActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CLEAR_ERROR, CLEAR_SUCCESS } from "../actions/types";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { success, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(inputValue));
  };

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (success) {
      console.log("from login success")
      toast.success(success);
      dispatch({ type: CLEAR_SUCCESS });
      return;
    }
    if (error) {
      console.log("from login error")
      toast.error(error);
      dispatch({ type: CLEAR_ERROR });
      return;
    }
  }, [success, error, dispatch]);

  return (
    <>
      <section className="h-full flex items-center justify-center text-white">
        <div className="form-wrapper lg:max-w-[80%] mx-auto p-6 border border-slate-400 rounded-md w-full">
          <div className="form-tile mb-8">
            <h2 className="text-center text-2xl font-medium ">
              Login
            </h2>
          </div>
          <form action="" onSubmit={handleSubmit} method="POST">
            <div className="form-group mb-4">
              <label
                htmlFor=""
                className="text-sm font-medium mb-2 block"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                onChange={(e) =>
                  setInputValue((prev) => ({ ...prev, email: e.target.value }))
                }
                type="email"
                name="email"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor=""
                className="text-sm font-medium mb-2 block"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <PasswordInput
                onChange={(e) =>
                  setInputValue((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mt-8">
              <Button
                disabled={
                  !inputValue.email.trim() || !inputValue.password.trim()
                }
                className="min-h-[50px] w-full border border-border rounded-md my-3 bg-background whitespace-normal overflow-auto flex items-center justify-center p-2 hover:bg-foreground transition ransition-all duration=300"
              >
                Login
              </Button>
            </div>
          </form>

          <div className="mt-2 text-blue-600">
          <span className="text-white">Not a member? </span><Link to={"register"}>Create an Account</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
