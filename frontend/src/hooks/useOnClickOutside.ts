import { RefObject, useEffect } from 'react';

// Type for the event handler function
type EventHandler = (event: MouseEvent | TouchEvent) => void;

function useOnClickOutside<T extends HTMLElement>(ref: RefObject<T>, handler: EventHandler): void {
    useEffect(() => {
        // Function to call the handler if clicked outside of the referenced element
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        // Add event listeners
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            // Remove event listeners on cleanup
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]); // Only re-run if ref or handler changes
}

export default useOnClickOutside;
