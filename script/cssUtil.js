function addAnimation(elementName, animName, endCallback) {
  const element = document.getElementById(elementName);
  element.classList.add(animName);
  element.addEventListener(
    "animationend",
    () => {
      element.classList.remove(animName);
      if (endCallback) {
        endCallback();
      }
    },
    { once: true },
  );
}

function addFadeInOutAnimation(elementName, inName, outName, middleCallback) {
  const element = document.getElementById(elementName);

  element.classList.add(inName);
  element.addEventListener(
    "animationend",
    () => {
      element.classList.remove(inName);
      element.classList.add(outName);
      middleCallback(element);
    },
    { once: true },
  );

  element.addEventListener(
    "animationend",
    () => {
      element.classList.remove(outName);
    },
    { once: true },
  );
}

function setVoteButtonActive(elementName, active) {
  const element = document.getElementById(elementName);
  if (active) {
    element.classList.add("vote-button-active");
  } else {
    element.classList.remove("vote-button-active");
  }
}
