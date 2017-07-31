import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import IconButton from '../misc/IconButton'


export default class Toolbar extends React.Component {

    static propTypes = {
        editMode: React.PropTypes.bool.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        loadTimetable: React.PropTypes.func.isRequired,
        setCurrentProject: React.PropTypes.func.isRequired,
        projectList: ImmutablePropTypes.list.isRequired,
        onNewTimetable: React.PropTypes.func.isRequired
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
        const selectedProject = timetables.get('currentProject')

        const visibleClass = (editMode) ? ' tt-toolbar-visible' : ''

        let dropdownOptions = []
        let k = 0
        for ( let tt of timetables.get('timetableList') ) {
            dropdownOptions.push(<option key={k++} value={tt.get('id')}>{tt.get('title')}</option>)
        }

        let projectButtons = []
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
                 <select
                     onChange={::this.handleSelectTimetable}
                     className="w3-select w3-right" style={
                     {
                         padding: 0,
                         margin: '4px',
                         width: 'initial'
                     }}
                     name="option"
                 >
                     {dropdownOptions}
                 </select>
                 <IconButton
                    iconName="note_add"
                    className="w3-right"
                    onClick={onNewTimetable()}
                 />
                 <div className="w3-clear"/>
             </div> : <div className={'tt-toolbar' + visibleClass}/>
            }
        </div>
    }
}