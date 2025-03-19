export type MvcEventType = 'insert_at' | 'remove_at' | 'set_at';

export interface MVCEvent<T> {
  newArr: Array<T>;
  eventName: MvcEventType;
  index: number;
  previous?: T;
}
