<template>
    <div class="console-component-root">
        <div class="console monospaced">
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
    .console-component-root{
        position: fixed;
        top: 12px;
        width: 100%;
        font-size: 0.6em;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: @theme-color-main;
    }
</style>
