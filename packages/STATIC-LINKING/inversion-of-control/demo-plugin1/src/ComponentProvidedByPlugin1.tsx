import * as vue from 'vue';
import * as plugin1 from '@plugin1';

// demo-motherboard does not depend on demo-plugin1
// demo-plugin2 does not depend on demo-plugin1
// even if we export this function, they can not import it
export function secretHiddenByPlugin1() {
    return 'is secret'
}

// implement the abstract declaration of @plugin1
// if the implementation does not match declaration, typescript will complain type incompatible
export const ComponentProvidedByPlugin1: typeof plugin1.ComponentProvidedByPlugin1 = vue.defineComponent({
    props: {
        msg: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            hello: 'world'
        }
    },
    methods: {
        onClick(): void {
            secretHiddenByPlugin1();
        }
    },
    render() {
        return <div>ComponentProvidedByPlugin1</div>
    }
});

