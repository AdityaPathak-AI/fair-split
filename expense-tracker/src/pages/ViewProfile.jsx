// ViewProfile.js
import { Menu, Transition } from "@headlessui/react";
import React, { useState, Fragment, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  UpdateUser,
  getUser,
  logout,
  resetPassword,
} from "../actions/ authActions";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import Input from "../components/Input";
import { toast } from "react-toastify";
import { CLEAR_ERROR, CLEAR_SUCCESS } from "../actions/types";
import { useNavigate } from "react-router-dom";
import { getNetProfit, getRoom } from "../actions/roomActions";
import { Link } from "react-router-dom";

function ViewProfile() {
  const navigate = useNavigate();
  const { user, success, error, message,isAuthenticated } = useSelector((state) => state.auth);
  const Groups = useSelector((state) => state.room.rooms);
  const { netTotal, loading } = useSelector((state) => state.room);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if(isAuthenticated){
      dispatch(getNetProfit());
       dispatch(getRoom());
    }
  }, [dispatch]);

  // Update-Profile
  const openUpdateProfileModal = () => {
    setUpdateProfileVisible(true);
    document.body.classList.add("overflow-y-hidden");
  };

  const closeUpdateProfileModal = () => {
    setUpdateProfileVisible(false);
    document.body.classList.remove("overflow-y-hidden");
  };

  const [UpdateProfileVisible, setUpdateProfileVisible] = useState(false);
  const [UpdateProfileInput, setUpdateProfileInput] = useState({
    username: "",
    phone: "",
  });

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    setUpdateProfileInput({
      ...UpdateProfileInput,
      [event.target.name]: numericValue,
    });
  };

  const handleUpdateProfileSubmit = async(e) => {
    e.preventDefault();
    await dispatch(UpdateUser(UpdateProfileInput));
    dispatch(getUser());
    navigate("/view-profile");
    closeUpdateProfileModal();
    setUpdateProfileInput({
      username: "",
      phone: "",
    });
  };

  // Reset-Passsword
  const openResetPassModal = () => {
    setResetPassModalVisible(true);
    document.body.classList.add("overflow-y-hidden");
  };
  const closeResetPassModal = () => {
    setResetPassModalVisible(false);
    document.body.classList.remove("overflow-y-hidden");
  };

  const [ResetPassModalVisible, setResetPassModalVisible] = useState(false); // State to manage modal visibility
  const [inputValueOfResetPass, setResetPassModalInput] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const validateResetPassInput = (target) => {
    const errors = {};
    if (
      inputValueOfResetPass.oldPassword === inputValueOfResetPass.newPassword
    ) {
      errors.newPassword =
        "New password should not be the same as the old password";
    }
    setErrors(errors);
    // Return true if there are no errors, false otherwise
    return Object.keys(errors).length === 0;
  };

  const handleResetPassSubmit = (e) => {
    e.preventDefault();
    if (validateResetPassInput()) {
      dispatch(resetPassword(inputValueOfResetPass));
      closeResetPassModal();
      setResetPassModalInput({
        oldPassword: "",
        newPassword: "",
      });
    }
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch({ type: CLEAR_SUCCESS });
      return;
    }
    if (success) {
      toast.success(success);
      dispatch({ type: CLEAR_SUCCESS });
      return;
    }
    if (error) {
      toast.error(error);
      dispatch({ type: CLEAR_ERROR });
      return;
    }
  }, [success, error, message, dispatch]);

  // Logout
  const handleLogout = () => {
    dispatch(logout());

    setErrors(errors);

    // Return true if there are no errors, false otherwise
    return Object.keys(errors).length === 0;
  };

  if (loading) {
    return (
      <div class="text-center p-10">
        <div role="status">
          <svg
            aria-hidden="true"
            class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="profile-page text-black">
      {user ? (
        <>
          <section className="w-full h-[350px] bg-foreground">
            <img
              src="https://images.unsplash.com/photo-1565514158740-064f34bd6cfd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="profile"
              className="w-full h-full bg-cover object-cover"
            />
          </section>
          <section className="relative py-16 bg-purple-200">
            <div className="container mx-auto px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div className="px-6">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                      <div className="relative">
                        <img
                          src="https://t3.ftcdn.net/jpg/05/60/26/08/360_F_560260880_O1V3Qm2cNO5HWjN66mBh2NrlPHNHOUxW.jpg"
                          alt="profile"
                          className="w-full h-full bg-cover object-cover"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                      <div>
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div className="flex items-center">
                            <Menu.Button
                              className="flex justify-around item-center gap-3 text-gray-900 bg-white uppercase font-bold hover:bg-purple-500 hover:text-white shadow-md shadow text-xs px-3 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                              type="button"
                            >
                              Edit Profile
                              <ChevronDown />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 mt-5 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-background shadow-lg ring-1 ring-black/5 focus:outline-none">
                              <div className="px-1 py-1 ">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={openUpdateProfileModal}
                                      className={`${
                                        active
                                          ? "bg-foreground  "
                                          : "text-primary"
                                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                      Update Profile
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={openResetPassModal}
                                      className={`${
                                        active
                                          ? "bg-foreground  "
                                          : "text-primary"
                                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      type="button"
                                    >
                                      Reset Password
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active
                                          ? "bg-foreground text-white"
                                          : "text-primary"
                                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      onClick={handleLogout}
                                    >
                                      Logout
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                        {/* Update Profile Modal */}
                        <div
                          className={`fixed ${
                            UpdateProfileVisible ? "" : "hidden"
                          } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
                        >
                          <div className="relative top-40 mx-auto shadow-xl rounded-md max-w-md bg-background">
                            <div className="flex justify-end p-2">
                              <button
                                onClick={closeUpdateProfileModal}
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                            <div className="p-6 pt-0 text-center text-white">
                              <form
                                action=""
                                onSubmit={handleUpdateProfileSubmit}
                              >
                                <div>
                                  <label
                                    htmlFor=""
                                    className="text-sm font-medium mb-2 block"
                                  >
                                    {" "}
                                    Username{" "}
                                  </label>
                                  <Input
                                    name="username"
                                    onChange={(e) =>
                                      setUpdateProfileInput((prev) => ({
                                        ...prev,
                                        username: e.target.value,
                                      }))
                                    }
                                    value={UpdateProfileInput.username}
                                  />
                                </div>

                                <div className="form-group mb-4">
                                  <label
                                    htmlFor=""
                                    className="text-sm font-medium mb-2 block"
                                  >
                                    Phone{" "}
                                  </label>
                                  <Input
                                    name="phone"
                                    onChange={handleInputChange}
                                    type="tel"
                                    value={UpdateProfileInput.phone}
                                    maxLength={10}
                                  />
                                </div>
                                <div className="mt-8">
                                  <Button>Save</Button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        {/* Update Profile Modal */}
                        {/* Reset Password Modal */}
                        <div
                          className={`fixed ${
                            ResetPassModalVisible ? "" : "hidden"
                          } z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4`}
                        >
                          <div className="relative top-40 mx-auto shadow-xl rounded-md bg-background max-w-md">
                            <div className="flex justify-end p-2">
                              <button
                                onClick={closeResetPassModal}
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                            <div className="p-6 pt-0 text-center text-white">
                              <form action="" onSubmit={handleResetPassSubmit}>
                                <div className="form-group">
                                  <label
                                    htmlFor=""
                                    className="text-sm font-medium mb-2 block"
                                  >
                                    Old-Password
                                  </label>
                                  <PasswordInput
                                    onChange={(e) =>
                                      setResetPassModalInput((prev) => ({
                                        ...prev,
                                        oldPassword: e.target.value,
                                      }))
                                    }
                                    value={inputValueOfResetPass.oldPassword}
                                  />

                                  {errors.oldPassword && (
                                    <div className="text-red-500">
                                      {errors.oldPassword}
                                    </div>
                                  )}
                                </div>
                                <div className="form-group">
                                  <label
                                    htmlFor=""
                                    className="text-sm font-medium mb-2 block"
                                  >
                                    New-Password
                                  </label>
                                  <PasswordInput
                                    onChange={(e) =>
                                      setResetPassModalInput((prev) => ({
                                        ...prev,
                                        newPassword: e.target.value,
                                      }))
                                    }
                                    value={inputValueOfResetPass.newPassword}
                                  />
                                  {errors.newPassword && (
                                    <div className="text-red-500">
                                      {errors.newPassword}
                                    </div>
                                  )}
                                </div>
                                <div className="mt-8">
                                  <Button
                                    disabled={
                                      !inputValueOfResetPass.oldPassword ||
                                      !inputValueOfResetPass.newPassword
                                    }
                                  >
                                    Reset-Password
                                  </Button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        {/* Reset Password Modal */}
                      </div>
                    </div>

                    {netTotal && (
                      <div className="w-full lg:w-4/12 px-4 lg:order-1">
                        <div className="flex justify-center py-4 lg:pt-4 pt-8">
                          <div className="mr-4 p-3 text-center">
                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                              {Groups?.length}
                            </span>
                            <span className="text-sm text-blueGray-400">
                              Groups
                            </span>
                          </div>

                          <div className="mr-4 p-3 text-center">
                            <span
                              className={`text-xl font-bold block uppercase tracking-wide whitespace-nowrap inline-block ${
                                netTotal?.total < 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {netTotal && netTotal.total < 0
                                ? `-₹${Math.abs(netTotal?.total)}`
                                : `₹${netTotal?.total}`}
                            </span>
                            <span className="text-sm text-blueGray-400">
                              Total
                            </span>
                          </div>

                          <div className="lg:mr-4 p-3 text-center">
                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                              ₹{netTotal?.credit}
                            </span>
                            <span className="text-sm text-blueGray-400">
                              Credit
                            </span>
                          </div>
                          <div className="lg:mr-4 p-3 text-center">
                            <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                              ₹{netTotal?.debit}
                            </span>
                            <span className="text-sm text-blueGray-400">
                              Debit
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-12">
                    <h3 className="text-4xl uppercase font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                      {user.message.username}
                    </h3>
                    <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                      <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-400"></i>
                      <span className="block">{user.message.phone}</span>
                      Surat, Gujarat
                    </div>
                    <div className="mb-2 text-blueGray-600 mt-10">
                      <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                      Age 23
                    </div>
                    <div className="mb-2 text-blueGray-600">
                      <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                      Backend-Developer
                    </div>
                  </div>
                  <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12 px-4">
                        <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                          About Section : Tell Something About Your-Self
                        </p>
                        <Link to={"../"} className="font-normal text-pink-500">
                          Home
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="text-red">...loading</div>
      )}
    </main>
  );
}

export default ViewProfile;
