<template>
    <div class="component-root">
        <label-number
            v-bind="currentSpeed"
        >
        </label-number>
        <small-meter
            v-bind="currentSpeed"
        >
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
    import LabelNumber from "./LabelNumber";

    export default {
        components: {
            LabelNumber,
            SmallMeter,
            SharpMeter},
        name: "panel",
        data: function () {
            return {
                currentSpeed: {
                    value: -0.7,
                    valueMin: -0.5,
                    valueMax: 1,
                    valueDigit: true
                }
            };
        },
        mounted: function () {
            setInterval(() => {
                this.currentSpeed.value = parseFloat((this.currentSpeed.value + 0.003).toFixed(3));
            }, 33);
        }
    };
</script>

<style scoped>
    .component-root{
        display: flex;
        justify-content: center;
        align-content: center;
    }
    div>*:not(:first-child){
        margin-left: 0.5em;
    }
</style>
