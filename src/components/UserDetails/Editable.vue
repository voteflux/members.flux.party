<template>
    <div class="flex flex-wrap flex-row items-center tl editable-root">
        <div class="col w-75-ns w-70 flex flex-wrap items-center">
            <div class="col w-40-ns w-100 var-name">
                <div class="pl2 dib f6 f5-ns b normal-ns pr2">
                    {{ name }}
                </div>
            </div>
            <div class="col w-60-ns w-100 pl0-ns pl2">
                <div v-if="state == DISPLAY" class="pv2">
                    {{ value }}
                </div>
                <div v-if="state == EDITING" class="">
                    <slot/>
                </div>
                <div v-if="state == SAVING" class="pv2">
                    Saving...
                </div>
                <div v-if="state == ERROR" class="pv2">
                    Error: {{ err.msg }}
                </div>
            </div>
        </div>

        <!--  -->
        <div class="col w-30 w-25-ns flex flex-no-wrap justify-around icons">
            <!-- :click="onSave(newValue)" -->
            <div v-if="state == EDITING" class="btn-group">
                <button class="tool-btn" v-on:click="resetNoSave()">❌</button>
                <button class="tool-btn" v-on:click="_doSave()">💾</button>
            </div>

            <div v-if="state == DISPLAY" class="">
                <button v-on:click="startEdit()" class="tool-btn">✏️</button>
            </div>

            <div v-if="state == SAVING">
                <div class="tool-btn" style="opacity:0">&nbsp;</div>
            </div>

            <div v-if="state == ERROR">
                <button class="tool-btn" v-on:click="resetNoSave()">🔄</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

enum Cs {
    // state constants
    DISPLAY,
    EDITING,
    SAVING,
    ERROR,
    // some UI constants
    SMALL,
    NOT_SMALL,
}

const Editable = Vue.extend({
    props: {
        name: String,
        value: String,
        onSave: Function,
        onReset: Function,
        onStart: Function,
    },

    data: () => ({
        state: Cs.DISPLAY,
        newValue: '',
        err: {msg: ""},
        ...Cs
    }),

    methods: {
        startEdit() {
            this.newValue = this.$props.value
            this.state = Cs.EDITING
            this.$props.onStart()
        },

        _doSave() {
            this.state = Cs.SAVING
            this.$props.onSave()
                .then(() => {
                    this.state = Cs.DISPLAY
                }).catch(e => {
                    this.state = Cs.ERROR
                    this.err = this.$err(e)
                })
        },

        resetNoSave() {
            this.state = Cs.DISPLAY
            this.$props.onReset()
        }
    },

    mounted(){
    }
})
export default Editable;
</script>

<style scoped lang="scss">
@import "tachyons";

button {
    @extend .mv2;
    @extend .mh1;
    @extend .f4;
}

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
