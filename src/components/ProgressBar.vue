<template>
    <div class="progress-bar-component-root">
        <!--suppress JSUnresolvedVariable -->
        <div
            id="bar"
            ref="bar"
            class="bar"
            :class="{'no-transition': noTransition}"
            :style="{
                'background-color': isError ? errorColor : color,
                'width': filteredProgress < 1 ? filteredProgress * 100 + '%' : '300%',
                'opacity': isError || filteredProgress < 1 ? '1' : '0'
            }"
        ></div>
    </div>
</template>

<script>
    import util from "../library/util";

    export default {
        name: "ProgressBar",
        props: {
            progress: {
                default: 0.5,
                type: Number
            },
            color: {
                default: "#F5DEB3",
                type: String
            },
            isError: {
                default: false,
                type: Boolean
            },
            errorColor: {
                default: "#f80",
                type: String
            }
        },
        data: function() {
            return {
                filteredProgress: this.progress,
                progressWatchInstanceCount: 0,
                noTransition: false
            };
        },
        watch: {
            progress: async function(now, past) {
                // keep single instance
                if (this.progressWatchInstanceCount > 1) {
                    return false;
                }
                this.progressWatchInstanceCount++;
                this.filteredProgress = this.progress;
                if (now < past) {
                    this.filteredProgress = 3;
                    await util.awaitTimeout(500);
                    this.noTransition = true;
                    await util.awaitTimeout(100);
                    this.filteredProgress = 0;
                    await util.awaitTimeout(100);
                    this.noTransition = false;
                    await util.awaitTimeout(100);
                    this.filteredProgress = this.progress;
                }
                this.progressWatchInstanceCount--;
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
        transition: width 3s ease-out, opacity 0.5s;
    }

    /*noinspection CssUnusedSymbol*/
    div.no-transition {
        transition: none;
    }
</style>
