import React, { Component } from 'react';
import ReactDom from 'react-dom';

class Search extends Component {
    constructor() {
        super();

        this.state = {
            searchTerm: "React"
        };
    }

    handleChange(event) {
        this.setState({searchTerm: event.target.value});
    }

    render() {
        const name = 'friend'
        return (
            <div>
                <form>
                    Search Term: <input type="search"
                                        onChange={this.handleChange.bind(this)}
                                        value={this.state.searchTerm}/>

                    <div className="formGroup">
                        Name: <input name="name" type="text" />
                    </div>
                    <div className="formGroup">
                        E-mail: <input name="email" type="mail" />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

ReactDom.render(<Search />, document.getElementById('root'));