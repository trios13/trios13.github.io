const CHANNEL_ID = "h2L493GkS9NV4gpX";
const drone= = new ScaleDrone(CHANNEL_ID, {
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
        //updateMembersDom(); uncomment later
    });

    //User Joining the Room
    room.on('member_join', member => {
        members.push(member);
        //updateMembersDom(); uncomment later
    });

    //User leaving room
    room.on('member_leave', ({id}) => {
        const index = members.findIndex(member => member.id === id);
        members.splice(index, 1);
        //updateMembersDOM(); uncomment later
    });

    //Listen for messages sent
    room.on('data', (text, member) => {
        if (member) {
            //addMessageToList(text, member); uncomment later
        } 
        else {
            //Messge is from server
        }
    });
});

//Keeps track of users.
let members = [];
