'use strict';

import util = require('./util');

export interface Callback<T> {
  (object: T) : void;
}

export class Emitter<T> {
  private _handlers: { [s: string]: Callback<T>[] } = {};

  constructor(...events: string[]) {
    util.each(events, (event: string) => {
      this._handlers[event] = [];
    })
  }

  on(event: string, callback: Callback<T>) {
    this._handlers[event].push(callback);
  }

  off(event: string, callback: Callback<T>) {
    util.remove(this._handlers[event], callback);
  }

  trigger(event: string, object: T) {
    util.each(this._handlers[event], (callback: Callback<T>) => {
      callback(object);
    });
  }
}
