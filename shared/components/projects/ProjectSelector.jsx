import * as Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import tinycolor from 'tinycolor2'

export default class ProjectSelector extends React.Component {

    static propTypes = {
        projectList: ImmutablePropTypes.list.isRequired,
        selectProject: PropTypes.func.isRequired,
        withAllOption: PropTypes.bool
    }

    static defaultProps = {
        withAllOption: false
    }

    constructor(props) {
        super(props)
        this.state = {
            isActive: false,
            currentProject: false
        }
    }

    handleSelectProject(e) {
        e.preventDefault()
        const currentProject = e.target.value !== '_ALL_PROJECTS' ? this.props.projectList.get(e.target.value) : false

        this.setState({ currentProject: currentProject })
        this.props.selectProject(currentProject)
    }

    render() {
        const { projectList, withAllOption } = this.props

        const disabled = (projectList.size === 0) ? 'A project needs to be created first.' : false
        let projectSelectOptions = []
        if ( withAllOption ) {
            projectSelectOptions.push(
                <option
                    className="project-selector-option"
                    key={'_ALL_PROJECTS'}
                    value={'_ALL_PROJECTS'}
                    style={{ backgroundColor: 'white' }}
                >{'< ALL PROJECTS >'}</option>)
        }
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
            className={'project-selector w3-round w3-select' + (disabled ? ' w3-text-gray' :
                                                                                 '')}
            name="option"
            style={{
                backgroundColor: this.state.currentProject ?
                                 tinycolor(this.state.currentProject.get('color')).brighten(10) : 'white',
                border: this.state.currentProject ?
                        'solid 1px ' + tinycolor(this.state.currentProject.get('color')).brighten(-35) : 'solid 1px #777777'
            }}
            disabled={disabled}
        >
            {projectSelectOptions}
        </select>

    }
}