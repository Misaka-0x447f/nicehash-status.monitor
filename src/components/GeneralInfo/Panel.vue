<template>
    <div class="component-root">
        <div class="panel flex">
            <div class="left-panel">
                <div class="inside-sub-panel flex">
                    <div class="line flex">
                        <label-number
                            v-bind="currentProfIndicator"
                        ></label-number>
                        <label-number
                            v-bind="averageProfIndicator"
                        ></label-number>
                    </div>
                    <div class="line flex">
                        <label-number
                            v-bind="unpaidBalanceIndicator"
                        ></label-number>
                        <label-number
                            v-bind="totalBalanceIndicator"
                        ></label-number>
                    </div>
                    <div class="line flex">
                        <label-number
                            v-bind="bitcoinPriceIndicator"
                        ></label-number>
                        <label-number
                            v-bind="activeWorkerIndicator"
                        ></label-number>
                    </div>
                    <div class="line flex">
                        <small-meter
                            v-bind="profDiffIndicator"
                        ></small-meter>
                        <small-meter
                            v-bind="weeklyUptimeIndicator"
                        ></small-meter>
                    </div>
                </div>
            </div>
            <div class="middle-panel">
                <sharp-meter
                    v-bind="currentProfMeter"
                ></sharp-meter>
            </div>
            <div class="right-panel">

            </div>
        </div>
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
            SharpMeter
        },
        props: {
            panelSize: {
                default: 400,
                type: Number
            }
        },
        name: "panel",
        data: function() {
            let currentProf = "----";
            let currentProfMax = 125;
            let averageProf = "----";
            let unpaidBalance = "----";
            let totalBalance = "----";
            let bitcoinPrice = "----";
            let activeWorker = "--";
            let profDiff = "----";
            let weeklyUptime = "----";

            return {
                panelSizePx: this.panelSize + "px",
                currentProfIndicator: {
                    width: this.panelSize / 2,
                    value: currentProf,
                    label: "CNY/d currentProf"
                },
                currentProfMeter: {
                    size: this.panelSize,
                    value: currentProf,
                    valueMin: 0,
                    valueMax: currentProfMax
                },
                averageProfIndicator: {
                    width: this.panelSize / 2,
                    value: averageProf,
                    label: "CNY/mo averageProf"
                },
                unpaidBalanceIndicator: {
                    width: this.panelSize / 2,
                    value: unpaidBalance,
                    label: "CNY unpaidBalance"
                },
                totalBalanceIndicator: {
                    width: this.panelSize / 2,
                    value: totalBalance,
                    label: "CNY totalBalance"
                },
                bitcoinPriceIndicator: {
                    width: this.panelSize / 2,
                    value: bitcoinPrice,
                    label: "USD bitcoinPrice"
                },
                activeWorkerIndicator: {
                    width: this.panelSize / 2,
                    value: activeWorker,
                    label: "ActiveWorker"
                },
                profDiffIndicator: {
                    size: this.panelSize / 3,
                    value: profDiff,
                    valueMin: -10,
                    valueMax: 10,
                    labelText: "profDiff%"
                },
                weeklyUptimeIndicator: {
                    size: this.panelSize / 3,
                    value: weeklyUptime,
                    valueMin: 95,
                    valueMax: 100,
                    labelText: "wklyUp%"
                }
            };
        },
        mounted: function() {
            // setInterval(this.runAsyncQuery());
            let panel = this.$el.querySelectorAll(".panel");
            for (let i of panel) {
                i.style.width = this.panelSize * 3.6 + "px";
            }
            let panelInside = this.$el.querySelectorAll(".panel > *");
            for (let i of panelInside) {
                i.style.flexBasis = this.panelSize * 1.1 + "px";
            }
            let insideSubPanel = this.$el.querySelectorAll(".inside-sub-panel");
            for (let i of insideSubPanel) {
                i.style.minHeight = this.panelSizePx;
                i.style.flexBasis = this.panelSize * 1.1 + "px";
            }
            let line = this.$el.querySelectorAll(".line");
            for (let i of line) {
                i.style.flexBasis = this.panelSize * 1.1 + "px";
            }
        },
        methods: {
            runAsyncQuery: function() {

            }
        }
    };
</script>

<style scoped>
    .flex {
        display: flex;
        justify-content: space-around;
        align-content: space-around;
        flex-wrap: wrap;
    }
</style>
