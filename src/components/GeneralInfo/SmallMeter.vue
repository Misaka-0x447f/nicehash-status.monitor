<template>
    <div class="small-meter-component-root" :class="{fade: fade}">
        <svg :width="size" :height="size" fill="none">
            <path :d="borderDraw" class="stroke-color" :stroke-width="borderWidth" opacity="0.33"></path>
            <path :d="getPath(animatedValue, this.valueMin, this.valueMax)"
                  class="fill-color" opacity="0.33"></path>
            <text class="fill-color digit" :x="center * 2" :y="center * 0.95" :style="{'font-size': textSize1}">{{ animatedValueLimited }}
            </text>
            <text class="fill-color monospaced" :x="center * 2" :y="center * 0.95 - textSize1" :style="{'font-size': textSize2}">{{ labelText }}
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
                default: 0
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
                fade: false,
                animatedValue: this.valueMin,
                animatedValueLimited: ""
            };
        },
        mounted: function() {
            this.setStyle();
            setInterval(() => {
                if (util.isNumeric(this.value)) {
                    let n = this.value.toString().split(".");
                    if (n.hasOwnProperty(1)) {
                        n = n[1].length;
                    } else {
                        n = 0;
                    }
                    let valueChange = (this.value - this.animatedValue) / 10;
                    this.animatedValue += valueChange;
                    // settling the value
                    if (Math.abs(valueChange) < Math.pow(10, -n - 1)) {
                        this.animatedValueLimited = this.stringifyValue(parseFloat(this.value.toFixed(n)));
                    } else {
                        this.animatedValueLimited = this.stringifyValue(parseFloat(this.animatedValue.toFixed(n)));
                    }
                } else {
                    this.animatedValue = this.valueMin;
                    this.animatedValueLimited = "";
                }
            }, 25);
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
            halfSqrt2R: function() {
                return Math.sqrt(2) * this.r / 2;
            },
            borderDraw: function() {
                return `M ${this.d + this.borderWidth / 2} ${this.center}
                        A ${this.r} ${this.r} 0 1 1 ${this.center - this.halfSqrt2R} ${this.center - this.halfSqrt2R}`;
            },
            textSize1: function() {
                return (this.size / 3 - 5) / ((this.animatedValueLimited.length < 5 ? 5 : this.animatedValueLimited.length) / 3);
            },
            textSize2: function() {
                return Math.min((this.size / 7 - 5) / (this.labelText.toString().length / 7), 12000);
            }
        },
        methods: {
            getPath: function(value, valueMin, valueMax) {
                return util.sweepPath(this.center, this.center, this.r, 0, -((this.filterValue(value, valueMin, valueMax) - valueMin) / (valueMax - valueMin)) * 225);
            },
            filterValue: function(value, valueMin, valueMax) {
                if (!util.isNumeric(value)) {
                    return valueMin;
                }
                if (value - valueMin > (valueMax - valueMin) / 225 * 360) {
                    // This formula was done by simple math.
                    return (-359.999 / 225 * (valueMax - valueMin)) + valueMin;
                }
                if (value < valueMin) {
                    return valueMin;
                }
                return value;
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
                        return `${sign}${intPart}.${fixedPart}`;
                    } else {
                        return sign + intPart;
                    }
                } else {
                    return value;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "../../color";

    .stroke-color {
        stroke: @theme-color-main
    }

    .fill-color {
        fill: @theme-color-main
    }

    .font-color {
        color: @theme-color-main
    }

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
