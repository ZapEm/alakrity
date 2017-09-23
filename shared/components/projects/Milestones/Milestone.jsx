import { LOCALE_STRINGS } from '/utils/constants'
import moment from 'moment'
import PropTypes from 'prop-types'
import * as React from 'react'
import DatePicker from 'react-datepicker'
import ImmutablePropTypes from 'react-immutable-proptypes'
import IconButton from '../../misc/IconButton'

export default class Milestone extends React.Component {

    static propTypes = {
        milestone: ImmutablePropTypes.map,
        managing: PropTypes.bool,
        changeMilestone: PropTypes.func
    }

    static defaultProps = {
        managing: false
    }

    handleDateChange(date) {
        this.props.changeMilestone(this.props.milestone.set('deadline', date))
    }

    onTitleChange(e) {
        e.preventDefault()
        this.props.changeMilestone(this.props.milestone.set('title', e.target.value))
    }

    render() {
        const { milestone, managing } = this.props

        if ( managing ) {

            return <div className="milestone-managing w3-card">
                <div className="milestone-managing-label">Title</div>
                <input
                    className="milestone-managing-input"
                    value={milestone.get('title')}
                    onChange={::this.onTitleChange}
                />
                <IconButton iconName={'delete'}/>
                <div className="milestone-managing-label deadline">Deadline</div>
                <DatePicker
                    selected={milestone.get('deadline')}
                    className="milestone-managing-dateinput"
                    placeholderText="Click to select a date"
                    withPortal
                    onChange={::this.handleDateChange}
                    minDate={moment().add(1, 'day')}
                />
            </div>
        }


        return <div className="milestone">
            <div className="milestone-cell">{milestone.get('title')}</div>
            <div
                className="milestone-cell"
                title={moment(milestone.get('deadline')).fromNow()}
            >
                {moment().format('ddd, ' + LOCALE_STRINGS[moment.locale()].dateFormat + ' LT')/*{milestone.get('deadline')}*/}
            </div>
        </div>
    }
}