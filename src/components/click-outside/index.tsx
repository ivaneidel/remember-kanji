import { useEffect, useRef, JSX } from "react";

type ClickOutsideProps = {
  onClickOutside: () => void;
  children: JSX.Element;
};

const ClickOutside = ({ onClickOutside, children }: ClickOutsideProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClickOutside]);

  return (
    <div style={{ width: "100%" }} ref={ref}>
      {children}
    </div>
  );
};

export default ClickOutside;
