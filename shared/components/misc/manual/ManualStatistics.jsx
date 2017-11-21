import * as React from 'react'

export default class ManualStatistics extends React.Component {

    render() {


        return <div id="manual-chapter-statistics" className="manual-chapter">
            <h2 className="w3-text-theme">Statistics</h2>
            <p>Your work on your (tracked) projects is recorded and compiled into a few helpful graphs. You can find a
                short description of the different stats that are shown in the sidebar, so this section will only
                describe the general intent of the graphs.
            </p>

            <h5 className="w3-text-theme">Overview</h5>
            <p>This graph shows the current week compared to the average of the last (up to) 5 weeks. Use it to compare
                your performance to your averages at the end of - or even during - the week.
            </p>

            <h5 className="w3-text-theme">Time Line</h5>
            <p>This graph shows the trend over the last few weeks. Check if you are improving or if you need to increase
                your efforts by recognizing trends.
            </p>

            <h5 className="w3-text-theme">Project Time Coverage</h5>
            <p>This graph shows how much of the planned project periods time was spent actually working tasks for each
                respective project in percent. It also shows (lighter color) the percentage of work you scheduled,
                compared to each project. The difference of these values (light colored area) indicates how much you
                deviated from your plan.
            </p>
            <p>A well planned schedule should show only a thin area near the 100% mark!</p>

            <div className="manual-info-block">
                <div><i className="material-icons">info_outline</i></div>
                <p>
                    Click on the labels (above each graph) to hide or show the different datasets. This can help if you
                    want to have a better look at specific stats.
                    <br/> Use this to have a look at your buffer usage; it is hidden by default.
                </p>
            </div>
        </div>
    }
}