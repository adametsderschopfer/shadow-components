# **shadow-components**
>Ever wanted to start using native components using shadow DOM? It's time to start

 [Example using components](https://github.com/adametsofficial/Temploler/tree/main/example)

### Component structure
```
import {Core} from '../lib/index.js';

const component_1 = Core.$createComponent({
    name: "component-name-of-html",
    state: {
        count: 0
    },
    template: `
        <h1>Counter</h1>
  
        <p>count: {{=count=}}</p>
        <button ev-click="anyMethod">click</button>
    `,
    style: `
     h1 {font-family: "Open Sans Light",Helvetica,
    `,
    methods: {
        anyMethod(event) {
            console.log(this.$state.count, event)
            this.$state.count = this.$state.count + 1
        }
    },
    beforeMount() {
        console.log('beforeMount')
    },
    afterMounted() {
        console.log('afterMounted')
    },
    mounted() {
        console.log('mounted')     
    },
    afterUpdate () {
        console.log('afterUpdate')
    },
    beforeUpdate () {
        console.log('beforeUpdate')
    },
})
```
### handler implementation options
```
...
template: `
        <h1>Counter</h1>
  
        <p>count: {{=count=}}</p>
        <button ev-click="anyMethod">click</button>
    `
    methods: {
        anyMethod(event) {
            console.log(this.$state.count, event)
            this.$state.count = this.$state.count + 1
        }
    },
...
```

```
...
template: `
        <h1>Counter</h1>
  
        <p>count: {{=count=}}</p>
        <button ev-click="function (event) {
            console.log(this.$state.count, event)
            this.$state.count = this.$state.count + 
        } ">click</button>
    `
...
```
### Output state filed's
*use this construcion {{=someVariableOfState=}}*

### Define components
Use $factoryComponents of core for define components

```
import {Core} from 'lib/index.js'

Core.$factoryComponents({
    components: [
        ...someComponents
    ]
})
```
