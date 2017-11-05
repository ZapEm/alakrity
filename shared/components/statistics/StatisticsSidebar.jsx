import * as React from 'react'
import { MASCOT_STATUS } from '../../utils/enums'
import MascotContainer from '../misc/mascot/MascotContainer'

export default class StatisticsSidebar extends React.Component {

    static propTypes = {}


    render() {
        return <div
            className={'layout-sidebar w3-card-4 w3-padding w3-border w3-border-theme w3-round-large'}
        >
            <MascotContainer
                replaceStatus={MASCOT_STATUS.STATISTICS}
            />
        </div>
    }
}