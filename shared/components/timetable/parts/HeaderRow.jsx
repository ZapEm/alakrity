import PropTypes from 'prop-types'
import React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import momentPropTypes from 'react-moment-proptypes'
import { DANGER_LEVELS, LOCALE_STRINGS } from '../../../utils/constants'
import IconButton from '../../misc/IconButton'


export default class HeaderRow extends React.Component {

    static propTypes = {
        momentDate: momentPropTypes.momentObj.isRequired,
        editMode: PropTypes.bool,
        locale: PropTypes.string.isRequired,
        settingsActions: PropTypes.objectOf(PropTypes.func).isRequired

    }

    handleLocaleToggle(e) {
        e.preventDefault()
        this.props.settingsActions.saveSettings(
            {
                locale: this.props.locale === 'en' ? 'de' : 'en'
            }
        )
    }

    render() {
        const { momentDate, editMode, locale } = this.props


        let dayDate = momentDate.clone().isoWeekday(1) // calculate this weeks mondays date from any day of the week.
        let headers = []
        for ( let i = 0; i < 7; i++ ) {
            headers.push(<div key={i} className="tt-header-day">
                <div className="tt-header-day-name">{dayDate.format('dddd')}</div>
                <div className="tt-header-day-date">{dayDate.format(LOCALE_STRINGS[locale].dateFormat)}</div>
            </div>)
            dayDate.add(1, 'days')
        }

        return <div className="tt-header-row">
            <div className="tt-header-corner">
                {editMode &&
                <IconButton
                    tooltip={LOCALE_STRINGS[locale].changeFrom}
                    iconName={(locale === 'en') ? 'settingspublic' : 'settingslanguage'}
                    dangerLevel={(locale === 'en') ? DANGER_LEVELS.SAFE.hover : DANGER_LEVELS.WARN.hover}
                    onClick={::this.handleLocaleToggle}
                />}
            </div>
            {headers}
        </div>
    }
}