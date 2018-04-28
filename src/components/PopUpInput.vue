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
                    <span class="comment" v-html="commentComputed">
                    </span>
                </div>
                <div>
                    <form v-on:submit.prevent="enterClick()" v-for="i in fields" :key="i.length">
                        <input class="monospaced"
                               spellcheck="false" autocomplete="on"

                               :data-autoFillName="i.autoFillName" :data-name="i.name"

                               :placeholder="i.placeholder" :title="i.placeholder"
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
     * @author Misaka_0x447f
     * @mail 447f.misaka@outlook.com
     *
     * @param param comments.
     * *optional
     *
     * typeof  name                             comment
     * ---Common---
     * string  (Array).comment                  Message in the dialog.[1]
     * ---Input Field Definition---
     * array   (Array).fields                   Input fields definition.
     * string  (Array).fields[i].name           Field identifier that will be used to pack up.[2]
     * string  (Array).fields[i].placeholder    Field placeholder string.
     * *string (Array).fields[i].autoFillName   Field auto-fill string. Comes from url.[3]
     * ---Input Field Definition: validator---
     * string  (Array).inputEventString         Event name that will be emitted on change.[2]
     * *string (Array).isValid                  Is all input field valid? "true", "false", "unknown"
     * *string (Array).validSymbol              Shown when input is valid. A symbol like {👌, ●, ✓} is recommended.
     * *string (Array).invalidSymbol            Shown when invalid. How about {×}？
     * *string (Array).invalidTips              Shown when invalid and user clicked disabled button.
     * ---Buttons Definition---
     * array   (Array).buttons                  Buttons definition.
     * string  (Array).buttons[i].text          Button label.
     * *bool   (Array).buttons[i].linkValidator If validator is false, disable this button.
     * ---Buttons Definition: action---
     * *string (Array).buttons[i].eventString   Event name that will be emitted on click.[2]
     * *string (Array).buttons[i].goto          On click go to router path.
     *
     * [1]  If you want to highlight something you can use double star ** just like markdown.
     *      For example, "You need to **Login** to continue".
     * [2]  Every time an event that emitted has a payload which contains an object we called "package".
     *      The package contains all value from each input fields.
     * [3]  Auto-fill using data from get.
     *      For example, the url is "http://localhost:8080/?value=123", then the field with autoFillName="value"
     *      will be auto filled with 123.
     *
     *  @example-param
     *  {
     *      comment: "to **Login**, please fill your account name."
     *      fields: [
     *          {
     *              name: "username",
     *              placeholder: "Username, email address or phone number",
     *              autoFillName: "username"
     *          }
     *      ],
     *      buttons: [
     *          {
     *              text: "more option",
     *              goto: "login/more-option"
     *          },
     *          {
     *              text: "next →",
     *              eventString: "onSubmit",
     *              linkValidator: true,
     *              goto: "/login/password"
     *          }
     *      ],
     *      inputEventString: "onInputChange",
     *      isValid: "unknown" // will be changed by validator
     *      validSymbol: "",
     *      invalidSymbol: "×",
     *      invalidTips: "please check your input"
     *  }
     *
     *  @example-payload
     *  {
     *      "username": "alice-bob-charlie",
     *      "password": "foo-bar-baz",
     *      "2fa": "123-123-123"
     *  }
     */

    import util from "../library/util";

    export default {
        name: "PopUpInput",
        props: {
            comment: {
                type: String
            },
            fields: {
                type: Array
            },
            buttons: {
                type: Array
            },
            inputEventString: {
                default: "userInput",
                type: String
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
                let sto = this.comment;
                sto = util.escapeHTML(sto);
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

            // the following codes are how input check works
            let fireEventElements = this.$el.querySelectorAll("[data-name]");
            for (let i of fireEventElements) {
                i.addEventListener("input", () => {
                    this.emitEverything(this.inputEventString);
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
            emitEverything: function(name) {
                let pkg = {};
                let fireEventElements = this.$el.querySelectorAll("[data-name]");
                for (let i of fireEventElements) {
                    pkg[i.attributes["data-name"]["nodeValue"]] = i.value;
                }
                this.$emit(name, pkg);
                this.showExtendInvalidTips = false;
            },
            buttonClick: function(buttonInstance) {
                // Emit field info on click?
                if (buttonInstance.hasOwnProperty("eventString")) {
                    this.emitEverything(buttonInstance.eventString);
                }

                // Let user know if they are wrong
                this.showExtendInvalidTips = true;

                /**
                 * GOTO route?
                 * Condition #0: has goto
                 * Condition #1: not linked validator
                 * Condition #2: validator return true or unknown
                 * Condition is true: #0 and (#1 or #2)
                 */
                if (
                    buttonInstance.hasOwnProperty("goto") && (
                        (
                            !buttonInstance.hasOwnProperty("linkValidator") ||
                            buttonInstance.linkValidator !== true
                        ) || (
                            buttonInstance.linkValidator === true &&
                            this.isValid !== "false"
                        )
                    )
                ) {
                    this.$router.push(buttonInstance.goto);
                }
            },
            enterClick: function() {
                // Click last button.
                this.buttonClick(this.buttons[this.buttons.length - 1]);
            }
        }
    };
</script>

<style lang="less">
    /* this stylesheet is "scoped" by adding custom attr */
    @import "../color";

    .comment-important[vue-user-generated-dom-5d1ref5] {
        font-size: 1.5em;
        color: @theme-color-main;
    }
</style>

<style lang="less" scoped>
    @import "../color";
    /* Animation duration must be matched goto time (method.buttonClick) */
    @ani: 0.8s 0.5s ease-in-out forwards paused;

    .component-root {
        text-shadow: 0 0 2px black;
    }

    input {
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
