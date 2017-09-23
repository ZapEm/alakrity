import Immutable from 'immutable'
import PropTypes from 'prop-types'
import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import LabeledIconButton from '../../misc/LabeledIconButton'
import Milestone from './Milestone'

export default class MilestonesComponent extends React.Component {

    static propTypes = {
        project: ImmutablePropTypes.map.isRequired,
        editing: PropTypes.bool
    }

    static defaultProps = {
        editing: false
    }

    render() {
        const { project: debug, editing } = this.props

        // debug
        const project = debug.set('milestones', Immutable.fromJS(
            [
                Immutable.fromJS({ title: 'asd1', deadline: '12as3' }),
                Immutable.fromJS({ title: '2', deadline: '2323' }),
                Immutable.fromJS({ title: '3wweww', deadline: '11233' }),
                Immutable.fromJS({ title: 'asd1', deadline: '12as3' }),
                Immutable.fromJS({ title: '2', deadline: '2323' }),
                Immutable.fromJS({ title: '3wweww', deadline: '11233' }),
                Immutable.fromJS({ title: 'asd1', deadline: '12as3' }),
                Immutable.fromJS({ title: '2', deadline: '2323' }),
                Immutable.fromJS({ title: '3wweww', deadline: '11233' }),
                Immutable.fromJS({ title: 'asd1', deadline: '12as3' }),
                Immutable.fromJS({ title: '2', deadline: '2323' }),
                Immutable.fromJS({ title: '3wweww', deadline: '11233' })
            ]))


        if ( !project.has('milestones') ) {
            return null
        }

        const milestones = project.get('milestones')
                                  .take(5)
                                  .map((milestone, index) =>
                                      <Milestone key={index} milestone={milestone}/>)


        return <div className="milestones-component">
            <label>
                {(editing) ? 'Milestones:' : 'Next Milestones:'}
            </label>
            <div className="milestone-manage">
                <div className="w3-display-hover">
                    <LabeledIconButton iconName={'alarm'} label={'Manage'}/>
                </div>
            </div>
            <div className="milestones-wrap">
                <div className="milestones-table">
                    {milestones}
                </div>
            </div>

        </div>
    }
}