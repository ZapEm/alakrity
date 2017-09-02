import PropTypes from 'prop-types'
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import IconButton from '../misc/IconButton'


export default class Toolbar extends React.Component {

    static propTypes = {
        editMode: PropTypes.bool.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        loadTimetable: PropTypes.func.isRequired,
        setCurrentProject: PropTypes.func.isRequired,
        projectList: ImmutablePropTypes.list.isRequired,
        onNewTimetable: PropTypes.func.isRequired
    }


    handleSelectTimetable(e) {
        console.log('## Loading Timetable (ID):', e.target.value)
        this.props.loadTimetable(e.target.value)
    }

    handleColorClick(e) {
        console.log('## projectNr:', e.target.value)
        this.props.setCurrentProject(e.target.value)
    }


    render() {
        const { editMode, timetables, projectList, onNewTimetable } = this.props
        //const colors = timetables.getIn(['timetable', 'workPeriods', 'colors'])
        const selectedProject = timetables.get('currentProjectID')

        const visibleClass = (editMode) ? ' tt-toolbar-visible' : ''

        const sortedTimetableList = timetables.get('timetableList').sort((a, b) => a.get('title').localeCompare(b.get('title')), { numeric: true })
        let dropdownOptions = []
        let k = 0
        for ( let tt of sortedTimetableList ) {
            dropdownOptions.push(<option key={k++} value={tt.get('id')}>{tt.get('title')}</option>)
        }

        let projectButtons = []
        projectButtons.push(<button
            key={'_noPrjct'}
            className={'w3-btn w3-round tt-toolbar-color-option tt-toolbar-no-project-option' + (!selectedProject ?
                                                                                                 ' tt-tco-selected' :
                                                                                                 '')}
            value={''}
            onClick={::this.handleColorClick}
            style={
                {
                    backgroundColor: '#fff'
                }
            }/>)
        if ( projectList ) {
            projectList.forEach((project, index) => projectButtons.push(
                <button
                    key={index}
                    className={'w3-btn w3-round tt-toolbar-color-option' + (project.get('id') === selectedProject ?
                                                                            ' tt-tco-selected' : '')}
                    value={project.get('id')}
                    onClick={::this.handleColorClick}
                    style={
                        {
                            backgroundColor: project.get('color')
                        }
                    }/>)
            )
        }

        return <div
            className={'tt-toolbar-helper' + visibleClass}
        >
            {(editMode) ?
             <div
                 className={'tt-toolbar' + visibleClass}
             >
                 <div className="tt-toolbar-color-picker">
                     {projectButtons}
                 </div>
                 <IconButton
                     iconName="note_add"
                     className="w3-right"
                     onClick={onNewTimetable}
                 />
                 <select
                     onChange={::this.handleSelectTimetable}
                     className="w3-select w3-right"
                     style={{
                         padding: 0,
                         margin: '4px',
                         width: 'initial'
                     }}
                     name="option"
                 >
                     {dropdownOptions}
                 </select>

                 <div className="w3-clear"/>
             </div> : <div className={'tt-toolbar' + visibleClass}/>
            }
        </div>
    }
}