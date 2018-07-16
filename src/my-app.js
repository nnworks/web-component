import {LitElement, html} from '@polymer/lit-element';


// Added "export" to export the MyApp symbol from the module
export class MyApp extends LitElement {

  // Define a string template instead of a `<template>` element.
  _render({name, counter})  {
    return html`
      <div>
        This is my ${name} (${counter}) app.<br/>
        Edit text: <input type="text" value="${name}">
      </div>`;
  }

  constructor() {
    super();
    this.name = 'Polymer 3.0 + lit-html test';
    this.counter = 0;
    setInterval(function() {this.counter++}.bind(this), 1000);
  }

  // properties, observers, etc. are identical to 2.x
  static get properties() {
    return {
      name: { Type: String },
      counter: { Type: Number }
    }
  }
}

customElements.define('my-app', MyApp);

