// generates a new Universally unique identify (UUID)
// the UUID is used to identify each of the tasks
export function uuid(): string {
  'use strict';
  /*jshint bitwise:false */
  let i: number;
  let random: number;
  let uuid: string = '';
/* tslint:disable */
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }

  return uuid;
}
