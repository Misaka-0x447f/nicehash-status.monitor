<template>
    <div class="worker-component-root monospaced">
        <table class="worker">
            <tbody is="transition-group" name="trans">
            <tr class="theme-color-fade-2">
                <td>#</td>
                <td class="right-align">OK</td>
                <td></td>
                <td>algo</td>
                <td>NG</td>
            </tr>
            <tr v-if="workerList.length > 0" v-for="i in workerList" :key="i.key">
                <td>{{i.workerName ? i.workerName : ""}}</td>
                <td class="right-align">{{i.accepted ? i.accepted : "0"}}</td>
                <td>{{i.suffix ? i.suffix : ""}}/s</td>
                <td>{{i.algorithm ? i.algorithm : "unknown"}}</td>
                <td class="invalid">{{i.rejected ? i.rejected : ""}}</td>
            </tr>
            <tr v-if="workerList.length === 0" class="theme-color-fade-2">
                <td>---</td>
                <td>---</td>
                <td>---.-</td>
                <td>---.-</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "worker",
        props: {
            workerList: {}
        }
    };
</script>

<style lang="less" scoped>
    .worker-component-root {
        width: 100%;
        font-size: 0.8em;
    }

    .trans-enter-active, .trans-leave-active {
        transition: all 1s;
    }

    .trans-enter, .trans-leave-to {
        opacity: 0;
        transform: translateX(5px);
    }

    .worker {
        width: 100%;
        font-weight: 300;
        padding: 0.5em 1em;
    }

    .invalid {
        filter: grayscale(80%);
    }

    .right-align {
        text-align: right;
    }
</style>
