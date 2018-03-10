import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchBoard, endDrag, updatePin, updateBoardPin } from '../store'
import { Pin } from './'

export class Board extends Component {
  componentDidMount() {
    if (this.props.match) {
      this.props.loadInitialData(this.props.match.params.id)
    }
  }

  handleMouseDown = (event) => {
    return event
  }

  handleMouseUp = (event) => {
    const { activePin, isDragging, movePin } = this.props
    const borderSize = 20
    const top = 60
    const bottom = window.innerHeight - 70
    const left = 20
    const right = window.innerWidth - 55

    if (isDragging) {
      activePin.xPos = event.clientX - borderSize
      activePin.xPos = (activePin.xPos < left) ? left : activePin.xPos
      activePin.xPos = (activePin.xPos > right) ? right : activePin.xPos

      activePin.yPos = event.clientY - borderSize
      activePin.yPos = (activePin.yPos < top) ? top : activePin.yPos
      activePin.yPos = (activePin.yPos > bottom) ? bottom : activePin.yPos

      movePin(activePin)
    }
  }

  render() {
    const { board } = this.props
    const { pins } = board

    return (
      <div id="wrapper">
        <div id="header">
          <h1><img src="/img/pushpin-small.png" alt="push pin" />{board.title}</h1>
        </div>
        <div
          id="board-canvas"
          onMouseDown={this.handleMouseDown}
          onDragEnd={this.handleMouseUp}
        >
          {pins && pins.map(pin => {
            return <Pin pin={pin} key={`pin-${pin.id}`} />
          })}
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    board: state.board,
    activePin: state.pin,
    isDragging: state.pin.isDragging
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadInitialData(boardId) {
      dispatch(fetchBoard(boardId))
    },
    movePin(activePin) {
      dispatch(updatePin(activePin))
      dispatch(updateBoardPin(activePin))
      dispatch(endDrag())
    }
  }
}

export default connect(mapState, mapDispatch)(Board)

Board.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string
  })
}
