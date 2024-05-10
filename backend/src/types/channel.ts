class Queue<T> {
    private elements: Record<number, T> = {};
    private head: number = 0;
    private tail: number = 0;

    enqueue(element: T): void {
        this.elements[this.tail] = element;
        this.tail++;
    }

    dequeue(): T | undefined {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }

    peek(): T | undefined {
        return this.elements[this.head];
    }

    get length(): number {
        return this.tail - this.head;
    }

    get isEmpty(): boolean {
        return this.length === 0;
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
            this._locked.set(false);
        }
    }
}

export default Channel;