<template>
    <div id="pop-up">
        <div id="ani">
            <div id="ani-left-panel" class="ani">

            </div>
            <div id="ani-center-panel" class="ani">

            </div>
            <div id="ani-right-panel" class="ani">

            </div>
        </div>
        <div id="content" class="ani">
            <div id="content-internal" class="ani">
                {{ title }}
                <div>
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
            let elements = this.$el.querySelectorAll(".ani");
            for (let i of elements) {
                i.style.animationPlayState = "running";
            }
        }
    };
</script>

<style lang="less" scoped>
    @initial-delay: 0.5s;
    @ani: 0.8s ease-in-out forwards paused;
    @theme-color-main: wheat;

    #bitcoin-address-ime {
        min-width: 34.2ch;
    }

    #pop-up {
        /* help animation element positioning */
        position: relative;
    }

    #ani {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        z-index: -65536;
    }

    #ani-left-panel, #ani-right-panel {
        animation: side @ani;
        animation-delay: @initial-delay;
        height: 100%;
    }

    #ani-center-panel {
        animation: center @ani;
        animation-delay: @initial-delay;
        height: 100%;
    }

    #content {
        animation: content @ani;
        animation-delay: @initial-delay;
        visibility: hidden;
        padding: 1em 2em;
        border: @theme-color-main 1px solid;
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
            top: 0.5em;
        }
        100% {
            top: 0;
        }
    }

    @keyframes side {
        0% {
            flex: 100;
            background: none;
        }
        49.999% {
            flex: 0;
            background: none;
        }
        50% {
            flex: 100;
            background: @theme-color-main;
        }
        100% {
            flex: 0;
            background: @theme-color-main;
        }
    }

    @keyframes center {
        0% {
            flex: 0;
            background: @theme-color-main;
        }
        49.999% {
            flex: 200;
            background: @theme-color-main;
        }
        50% {
            flex: 0;
            background: none;
        }
        100% {
            flex: 200;
            background: none;
        }
    }
</style>
