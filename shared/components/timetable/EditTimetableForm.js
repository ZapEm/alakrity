import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import IconButton from '../misc/IconButton'


export default class EditTimetableForm extends React.Component {
    static propTypes = {
        onSave: React.PropTypes.func.isRequired,
        onRemove: React.PropTypes.func.isRequired,
        timetableChange: React.PropTypes.func.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        textLabel: React.PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = props.timetables.get('timetable').toJSON()
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.onSave(this.state)
    }

    handleTitleChange(e) {
        this.setState({ title: e.target.value })
    }

    handleStartChange(e) {
        this.setState({ start: +e.target.value })
        this.props.timetableChange(this.props.timetables.get('timetable').merge({ start: +e.target.value }))
    }

    handleEndChange(e) {
        this.setState({ end: +e.target.value })
        this.props.timetableChange(this.props.timetables.get('timetable').merge({ end: +e.target.value }))
    }


    render() {
        const { textLabel, timetables } = this.props
        const timetable = timetables.get('timetable')
        let saveText = 'done'

        return (
            <form
                className="task-form w3-padding w3-card-2 w3-round-large w3-leftbar w3-rightbar w3-border-theme"
                onSubmit={::this.handleSubmit}
            >
                <input
                    className="tt-title-field w3-input"
                    type="text"
                    placeholder={textLabel}
                    value={this.state.title}
                    onChange={::this.handleTitleChange}/>
                <div className="w3-section">
                    <div className="w3-row">
                        <div className="w3-col" style={{ width: '48px', padding: '4px 0' }}>
                            {'Start: '}
                        </div>
                        <div className="w3-rest" style={{ width: '64px' }}>
                            <input
                                className="tt-input-number w3-input w3-border w3-padding-4"
                                type="number"
                                step={1}
                                min={0}
                                max={timetable.get('end')}
                                value={timetable.get('start')}
                                onChange={::this.handleStartChange}
                            />
                        </div>
                    </div>
                    <div className="w3-row">
                        <div className="w3-col" style={{ width: '48px', padding: '4px 0' }}>
                            {'End: '}
                        </div>
                        <div className="w3-rest" style={{ width: '64px' }}>
                            <input
                                className="tt-input-number w3-input w3-border w3-padding-4"
                                type="number"
                                step={1}
                                min={timetable.get('start')}
                                max={24}
                                value={timetable.get('end')}
                                onChange={::this.handleEndChange}
                            />
                        </div>
                    </div>
                </div>
                <IconButton
                    iconName={saveText}
                />
            </form>
        )
    }

}