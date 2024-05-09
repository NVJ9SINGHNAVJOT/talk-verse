// useScrollToTop.ts

import { useState, useEffect } from 'react';

const useScrollToTop = (targetRef: React.RefObject<HTMLElement>, callback: () => void) => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (targetRef.current) {
        const scrollTop = targetRef.current.scrollTop;
        setIsAtTop(scrollTop === 0);
      }
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [targetRef]);

  useEffect(() => {
    if (isAtTop) {
      callback(); // Call the provided callback when scrollbar reaches the top
    }
  }, [isAtTop, callback]);
};

export default useScrollToTop;


