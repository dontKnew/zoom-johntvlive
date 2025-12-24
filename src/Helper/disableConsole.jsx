// src/utils/disableConsole.js
(function () {
  if (typeof window === "undefined") return; // for SSR safety

  const empty = () => {};
  // console.log = empty;
  // console.info = empty;
  // console.warn = empty;
  // console.error = empty;
  // console.debug = empty;
  // console.trace = empty;
})();
