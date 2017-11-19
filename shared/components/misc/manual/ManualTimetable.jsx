import * as React from 'react'
import DummyButton from './DummyButton'

export default class ManualTimetable extends React.Component {

    render() {
        return <div id="manual-chapter-timetable" className="manual-chapter">
            <h3 className="w3-text-theme">Timetable</h3>
            <p>The <em> Timetable </em> tab is where you plan when you want to work on your projects and where you
                schedule the tasks that you created before. If you haven&apos;t done it yet, you should create some
                projects and tasks first.</p>
            <p>The timetable has two views: The regular view for planning regular one-time tasks, and the <em> Change
                Weekly Schedule </em> view that lets you set up one or multiple timetables, define work periods and
                schedule repeating tasks.</p>
            <div className="manual-info-block">
                <div><i className="material-icons">info_outline</i></div>
                <div> Use the <DummyButton icon={'public'}/> button in the top left corner of the Timetable to select
                    your preferred date/time format. It will be applied throughout the application.
                </div>
            </div>
        </div>
    }
}