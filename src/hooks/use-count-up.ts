import { useEffect, useRef, useState } from 'react';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * 数字滚动：从上一次的值平滑过渡到目标值
 * 首次挂载从 0 开始，后续数据刷新时从旧值过渡
 */
export const useCountUp = (target: number, duration = 800) => {
  const [value, setValue] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    if (from === target) return;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const current = Math.round(from + (target - from) * easeOutCubic(t));
      setValue(current);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prev.current = target;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
};
