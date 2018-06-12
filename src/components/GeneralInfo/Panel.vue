<template>
    <transition name="trans" appear>
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
                <div class="panel-2 flex-block" v-if="renderWorkerDetail">
                    <worker
                        v-bind="workerListContainer"
                    ></worker>
                </div>
                <console class="console"></console>
            </div>
            <progress-bar
                :progress="progress / progressMax"
                :isError="this.progressOnError"
            >
            </progress-bar>
            <md-progress-spinner
                md-mode="indeterminate"
                :md-diameter="parseInt('20')"
                :md-stroke="parseFloat('2')"
                v-if="progress < progressMax"
                class="spinner"
            >
            </md-progress-spinner>
        </div>
    </transition>
</template>

<script>
    import * as Cookies from "es-cookie";
    import throttle from "throttle-debounce/throttle";

    import Nicehash from "../../library/nicehash";
    import util from "../../library/util";

    import SmallMeter from "./SmallMeter";
    import LabelNumber from "./LabelNumber";
    import Console from "./Console";
    import Worker from "./Worker";
    import ProgressBar from "../ProgressBar";

    import "vue-material/dist/vue-material.min.css";

    export default {
        components: {
            ProgressBar,
            Worker,
            Console,
            LabelNumber,
            SmallMeter
        },
        name: "panel",
        data: function() {
            let data = {
                renderWorkerDetail: true,
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
                algoLibPromiseServer: {
                    resolve: () => {
                    },
                    reject: () => {
                    },
                    isResolved: false
                },
                progress: 0,
                progressMax: 15,
                progressOnError: false
            };
            data.algoLibPromise = new Promise((resolve, reject) => {
                data.algoLibPromiseServer.resolve = resolve;
                data.algoLibPromiseServer.reject = reject;
            });
            return data;
        },
        computed: {
            currentProfIndicator: function() {
                return {
                    width: this.panelSize / 2,
                    value: this.currentProf,
                    label: "CNY/mo 2hr-Prof"
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
                    valueMin: -5,
                    valueMax: 5,
                    labelText: "profDiff%"
                };
            },
            efficiencyIndicator: function() {
                return {
                    size: this.panelSize / 3,
                    value: this.efficiency,
                    valueMin: 98,
                    valueMax: 100,
                    labelText: "efficiency%"
                };
            }
        },
        mounted: function() {
            this.nicehash.queueMode();
            this.checkCookie();
            this.setStyle();
            window.addEventListener("resize", resizeMe.bind(this));
            function resizeMe() {
                // this function cannot be used in other place.
                // noinspection JSPotentiallyInvalidUsageOfThis
                throttle(75, this.setStyle);
            }
            // continues after cookie checked.
        },
        methods: {
            checkCookie: async function() {
                if (typeof Cookies.get("key") === "string") {
                    // key set. total balance is available.
                    this.totalBalance = "----";
                }

                let addr = Cookies.get("address");
                if ((await util.checkAddress(addr)) === "true") {
                    this.nicehash.setAddress(addr);
                    this.runAsyncQuery();
                    setInterval(this.runAsyncQuery, 180000);
                } else {
                    this.$router.push("/setup");
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
                    this.renderWorkerDetail = false;
                } else if (document.body.clientWidth < 960) {
                    this.panelSize = (document.body.clientWidth - 720) * 300 / 720 + 300 - 10;
                    // 300 -> 400. -10px reduces flashing
                    this.renderWorkerDetail = false;
                } else {
                    this.panelSize = 400;
                    this.renderWorkerDetail = true;
                }
            },
            runAsyncQuery: async function() {
                // comes from stat
                this.mass = {
                    "init": 1.216,
                    "priceBTC": 1.216,
                    "priceBTCCNY": 1.036,
                    "statsProvider": 5.731,
                    "statsProviderEx": 1.729,
                    "statsProviderWorkers": 1.027,
                    "balance": 5.338
                };
                if (typeof Cookies.get("key") !== "string") {
                    this.mass.balance = 0;
                }
                this.progress = this.mass.init;
                this.progressMax = util.sum(this.mass);
                this.progressOnError = false;

                /***
                 * priceBTC
                 * priceBTCCNY
                 *  statsProvider
                 *  statsProviderEx
                 *   statsProviderWorker
                 *  balance
                 */

                Promise.all([
                    (async() => {
                        /* bitcoinPrice */
                        this.bitcoinPrice =
                            (await this.nicehash.getPriceBitcoin()).result.data.amount;
                        this.progress += this.mass.priceBTC;
                    })(),
                    (async() => {
                        /* bitcoinPriceCNY */
                        this.bitcoinPriceCNY =
                            (await this.nicehash.getPriceBitcoin("CNY")).result.data.amount;
                        this.progress += this.mass.priceBTCCNY;

                        (async() => {
                            /* getProvider */
                            let response =
                                await this.nicehash.getProvider();
                            this.progress += this.mass.statsProvider;
                            util.jsonCheck(response, ["result.stats"]);
                            let stats = response.result.stats;
                            let unpaidBalanceSum = 0;
                            for (let i of stats) {
                                unpaidBalanceSum += parseFloat(i["balance"]);
                            }
                            this.unpaidBalance = (unpaidBalanceSum * this.bitcoinPriceCNY).toFixed(2);
                        })();

                        (async() => {
                            /* getProviderEx */
                            let response =
                                await this.nicehash.getProviderEx();
                            this.progress += this.mass.statsProviderEx;
                            this.getProviderExProcessor(response);
                            (async() => {
                                /* getProviderWorker */
                                let response =
                                    await this.nicehash.getProviderWorkers();
                                this.progress += this.mass.statsProviderWorkers;
                                this.getProviderWorkerProcessor(response);
                            })();
                        })();

                        (async() => {
                            /* getBalance */
                            let key = Cookies.get("key");
                            if (typeof key !== "string") {
                                return false;
                            }
                            let response =
                                await this.nicehash.getBalance(key);
                            this.progress += this.mass.balance;
                            let value =
                                (
                                    parseFloat(response["result"]["balance_pending"]) * this.bitcoinPriceCNY +
                                    parseFloat(response["result"]["balance_confirmed"]) * this.bitcoinPriceCNY
                                ).toFixed(2)
                            ;
                            if (util.isNumeric(value)) {
                                this.totalBalance = value;
                            }
                        })();
                    })()
                ]).catch(error => {
                    this.progress = this.progressMax;
                    this.progressOnError = true;
                    throw error;
                });
            },
            getProviderExProcessor: async function(response) {
                util.jsonCheck(response, ["result.current"]);
                let currentStatus = response.result.current;
                let algoLib = {};

                if (!this.algoLibPromiseServer.isResolved) {
                    // parse/update algoLib
                    for (let i of currentStatus) {
                        algoLib[i["algo"]] = {
                            "name": i.name,
                            "profitability": i.profitability,
                            "suffix": i.suffix
                        };
                    }

                    // AlgoLib is ready.
                    this.algoLibPromiseServer.resolve(algoLib);
                    this.algoLibPromiseServer.isResolved = true;
                }

                // merge & process past data
                let pastData = {}; // unit: bitcoins
                for (let i = util.getUnixTimeStamp(); i > util.getUnixTimeStamp(86400 * 2); i -= 300) {
                    pastData[i - i % 300] = await this.getProviderExPastProfitabilityProcessor(response, i);
                }

                let data = {
                    "hr2": this.getXhrsData(pastData, 0, 2),
                    "today": this.getXhrsData(pastData, 0, 24),
                    "yesterday": this.getXhrsData(pastData, 24, 48)
                };

                let profDiff = parseFloat(((data.today.accepted / data.yesterday.accepted - 1) * 100).toFixed(2));

                this.profDiff = (util.isNumeric(profDiff) ? profDiff : "  N/A");
                this.currentProf = (data.hr2.accepted * this.bitcoinPriceCNY * 30).toFixed(2);
                this.averageProf = (data.today.accepted * this.bitcoinPriceCNY * 30).toFixed(2);
                this.efficiency = parseFloat(
                    (data.today.accepted / (data.today.accepted + data.today.rejected) * 100).toFixed(2)
                );
            },
            getXhrsData: function(arr, thisTime, thatTime) {
                /**
                 * this function gets a history range and returns its accepted/rejected data.
                 * @param {object} arr
                 * The data source. It should seems like this:
                 *  {
                 *      (timestamp): {
                 *          accepted: (accepted hash in bitcoins),
                 *          rejected: (rejected one)
                 *      },
                 *      ...
                 *  }
                 * timestamp must to be an integer and timestamp % 300 must be 0.
                 *
                 * @param {object} thisTime, thatTime
                 * time range in hours for calculate average. thisTime should be less that thatTime.
                 *
                 * @return
                 *  {
                 *      accepted: (accepted hash power in bitcoins.),
                 *      rejected: (rejected one.)
                 *  }
                 */
                let now = util.getUnixTimeStamp();
                let accepted = [];
                let rejected = [];
                for (let i = now - now % 300 - 3600 * thisTime; i >= util.getUnixTimeStamp(3600 * thatTime); i -= 300) {
                    accepted.push(arr[i].accepted);
                    rejected.push(arr[i].rejected);
                }

                return {
                    accepted: util.avg(accepted),
                    rejected: util.avg(rejected)
                };
            },
            getProviderExPastProfitabilityProcessor: async function(response, unixTimeStamp) {
                /**
                 * @Return
                 * (Object).accepted - in bitcoins
                 * (Object).rejected
                 *
                 * TimeStamp can be safely defined as any integer here.
                 *
                 * ↓ this works for me (to disable undefined alert)
                 * @property {object} response
                 * @property {object} response.result
                 * @property {object} response.current
                 * @property {object[]} response.past
                 */
                let past = response.result.past;

                let prof = 0;
                let reject = 0;
                for (let i of past) {
                    /**
                     * this jsdoc fixed undefined "i.algo"
                     * @property {object[]} i
                     * @property {string} i.algo
                     */
                    // single algo
                    for (let j of i.data) {
                        // Single timestamp. This will find the sample point we want.
                        // If failed to locate, no data at this point and prof keeps zero.
                        if (j[0] === Math.floor(unixTimeStamp / 300)) {
                            let value = j[1];
                            if (j[1].hasOwnProperty("a")) {
                                let singlePointProf = (await this.algoLibPromise)[i.algo].profitability * parseFloat(j[1].a);
                                if (util.isNumeric(singlePointProf)) {
                                    prof += singlePointProf;
                                }
                                delete value.a;
                            }
                            value = Object.values(value);
                            if (Object.keys(value).length > 0) {
                                for (let k of value) {
                                    let singleReject = (await this.algoLibPromise)[i.algo].profitability * parseFloat(k);
                                    if (util.isNumeric(singleReject)) {
                                        reject += singleReject;
                                    }
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
            },
            getProviderWorkerProcessor: async function(response) {
                util.jsonCheck(response, ["result.workers"]);
                let workers = response.result.workers;
                let workerSet = [];

                // merging count: counting how many unique workers
                for (let i of workers) {
                    if (workerSet.indexOf(i[0]) === -1) {
                        workerSet = workerSet.concat(i[0]);
                    }
                }
                this.activeWorker = workerSet.length;

                // listing: list all workers including who using same name
                workerSet = [];
                for (let i of workers) {
                    let accepted = 0;
                    let rejected = 0;
                    let speedObject = i[1];

                    if (speedObject.hasOwnProperty("a")) {
                        accepted = parseFloat(speedObject.a);
                        delete speedObject.a;
                    }

                    for (let j in speedObject) {
                        if (speedObject.hasOwnProperty(j)) {
                            rejected += parseFloat(speedObject[j]);
                        }
                    }
                    workerSet = workerSet.concat({
                        key: workerSet.length,
                        workerName: i[0],
                        algorithm: (await this.algoLibPromise)[i[6]].name,
                        accepted: accepted,
                        rejected: rejected,
                        suffix: (await this.algoLibPromise)[i[6]].suffix
                    });
                }
                workerSet.sort(function(a, b) {
                    return a.workerName.localeCompare(b.workerName);
                });
                this.workerListContainer.workerList = workerSet;
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../../color";

    .trans-enter-active, .trans-leave-active {
        transition: opacity ease-out 2s;
    }

    .trans-enter, .fade-leave-to {
        opacity: 0;
    }

    .spinner {
        position: fixed;
        top: 12px;
        left: 6px;
    }

    .spinner /deep/ .md-progress-spinner-draw {
        stroke: @theme-color-main;
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
