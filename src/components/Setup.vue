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
                    comment: "to **login**, field \"address\" is required",
                    onConfirmEventName: "login"
                }
            };
        }
    };
</script>

<style scoped>

</style>
