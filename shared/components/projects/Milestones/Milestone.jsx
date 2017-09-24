import { DANGER_LEVELS } from '/utils/constants'
import moment from 'moment'
import PropTypes from 'prop-types'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import IconButton from '../../misc/IconButton'


export default class Milestone extends React.Component {

    static propTypes = {
        milestone: ImmutablePropTypes.map,
        managing: PropTypes.bool,
        changeMilestone: PropTypes.func,
        onRemove: PropTypes.func,
        onDateInputClick: PropTypes.func
    }

    static defaultProps = {
        managing: false
    }

    handleRemove(e) {
        e.preventDefault()
        this.props.onRemove()
    }

    onTitleChange(e) {
        e.preventDefault()
        this.props.changeMilestone(this.props.milestone.set('title', e.target.value))
    }

    handleDateInputClick(e) {
        e.preventDefault()
        this.props.onDateInputClick()
    }

    render() {
        const { milestone, managing } = this.props
        const deadlineMoment = moment(milestone.get('deadline'))

        if ( managing ) {

            return <div>
                <div className="milestone-managing w3-card">
                    <div className="milestone-managing-label">Title</div>
                    <input
                        type="text"
                        className="milestone-managing-input"
                        value={milestone.get('title')}
                        onChange={::this.onTitleChange}
                        required
                    />
                    <IconButton
                        iconName={'check_circle'}
                        onClick={::this.handleRemove}
                        dangerLevel={DANGER_LEVELS.DANGER}
                        unarmedDangerLevel={DANGER_LEVELS.WARN.hover}
                        unarmedIconName={'delete_forever'}
                    />
                    <div className="milestone-managing-label deadline">Deadline</div>

                    <input
                        type="text"
                        name="deadline"
                        className="milestone-managing-dateinput"
                        readOnly
                        value={deadlineMoment.format('ddd, ll')}
                        onClick={::this.handleDateInputClick}
                    />
                    {deadlineMoment.isBefore() &&
                    <i title={deadlineMoment.fromNow()} className="material-icons milestone-in-past">alarm_on</i>}
                </div>

            </div>
        }

        return <div className="milestone">
            <div className="milestone-cell"><div className="milestone-cell-title">{milestone.get('title')}</div></div>
            <div
                className="milestone-cell"
                title={deadlineMoment.fromNow()}
            >
                {deadlineMoment.format('L')}
            </div>
        </div>
    }
}