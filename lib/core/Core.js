import {Component} from "./Component.js";

export class Core {
    static getShadowElementConstructor(name) {
        if (!name.length) {
            return new SyntaxError('Name is empty')
        }

        return customElements.get(name)
    }

    static $createComponent(options) {
        return new Component(options);
    }

    static $factoryComponents($options = {components: []}) {
        if (!($options.components instanceof Array) && !$options.components.length) {
            return new SyntaxError('Components must be array of Component Instance')
        }

        for (let component of $options.components) {
            component.define()
        }
    }

}
