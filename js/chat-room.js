const CHANNEL_ID = "h2L493GkS9NV4gpX";
const drone = new ScaleDrone(CHANNEL_ID, {
    data: {
        name: getRandomName(),
        color: getRandomColor(),
    },
});

//Keeps track of users.
let members = [];

//Connect to Scaledrone room
drone.on('open', error => {
    if(error) {
        return console.error(error);
    }
    console.log('Successfully connected to Scaledrone');

    const room = drone.subscribe('observable-chat');
    room.on('open', error => {
        if (error) {
            return console.error(error);
        }
        console.log('Successfully joined room');
    });

    //list of users in the room
    room.on('members', m => {
        members = m;
        updateMembersDOM(); 
    });

    //User Joining the Room
    room.on('member_join', member => {
        members.push(member);
        updateMembersDOM(); 
    });

    //User leaving room
    room.on('member_leave', ({id}) => {
        const index = members.findIndex(member => member.id === id);
        members.splice(index, 1);
        updateMembersDOM();
    });

    //Listen for messages sent
    room.on('data', (text, member) => {
        if (member) {
            addMessageToListDOM(text, member); 
        } 
        else {
            //Messge is from server
        }
    });
});

drone.on('close', event => {
    console.log('Connection was closed', event);
});

drone.on('error', error => {
    console.error(error);
});


function getRandomName() {
    const adjs = ["autumn", "hidden", "bitter", "silent"];
    const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning"]; 
    return (
        adjs[Math.floor(Math.random() * adjs.length)] + "_" +
        nouns[Math.floor(Math.random() * nouns.length)]
    );
};

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

function createName() {
    // create function to allow user to create their own username

};

const DOM = {
    memberCount: document.querySelector('.member-count'),
    memberList: document.querySelector('.member-list'),
    messages: document.querySelector('.messages'),
    input: document.querySelector('.message-form_input'),
    form: document.querySelector('.message-form'),
};

DOM.form.addEventListener('submit', sendMessage);

function sendMessage() {
    const value = DOM.input.value;
    if (value === '') {
        return;
    }
    DOM.input.value = '';
    drone.publish({
        room: 'observable-chat',
        message: value,
    });
}

function createMemberElement(member) {
    const {name, color} = member.clientData;
    const elem = document.createElement('div');
    elem.appendChild(document.createTextNode(name));
    elem.className = 'member';
    elem.style.color = color;
    return elem;
}

function updateMembersDOM() {
    DOM.memberCount.innerText = '${members.length} users in room: ';
    DOM.memberList.innerHTML = '';
    members.forEach(member => 
        DOM.memberList.appendChild(createMemberElement(member))
    );
}

function createMessageElement(text, member) {
    const elem = document.createElement('div');
    elem.appendChild(createMemberElement(member));
    elem.appendChild(document.createTextNode(text));
    elem.className = 'message';
    return elem;
}

function addMessageToListDOM(text, member) {
    const elem = DOM.messages;
    const wasTop = elem.scrollTop === elem.scrollHeight - elem.clientHeight;
    elem.appendChild(createMessageElement(text, memeber));
    if (wasTop) {
        elem.scrollTop = elem.scrollHeight - elem.clientHeight;
    }
}