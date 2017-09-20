import classNames from 'classnames'
import Immutable from 'immutable'
import * as _ from 'lodash/object'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { LOCALE_STRINGS, TASK_TYPES } from '../../utils/constants'
import { TASK_STATUS } from '../../utils/enums'

export default class TaskItemDragPreview extends React.Component {

    static propTypes = {
        task: PropTypes.object.isRequired,
        projectColorMap: ImmutablePropTypes.map.isRequired,
        locale: PropTypes.string.isRequired,
        notDragging: PropTypes.bool
    }

    static defaultPropTypes = {
        notDragging: false
    }

    constructor(props) {
        super(props)

        const colors = (this.props.projectColorMap.get(this.props.task.projectID) || Immutable.fromJS({
            normal: 'magenta',
            dark: 'darkred',
            light: 'lightred',
            special: {
                normal: 'cyan',
                dark: 'darkblue',
                light: 'lightblue'
            }
        })).toJSON()

        this.state = {
            colors: this.props.task.type !== TASK_TYPES.oneTime ?
                    _.omit(colors, ['special']) :
                    colors.special
        }
    }


    render() {
        const { task, locale, notDragging } = this.props
        const durationCutoff = task.duration >= 90

        return (
            <div
                className="drag-item"
                style={
                    {
                        height: task.duration / 20 + 'rem',
                        width: '112px',
                        padding: '2px',
                        pointerEvents: 'none'
                    }
                }>
                <div
                    className={classNames('task-item', {
                        'w3-card': notDragging,
                        'w3-card-4': !notDragging,
                        'animate-drag-pop': !notDragging,
                        'w3-round-large': !(task.type === TASK_TYPES.repeating),
                        'special': task.type === TASK_TYPES.oneTime
                    })}

                    style={
                        {
                            backgroundColor: this.state.colors.normal,
                            borderColor: this.state.colors.dark
                        }
                    }>
                    <div className="task-item-info">
                        <p className="task-item-info title">{task.title}</p>
                        {durationCutoff &&
                        <p className="task-item-info duration">{(task.duration / 60) + LOCALE_STRINGS[locale].hours}</p>}
                    </div>
                </div>
            </div>)
    }
}