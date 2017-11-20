import React from 'react'
import ManualProjects from '../components/misc/manual/ManualProjects'
import ManualStatistics from '../components/misc/manual/ManualStatistics'
import ManualTasks from '../components/misc/manual/ManualTasks'
import ManualTimetable from '../components/misc/manual/ManualTimetable'
import Mascot from '../components/misc/mascot/StaticMascot'
import ManualBasics from '../components/misc/manual/ManualBasics'
import ManualExample from '../components/misc/manual/ManualExample'
import ManualReminders from '../components/misc/manual/ManualReminders'

export default class Login extends React.Component {

    render() {
        const imgUrl = (typeof window !== 'undefined') ? require('../static/img/question.png') : false

        return (
            <div className="manual">
                <div className="row manual-row">
                    <div className="col px900">
                        <div className="welcome w3-card-4 w3-padding w3-border w3-border-theme w3-round-large"
                             style={{ minHeight: '600px' }}
                        >
                            <h1 className="w3-text-theme w3-center">Alakrity Manual</h1>
                            <ManualBasics/>
                            <ManualExample/>
                            <ManualProjects/>
                            <ManualTasks/>
                            <ManualTimetable/>
                            <ManualReminders/>
                            <ManualStatistics/>
                        </div>
                    </div>
                    <div id="sidebar" className="col sidebar manual-row">
                        <div className="login-sidebar w3-card-4 w3-padding w3-border w3-border-theme w3-round-large">
                            {imgUrl && <Mascot imgUrl={imgUrl}/>}
                            <h3 className="w3-text-theme w3-center">Topics</h3>
                            <ul className="w3-ul">
                                <li className="w3-hover-theme w3-round link-list-item">
                                    <a href="#manual-chapter-basics" className="link-div no-underline">Basics</a>
                                </li>
                                <li className="w3-hover-theme w3-round link-list-item">
                                    <a href="#manual-chapter-example" className="link-div no-underline">Example</a>
                                </li>
                                <li className="w3-hover-theme w3-round link-list-item">
                                    <a href="#manual-chapter-projects" className="link-div no-underline">Projects</a>
                                </li>
                                <li className="w3-hover-theme w3-round link-list-item">
                                    <a href="#manual-chapter-tasks" className="link-div no-underline">Tasks</a>
                                </li>
                                <li className="w3-hover-theme w3-round link-list-item">
                                    <a href="#manual-chapter-timetable" className="link-div no-underline">Timetable</a>
                                </li>
                                <li className="w3-hover-theme w3-round link-list-item">
                                    <a href="#manual-chapter-reminders" className="link-div no-underline">Reminders</a>
                                </li>
                                <li className="w3-hover-theme w3-round link-list-item">
                                    <a href="#manual-chapter-statistics" className="link-div no-underline">Statistics</a>
                                </li>


                            </ul>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
