(function () {
  var scripts = document.getElementsByTagName("script");
  var me = scripts[scripts.length - 1];

  // set ES6 -> ES5 adapter
  if (window.customElements) {
    addScript(me, "/bower_components/webcomponentsjs/custom-elements-es5-adapter.js");
  }

  <!-- Load polyfills; note that "loader" will load these async -->
  addScript(me, "/bower_components/webcomponentsjs/webcomponents-loader.js");

  document.addEventListener("WebComponentsReady", function componentsReady(event) {
    event.stopPropagation();
    console.log("WebComponentsReady");
    document.removeEventListener("WebComponentsReady", componentsReady, false);

    var bundles = me.getAttribute("webpack-bundles").split(",");
    for (let index = 0; index < bundles.length; index++) {
      addScript(me, bundles[index], onloadCounter);
      console.log("bundle loaded: " + bundles[index]);
    }

    var loadCounter = 0;
    function onloadCounter(event) {
      loadCounter++;
      if (bundles.length == loadCounter) {
        document.dispatchEvent(new CustomEvent('WebComponentsReady', {bubbles: true}));
      }
    }

  }, false);



  function addScript(beforeElement, src, onloadCallback = null) {
    var scriptElm = document.createElement("script");
    scriptElm.src = src;
    if (onloadCallback != null) {
      scriptElm.onload = onloadCallback;
    }
    beforeElement.parentElement.insertBefore(scriptElm, beforeElement);
  }

})();
