import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import moment from 'moment'
import { LOCALE_STRINGS } from '/utils/constants'

export default class Milestone extends React.Component {

    static propTypes = {
        milestone: ImmutablePropTypes.map
    }

    render() {
        const { milestone } = this.props
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