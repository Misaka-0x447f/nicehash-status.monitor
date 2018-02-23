<template>
    <div class="component-root">
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
                    <label for="bitcoin-address-ime" class="comment" v-html="commentComputed">
                    </label>
                </div>
                <div>
                    <form v-on:submit.prevent="enterClick()">
                        <input id="bitcoin-address-ime" class="monospaced" spellcheck="false" autocomplete="false"
                               :placeholder="placeholder" v-model="textIn"
                               :class="{'invalid-input': showExtendInvalidTips && isValid === 'false'}"
                        >
                    </form>
                </div>
                <div id="button-flex-container">
                    <span class="valid-indicator" v-show="isValid === 'false'">
                        {{ invalidSymbol }}
                        <span class="invalid-tips" v-show="showExtendInvalidTips">
                                {{ invalidTips }}
                        </span>
                    </span>
                    <span class="valid-indicator" v-show="isValid === 'true'">
                        {{ validSymbol }}
                    </span>
                    <span class="flex-split">

                    </span>
                    <span v-for="i in buttons" class="button"
                          :class="{disabled: (i.linkValidator && isValid !== 'true')}" v-on:click="buttonClick(i)"
                          :key="i.length">
                        {{ i.text }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * Input component.
     *
     * @param param comments.
     * * means optional
     * × Planed to be remove. Development must be completed before apply to more component.
     * typeof  name                                 comment
     * ---Common---
     * array   (anonymous)                          A group of settings.
     * string  (anonymous).comment                  The message which will shown on the dialog.
     * ×string  (anonymous).placeholder             Placeholder in the input box.
     * ---External Validator API---
     * *string (anonymous).isValid                  Is input valid? "true", "false", "unknown"
     * *string (anonymous).validSymbol              Shown when input is valid. A symbol like {👌, ●, ✓} is recommended.
     * *string (anonymous).invalidSymbol            Shown when invalid. How about {×}？
     * *string (anonymous).invalidTips              Shown when invalid and user clicked disabled button.
     * ---Buttons---
     * array   (anonymous).buttons                  A group of buttons definition.
     * string  (anonymous).buttons[i].text          Button label.
     * *bool   (anonymous).buttons[i].linkValidator Should I link disable status to validator?
     * ---Buttons action: emit event---
     * *string (anonymous).buttons[i].eventString   Event name which will be emitted on click.
     * *bool   (anonymous).buttons[i].payload       Should I emit event with user input?
     * ---Buttons action: goto---
     * *string (anonymous).buttons[i].goto          On click go to. Router string required.
     *
     * -----UNDER CONSTRUCTION-----
     * ---Input Field---
     * array   (anonymous).field                    A group of input field definition.
     * string  (anonymous).field[i].placeholder     Placeholder string.
     *
     * @event userInput - payload is the input string.
     */
    export default {
        name: "PopUpInput",
        props: {
            comment: {
                type: String
            },
            placeholder: {
                default: "",
                type: String
            },
            buttons: {
                type: Array
            },
            isValid: {
                default: "unset",
                type: String
            },
            validSymbol: {
                default: "",
                type: String
            },
            invalidSymbol: {
                default: "",
                type: String
            },
            invalidTips: {
                default: "",
                type: String
            }
        },
        data: function() {
            return {
                textIn: "",
                showExtendInvalidTips: false
            };
        },
        computed: {
            commentComputed: function() {
                /* "**" is special here. the component will parse it as a important word. html should be filtered. */
                function escapeHTML(unsafeStr) {
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
        mounted: function() {
            let elements = this.$el.getElementsByClassName("ani");
            for (let i of elements) {
                i.style.animationPlayState = "running";
            }
            /* focus once not works here, this may caused by animation */
            window.addEventListener("keydown", () => {
                this.$el.querySelector("#bitcoin-address-ime").focus();
            });
            this.$el.querySelector("#bitcoin-address-ime").addEventListener("input", () => {
                this.$emit("userInput", this.$el.querySelector("#bitcoin-address-ime").value);
                this.showExtendInvalidTips = false;
            });
        },
        methods: {
            buttonClick: function(s) {
                if (s.hasOwnProperty("eventString")) {
                    if (s.hasOwnProperty("payload") && s.payload === true) {
                        this.$emit(s.eventString, this.textIn);
                    } else {
                        this.$emit(s.eventString);
                    }
                }
                this.showExtendInvalidTips = true;

                // GOTO route?
                if ((s.hasOwnProperty("goto") && (!s.hasOwnProperty("linkValidator") || s.linkValidator !== true)) ||
                    (s.hasOwnProperty("goto") && s.linkValidator === true && this.isValid === "true")
                ) {
                    this.$router.push(s.goto);
                }
            },
            enterClick: function() {
                this.buttonClick(this.buttons[this.buttons.length - 1]);
            }
        }
    };
</script>

<style lang="less">
    /* this stylesheet is "scoped" by adding custom attr */
    @theme-color-main: wheat;
    .comment-important[vue-user-generated-dom-5d1ref5] {
        font-size: 1.5em;
        color: @theme-color-main;
    }
</style>

<style lang="less" scoped>
    /* Animation duration must be matched goto time (method.buttonClick) */
    @ani: 0.8s 0.5s ease-in-out forwards paused;
    @theme-color-main: wheat;
    @theme-color-main-fade: rgba(245, 222, 179, 0.67);
    @theme-color-main-fade-2: rgba(245, 222, 179, 0.33);
    @theme-color-main-fade-3: rgba(245, 222, 179, 0.1);

    .component-root {
        text-shadow: 0 0 2px black;
    }

    #bitcoin-address-ime {
        font-size: 0.8em;
        min-width: 34.2ch;
    }

    .comment {
        font-size: 0.8em;
        color: @theme-color-main-fade;
    }

    .invalid-tips {
        font-size: 0.85em;
    }

    #content-internal > div:not(:first-child) {
        margin-top: 0.5em;
    }

    .button {
        cursor: default;
        padding: 0.3em 1em;
        background-color: @theme-color-main-fade-3;
    }

    .button.disabled {
        filter: saturate(0%);
    }

    .button:hover:not(.disabled) {
        background-color: @theme-color-main-fade-2;
    }

    .invalid-input {
        background-color: rgba(139, 0, 0, 0.25);
    }

    #button-flex-container {
        font-size: 0.8em;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .flex-split {
        margin-right: auto;
    }

    #button-flex-container > .button:not(:first-child) {
        margin-left: 0.2em;
    }

    #content {
        border-width: 1px 0;
        border-color: @theme-color-main-fade;
        border-style: solid;
    }

    /*** animations ***/

    .component-root {
        /* help animation element positioning */
        position: relative;
    }

    #ani {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        z-index: 1;
        pointer-events: none;
    }

    .panel {
        height: 100%;
    }

    .panel-1 {
        animation: panel-1 @ani;
    }

    .panel-2 {
        animation: panel-2 @ani;
        background-color: @theme-color-main;
    }

    .panel-3 {
        animation: panel-3 @ani;
    }

    #content {
        animation: content @ani;
        visibility: hidden;
        padding: 1em 2em;
    }

    #content-internal {
        animation: content-internal @ani;
        position: relative;
        top: 0;
    }

    @keyframes content {
        50% {visibility: hidden;}
        100% {visibility: visible;}
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
</style>
