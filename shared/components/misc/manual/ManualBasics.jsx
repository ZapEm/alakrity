import * as React from 'react'

export default class ManualBasics extends React.Component {

    render() {
        return <div id="manual-chapter-basics" className="manual-chapter">
            <h2 className="w3-text-theme">Basics</h2>
            <p>
                Welcome to the Alakrity Week Scheduler! This scheduling app is based on the <em> <q>
                Drei-Schritt-Zeitmanagement</q> </em> (three step time management) method by Jörn Sickelmann from
                Paderborn University. Like the method, the Alakrity application is intended for people that want to
                improve their time management, or are struggling to find the time to do certain important work.
            </p>
            <p>You are of course free to use the features of this application how you like, but I would recommend to try
                use it as described by the following method first.</p>
            <h4 className="w3-text-theme">Three Step Time Management</h4>
            This is just a short summary of the full method. Unfortunately, at the time of this writing, the method is
            not officially published yet. I wil, however, try to give you all the relevant information you need to apply
            the method with the help of Alakrity.

            <h5>Step 1</h5>
            <p>First create a list with all your regular events and obligations. If you are
                thorough now, you will have an easier time later.
                Such a list could look like this:
                <div className="w3-margin">
                    <table className="w3-table w3-bordered">
                        <tbody>
                        <tr>
                            <td>Nordic walking meet</td>
                            <td>Monday 7:30-9am</td>
                        </tr>
                        <tr>
                            <td>University lectures (Math 1)</td>
                            <td>Tue 9-11am, Thu 11am-1pm</td>
                        </tr>
                        <tr>
                            <td> ~ (Chinese)</td>
                            <td>Wed 2-4pm</td>
                        </tr>
                        <tr>
                            <td> ~ (Psychology for Engineers 2)</td>
                            <td>Thu 9am-11am</td>
                        </tr>
                        <tr>
                            <td>Household chores (Groceries, Cleaning)</td>
                            <td>1h, twice a week</td>
                        </tr>
                        <tr>
                            <td>Part-time job</td>
                            <td>Fri & Sat 5-11pm</td>
                        </tr>
                        <tr style={{ border: 'none' }}>
                            <td> ...</td>
                            <td> ...</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                In Alakrity, the items on this list will later show up as tasks or time periods of not-tracked
                projects. You want to define them first, so you can schedule your other work around them. Don&apos;t
                worry though, the schedule is still flexible enough to do some changes to this later.
            </p>
            <h5>Step 2</h5>
            <p>
                Create a second list with all your goals or, as they are called in Alakrity, your <em> projects </em>.
                This should be the things you are currently struggling with and want to accomplish with the help of
                Alakrity. Write down the final deadline for the projects if you know them. You should then try to think
                of milestones (intermediate deadlines) for these projects. Add milestones even if your project is open
                end in nature, because you need these sub-goals to have something to work towards later. If you just
                have at it without ever reaching a goal, you will soon feel a lot like Sisyphus. If you still can&apos;t
                think of any milestones, you can just create one for every (other) week and name them by how much you
                want to do in that time.
            </p>
            <p>
                Mark these projects as tracked, when you create them in the application, to enable reminders and
                statistics for them. Create your final deadline and sub-goals as milestones (currently, the final
                deadline is just the last milestone in Alakrity). This will help you schedule your tasks in time and
                keep track of how you are performing.
            </p>

            <h5>Step 3</h5>
            <p>
                Now, you will have to create tasks for the items and milestones in both of your lists. These tasks will
                later be scheduled in your timetable. For the first list you will mostly create repeating tasks in
                Alakrity or just fill in the work periods (of not-tracked projects), to mark the times as unavailable -
                you can of course still create one time tasks if you want to plan something without having the reminders
                set.
            </p>
            <p>
                For the second list you should think about what tasks are needed to reach your upcoming milestones. Each
                task should have a well defined title so you will be able to just start working on it if the time comes.
                Be precise and write what should be done; what paper should you read, how many new words do you want to
                learn, what steps are needed for the implementation for the feature? - add a task for each of them.
            </p>
            <p>
                Tasks also require you to give them a duration. This is the time you think you will need to finish them.
                Including all the usual ramp-up and delays. Be generous here, you should probably multiply your
                estimation by 1.5 or even 2. How well you are guessing the durations is something you can check on in
                the statistics tab later.
            </p>
            <p>
                Finally, the three step method has you create a timetable, by filling in the times from the first list
                and the tasks you created from the second list. In Alakrity this is done in the <em> Timetable </em>
                tab. So, the workflow for setting up a timetable from scratch is just going through the tabs in the
                order <em> Projects </em>, then <em> Tasks </em> and finally <em> Timetable </em>.
            </p>
            <p>
                Look at the help topic for each tab or feature if you have any questions or just want learn how to use
                it beforehand. In the following section shows a small example use case, to help you get a more concrete
                understanding of what was described here. However, if the general method is clear, most of the
                applications functions should hopefully be easy enough to understand without further help.
            </p>
        </div>
    }
}