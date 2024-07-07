import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Menu, Transition, Dialog } from "@headlessui/react";
import Button from "../components/Button";
import AllExpenses from "./AllExpenses";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  addRoomMember,
  getAllRoomMember,
  getRoom,
} from "../actions/roomActions";
import { addNewExpense, getAllExpenses } from "../actions/expenseAction";
import { toast } from "react-toastify";
import { CLEAR_ERROR, CLEAR_SUCCESS } from "../actions/types";

const Expense = () => {
  const { id } = useParams();
  const [isOpenAddExpense, setIsOpenAddExpense] = useState(false);
  const [isOpenAddMember, setIsOpenAddMember] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const [isEqual, setIsEqual] = useState(true);
  const [addExpense, setAddExpense] = useState({
    title: "",
    amount: "",
    room_id: Number(id),
    shares: [],
  });
  const [addMemberEmails, setAddMemberEmails] = useState([]);
  const [addMemberEmail, setAddMemberEmail] = useState("");

  const dispatch = useDispatch();
  const Group = useSelector((state) => state.room.room);
  const { members, addedMembers, invitedMembers, existingMembers } =
    useSelector((state) => state.room);

  const { expenses, success, error } = useSelector((state) => state.expense);

  // useEffect(() => {
  //   dispatch(getAllExpenses(id, 0));
  // }, [dispatch, id]);

  useEffect(() => {
    dispatch(getAllRoomMember(id));
    dispatch(getAllExpenses(id, 0));
    dispatch(getRoom(id));
  }, [dispatch, id]);

  const handleChangeAddExpense = (e) => {
    setAddExpense({ ...addExpense, [e.target.name]: e.target.value });
  };

  // manage state when user add individual expense
  const handleUserAmountChange = (userId, amount) => {
    let updatedUsers;
    if (amount.trim() === "") {
      // If amount is empty, remove the user entry
      updatedUsers = addExpense.shares.filter(
        (user) => user.user_id !== userId
      );
    } else {
      const existingUserIndex = addExpense.shares.findIndex(
        (user) => user.user_id === userId
      );
      if (existingUserIndex !== -1) {
        updatedUsers = addExpense.shares.map((user) =>
          user.user_id === userId
            ? { ...user, share_amount: parseFloat(amount) }
            : user
        );
      } else {
        updatedUsers = [
          ...addExpense.shares,
          { user_id: userId, share_amount: parseFloat(amount) },
        ];
      }
    }
    setAddExpense({
      ...addExpense,
      shares: updatedUsers || [], // Ensure users is always an array
    });
  };

  // manage state when user split equally between users
  const handleCheckboxChange = (userId, checked) => {
    let updatedShares = [...addExpense.shares];

    if (checked) {
      const shareAmount = (
        addExpense.amount /
        (addExpense.shares.length + 1)
      ).toFixed(2);
      updatedShares.push({ user_id: userId, share_amount: shareAmount });
      updatedShares = updatedShares.map((share) => ({
        ...share,
        share_amount: parseFloat(shareAmount),
      }));
    } else {
      // If the checkbox is unchecked, remove the corresponding user's share
      updatedShares = updatedShares.filter((share) => share.user_id !== userId);

      // Recalculate share amounts for the remaining selected users
      const remainingUsersCount = updatedShares.length;
      const shareAmount = (addExpense.amount / remainingUsersCount).toFixed(2);
      console.log(shareAmount);
      updatedShares = updatedShares.map((share) => ({
        ...share,
        share_amount: parseFloat(shareAmount),
      }));
    }

    // Update the state with the modified shares array
    setAddExpense((prevState) => ({
      ...prevState,
      shares: updatedShares,
    }));
  };

  const handleSubmitAddExpense = async (e) => {
    e.preventDefault();
    await dispatch(addNewExpense(addExpense));
    setIsOpenAddExpense(false);
    dispatch(getAllExpenses(id, 0));
    setAddExpense({
      title: "",
      amount: "",
      room_id: Number(id),
      shares: [],
    });
  };

  const handleAddMemberEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(addMemberEmail)) {
      toast.error("Email Is Not Valid");
      return;
    }
    setAddMemberEmails((prev) => {
      let result = [...prev, addMemberEmail];
      return result;
    });
    setAddMemberEmail("");
  };

  const handleRemoveMemberEmail = (index) => {
    const updatedEmails = [...addMemberEmails];
    updatedEmails.splice(index, 1);
    setAddMemberEmails(updatedEmails);
  };

  const handleSubmitAddMember = async (e) => {
    e.preventDefault();
    if (addMemberEmails.length === 0) {
      toast.error("Please Enter Email");
      return;
    }
    await dispatch(addRoomMember({ room_id: id, emails: addMemberEmails }));
    dispatch(getAllRoomMember(id));
    setIsOpenAddMember(false);
    setAddMemberEmails([]);
    // Show the result modal after adding a new member
    setShowResultModal(true);
  };

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch({ type: CLEAR_SUCCESS });
      return;
    }
    if (error) {
      toast.error(error);
      dispatch({ type: CLEAR_ERROR, payload: null });
      return;
    }
  }, [success, error]);

  return (
    <>
      <div className="container py-5">
        {/* it will display room title */}
        <div className="room-details">
          <h4 className="font-semibold">{Group[0]?.name}</h4>
          <p>{Group[0]?.description}</p>
        </div>
        {/* Here we'll display all member */}
        <div className="all-members mt-5">
          <Menu as="div" className="relative inline-block text-left z-[2]">
            <Menu.Button className="rounded-md bg-background hover:bg-foreground border border-border p-3 w-full">
              All members of this Group
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute w-full left-0 mt-2 border border-border p-3 origin-top-right divide-y divide-gray-100 rounded-md bg-background shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="px-1 py-1 ">
                  {members &&
                    members.length > 0 &&
                    members.map((member) => (
                      <Menu.Item key={member.user_id}>
                        <h3 className="my-1">{member.username}</h3>
                      </Menu.Item>
                    ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div className="grid xl:grid-cols-2 gap-5 mt-5">
          <div className="add-member">
            <Button
              className="rounded-md bg-background hover:bg-foreground border border-border py-3"
              onClick={() => setIsOpenAddMember((prev) => !prev)}
            >
              Add New Member
            </Button>
          </div>
          <div className="add-expense items-end">
            <Button
              className="rounded-md bg-background hover:bg-foreground border border-border py-3"
              onClick={() => setIsOpenAddExpense((prev) => !prev)}
            >
              Add New Expense
            </Button>
          </div>
        </div>

        {/* All Expenses */}
        <AllExpenses room_id={id} expenses={expenses} />
        {/* Add Expense Modal */}
        <Transition appear show={isOpenAddExpense} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsOpenAddExpense(false)}
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
                    Add New Expense
                  </h3>
                  <form action="" onSubmit={handleSubmitAddExpense}>
                    <div className="form-group mb-4">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-white mb-2 block"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="title"
                        id="expense_name"
                        className="text-white bg-background"
                        onChange={handleChangeAddExpense}
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label
                        htmlFor="amount"
                        className="text-sm font-medium text-white mb-2 block"
                      >
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        name="amount"
                        id="amount"
                        className="text-white bg-background"
                        value={addExpense.amount}
                        onChange={handleChangeAddExpense}
                      />
                    </div>
                    <div className="flex justify-between gap-5 mb-5">
                      <Button
                        type="button"
                        className="py-3 w-full rounded-md bg-background hover:bg-foreground border border-border"
                        onClick={() => setIsEqual(true)}
                      >
                        Equally
                      </Button>
                      <Button
                        type="button"
                        className="py-3 w-full rounded-md bg-background hover:bg-foreground border border-border"
                        onClick={() => setIsEqual(false)}
                      >
                        Unequally
                      </Button>
                    </div>
                    {isEqual ? (
                      <div className="form-group mb-4">
                        {members &&
                          members.length > 0 &&
                          members.map((member, index) => (
                            <div key={index} className="grid grid-cols-12 mt-2">
                              <div className="col-span-9 self-center">
                                <label
                                  htmlFor={`split_${member.user_id}`}
                                  className="text-white"
                                >
                                  {member.username}
                                </label>
                              </div>

                              <div className="col-start-12 flex justify-center items-center">
                                <input
                                  type="checkbox"
                                  id={`split_${member.user_id}`}
                                  name={`split_${member.user_id}`}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      member.user_id,
                                      e.target.checked
                                    )
                                  }
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="form-group mb-4">
                        {members.length > 0 &&
                          members.map((member, index) => (
                            <div key={index} className="grid grid-cols-12 mt-2">
                              <div className="col-span-9 self-center">
                                <label
                                  htmlFor={`split_${member.user_id}`}
                                  className="text-white"
                                >
                                  {member.username}
                                </label>
                              </div>

                              <div className="col-start-10 col-span-2">
                                <Input
                                  type="number"
                                  name={`amount_${member.user_id}`}
                                  id={`amount_${member.user_id}`}
                                  className="text-white bg-background"
                                  onChange={(e) =>
                                    handleUserAmountChange(
                                      member.user_id,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                    <Button className="mt-8">Add</Button>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        {/* Add Expense Modal Ended*/}
        {/* Result modal */}
        <Transition show={showResultModal} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto "
            onClose={() => setShowResultModal(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 " />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Result
                  </Dialog.Title>
                  <div className="mt-2 text-lg font-medium leading-6 text-gray-700">
                    {existingMembers.length ? <div className="mb-4 bg-blue-200 rounded-lg p-2 text-center">
                      <p className="mb-2">
                        Existing Members: {existingMembers.length}
                      </p>
                      {existingMembers.length > 0 &&
                        existingMembers.map((member, index) => (
                          <p key={index} className="mb-1">
                            {member}
                          </p>
                        ))}
                    </div> : ''}
                    {invitedMembers.length ? <div className="mb-4 bg-green-200 rounded-lg p-2 text-center">
                      <p className="mb-2">
                        Invited Members: {invitedMembers.length}
                      </p>
                      {invitedMembers.length > 0 &&
                        invitedMembers.map((member, index) => (
                          <p key={index} className="mb-1">
                            {member}
                          </p>
                        ))}
                    </div> : ''}
                    {addedMembers.length ? <div className="mb-4 bg-yellow-200 rounded-lg p-2 text-center">
                      <p className="mb-2">
                        Added Members: {addedMembers.length}
                      </p>
                      {addedMembers.length > 0 &&
                        addedMembers.map((member, index) => (
                          <p key={index} className="mb-1">
                            {member}
                          </p>
                        ))}
                    </div> : ''}
                  </div>

                  <div className="mt-4">
                    <Button onClick={() => setShowResultModal(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        {/* Result Modal Ended*/}
        {/* Add Members Modal */}
        <Transition appear show={isOpenAddMember} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsOpenAddMember(false)}
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
                    Add New Member
                  </h3>
                  <form action="" onSubmit={handleSubmitAddMember}>
                    <div className="form-group mb-4">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-white mb-2 block"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        onChange={(e) => setAddMemberEmail(e.target.value)}
                        value={addMemberEmail}
                        className="text-white bg-background"
                        type="email"
                        name="email"
                      />
                      <Button
                        type="button"
                        className="mt-2"
                        onClick={handleAddMemberEmail}
                        disabled={!addMemberEmail}
                      >
                        Add
                      </Button>
                    </div>
                    {/* Display added emails */}
                    <div className="added-emails">
                      {addMemberEmails.map((email, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between mb-2 px-2 hover:border border-slate-800 rounded"
                        >
                          <p className="text-white mr-2">{email}</p>
                          <button
                            className="bg-transparent  text-white font-bold py-1 px-2 my-1 rounded hover:bg-slate-800"
                            type="button"
                            onClick={() => handleRemoveMemberEmail(index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-6 h-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <Button className="mt-8">Add Members</Button>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        {/* Add Members Modal Ended*/}
      </div>
    </>
  );
};

export default Expense;
