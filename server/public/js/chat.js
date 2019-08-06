const $chatroomList = $(document.getElementsByClassName('chatroom-list')[0]);
const $chatroomMessages = $('.chatroom-messages');
const $chatroomMsgButton = $('#chatroom-msg-button');
const $chatroomMsgInput = $('#chatroom-msg-input');
const $createChatBtn = $('#create-chat-btn');
let currentRoom;

const authData = JSON.parse(window.localStorage.getItem("authData"));
const chatRoomsSocket = io.connect('/chat', {
    'query': 'token=' + authData.token
});

chatRoomsSocket.on('connectedToChatRoom', (room) => {
    chatRoomsSocket.emit('leaveChatRoom', currentRoom);
    currentRoom = room;
});

chatRoomsSocket.on('newMessage', message => insertMessageToList(message, { atEnd: true }));

const createRoom = (name) => {
    if(!name) {
        return Swal.showValidationMessage("Fill the input")
    }
    toggleLoader();
    return axios.post('/api/v1/chatroom', {name}, {headers: {'Authorization': "Bearer " + authData.token}})
        .then(({ data }) => {
            insertChatRoomToList(data.chatRoom);
            setTimeout(addClickListenersToChatRoomList);
            chatRoomsSocket.emit('joinChatRoom', data.chatRoom._id);
            if (!data.chatRoom.messages) data.chatRoom.messages = [];
            buildChatRoomMessages(data.chatRoom);

        })
        .catch((err) => {
            showError(err.message)
        })
        .finally(function () {
            toggleLoader();
        });
};


const fetchChatRooms = () => {
    return axios.get('/api/v1/chatroom', {headers: {'Authorization': "Bearer " + authData.token}})
        .then(({data}) => {
            $chatroomList.empty();
            $chatroomList.append(buildChatRoomsList(data.chatRooms));
            addClickListenersToChatRoomList();
            return data.chatRooms;
        })
};


const buildChatRoomsItem = (room) => `<li id='${room._id}' class='chatroom-list-item'>${room.name} </li>`;

const insertChatRoomToList = (room) => {
    $chatroomList.append(buildChatRoomsItem(room));
};
const buildChatRoomsList = (rooms) => {
    return rooms.forEach(insertChatRoomToList)
};


const addClickListenersToChatRoomList = () => {
    $('.chatroom-list-item').off('click');
    $('.chatroom-list-item').click(fetchChatRoomMessages)
};

fetchChatRooms()
    .then((chatRooms) => {
        if (!chatRooms.length) {
            addNewRoom()
        } else {
            fetchChatRoomMessages({ id: chatRooms[0]._id})
        }
    });

const addNewRoom = (e) => {
    Swal.fire({
        title: 'Enter chat room name',
        input: 'text',
        confirmButtonText: "Create Room",
        customClass: {
            input: 'center-align',
            confirmButton: 'waves-effect waves-light btn-large',
        },
        preConfirm: createRoom
    });
};

const sendMessage = (e) => {
    chatRoomsSocket.emit("emitToChatRoom", {room: currentRoom, msg: $chatroomMsgInput.val(), sender: authData.username})
    $chatroomMsgInput.val("");

};

$createChatBtn.click(addNewRoom);
$chatroomMsgButton.click(sendMessage);

fetchChatRoomMessages = (e) => {

    const id = e.currentTarget && e.currentTarget.id || e.id;
    if(currentRoom === id) return false;
    return axios.get(`/api/v1/chatroom/${id}`, {headers: {'Authorization': "Bearer " + authData.token}})
        .then(({data}) => {
            chatRoomsSocket.emit('joinChatRoom', id);
            buildChatRoomMessages(data.chatRoom);
            return data.chatRooms;
        })
};

const buildChatRoomMessages = (chatRoom) => {
    $chatroomMessages.empty();
    return chatRoom.messages.forEach(insertMessageToList);
};

const insertMessageToList = (message, { atEnd }) => {
    const cmd = atEnd ? "append" : "prepend";
    $chatroomMessages[cmd](buildChatRoomMessage(message));
};

const buildChatRoomMessage = (message ) => {
    const positionClass =  message.sender !== authData.username ? 'right' : 'left';
    const createdAt = message.createdAt ? new Date(message.createdAt) : new Date();
    const timeStamp = createdAt.toLocaleString().split(":").slice(0, -1).join(":") ;

    return `<li class='chatroom-messages-item ${positionClass}'>
                    <div class="metadata">
                        <p class="sender">${message.sender}</p>
                        <p> ${timeStamp}</p>
                    </div>
                    <p class="content"> ${message.content} </p> 
                </li>`
};








