export class Component {
    constructor(options = {template: ``}) {
        const self = this;

        this.beforeMount = options.beforeMount || undefined;
        this.mounted = options.mounted || undefined;

        if (!options.name?.length) {
            return new SyntaxError('Something went wrong');
        }

        customElements.define(options.name, class extends HTMLElement {
            constructor() {
                super();

                const templateShadow = document.createElement('template')
                templateShadow.innerHTML = options.template;

                if (options.hasOwnProperty('style') && typeof options.style === 'string') {
                    templateShadow.innerHTML += options.style;
                }

                self.shadowRoot = this.attachShadow({mode: 'open'});
                self.templateShadow = templateShadow;
            }
        })
    }

    define() {
        if (this.beforeMount && this.beforeMount instanceof Function) {
            this.beforeMount()
        }

        this.shadowRoot.appendChild(this.templateShadow.content.cloneNode(true));

        if (this.mounted && this.mounted instanceof Function) {
            this.mounted()
        }
    }

    style(str) {
        const tagStyle = this.shadowRoot.getElementsByTagName('style')[0];

        if (tagStyle) {
            tagStyle.textContent += String(str);

            return this;
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
