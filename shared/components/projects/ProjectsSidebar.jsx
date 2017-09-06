import PropTypes from 'prop-types'
import * as React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { PROJECT_COLORS } from '../../utils/constants'
import { DEFAULT_PROJECT, thaw } from '../../utils/defaultValues'
import LabeledIconButton from '../misc/LabeledIconButton'

export default class ProjectsSidebar extends React.Component {

    static propTypes = {
        projectActions: PropTypes.objectOf(PropTypes.func).isRequired,
        projectList: ImmutablePropTypes.list
    }

    getNextFreeColor() {
        for ( let i = 0; i < PROJECT_COLORS.length; i++ ) {
            if ( this.props.projectList.find((project) => ( PROJECT_COLORS[i] === project.get('color') )) === undefined ) {
                return PROJECT_COLORS[i]
            }
        }
        return PROJECT_COLORS[Math.floor(Math.random() * (PROJECT_COLORS.length + 1))]
    }

    handleCreateProject(e) {
        e.preventDefault()
        let project = thaw(DEFAULT_PROJECT)
        project.color = this.getNextFreeColor()

        this.props.projectActions.createProject(project, { editing: true })
    }

    render() {
        return <div
            className={'layout-sidebar w3-card-4 w3-padding w3-border w3-border-theme w3-round-large'}
        >
            <LabeledIconButton
                label={'Create a Project'}
                iconName={'library_add'} //create_new_folder
                onClick={::this.handleCreateProject}
            />
        </div>
    }
}