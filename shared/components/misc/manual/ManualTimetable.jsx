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

            <h5 className="w3-text-theme">Regular View</h5>

            The main area shows a the timetable with work periods and scheduled tasks. Drag and drop one-time tasks from
            the
            sidebar to the appropriate slot to schedule them. Select the project from the dropdown and use the filters
            to narrow down the unscheduled tasks. Tasks are ordered by their milestones deadline (closest first), with
            urgent deadlines (in the next 3 days) being marked with an alarm <i
            className="material-icons manual-icon">notifications_active</i> symbol.

            <ul className="manual-list">
                <li><DummyButton icon={'first_page'}/><DummyButton icon={'keyboard_arrow_left'}/><DummyButton
                    icon={'keyboard_arrow_right'}/><DummyButton icon={'last_page'}/>: Select the desired week to
                    display and schedule tasks in.
                </li>
                <li><DummyButton icon={'edit'} label={'Change Weekly Schedule'}/>: Change View to <em> Change Weekly
                    Schedule </em> mode (see below).
                </li>
                <li><DummyButton icon={'public'}/>: Change locale (time format).
                </li>
                <li>Other task Symbols:</li>
                <ul className="manual-list">
                    <li><i className="material-icons manual-icon">alarm</i>: Scheduled. Will show a reminder at the scheduled time.</li>
                    <li><i className="material-icons manual-icon">alarm_off</i>: Ignored this week. Repeating tasks only.</li>
                    <li><i className="material-icons manual-icon">snooze</i>: Snoozed. Will remind you again soon.</li>
                    <li><i className="material-icons manual-icon">pets</i>: In progress. You should be working in this right now.</li>
                    <li><i className="material-icons manual-icon">done</i>: Completed. You have completed the task and recorded your performance.</li>
                    <li>Tasks in the timetable that don&apos;t have a symbol are from un-tracked projects.</li>
                </ul>
            </ul>

            <h5 className="w3-text-theme">Change Weekly Schedule</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet corporis, et molestias nihil quas sint
                suscipit! Aliquid, aperiam asperiores consequatur, dicta eligendi error id minima, nam nostrum
                perferendis quam rem.</p>
        </div>
    }
}