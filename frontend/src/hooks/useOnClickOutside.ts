import { RefObject, useEffect } from 'react';

// eslint-disable-next-line no-unused-vars
type EventHandler = (event: MouseEvent | TouchEvent) => void;

function useOnClickOutside<T extends HTMLElement>(
    ref: RefObject<T>,
    handler: EventHandler,
    excludeDivRef?: RefObject<T> // Optional reference to the specific div you want to exclude
): void {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }

            // Check if the click target is inside the excluded div (if provided)
            if (excludeDivRef?.current && excludeDivRef.current.contains(event.target as Node)) {
                return;
            }

            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler, excludeDivRef]);
}

export default useOnClickOutside;
