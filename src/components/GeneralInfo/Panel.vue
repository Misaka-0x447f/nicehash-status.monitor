<template>
    <div class="component-root">
        <small-meter>

        </small-meter>
        <sharp-meter
            v-bind="currentSpeed"
        ></sharp-meter>
    </div>
</template>

<script>
    // import nicehash from "../../library/nicehash";

    import SharpMeter from "./SharpMeter";
    import SmallMeter from "./SmallMeter";

    export default {
        components: {
            SmallMeter,
            SharpMeter},
        name: "panel",
        data: function () {
            return {
                currentSpeed: {
                    size: 400,
                    borderWidth: 10,
                    value: 75,
                    valueMax: 100
                }
            };
        }
    };
</script>

<style scoped>
    .component-root{
        display: flex;
        justify-content: center;
        align-content: center;
    }
</style>
