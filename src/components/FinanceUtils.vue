<template>
    <div>
        <flux-logo title="Finance Utils"/>

        <UiSection title="Donation Log">
            <Error v-if="req.donations.isFailed()">{{ req.donations.unwrapError() }}</Error>
            <Loading v-else-if="!req.donations.isSuccess()">Loading donations...</Loading>
            <div v-else>
                <Paginate :page="req.donations.unwrap()" :on-page="(dir) => changePage(dir)">
                    <div class="mv2" v-for="donation in req.donations.unwrap().donations" :key="donation.id">
                        <Donation :donation="donation" />
                    </div>
                </Paginate>
            </div>
        </UiSection>
    </div>
</template>

<script lang="ts">
const JSError = Error;
import Vue from 'vue'
import FluxLogo from '@/components/common/FluxLogo.vue';
import Loading from '@/components/Loading.vue';
import { Error, UiSection, Paginate, Donation } from '@/components/common';
import WebRequest from '@/lib/WebRequest';
import { Auth, Paginated } from '@/lib/api';

export default Vue.extend({
    components: { FluxLogo, Error, Loading, UiSection, Paginate, Donation },
    props: {
        auth: Object as () => Auth,
    },
    data: () => ({
        req: {
            donations: WebRequest.NotRequested()
        },
        pageN: 0,
        limit: 50,
    }),
    methods: {
        getDonations(_pageN?:number, _limit?:number) {
            const pageN = _pageN || this.pageN
            const limit = _limit || this.limit
            this.req.donations = WebRequest.Loading()
            this.$flux.v2.getDonations({...this.$props.auth, pageN, limit}).then(r => this.req.donations = r)
        },
        changePage(dir: 'next' | 'prev'): void {
            if (dir === 'next') {

            } else if (dir === 'prev') {

            } else {
                throw new JSError(<any>('Should have recieved one of "next" or "prev" for `dir` but got ' + (<any>dir).toString()))
            }
        }
    },
    mounted(){
        this.getDonations(this.pageN, this.limit)
    }
})
</script>

<style lang="scss" scoped>
@import "tachyons";

</style>
