<template>
    <div id="container">
        <div id="background-image">

        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "host"
    };
</script>

<style lang="less">
    @import "color";

    @font-face {
        font-family: "Consolas";
        src: url("assets/consola.ttf");
    }

    #container {
        display: flex;
        width: 100vw;
        height: 100vh;
        justify-content: center;
        align-items: center;
    }

    input {
        border: none;
        border-bottom: @theme-color-main-fade 1px dashed;
        background: none;
        padding: 0.3em 0.2em;
        margin: 0.3em 0;
        color: inherit;
        min-width: 20em;
        font-family: inherit;
    }

    input:focus {
        outline: none;
        border: none;
        border-bottom: @theme-color-main-fade 1px solid;
    }

    input::placeholder {
        color: @theme-color-main-fade-2;
    }

    html {
        font-size: 20px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: @theme-color-main;
        background-color: @theme-color-main;
        user-select: none;
    }

    html > body {
        font-family: "Microsoft JhengHei UI", sans-serif;
        font-size: 20px;
        line-height: 20px;
        margin: 0;
        font-weight: 400;
    }

    #background-image {
        background: url("./assets/wallpaper.jpg");
        background-size: cover;
        width: 125%;
        height: 125%;
        position: fixed;
        top: 0;
        z-index: -2147483647;
        filter: brightness(66%);
    }

    .monospaced {
        font-family: "Consolas", "Source Code Pro", monospace;
        font-weight: 100;
    }

    .digit {
        font-family: "Consolas","Source Code Pro", "Microsoft JhengHei UI Light", "Lucida Sans Unicode", "Trebuchet MS", sans-serif;
        font-weight: 100;
    }
</style>
