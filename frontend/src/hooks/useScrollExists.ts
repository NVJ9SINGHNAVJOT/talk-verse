import { RefObject, useEffect, useRef } from "react";

const useScrollExists = (
  ref: RefObject<HTMLDivElement>,
  scrollExist: boolean,
  setScrollExist: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // hook must run when component is loaded
  const initial = useRef<boolean>(true);

  useEffect(() => {
    const div = ref.current;
    if (!div) {
      return;
    }
    const checkScrollbar = () => {
      // Check if the div has a scrollbar
      const hasHorizontalScroll = div.scrollWidth > div.clientWidth;
      if (initial.current) {
        setScrollExist(hasHorizontalScroll);
        initial.current = false;
      } else if (hasHorizontalScroll !== scrollExist) {
        setScrollExist(hasHorizontalScroll);
      }
    };

    // Run the check on mount and on window resize
    checkScrollbar();
    window.addEventListener("resize", checkScrollbar);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", checkScrollbar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, scrollExist]);
};

export default useScrollExists;
