const CHANNEL_ID = "h2L493GkS9NV4gpX";
const drone = new ScaleDrone(CHANNEL_ID, {
    data: {
        name: getRandomName(),
        color: getRandomColor(),
    },
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

//Keeps track of users.
let members = [];

const DOM = {
    memberCount: document.querySelector('.member-count'),
    memberList: document.querySelector('.member-list'),
    messages: document.querySelector('.messages'),
    input: document.querySelector('.message-form_input'),
    form: document.querySelector('.message-form'),
};

function createMemberElement(member) {
    const {name, color} = member.clientData;
    const element = document.createElement('div');
    element.appendChild(document.createTextNode(name));
    element.className = 'member';
    element.style.color = color;
    return element;
}

function updateMembersDOM() {
    DOM.memberCount.innerText = '${members.length} users in room: ';
    DOM.memberList.innerHTML = '';
    members.forEach(member => 
        DOM.memberList.appendChild(createMemberElement(member))
    );
}

function createMessageElement(text, member) {
    const element = document.createElement('div');
    element.appendChild(createMemberElement(member));
    element.appendChild(document.createTextNode(text));
    element.className = 'message';
    return element;
}

function addMessageToListDOM(text, member) {
    const element = DOM.messages;
    const pastTop = element.scrollTop === element.scrollHeight - element.clientHeight;
    element.appendChild(createMessageElement(text, memeber));
    if (pastTop) {
        element.scrollTop = element.scrollHeight - element.clientHeight;
    }
}

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
 
