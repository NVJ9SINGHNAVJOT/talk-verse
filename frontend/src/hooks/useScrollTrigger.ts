import { useEffect } from "react";

export const useScrollTriggerVertical = (
  ref: React.RefObject<HTMLDivElement>,
  direction: "up" | "down",
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  stop: boolean,
  resetTrigger?: boolean,
  loading?: boolean
) => {
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const currReft = ref.current;

    function handleScrollTrig() {
      if (!ref.current) {
        return;
      }

      const { scrollTop, clientHeight, scrollHeight } = ref.current;
      const scrollPercentage = Math.floor(
        ((direction === "up" ? clientHeight - scrollTop : clientHeight + scrollTop) / scrollHeight) * 100
      );

      if (scrollPercentage > 85 && !stop && !loading) {
        setTrigger((prev) => !prev);
      }
    }

    ref.current.addEventListener("scroll", handleScrollTrig);

    return () => {
      currReft.removeEventListener("scroll", handleScrollTrig);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, stop, resetTrigger, loading]);
};

export const useScrollTriggerHorizontal = (
  ref: React.RefObject<HTMLDivElement>,
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  stop: boolean,
  resetTrigger?: boolean,
  loading?: boolean
) => {
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const currReft = ref.current;

    function handleScrollTrig() {
      if (!ref.current) {
        return;
      }

      const { scrollLeft, clientWidth, scrollWidth } = ref.current;
      const scrollPercentage = Math.floor((scrollLeft / (scrollWidth - clientWidth)) * 100);

      if (scrollPercentage > 85 && !stop && !loading) {
        setTrigger((prev) => !prev);
      }
    }

    ref.current.addEventListener("scroll", handleScrollTrig);

    return () => {
      currReft.removeEventListener("scroll", handleScrollTrig);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, stop, resetTrigger, loading]);
};
