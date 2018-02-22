<template>
    <div class="component-root">
        <svg :width="size" :height="size" fill="none">
            <path :d="borderDraw" stroke="wheat" :stroke-width="borderWidth" opacity="0.66"></path>
            <path :d="sweepPath(center, center, r, 0, -(value / valueMax) * 225)" fill="wheat" opacity="0.33"></path>
            <text :x="center * 2" :y="center * 0.95" :style="{'font-size': textSize1}">{{ value }}</text>
            <text :x="center * 2" :y="center * 0.95 - textSize1" :style="{'font-size': textSize2}">{{ labelText }}</text>
        </svg>
    </div>
</template>

<script>
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
                default: 0.73,
                type: Number
            },
            valueMax: {
                default: 1.9,
                type: Number
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
        data: function () {
            let rawTextSize2 = (this.size / 7 - 5) / (this.labelText.toString().length / 7);
            return {
                textSize1: (this.size / 3 - 5) / (this.value.toString().length / 3),
                textSize2: Math.min(rawTextSize2, 12000)
            };
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
            halfSqrt2R: function () {
                return Math.sqrt(2) * this.r / 2;
            },
            borderDraw: function () {
                return [
                    "M", this.d + this.borderWidth / 2, this.center,
                    "A", this.r, this.r, 0, 1, 1, this.center - this.halfSqrt2R, this.center - this.halfSqrt2R
                ].join(" ");
            }
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
            }
        }
    };
</script>

<style lang="less" scoped>
    @theme-color-main: wheat;
    @theme-color-main-fade: rgba(245, 222, 179, 0.67);
    @theme-color-main-fade-2: rgba(245, 222, 179, 0.33);
    @theme-color-main-fade-3: rgba(245, 222, 179, 0.1);

    text{
        fill: @theme-color-main;
        font-size: 16px;
        alignment-baseline: baseline;
        text-anchor: end;
    }
</style>
