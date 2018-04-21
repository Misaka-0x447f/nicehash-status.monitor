<template>
    <div class="progress-bar-component-root">
        <div
            id="bar"
            class="bar"
            :class="{noTransition: noTransition}"
            :style="{
                'background-color': isError ? errorColor : color,
                'width': progress < 1 ? progress * 100 + '%' : '300%',
                'opacity': isError || progress < 1 ? '1' : '0'
            }"
        ></div>
    </div>
</template>

<script>
    import util from "../library/util";

    export default {
        name: "ProgressBar",
        props: [
            "progress",
            "color",
            "isError",
            "errorColor"
        ],
        data: function() {
            return {
                noTransition: false
            };
        },
        watch: {
            progress: async function(now, past) {
                if (now < past) {
                    this.noTransition = true;
                    let sto = this.progress;
                    this.progress = 0;
                    util.flushCss(this.getElementById("bar"));
                    this.noTransition = false;
                    util.flushCss(this.getElementById("bar"));
                    this.progress = sto;
                } else {
                    this.noTransition = false;
                }
            }
        }
    };
</script>

<style scoped>
    .progress-bar-component-root {
        position: fixed;
        top: 0;
        height: 3px;
        width: 100%;
        background-color: initial;
    }

    .bar {
        height: 3px;
        width: 0;
        transition: width 5s ease-out, opacity 1s;
    }

    div.noTransition {
        transition: none;
    }
</style>
