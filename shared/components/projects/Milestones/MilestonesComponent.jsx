import Immutable from 'immutable'
import moment from 'moment'
import PropTypes from 'prop-types'
import * as React from 'react'
import CustomScroll from 'react-custom-scroll'
import DayPicker from 'react-day-picker'
import LocaleUtils from 'react-day-picker/moment'
import ImmutablePropTypes from 'react-immutable-proptypes'
import * as shortid from 'shortid'
import LabeledIconButton from '../../misc/LabeledIconButton'
import Milestone from './Milestone'

export default class MilestonesComponent extends React.Component {

    static propTypes = {
        project: ImmutablePropTypes.map.isRequired,
        managing: PropTypes.bool,
        onSave: PropTypes.func.isRequired,
        onEnterManage: PropTypes.func.isRequired
    }

    static defaultProps = {
        managing: false
    }

    constructor(props) {
        super(props)
        this.state = {
            milestones: this.props.project.has('milestones') ?
                        this.props.project.get('milestones').sortBy(milestone => milestone.get('deadline')) :
                        Immutable.List(),
            pickingDayFor: false
        }
    }

    handleAddMilestone() {
        this.setState(({ milestones }) => (
            {
                milestones: milestones.insert(0, Immutable.Map(
                    {
                        id: shortid.generate(),
                        title: '',
                        deadline: moment().add(1, 'week')
                    })
                )
            }
        ))
    }

    handleRemoveMilestone(index) {
        this.setState(({ milestones }) => (
            {
                milestones: milestones.delete(index)
            }
        ))

    }

    handleMilestoneDateChange(date) {
        if ( moment(date).isBefore(moment().add(1, 'day').startOf('day')) ) {
            return
        }
        this.setState(({ milestones }) => (
            {
                milestones: milestones.setIn([this.state.pickingDayFor, 'deadline'], date),
                pickingDayFor: false
            }
        ))
    }

    handleEnterManage(e) {
        e.preventDefault()
        this.props.onEnterManage()
    }

    handleSaveMilestones(e) {
        e.preventDefault()
        this.props.onSave(this.state.milestones)

    }

    changeMilestone(index, milestone) {
        this.setState({
            milestones: this.state.milestones.set(index, milestone)
        })
    }

    render() {
        const { managing } = this.props

        const totalMilestones = this.state.milestones.size
        const milestonesElements = (managing)
            ? this.state.milestones
                  .map((milestone, index) =>
                      <Milestone
                          key={index}
                          managing={true}
                          milestone={milestone}
                          changeMilestone={(milestone) => this.changeMilestone(index, milestone)}
                          onRemove={() => this.handleRemoveMilestone(index)}
                          onDateInputClick={() => this.setState({ pickingDayFor: index })}
                      />
                  )
            : this.state.milestones
                  .filter(milestone => moment(milestone.get('deadline')).isAfter())
                  .take(5)
                  .map((milestone, index) =>
                      <Milestone
                          key={index}
                          milestone={milestone}
                      />
                  )


        const element = (managing) ?
                        <div className="milestones-wrap">
                            <CustomScroll
                                heightRelativeToParent={'184px'}
                            >
                                <div className="milestones-table">
                                    {milestonesElements}
                                </div>
                            </CustomScroll>
                        </div>
            :
                        <div className="milestones-wrap">
                            <div className="milestones-table">
                                {milestonesElements}
                            </div>
                        </div>

        return <div>
            <div className={'milestones-component' + (managing ? ' managing' : '')}>
                <label>
                    {(managing) ? '.' : (totalMilestones > 0) ? 'Next Milestones:' : '(No Milestones)'}
                </label>
                {!managing && (totalMilestones > 5) &&
                <span className="w3-right">{'(' + (totalMilestones - milestonesElements.size) + ' more)'}</span>}
                {managing && <div className="milestone-manage-add">
                    <LabeledIconButton
                        iconName={'alarm_add'}
                        label={'Add'}
                        onClick={::this.handleAddMilestone}
                    />
                </div>}
                <div className="milestone-manage-save">
                    {!managing ?
                     <div className="w3-display-hover">
                         <LabeledIconButton
                             iconName={'alarm'}
                             label={'Manage'}
                             onClick={::this.handleEnterManage}
                         />
                     </div>
                        :
                     <LabeledIconButton
                         iconName={'save'}
                         label={'Save'}
                         onClick={::this.handleSaveMilestones}
                     />}
                </div>
                {element}

            </div>
            {(this.state.pickingDayFor !== false) &&
            <div className="milestone-day-picker-wrapper">
                <DayPicker
                    className="milestone-day-picker"
                    localeUtils={LocaleUtils}
                    locale={moment().locale()}
                    onDayClick={::this.handleMilestoneDateChange}
                    enableOutsideDays
                    disabledDays={{ before: moment().startOf('day').toDate() }}
                />
            </div>}
        </div>

    }
}