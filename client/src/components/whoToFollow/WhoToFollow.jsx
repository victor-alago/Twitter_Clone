import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import User from "../user/User";
import axios from "axios";

const WhoToFollow = () => {
  const [users, setUsers] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  // useEffect hook can't be asynchronous, so we use an async function inside the hook
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users/find/");
        setUsers(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [currentUser.username]);

  return (
    <div className="absolute top-[calc(70px + 10px)] right-0 bg-blur flex items-start justify-end w-[calc(100vw - 20px)]">
      <div className="relative w-[320px] bg-slate-200 rounded-lg p-8 flex flex-col gap-4">
        <h2 className="font-bold text-2xl">You may like</h2>

        {users &&
          users.map((user) => {
            return (
              <div key={user._id} className="p-2">
                <User user={user} setData={setUsers} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default WhoToFollow;
