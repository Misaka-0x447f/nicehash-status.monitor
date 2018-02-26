<template>
    <div class="component-root">
        <div class="console monospaced" :style="{maxWidth: size + 'px', maxHeight: size + 'px'}">
            {{log}}
        </div>
    </div>
</template>

<script>
    import Nicehash from "../../library/nicehash";

    export default {
        name: "console",
        data: function() {
            return {
                log: "<disconnected>"
            };
        },
        mounted: function() {
            setInterval(() => {
                this.log = Nicehash.getLogger();
            }, 25);
        }
    };
</script>

<style lang="less" scoped>
    @theme-color-main: wheat;
    @theme-color-main-fade: rgba(245, 222, 179, 0.67);
    @theme-color-main-fade-2: rgba(245, 222, 179, 0.33);
    .console {
        color: @theme-color-main;
        opacity: 0.66;
    }
    .component-root{
        position: absolute;
        bottom: 2em;
        left: 0;
        width: 100%;
        font-size: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: @theme-color-main;
    }
</style>
