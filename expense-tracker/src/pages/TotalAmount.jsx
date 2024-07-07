import React, { Fragment, useEffect, useState } from "react";
import Button from "../components/Button";
import {
  deleteRoom,
  getAllExpenseByRoom,
  getRoom,
  leaveRoom,
} from "../actions/roomActions";
import { useDispatch, useSelector } from "react-redux";
import { Transition, Dialog } from "@headlessui/react";
import Input from "../components/Input";
import { addNewExpense } from "../actions/expenseAction";
import { useNavigate } from "react-router-dom";
import { CLEAR_ERROR, CLEAR_SUCCESS } from "../actions/types";
import { toast } from "react-toastify";

function TotalAmount({ room_id, username }) {
  const [isOpenAddExpense, setIsOpenAddExpense] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [amount, setAmount] = useState(0);
  const [showLeaveRoomModal, setShowLeaveRoomModal] = useState(false);
  const [showDeleteRoomModal, setShowDeleteRoomModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const totalAmount = useSelector((state) => state.room.expenseByRoom);
  const group = useSelector((state) => state.room.room);
  let { Delmessage, Delerror } = useSelector((state) => state.room);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllExpenseByRoom(room_id));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, room_id]);


  const handleSettleUpClick = (member) => {
    setSelectedMember(member);
    setIsOpenAddExpense(true);
  };

  const handleSubmitAddExpense = (e) => {
    e.preventDefault();
    const userData = { user_id: selectedMember.user_id, share_amount: amount };

    const settleUpData = {
      title: `${username} Settled Up With ${selectedMember ? selectedMember.username : ""
        }`,
      amount: Number(amount),
      settled: true,
      room_id: room_id,
      shares: [userData],
    };
    dispatch(addNewExpense(settleUpData));
    setIsOpenAddExpense(false);
  };

  const handleLeaveRoom = () => {
    dispatch(leaveRoom(room_id));
    setShowLeaveRoomModal(false);
  };

  const handleDeleteRoom = () => {
    dispatch(deleteRoom(room_id));
    setShowDeleteRoomModal(false);
  };

  useEffect(() => {
    if (
      Delmessage === "Group left successfully" ||
      Delmessage === "Group deleted successfully"
    ) {
      toast.success(Delmessage);
      dispatch(getRoom());
      navigate("/");
      dispatch({ type: CLEAR_SUCCESS, payload: null });
    }
    if (Delerror) {
      toast.error(Delerror);
      dispatch({ type: CLEAR_ERROR });
    }
  }, [Delmessage, Delerror, dispatch]);

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
    <>
      {totalAmount === null ? (
        <div className="border border-border h-full rounded-md py-5 px-3 relative">
          <h4 className="bg-transparent font-semibold text-center">
            Group {room_id}
          </h4>
          <p className="mt-3">
            You owe <span className="text-green-500">₹ 0</span> overall
          </p>
          <div className="leave-room absolute bottom-20 left-0 right-0 w-[90%] mx-auto">
            <Button
              onClick={() => setShowLeaveRoomModal(true)}
              className="rounded-md bg-background hover:bg-foreground border border-border"
              type="button"
            >
              Leave Group
            </Button>
          </div>
          <div className="leave-room absolute bottom-5 left-0 right-0 w-[90%] mx-auto">
            <Button
              onClick={() => setShowDeleteRoomModal(true)}
              className="rounded-md bg-background hover:bg-foreground border border-border"
              type="button"
            >
              Delete Group
            </Button>
          </div>
        </div>
      ) : (
        totalAmount && (
          <div className="border border-border h-full rounded-md py-5 px-3 relative">
            <h4 className="bg-transparent font-semibold text-center">
              Group {room_id}
            </h4>
            <p className="mt-3">
              You{" "}
              {totalAmount.OverAllExpense && totalAmount.OverAllExpense < 0
                ? "owe"
                : "lent"}{" "}
              <span
                className={
                  totalAmount.OverAllExpense && totalAmount.OverAllExpense > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                ₹{" "}
                {totalAmount.OverAllExpense < 0
                  ? -totalAmount.OverAllExpense
                  : totalAmount.OverAllExpense}
              </span>{" "}
              overall
            </p>
            <div className="expense-details mt-3 px-2">
              {totalAmount.members &&
                totalAmount.members.length > 0 &&
                totalAmount.members.map((member, index) => {
                  return (
                    <div key={index}>
                      {member.totalExpense != 0 && (
                        <p className="flex justify-between mt-1 py-2">
                          {member.totalExpense < 0
                            ? `You owe ${member.username}`
                            : `${member.username} owes you`}
                          <span
                            className={
                              member.totalExpense < 0
                                ? "text-red-500"
                                : "text-green-500"
                            }
                          >
                            {" "}
                            ₹{Math.abs(member.totalExpense)}
                          </span>
                          {member.totalExpense < 0 ? (
                            <button
                              onClick={() =>
                                handleSettleUpClick(member) &&
                                setSelectedMember(member)
                              }
                              className="px-1 py-1 h-6 text-xs outline outline-1 outline-offset-1 mb-1 font-medium text-white leading-4 bg-transperent rounded hover:bg-purple-600  focus:bg-blue-600"
                              type="button"
                            >
                              Settle
                            </button>
                          ) : (
                            ""
                          )}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
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
                        Settle Up with{" "}
                        {selectedMember ? selectedMember.username : ""}
                      </h3>
                      <form onSubmit={handleSubmitAddExpense}>
                        <div className="form-group mb-4">
                          <label
                            htmlFor="amount"
                            className="text-sm font-medium text-white mb-2 block"
                          >
                            Amount <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            id="amount"
                            className="text-white bg-background"
                            value={amount}
                            onChange={(e) => {
                              setAmount(e.target.value);
                            }}
                          />
                        </div>
                        <Button className="mt-8">Add</Button>
                      </form>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition>
            {group && group[0].created_by === username ? <div className="leave-room absolute bottom-20 left-0 right-0 w-[90%] mx-auto">
              <Button
                onClick={() => setShowDeleteRoomModal(true)}
                className="rounded-md bg-background hover:bg-foreground border border-border"
                type="button"
              >
                Delete Group
              </Button>
            </div> : ''}
            <div className="leave-room absolute bottom-5 left-0 right-0 w-[90%] mx-auto">
              <Button
                onClick={() => setShowLeaveRoomModal(true)}
                className="rounded-md bg-background hover:bg-foreground border border-border"
                type="button"
              >
                Leave Group
              </Button>
            </div>
          </div>
        )
      )}

      <Transition appear show={showLeaveRoomModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setShowLeaveRoomModal(false)}
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
              <div className="bg-background rounded-lg p-8 max-w-md border border-border">
                <Dialog.Title className="text-center text-xl font-semibold mb-5">Are you sure?</Dialog.Title>
                <Dialog.Description className="text-center">
                 Do you really want to leave this group?
                </Dialog.Description>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleLeaveRoom} className="mr-2">
                    Leave
                  </Button>
                  <Button onClick={() => setShowLeaveRoomModal(false)}>Cancel</Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>


      <Transition appear show={showDeleteRoomModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setShowDeleteRoomModal(false)}
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
              <div className="bg-background rounded-lg p-8 max-w-md border border-border">
                <Dialog.Title className="text-center text-xl font-semibold mb-5">Are you sure?</Dialog.Title>
                <Dialog.Description className="text-center">
                  Do you really want to delete this group?
                </Dialog.Description>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleDeleteRoom} className="mr-2">
                    Delete
                  </Button>
                  <Button onClick={() => setShowDeleteRoomModal(false)}>Cancel</Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default TotalAmount;
