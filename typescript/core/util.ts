'use strict';

export function backwards<T>(array: T[], callback: (el: T) => any) {
  for(var i = array.length - 1; i >= 0; i--) {
    callback(array[i]);
  }
}

export function each<T>(array: T[], callback: (el: T) => any) {
  for(var i = 0, l = array.length; i < l; i++) {
    callback(array[i]);
  }
}

export function safeEach<T>(array: T[], callback: (el: T) => any) {
  for(var i = 0, l = array.length; i < l; i++) {
    var curr = array[i];
    if(curr != null) callback(curr);
  }
}

export function remove<T>(array: T[], item: T) {
  for(var i = 0, l = array.length; i < l; i++) {
    if(array[i] === item) {
      array.splice(i, 1);
      return;
    }
  }
}

export function nullify<T>(array: T[], item: T) {
  for(var i = 0, l = array.length; i < l; i++) {
    if(array[i] === item) {
      array[i] = null;
      return;
    }
  }
}

export function compact<T>(array: T[]) {
  var start = -1,
      runLength = 0,
      inRun = false;

  for(var i = 0, l = array.length; i < l; i++) {
    if(array[i] == null) {
      if(!inRun) {
        inRun = true;
        start = i;
      }
    } else if(inRun) {
      runLength = i - start;
      array.splice(start, runLength);
      i -= runLength;
      l -= runLength;
      inRun = false;
    }
  }

  // Clean up at end
  if(inRun) array.splice(start, i - start);
}

export interface Constructor {
  (): void;
}

export function extend(Klass: Constructor, OtherKlass: Constructor) {
  var Temp: any = function() {};
  Temp.prototype = Klass.prototype;
  OtherKlass.prototype = new Temp();
  OtherKlass.prototype.constructor = OtherKlass;
  return OtherKlass;
}

export interface NumericMap<V> {
  [ key: number ]: V;
}

export interface StringMap<V> {
  [ key: string]: V;
}
