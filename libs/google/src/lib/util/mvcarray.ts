import { fromEventPattern, Observable } from 'rxjs';

import { MVCEvent } from '@ng-maps/core';

export function createMVCEventObservable<T>(
  array: google.maps.MVCArray<T>,
): Observable<MVCEvent<T>> {
  const eventNames = ['insert_at', 'remove_at', 'set_at'];
  return fromEventPattern(
    (handler) =>
      eventNames.map((eventName) =>
        array.addListener(eventName, (index: number, previous?: T) =>
          handler.apply(array, [
            {
              newArr: array.getArray(),
              eventName,
              index,
              previous,
            } as MVCEvent<T>,
          ]),
        ),
      ),
    (_handler, evListeners: Array<google.maps.MapsEventListener>) =>
      evListeners.forEach((evListener) => evListener.remove()),
  );
}

export class MvcArrayMock<T> implements google.maps.MVCArray<T> {
  private vals: Array<T> = [];
  private listeners: {
    remove_at: Array<(i: number, r: T) => void>;
    insert_at: Array<(i: number) => void>;
    set_at: Array<(i: number, val: T) => void>;
  } = {
    remove_at: [],
    insert_at: [],
    set_at: [],
  };
  clear(): void {
    for (let i = this.vals.length - 1; i >= 0; i--) {
      this.removeAt(i);
    }
  }
  getArray(): Array<T> {
    return [...this.vals];
  }
  getAt(i: number): T {
    return this.vals[i];
  }
  getLength(): number {
    return this.vals.length;
  }
  insertAt(i: number, elem: T): void {
    this.vals.splice(i, 0, elem);
    this.listeners.insert_at.forEach((listener) => listener(i));
  }
  pop(): T {
    const deleted = this.vals.pop();
    if (!deleted) {
      throw new Error('pop() called on empty array');
    }
    this.listeners.remove_at.forEach((listener) =>
      listener(this.vals.length, deleted),
    );
    return deleted;
  }
  push(elem: T): number {
    this.vals.push(elem);
    this.listeners.insert_at.forEach((listener) =>
      listener(this.vals.length - 1),
    );
    return this.vals.length;
  }
  removeAt(i: number): T {
    const deleted = this.vals.splice(i, 1)[0];
    this.listeners.remove_at.forEach((listener) => listener(i, deleted));
    return deleted;
  }
  setAt(i: number, elem: T): void {
    const deleted = this.vals[i];
    this.vals[i] = elem;
    this.listeners.set_at.forEach((listener) => listener(i, deleted));
  }
  forEach(callback: (elem: T, i: number) => void): void {
    this.vals.forEach(callback);
  }
  addListener(
    eventName: 'remove_at' | 'insert_at' | 'set_at',
    handler: (...args: Array<any>) => void,
  ): google.maps.MapsEventListener {
    const listenerArr = this.listeners[eventName];
    listenerArr.push(handler);
    return {
      remove: () => {
        listenerArr.splice(listenerArr.indexOf(handler), 1);
      },
    };
  }

  bindTo(): never {
    throw new Error('Not implemented');
  }
  changed(): never {
    throw new Error('Not implemented');
  }
  get(): never {
    throw new Error('Not implemented');
  }
  notify(): never {
    throw new Error('Not implemented');
  }
  set(): never {
    throw new Error('Not implemented');
  }
  setValues(): never {
    throw new Error('Not implemented');
  }
  unbind(): never {
    throw new Error('Not implemented');
  }
  unbindAll(): never {
    throw new Error('Not implemented');
  }
}
