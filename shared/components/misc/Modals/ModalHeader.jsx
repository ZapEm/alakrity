import * as React from 'react'
import * as ImmutablePropTypes from 'react-immutable-proptypes'
import IconButton from '../IconButton'

export default class ModalHeader extends React.Component {

    static propTypes = {
        modalsOM: ImmutablePropTypes.orderedMap.isRequired,
        currentModalKey: React.PropTypes.string.isRequired,
        handleNext: React.PropTypes.func.isRequired,
        handleBack: React.PropTypes.func.isRequired
    }

    render() {
        const { modalsOM, currentModalKey, handleNext, handleBack } = this.props

        const modal = modalsOM.get(currentModalKey)
        const multiple = modalsOM.size > 1

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
                }}>{(multiple ? `(${modalsOM.keySeq().keyOf(currentModalKey) + 1}/${modalsOM.size}) ` :
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