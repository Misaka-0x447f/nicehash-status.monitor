<template>
    <div class="label-number-component-root" :class="{fade: fade}">
        <div :width="width + 'px'">
            <div class="digital monospaced">
                {{stringifyValue(value)[0]}}<span class="small">{{stringifyValue(value)[1]}}</span>
            </div>
            <div class="label monospaced">
                {{label}}
            </div>
        </div>
    </div>
</template>

<script>
    import util from "../../library/util";

    export default {
        name: "label-number",
        props: {
            width: {
                default: 400,
                type: Number
            },
            value: {
                default: "True"
            },
            label: {
                default: "Lorem ipsum",
                type: String
            },
            textAlign: {
                default: "left",
                type: String
            }
        },
        data: function() {
            return {
                maxFixedCount: 0,
                fade: false
            };
        },
        watch: {
            value: function() {
                this.setStyle();
            }
        },
        mounted: function() {
            this.setStyle();
        },
        methods: {
            stringifyValue: function(value) {
                let digit = value.toString().split(".");
                let integer = digit[0];
                let fixed = "";
                if (digit.length > 1) {
                    fixed = digit[1];
                }
                if (fixed.length > this.maxFixedCount) {
                    this.maxFixedCount = fixed.length;
                }

                return [
                    integer,
                    util.padZero(fixed, this.maxFixedCount)
                ];
            },
            setStyle() {
                this.fade = (this.value === "×" || this.value === "----");
            }
        }
    };
</script>

<style lang="less" scoped>
    .label-number-component-root {
        display: block;
        min-width: 10em;
    }

    .digital {
        font-size: 3em;
        line-height: 0.9;
        text-align: right;
        .small {
            font-size: 0.5em;
        }
    }

    .label {
        font-size: 0.8em;
    }

    .fade {
        opacity: 0.3;
    }
</style>
