import React from 'react'

export default class TasksForm extends React.Component {
    static propTypes = {
        createTask: React.PropTypes.func.isRequired
    }

    handleSubmit = () => {
        let textNode = this.refs['text-input']
        let durationNode = this.refs['duration-input']

        this.props.createTask(
            {
                text: textNode.value,
                duration: durationNode.value
            }
        )

        textNode.value = ''
        durationNode.value = ''
    }

    render() {
        return (
            <div id="task-form">
                <input type="text" placeholder="type task text" ref="text-input"/>
                <input type="number" placeholder="0" ref="duration-input"/>
                <input label="Duration: " type="submit" value="OK!" onClick={this.handleSubmit}/>
            </div>
        )
    }
}