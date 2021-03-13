import {Core} from '../lib/index.js';

const header = Core.$createComponent({
    name: "header-component",
    template: `
        <header>
            header
        </header>
    `
})

const component_1 = Core.$createComponent({
    name: "element-details",
    state: {
        count: 0,
    },
    template: `
         <h1>element-details - web component using <code>&lt;template&gt;</code> and <code>&lt;slot&gt;</code></h1>

      <details>
        <summary>
          <span>
            <code class="name">&lt;<slot name="element-name">NEED NAME</slot>&gt;</code>
            <i class="desc"><slot name="description">NEED DESCRIPTION</slot></i>
          </span>
        </summary>
        <div class="attributes">
          <h4><span>Attributes</span></h4>
          <slot name="attributes"><p>None</p></slot>
        </div>
      </details>
      <hr>
      <slot name="btn">
        Naming
      </slot>
      
      <p>count: {{=count=}}</p>
      <button ev-click="asd">click</button>

      
    `,
    style: `
     details {font-family: "Open Sans Light",Helvetica,Arial}
      .name {font-weight: bold; color: #217ac0; font-size: 120%}
      h4 { margin: 10px 0 -8px 0; }
      h4 span { background: #217ac0; padding: 2px 6px 2px 6px }
      h4 span { border: 1px solid #cee9f9; border-radius: 4px }
      h4 span { color: white }
      .attributes { margin-left: 22px; font-size: 90% }
      .attributes p { margin-left: 16px; font-style: italic }
    `,
    methods: {
        asd() {
            console.log(this.$state.count)
            this.$state.count = this.$state.count + 1
        }
    },
    beforeMount() {
        console.log('beforeMount')
    },
    afterMounted() {
        console.log('afterMounted')
    },
    afterUpdate () {
        console.log('afterUpdate')
    },
    beforeUpdate () {
        console.log('beforeUpdate')
    },
})

window.addEventListener('DOMContentLoaded', () => {
    Core.$factoryComponents({
        components: [
            component_1,
            header,
        ]
    })
})
