import { useMemo } from "react";

export const Repeat = ({ children, times }) => {
  const arr = useMemo(
    () => Array.from({ length: times }, (_, i) => children(i)),
    [times, children]
  );

  return <>{arr}</>;
};

export function Grid({ depth, width, height, children }) {
  return (
    <Repeat times={width}>
      {(x) => (
        <Repeat times={height}>
          {(y) => <Repeat times={depth}>{(z) => children(x, y, z)}</Repeat>}
        </Repeat>
      )}
    </Repeat>
  );
}
