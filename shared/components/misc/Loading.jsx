import React from 'react'
import Spinner from './Spinner'


export default function Loading() {
    return (
        <div className="loading-component">
            <Spinner status={'WORKING'}/>
        </div>
    )
}