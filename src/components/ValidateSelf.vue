<template>
    <UiSection title="Self Validation of Electoral Roll Details">
        Sock state: {{ state }}

        <Error v-show="this.err.socket.msg">{{ this.err.socket.msg }}</Error>

        <div v-show="state == UNINITIALIZED">
            <h4>Loading validation...</h4>
        </div>

        <div v-show="state == STARTING_SESSION">
            <h4>Initializing... can take a few seconds</h4>
        </div>

        <div v-show="state == AWAITING_CAPTCHA">
            <h4>Please enter the CAPTCHA below</h4>
            <img :src="sessionImg.src" class="db">
            <input class="pa2 w-100 mt2" type="text" v-model="captchaAnswer" v-on:keyup.enter="submitCaptcha()" placeholder="Please enter the CAPTCHA" />
        </div>

        <div v-show="state == SENT_CAPTCHA">
            <h4>Awaiting CAPTCHA response...</h4>
        </div>

        <div v-show="state == GOT_RESULT">
            <span v-if="validationSuccess">Your details are valid 🙂</span>
            <span v-else>Your details were not valid! The reason was: {{ validationReason }}</span>
        </div>

        <div v-show="state == SOCKET_CLOSED">
            Connection lost.
            <button class="db mv2 pa2" >Reconnect</button>
        </div>
    </UiSection>
</template>

<script lang="ts">
import Vue from "vue";
import { UiSection } from "./common";
import { mkErrContainer } from "../lib/errors";
import { Error } from "./common";
import M from "../messages";

enum Cs {
    UNINITIALIZED,
    STARTING_SESSION,
    AWAITING_CAPTCHA,
    SENT_CAPTCHA,
    GOT_RESULT,
    SOCKET_CLOSED
}

export default Vue.extend({
    components: { UiSection, Error },
    props: ["auth"],
    data: () => ({
        state: Cs.UNINITIALIZED,
        socket: null,
        msgHandlers: null,
        validationSuccess: false,
        validationReason: "",
        sessionImg: new Image(),
        session: null,
        captchaAnswer: "",
        err: mkErrContainer(),
        ...Cs
    }),
    methods: {
        setupHandlers() {
            this.msgHandlers = {
                finish: msg => {
                    this.state = Cs.GOT_RESULT;
                    this.validationSuccess = msg.success;
                    this.captchaStatus = !msg["captcha_incorrect"];
                    this.validationReason = msg.validationReason;
                },
                deliver_session: ({ session }) => {
                    this.session = session;
                    this.state = Cs.AWAITING_CAPTCHA;
                    // focus captcha input
                    this.sessionImg = new Image();
                    this.sessionImg.src = this.$flux.v1.captchaImgUrl(session);
                }
            };
        },
        setupSocket() {
            this.socket = this.socket || this.$flux.v1.validationWebsocket();
            if (this.socket.readyState > 1) {
                // corresponds to CLOSING or CLOSED
                this.socket = this.$flux.v1.validationWebsocket();
            }

            this.socket.onopen = () => {
                this.sendInit();
            };
            this.socket.onclose = () => {
                // if we've successfully validated then this doesn't matter
                if (this.validationSuccess != true) this.state = Cs.SOCKET_CLOSED;
            };

            this.socket.onmessage = this.onSocketMessage;

            this.socket.onerror = e => {
                this.err.socket = this.$err(e, null);
            };
        },
        sendJson(toSend) {
            this.socket.send(JSON.stringify(toSend));
        },
        sendInit() {
            this.state = Cs.STARTING_SESSION;
            this.sendJson({
                method: "begin",
                selfValidation: true,
                forceValitation: true, // just debug
                s: this.$props.auth.s
            });
        },
        onSocketMessage(evt) {
            const msg = JSON.parse(evt.data);
            if (msg.status == "error") this.onSocketError(msg);
            else this.msgHandlers[msg.method](msg);
        },
        onSocketError(msg) {
            this.err.socket = this.$err(msg.msg, msg);
        },
        submitCaptcha() {
            this.sendJson({
                method: "captcha_answer",
                captcha: this.captchaAnswer,
                session: this.session
            });
            this.state = Cs.SENT_CAPTCHA;
        }
    },
    created() {
        this.setupHandlers();
        this.setupSocket();
    }
});
</script>

<style scoped>
</style>
