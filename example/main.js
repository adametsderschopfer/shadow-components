import {Core} from '../lib/index.js';

const component_1 = Core.$createComponent({
    name: "cart-elem-test",
    template: `
          asasdassd
    `,
    style: `
    
    `,
    beforeMount() {
        console.log(true)
    }
})

window.addEventListener('DOMContentLoaded', () => {
    Core.$factoryComponents({
        components: [
            component_1
        ]
    })
})
