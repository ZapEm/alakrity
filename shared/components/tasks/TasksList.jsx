import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import CustomScroll from 'react-custom-scroll'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Task from './Task'


export default class TasksList extends React.Component {

    static propTypes = {
        taskList: ImmutablePropTypes.list.isRequired,
        taskActions: PropTypes.objectOf(PropTypes.func).isRequired,
        projectColorMap: ImmutablePropTypes.map.isRequired,
        locale: PropTypes.string.isRequired,
        draggable: PropTypes.bool,
        sidebar: PropTypes.bool,
        columns: PropTypes.number,
        editMode: PropTypes.bool,
        addClassNames: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string])
    }

    static defaultProps = {
        sidebar: false,
        draggable: false,
        editMode: false,
        addClassNames: [],
        columns: 1
    }


    // componentDidMount() {
    //     this.sidebarRef = document.getElementById('sidebar')
    //
    //     this.intervalID = setInterval(() => {
    //         this.containerRef.style.height = (this.sidebarRef.clientHeight - this.containerRef.offsetTop - 24) + 'px'
    //     }, 100)
    // }
    //
    // componentWillUnmount() {
    //     clearInterval(this.intervalID)
    // }

    render() {
        const { draggable, taskActions, taskList, locale, projectColorMap, columns, sidebar, editMode, addClassNames } = this.props

        let taskItems = []
        let columnTally = []
        for ( let i = 0; i < columns; i++ ) {
            taskItems[i] = []
            columnTally[i] = 0
        }
        if ( taskList.size > 0 ) {
            taskList.forEach((task, index) => {
                    const duration = task.get('duration')
                    const taskItem = <Task
                        key={'task_li_' + index}
                        task={task}
                        projectColorMap={projectColorMap}
                        taskActions={taskActions}
                        draggable={draggable}
                        dragShadow={true}
                        editable={true}
                        locale={locale}
                        editMode={editMode}
                        liWrapper={
                            {
                                className: 'task-list-item',
                                style: { height: duration / 20 + 'rem' }
                            }
                        }
                    />
                    const lowestIndex = columnTally.indexOf(Math.min(...columnTally))
                    taskItems[lowestIndex].push(taskItem)
                    columnTally[lowestIndex] += (duration + 10.666666666)
                }
            )
        } else {
            taskItems[0].push(<li key={'task_li_none'}>
                {'No tasks!'}
            </li>)
        }

        const renderColumns = taskItems.map((column, index) => <ul
            className="task-list-sidebar-column"
            key={'col_' + index}
        >
            {column}
        </ul>)

        return (
            <div
                className={classNames(addClassNames, {
                    'task-list-container-sidebar': sidebar,
                    'task-list-container': !sidebar
                })}
            >
                <CustomScroll
                    heightRelativeToParent={'100%'}
                >
                    <div className={(sidebar ? 'task-list-sidebar' : 'task-list')}>
                        {renderColumns}
                    </div>
                </CustomScroll>
                <div className="task-list-overlay"/>
            </div>
        )
    }
}