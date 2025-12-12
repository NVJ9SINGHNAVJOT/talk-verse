import { type RefObject, useEffect } from "react";

type EventHandler = (event: MouseEvent | TouchEvent) => void;

export const useOnClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: EventHandler,
  excludeDivRef?: RefObject<T> // Optional reference to the specific div you want to exclude
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      // Check if the click target is inside the excluded div (if provided)
      if (excludeDivRef && excludeDivRef.current && excludeDivRef.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
};

export const useOnClickOutsideBlog = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: EventHandler,
  sideMenu: boolean,
  excludeDivRef?: RefObject<T> // Optional reference to the specific div you want to exclude
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      // Check if the click target is inside the excluded div (if provided)
      if (excludeDivRef && excludeDivRef.current && excludeDivRef.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    if (sideMenu) {
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
    }

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, sideMenu]);
};
