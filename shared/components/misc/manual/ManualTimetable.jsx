import * as React from 'react'
import DummyButton from './DummyButton'

export default class ManualTimetable extends React.Component {

    render() {
        return <div id="manual-chapter-timetable" className="manual-chapter">
            <h2 className="w3-text-theme">Timetable</h2>
            <p>The <em> Timetable </em> tab is where you plan when you want to work on your projects and where you
                schedule the tasks that you created before. If you haven&apos;t done it yet, you should create some
                projects and tasks first.</p>
            <p>The timetable has two views: The regular view for planning regular one-time tasks, and the <em> Change
                Weekly Schedule </em> view that lets you set up one or multiple timetables, define work periods and
                schedule repeating tasks.</p>
            <div className="manual-info-block">
                <div><i className="material-icons">info_outline</i></div>
                <p> Use the <DummyButton icon={'public'}/> button in the top left corner of the Timetable to select
                    your preferred date/time format. It will be applied throughout the application.
                </p>
            </div>

            <h5 className="w3-text-theme">Regular View</h5>

            The main area shows a the timetable with work periods and scheduled tasks. Drag and drop one-time tasks from
            the
            sidebar to the appropriate slot to schedule them. Select the project from the dropdown and use the filters
            to narrow down the unscheduled tasks. Tasks are ordered by their milestones deadline (closest first), with
            immediate deadlines (in the next 3 days) being marked with an alarm <i
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
                <li>Task Symbols:</li>
                <ul className="manual-list">
                    <li><i className="material-icons manual-icon">notifications_active</i>: Immediate deadline. Task is
                        due to be done in 3 days or less and not scheduled yet.
                    </li>
                    <li><i className="material-icons manual-icon">alarm</i>: Scheduled. Will show a reminder at the
                        scheduled time.
                    </li>
                    <li><i className="material-icons manual-icon">alarm_off</i>: Ignored this week. Repeating tasks
                        only.
                    </li>
                    <li><i className="material-icons manual-icon">snooze</i>: Snoozed. Will soon remind you again to
                        start this task.
                    </li>
                    <li><i className="material-icons manual-icon">pets</i>: In progress. You should be working in this
                        right now.
                    </li>
                    <li>Tasks in the timetable that don&apos;t have a symbol are from not-tracked projects.</li>
                </ul>
            </ul>

            <h5 className="w3-text-theme">Change Weekly Schedule</h5>
            <p>In this view you can change the settings of your timetable, or even add a new one (this might mess with
                your coverage stats, so it is probably best to just use one timetable for now).</p>

            <p>Choose the <em> Title </em>, <em> Start </em> and <em> End </em> of the timetable to your liking. Select
                a project or special period from the scrollable <em> Work periods </em> list and click on the timetable
                to paint in the work periods. Don&apos;t forget to add some <em> Buffer </em> periods, so you can move
                tasks there later if something comes up during the projects regular times, or if you just need some
                extra time for one of your tasks. Select <em> Clear </em> to remove time periods, or just paint over
                existing ones if you want to change them. The <em> Break </em> period is currently only cosmetic, but
                might be useful to make time for regular lunch breaks.
            </p>
            <p>Drag a repeating task to the timetable to schedule it. If it comes from a tracked project, you will be
                reminded of it every week - but you can mute the reminder if the time comes.
            </p>
        </div>
    }
}