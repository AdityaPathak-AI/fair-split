import React, { Fragment, useEffect, useState } from "react";
import Header from "../pages/Header";
import { Outlet } from "react-router";
import Button from "../components/Button";
import Group from "../pages/Group";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import TotalAmount from "../pages/TotalAmount";
import { Dialog, Transition } from "@headlessui/react";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { getRoom } from "../actions/roomActions";
import { getUser } from "../actions/ authActions";

import { createRoom } from "../actions/roomActions";
import { toast } from "react-toastify";
import { CLEAR_ERROR, CLEAR_SUCCESS } from "../actions/types";
import Homepage from "../pages/Homepage";

function HomeLayout() {
  const { id } = useParams();
  const { pathname } = useLocation();
  let [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [createRoomInput, setCreateRoomInput] = useState({
    name: "",
    description: "",
  });

  const dispatch = useDispatch();

  const Groups = useSelector((state) => state.room.rooms);
  const { user, isAuthenticated} = useSelector((state) => state.auth);
  const { success, roomError } = useSelector((state) => state.room);
 

  useEffect(() => {
    if(isAuthenticated){
      dispatch(getRoom());
      dispatch(getUser());
    }
  }, [dispatch]);

  useEffect(() => {
    const validGroups = Groups?.filter((group) => group.room_id === Number(id));

    if (validGroups.length === 0) {
      // Redirect to /404 if no valid groups found
      navigate("/");
    } else {
      // If valid groups found, you can proceed with your logic here
    }
  }, [id, navigate, Groups]); // Include history in dependency array

  const handleChange = (e) => {
    setCreateRoomInput({ ...createRoomInput, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createRoom(createRoomInput));
    setIsOpen(false);
    dispatch(getRoom());

    setCreateRoomInput({
      name: "",
      description: "",
    });
  };

  useEffect(() => {
    if (success) {
      console.log(" success from all most homelayout")
      toast.success(success);
      dispatch({ type: CLEAR_SUCCESS });
    }
    if (roomError) {
      console.log(" error from all most homelayout")
      toast.error(roomError);
      dispatch({ type: CLEAR_ERROR });
    }
  }, [success, roomError, dispatch]);

  return (
    <>
      <Header user={user} />
      <main>
        <section className="h-screen xl:w-[350px] lg:w-[300px] w-[250px] border-r border-border fixed left-0 top-0 pt-[60px]">
          <div className="container h-full p-5">
            <Button
              className="py-3 w-full rounded-md bg-background hover:bg-foreground border border-border"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              Create Group
            </Button>
            <Transition appear show={isOpen} as={Fragment}>
              <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsOpen(false)}
              >
                <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1/3">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <div className="create-room-dialog-box p-5 border border-border rounded-md bg-background">
                      <h3 className="text-center text-xl font-medium my-3">
                        Create Group
                      </h3>
                      <form action="" onSubmit={handleSubmit}>
                        <div className="form-group mb-4">
                          <label
                            htmlFor="room_name"
                            className="text-sm font-medium text-white mb-2 block"
                          >
                            Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            name="name"
                            id="room_name"
                            className="text-white bg-background"
                            value={createRoomInput.name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group mb-4">
                          <label
                            htmlFor="room_name"
                            className="text-sm font-medium text-white mb-2 block"
                          >
                            Description
                          </label>
                          <Input
                            type="text"
                            name="description"
                            id="room_name"
                            className="text-white bg-background"
                            value={createRoomInput.description}
                            onChange={handleChange}
                          />
                        </div>
                        <Button className="mt-8">Create</Button>
                      </form>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>

            {/* All rooms */}
            <Group Groups={Groups} />
          </div>
        </section>
        <section className="xl:ms-[350px] xl:me-[350px] lg:ms-[300px] lg:me-[300px] ms-[250px] me-[250px] mt-[60px] h-screen overflow-y-scroll p-5">
         {id !== undefined ? <Outlet /> : <Homepage/>}
        </section>
        <section className="h-screen xl:w-[350px] lg:w-[300px] w-[250px] border-l border-border fixed right-0 top-0 pt-[60px]">
          <div className="container h-full p-5">
            {pathname.includes("/group-expense") ? (
              <TotalAmount room_id={id} username={user.message.username} />
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}

export default HomeLayout;
