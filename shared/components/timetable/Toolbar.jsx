import * as React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'


export default class Toolbar extends React.Component {

    static propTypes = {
        editMode: React.PropTypes.bool.isRequired,
        timetables: ImmutablePropTypes.map.isRequired,
        loadTimetable: React.PropTypes.func.isRequired,
        setProjectNr: React.PropTypes.func.isRequired
    }


    handleSelectTimetable(e) {
        console.log('## Loading Timetable (ID):', e.target.value)
        this.props.loadTimetable(e.target.value)
    }

    handleColorClick(e) {
        console.log('## projectNr:', e.target.value)
        this.props.setProjectNr(e.target.value)
    }


    render() {
        const { editMode, timetables } = this.props
        const colors = timetables.getIn(['timetable', 'workPeriods', 'colors'])
        const projectNr = timetables.get('projectNr')

        const visibleClass = (editMode) ? ' tt-toolbar-visible' : ''

        let dropdownOptions = []
        let k = 0
        for ( let tt of timetables.get('timetableList') ) {
            dropdownOptions.push(<option key={k++} value={tt.get('id')}>{tt.get('title')}</option>)
        }

        let colorButtons = []
        for ( let i = 0; i < colors.size; i++ ) {
            colorButtons.push(
                <button
                    key={i}
                    className={'w3-btn w3-round tt-toolbar-color-option' + (i === projectNr ? ' tt-tco-selected' : '')}
                    value={i}
                    onClick={::this.handleColorClick}
                    style={
                        {
                            backgroundColor: colors.get(i)
                        }
                    }/>
            )
        }

        return <div
            className={'tt-toolbar-helper' + visibleClass}
        >
            { (editMode) ?
              <div
                  className={'tt-toolbar' + visibleClass}
              >
                  <div className="tt-toolbar-color-picker">
                      {colorButtons}
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
                  <div className="w3-clear"/>
              </div> : <div className={'tt-toolbar' + visibleClass}/>
            }
        </div>
    }
}