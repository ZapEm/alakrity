import * as React from 'react'
import CustomScroll from 'react-custom-scroll'
import tinycolor from 'tinycolor2'
import { PROJECT_COLORS } from '../../utils/constants'
import { MASCOT_STATUS } from '../../utils/enums'
import MascotContainer from '../misc/mascot/MascotContainer'

export default class StatisticsSidebar extends React.Component {

    static propTypes = {}


    render() {

        function getColorStyle(colorNr) {
            return {
                backgroundColor: tinycolor(PROJECT_COLORS[colorNr]).setAlpha(0.6).toRgbString(),
                borderColor: tinycolor(PROJECT_COLORS[colorNr]).darken(20).toRgbString()
            }
        }

        return <div
            className="layout-sidebar full-height w3-card-4 w3-padding w3-border w3-border-theme w3-round-large"
        >
            <MascotContainer
                replaceStatus={MASCOT_STATUS.STATISTICS}
            />
            <div className="scroll-container"><div className="scroll-container-abs">
            <CustomScroll
                heightRelativeToParent={'100%'}
            >
                <h5 className="w3-text-theme w3-center">Overview and Time Line</h5>
                <ul className="w3-ul legend-list w3-small">
                    <li>
                        <div className="legend-rect" style={getColorStyle(0)}/>
                        <div className="legend-title">Completed</div>
                        <div>The total number of completed tasks over all tracked projects in a week.</div>
                    </li>
                    <li>
                        <div className="legend-rect" style={getColorStyle(2)}/>
                        <div className="legend-title">Average Rating</div>
                        <div>The average rating of all the tasks you gave a star rating.</div>
                    </li>
                    <li>
                        <div className="legend-rect" style={getColorStyle(3)}/>
                        <div className="legend-title">Punctuality</div>
                        <div>Starting or ending a task after the scheduled times will lower your punctuality score.
                            Ending
                            late has a reduced impact.
                        </div>
                    </li>
                    <li>
                        <div className="legend-rect" style={getColorStyle(1)}/>
                        <div className="legend-title">Project Coverage</div>
                        <div>The percentage of the total planned project period time that you where actually working
                            relevant tasks on.
                        </div>
                    </li>
                </ul>

                <h5 className="w3-text-theme w3-center">Project Time Coverage</h5>
                <ul className="w3-ul legend-list w3-small">
                    <li>
                        <div className="legend-rect"/>
                        <div className="legend-title">Actual Project Coverage</div>
                        <div>Project coverage broken down into each projects percentage.</div>
                    </li>
                    <li>
                        <div className="legend-rect" style={{ borderColor: 'transparent' }}/>
                        <div className="legend-title">Targeted Project Coverage</div>
                        <div>Combined planned task durations for each project. The coverage you where trying to reach.
                        </div>
                    </li>
                    <li>
                        <div className="legend-rect" style={
                            {
                                borderStyle: 'dashed',
                                backgroundColor: tinycolor(PROJECT_COLORS[0]).setAlpha(0.6).toRgbString(),
                                borderColor: tinycolor(PROJECT_COLORS[0]).darken(20).setAlpha(0.6).toRgbString()
                            }
                        }/>
                        <div className="legend-title">Buffer Use</div>
                        <div>The percentage of buffer time you used (hidden by default; click on the label above the graph to show).
                        </div>
                    </li>
                </ul>
            </CustomScroll>
            </div></div>
        </div>
    }
}