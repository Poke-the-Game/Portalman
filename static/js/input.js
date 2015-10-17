'use strict'
var Input = function () {}
Input.prototype.states = {}
Input.prototype.dispatchInputEvent = function (source, input, state) {
  if (this.states[input] === state) { return }
  this.states[input] = state

  var inputEvent = new window.CustomEvent(
    'userInput',
    {'detail': {'source': source, 'input': input, 'state': state}}
  )

  window.dispatchEvent(inputEvent)
}

var KeyboardInput = function (map) {
  this.map = map
  window.addEventListener('keydown', function (e) { this._key('down', e) }.bind(this))
  window.addEventListener('keyup', function (e) { this._key('up', e) }.bind(this))
}
KeyboardInput.prototype = new Input()
KeyboardInput.prototype.constructor = KeyboardInput

KeyboardInput.prototype._key = function (state, event) {
  if (this.map[event.keyCode] === undefined) { return }
  this.dispatchInputEvent('keyboard', this.map[event.keyCode], state === 'down')
}

var GamepadInput = function (map) {
  this.map = map
  this._states = {}
  window.addEventListener('gamepadconnected', function (e) {
    console.log('Gamepad ' + e.gamepad.index + ' connected!')
    this._checkState(e.gamepad.index)
  }.bind(this))
}
GamepadInput.prototype = new Input()
GamepadInput.prototype.constructor = KeyboardInput

GamepadInput.prototype._checkState = function (index) {
  var gp = navigator.getGamepads()[index]
  if (gp === undefined) {
    console.log('Gamepad ' + index + ' disconnected!')
    return
  }
  //console.debug('checking', gp)
  if (this._states[gp.index] === undefined) { this._states[gp.index] = {buttons: [], axes: []} }
  for(var i = 0; i < gp.axes.length; i++) {
    if(this._states[gp.index].axes[i] !== undefined && this._states[gp.index].axes[i] !== gp.axes[i])
      this._axisChanged(gp, i, gp.axes[i])
    this._states[gp.index].axes[i] = gp.axes[i]
  }
  for(i = 0; i < gp.buttons.length; i++) {
    if (this._states[gp.index].buttons[i] !== undefined && this._states[gp.index].buttons[i] !== gp.buttons[i].pressed) {
      this._buttonChanged(gp, i, gp.buttons[i].pressed)
    }
    this._states[gp.index].buttons[i] = gp.buttons[i].pressed
  }
  window.setTimeout(function () { this._checkState(index) }.bind(this), 100)
}
GamepadInput.prototype._buttonChanged = function (gamepad, button, state) {
  //console.debug('gamepad button "' + button + '" was ' + (state ? 'pressed' : 'released'))
  if (this.map.buttons[button] === undefined) { return }
  this.dispatchInputEvent('gamepad_' + gamepad.index, this.map.buttons[button], state)
}
GamepadInput.prototype._axisChanged = function (gamepad, axis, state) {
  //console.debug('gamepad axis "' + axis + '" changed to ' + state)
  if (this.map.axes[axis] === undefined) { return }
  this.dispatchInputEvent('gamepad_' + gamepad.index, this.map.axes[axis], state)
}