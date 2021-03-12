import {idGenerator} from "../utils/idGenerator.js";

export class Component {
    $componentId = idGenerator();
    $parent = this.shadowRoot;
    $state = {};

    constructor(options = {template: ``}) {
        const self = this;
        this.$options = options;
        this.$state = this.$options.state || {};

        this.beforeMount = options.beforeMount || undefined;
        this.mounted = options.mounted || undefined;
        this.afterMounted = options.afterMounted || undefined;
        this.afterUpdate = options.afterUpdate || undefined;
        this.beforeUpdate = options.beforeUpdate || undefined;

        if (!options.name?.length) {
            console.trace()
            return new SyntaxError('Name is not defined or name is empty');
        }

        customElements.define(options.name, class extends HTMLElement {
            constructor() {
                super();

                const templateShadow = document.createElement('template')
                templateShadow.innerHTML = options.template;

                self.shadowRoot = this.attachShadow({mode: 'open'});
                self.templateShadow = templateShadow;

                if (options.hasOwnProperty('style') && typeof options.style === 'string') {
                    self.style(options.style)
                }
            }
        })
    }

    update() {
        if (this.afterUpdate && this.afterUpdate instanceof Function) {
            this.afterUpdate()
        }
        const oldShadowElement = document.querySelector(this.$options.name);
        const newShadowElement = oldShadowElement.createShadowRoot();

        newShadowElement.innerHTML = this.$options.template;


        if (this.beforeUpdate && this.beforeUpdate instanceof Function) {
            this.beforeUpdate()
        }
    }

    #handlerNames = [
        'click', 'change',
        'input', 'mouseout',
        'mousedown', 'mousemove',
        'mouseup', 'mouseover'
    ]

    define() {
        if (this.beforeMount && this.beforeMount instanceof Function) {
            this.beforeMount()
        }

        // this.#handlerNames.forEach(handlerName => {
        //     const name = '@'+`${handlerName}`;
        //
        //     const handlerEl = this.shadowRoot.querySelector(name);
        //     const handler = handlerEl.getAttribute(name)
        //
        //     console.log(handler)
        // })

        this.shadowRoot.appendChild(this.templateShadow.content.cloneNode(true));

        if (this.mounted && this.mounted instanceof Function) {
            this.mounted()
        }

        if (this.afterMounted && this.afterMounted instanceof Function) {
            this.afterMounted()
        }
    }

    style(str) {
        const tagStyle = this.templateShadow?.querySelector('style');

        if (tagStyle) {
            tagStyle.textContent += String(str);

            return this;
        }

        if (str instanceof String && !str.length) {
            return;
        }

        const style = document.createElement('style');
        style.textContent = String(str);

        this.shadowRoot.appendChild(style);

        return this;
    }

    add({tagName = '', className = '', html = ''}) {
        const el = document.createElement(tagName);
        el.classList.add(className);
        el.innerHTML = html;

        this.shadowRoot.appendChild(el);

        return this;
    }
}
