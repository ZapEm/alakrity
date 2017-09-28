import PropTypes from 'prop-types'
import React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import IconButton from '../IconButton'

export default class ModalHeader extends React.Component {

    static propTypes = {
        modalsList: ImmutablePropTypes.list.isRequired,
        modalIndex: PropTypes.number.isRequired,
        handleNext: PropTypes.func.isRequired,
        handleBack: PropTypes.func.isRequired
    }

    render() {
        const { modalsList, modalIndex, handleNext, handleBack } = this.props

        const modal = modalsList.get(modalIndex)
        const multiple = modalsList.size > 1

        const headerTitle = modal && modal.headerTitle ? modal.headerTitle : ''

        return (
            <header
                className="modal-header w3-large w3-theme"
            >
                {multiple &&
                <IconButton
                    iconName={'navigate_before'}
                    tooltip={'Back'}
                    onClick={handleBack}
                />}
                <div style={{
                    textAlign: 'center',
                    width: '100%'
                }}>{(multiple ? `(${modalIndex + 1}/${modalsList.size}) ` :
                     '') + headerTitle}</div>
                {multiple &&
                <IconButton
                    iconName={'navigate_next'}
                    tooltip={'Next'}
                    onClick={handleNext}
                />}
            </header>
        )
    }

}