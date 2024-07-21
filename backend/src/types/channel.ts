class Queue<T> {
  private _elements: Record<number, T> = {};
  private _head: number = 0;
  private _tail: number = 0;

  enqueue(element: T): void {
    this._elements[this._tail] = element;
    this._tail++;
  }

  dequeue(): T | undefined {
    const item = this._elements[this._head];
    delete this._elements[this._head];
    this._head++;
    return item;
  }

  peek(): T | undefined {
    return this._elements[this._head];
  }

  get length(): number {
    return this._tail - this._head;
  }

  get isEmpty(): boolean {
    return this._head - this._tail === 0;
  }

  resetQueue(): void {
    this._head = 0;
    this._tail = 0;
  }
}

class AtomicBoolean {
  private _value: boolean;

  constructor(initialValue: boolean) {
    this._value = initialValue;
  }

  compareAndSet(expected: boolean, newValue: boolean): boolean {
    if (this._value === expected) {
      this._value = newValue;
      return true;
    }
    return false;
  }

  set(newValue: boolean): void {
    this._value = newValue;
  }
}

// mutex for messages
class Channel {
  private _locked = new AtomicBoolean(false);
  private _queue: Queue<() => void> = new Queue<() => void>();

  async lock(): Promise<void> {
    if (this._locked.compareAndSet(false, true)) {
      // Lock acquired
      return;
    }
    await new Promise<void>((resolve) => {
      this._queue.enqueue(resolve);
    });
  }

  unlock(): void {
    if (!this._queue.isEmpty) {
      const next = this._queue.dequeue();
      next?.();
    } else {
      this._queue.resetQueue();
      this._locked.set(false);
    }
  }
}

export default Channel;
