import { useState } from "../client_deps.ts";

export default function SwipeListener(
  onLeft: () => void,
  onRight: () => void,
): [
  (e: TouchEvent) => void,
  (e: TouchEvent) => void,
  () => void,
] {
  const [touchStart, setTouchStart] = useState(undefined as undefined | number);
  const [touchEnd, setTouchEnd] = useState(undefined as undefined | number);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(undefined); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      onLeft();
    }

    if (isRightSwipe) {
      onRight();
    }
  };

  return [onTouchStart, onTouchMove, onTouchEnd];
}
