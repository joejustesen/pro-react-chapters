import React, { Component } from 'react';
import CheckList from './checklist';
import marked from 'marked';


class Card extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            showDetails: false
        };
    }

    toggleDetails() {
        this.setState({showDetails: !this.state.showDetails});
    }

    render() {
        let isOpen = "";
        let cardDetails;

        if (this.state.showDetails) {
            cardDetails = (
                <div className="card__details">
                    <span dangerouslySetInnerHTML={{__html:marked(this.props.description)}} />
                    <CheckList cardId={this.props.id} tasks={this.props.tasks} />
                </div>
            );

            isOpen = " card__title--is-open";
        }

        const sideColor = {
            position: 'absolute',
            zIndex: -1,
            top: 0,
            bottom: 0,
            left: 0,
            width: 7,
            backgroundColor: this.props.color
        };

        return (
            <div className="card">
                <div style={sideColor} />
                <div className={"card__title" + isOpen}
                     onClick={this.toggleDetails.bind(this)}>
                    {this.props.title}
                </div>
                {cardDetails}
            </div>
            );
    }
}

export default Card;