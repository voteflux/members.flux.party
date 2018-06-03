<template>
    <div>
        <h2>Welcome to your Dashboard</h2>

        <UiSection title="Your Summary">
            <UserSummary :user='user'></UserSummary>
        </UiSection>

        <UiSection v-if="roles && roles.length > 0" title="Organiser Utilities">
            <OrganiserUtils />
        </UiSection>

        <ui-section title="Member Tools">
            <ul class="ul-spaced">
                <li><a href="/member_details.html">Change your member details or preferences</a></li>
                <li><a href="/anon_validation.html">Help validate other members</a></li>
            </ul>
        </ui-section>

    </div>
</template>


<script lang="ts">
import Vue from "vue";
import UserSummary from "./UserSummary.vue";
import OrganiserUtils from "./OrganiserUtils.vue";
import { UiSection } from "./common";

export default Vue.extend({
    name: "Dashboard",
    components: { UserSummary, UiSection, OrganiserUtils },
    props: {
        user: Object,
        roles: Array,
    }
});
</script>


<style scoped>
ul.ul-spaced li {
    margin-top: 10px;
}
</style>
