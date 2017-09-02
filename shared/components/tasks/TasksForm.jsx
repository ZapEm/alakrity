import PropTypes from 'prop-types'
import React from 'react'

export default class TasksForm extends React.Component {
    static propTypes = {
        createTask: PropTypes.func.isRequired
    }

    handleSubmit = () => {
        let textNode = this.textInput
        let durationNode = this.durationInput

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
                <input type="text" placeholder="type task text" ref={ref => this.textInput = ref}/>
                <input type="number" placeholder="0" ref={ref => this.durationInput = ref}/>
                <input label="Duration: " type="submit" value="OK!" onClick={this.handleSubmit}/>
            </div>
        )
    }
}