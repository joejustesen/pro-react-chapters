import React, { Component, PropTypes } from 'react';
import List from './list';

class KanbanBoard extends Component {
    render() {
        return (
            <div>
                <List id="todo" title="To Do" taskCallbacks={this.props.taskCallbacks} cards={
                    this.props.cards.filter((card) => card.status === "todo")
                } />
                <List id="in-progress" title="In Progress" taskCallbacks={this.props.taskCallbacks} cards={
                    this.props.cards.filter((card) => card.status === "in-progress")
                } />
                <List id="done" title="Done" cards={
                    this.props.cards.filter((card) => card.status === "done")
                } />
            </div>
            );
    }
};

KanbanBoard.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object
};

export default KanbanBoard;