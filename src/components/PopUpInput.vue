<template>
    <div id="pop-up">
        <div id="ani">
            <div class="ani panel panel-1">
            </div>
            <div class="ani panel panel-2">
            </div>
            <div class="ani panel panel-3">
            </div>
            <div class="ani panel panel-2">
            </div>
            <div class="ani panel panel-1">
            </div>
        </div>
        <div id="content" class="ani">
            <div id="content-internal" class="ani">
                <div class="title">
                    {{ title }}
                </div>
                <div class="comment">
                    {{ comment }}
                </div>
                <label for="bitcoin-address-ime">address</label>
                <input id="bitcoin-address-ime">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PopUpInput",
        props: ["title", "comment"],
        mounted: function () {
            let elements = this.$el.getElementsByClassName("ani");
            for (let i of elements) {
                i.style.animationPlayState = "running";
            }
            /* focus once not works here, this may caused by animation */
            window.addEventListener("keydown", function () {
                document.getElementById("bitcoin-address-ime").focus();
            });
        }
    };
</script>

<style lang="less" scoped>
    @initial-delay: 0.5s;
    @ani: 0.8s ease-in-out forwards paused;
    @theme-color-main: wheat;
    @theme-color-main-fade: rgba(245, 222, 179, 0.1);

    #bitcoin-address-ime {
        min-width: 34.2ch;
    }

    #pop-up {
        /* help animation element positioning */
        position: relative;
    }

    .title{
        font-size: 1.5em;
    }

    .comment{
        font-size: 0.8em;
        opacity: 0.8;
    }

    #ani {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        z-index: -65536;
    }

    .panel{
        height: 100%;
    }

    .panel-1 {
        animation: panel-1 @ani;
        animation-delay: @initial-delay;
    }

    .panel-2 {
        animation: panel-2 @ani;
        animation-delay: @initial-delay;
        background-color: @theme-color-main;
    }

    .panel-3 {
        animation: panel-3 @ani;
        animation-delay: @initial-delay;
    }

    #content {
        animation: content @ani;
        animation-delay: @initial-delay;
        visibility: hidden;
        padding: 1em 2em;
        border: @theme-color-main 1px solid;
        background-color: @theme-color-main-fade;
    }

    #content-internal{
        animation: content-internal @ani;
        animation-delay: @initial-delay;
        position: relative;
        top: 0;
    }

    @keyframes content {
        50% {
            visibility: hidden;
        }
        100% {
            visibility: visible;
        }
    }

    @keyframes content-internal {
        50% {
            top: 0.2em;
            opacity: 0;
        }
        100% {
            top: 0;
            opacity: 1;
        }
    }

    @keyframes panel-1 {
        0% {flex: 10000}
        55% {flex: 0}
    }

    @keyframes panel-2 {
        0% {flex: 0}
        45% {flex: 10000}
        55% {flex: 10000}
        100% {flex: 0}
    }

    @keyframes panel-3 {
        45% {flex: 0}
        100% {flex: 20000}
    }
</style>
