import { useEffect } from "react";

const useScrollTrigger = (
  ref: React.RefObject<HTMLDivElement>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  loading: boolean,
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  stop: boolean) => {

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const currReft = ref.current;
    function handleScrollTrig() {
      if (!ref.current) return;

      const { scrollTop, clientHeight, scrollHeight } = ref.current;
      const scrollPercentage = Math.floor(((clientHeight - scrollTop) / (scrollHeight)) * 100);

      if (scrollPercentage > 85 && !loading && !stop) {
        setLoading(() => true);
        setTimeout(() => {
          setTrigger((prev) => !prev);
        }, 1000);
      }
    }

    if (ref.current) {
      ref.current.addEventListener('scroll', handleScrollTrig);
    }

    return () => {
      currReft.removeEventListener('scroll', handleScrollTrig);
    };

  }, [ref, loading, stop]);
};

export default useScrollTrigger;


