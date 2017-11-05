import * as React from 'react'
import DummyButton from './DummyButton'

export default class ManualProjects extends React.Component {

    render() {
        return <div id="manual-chapter-projects" className="manual-chapter">
            <h3 className="w3-text-theme">Projects</h3>
            <p>
                Projects in Alakrity are there for organizing your tasks. Each project has a name, color
                and type to define it&apos;s appearance. You can decide if you want it to be tracked and you can add
                milestones to it, if your project has intermediate goals or deadlines.
            </p>
            <p>
                Since every task needs to be assigned to a project, it is recommended to create a few (un-tracked)
                projects for broader categories like <q>Appointments</q> or <q>Household Chores</q>.
            </p>

            <h5 className="w3-text-theme">Tracked and un-tracked projects</h5>
            <p>
                Alakrity will remind you about tasks of tracked projects and record statistics for them. Un-tracked
                projects are good for things you do anyways and don&apos;t want to be reminded off by the application,
                like your university classes, the weekly knitting group, or a dentist appointment.
            </p>

            <h5 className="w3-text-theme">Creating a new project:</h5>
            <ul className="manual-list">
                <li>First click the <DummyButton icon={'add'} label={'Create a Project'}/> button on the right to add a new project.
                </li>
                <li>Now enter a name and choose if this project should be tracked or not.</li>
            </ul>

            <p></p>
        </div>
    }
}