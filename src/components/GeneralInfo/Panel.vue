<template>
    <div class="panel-component-root">
        <div class="panel flex" :style="{fontSize: panelSize / 20 + 'px'}">
            <div class="panel-1 flex-block">
                <div class="flex-panel">
                    <div class="line flex-line">
                        <label-number
                            v-bind="currentProfIndicator"
                        ></label-number>
                        <label-number
                            v-bind="averageProfIndicator"
                        ></label-number>
                    </div>
                    <div class="line flex-line">
                        <label-number
                            v-bind="unpaidBalanceIndicator"
                        ></label-number>
                        <label-number
                            v-bind="totalBalanceIndicator"
                        ></label-number>
                    </div>
                    <div class="line flex-line">
                        <label-number
                            v-bind="bitcoinPriceIndicator"
                        ></label-number>
                        <label-number
                            v-bind="activeWorkerIndicator"
                        ></label-number>
                    </div>
                    <div class="line flex-line">
                        <small-meter
                            v-bind="profDiffIndicator"
                        ></small-meter>
                        <small-meter
                            v-bind="efficiencyIndicator"
                        ></small-meter>
                    </div>
                </div>
            </div>
            <div class="panel-2 flex-block">
                <worker
                    v-bind="workerListContainer"
                ></worker>
            </div>
            <console class="console"></console>
        </div>
        <md-progress-bar
            md-mode="determinate"
            :md-value="progress / progressMax * 100"
            v-if="progress < progressMax"
            class="progress-bar"
        >
        </md-progress-bar>
        <md-progress-spinner
            md-mode="indeterminate"
            :md-diameter="parseInt('20')"
            :md-stroke="parseFloat('2')"
            v-if="progress < progressMax"
            class="spinner"
        >
        </md-progress-spinner>
    </div>
</template>

<script>
    import * as Cookies from "es-cookie";
    import throttle from "throttle-debounce/throttle";

    import Nicehash from "../../library/nicehash";
    import util from "../../util";

    import SmallMeter from "./SmallMeter";
    import LabelNumber from "./LabelNumber";
    import Console from "./Console";
    import Worker from "./Worker";

    import "vue-material/dist/vue-material.min.css";

    export default {
        components: {
            Worker,
            Console,
            LabelNumber,
            SmallMeter
        },
        name: "panel",
        data: function() {
            return {
                nicehash: new Nicehash(),
                panelSize: 400,
                currentProf: "----",
                averageProf: "----",
                unpaidBalance: "----",
                totalBalance: "×",
                bitcoinPrice: "----",
                bitcoinPriceCNY: "----",
                activeWorker: "----",
                profDiff: "----",
                efficiency: "----",
                workerListContainer: {
                    workerList: []
                },
                algoLib: [], // information of all algorithms.
                progress: 0,
                progressMax: 15
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
                    valueMin: -15,
                    valueMax: 15,
                    labelText: "profDiff%"
                };
            },
            efficiencyIndicator: function() {
                return {
                    size: this.panelSize / 3,
                    value: this.efficiency,
                    valueMin: 96,
                    valueMax: 100,
                    labelText: "efficiency%"
                };
            }
        },
        mounted: function() {
            this.nicehash.queueMode();
            this.checkCookie();
            this.setStyle();
            window.addEventListener("resize", throttle(75, this.setStyle));
            // continues after cookie checked.
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
                                setInterval(this.runAsyncQuery, 60000);
                            }
                        },
                        () => {
                            this.checkCookie();
                        }
                    );
                } else {
                    this.$router.push("/setup");
                }

                if (typeof Cookies.get("key") === "string") {
                    this.totalBalance = "----";
                }
            },
            setStyle: function() {
                let panel = this.$el.querySelector(".panel");

                if (document.body.clientWidth < 720) {
                    panel.style.alignContent = "flex-start";
                } else {
                    panel.style.alignContent = "center";
                }

                let flexPanel = this.$el.querySelectorAll(".flex-panel");
                for (let i of flexPanel) {
                    i.style.flexBasis = this.panelSize * 1.2 + "px";
                    i.style.minHeight = this.panelSize * 1.1 + "px";
                }
                let flexBlock = this.$el.querySelectorAll(".flex-block");
                for (let i of flexBlock) {
                    i.style.flexBasis = this.panelSize * 1.2 + "px";
                    i.style.maxHeight = this.panelSize * 1.1 + "px";
                }

                if (document.body.clientWidth < 720) {
                    this.panelSize = 300;
                } else if (document.body.clientWidth < 960) {
                    this.panelSize = (document.body.clientWidth - 720) * 300 / 720 + 300 - 10;
                    // +10px reduces element flashing
                } else {
                    this.panelSize = 400;
                }
            },
            runAsyncQuery: function() {
                // comes from stat
                this.mass = {
                    "init": 1,
                    "priceBTC": 1.99,
                    "priceBTCCNY": 1.99,
                    "statsProvider": 7.06,
                    "statsProviderEx": 10.08,
                    "statsProviderWorkers": 6.20,
                    "balance": 14.03
                };
                this.progress += this.mass.init;
                this.progressMax = util.sum(this.mass);

                /***
                 * priceBTC
                 * priceBTCCNY
                 *  statsProvider
                 *  statsProviderEx
                 *   statsProviderWorker
                 *  balance
                 */

                priceBTCCNY(this);
                priceBTC(this);

                function priceBTCCNY(self) {
                    self.nicehash.getPriceBitcoin(
                        (response) => {
                            self.progress += self.mass.priceBTCCNY;
                            self.bitcoinPriceCNY = response["result"]["data"]["amount"];
                            getProvider(self);
                            getProviderEx(self);
                            getBalance(self);
                        },
                        () => {
                            priceBTCCNY(self);
                        },
                        "CNY"
                    );
                }

                function priceBTC(self) {
                    self.nicehash.getPriceBitcoin(
                        (response) => {
                            self.progress += self.mass.priceBTC;
                            self.bitcoinPrice = parseInt(response["result"]["data"]["amount"]);
                        },
                        () => {
                            priceBTC(self);
                        }
                    );
                }

                function getProvider(self) {
                    self.nicehash.getProvider(
                        (response) => {
                            self.progress += self.mass.statsProvider;
                            let stats = response.result.stats;
                            let unpaidBalanceTotal = 0;
                            if (typeof (stats) !== "object") {
                                Nicehash.logger("Failed", "provider data invalid.");
                                console.log("----> response.result.stats");
                                console.log(stats);
                                console.log("----> response");
                                console.log(response);
                                return false;
                            }
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
                    self.nicehash.getProviderEx(
                        (response) => {
                            self.progress += self.mass.statsProviderEx;
                            getProviderExProcessor(response, self);
                        },
                        () => {
                            getProviderEx(self);
                        }
                    );
                }

                function getProviderExProcessor(response, self) {
                    let currentStatus = response.result["current"];
                    let currentProf = 0;

                    if (typeof (currentStatus) !== "object") {
                        Nicehash.logger("Failed", "providerEx data invalid.");
                        console.log("----> response.result.currentStatus");
                        console.log(currentStatus);
                        console.log("----> response");
                        console.log(response);
                        return false;
                    }

                    for (let i of currentStatus) {
                        self.algoLib[i["algo"]] = {
                            "name": i["name"],
                            "profitability": i["profitability"],
                            "suffix": i["suffix"]
                        };
                        let currentAlgoSpeedSum = 0;
                        for (let j of i.data) {
                            if (j.hasOwnProperty("a")) {
                                currentAlgoSpeedSum += j.a;
                            }
                        }
                        currentProf += currentAlgoSpeedSum * i["profitability"];
                    }
                    self.currentProf = parseFloat((currentProf * self.bitcoinPriceCNY).toFixed(2));

                    // algoLib initialized; querying worker.
                    getProviderWorker(self);

                    /*************************************/

                    let bitcoinPriceCNY = self.bitcoinPriceCNY;

                    let pastProf1 = [];
                    let pastReje1 = [];
                    for (let i = Nicehash.getUnixTimeStamp(); i > Nicehash.getUnixTimeStamp(86400); i -= 300) {
                        let query = getPastProfitability(self, response, i);
                        pastProf1.push(query["accepted"] * bitcoinPriceCNY);
                        pastReje1.push(query["rejected"] * bitcoinPriceCNY);
                    }
                    let pastProf2 = [];
                    for (let i = Nicehash.getUnixTimeStamp(86400); i > Nicehash.getUnixTimeStamp(86400 * 2); i -= 300) {
                        pastProf2.push(getPastProfitability(self, response, i)["accepted"] * bitcoinPriceCNY);
                    }

                    // TODO: I think that there's nothing wrong now. But still need test.
                    self.averageProf = (util.sum(pastProf1) / 288 * 30).toFixed(2);
                    let profDiff = parseFloat((((util.sum(pastProf1) / 288) / (util.sum(pastProf2) / 288) - 1) * 100).toFixed(2));
                    if (util.isNumeric(profDiff)) {
                        self.profDiff = profDiff;
                    } else {
                        self.profDiff = "  N/A";
                    }

                    self.efficiency = parseFloat((util.sum(pastProf1) / (util.sum(pastProf1) + util.sum(pastReje1)) * 100).toFixed(2));
                }

                function getPastProfitability(self, source, unixTimeStamp) {
                    // unit: bitcoin
                    let current = source.result["current"];

                    if (typeof (current) !== "object") {
                        Nicehash.logger("Failed", "providerEx/PastProfitability data invalid.");
                        console.log("----> response.result.current");
                        console.log(current);
                        console.log("----> response");
                        console.log(source);
                        return false;
                    }

                    let past = source.result["past"];
                    let prof = 0;
                    let reject = 0;
                    for (let i of past) {
                        // single algo
                        for (let j of i.data) {
                            // single timestamp
                            if (j[0] === Math.floor(unixTimeStamp / 300)) {
                                let value = j[1];
                                if (j[1].hasOwnProperty(["a"])) {
                                    let singleProf = self.algoLib[i["algo"]]["profitability"] * parseFloat(j[1]["a"]);
                                    util.isNumeric(singleProf) ? prof += singleProf : prof += 0;
                                    delete value["a"];
                                }
                                value = Object.values(value);
                                if (Object.keys(value).length > 0) {
                                    for (let k of value) {
                                        let singleReject = self.algoLib[i["algo"]]["profitability"] * parseFloat(k);
                                        util.isNumeric(singleReject) ? reject += singleReject : reject += 0;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    return {
                        "accepted": prof,
                        "rejected": reject
                    };
                }

                function getProviderWorker(self) {
                    self.nicehash.getProviderWorkers(
                        (response) => {
                            self.progress += self.mass.statsProviderWorkers;
                            // worker count
                            let workers = response.result.workers;
                            let workerSet = [];

                            if (typeof (workers) !== "object") {
                                Nicehash.logger("Failed", "worker data invalid.");
                                console.log("----> response.result.workers");
                                console.log(workers);
                                console.log("----> response");
                                console.log(response);
                                return false;
                            }

                            for (let i of workers) {
                                if (workerSet.indexOf(i[0]) === -1) {
                                    workerSet = workerSet.concat([i[0]]);
                                }
                            }
                            self.activeWorker = workerSet.length;

                            // worker list
                            workerSet = [];
                            let counter = 0;
                            for (let i of workers) {
                                let accepted = 0;
                                let rejected = 0;
                                let speedObject = i[1];
                                if (speedObject.hasOwnProperty("a")) {
                                    accepted = parseFloat(speedObject["a"]);
                                    delete speedObject["a"];
                                }

                                for (let j in speedObject) {
                                    if (speedObject.hasOwnProperty(j)) {
                                        rejected += parseFloat(speedObject[j]);
                                    }
                                }

                                workerSet = workerSet.concat({
                                    key: counter,
                                    workerName: i[0],
                                    algorithm: self.algoLib[i[6]]["name"],
                                    accepted: accepted,
                                    rejected: rejected,
                                    suffix: self.algoLib[i[6]]["suffix"]
                                });
                                counter++;
                            }

                            workerSet.sort(function(a, b) {
                                return a.workerName > b.workerName;
                            });
                            self.workerListContainer.workerList = workerSet;
                        },
                        () => {
                            getProviderWorker(self);
                        }
                    );
                }

                function getBalance(self) {
                    let key = Cookies.get("key");
                    if (typeof key !== "string") {
                        return false;
                    }
                    self.nicehash.getBalance(
                        key,
                        (response) => {
                            self.progress += self.mass.balance;
                            let value =
                                (
                                    parseFloat(response["result"]["balance_pending"]) * self.bitcoinPriceCNY +
                                    parseFloat(response["result"]["balance_confirmed"]) * self.bitcoinPriceCNY
                                ).toFixed(2)
                            ;
                            if (util.isNumeric(value)) {
                                self.totalBalance = value;
                            }
                        },
                        () => {
                            getBalance(self);
                        }
                    );
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    @theme-color-main: wheat;
    @theme-color-main-fade: rgba(245, 222, 179, 0.67);
    @theme-color-main-fade-2: rgba(245, 222, 179, 0.33);

    .spinner {
        position: fixed;
        top: 12px;
        left: 6px;
    }

    .progress-bar {
        position: fixed;
        top: 0;
        width: 100%;
        height: 3px;
    }

    .spinner /deep/ .md-progress-spinner-draw {
        stroke: @theme-color-main;
    }

    .progress-bar /deep/ .md-progress-bar-fill {
        background-color: @theme-color-main;
    }

    .panel-component-root, .panel.flex {
        width: 100vw;
    }

    .flex {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
    }

    .flex-line {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
    }

    .flex-block {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
    }

    .flex-panel {
        display: flex;
        justify-content: space-around;
        align-content: space-around;
        flex-direction: column;
    }

    .console {
        max-width: calc(100% - 50px);
    }
</style>
