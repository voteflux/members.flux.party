<template>
    <div>
        <h3>Login to Flux UI</h3>
        <div id="form-group">

            <div v-show="showInProgress()">
                <h3>Attempting to log you in...</h3>
            </div>

            <div v-show="showSentEmail()">
                <h3>An email has been sent to you. Please check your inbox.</h3>
            </div>

            <div v-show="showMainLoginForm()">
                <label>
                    Email:
                    <input v-model.trim="user.email" placeholder="name@example.com" type="email" name="email"/>
                </label>

                <button v-show="showCheckEmailButton()" v-on:click="checkEmail()">Continue</button>
            </div>

            <Loading v-show="showLoading()" :config="loading"></Loading>
        </div>
    </div>
</template>

<script>
    import Loading from "./Loading";

    export default {
        name: "LoginForm",
        components: {Loading},
        data: () => ({
            loading: Loading.init(),
            user: {
                email: ""
            },
            loginState: "needEmail"
        }),

        methods: {
            showCheckEmailButton() { return this.loginState == "needEmail" },
            showInProgress() { return this.loginState == "inProgress" },
            showLoading() { return this.loginState == "loading" },
            showSentEmail() { return this.loginState == "emailSent" },
            showMainLoginForm() { return this.showCheckEmailButton() || this.showLoading() },

            checkEmail() {
                this.loginState = "loading"
                this.loading = Loading.show("Checking Email...")

                this.$flux.v1.sendUserDetails(this.user)
                    .then(r => {
                        this.loading = Loading.hide();
                        r.caseOf({
                            left: e => {
                                this.loginState = "needEmail"
                                this.showErr(e)
                            },
                            right: (r) => {
                                if (r.sent_email) {
                                    this.loginState = "emailSent"
                                } else {
                                    this.loginState = "needEmail"
                                    this.showErr(r.reason)
                                }
                            }
                        })
                    })
            },

            showErr(msg) {
                // console.log("Showing error:", msg);
                this.$notify({
                    title: "Error",
                    text: msg,
                    type: 'error'
                })
            }
        },

        created() {
            const {memberSecret, memberApiToken} = this.$flux.auth.getSavedAuth()

            if (memberSecret || memberApiToken) {
                // check we're logged in properly
                this.loginState = "inProgress"
            } else {
                // we're not logged in
                this.loginState = "needEmail"
            }
        }
    }
</script>

<style scoped>

</style>