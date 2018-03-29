<template functional>
    <div class="worker-component-root monospaced">
        <table class="worker">
            <tbody>
                <tr v-if="workerList.length > 0" v-for="i in workerList" :key="i.key">
                    <td>{{i.workerName ? i.workerName : ""}}</td>
                    <td>{{i.algorithm ? i.algorithm : "unknown"}}</td>
                    <td>{{i.accepted ? i.accepted : "×"}}</td>
                    <td>{{i.rejected ? i.rejected : ""}}</td>
                    <td>{{i.suffix ? i.suffix : ""}}/s</td>
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

<style scoped>
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
