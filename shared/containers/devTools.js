import React from 'react'
// Exported from redux-devtools
import { createDevTools } from 'redux-devtools'
import DockMonitor from 'redux-devtools-dock-monitor'
// Monitors are separate packages, and you can make a custom one
import LogMonitor from 'redux-devtools-log-monitor'

// createDevTools takes a monitor and produces a DevTools component
const DevTools = createDevTools(
    // Monitors are individually adjustable with props.
    // Consult their repositories to learn about those props.
    // Here, we put LogMonitor inside a DockMonitor.
    <DockMonitor toggleVisibilityKey='ctrl-h'
                 changePositionKey='ctrl-q'
                 defaultSize={0.15}>
        <LogMonitor theme='tomorrow'/>
    </DockMonitor>
)

export default DevTools