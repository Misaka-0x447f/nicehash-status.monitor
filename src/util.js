export default {
    sum: function(array) {
            if (!Array.isArray(array)) {
                array = Object.values(array);
            }
            return array.reduce((a, b) => {
            return (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b);
        }, 0);
    }
};
