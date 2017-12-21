(function () {
  var scripts = document.getElementsByTagName("script");
  var me = scripts[scripts.length - 1];

  // set ES5 -> ES6 adapter
  if (window.customElements) {
    addScript(me, "../lib/webcomponentsjs/custom-elements-es5-adapter.js");
  }

  // Load polyfills
  addScript(me, "../lib/webcomponentsjs/webcomponents-loader.js");

  // polyfills are loaded asynchronously, therefore wait for the WebComponentsReady event before proceeding
  document.addEventListener("WebComponentsReady", function componentsReady(event) {
    // stop propagation of WebComponentsReady event, because we it to be propagated after the given bundles are loaded
    event.stopPropagation();
    // remove this listener because we don't want to receive it more than once
    document.removeEventListener("WebComponentsReady", componentsReady, true);

    // load all the bundles
    var bundles = me.getAttribute("bundles").split(",");
    for (let index = 0; index < bundles.length; index++) {
      addScript(me, bundles[index], onloadCounter);
    }

    // fire WebComponentsReady event again when all bundles are loaded
    var loadCounter = 0;
    function onloadCounter(event) {
      loadCounter++;
      if (bundles.length == loadCounter) {
        document.dispatchEvent(new CustomEvent('WebComponentsReady', {bubbles: true}));
        console.log("WebComponentsReady emitted");
      }
    }
  }, true);

  function addScript(beforeElement, src, onloadCallback = null) {
    var scriptTag = document.createElement("script");
    scriptTag.src = src;
    scriptTag.async = true;
    scriptTag.onload = onloadCallback;
    beforeElement.parentElement.insertBefore(scriptTag, beforeElement);
  }
})();
