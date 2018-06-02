<template>
    <div>
        <h3>Login to Flux UI</h3>
        <div id="form-group">

            <div v-show="state == EMAIL_SENT">
                <h3>An email has been sent to you. Please check your inbox.</h3>
            </div>

            <div v-show="state != EMAIL_SENT">
                <label>
                    Email:
                    <input v-model.trim="user.email" placeholder="name@example.com" type="email" name="email"/>
                </label>

                <button v-show="state == NEED_EMAIL" v-on:click="checkEmail()">Continue</button>
                <Loading v-show="state == SENDING_EMAIL">Sending email...</Loading>
            </div>

        </div>
    </div>
</template>

<script>
    import Loading from "./Loading";

    const cs = {
        NEED_EMAIL: 1,
        SENDING_EMAIL: 2,
        EMAIL_SENT: 3,
    }

    export default {
        name: "LoginForm",
        components: {Loading},
        data: () => ({
            user: {
                email: ""
            },
            state: cs.NEED_EMAIL,
            ...cs
        }),

        methods: {
            checkEmail() {
                this.state = cs.SENDING_EMAIL
                const _email = this.user.email
                this.$flux.v1.sendUserDetails(this.user)
                    .then(r => {
                        r.caseOf({
                            left: e => {
                                this.state = cs.NEED_EMAIL
                                this.emailError = [this.showErr(e), _email]
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


        },

        created() {
        }
    }
</script>

<style scoped>

</style>