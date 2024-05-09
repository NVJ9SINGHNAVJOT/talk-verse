import { useEffect } from "react";

const useScrollTrigger = (
  ref: React.RefObject<HTMLDivElement>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  loading: boolean,
  setTrigger: React.Dispatch<React.SetStateAction<number>>,
  stop: boolean) => {

  useEffect(() => {
    const currentRef = ref.current; // Store the current ref value

    function handleScroll() {
      if (!ref.current) return;

      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

      if (scrollPercentage >= 90 && !loading && !stop) {
        setLoading(() => true);
        setTrigger((prev) => prev + 1);
      }
    }

    if (ref.current) {
      ref.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };

  }, [ref]);
};

export default useScrollTrigger;


