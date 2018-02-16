<template>
    <pop-up-input
        v-bind="Dialog"
    ></pop-up-input>
</template>

<script>

    import PopUpInput from "./PopUpInput";

    export default {
        components: {PopUpInput},
        name: "Setup",
        data () {
            return {
                Dialog: {
                    title: "Login",
                    comment: "\"address\" is required to continue."
                }
            };
        }
    };
</script>

<style scoped>

</style>
