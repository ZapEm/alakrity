import * as Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import tinycolor from 'tinycolor2'
import { SPECIAL_PROJECTS } from '../../utils/constants'

export default class ProjectSelector extends React.Component {

    static propTypes = {
        projectList: ImmutablePropTypes.list.isRequired,
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
        const currentProject = this.props.projectList.get(e.target.value)

        this.setState({ currentProject: currentProject })
        this.props.selectProject(currentProject)
    }

    render() {
        const { projectList } = this.props

        const disabled = (projectList.size === 0) ? 'A project needs to be created first.' : false
        let projectSelectOptions = []
        if ( !disabled ) {
            let i = 0
            for ( const project of projectList ) {
                projectSelectOptions.push(
                    <option
                        className="project-selector-option"
                        key={project.get('id')}
                        value={i++}
                        style={{ backgroundColor: tinycolor(project.get('color')).brighten(10) }}
                    >{project.get('title')}</option>
                )
            }
            // for ( const project of Object.values(SPECIAL_PROJECTS) ) {
            //     projectSelectOptions.push(
            //         <option
            //             className="project-selector-option"
            //             key={project.key}
            //             value={project.key}
            //             style={{ backgroundColor: project.light }}
            //         >{project.title}</option>
            //     )
            // }

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