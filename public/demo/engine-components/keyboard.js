!function(window, seine, exports) {
  'use strict';

  var Component = seine.Component;

  var NUM_KEYS = 256,
      KEY_CONSTANTS = {
        CANCEL: 3,
        HELP: 6,
        BACKSPACE: 8,
        TAB: 9,
        CLEAR: 12,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAUSE: 19,
        CAPS: 20,
        ESC: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        PRINT_SCREEN: 44,
        INSERT: 45,
        DELETE: 46,
        DIGIT_0: 48,
        DIGIT_1: 49,
        DIGIT_2: 50,
        DIGIT_3: 51,
        DIGIT_4: 52,
        DIGIT_5: 53,
        DIGIT_6: 54,
        DIGIT_7: 55,
        DIGIT_8: 56,
        DIGIT_9: 57,
        SEMICOLON: 59,
        EQUALS: 61,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        CONTEXT_MENU: 93,
        NUMPAD_0: 96,
        NUMPAD_1: 97,
        NUMPAD_2: 98,
        NUMPAD_3: 99,
        NUMPAD_4: 100,
        NUMPAD_5: 101,
        NUMPAD_6: 102,
        NUMPAD_7: 103,
        NUMPAD_8: 104,
        NUMPAD_9: 105,
        DOM_VK_MULTIPLY: 106,
        NUMPAD_ADD: 107,
        NUMPAD_SEPARATOR: 108,
        NUMPAD_SUBTRACT: 109,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        F13: 124,
        F14: 125,
        F15: 126,
        F16: 127,
        F17: 128,
        F18: 129,
        F19: 130,
        F20: 131,
        F21: 132,
        F22: 133,
        F23: 134,
        F24: 135,
        NUM_LOCK: 144,
        SCROLL_LOCK: 145,
        COMMA: 188,
        PERIOD: 190,
        SLASH: 191,
        BACKTICK: 192,
        OPEN_BRACKET: 219,
        BACK_SLASH: 220,
        CLOSE_BRACKET: 221,
        QUOTE: 222,
        META: 224
      };

  var down = new Array(NUM_KEYS),
      released = new Array(NUM_KEYS),
      pressed = new Array(NUM_KEYS);

  window.addEventListener('keydown', function(e) {
    var keycode = e.which;
    if(!down[keycode]) pressed[keycode] = true;
    down[keycode] = true;
  });

  window.addEventListener('keyup', function(e) {
    var keycode = e.which;
    released[keycode] = true;
    down[keycode] = false;
  });

  var keyboardComponent = new Component();
  keyboardComponent.after = function() {
    for(var index = 0, length = NUM_KEYS; index < length; index++) {
      pressed[index] = released[index] = false;
    }
  };

  exports.keyboard = {
    down: function(keycode) { return !!down[keycode]; },
    released: function(keycode) { return !!released[keycode]; },
    pressed: function(keycode) { return !!pressed[keycode]; },
    link: function(engine) { engine.after.push(keyboardComponent); },
    key: KEY_CONSTANTS
  };

}(window, seine, demo);
