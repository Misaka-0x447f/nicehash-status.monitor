<template>
    <div class="worker-component-root">
        <table class="worker">
            <tbody>
                <tr v-for="i in workerList" :key="i.key">
                    <td v-if="i.workerName">{{i.workerName}}</td>
                    <td v-if="i.algorithm">{{i.algorithm}}</td>
                    <td v-if="i.accepted">{{i.accepted}}</td>
                    <td v-if="i.rejected">{{i.rejected}}</td>
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
    }

    .worker {
        width: 100%;
        font-weight: 100;
    }
</style>
