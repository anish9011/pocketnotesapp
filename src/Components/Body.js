import React, { useState, useEffect, useRef, forwardRef } from 'react';

const Modal = forwardRef(({ isOpen, onClose, onCreate }, ref) => {
  const [groupName, setGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#B38BFA');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ groupName, selectedColor });
    setGroupName('');
    setSelectedColor('#B38BFA');
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed flex justify-center items-center sm:w-[840px] sm:h-[317px] sm:top-[344px] sm:left-[500px] top-[10em] left-[10%] w-[80%] max-w-[840px] h-auto">
      <div  ref={ref} className="bg-white p-4 sm:p-6 w-full sm:w-[600px] h-auto relative shadow-lg rounded-[6px]">
        <h2 className="font-roboto text-[18px] sm:text-[22px] font-medium leading-[28px] sm:leading-[36px] tracking-[0.035em] text-left text-black mb-4">
          Create New Group
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row sm:flex-row justify-start space-x-2 sm:space-x-6 space-y-4 sm:space-y-0">
            <h1 className="font-roboto text-[16px] sm:text-[20px] font-medium leading-[24px] sm:leading-[32px] tracking-[0.035em] text-left text-black whitespace-nowrap mt-6 sm:mt-2">
              Group Name
            </h1>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border-2 border-[#CCCCCC] rounded-3xl p-2 w-full sm:w-[300px]"
              placeholder="Enter group name"
              required
            />
          </div>
          <div className="relative flex flex-col sm:flex-row justify-start mt-4 ">
            <h1 className="font-roboto text-[16px] sm:text-[20px] font-medium leading-[24px] sm:leading-[32px] tracking-[0.035em] text-black w-full sm:w-[150px] h-[36px] whitespace-nowrap">
              Choose Color
            </h1>
            <div className="flex space-x-3 mt-2 sm:mt-0 sm:absolute sm:top-[0px] sm:left-[180px] justify-start">
              {['#B38BFA', '#FF79F2', '#43E6FC', '#F19576', '#0047FF', '#6691FF'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-[30px] h-[30px] rounded-[30px] ${selectedColor === color ? 'border-4 border-gray-600' : ''}`}
                  style={{ backgroundColor: color }}
                ></button>
              ))}
            </div>
          </div>
          <div className="relative mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-[#001F8B] w-[120px] sm:w-[140px] h-[30px] sm:h-[35px] rounded-[11px] text-white text-[14px] sm:text-[16px] font-normal leading-[24px] sm:leading-[28px] tracking-[0.035em] text-center"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});


const Chat = ({ group, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      const timestamp = new Date();
      const newMessages = [...messages, { text: trimmedMessage, timestamp }];
      setMessages(newMessages);
      setMessage('');
      localStorage.setItem(`messages_${group.id}`, JSON.stringify(newMessages)); 
      onSendMessage(group.id, newMessages); 
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const [datePart, timePart] = formattedDate.split(',');

    return { datePart, timePart };
  };

  useEffect(() => {
    if (group) {

      const storedMessages = localStorage.getItem(`messages_${group.id}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([]); 
      }
    }
  }, [group]);

  return (
    <>
    <div className="bg-[#DAE5F5] sm:h-[90%] h-[90%] ">
        <nav className="bg-[#001F8B] flex justify-between items-center p-4 text-white ">
          <div className="text-2xl font-bold">{group.groupName} Chat</div>
        </nav>

        <div className="flex flex-col h-full p-4 overflow-y-auto custom-scrollbar">
          {/* Messages Section */}
          <div className="flex-1 mb-4 sm:max-h-[650px] max-h-[500px] ">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="border py-6 px-6 mt-4 top-[122px] left-[475px] rounded-tl-[5px] shadow-[0px_4px_7px_0px_rgba(0,0,0,0.2)] bg-white "
              >
                <span className="font-roboto text-[18px] font-normal leading-[28.83px] tracking-[0.035em] text-left text-black break-words w-[400px]">
                  {msg.text}
                </span>
                <div className="text-xs text-[#353535] mt-2 font-roboto text-[18px] font-medium leading-[17.58px] tracking-[0.02em] text-right">
                  <span>{formatTimestamp(msg.timestamp).datePart}</span>
                  <span className="font-bold text-[#353535] text-2xl mx-2">
                    •
                  </span>
                  <span>{formatTimestamp(msg.timestamp).timePart}</span>
                </div>
              </div>
            ))}</div>
            <form
              onSubmit={handleSendMessage}
              className="flex-shrink-1 bg-[#001F8B] p-4 w-full flex items-center sm:w-[70%] fixed bottom-0 left-0 sm:left-[30%] right-0"
            >
              <div className="w-full relative">
              <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
             if (e.key === 'Enter' && !e.shiftKey) {
             e.preventDefault(); 
              handleSendMessage(e); 
             }
              }}
               className="border-[#CCCCCC] rounded-lg p-4 mt-0 w-full h-40 resize-none"
               placeholder="Enter your text here.........."
             required
              />
            <button
              type="submit"
              className="absolute right-6 bottom-4 p-2 rounded-full flex items-center justify-center"
              onClick={handleSendMessage} // Send message when button is clicked
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-10 h-10 ${message ? 'text-[#001F8B]' : 'text-[#ABABAB]'}`}
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
              </div>
            </form>
          </div>
        </div>
    </>
  );
};



export default function Body() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const userId = "currentUserId";
  const modalRef = useRef(null);  

  const handleSendMessage = (groupId, messages) => {
    localStorage.setItem(`messages_${groupId}`, JSON.stringify(messages));
  };

  const handleCreateGroup = ({ groupName, selectedColor }) => {
    const newGroup = {
      id: Date.now(),
      groupName,
      color: selectedColor,
      ownerId: userId,  
    };

    localStorage.setItem(`messages_${newGroup.id}`, JSON.stringify([])); 

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups)); 
  };

  useEffect(() => {

    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      const allGroups = JSON.parse(storedGroups);
      const userGroups = allGroups.filter(group => group.ownerId === userId);
      setGroups(userGroups);
    }

    setSelectedGroup(null);
    localStorage.removeItem('selectedGroup');
  }, []);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    localStorage.setItem('selectedGroup', JSON.stringify(group)); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click was outside the modal
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false); // Close modal if click is outside
      }
    };

    // Attach event listener to detect clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={`flex h-screen overflow-hidden ${isModalOpen ? 'bg-[#2F2F2FBF]' : ''}`}>
        <div
          className={`flex-1 relative ${selectedGroup ? 'hidden sm:block' : 'block'}`}
        >
          <p className="font-roboto text-[35px] font-medium leading-[41.02px] tracking-[0.02em] left-[20%] w-[319px] h-[41px] fixed sm:top-[76px] sm:left-[8%] top-16 right-48">
            Pocket Notes
          </p>
          <div className="mt-[156px] relative max-h-[900px] h-[900px] overflow-y-auto custom-scrollbar">
            <ul className="relative">
              {groups.map((group, index) => (
                <li
                  key={index}
                  className={`flex items-center space-x-16 cursor-pointer relative w-[554px] h-[98px]  ${
                    selectedGroup && selectedGroup.id === group.id
                      ? 'bg-[#2F2F2F2B] opacity-100'
                      : ''
                  }`}
                  onClick={() => handleGroupClick(group)}
                >
                  <span
                    className="w-[77px] h-[74px] rounded-full flex items-center justify-center ml-10"
                    style={{ backgroundColor: group.color }}
                  >
                    <span className="text-white">
                      {group.groupName
                        ? group.groupName.slice(0, 2).toUpperCase()
                        : 'NA'}
                    </span>
                  </span>
                  <span className="w-[406px] h-[30px] text-black font-roboto text-[24px] font-[500] leading-[28.13px] tracking-[0.02em] text-left">
                    {group.groupName || 'Unnamed Group'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="fixed bottom-14 left-2/3 sm:sticky sm:bottom-32 sm:left-[22em] md:left-[25em]"
            onClick={() => setIsModalOpen(true)}
          >
            <img src="./assets/Group 24.png" alt="Group Icon" />
          </button>
        </div>

        {/* Right Column (Chat Area) */}
        <div className="flex-col h-full sm:w-[70%] w-full">
          {selectedGroup ? (
            <Chat group={selectedGroup} onSendMessage={handleSendMessage} />
          ) : (
            <div
              className={`hidden sm:block h-full ${isModalOpen ? 'bg-[#2F2F2FBF]' : 'bg-[#DAE5F5]'}`}
            >
              <div className="h-[313px] absolute top-[15em] left-[70%] transform -translate-x-1/2 w-[36%]">
                <img src="./assets/bgimg.png" alt="Group Icon" />
                <h1 className="font-roboto text-[50px] font-bold text-center">
                  Pocket Notes
                </h1>
                <h2 className="text-[22px] font-medium text-center p-4 w-[31em] mx-auto">
                  Send and receive messages without keeping your phone online. Use
                  Pocket Notes on up to 4 linked devices and 1 mobile phone.
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateGroup}
        ref={modalRef} 
      />
    </>
  );
}
