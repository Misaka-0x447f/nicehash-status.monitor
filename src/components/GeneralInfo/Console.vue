<template>
    <div class="console-component-root theme-color-fade-2">
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
    .console-component-root{
        position: fixed;
        top: 12px;
        width: 100%;
        font-size: 0.6em;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
</style>
