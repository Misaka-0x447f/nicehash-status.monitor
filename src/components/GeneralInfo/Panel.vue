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
                            v-bind="dailyUptimeIndicator"
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
                totalBalance: "×",
                bitcoinPrice: "----",
                bitcoinPriceCNY: "----",
                activeWorker: "----",
                profDiff: "----",
                dailyUptime: "----"
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
            dailyUptimeIndicator: function() {
                return {
                    size: this.panelSize / 3,
                    value: this.dailyUptime,
                    valueMin: 95,
                    valueMax: 100,
                    labelText: "dUptime%"
                };
            }
        },
        mounted: function() {
            this.nicehash.queueMode();
            this.checkCookie();
            this.setStyle();
            // continues after check cookie.
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
                            } else {
                                this.nicehash.setAddress(Cookies.get("address"));
                                this.runAsyncQuery();
                                setInterval(this.runAsyncQuery, 120000);
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
                priceBTCCNY(this);
                priceBTC(this);
                getProviderWorker(this);

                function priceBTCCNY(self) {
                    Nicehash.logger("@", "getBitcoinPrice");
                    self.nicehash.getPriceBitcoin(
                        (response) => {
                            self.bitcoinPriceCNY = response["result"]["data"]["amount"];
                            getProvider(self);
                            getProviderEx(self);
                        },
                        () => {
                            priceBTCCNY(self);
                        },
                        "CNY"
                    );
                }

                function priceBTC(self) {
                    Nicehash.logger("@", "getBitcoinPrice");
                    self.nicehash.getPriceBitcoin(
                        (response) => {
                            self.bitcoinPrice = parseInt(response["result"]["data"]["amount"]);
                        },
                        () => {
                            priceBTC(self);
                        }
                    );
                }

                function getProvider(self) {
                    Nicehash.logger("@", "getProvider");
                    self.nicehash.getProvider(
                        (response) => {
                            let stats = response.result.stats;
                            let unpaidBalanceTotal = 0;
                            for (let i of stats) {
                                unpaidBalanceTotal += parseFloat(i["balance"]);
                            }
                            self.unpaidBalance = (unpaidBalanceTotal * self.bitcoinPriceCNY).toFixed(2);
                        },
                        () => {
                            getProvider(self);
                        }
                    );
                }

                function getProviderEx(self) {
                    Nicehash.logger("@", "getProviderEx");
                    self.nicehash.getProviderEx(
                        (response) => {
                            getProviderExProcessor(response, self);
                        },
                        () => {
                            getProviderEx(self);
                        }
                    );
                }
                function getProviderExProcessor(response, self) {
                    Nicehash.logger("@", "getProviderExProcessor");
                    let currentStatus = response.result["current"];
                    let currentProf = 0;
                    let algoLib = []; // will be useful on past data calc.
                    for (let i of currentStatus) {
                        algoLib[i["algo"]] = {"profitability": i["profitability"]};
                        let currentAlgoSpeedSum = 0;
                        for (let j of i.data) {
                            if (j.hasOwnProperty("a")) {
                                currentAlgoSpeedSum += j.a;
                            }
                        }
                        currentProf += currentAlgoSpeedSum * i["profitability"];
                    }
                    self.currentProf = (currentProf * self.bitcoinPriceCNY).toFixed(2);

                    /*************************************/

                    let bitcoinPriceCNY = self.bitcoinPriceCNY;

                    let pastProf1 = [];
                    for (let i = Nicehash.getUnixTimeStamp(); i > Nicehash.getUnixTimeStamp(86400); i -= 300) {
                        pastProf1.push(getPastProfitability(response, i) * bitcoinPriceCNY);
                    }
                    let pastProf2 = [];
                    for (let i = Nicehash.getUnixTimeStamp(86400); i > Nicehash.getUnixTimeStamp(86400 * 2); i -= 300) {
                        pastProf2.push(getPastProfitability(response, i) * bitcoinPriceCNY);
                    }

                    let sum1 = 0;
                    let count1 = 0;
                    for (let i of pastProf1) {
                        sum1 += i;
                        count1++;
                    }

                    let sum2 = 0;
                    let count2 = 0;
                    for (let i of pastProf2) {
                        sum2 += i;
                        count2++;
                    }

                    self.averageProf = (sum1 / count1 * 30).toFixed(2);
                    self.profDiff = (((sum1 / count1) / (sum2 / count2) - 1) * 100).toFixed(1);
                }

                function getPastProfitability(source, unixTimeStamp) {
                    // unit: bitcoin
                    let algoLib = [];
                    let current = source.result["current"];
                    for (let i of current) {
                        algoLib[i["algo"]] = {"profitability": i["profitability"]};
                    }

                    let past = source.result["past"];
                    let prof = 0;
                    for (let i of past) {
                        // single algo
                        let foundFlag = false;
                        for (let j of i.data) {
                            // single timestamp
                            if (j[0] === Math.floor(unixTimeStamp / 300)) {
                                foundFlag = true;
                                if (j[1].hasOwnProperty(["a"])) {
                                    prof += algoLib[i["algo"]]["profitability"] * parseFloat(j[1]["a"]);
                                }
                                break;
                            }
                        }
                        if (foundFlag === false) {
                            return false;
                        }
                    }
                    return prof;
                }

                function getProviderWorker(self) {
                    Nicehash.logger("@", "getProviderWorker");
                    self.nicehash.getProviderWorkers(
                        (response) => {
                            let workers = response.result.workers;
                            let workerSet = [];
                            for (let i of workers) {
                                if (workerSet.indexOf(i[0]) === -1) {
                                    workerSet = workerSet.concat([i[0]]);
                                }
                            }
                            self.activeWorker = workerSet.length;
                        },
                        () => {
                            getProviderWorker(self);
                        }
                    );
                }
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
