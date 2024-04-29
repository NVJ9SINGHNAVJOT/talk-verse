import React, { useEffect, RefObject } from 'react';

type SetCountFunction = React.Dispatch<React.SetStateAction<number>>;

const useCountOnView = (
    ref: RefObject<HTMLDivElement>,
    setCount: SetCountFunction
): void => {
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;
        const observer = new IntersectionObserver(
            ([entry]) => {
                // When the div comes into view, start incrementing the count
                if (entry.isIntersecting) {
                    intervalId = setInterval(() => {
                        setCount((prevCount) => {
                            if (prevCount >= 69) {
                                clearInterval(intervalId as NodeJS.Timeout);
                            }
                            return prevCount >= 70 ? 70 : prevCount + 1;
                        });
                    }, 50); // Increment 
                }
            },
            { threshold: 1.0 } // Trigger when the div is fully in view
        );

        // Start observing the ref
        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };

    }, [ref, setCount]);
};

export default useCountOnView;