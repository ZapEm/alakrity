import * as React from 'react'

export default class ManualExample extends React.Component {

    render() {
        return <div id="manual-chapter-example" className="manual-chapter">
            <h2 className="w3-text-theme">Example Use Case</h2>
            <p>
                Steve is a computer science student in the last semester of his bachelor studies. To finish his degree,
                he still has to attend two lectures, pass the exams, and write his bachelor thesis. He works 9 hours a
                week as a tutor to earn some pocket money. He also likes to stay active, so goes running every
                tuesday and tries to do some other sport on thursdays.
            </p>
            <ul className="manual-list">
                <li>
                    <p>
                        To set up a <em> timetable </em> that fits his needs, Steve has to first create <em>
                        projects </em> for all the things he already does regularly. So he creates a project each
                        for his university <i> Classes </i>, his <i> Tutoring Job </i>, and his <i> Sport </i>
                        activities. He could also add one for <i> Household </i> chores but he thinks he can manage
                        those in the remaining free time, so he doesn&apos;t for now. He does, however, add a project
                        for all his <i> Appointments </i>, so he can make them show up in the timetable.
                    </p>
                    <p>
                        Steve does not need any encouragement to work on these projects, so he sets the projects up as
                        un-tracked by removing the <em> <q>tracked</q> check mark </em>.
                    </p>
                    <p>
                        For the work of his <i> Bachelors Thesis </i> Steve creates a <em> tracked </em> project, since
                        he was struggling to find the time and motivation to do it. He adds another tracked
                        project for his <i> Exams Preparations </i> so he wont forget to study for the tests.
                    </p>
                </li>
                <li>
                    <p>
                        After creating the projects, Steve adds <em> milestones </em> to the two tracked projects.
                        Obvious milestones are of course the exam dates, as they are a final deadline for their
                        respective lectures. For his thesis Steve needs to think a bit more. He needs to divide the work
                        for his thesis into meaningful parts and decide when each part should be finished, to create
                        appropriate milestones. For a thesis going by chapters or parts makes sense, while for more
                        dynamic
                        project it could be an option to just have a milestone every other week or so.
                    </p>
                </li>
                <li>
                    <p>
                        The next thing Steve has to do, is create <em> tasks </em> for his various projects. He sets the
                        <em> <q>repeating</q> </em> flag for tasks that have to be done on a weekly basis. Now, for
                        example, his <i> Running </i> task will show up every week. When estimating the duration of the
                        tasks he is very generous (x1.5) to leave himself some time for small delays and short breaks
                        between the tasks.
                    </p>
                </li>
                <li>
                    <p>
                        Finally, Steve has to decide at what days and times he wants to work on his projects. He clicks
                        <em> Change Weekly Schedule </em> in the <em> Timetable </em> tab to setup the basic <em>
                        timetable</em>. He paints in the <em> work periods </em> of his projects, <em> Break </em> times
                        and <em> Buffer </em> periods. The buffer helps him in case he has to reschedule a task on a
                        full schedule, or if he can&apos;t quite fit in a task otherwise. In this step the tracked
                        projects are important, as their performance analysis depends on how well their schedule is
                        defined.
                    </p>
                </li>
                <li>
                    <p>
                        Now, the timetable is ready. From now on, Steve only has to define tasks for his upcoming
                        milestones and put the tasks into the timetable. He creates another repeating task to remind him
                        to do this in time for the next week.
                    </p>
                </li>
                <li>
                    <p>
                        To see how he has been performing lately, Steve looks at the <em> Statistics </em> tab. There he
                        can find statistics about how much he delayed his tasks, how happy he himself was with his work,
                        and how well he kept to his weekly schedule.
                    </p>
                </li>
            </ul>

            <div className="manual-info-block">
                <div><i className="material-icons">info_outline</i></div>
                <div>
                    <p>
                        You can log in as Steve to have a look at how he set up his timetable and his statistics.
                        Just be considerate
                        of others and don&apos;t mess up his schedule, please, as I currently don&apos;t have a way to
                        reset his profile.
                    </p>
                    <table>
                        <tbody>
                        <tr>
                            <td className="w3-right"><em>User:</em></td>
                            <td>steve</td>
                        </tr>
                        <tr>
                            <td className="w3-right"><em>Password:</em></td>
                            <td>example</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    }
}