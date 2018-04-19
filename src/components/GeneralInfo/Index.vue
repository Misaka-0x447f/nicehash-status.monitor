<template>
    <div class="component-root">
        <panel></panel>
    </div>
</template>

<script>
    import Panel from "./Panel";

    export default {
        components: {Panel},
        name: "general-info-index"
    };
</script>

<style lang="less" scoped>
    @theme-color-main: wheat;
    @theme-color-main-fade: rgba(245, 222, 179, 0.67);
    @theme-color-main-fade-2: rgba(245, 222, 179, 0.33);
    @theme-color-main-fade-3: rgba(245, 222, 179, 0.1);

    /deep/ .theme-color {
        color: @theme-color-main;
        fill: @theme-color-main;
    }

    /deep/ .theme-color-fade {
        color: @theme-color-main-fade;
        fill: @theme-color-main-fade;
    }

    /deep/ .theme-color-fade-2 {
        color: @theme-color-main-fade-2;
        fill: @theme-color-main-fade-2;
    }

    /deep/ .theme-color-fade-3 {
        color: @theme-color-main-fade-3;
        fill: @theme-color-main-fade-3;
    }
</style>
