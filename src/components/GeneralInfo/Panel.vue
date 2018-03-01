<template>
    <div class="panel-component-root">
        <div class="panel flex">
            <div class="panel-1 flex-block">
                <div class="flex-panel">
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
        </div>
        <console></console>
    </div>
</template>

<script>
    import Nicehash from "../../library/nicehash";
    import * as Cookies from "es-cookie";

    import SmallMeter from "./SmallMeter";
    import LabelNumber from "./LabelNumber";
    import Console from "./Console";
    import Worker from "./Worker";

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
                    workerList: [
                        {
                            workerName: "connecting..."
                        }
                    ]
                }
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
            },
            setStyle: function() {
                let flexPanel = this.$el.querySelectorAll(".flex-panel");
                for (let i of flexPanel) {
                    i.style.flexBasis = this.panelSize * 1.2 + "px";
                    i.style.minHeight = this.panelSize * 1.1 + "px";
                }
                let flexBlock = this.$el.querySelectorAll(".flex-block");
                for (let i of flexBlock) {
                    i.style.flexBasis = this.panelSize * 1.2 + "px";
                }
            },
            runAsyncQuery: function() {
                priceBTCCNY(this);
                priceBTC(this);
                getProviderWorker(this);

                function priceBTCCNY(self) {
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
                    self.currentProf = parseFloat((currentProf * self.bitcoinPriceCNY).toFixed(2));

                    /*************************************/

                    let bitcoinPriceCNY = self.bitcoinPriceCNY;

                    let pastProf1 = [];
                    let pastReje1 = [];
                    for (let i = Nicehash.getUnixTimeStamp(); i > Nicehash.getUnixTimeStamp(86400); i -= 300) {
                        let query = getPastProfitability(response, i);
                        pastProf1.push(query["accepted"] * bitcoinPriceCNY);
                        pastReje1.push(query["rejected"] * bitcoinPriceCNY);
                    }
                    let pastProf2 = [];
                    for (let i = Nicehash.getUnixTimeStamp(86400); i > Nicehash.getUnixTimeStamp(86400 * 2); i -= 300) {
                        pastProf2.push(getPastProfitability(response, i)["accepted"] * bitcoinPriceCNY);
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
                    self.profDiff = parseFloat((((sum1 / count1) / (sum2 / count2) - 1) * 100).toFixed(2));

                    function sum(array) {
                        return array.reduce((a, b) => {
                            return a + b;
                        }, 0);
                    }

                    self.efficiency = parseFloat((sum(pastProf1) / (sum(pastProf1) + sum(pastReje1)) * 100).toFixed(2));
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
                    let reject = 0;
                    for (let i of past) {
                        // single algo
                        let foundFlag = false;
                        for (let j of i.data) {
                            // single timestamp
                            if (j[0] === Math.floor(unixTimeStamp / 300)) {
                                foundFlag = true;
                                let value = j[1];
                                if (j[1].hasOwnProperty(["a"])) {
                                    prof += algoLib[i["algo"]]["profitability"] * parseFloat(j[1]["a"]);
                                    delete value["a"];
                                }
                                value = Object.values(value);
                                if (Object.keys(value).length > 0) {
                                    for (let k of value) {
                                        reject += algoLib[i["algo"]]["profitability"] * parseFloat(k);
                                    }
                                }
                                break;
                            }
                        }
                        if (foundFlag === false) {
                            return false;
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
                            // worker count
                            let workers = response.result.workers;
                            let workerSet = [];
                            for (let i of workers) {
                                if (workerSet.indexOf(i[0]) === -1) {
                                    workerSet = workerSet.concat([i[0]]);
                                }
                            }
                            self.activeWorker = workerSet.length;
                            // worker list
                            workerSet = [];
                            let algoNames = {
                                0: "Scrypt",
                                1: "SHA256",
                                2: "ScryptNf",
                                3: "X11",
                                4: "X13",
                                5: "Keccak",
                                6: "X15",
                                7: "Nist5",
                                8: "NeoScrypt",
                                9: "Lyra2RE",
                                10: "WhirlpoolX",
                                11: "Qubit",
                                12: "Quark",
                                13: "Axiom",
                                14: "Lyra2REv2",
                                15: "ScryptJaneNf16",
                                16: "Blake256r8",
                                17: "Blake256r14",
                                18: "Blake256r8vnl",
                                19: "Hodl",
                                20: "DaggerHashimoto",
                                21: "Decred",
                                22: "CryptoNight",
                                23: "Lbry",
                                24: "Equihash",
                                25: "Pascal",
                                26: "X11Gost",
                                27: "Blake2b(Sia)",
                                28: "Blake2s",
                                29: "Skunk"
                            };
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
                                    algorithm: algoNames[i[6]],
                                    accepted: accepted,
                                    rejected: rejected
                                });
                                counter++;
                            }
                            workerSet.sort(function(a, b) {
                                return a.workerName > b.workerName;
                            });
                            console.log(workerSet);
                            self.workerListContainer.workerList = workerSet;
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
    .panel-component-root, .panel.flex {
        width: 100vw;
        height: 100vh;
    }

    .flex, .flex-block {
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
</style>
