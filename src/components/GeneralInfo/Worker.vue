<template>
    <div class="worker-component-root monospaced">
        <table class="worker">
            <tbody>
                <tr class="theme-color-fade-2">
                    <td>#</td>
                    <td>algo</td>
                    <td>OK</td>
                    <td>NG</td>
                </tr>
                <tr v-if="workerList.length > 0" v-for="i in workerList" :key="i.key">
                    <td>{{i.workerName ? i.workerName : ""}}</td>
                    <td>{{i.algorithm ? i.algorithm : "unknown"}}</td>
                    <td>{{i.accepted ? i.accepted : "×"}}</td>
                    <td>{{i.rejected ? i.rejected : ""}}</td>
                    <td>{{i.suffix ? i.suffix : ""}}/s</td>
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
            workerList: {

            }
        }
    };
</script>

<style lang="less" scoped>
    .worker-component-root {
        width: 100%;
        font-size: 0.8em;
    }

    .worker {
        width: 100%;
        font-weight: 300;
        padding: 0.5em 1em;
    }
</style>
