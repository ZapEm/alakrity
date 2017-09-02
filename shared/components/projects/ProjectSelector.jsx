import * as Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import tinycolor from 'tinycolor2'
import { SPECIAL_PROJECTS } from '../../utils/constants'

export default class ProjectSelector extends React.Component {

    static propTypes = {
        projectList: ImmutablePropTypes.list.isRequired,
        specialProjects: ImmutablePropTypes.list,
        selectProject: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        this.state = {
            isActive: false,
            currentProject: this.props.projectList.first() ? this.props.projectList.first() :
                            Immutable.fromJS({ color: '#FFFFFF' })
        }
    }

    handleSelectProject(e) {
        e.preventDefault()
        const currentProject = ((key) => {
            const actions = {
                [SPECIAL_PROJECTS.ONE_TIME.key]: () => Immutable.Map(
                    {
                        title: SPECIAL_PROJECTS.ONE_TIME.title,
                        id: SPECIAL_PROJECTS.ONE_TIME.key,
                        color: SPECIAL_PROJECTS.ONE_TIME.normal
                    })
            }

            if ( typeof actions[key] !== 'function' ) {
                return this.props.projectList.get(key)
            }
            return actions[key]()
        })(e.target.value)

        this.setState({ currentProject: currentProject })
        this.props.selectProject(currentProject)
    }

    render() {
        const { projectList, specialProjects } = this.props

        const disabled = (projectList.size === 0) ? 'A project needs to be created first.' : false
        let projectSelectOptions = []
        if ( !disabled ) {
            let i = 0
            for ( let project of projectList ) {
                projectSelectOptions.push(
                    <option
                        className="project-selector-option"
                        key={project.get('id')}
                        value={i++}
                        style={{ backgroundColor: tinycolor(project.get('color')).brighten(10) }}
                    >{project.get('title')}</option>
                )
            }
            for ( let project of specialProjects ) {
                projectSelectOptions.push(
                    <option
                        className="project-selector-option"
                        key={project.get('key')}
                        value={project.get('key')}
                        style={{ backgroundColor: project.get('light') }}
                    >{project.get('title')}</option>
                )
            }

        } else {
            projectSelectOptions.push(
                <option key={'noProject'}
                        value={'noProject'}
                        selected
                        disabled>{'Create a project first'}</option>
            )
        }

        return <select
            onChange={::this.handleSelectProject}
            className={'project-selector w23-border-theme w3-round w3-select' + (disabled ? ' w3-text-gray' :
                                                                                 '')}
            name="option"
            style={{
                backgroundColor: this.state.currentProject ?
                                 tinycolor(this.state.currentProject.get('color')).brighten(10) : 'none',
                border: this.state.currentProject ?
                        'solid 1px ' + tinycolor(this.state.currentProject.get('color')).brighten(-35) : 'none'
            }}
            disabled={disabled}
        >
            {projectSelectOptions}
        </select>

    }
}