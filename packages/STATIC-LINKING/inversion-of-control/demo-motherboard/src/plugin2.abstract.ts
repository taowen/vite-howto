import { defineComponent } from "vue";

// interface declaration
export const ComponentProvidedByPlugin2 = defineComponent({
    props: {
        position: {
            type: String,
            required: true
        }
    },
    methods: {} as any
})