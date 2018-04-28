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
    import util from "../../library/util";

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
                    fields: [
                        {
                            name: "address",
                            placeholder: "nicehash miner address",
                            autoFillName: "address"
                        },
                        {
                            name: "key",
                            placeholder: "api id & secret key (optional)",
                            autoFillName: "key"
                        }
                    ],
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
                            linkValidator: true,
                            goto: "/"
                        }
                    ],
                    inputEventString: "userInput",
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
            onUserInput: async function(input) {
                input = input["address"];
                util.checkAddress(input)
                    .then(response => {
                        this.dialog.isValid = response;
                    });
            },
            onUserSetupAddress: function(input) {
                Cookies.set("address", input["address"]);
                // key format: <id>.<secret-key>
                if (input.hasOwnProperty("key") && input.key.length > 0) {
                    Cookies.set("key", input["key"]);
                }
            }
        }
    };
</script>
