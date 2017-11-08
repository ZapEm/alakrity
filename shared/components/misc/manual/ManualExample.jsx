import * as React from 'react'

export default class ManualExample extends React.Component {

    render() {
        return <div id="manual-chapter-example" className="manual-chapter">
            <h3 className="w3-text-theme">Example Use Case</h3>
            <p>
                Steve is a computer science student in the last semester of his bachelor studies. To finish his degree,
                he still has to attend two lectures, pass the exams, and write his bachelor thesis. He works 9 hours a
                week as a tutor to earn some pocket money. He also likes to stay active, so goes running every
                tuesday and tries to do some other sport on thursdays.
            </p>
            <ul className="manual-list">
                <li>
                    <p className="manual-p">
                        To set up a <em> timetable </em> that fits his needs, Steve has to first create <em>
                        projects </em> for all the things he already does regularly. So he creates a project each
                        for his university <i> Classes </i>, his <i> Tutoring Job </i>, and his <i> Sport </i>
                        activities. He could also add one for <i> Household </i> chores but he thinks he can manage
                        those in the remaining free time, so he doesn&apos;t for now. He does, however, add a project
                        for all his <i> Appointments </i>, so he can make them show up in the timetable.
                    </p>
                    <p className="manual-p">
                        Steve does not need any encouragement to work on these tasks, so he sets the projects up as
                        un-tracked by removing the <em> <q>tracked</q> check mark </em>.
                    </p>
                </li>
                <li>
                    <p className="manual-p">
                        For the work of his <i> Bachelors Thesis </i> Steve creates a <em> tracked </em> project, since
                        he was struggling to find the time and motivation to do it. He adds another <em> tracked </em>
                        project for his <i> Exams Preparations </i> so he wont forget to study for the tests.
                    </p>
                </li>
                <li>
                    <p className="manual-p">
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
                    <p className="manual-p">
                        The next thing Steve has to do, is create <em> tasks </em> for his various projects. He sets the
                        <em> <q>repeating</q> </em> flag for tasks that have to be done on a weekly basis. Now his <i>
                        Running </i> task and <i> Classes </i> etc. will show up every week. When estimating the
                        duration of the tasks he is very generous (x1.5) to leave himself some time for unexpected
                        delays and short breaks between the tasks.
                    </p>
                </li>
                <li>
                    <p className="manual-p">
                        Only after all the other steps comes finally the definition of the <em> timetable</em>. basic schedule??
                    </p>
                </li>
            </ul>
        </div>
    }
}