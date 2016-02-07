import React, { Component } from 'react';
import Card from './card';

class List extends Component {
    render() {
        const cards = this.props.cards.map((card) => {
            return <Card key={card.id} {...card} />

        });

        return (
            <div className="list">
                <h1>{this.props.title}</h1>
                {cards}
            </div>
            );
    }
}

export default List;