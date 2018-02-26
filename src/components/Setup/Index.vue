<template>
    <div class="component-root">
        <pop-up-input
            v-bind="dialog"
            @userInput="onUserInput"
            @userSetupAddress="onUserSetupAddress"
        ></pop-up-input>
        <bottom-center-info></bottom-center-info>
    </div>
</template>

<script>

    import PopUpInput from "../PopUpInput";
    import BottomCenterInfo from "./BottomCenterInfo";

    import Nicehash from "../../library/nicehash";
    import * as Cookies from "es-cookie";

    export default {
        components: {
            BottomCenterInfo,
            PopUpInput
        },
        name: "setup-index",
        data() {
            return {
                dialog: {
                    /* "**" is special here. the component will parse it as a important word. html should be filtered. */
                    comment: "to **setup**, field \"address\" is required",
                    placeholder: "address (nicehash)",
                    buttons: [
                        /* future button
                        {
                            text: "?",
                            goto: "faq"
                        },
                        */
                        {
                            text: "Okay",
                            eventString: "userSetupAddress",
                            payload: true,
                            linkValidator: true,
                            goto: "/"
                        }
                    ],
                    isValid: "unknown", /* will be changed by validator */
                    validSymbol: "✓",
                    invalidSymbol: "×",
                    invalidTips: "Invalid address"
                },
                nicehash: new Nicehash()
            };
        },
        mounted: function() {
            this.nicehash.throttleMode();
        },
        methods: {
            onUserInput: function(input) {
                if (
                    (input.length === 34 && input.slice(0, 1) === "1") ||
                    (input.length === 34 && input.slice(0, 1) === "3") ||
                    (input.length === 42 && input.slice(0, 3) === "bc1")
                ) {
                    this.nicehash.isValidAddress(input,
                        (response) => {
                            this.dialog.isValid = response;
                        },
                        () => {
                            this.dialog.isValid = "unknown";
                        }
                    );
                } else if (input.length === 0) {
                    this.dialog.isValid = "unknown";
                } else {
                    // Question
                    // It works but raised a weak warning:
                    // Assigned expression type string is not assignable to type string
                    // Have no idea why.
                    this.dialog.isValid = "false";
                }
            },
            onUserSetupAddress: function(input) {
                Cookies.set("address", input);
            }
        }
    };
</script>

<style scoped>

</style>
