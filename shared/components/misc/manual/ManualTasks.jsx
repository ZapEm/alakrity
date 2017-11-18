import * as React from 'react'

export default class ManualTasks extends React.Component {

    render() {
        return <div id="manual-chapter-tasks" className="manual-chapter">
            <h3 className="w3-text-theme">Tasks</h3>
            <p>Everything you want to do for your projects can be a task in Alakrity. Think of a task as a To-Do with
                an estimate on the time required to complete it. It can have a deadline to help
                scheduling it at the right time.</p>
            <p>Repeating tasks will show up every week, starting from the time you scheduled them first.
            </p>
            <p>There are several ways to add tasks to your projects. It is recommended to use the creation form in the
                sidebar of the <em>Tasks</em> tab, as it gives you the most options. The
                <em> Quick Add (Repeating) Task </em> buttons are good for when you just need a simple one off or
                repeating task.
            </p>
            <p>In the <em> Create a new task </em> form you can setup your tasks how you need them. Decide if the task
                should be repeating and estimate its duration (be generous!). Don&apos;t forget to choose the right
                project and milestone.
                You can even visually highlight the task, by checking <em> Special</em>. The task name, its duration and the
                assigned milestone can be easily changed later on, by clicking the pen symbol on an unscheduled task.
            </p>
            <div className="manual-info-block">
                <div><i className="material-icons">info_outline</i></div>
                <div>
                    <div>
                        When editing a task, try pressing the <em> Up/Down-Arrow </em> keys on your keyboard. They will
                        let you quickly change the tasks duration. Pressing <em> Enter </em> will save the changes.
                    </div>
                </div>
            </div>
        </div>
    }
}