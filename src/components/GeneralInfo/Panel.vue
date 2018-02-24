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
    import Nicehash from "../../library/nicehash";
    import * as Cookies from "es-cookie";

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
            return {
                nicehash: new Nicehash(),
                panelSizePx: this.panelSize + "px",
                currentProf: "----",
                currentProfMax: "----",
                averageProf: "----",
                unpaidBalance: "----",
                totalBalance: "----",
                bitcoinPrice: "----",
                activeWorker: "----",
                profDiff: "----",
                weeklyUptime: "----"
            };
        },
        computed: {
            currentProfIndicator: function() {
                return {
                    width: this.panelSize / 2,
                    value: this.currentProf,
                    label: "CNY/d currentProf"
                };
            },
            currentProfMeter: function() {
                return {
                    size: this.panelSize,
                    value: this.currentProf,
                    valueMin: 0,
                    valueMax: this.currentProfMax
                };
            },
            averageProfIndicator: function() {
                return {
                    width: this.panelSize / 2,
                    value: this.averageProf,
                    label: "CNY/mo averageProf"
                };
            },
            unpaidBalanceIndicator: function() {
                return {
                    width: this.panelSize / 2,
                    value: this.unpaidBalance,
                    label: "CNY unpaidBalance"
                };
            },
            totalBalanceIndicator: function() {
                return {
                    width: this.panelSize / 2,
                    value: this.totalBalance,
                    label: "CNY totalBalance"
                };
            },
            bitcoinPriceIndicator: function() {
                return {
                    width: this.panelSize / 2,
                    value: this.bitcoinPrice,
                    label: "USD bitcoinPrice"
                };
            },
            activeWorkerIndicator: function() {
                return {
                    width: this.panelSize / 2,
                    value: this.activeWorker,
                    label: "ActiveWorker"
                };
            },
            profDiffIndicator: function() {
                return {
                    size: this.panelSize / 3,
                    value: this.profDiff,
                    valueMin: -10,
                    valueMax: 10,
                    labelText: "profDiff%"
                };
            },
            weeklyUptimeIndicator: function() {
                return {
                    size: this.panelSize / 3,
                    value: this.weeklyUptime,
                    valueMin: 95,
                    valueMax: 100,
                    labelText: "wklyUp%"
                };
            }
        },
        mounted: function() {
            this.checkCookie();
            this.setStyle();
            this.runAsyncQuery();
            setInterval(this.runAsyncQuery(), 300000);
        },
        methods: {
            checkCookie: function() {
                let addr = Cookies.get("address");
                if (
                    typeof (addr) === "string" && addr.hasOwnProperty("length") &&
                    (
                        (addr.length === 34 && addr.slice(0, 1) === "1") ||
                        (addr.length === 34 && addr.slice(0, 1) === "3") ||
                        (addr.length === 42 && addr.slice(0, 3) === "bc1")
                    )
                ) {
                    this.nicehash.isValidAddress(addr,
                        (response) => {
                            if (response !== "true") {
                                this.$router.push("/setup");
                            }
                        },
                        () => {
                            this.checkCookie();
                        }
                    );
                } else {
                    this.$router.push("/setup");
                }
            },
            setStyle: function() {
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
