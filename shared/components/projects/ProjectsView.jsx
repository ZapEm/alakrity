import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import tinycolor from 'tinycolor2'
import { PROJECT_COLORS } from '../../utils/constants'
import Project from './Project'
import ProjectFrom from './ProjectForm'

export default class ProjectsView extends React.Component {

    static propTypes = {
        projects: ImmutablePropTypes.map.isRequired,
        tasks: ImmutablePropTypes.map.isRequired,
        taskActions: React.PropTypes.object.isRequired,
        projectActions: React.PropTypes.objectOf(React.PropTypes.func).isRequired
    }

    constructor(props) {
        super(props)
        this.state = { tabIndex: 0 }
    }

    handleOnTapClick(tabIndex) {
        this.setState({ tabIndex })
        // if ( !content.props.isSelected ) {
        //     this.props.projectActions.setCurrentProject(content.props.project.get('id'))
        // }
    }


    render() {
        const { projects, tasks, projectList, taskActions, projectActions: { createProject } } = this.props

        let titleTabs = []
        let projectTabPanels = []
        let k = 0
        for ( let project of projects.get('projectList') ) {
            const projectTaskList = tasks.get('taskList').filter(task => (task.get('projectID') === project.get('id')))
            const bgStyle = {
                backgroundColor: tinycolor(PROJECT_COLORS[project.get('color') || 0]).lighten(10)
            }
            titleTabs.push(
                <Tab
                    key={'prj_panel_' + k++}
                    style={bgStyle}
                >
                    {project.get('title')}
                </Tab>
            )

            projectTabPanels.push(
                <TabPanel
                    key={'prj_panel_' + k++}
                    style={bgStyle}
                >
                    <Project
                        colors={PROJECT_COLORS}
                        project={project}
                        taskList={projectTaskList}
                        projectList={projects.get('projectList')}
                        taskActions={taskActions}
                    />
                </TabPanel>
            )
        }
        return (
            <div className="projects-view">
                <ProjectFrom
                    onSubmit={createProject}
                    colors={PROJECT_COLORS}
                />
                <Tabs
                    selectedTabPanelClassName="react-tabs__tab-panel--selected w3-card-4"
                    selectedIndex={this.state.tabIndex}
                    onSelect={::this.handleOnTapClick}
                >
                    <TabList>
                        {titleTabs}
                    </TabList>
                    {projectTabPanels}
                </Tabs>
            </div>
        )

    }
}