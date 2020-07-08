import * as d3 from 'd3'
import { lineFunction, getLineData } from '../gridServices/addLink'
import { FDComponent } from '../../models/FDComponent'
import { transfertData } from './transfertData'
import { SVG_GRID_BORDER_WIDTH, TRANSFER_TYPE } from '../../config'

/**
 * Create an animation for data transfer for each outputs of a component to his childrens.
 * @param id the component's id
 */
export function makeComponentTransferData (id: string): void {
  const links = document.getElementsByClassName('link-' + id)
  for (let i = 0; i < links.length; ++i) {
    const output = '#output-' + links[i].getAttribute('data-output')
    const intput = '#input-' + links[i].getAttribute('data-input')
    if (output.includes(id)) {
      transfertData(output, intput, TRANSFER_TYPE)
    }
  }
}

export function toggleComponentLoading (id: string): void {
  if (!document.getElementById('component-loading-style')) {
    d3.select('#conception-grid').append('style').attr('id', 'component-loading-style').html('@keyframes load_spin {\n' +
        '\t0% { transform: rotate(0deg); }\n' +
        '\t100% { transform: rotate(359deg); }\n' +
        '}\n' +
        '.loading {\n' +
        '\tanimation: load_spin 2s linear infinite;\n' +
        '}\n')
  }
  const icon = d3.select('#icon-' + id)
  const isLoading = icon.attr('class').includes('loading')
  icon.text(isLoading ? icon.attr('data-icon') : '\uf013')
  icon.attr('class', isLoading ? icon.attr('class').replace(' loading', '') : icon.attr('class') + ' loading')
}

/**
 * Adds a new component into '#conception-grid-svg' and set his listeners.
 * @param mouse position of the cursor in the plan
 * @param fdCompToDrop the FDComponent to drop
 * @param registerComponent function who register the component in componentList of ConceptionGrid's Vue and return his unique id
 * @param openModal function call by clicking on the component
 */
export function addComponentIntoGrid (mouse: [number, number], fdCompToDrop: FDComponent, registerComponent: Function, openModal: Function): void {
  const x = mouse[0]
  const y = mouse[1]
  const inputCount = fdCompToDrop.getInput()
  const outputCount = fdCompToDrop.getOutput()
  const compHeight = Math.max(50 + (Math.max(inputCount, outputCount) - 1) * 15, 65)
  const compWidth = 75 + fdCompToDrop.getTitle().length * 9
  const svgGridBorder = SVG_GRID_BORDER_WIDTH
  const svgMax = 5000
  const newId: string = registerComponent(fdCompToDrop)
  const g = d3.select('#conception-grid-svg')
    .append('g')
    .attr('id', 'comp-' + newId)
    .attr('stroke-width', 1.5)
    .attr('style', 'cursor:pointer;')
    .attr('transform', d3.select('#conception-grid-svg').select('g').attr('transform'))

  const rectPlaceX = (x: number, theCompWidth: number) => {
    if (x < (svgGridBorder + (theCompWidth / 2))) {
      return 10
    } else if (x > (svgMax - svgGridBorder - (theCompWidth / 2))) {
      return svgMax - svgGridBorder - theCompWidth
    }
    return x - (theCompWidth / 2)
  }
  const rectPlaceY = (y: number, theCompHeight: number) => {
    if (y < (svgGridBorder + (theCompHeight / 2))) {
      return svgGridBorder
    } else if (y > (svgMax - svgGridBorder - (theCompHeight / 2))) {
      return svgMax - svgGridBorder - theCompHeight
    }
    return y - (theCompHeight / 2)
  }
  const titlePlaceX = (x: number, theCompWidth: number) => {
    if (x < (svgGridBorder + (theCompWidth / 2))) {
      return svgGridBorder + 65
    } else if (x > (svgMax - svgGridBorder - (theCompWidth / 2))) {
      return svgMax + 65 - svgGridBorder - theCompWidth
    }
    return x - (theCompWidth / 2) + 65
  }
  const titlePlaceY = (y: number, theCompHeight: number) => {
    if (y < (svgGridBorder + (theCompHeight / 2))) {
      return svgGridBorder - 8 + (theCompHeight / 2)
    } else if (y > (svgMax - svgGridBorder - (theCompHeight / 2))) {
      return svgMax - 8 - svgGridBorder - (theCompHeight / 2)
    }
    return y - 8
  }
  const typePlaceX = (x: number, theCompWidth: number) => {
    if (x < (svgGridBorder + (theCompWidth / 2))) {
      return svgGridBorder + 65
    } else if (x > (svgMax - svgGridBorder - (theCompWidth / 2))) {
      return svgMax + 65 - svgGridBorder - theCompWidth
    }
    return x - (theCompWidth / 2) + 65
  }
  const typePlaceY = (y: number, theCompHeight: number) => {
    if (y < (svgGridBorder + (theCompHeight / 2))) {
      return svgGridBorder + 7 + (theCompHeight / 2)
    } else if (y > (svgMax - svgGridBorder - (theCompHeight / 2))) {
      return svgMax + 7 - svgGridBorder - (theCompHeight / 2)
    }
    return y + 7
  }
  // io for input/output
  const ioPlaceX = (x: number, theCompWidth: number) => {
    if (x < (svgGridBorder + (theCompWidth / 2))) {
      return svgGridBorder + 65
    } else if (x > (svgMax - svgGridBorder - (theCompWidth / 2))) {
      return svgMax + 65 - svgGridBorder - theCompWidth
    }
    return x - (theCompWidth / 2) + 65
  }
  const ioPlaceY = (y: number, theCompHeight: number) => {
    if (y < (svgGridBorder + (theCompHeight / 2))) {
      return svgGridBorder + 25 + (theCompHeight / 2)
    } else if (y > (svgMax - svgGridBorder - (theCompHeight / 2))) {
      return svgMax + 25 - svgGridBorder - (theCompHeight / 2)
    }
    return y + 25
  }
  const iconPlaceX = (x: number, theCompWidth: number) => {
    if (x < (svgGridBorder + (theCompWidth / 2))) {
      return svgGridBorder + 20
    } else if (x > (svgMax - svgGridBorder - (theCompWidth / 2))) {
      return svgMax + 20 - svgGridBorder - theCompWidth
    }
    return x - (theCompWidth / 2) + 20
  }
  const iconPlaceY = (y: number, theCompHeight: number) => {
    if (y < (svgGridBorder + (theCompHeight / 2))) {
      return svgGridBorder + 8 + (theCompHeight / 2)
    } else if (y > (svgMax - svgGridBorder - (theCompHeight / 2))) {
      return svgMax + 8 - svgGridBorder - (theCompHeight / 2)
    }
    return y + 8
  }
  const triggerPlaceX = (x: number, theCompWidth: number) => {
    if (x < (svgGridBorder + (theCompWidth / 2))) {
      return 10 + (theCompWidth / 2)
    } else if (x > (svgMax - svgGridBorder - (theCompWidth / 2))) {
      return svgMax - svgGridBorder - (theCompWidth / 2)
    }
    return x
  }
  const triggerPlaceY = (y: number, theCompHeight: number) => {
    if (y < (svgGridBorder + (theCompHeight / 2))) {
      return svgGridBorder - 10
    } else if (y > (svgMax - svgGridBorder - (theCompHeight / 2))) {
      return svgMax - 10 - svgGridBorder - theCompHeight
    }
    return y - 10 - (theCompHeight / 2)
  }

  const getTriggerTrianglePoints = (x: number, theCompWidth: number, y: number, theCompHeight: number) => {
    const xPos = triggerPlaceX(x, theCompWidth)
    const yPos = triggerPlaceY(y, theCompHeight)
    return (xPos - 10) + ',' + yPos + ' ' + (xPos + 10) + ',' + yPos + ' ' + xPos + ',' + (yPos + 20)
  }
  const inputCirclePlaceX = (x: number, theCompWidth: number) => {
    if (x < (svgGridBorder + (theCompWidth / 2))) {
      return svgGridBorder
    } else if (x > (svgMax - svgGridBorder - (theCompWidth / 2))) {
      return svgMax - svgGridBorder - theCompWidth
    }
    return x - (theCompWidth / 2)
  }
  const inputCirclePlaceY = (y: number, theCompHeight: number, index: number, count: number) => {
    if (y < (svgGridBorder + (theCompHeight / 2))) {
      return svgGridBorder + (theCompHeight / 2) + (index * 20) - (count - 1) * 10
    } else if (y > (svgMax - svgGridBorder - (theCompHeight / 2))) {
      return svgMax - svgGridBorder - (theCompHeight / 2) + (index * 20) - (count - 1) * 10
    }
    return y + (index * 20) - (count - 1) * 10
  }
  const outputCirclePlaceX = (x: number, theCompWidth: number) => {
    if (x < (svgGridBorder + (theCompWidth / 2))) {
      return svgGridBorder + theCompWidth
    } else if (x > (svgMax - svgGridBorder - (theCompWidth / 2))) {
      return svgMax - svgGridBorder
    }
    return x + (theCompWidth / 2)
  }
  const outputCirclePlaceY = (y: number, theCompHeight: number, index: number, count: number) => {
    if (y < (svgGridBorder + (theCompHeight / 2))) {
      return svgGridBorder + (theCompHeight / 2) + (index * 20) - (count - 1) * 10
    } else if (y > (svgMax - svgGridBorder - (theCompHeight / 2))) {
      return svgMax - svgGridBorder - (theCompHeight / 2) + (index * 20) - (count - 1) * 10
    }
    return y + (index * 20) - (count - 1) * 10
  }

  g.append('rect')
    .attr('id', 'rect-' + newId)
    .attr('class', 'fdcomp draggable')
    .attr('data-id', newId)
    .attr('stroke', 'black')
    .attr('fill', fdCompToDrop.getColor())
    .attr('height', compHeight)
    .attr('width', compWidth)
    .attr('data-input', inputCount)
    .attr('data-output', outputCount)
    .attr('rx', 5)
    .attr('x', rectPlaceX(x, compWidth))
    .attr('y', rectPlaceY(y, compHeight))
    .on('click', () => {
      openModal(newId)
    })

  g.append('text')
    .attr('id', 'title-text-' + newId)
    .attr('class', 'draggable unselectable-text')
    .attr('data-id', newId)
    .attr('fill', 'black')
    .style('font-size', '14px')
    .html(fdCompToDrop.getTitle())
    .attr('x', titlePlaceX(x, compWidth))
    .attr('y', titlePlaceY(y, compHeight))
    .on('click', () => {
      openModal(newId)
    })

  g.append('text')
    .attr('id', 'type-text-' + newId)
    .attr('class', 'draggable unselectable-text')
    .attr('data-id', newId)
    .attr('fill', 'black')
    .style('font-size', '12px')
    .html(fdCompToDrop.getTitle())
    .attr('x', typePlaceX(x, compWidth))
    .attr('y', typePlaceY(y, compHeight))
    .on('click', () => {
      openModal(newId)
    })
  g.append('text')
    .attr('id', 'icon-' + newId)
    .attr('class', 'draggable unselectable-text icon')
    .attr('data-id', newId)
    .attr('data-icon', fdCompToDrop.getIcon())
    .attr('fill', 'black')
    .style('font', '900 normal normal 24px \'Font Awesome 5 Free\'')
    .text(fdCompToDrop.getIcon())
    .attr('x', iconPlaceX(x, compWidth))
    .attr('y', iconPlaceY(y, compHeight))
    .style('transform-origin', (iconPlaceX(x, compWidth) + 12) + 'px ' + (iconPlaceY(y, compHeight) - 9) + 'px')
    .on('click', function () {
      openModal(newId)
    })

  g.append('text')
    .attr('id', 'io-' + newId)
    .attr('class', 'draggable unselectable-text')
    .attr('data-id', newId)
    .attr('fill', 'black')
    .style('font', '900 normal normal 12px \'Font Awesome 5 Free\'')
    .text('IO: 0B \uf061 0B')
    .attr('x', ioPlaceX(x, compWidth))
    .attr('y', ioPlaceY(y, compHeight))
    .on('click', () => {
      openModal(newId)
    })

  if (fdCompToDrop.isClickable()) {
    g.append('polygon')
      .attr('id', 'trigger-' + newId)
      .attr('class', 'draggable')
      .attr('points', getTriggerTrianglePoints(x, compWidth, y, compHeight))
      .attr('data-id', newId)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .on('click', () => {
        console.log('Component activated!')
        makeComponentTransferData(newId)
      })
  }

  for (let i = 0; i < inputCount; ++i) {
    g.append('circle')
      .attr('id', 'input-' + i + '-' + newId)
      .attr('class', 'input connector input-' + newId)
      .attr('r', 7)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('data-index', i)
      .attr('data-id', newId)
      .attr('cx', inputCirclePlaceX(x, compWidth))
      .attr('cy', inputCirclePlaceY(y, compHeight, i, inputCount))
  }
  for (let i = 0; i < outputCount; ++i) {
    g.append('circle')
      .attr('id', 'output-' + i + '-' + newId)
      .attr('class', 'output connector output-' + newId)
      .attr('r', 7)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('data-index', i)
      .attr('data-id', newId)
      .attr('cx', outputCirclePlaceX(x, compWidth))
      .attr('cy', outputCirclePlaceY(y, compHeight, i, outputCount))
  }

  const dragCompHandler = d3.drag()
    .on('drag', function () {
      const theCompId = d3.select(this).attr('data-id')
      const theCompWidth = Number.parseInt(d3.select('#rect-' + theCompId).attr('width'))
      const theCompHeight = Number.parseInt(d3.select('#rect-' + theCompId).attr('height'))
      const theCompInputCount = Number.parseInt(d3.select('#rect-' + theCompId).attr('data-input'))
      const theCompOutputCount = Number.parseInt(d3.select('#rect-' + theCompId).attr('data-output'))

      const svg: HTMLElement | null = document.getElementById('conception-grid-svg')
      if (svg?.lastElementChild?.getAttribute('id') !== 'comp-' + theCompId) {
        d3.select('#comp-' + theCompId).raise()
      }

      d3.select('#rect-' + theCompId)
        .style('opacity', 0.5)
        .attr('x', rectPlaceX(d3.event.x, theCompWidth))
        .attr('y', rectPlaceY(d3.event.y, theCompHeight))

      d3.select('#title-text-' + theCompId)
        .attr('x', titlePlaceX(d3.event.x, theCompWidth))
        .attr('y', titlePlaceY(d3.event.y, theCompHeight))

      d3.select('#type-text-' + theCompId)
        .attr('x', typePlaceX(d3.event.x, theCompWidth))
        .attr('y', typePlaceY(d3.event.y, theCompHeight))

      d3.select('#icon-' + theCompId)
        .attr('x', iconPlaceX(d3.event.x, theCompWidth))
        .attr('y', iconPlaceY(d3.event.y, theCompHeight))
        .style('transform-origin', (iconPlaceX(d3.event.x, theCompWidth) + 12) + 'px ' + (iconPlaceY(d3.event.y, theCompHeight) - 9) + 'px')

      d3.select('#io-' + theCompId)
        .attr('x', ioPlaceX(d3.event.x, theCompWidth))
        .attr('y', ioPlaceY(d3.event.y, theCompHeight))

      d3.select('#trigger-' + theCompId)
        .attr('points', getTriggerTrianglePoints(d3.event.x, theCompWidth, d3.event.y, theCompHeight))

      for (let i = 0; i < theCompInputCount; ++i) {
        d3.select('#input-' + i + '-' + theCompId)
          .attr('cx', inputCirclePlaceX(d3.event.x, theCompWidth))
          .attr('cy', inputCirclePlaceY(d3.event.y, theCompHeight, i, theCompInputCount))
      }

      for (let i = 0; i < theCompOutputCount; ++i) {
        d3.select('#output-' + i + '-' + theCompId)
          .attr('cx', outputCirclePlaceX(d3.event.x, theCompWidth))
          .attr('cy', outputCirclePlaceY(d3.event.y, theCompHeight, i, theCompOutputCount))
      }

      d3.selectAll('.link-' + theCompId).each(function () {
        const input = d3.select(this).attr('data-input')
        const output = d3.select(this).attr('data-output')
        const source: [number, number] =
                    [Number.parseInt(d3.select('#output-' + output).attr('cx')),
                      Number.parseInt(d3.select('#output-' + output).attr('cy'))]
        const target: [number, number] =
                    [Number.parseInt(d3.select('#input-' + input).attr('cx')),
                      Number.parseInt(d3.select('#input-' + input).attr('cy'))]

        d3.select(this)
          .datum(getLineData(source, target, false))
          .attr('d', lineFunction)
      })
    })
    .on('end', function () {
      d3.selectAll('rect').style('opacity', 1)
    })

  dragCompHandler(d3.select('#conception-grid-svg').selectAll('.draggable'))
}
