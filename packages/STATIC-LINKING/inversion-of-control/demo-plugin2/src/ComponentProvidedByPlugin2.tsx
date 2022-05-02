import * as vue from 'vue';
import * as plugin2 from '@plugin2';
import * as plugin1 from '@plugin1';

// demo-motherboard does not depend on demo-plugin2
// demo-plugin1 does not depend on demo-plugin2
// even if we export this function, they can not import it
export function secretHiddenByPlugin2() {
    return 'is secret'
}

// implement the abstract declaration of @plugin1
// if the implementation does not match declaration, typescript will complain type incompatible
export const ComponentProvidedByPlugin2: typeof plugin2.ComponentProvidedByPlugin2 = vue.defineComponent({
    props: {
        position: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            left: 100,
            right: 200
        }
    },
    methods: {
        move(): void {
            secretHiddenByPlugin2();
            // demo-plugin2 does not depend on demo-plugin1 in compile time
            // however, in runtime, demo-plugin2 can call demo-plugin1
            // as long as the interface has been declared by demo-motherboard
            plugin1.spiExportedByPlugin1ForOtherPlugins();
        }
    },
    render() {
        return <div>ComponentProvidedByPlugin2</div>
    }
});

