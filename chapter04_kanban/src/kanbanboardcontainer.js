import React, { Component } from 'react';
import KanbanBoard from './kanbanboard';
import update from 'react-addons-update';
import 'whatwg-fetch';
import 'babel-polyfill'

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type': 'application/json'
    //Authorization: 'RandomBullshit'
};

class KanbanBoardContainer extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            cards: []
        };
    }

    componentDidMount() {
        fetch(API_URL + '/cards', {headers: API_HEADERS})
            .then((response) => response.json())
            .then((data) => {
                this.setState({cards: data});
            })
            .catch((error) => {
                console.log('Error fetching and parsing data', error);
            });
    }

    addTask(cardId, taskName) {
        // Find the index of the card
        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);

        // Create a new task with the given name and a temporary ID
        let newTask = {id:Date.now(), name:taskName, done:false};

        // Create a new object and push the new task to the array of tasks
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$push: [newTask] }
            }
        });

        let prevState = this.state;
        this.setState({cards:nextState});

        // Call the API to add the task on the server
        fetch(`${API_URL}/cards/${cardId}/tasks`, {
           method: 'post',
           headers: API_HEADERS,
           body: JSON.stringify(newTask)
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Server response is not OK');
            }
        })
        .then((data) => {
           // When the server returns the definitive ID
           // used for the new Task on the server, update it on React
           newTask.id = data.id
           this.setState( {cards:nextState} );
        })
        .catch((error) => {
            console.log('fetch error:', error);
            this.setState(prevState);
        });
    }

    deleteTask(cardId, taskId, taskIndex) {
        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {$splice: [[taskIndex, 1]]}
            }
        });

        let prevState = this.state;
        this.setState({cards:nextState});

        //  Call api to remove task from server
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
           method: 'delete',
           headers: API_HEADERS
        })
        .catch((error) => {
            console.log('fetch error:', error);
            this.setState(prevState);
        });
    }

    toggleTask(cardId, taskId, taskIndex) {
        let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
        let newDoneValue;

        let nextState = update(this.state.cards, {
            [cardIndex]: {
                tasks: {
                    [taskIndex]: {
                        done: {$apply: (done) => {
                            newDoneValue = !done;
                            return newDoneValue;
                        }}
                    }
                }
            }
        });

        let prevState = this.state;
        this.setState({cards:nextState});

        //  Call api to toggle the task on the server
        fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
           method: 'put',
           headers: API_HEADERS,
           body: JSON.stringify({done:newDoneValue})
        })
        .then((response) => {
            if (! response.ok) {
                throw new Error('Server response is not OK');
            }
        })
        .catch((error) => {
            console.log('fetch error:', error);
            this.setState(prevState);
        });
    }

    updateCardStatus(cardId, listId){
        // Find the index of the card
        let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        
        // Get the current card
        let card = this.state.cards[cardIndex]

        // Only proceed if hovering over a different list
        if (card.status !== listId) {
            // set the component state to the mutated object
            this.setState(update(this.state, {
                cards: {
                    [cardIndex]: {
                        status: { $set: listId }
                    }
                }
            }));
        }
    }

    updateCardPosition (cardId , afterId) {
        // Only proceed if hovering over a different card
        if (cardId !== afterId) {
            // Find the index of the card
            let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
        
            // Get the current card
            let card = this.state.cards[cardIndex]

            // Find the index of the card the user is hovering over
            let afterIndex = this.state.cards.findIndex((card)=>card.id == afterId);

            // Use splice to remove the card and reinsert it a the new index
            this.setState(update(this.state, {
                cards: {
                    $splice: [
                        [cardIndex, 1],
                        [afterIndex, 0, card]
                    ]
                }
            }));
        }
    }    

    render() {
        return (
            <KanbanBoard cards={this.state.cards}
                         taskCallbacks = {{
                                toggle: this.toggleTask.bind(this),
                                delete: this.deleteTask.bind(this),
                                add: this.addTask.bind(this) }}
                         cardCallbacks={{
                             updateStatus: this.updateCardStatus.bind(this),
                             updatePosition: this.updateCardPosition.bind(this)
                         }} 
                        />
        )
    }
}

export default KanbanBoardContainer;
