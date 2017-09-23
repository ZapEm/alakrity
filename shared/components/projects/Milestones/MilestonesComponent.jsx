import Immutable from 'immutable'
import moment from 'moment'
import PropTypes from 'prop-types'
import * as React from 'react'
import CustomScroll from 'react-custom-scroll'
import ImmutablePropTypes from 'react-immutable-proptypes'
import LabeledIconButton from '../../misc/LabeledIconButton'
import Milestone from './Milestone'

export default class MilestonesComponent extends React.Component {

    static propTypes = {
        project: ImmutablePropTypes.map.isRequired,
        managing: PropTypes.bool,
        onSave: PropTypes.func.isRequired,
        onManageToggle: PropTypes.func.isRequired
    }

    static defaultProps = {
        managing: false
    }

    constructor(props) {
        super(props)
        this.state = {
            milestones: this.props.project.has('milestones') ?
                        this.props.project.get('milestones') :
                        Immutable.fromJS([{ title: '', deadline: moment().add(1, 'week') }])
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(
            {
                milestones: nextProps.project.has('milestones') ?
                            nextProps.project.get('milestones') :
                            Immutable.fromJS([{ title: '', deadline: moment().add(1, 'week') }])
            }
        )
    }


    handleAddMilestone() {
        this.setState(({ milestones }) => (
            {
                milestones: milestones.insert(0, Immutable.Map({ title: '', deadline: moment().add(1, 'week') }))
            }
        ))
    }


    handleManageToggle(e) {
        e.preventDefault()
        if ( this.props.managing ) {
            this.props.onSave(this.state.milestones)
        } else {
            this.props.onManageToggle()
        }
    }

    // handleMilestonesSave(e) {
    //     e.preventDefault()
    //     this.props.onSave(this.state.milestones)
    // }

    changeMilestone(index, milestone) {
        this.setState({
            milestones: this.state.milestones.set(index, milestone)
        })
    }

    render() {
        const { managing } = this.props

        // if ( !this.props.project.get('milestones') ) {
        //    return null
        // }

        const milestonesElements = (managing)
            ? this.state.milestones
                  .map((milestone, index) =>
                      <Milestone
                          key={index}
                          managing={true}
                          milestone={milestone}
                          changeMilestone={(milestone) => this.changeMilestone(index, milestone)}
                      />
                  )
            : this.state.milestones
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

        return <div className={'milestones-component' + (managing ? ' managing' : '')}>
            <label>
                {(managing) ? '.' : 'Next Milestones:'}
            </label>
            {managing && <div className="milestone-manage-add"><LabeledIconButton
                iconName={'alarm_add'}
                label={'Add'}
                onClick={::this.handleAddMilestone}
            /></div>}
            <div className="milestone-manage-save">
                <div className={!managing ? 'w3-display-hover' : ''}>
                    <LabeledIconButton
                        iconName={managing ? 'save' : 'alarm'}
                        label={managing ? 'Save' : 'Manage'}
                        onClick={::this.handleManageToggle}
                    />
                </div>
            </div>
            {element}
        </div>
    }
}