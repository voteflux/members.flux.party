<template>
    <div>
        <h2>Welcome to your Dashboard</h2>

        <UiSection title="Your Summary">
            <UserSummary :user='user'></UserSummary>
        </UiSection>

    </div>
</template>


<script lang="ts">
import Vue from "vue";
import UserSummary from "./UserSummary.vue";
import { UiSection } from "./common";

export default Vue.extend({
    name: "Dashboard",
    components: { UserSummary, UiSection },
    props: ["user"]
});
</script>


<style scoped>
</style>
