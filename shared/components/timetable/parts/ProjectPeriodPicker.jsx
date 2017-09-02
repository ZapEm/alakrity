import PropTypes from 'prop-types'
import React from 'react'
import CustomScroll from 'react-custom-scroll'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { SPECIAL_PROJECTS } from '../../../utils/constants'
import { getProjectColorMap } from '../../../utils/helpers'

export default class ProjectPeriodPicker extends React.Component {

    static propTypes = {
        projectList: ImmutablePropTypes.list.isRequired,
        setCurrentProject: PropTypes.func.isRequired,
        currentProjectID: PropTypes.string
    }

    static defaultProps = {
        currentProjectID: ''
    }

    constructor(props) {
        super(props)
        this.state = {
            projectColorMap: undefined
        }
    }

    componentWillMount() {
        this.setState({ projectColorMap: getProjectColorMap(this.props.projectList) })
    }

    handleProjectPick(e) {
        e.preventDefault()
        this.props.setCurrentProject(e.target.getAttribute('data-id'))
    }

    renderSpecialProjects({ label, key, dataId, specialProject, iconName }) {
        const liStyle = this.props.currentProjectID === dataId ? {
            backgroundColor: specialProject.light,
            ...specialProject.backgroundPattern && {
                backgroundImage: specialProject.backgroundPattern
                //backgroundAttachment: 'local'
            },
            borderLeft: 'solid 2px ' + specialProject.dark,
            borderRight: 'solid 2px ' + specialProject.dark,
            margin: '2px 0'
        } : {
            borderColor: specialProject.dark
        }

        const squareStyle = {
            backgroundColor: specialProject.normal,
            color: specialProject.dark,
            borderColor: specialProject.dark
        }

        return <li
            className="tt-project-picker-option w3-round"
            key={key}
            data-id={dataId}
            onClick={::this.handleProjectPick}
            style={liStyle}
        >
            <div
                className={(iconName ? 'material-icons ' : '') + ' tt-project-picker-option-square'}
                style={squareStyle}
            >
                {iconName}
            </div>
            <span className={'tt-project-picker-option-text'}>{label}</span>
        </li>
    }

    render() {
        const { projectList, currentProjectID } = this.props

        let projectPickOptions = [
            this.renderSpecialProjects({
                label: 'Clear',
                key: '_0-clear',
                dataId: '',
                specialProject: SPECIAL_PROJECTS.CLEAR,
                iconName: 'clear'
            }),
            this.renderSpecialProjects({
                label: 'Buffer',
                key: '_1-buffer',
                dataId: 'BUFFER',
                specialProject: SPECIAL_PROJECTS.BUFFER,
                iconName: 'swap_calls' // 'cached' //'filter_drama'
            }),
            this.renderSpecialProjects({
                label: 'Break',
                key: '_2-break',
                dataId: 'BREAK',
                specialProject: SPECIAL_PROJECTS.BREAK,
                iconName: 'restaurant'
            })
        ]
        projectList.forEach((project, index) => {
            const id = project.get('id')

            const liStyle = (id === currentProjectID) ? {
                backgroundColor: this.state.projectColorMap.getIn([id, 'light']),
                borderLeft: 'solid 2px ' + this.state.projectColorMap.getIn([id, 'dark']),
                borderRight: 'solid 2px ' + this.state.projectColorMap.getIn([id, 'dark']),
                margin: '2px 0'
            } : {
                borderColor: this.state.projectColorMap.getIn([id, 'dark'])
            }

            projectPickOptions.push(
                <li
                    className="tt-project-picker-option w3-round"
                    key={index}
                    data-id={id}
                    onClick={::this.handleProjectPick}
                    style={liStyle}
                >
                    <div
                        className={'tt-project-picker-option-square'}
                        style={{
                            backgroundColor: this.state.projectColorMap.getIn([id, 'normal']),
                            borderColor: this.state.projectColorMap.getIn([id, 'dark'])
                        }}
                    />
                    <span className={'tt-project-picker-option-text'}>{project.get('title')}</span>
                </li>
            )
        })

        return <div className="tt-project-picker">
            <label title="Pick a project and 'paint in' project periods ">Work periods</label>
            <div className="tt-project-picker-content">
                <CustomScroll
                    flex="1"
                    //heightRelativeToParent="100%"
                >
                    <ul>
                        {projectPickOptions}
                    </ul>
                </CustomScroll>
            </div>
        </div>
    }
}