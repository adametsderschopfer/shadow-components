import {idGenerator} from "../utils/idGenerator.js";

export class Component {
    $componentId = idGenerator();

    constructor(options = {template: ``}) {
        const self = this;

        this.beforeMount = options.beforeMount || undefined;
        this.mounted = options.mounted || undefined;
        this.afterMounted = options.afterMounted || undefined;

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

        this.$parent = this.shadowRoot;
    }

    define() {
        if (this.beforeMount && this.beforeMount instanceof Function) {
            this.beforeMount()
        }

        this.shadowRoot.appendChild(this.templateShadow.content.cloneNode(true));

        if (this.mounted && this.mounted instanceof Function) {
            this.mounted()
        }

        if (this.afterMounted && this.afterMounted instanceof Function) {
            this.afterMounted()
        }
    }

    style(str) {
        const tagStyle = this.templateShadow?.getElementsByTagName('style')[0];

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
