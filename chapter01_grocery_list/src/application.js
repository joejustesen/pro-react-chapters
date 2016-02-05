import React, { Component } from 'react';
import ReactDom from 'react-dom';

class GroceryList extends Component {
    render() {
        return (
            <ul>
                <ListItem quanity="1" name="Bread" />
                <ListItem quanity="6" name="Eggs" />
                <ListItem quanity="2" name="Milk" />
            </ul>
            );
    }
}

class ListItem extends Component {
    render() {
        return (
            <li>{this.props.quanity}x {this.props.name}</li>
            );
    }
}


ReactDom.render(<GroceryList />, document.getElementById('root'));