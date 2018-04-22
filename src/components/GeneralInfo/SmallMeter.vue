<template>
    <div class="small-meter-component-root monospaced" :class="{fade: fade}">
        <svg :width="size" :height="size" fill="none">
            <path :d="borderDraw" stroke="wheat" :stroke-width="borderWidth" opacity="0.66"></path>
            <path :d="getPath()"
                  fill="wheat" opacity="0.33"></path>
            <text class="theme-color" :x="center * 2" :y="center * 0.95" :style="{'font-size': textSize1}">{{ stringifyValue(value) }}
            </text>
            <text class="theme-color" :x="center * 2" :y="center * 0.95 - textSize1" :style="{'font-size': textSize2}">{{ labelText }}
            </text>
        </svg>
    </div>
</template>

<script>
    import util from "../../library/util";

    export default {
        name: "small-meter",
        props: {
            size: {
                default: 100,
                type: Number
            },
            borderWidth: {
                default: 2,
                type: Number
            },
            value: {
                default: 0.73
            },
            valueMax: {
                default: 1.9
            },
            valueMin: {
                default: 0
            },
            valueDigit: {
                default: true,
                type: Boolean
            },
            labelText: {
                default: "Label",
                type: String
            }
        },
        data: function() {
            return {
                maxFixedCount: 0,
                fade: false
            };
        },
        mounted: function() {
            this.setStyle();
        },
        watch: {
            value: function() {
                this.setStyle();
            }
        },
        computed: {
            d: function() {
                return this.size - this.borderWidth;
            },
            r: function() {
                return this.d / 2;
            },
            center: function() {
                return this.size / 2;
            },
            halfBorder: function() {
                return this.borderWidth / 2;
            },
            halfSqrt2R: function() {
                return Math.sqrt(2) * this.r / 2;
            },
            borderDraw: function() {
                return [
                    "M", this.d + this.borderWidth / 2, this.center,
                    "A", this.r, this.r, 0, 1, 1, this.center - this.halfSqrt2R, this.center - this.halfSqrt2R
                ].join(" ");
            },
            textSize1: function() {
                return (this.size / 3 - 5) / (this.stringifyValue(this.value).length / 3);
            },
            textSize2: function() {
                return Math.min((this.size / 7 - 5) / (this.labelText.toString().length / 7), 12000);
            },
            filteredValue: function() {
                if (typeof (this.value) !== "number") {
                    return this.valueMin;
                }
                if (this.value - this.valueMin > (this.valueMax - this.valueMin) / 225 * 360) {
                    // This formula was done by simple math.
                    return (-359.999 / 225 * (this.valueMax - this.valueMin)) + this.valueMin;
                }
                if (this.value < this.valueMin) {
                    return this.valueMin;
                }
                return this.value;
            }
        },
        methods: {
            getPath: function() {
                return util.sweepPath(this.center, this.center, this.r, 0, -((this.filteredValue - this.valueMin) / (this.valueMax - this.valueMin)) * 225);
            },
            setStyle: function() {
                this.fade = (this.value === "×" || this.value === "----");
            },
            stringifyValue: function(value) {
                if (typeof (value) === "number") {
                    let valueString = value.toString();
                    let sign = value >= 0 ? "" : "-";
                    let intPart = Math.abs(value).toString().split(".")[0];
                    let fixedPart = "";

                    intPart = intPart === "0" ? "" : intPart;

                    if (valueString.split(".").length > 1) {
                        fixedPart = valueString.split(".")[1];
                    }
                    if (fixedPart.toString().length > this.maxFixedCount) {
                        this.maxFixedCount = fixedPart.toString().length;
                    }
                    fixedPart = util.padZero(fixedPart, this.maxFixedCount);

                    if (fixedPart.length > 0) {
                        return [
                            sign,
                            intPart,
                            ".",
                            fixedPart
                        ].join("");
                    } else {
                        return [
                            sign,
                            intPart
                        ].join("");
                    }
                } else {
                    return value;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    .small-meter-component-root {
        transition: opacity ease-out 1s;
    }

    text {
        font-size: 16px;
        text-anchor: end;
    }

    .fade {
        opacity: 0.2;
    }
</style>
