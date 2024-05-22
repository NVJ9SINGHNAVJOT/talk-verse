import { useEffect } from "react";

const useScrollTrigger = (
  ref: React.RefObject<HTMLDivElement>,
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  stop: boolean,
  resetTrigger: boolean) => {

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
      const scrollPercentage = Math.floor(((clientHeight - scrollTop) / (scrollHeight)) * 100);

      if (scrollPercentage > 85 && !stop) {
        setTrigger((prev) => !prev);
      }
    }

    if (ref.current) {
      ref.current.addEventListener('scroll', handleScrollTrig);
    }

    return () => {
      currReft.removeEventListener('scroll', handleScrollTrig);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, stop, resetTrigger]);
};

export default useScrollTrigger;


