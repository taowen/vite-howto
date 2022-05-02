import { defineComponent } from "vue";

// interface declaration
export const ComponentProvidedByPlugin1 = defineComponent({
    props: {
        msg: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            hello: ''
        }
    },
    methods: {
        onClick() {
        }
    }
})

export function spiExportedByPlugin1ForOtherPlugins(): string {
    throw new Error('abstract');
}