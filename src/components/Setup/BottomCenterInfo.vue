<template>
    <div class="bottom-center-info-component-root">
        <div id="info">
            nicehashStatusUtility. Vue inside.
            <br/>
            <a href="https://twitter.com/Misaka_0x447f">twitter @Misaka_0x447f</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: "bottom-center-info"
    };
</script>

<style lang="less" scoped>
    @theme-color-main: rgba(245, 222, 179, 0.3);
    @theme-color-bright: rgba(245, 222, 179, 0.6);

    .bottom-center-info-component-root {
        position: absolute;
        bottom: 2em;
        left: 0;
        width: 100%;
        font-size: 0.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: @theme-color-main;
    }

    #info {
        width: 20em;
        padding-top: 1.5em;
        border-top: @theme-color-main 1px dashed;
        a, a:visited {
            text-decoration: none;
            color: inherit;
        }
        a:hover {
            color: @theme-color-bright;
        }
    }
</style>
