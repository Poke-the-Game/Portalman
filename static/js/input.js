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

var KeyboardInput = function (_map) {
  this.map = _map
  window.addEventListener('keydown', function (e) { this._key('down', e) }.bind(this))
  window.addEventListener('keyup', function (e) { this._key('up', e) }.bind(this))
}
KeyboardInput.prototype = new Input()
KeyboardInput.prototype.constructor = KeyboardInput

KeyboardInput.prototype._key = function (state, event) {
  if (this.map[event.keyCode] === undefined) { return }
  this.dispatchInputEvent('keyboard', this.map[event.keyCode], state === 'down')
}
