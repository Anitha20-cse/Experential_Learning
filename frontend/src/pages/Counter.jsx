import React, { useEffect, useState } from "react";

function Counter({ target, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1800;
    const stepTime = Math.max(Math.floor(duration / Math.max(target, 1)), 10);
    const timer = setInterval(() => {
      start += Math.ceil(target / (duration / stepTime));
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="counter-box">
      <div className="counter-number">{count}+</div>
      <div className="counter-label">{label}</div>
    </div>
  );
}

export default Counter;
