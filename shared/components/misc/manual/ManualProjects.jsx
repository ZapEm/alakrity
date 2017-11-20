import * as React from 'react'
import DummyButton from './DummyButton'

export default class ManualProjects extends React.Component {

    render() {
        return <div id="manual-chapter-projects" className="manual-chapter">
            <h2 className="w3-text-theme">Projects</h2>
            <p>
                Projects are a key functionality of the Alakrity application and their primary function is to divide the tasks into sensible groups.
                A project can be used for anything from things like a university thesis or freelance work, to fitness and household chores, or even just a collection of unrelated appointments. Each project has a name, color
                and type to define it&apos;s appearance. You can decide if you want it to be tracked and if your project has intermediate goals or deadlines you can add
                milestones to it.
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
            <ol>
                <li>First click the <DummyButton icon={'add'} label={'Create a Project'}/> button on the right to add a
                    new project.
                </li>
                <li>Now enter a name and choose if this project should be tracked or not. Changing the <em>tracked</em> option
                    after tasks have been recorded may have unwanted results.
                </li>
                <li>Select a color you like.</li>
                <li>Select a type that fits the project. Currently the project types have only cosmetic effects (Icon & Mascot). </li>
                <li>You can add a description if you want, but it is not required.</li>
                <li>Press <DummyButton icon={'check'} label={'Save'}/> when you are finished.</li>
            </ol>

            <h5 className="w3-text-theme">Hover over a project in the list to show the following buttons:</h5>
            <ul className="manual-list">
                <li><DummyButton icon={'alarm'} label={'Manage'}/> : Add or change milestones.
                <ul className="manual-list">
                    <li>Add or delete milestones.</li>
                    <li>Choose a name and a date (deadline) for each milestone.</li>
                    <li>Save to confirm changes.</li>
                </ul>
                </li>
                <li><DummyButton icon={'edit'}/>: Change the project settings (title, color, type, ...).</li>
                <li><DummyButton icon={'delete_forever'}/>: Delete the project. Click once to arm the button, then click again to confirm deletion.</li>
            </ul>
        </div>
    }
}