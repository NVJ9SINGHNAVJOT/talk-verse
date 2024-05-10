import { useEffect } from 'react';

function useScrollToBottom(ref: React.RefObject<HTMLDivElement>) {
    useEffect(() => {
        const scrollToBottom = () => {
            if (ref.current) {
                ref.current?.scrollIntoView({ behavior: 'smooth' });
            }
        };

        // Scroll to bottom when the component mounts
        scrollToBottom();

        // Listen for user scroll events
        const handleScroll = () => {
            const isAtBottom = ref.current
                ? ref.current.scrollTop + ref.current.clientHeight === ref.current.scrollHeight
                : false;

            if (isAtBottom) {
                // User scrolled to the bottom, so we'll keep it there
                scrollToBottom();
            }
        };

        // Attach the scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [ref]);
}

export default useScrollToBottom;
