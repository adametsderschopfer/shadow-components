import {idGenerator} from "../utils/idGenerator.js";
import {isFunction} from "../utils/isFunction.js";

export class Component {
    $componentId = idGenerator();
    $parent = this.shadowRoot;
    $state = {};
    $methods = null;

    constructor(options = {template: ``, methods: null}) {
        const self = this;
        this.$options = options;
        this.$state = this.$options.state || {};
        this.$methods = options.methods;

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
                templateShadow.innerHTML = self.#parseOutputParentheses(options.template);

                self.shadowRoot = this.attachShadow({mode: 'open'});
                self.templateShadow = templateShadow;

                if (options.hasOwnProperty('style') && typeof options.style === 'string') {
                    self.style(options.style)
                }
            }
        })
    }

    #parseOutputParentheses(str) {
        let outputVariable = {};

        function parse(_str, cb, ptr) {
            const regex = ptr || /\{\{=(.*?)=}}/g;
            let m;

            while ((m = regex.exec(_str)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                m.forEach((match, groupIndex) => {
                    if (cb && cb instanceof Function) {
                        return cb();
                    }

                    outputVariable[groupIndex === 0 ? "pattern" : "variable"] = match;
                });
            }
        }

        parse(str)

        if (Object.keys(outputVariable)) {
            if (this.$state.hasOwnProperty(outputVariable.variable)) {
                str = str.replaceAll(outputVariable.pattern, this.$state[outputVariable.variable])
            }
        }

        return str;
    }

    update() {
        if (this.afterUpdate && this.afterUpdate instanceof Function) {
            this.afterUpdate()
        }

        this.shadowRoot.innerHTML = this.#parseOutputParentheses(this.$options.template);
        this.style(this.$options.style)
        this.#hookHandlers()

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

    #hookHandlers(cb) {
        const self = this;

        this.#handlerNames.forEach(handlerName => {

            const name = `ev-${handlerName}`;

            const handlerEls = this.shadowRoot.querySelectorAll(`[${name}]`);

            if (handlerEls && handlerEls.length) {
                handlerEls.forEach(handler => {

                    const handlerAttrValue = handler.getAttribute(name);

                    handler.addEventListener(handlerName, function (...args) {
                        if (isFunction(handlerAttrValue)) {
                            return eval(`(() => ${handlerAttrValue})()`).bind(self, ...args)()
                        } else {
                            if (self.$methods) {
                                if (self.$methods[handlerAttrValue] instanceof Function) {
                                    self.$methods[handlerAttrValue].bind(self)(...args);
                                } else {
                                    throw new SyntaxError('Method is not defined or is not a function')
                                }
                            }
                        }

                        self.update()
                    })

                    handler.removeAttribute(name);
                })
            }
        })
    }

    define() {
        if (this.beforeMount && this.beforeMount instanceof Function) {
            this.beforeMount()
        }

        if (this.shadowRoot) {
            this.shadowRoot.appendChild(this.templateShadow.content.cloneNode(true));

            this.#hookHandlers()

            if (this.mounted && this.mounted instanceof Function) {
                this.mounted()
            }

            if (this.afterMounted && this.afterMounted instanceof Function) {
                this.afterMounted()
            }
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
