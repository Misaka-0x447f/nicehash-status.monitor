<template>
    <div id="component-root">
        <div id="ani">
            <div class="ani panel panel-1">
            </div>
            <div class="ani panel panel-2">
            </div>
            <div class="ani panel panel-3">
            </div>
            <div class="ani panel panel-2">
            </div>
            <div class="ani panel panel-1">
            </div>
        </div>
        <div id="content" class="ani">
            <div id="content-internal" class="ani">
                <div>
                    <span class="comment" v-html="commentComputed">
                    </span>
                </div>
                <div>
                    <input id="bitcoin-address-ime" class="monospaced" placeholder="address" spellcheck="false"
                           v-model="bitcoinAddress">
                </div>
                <div id="confirm" class="button" v-on:click="confirm">
                    Okay
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PopUpInput",
        props: ["comment", "onConfirmEventName"],
        data: function () {
            return {
                bitcoinAddress: ""
            };
        },
        computed: {
            commentComputed: function () {
                /* "**" is special here. the component will parse it as a important word. html should be filtered. */
                function escapeHTML (unsafeStr) {
                    return unsafeStr
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#39;")
                        .replace(/\//g, "&#x2F;");
                }
                let sto = this.comment;
                sto = escapeHTML(sto);
                /* replace "important" mark */
                let i = 0;
                while (sto.match(/\*{2}/)) {
                    if (i % 2 === 0) {
                        sto = sto.replace(/\*{2}/, "<span vue-user-generated-dom-5d1ref5 class=\"comment-important\">");
                        i++;
                    }
                    if (i % 2 === 1) {
                        sto = sto.replace(/\*{2}/, "</span>");
                        i++;
                    }
                }
                return sto;
            }
        },
        mounted: function () {
            let elements = this.$el.getElementsByClassName("ani");
            for (let i of elements) {
                i.style.animationPlayState = "running";
            }
            /* focus once not works here, this may caused by animation */
            window.addEventListener("keydown", function () {
                document.getElementById("bitcoin-address-ime").focus();
            });
        },
        methods: {
            confirm: function () {
                this.$emit(this.onConfirmEventName, this.bitcoinAddress);
            }
        }
    };
</script>

<style lang="less">
    /* this stylesheet is "scoped" by adding custom attr */
    @theme-color-main: wheat;
    .comment-important[vue-user-generated-dom-5d1ref5]{
        font-size: 1.5em;
        color: @theme-color-main;
    }
</style>

<style lang="less" scoped>
    @initial-delay: 0.5s;
    @ani: 0.8s ease-in-out forwards paused;
    @theme-color-main: wheat;
    @theme-color-main-fade: rgba(245, 222, 179, 0.67);
    @theme-color-main-fade-2: rgba(245, 222, 179, 0.33);
    @theme-color-main-fade-3: rgba(245, 222, 179, 0.1);

    #component-root{
        text-shadow: 0 0 2px black;
    }

    #bitcoin-address-ime {
        font-size: 0.8em;
        min-width: 34.2ch;
    }

    .comment{
        font-size: 0.8em;
        color: @theme-color-main-fade;
    }

    #content-internal>div:not(:first-child){
        margin-top: 0.5em;
    }

    .button{
        padding: 0.5em 1.5em;
        background-color: @theme-color-main-fade-3;
    }

    .button:hover{
        background-color: @theme-color-main-fade-2;
    }

    #confirm{
        float: right;
        font-size: 0.8em;
    }

    /*** animations ***/

    #component-root {
        /* help animation element positioning */
        position: relative;
    }

    #ani {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        z-index: -65536;
    }

    .panel{
        height: 100%;
    }

    .panel-1 {
        animation: panel-1 @ani;
        animation-delay: @initial-delay;
    }

    .panel-2 {
        animation: panel-2 @ani;
        animation-delay: @initial-delay;
        background-color: @theme-color-main;
    }

    .panel-3 {
        animation: panel-3 @ani;
        animation-delay: @initial-delay;
    }

    #content {
        animation: content @ani;
        animation-delay: @initial-delay;
        visibility: hidden;
        padding: 1em 2em;
    }

    #content-internal{
        animation: content-internal @ani;
        animation-delay: @initial-delay;
        position: relative;
        top: 0;
    }

    @keyframes content {
        50% {
            visibility: hidden;
        }
        100% {
            visibility: visible;
        }
    }

    @keyframes content-internal {
        50% {
            top: 0.2em;
            opacity: 0;
        }
        100% {
            top: 0;
            opacity: 1;
        }
    }

    @keyframes panel-1 {
        0% {flex: 10000}
        55% {flex: 0}
    }

    @keyframes panel-2 {
        0% {flex: 0}
        45% {flex: 10000}
        55% {flex: 10000}
        100% {flex: 0}
    }

    @keyframes panel-3 {
        45% {flex: 0}
        100% {flex: 20000}
    }

    .monospaced{
        font-family: "Source Code Pro", "Consolas", monospace;
    }
</style>
