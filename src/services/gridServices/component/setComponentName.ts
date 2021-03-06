import * as d3 from 'd3'
import { getComponentWidth } from './getComponentWidth'
import { updateComponentPosition } from './updateComponentPosition'

/**
 * Set the name of the selected component
 * @param theCompId
 * @param name the name of the component, can be the default name or a custom name
 * @param title the name by default of the component
 */
export function setComponentName (theCompId: string, name: string, title: string, dataLoadingType: string,
  transferShowIO: boolean, svgGridSize: number, svgGridBorderWidth: number): void {
  d3.select('#rect-' + theCompId).attr('width', getComponentWidth(name, title, theCompId, transferShowIO))
  d3.select('#name-text-' + theCompId).text(name)
  updateComponentPosition(theCompId, null, null, dataLoadingType, transferShowIO, svgGridSize, svgGridBorderWidth)
}
