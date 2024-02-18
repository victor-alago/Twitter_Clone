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
    <div className="p-6 bg-slate-100 rounded-lg mx-4 space-y-4">
      {users &&
        users.map((user) => {
          return (
            <div key={user._id} className="p-2">
              <User user={user} setData={setUsers} />
            </div>
          );
        })}
    </div>
  );
};

export default WhoToFollow;
