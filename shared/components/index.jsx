import React from 'react'

export default class App extends React.Component {
    static propTypes = {
        children: React.PropTypes.node.isRequired
    }

    render() {
        return (
            <div id="app-view">
                <h1> Todos</h1>

                <hr />

                {this.props.children}
            </div>
        )
    }
}

