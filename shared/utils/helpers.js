import * as Immutable from 'immutable'
import tinycolor from 'tinycolor2'
import { SPECIAL_PROJECTS } from './constants'

/**
 * Extract and adjust the project colors then return as immutable map
 * with projectID keys and 'normal', 'light' and 'dark' sub keys.
 * @param projectList - immutable list
 * @returns {any} - immutable map with normal, light and dark colors per projectID.
 */
export function getProjectColorMap(projectList) {
    let colorMap = {}
    projectList.forEach(project => {
            const color = project.get('color')
            colorMap[project.get('id')] = {
                normal: color,
                light: tinycolor(color).brighten(10).toHexString(),
                dark: tinycolor(color).brighten(-35).toHexString()
            }
        }
    )

    // Object.entries(SPECIAL_PROJECTS).forEach(project => {
    //         colorMap[project.key] = {
    //             normal: project.normal,
    //             light: project.light,
    //             dark: project.dark
    //         }
    //     }
    // )

    Immutable.fromJS(SPECIAL_PROJECTS).forEach(project => {
                colorMap[project.get('key')] = {
                    normal: project.get('normal'),
                    light: project.get('light'),
                    dark: project.get('dark')
                }
            }
        )

    return Immutable.fromJS(colorMap)
}