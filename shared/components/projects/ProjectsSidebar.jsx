import PropTypes from 'prop-types'
import * as React from 'react'
import ProjectForm from './ProjectForm'

export default class ProjectsSidebar extends React.Component {

    static propTypes = {
        prop: PropTypes.any
    }

    render() {
        const { prop } = this.props
        return <div
            className={'task-list-view-sidebar projects-sidebar w3-card-4 w3-padding w3-border w3-border-theme w3-round-large'}
        >
            <ProjectForm
                onSubmit={}
            />

        </div>
    }
}