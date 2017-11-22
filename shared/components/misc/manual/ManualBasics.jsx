import * as React from 'react'

export default class ManualBasics extends React.Component {

    render() {
        return <div id="manual-chapter-basics" className="manual-chapter">
            <h2 className="w3-text-theme">Basics</h2>
            <p>
                Welcome to the Alakrity Week Scheduler! This scheduling app is based on the <em> <q>
                Drei-Schritt-Zeitmanagement</q> </em> (three step time management) method by Jörn Sickelmann. Like the
                method, Alakrity is intended for people that want to improve their time management or are struggling to
                find the time to do certain important work.
            </p>
            <h5 className="w3-text-theme">Three Step Time Management</h5>
            This is just a short summary of the full method. Unfortunately, at the time of this writing, the method is
            not officially published yet.
            <ol>
                <li className="w3-margin">Create a list with all your regular events and obligations. Be thorough.
                    <br/>For example:
                    <table className="w3-table w3-bordered">
                        <tbody>
                        <tr><td>Nordic walking meet</td><td>Monday 7:30-9am</td></tr>
                        <tr><td>University lectures (Math 1)</td><td>Tue 9-11am, Thu 11am-1pm</td></tr>
                        <tr><td> ~ (Chinese)</td><td>Wed 2-4pm</td></tr>
                        <tr><td> ~ (Psychology for Engineers 2)</td><td>Thu 9am-11am</td></tr>
                        <tr><td>Household chores (Groceries, Cleaning)</td><td>1h, twice a week</td></tr>
                        <tr><td>Part-time job</td><td>Fri & Sat 5-11pm</td></tr>
                        <tr style={{border: 'none'}}><td> ... </td><td> ... </td></tr>
                        </tbody>
                    </table>
                    In Alakrity, you can create tasks in not-tracked projects for the items in this list.
                </li>
                <li className="w3-margin">
                    test
                </li>
            </ol>
        </div>
    }
}