import * as React from 'react'
import DummyButton from './DummyButton'

export default class ManualReminders extends React.Component {

    render() {
        return <div id="manual-chapter-reminders" className="manual-chapter">
            <h2 className="w3-text-theme">Reminders</h2>
            <p>Reminders will pop up when ever a task from a tracked project needs your attention. The task might be
                beginning, ending, or it was in the past and you have not confirmed its completion yet. </p>

            <p>If there are multiple reminders, you can use the arrows at the top to navigate between them.</p>

            <div className="manual-info-block">
                <div><i className="material-icons">info_outline</i></div>
                <p>
                    If <em> Alakrity </em> is open in a tab in the background, you will be alerted of reminders via
                    browser notification. Click on the notification to bring the <em> Alakrity </em> tab into view.
                </p>
            </div>

            <h5 className="w3-text-theme">Beginning tasks</h5>
            <ul className="manual-list">
                <li>If a task is beginning, you will be asked to choose the time you started working on it. The current
                    time will be preselected, so you can usually just click
                    <DummyButton icon={'play_circle_outline'} label={'Begin'}/> and start working.
                </li>
                <li>If you want to reminded again in 15 minutes, click <DummyButton icon={'snooze'} label={'Snooze'}/>.
                    This will still count as starting the task late.
                </li>
                <li>To move the task back to the sidebar, click <DummyButton icon={'alarm_off'} label={'Reschedule'}/>.
                    You can then schedule it again for a different time. Repeating tasks will let you choose
                    <DummyButton icon={'alarm_off'} label={'Ignore'}/> here instead. This mutes the task for the current
                    week.
                </li>
            </ul>

            <h5 className="w3-text-theme">Ending tasks</h5>
            <ul className="manual-list">
                <li>At the estimated end of a task, you will be prompted to select the time you finished it. You can
                    again just wait until you are done with your work and then click
                    <DummyButton icon={'assignment_turned_in'} label={'Complete'}/> to set the completion to the current
                    time. If you finished early, you should select the appropriate time before clicking Complete.
                </li>
                <li>Click <DummyButton icon={'snooze'} label={'Extend'}/> to hide the completion reminder for another 15
                    minutes.
                </li>
                <li>If you click <DummyButton icon={'cancel'} label={'Abort'}/>, the tasks will be moved back to the
                    sidebar and any recorded stats from the starting reminder will be removed. Use it if you didn&apos;t
                    work on a task after all.
                    Repeating tasks will be ignored/muted for this week instead.
                </li>
            </ul>

            <h5 className="w3-text-theme">Tasks that are already over</h5>
            <p>Tasks where both start and end are in the past will ask you to fill out start time, end time and rating all
            at once. The planned times will be preselected, adjust them accordingly it will make the resulting
                statistics more reliable.</p>

            <h5 className="w3-text-theme">Rating tasks with stars</h5>
            <p>
                <q>Ending</q> and <q>over</q> reminders let you <em> rate </em> your performance on the task.
                Give it 1 to 5 <em> stars </em> depending on how well you think you did. <br/>Did you get all the work
                done? <br/>Was it very stressful? <br/>Was the task defined well? <br/> The rating will show up in the statistics
                later, so you will be able to see if your satisfaction with your work has improved. Unrated tasks
                will be ignored in the average rating statistic.
            </p>
        </div>
    }
}