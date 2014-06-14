'use strict';

export function each<T>(array: T[], callback: (el: T) => any) {
  for(var i = 0, l = array.length; i < l; i++) {
    callback(array[i]);
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
