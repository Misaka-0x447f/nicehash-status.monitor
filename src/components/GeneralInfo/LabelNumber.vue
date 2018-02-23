<template>
    <div class="component-root">
        <div class="digital monospaced">
            {{stringifyValue(value)[0]}}<span class="small">{{stringifyValue(value)[1]}}</span>
        </div>
        <div class="label monospaced">
            {{label}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "label-number",
        props: {
            value: {
                default: "True",
                type: String
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
                maxFixedCount: 0
            };
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
                    this.padZero(fixed, this.maxFixedCount)
                ];
            },
            padZero: function(source, counts) {
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
</style>
