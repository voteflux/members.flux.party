<template>
    <Editable :name="name" :value="value" :onSave="_onSave" :onStart="_onStart" :onReset="_onReset" ref="mainEdit">
        <input class="e-edit input h-100 pb1 mb1" ref="inputfield" :type="type" :placeholder="name" v-model="newValue" v-on:keyup.enter="_onEnter()" :pattern="pattern">
    </Editable>
</template>

<script lang="ts">
import Vue from 'vue'
import Editable from "./Editable.vue"

export default Vue.extend({
    components: { Editable },

    props: {
        name: String,
        value: String,
        type: String,
        placeholder: String,
        onSave: Function,
        pattern: String,
    },

    data: () => ({
        newValue: ""
    }),

    methods: {
        _onStart() { this.$nextTick(() => (<HTMLElement>this.$refs.inputfield).focus()) },

        _onSave() {
            return this.$props.onSave(this.newValue)
        },

        _onReset() {
            this.newValue = this.$props.value
        },

        _onEnter() {
            if (this.newValue !== this.$props.value) {
                (<any>this.$refs.mainEdit)._doSave()
            } else {
                (<any>this.$refs.mainEdit).resetNoSave()
            }
        }
    },

    mounted(){
        this.newValue = this.$props.value
    }
})
</script>

<style scoped lang="scss">
@import "tachyons";

.editable-root {
    min-height: 2rem;
}

.var-name {
    @extend .pa0-ns;
    @extend .pa1;
}

.col {
}

.icons {
    min-height: 2.1rem;
}
</style>
