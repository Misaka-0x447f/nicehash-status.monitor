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

<style>
    #container {
        display: flex;
        width: 100vw;
        height: 100vh;
        align-items: center;
        justify-content: center;
    }

    input {
        border: wheat 1px dashed;
        background: none;
        padding: 0.3em 0.2em;
        margin: 0.3em 0;
        color: inherit;
        min-width: 20em;
        font-family: inherit;
    }

    input:focus {
        outline: none;
        border: wheat 1px solid;
    }

    html {
        font-size: 16px;
        font-family: "Source Code Pro", "Consolas", monospace;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: wheat;
        background-color: wheat;
    }

    body{
        margin: 0;
    }

    #background-image{
        background: url("./assets/pexels-photo-14676-cc0.png");
        background-size: cover;
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        z-index: -2147483647;
        filter: saturate(75%) brightness(50%);
    }
</style>
