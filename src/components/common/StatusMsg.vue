<template>
    <div class="db mh3 mv4 common" v-bind:class="getClass()">
        <div class="heading pl2 pt2 pr1">{{ getHeading() }}</div>
        <div class="err-text pl2 pb2 pr2">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export enum Types {
    NULL,
    ERROR,
    WARNING,
    INFO,
    SUCCESS,
}

export default Vue.extend({
    props: ["type"],
    name: "error",
    data: () => ({
        statusClass: Types.NULL
    }),
    methods: {
        getClass() {
            return {
                [Types.ERROR]: "error",
                [Types.WARNING]: "warning",
                [Types.INFO]: "info",
                [Types.SUCCESS]: "success",
            }[this.statusClass] || "null"
        },
        getHeading() {
            return {
                [Types.ERROR]: "Error:",
                [Types.WARNING]: "Warning:",
                [Types.INFO]: "Info:",
                [Types.SUCCESS]: "Success:",
            }[this.statusClass] || ""
        }
    },
    mounted() {
        this.statusClass = this.$props.type || Types.NULL
    }
});
</script>

<style scoped>
.common {
    color: white;
    border: solid 0px;
    border-left-width: 4px;
    text-align: left;
    font-size: 0.9rem;
}

.error {
    /* color: #ffffff; */
    border-color: #aa0000;
    background-color: rgb(236, 112, 112);
}

.warning {
    color: #333;
    border-color: #8a6d3b;
    background-color: #f0cb80;
}

.info {
    border-color: #31708f;
    background-color: #7ad1e2;
}

.success {
    border-color: #3c763d;
    background-color: #afdd89;
}

.null {
    color: #333;
    border-color: rgb(119, 6, 119);
    background-color: rgb(240, 159, 240);
}

.heading {
    font-weight: 600;
}
</style>
