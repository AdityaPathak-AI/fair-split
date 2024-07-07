import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Group({ Groups }) {

  const location = useLocation();
  const activeGroupId = location.pathname.split('/')[2];

  return (
    <>
      <h3 className='mt-5 mb-3 font-semibold'>Your Groups</h3>
      <div className='border border-border h-[350px] rounded-md overflow-y-scroll py-5 px-3'>
        {Groups.map((group) => (
          <Link to={`/group-expense/${group.room_id}`} key={group.room_id}>
            <div
              className={`min-h-[50px] w-full border border-border rounded-md my-3 whitespace-normal overflow-auto flex items-center justify-center p-2 hover:bg-foreground transition ransition-all duration=300 ${
                group.room_id === parseInt(activeGroupId) ? 'bg-purple-400' : ''
              }`}
            >
              <h3 className='font-semibold'>{group.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default Group;
