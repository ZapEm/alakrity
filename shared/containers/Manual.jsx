import React from 'react'
import Mascot from '../components/misc/mascot/StaticMascot'

export default class Login extends React.Component {

    render() {
        const imgUrl = (typeof window !== 'undefined') ? require('../static/img/statistics.png') : false

        return (
            <div className="manual">
                <div className="row manual-row">
                    <div className="col px900">
                        <div className="welcome w3-card-4 w3-padding w3-border w3-border-theme w3-round-large"
                             style={{ minHeight: '600px' }}
                        >
                            <div className="w3-padding w3-text-theme">
                                <div>
                                    TEXT
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="sidebar" className="col sidebar manual-row">
                        <div className="login-sidebar w3-card-4 w3-padding w3-border w3-border-theme w3-round-large">
                            <h2 className="w3-text-theme w3-center">Alakrity Manual</h2>
                            {imgUrl &&
                            <Mascot
                                imgUrl={imgUrl}
                            />}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
