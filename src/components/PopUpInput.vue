<template>
    <div class="pop-up-input-component-root">
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
                        <input name="nicehash-bitcoin-address" id="bitcoin-address-ime" class="monospaced"
                               spellcheck="false" autocomplete="on"

                               data-autoFillName="address" data-inputEventName="userInput"

                               :placeholder="placeholder"
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
                          :class="{disabled: (i.linkValidator && isValid === 'false')}" v-on:click="buttonClick(i)"
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
     * typeof  name                             comment
     * ---Common---
     * array   (Array)                          A group of settings.
     * string  (Array).comment                  The message which will shown on the dialog.
     * ×string (Array).placeholder              Placeholder in the input box.
     * ---External Validator API---
     * *string (Array).isValid                  Is input valid? "true", "false", "unknown"
     * *string (Array).validSymbol              Shown when input is valid. A symbol like {👌, ●, ✓} is recommended.
     * *string (Array).invalidSymbol            Shown when invalid. How about {×}？
     * *string (Array).invalidTips              Shown when invalid and user clicked disabled button.
     * ---Buttons---
     * array   (Array).buttons                  A group of buttons definition.
     * string  (Array).buttons[i].text          Button label.
     * *bool   (Array).buttons[i].linkValidator Should I link disable status to validator?
     * ---Buttons action: emit event---
     * *string (Array).buttons[i].eventString   Event name which will be emitted on click.
     * *bool   (Array).buttons[i].payload       Should I emit event with user input?
     * ---Buttons action: goto---
     * *string (Array).buttons[i].goto          On click go to. Router string required.
     *
     * -----UNDER CONSTRUCTION-----
     * ---Input Field---
     * array   (Array).field                    A group of input field definition.
     * string  (Array).field[i].placeholder     Placeholder string.
     * *string (Array).field[i].autoFillName    AutoFill string. Comes from url parameter.
     * *string (Array).field[i].inputEventName  Emit this event on input.
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

            // the following are how input check works
            let fireEventElements = this.$el.querySelectorAll("[data-inputEventName]");
            for (let i of fireEventElements) {
                i.addEventListener("input", () => {
                    this.$emit(i.attributes["data-inputEventName"]["nodeValue"], i.value);
                    this.showExtendInvalidTips = false;
                });
            }

            this.$nextTick(() => {
                // the following are how auto-fill parameter works
                let autoFillElements = this.$el.querySelectorAll("[data-autoFillName]");
                let parameterList = this.$route.query;
                for (let i of autoFillElements) {
                    let slot = i.attributes["data-autoFillName"]["nodeValue"];
                    if (parameterList.hasOwnProperty(slot)) {
                        i.value = parameterList[slot];

                        // emit an event if has this attr
                        // TODO: have no idea about how to emit an event here. Maybe solve it later.
                        if (i.attributes.hasOwnProperty("data-inputEventName")) {
                            this.$emit(i.attributes["data-inputEventName"]["nodeValue"], i.value);
                        }
                    }
                }
            });
        },
        methods: {
            buttonClick: function(s) {
                if (s.hasOwnProperty("eventString")) {
                    if (s.hasOwnProperty("payload") && s.payload === true) {
                        this.$emit(s.eventString, this.$el.querySelector("input").value);
                    } else {
                        this.$emit(s.eventString);
                    }
                }

                this.showExtendInvalidTips = true;

                /**
                 * GOTO route?
                 * Condition #0: has goto
                 * Condition #1: not linked validator
                 * Condition #2: validator return true or unknown
                 * Condition is true: #0 and (#1 or #2)
                 */
                if (
                    s.hasOwnProperty("goto") && (
                        (
                            !s.hasOwnProperty("linkValidator") ||
                            s.linkValidator !== true
                        ) || (
                            s.linkValidator === true &&
                            this.isValid !== "false"
                        )
                    )
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

    .pop-up-input-component-root {
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
