function addScriptFromFile(beforeElement, srcFile) {
  var scriptElm = document.createElement("script");
  scriptElm.src = srcFile;
  beforeElement.parentElement.insertBefore(scriptElm, beforeElement);
}

function addScriptFromSrc(beforeElement, src) {
  var scriptElm = document.createElement("script");
  var inlineScript = document.createTextNode(src);
  scriptElm.appendChild(inlineScript);
  beforeElement.parentElement.insertBefore(scriptElm, beforeElement);
}


(function(){
  console.log("in script file 1");

  var scriptTag = document.getElementById("scripttag1");
  addScriptFromSrc(scriptTag, "console.log(\"dynamically prepended to scripttag1 from within file\");");

  console.log("in script file 2");
})();
