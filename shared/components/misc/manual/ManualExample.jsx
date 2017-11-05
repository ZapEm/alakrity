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
                        To set up a <em> timetable </em> that fits his needs, Steve would first create <em>
                        projects </em> for all the things he already does regularly. So he would create a project each
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
                        The work for his <i> Bachelors Thesis </i> defines Steve as a <em> tracked </em> project, since
                        he was struggling to find the time and motivation to do it. He adds another <em> tracked </em>
                        project for his <i> Exams Preparations </i> so he wont forget to study for the tests.
                    </p>
                </li>
                <li>
                    <p className="manual-p">
                        MILESTONES.
                    </p>
                </li>
                <li>
                    <p className="manual-p">
                        TASKS.
                    </p>
                </li>
                <li>
                    <p className="manual-p">
                        TIMETABLE. at the end.
                    </p>
                </li>
            </ul>
        </div>
    }
}