import React, { Component } from 'react';
import ReactDom from 'react-dom';

class Hello extends Component {
    render() {
        const name = 'friend'
        return (
            <h1>Hello, {name}.</h1>
            );
    }
}

ReactDom.render(<Hello />, document.getElementById('root'));