class Users {

    constructor() {
        this.persons = [];
    }

    //the "id" is the socket id
    addPerson(id, name, chatroom) {
        let person = { id, name, chatroom };
        this.persons.push(person);
        return this.persons;
    }

    getPerson(id) {
        let person = this.persons.filter(person => person.id === id)[0];

        return person;
    }

    getPersons() {
        return this.persons;
    }

    getPersonsInChatroom(chatroom) {
        let personsInChatroom = this.persons.filter(person => person.chatroom === chatroom);
        return personsInChatroom;
    }

    removePerson(id) {
        let personRem = this.getPerson(id);
        this.persons = this.persons.filter(person => person.id != id);
        return personRem;
    }



}


module.exports = {
    Users
}