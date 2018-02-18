<template>
    <div id="component-root">
        <pop-up-input
            v-bind="Dialog"
        ></pop-up-input>
        <bottom-center-info></bottom-center-info>
    </div>
</template>

<script>

    import PopUpInput from "./PopUpInput";
    import BottomCenterInfo from "./BottomCenterInfo";

    export default {
        components: {
            BottomCenterInfo,
            PopUpInput
        },
        name: "Setup",
        data () {
            return {
                Dialog: {
                    /* "**" is special here. the component will parse it as a important word. html should be filtered. */
                    comment: "to **setup**, field \"address\" is required",
                    placeholder: "address (nicehash)",
                    buttons: [
                        {
                            text: "?",
                            eventString: "clicked: faq"
                        },
                        {
                            text: "Okay",
                            eventString: "clicked: user-login",
                            payload: true
                        }
                    ]
                }
            };
        }
    };
</script>

<style scoped>

</style>
