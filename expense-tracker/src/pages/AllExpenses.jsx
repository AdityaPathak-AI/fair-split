import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteExpense, getAllExpenses } from "../actions/expenseAction";
import { getAllTransactions } from "../actions/transactionAction";

function AllExpenses({ room_id, expenses }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        await dispatch(getAllExpenses(room_id, (currentPage - 1) * 5));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [currentPage, dispatch, room_id]);


  const { user } = useSelector((state) => state.auth);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteExpense = (id) => {
    dispatch(deleteExpense(id));
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return  <div class="text-center p-10">
                <div role="status">
                    <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </div>; 
  }

  
  return (
    <>
      {expenses && expenses.length > 0 ? (
        expenses.map((expense, index) => (
          <div className="relative w-full mt-5 border border-border rounded-md " key={index}>
            <div className="w-full rounded-2xl bg-background p-2">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      type="submit"
                      className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                    >
                      <span>{expense.title}</span>
                      <div className="">
                        <div className="flex gap-3">
                          <b>total: ₹{expense.amount}</b>
                          {expense.settled === 0 ? <ChevronDown /> : ""}
                        </div>
                        {expense.settled === 0 && expense.lent_or_borrowed !== null ? (
                          <div>
                            <p className={`mt-1 ${expense.lent_or_borrowed > 0 ? "text-green-500" : expense.lent_or_borrowed < 0 ? "text-red-500" : "text-gray-500"}`}>
                              {expense.lent_or_borrowed > 0
                                ? `You Lent ₹${expense.lent_or_borrowed}`
                                : expense.lent_or_borrowed < 0
                                  ? `You Borrowed ₹${-expense.lent_or_borrowed}`
                                  : `You are not involved`}
                            </p>
                          </div>
                        ) : expense.settled === 0 ? (
                          <div>
                            <p className="mt-1 text-gray-500">You are not involved</p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </Disclosure.Button>
                    {expense.settled === 0 ? <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                      {expense.split_amount &&
                        Object.entries(expense.split_amount).map(([name, amount]) => (
                          <p
                            key={name}
                            className={`mt-1 ${user.message.username === name ? "text-red-500" : "text-green-500"}`}
                          >
                            {user.message.username === name ? `You owe ₹${amount}` : `${name} owes ₹${amount}`}
                          </p>
                        ))}
                      <p className="mt-3">Paid by :- {expense.paid_by}</p>
                      <p className="mt-3">On {formatDate(expense.updated_at)}</p>
                      {expense.paid_by === "You" && (
                        <button
                          className="mt-3 border border-white text-white hover:bg-purple-500 hover:border-transparent py-2 px-4 rounded-lg transition-colors duration-300"
                          type="button"
                          onClick={() => handleDeleteExpense(expense.expense_id)}
                        >
                          Delete
                        </button>
                      )}
                    </Disclosure.Panel> : ''}
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full rounded-2xl bg-background p-2">
          <p className="text-center">No Expense Yet !!!</p>
        </div>
      )}
      {(

        <div className="bg-transparent-200 max-w-lg p-10 container flex justify-center mx-auto fixed bottom-0 w-full right-0 left-0">
          <div className="flex flex-row mx-auto">
            <button
              type="button"
              className="bg-gray-800 text-white rounded-l-md border-r border-gray-100 py-2 hover:bg-purple-700 hover:text-white px-3"
              onClick={handlePrev}
            >
              <div className="flex flex-row align-middle">
                <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                </svg>
                <p className="ml-2">Prev</p>
              </div>
            </button>
            <button
              type="button"
              className="bg-gray-800 text-white rounded-r-md py-2 border-l border-gray-200 hover:bg-purple-700 hover:text-white px-3"
              onClick={handleNext}
            >
              <div className="flex flex-row align-middle">
                <span className="mr-2">Next</span>
                <svg className="w-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>

      )}
    </>
  );
}

export default AllExpenses;
