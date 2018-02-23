<template>
    <div class="component-root">
        <svg :width="size" :height="size" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <!--foreground-->
            <mask id="mask1">
                <rect x="0" y="0" :width="size" :height="size" fill="white"/>
                <circle :cx="center" :cy="center" :r="r" fill="grey"/>
                <circle :cx="center" :cy="center" :r="r - halfBorder" fill="black"/>
                <polygon :points="initialMaskPoint" fill="black"/>
                <rect :x="center - halfSqrt2R" :y="center" :width="2 * halfSqrt2R" :height="size" fill="black"/>
                <rect x="0" :y="center + halfSqrt2R" :width="size" :height="size" fill="black"/>
                <path id="arc_mask" :d="progressMask" fill="black"/>
            </mask>
            <!--background-->
            <mask id="mask2">
                <rect x="0" y="0" :width="size" :height="size" fill="white"/>
                <circle :cx="center" :cy="center" :r="r" fill="grey"/>
                <circle :cx="center" :cy="center" :r="r - halfBorder" fill="black"/>
                <polygon :points="initialMaskPoint" fill="black"/>
                <rect :x="center - halfSqrt2R" :y="center" :width="2 * halfSqrt2R" :height="size" fill="black"/>
                <rect x="0" :y="center + halfSqrt2R" :width="size" :height="size" fill="black"/>
                <path id="arc_mask2" d="" fill="black"/>
            </mask>

            <circle class="paint1" :cx="center" :cy="center" :r="r + borderWidth / 2" mask="url(#mask1)" style="opacity: 0.8"/>
            <circle class="paint1" :cx="center" :cy="center" :r="r + borderWidth / 2" mask="url(#mask2)" style="opacity: 0.15"/>

            <text v-if="valueDigit" class="paint1 monospaced" id="value1" :x="center" :y="center" :style="{'font-size': valueFontSize}">
                {{ stringifyValue(value) }}
            </text>
            <text class="paint1" id="label1 monospaced" :x="center" :y="center + halfSqrt2R">
                {{ labelText }}
            </text>
        </svg>
    </div>
</template>

<script>
    export default {
        name: "sharp-meter",
        props: {
            size: {
                default: 300,
                type: Number
            },
            borderWidth: {
                default: 10,
                type: Number
            },
            value: {
                default: 25,
                type: Number
            },
            valueMax: {
                default: 100,
                type: Number
            },
            valueMin: {
                default: 0,
                type: Number
            },
            valueDigit: {
                default: false,
                type: Boolean
            },
            labelText: {
                default: "",
                type: String
            }
        },
        computed: {
            d: function () {
                return this.size - this.borderWidth;
            },
            r: function () {
                return this.d / 2;
            },
            center: function () {
                return this.size / 2;
            },
            halfBorder: function () {
                return this.borderWidth / 2;
            },
            initialMaskPoint: function () {
                // 0,200 100,100 200,200
                return "0," + this.size + " " +
                    this.center + "," + this.center + " " +
                    this.size + "," + this.size;
            },
            halfSqrt2R: function () {
                return Math.sqrt(2) * this.r / 2;
            },
            progressMask: function () {
                return this.sweepPath(this.center, this.center, this.center + 1, -45, 270 * (1 - (this.filteredValue - this.valueMin) / (this.valueMax - this.valueMin)));
            },
            valueFontSize: function () {
                return (this.size / 24 + 50) / (this.stringifyValue(this.value).length / 2);
            },
            filteredValue: function () {
                if (this.value > this.valueMax) {
                    return this.valueMax;
                }
                if (this.value < this.valueMin) {
                    return this.valueMin;
                }
                return this.value;
            }
        },
        data: function () {
            return {
                maxFixedCount: 0
            };
        },
        methods: {
            arcPath: function (centerX, centerY, r, start, duration) {
                // This function will throw back a string in path syntax for using. All angle unit are Degree.
                function polarToRect (centerX, centerY, r, angleInDegrees) {
                    // angleInDegrees starts at the top of circle
                    let angleInRadians = angleInDegrees * Math.PI / 180.0;

                    return {
                        x: centerX + (r * Math.cos(angleInRadians)),
                        // NOT mathematical coordinate
                        y: centerY - (r * Math.sin(angleInRadians))
                    };
                }

                let startPos = polarToRect(centerX, centerY, r, start);
                let endPos = polarToRect(centerX, centerY, r, start + duration);
                let rotation = Math.floor(Math.abs(duration) / 180) % 2 === 0 ? 0 : 1;
                return [
                    "L", startPos.x, startPos.y,
                    // A rx ry x-axis-rotation large-arc-flag sweep-flag x         y
                    "A", r, r, 0, rotation, duration > 0 ? 0 : 1, endPos.x, endPos.y
                ].join(" ");
            },
            sweepPath: function (centerX, centerY, r, start, duration) {
                return [
                    "M", centerX, centerY,
                    this.arcPath(centerX, centerY, r, start, duration),
                    "L", centerX, centerY
                ].join(" ");
            },
            stringifyValue: function (value) {
                let digit = value.toString().split(".");
                let integer = digit[0];
                let fixed = "";
                if (digit.length > 1) {
                    fixed = digit[1];
                }
                if (fixed.length > this.maxFixedCount) {
                    this.maxFixedCount = fixed.length;
                }

                if (this.maxFixedCount > 0) {
                    return [
                        integer,
                        ".",
                        this.padZero(fixed, this.maxFixedCount)
                    ].join("");
                } else {
                    return integer;
                }
            },
            padZero: function (source, counts) {
                // A simple and easy to understand pad zero function.
                while (source.length < counts) {
                    source += "0";
                }
                return source;
            }
        }
    };
</script>

<style lang="less" scoped>
    @theme-color-main: wheat;
    @theme-color-main-fade: rgba(245, 222, 179, 0.67);
    @theme-color-main-fade-2: rgba(245, 222, 179, 0.33);

    .component-root {
        display: flex;
    }

    .paint1 {
        fill: @theme-color-main;
    }

    #label1 {
        font-size: 14px;
    }

    text {
        font-size: 50px;
        text-anchor: middle;
        alignment-baseline: central;
    }
</style>
