
function addScript(beforeElement, src, onloadCallback = null) {
  let scriptTag = document.createElement("script");
  scriptTag.src = src;
  scriptTag.async = false;
  scriptTag.onload = onloadCallback;
  beforeElement.parentElement.insertBefore(scriptTag, beforeElement);
}

function loadBundles() {
  let scripts = document.getElementsByTagName("script");
  let me = scripts[scripts.length - 1];

  // get location of the webcomponentsjs files
  let webcomponentsLocation = me.getAttribute("wc-location");
  if (webcomponentsLocation == null) {
    console.log("wc-location attribute not set");
  }

  // set ES5 -> ES6 adapter
  if (window.customElements) {
    addScript(me, webcomponentsLocation + "/custom-elements-es5-adapter.js");
  }

  // Load polyfills
  addScript(me, webcomponentsLocation + "/webcomponents-loader.js");

  // polyfills are loaded asynchronously, therefore wait for the WebComponentsReady event before proceeding
  document.addEventListener("WebComponentsReady", function componentsReady(event) {
    // stop propagation of WebComponentsReady event, because we it to be propagated after the given bundles are loaded
    event.stopPropagation();
    // remove this listener because we don't want to receive it more than once
    document.removeEventListener("WebComponentsReady", componentsReady, true);

    // load all the bundles
    let bundleAttr = me.getAttribute("bundles");
    if (bundleAttr == null) {
      console.log("bundles attribute not set (',' separated bundle files)");
    }

    let bundles = bundleAttr.split(",");
    for (let index = 0; index < bundles.length; index++) {
      addScript(me, bundles[index], onloadCounter);
    }

    // fire WebComponentsReady event again when all bundles are loaded
    let loadCounter = 0;
    function onloadCounter(event) {
      loadCounter++;
      if (bundles.length == loadCounter) {
        document.dispatchEvent(new CustomEvent('WebComponentsReady', {bubbles: true}));
        console.log("WebComponentsReady emitted");
      }
    }
  }, true);
}

loadBundles();
