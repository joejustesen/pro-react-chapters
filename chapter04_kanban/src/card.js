import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import CheckList from './checklist';
import marked from 'marked';
import {DragSource} from 'react-dnd';
import constants from './constants';



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
        const { connectDragSource } = this.props;

        let isOpen = "";
        let cardDetails;

        if (this.state.showDetails) {
            cardDetails = (
                <div className="card__details">
                    <span dangerouslySetInnerHTML={{__html:marked(this.props.description)}} />
                    <CheckList cardId={this.props.id}
                               tasks={this.props.tasks}
                               taskCallbacks={this.props.taskCallbacks} />
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

        return connectDragSource(
            <div className="card">
                <div style={sideColor} />
                <div className={"card__title" + isOpen}
                     onClick={this.toggleDetails.bind(this)}>
                    {this.props.title}
                </div>
                <ReactCSSTransitionGroup transitionName="toggle"
                                         transitionEnterTimeout={250}
                                         transitionLeaveTimeout={250}>
                    {cardDetails}
                </ReactCSSTransitionGroup>
            </div>
            );
    }
};

const CardDragSpec = {
    beginDrag(props) {
        return {id: props.id};
    }
}

function collectDrag(connect, monitor) {
    return { connectDragSource: connect.dragSource() };
}

const TitlePropType = (props, propName, componentName) => {
    const value = props[propName]

    if (value) {
        if (typeof value !== 'string' || value.length > 80) {
            return new Error(
                `${propName} in ${componentName} is longer than 80 characters`
            );
        }
    }
}

Card.propTypes = {
    id: PropTypes.number,
    title: TitlePropType,
    description: PropTypes.string,
    color: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object,
    cardCallbacks: PropTypes.object,
    connectDragSource: PropTypes.func.isRequired
};

export default DragSource(constants.CARD, CardDragSpec, collectDrag)(Card);