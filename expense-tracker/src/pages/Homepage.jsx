import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getNetProfit } from '../actions/roomActions';

export default function Homepage() {
 
  const dispatch = useDispatch(); 
  const { netTotal} = useSelector(state => state.room);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);

  useEffect(()=>{
    const fetchData = async () => { 
        await dispatch(getNetProfit())
        setLoading(false);
    }
    fetchData();
  },[dispatch]);

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
        <h1 className="p-5 font-black text-4xl">नमस्ते 🙏, <span className="text-purple-600 uppercase">{user?.message?.username}</span></h1>

        <div className="grid xl:grid-cols-2 gap-5 mb-10">
            <div className="my-5 max-w-md rounded-lg bg-pink-100 py-4 px-8 shadow-lg">
                <div className="-mt-10 flex justify-center md:justify-end ">
                    {/* <img className="h-14 w-14 p-2 rounded-full border-2 border-indigo-500 object-cover " src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtXeeRYw61xe_C3_I6SQy02WiapLeXhO_u1w_GYChUAQ&s" /> */}
                    <p href="#" className="bg-green-700 font-black text-white rounded-3xl border-2 border-green-500 p-2">Total Lent</p>
                </div>
                <div>
                    <h2 className="font-black text-4xl mt-2 text-green-600">₹{netTotal?.credit}</h2>
                </div>
                {/* <div className="mt-4 flex justify-end">
                    <p href="#" className="text-sm font-medium text-green-500">Credited Amount</p>
                </div> */}
            </div>

            <div className="my-5 max-w-md rounded-lg bg-blue-100 py-4 px-8 shadow-lg">
                <div className="-mt-10 flex justify-center md:justify-end">
                    {/* <img className="h-14 w-14 p-2 rounded-full border-2 border-indigo-500 object-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaajrf5KIpfsQ6wwFGJAH85N3C2tRYXmUbG2FT2YDOfQ&s" /> */}
                    <p href="#" className="bg-red-700 font-black text-white rounded-3xl border-2 border-red-500 p-2">Total Borrowed</p>
                </div>
                <div>
                    <h2 className="font-black text-4xl mt-2 text-red-600">₹{netTotal?.debit}</h2>
                </div>
                {/* <div className="mt-4 flex justify-end">
                    <p href="#" className="text-sm font-medium text-red-500">Debited Amount</p>
                </div> */}
            </div>
        </div>

        <div className="container flex justify-center">
            <img src="https://i.pinimg.com/originals/4e/e2/d8/4ee2d830123e4c0a182df63fd9bd5260.jpg" alt="" />
        </div>
    </>
  )
}
