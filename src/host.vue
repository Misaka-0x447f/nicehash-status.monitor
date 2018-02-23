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
    @theme-color-main: wheat;
    @theme-color-main-fade: rgba(245, 222, 179, 0.67);
    @theme-color-main-fade-2: rgba(245, 222, 179, 0.33);

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
        font-family: "Microsoft JhengHei UI", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: @theme-color-main;
        background-color: @theme-color-main;
        user-select: none;
    }

    body {
        margin: 0;
    }

    #background-image {
        background: url("./assets/wallpaper.jpg");
        background-size: cover;
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        z-index: -2147483647;
        filter: saturate(50%) brightness(66%);
    }

    .monospaced{
        font-family: "Source Code Pro", "Consolas", monospace;
        font-weight: 100;
    }
</style>
