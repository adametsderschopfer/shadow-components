import {Component} from "./Component.js";

export class Core {
    static getShadowElementConstructor(name) {
        if (!name.length) {
            console.trace()
            return new SyntaxError('Name is empty')
        }

        return customElements.get(name)
    }

    static useComponent() {

    }

    static $createComponent(options) {
        return new Component(options);
    }

    static $factoryComponents($options = {components: [], beforeDefinedAll: undefined}) {
        if (!($options.components instanceof Array) && !$options.components.length) {
            console.trace()
            return new SyntaxError('Components must be array of Component Instance')
        }

        let ids = [];

        for (let component of $options.components) {
            if (ids.find(id => id === component.$componentId)) {
                console.trace()
                throw new SyntaxError('Attempting to define the same component more than once')
            }

            ids = [...ids, component.$componentId];

            component.define()
        }

        if ($options.beforeDefinedAll && $options.beforeDefinedAll instanceof Function) {
            $options.beforeDefinedAll()
        }
    }

}
