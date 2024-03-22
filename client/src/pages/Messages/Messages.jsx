import io from "socket.io-client";
import LeftSideBar from "../../components/leftSideBar/LeftSideBar";
import MessageList from "../../components/messages/MessageList";
import { useState, useEffect } from "react";
import Chat from "../../components/messages/Messages";
import { useSelector } from "react-redux";

const socket = io.connect("http://localhost:8000");

function Messages() {
  const { currentUser } = useSelector((state) => state.user);
  const [showChat, setShowChat] = useState(false);


const joinRoom = () => {
    const room = "chatRoom"; // Modify this based on your requirements
    socket.emit("join_room", room);
    setShowChat(true);
  };

  useEffect(() => {
    if (currentUser) {
    joinRoom();
    }
    }, [currentUser]);

    const [selectedFollower, setSelectedFollower] = useState(null);

    return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 pt-[70px]">
            <div className="px-6">
              <LeftSideBar />
            </div>

            <div className="bg-white p-4 rounded shadow col-span-2">
                <MessageList onSelect={(user) => setSelectedFollower(user)} />
            </div>
    
            <div className="App">
              {!showChat ? (
                <div className="joinChatContainer">
                  <h3>Join A Chat</h3>
                  <button onClick={joinRoom}>Join A Room</button>
                </div>
              ) : (
                <Chat socket={socket} currentUser={currentUser} selectedFollower={selectedFollower} />
              )}
            </div>
          </div>
        </>
      );
    }
    
    
export default Messages;

