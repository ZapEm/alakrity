import * as React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import { getProjectColorMap } from '../../../utils/helpers'
import { EXTRA_COLORS } from '../../../utils/constants'

export default class ProjectPeriodPicker extends React.Component {

    static propTypes = {
        projectList: ImmutablePropTypes.list.isRequired,
        setCurrentProject: React.PropTypes.func.isRequired,
        currentProjectID: React.PropTypes.string
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

    renderCustomListItem({ label, key, dataId, borderColor, backgroundColor, iconName }) {
        const liStyle = this.props.currentProjectID === dataId ? {
            backgroundColor: backgroundColor,
            borderLeft: 'solid 2px ' + borderColor,
            borderRight: 'solid 2px ' + borderColor,
            margin: '2px -2px'
        } : {
            borderColor: borderColor
        }

        const squareStyle = iconName ? {
            color: borderColor,
            borderColor: borderColor
        } : {
            backgroundColor: backgroundColor,
            borderColor: borderColor
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
            this.renderCustomListItem({
                label: 'Clear',
                key: '_0-clear',
                dataId: '',
                borderColor: EXTRA_COLORS.CLEAR.dark,
                backgroundColor: EXTRA_COLORS.CLEAR.light,
                iconName: 'clear'
            }),
            this.renderCustomListItem({
                label: 'Buffer',
                key: '_1-buffer',
                dataId: 'buffer',
                borderColor: EXTRA_COLORS.BUFFER.dark,
                backgroundColor: EXTRA_COLORS.BUFFER.light,
                iconName: 'swap_calls' // 'cached' //'filter_drama'
            })
        ]
        projectList.forEach((project, index) => {
            const id = project.get('id')

            const liStyle = (id === currentProjectID) ? {
                backgroundColor: this.state.projectColorMap.getIn([id, 'light']),
                borderLeft: 'solid 2px ' + this.state.projectColorMap.getIn([id, 'dark']),
                borderRight: 'solid 2px ' + this.state.projectColorMap.getIn([id, 'dark']),
                margin: '2px -2px'
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

        return <div className="tt-project-period-picker">
            <ul>
                {projectPickOptions}
            </ul>
        </div>
    }
}