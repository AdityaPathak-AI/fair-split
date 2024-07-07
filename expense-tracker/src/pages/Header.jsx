import { Menu, Transition } from "@headlessui/react";
import React, { Fragment} from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch} from "react-redux";
import { logout } from "../actions/ authActions";

function Header({ user }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <header className=" py-3 bg-background border-b border-border fixed top-0 left-0 right-0 z-50">
        <div className="container flex justify-between items-center">
          <div className="logo text-2xl font-semibold">
            <Link to={"/"}>Fair Split</Link>
          </div>
          <div className="user-profile flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-400 overflow-hidden">
             

                            <img src="https://t3.ftcdn.net/jpg/05/60/26/08/360_F_560260880_O1V3Qm2cNO5HWjN66mBh2NrlPHNHOUxW.jpg" alt="profile" className='w-full h-full bg-cover object-cover' />

                        </div>
                        <h3 className='text-sm font-medium'>{user?.message?.username}</h3>
                        <Menu as="div" className="relative inline-block text-left">
                            <div className='flex items-center'>
                                <Menu.Button className="inline-flex w-full justify-center items-center rounded-md bg-black/20 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
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
                                                <Link to="view-profile">
                                                    <button className={`${active ? 'bg-foreground  ': 'text-primary'
                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                        >
                                                        View Profile
                                                    </button>
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${active ? 'bg-foreground text-white' : 'text-primary'
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
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;
