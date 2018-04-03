export default {
    sum: function(array) {
        if (!Array.isArray(array)) {
            array = Object.values(array);
        }
        return array.reduce((a, b) => {
            return (isNaN(a) ? 0 : a) + (isNaN(b) ? 0 : b);
        }, 0);
    },
    isNumeric: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    padZero: function(source, counts) {
        // A simple and easy to understand pad zero function.
        while (source.length < counts) {
            source += "0";
        }
        return source;
    },
    escapeHTML: function(unsafeStr) {
        return unsafeStr
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
            .replace(/\//g, "&#x2F;");
    },
    // svg utils
    polarToRect: function(centerX, centerY, r, angleInDegrees) {
        // angleInDegrees starts at the top of circle
        let angleInRadians = angleInDegrees * Math.PI / 180.0;

        return {
            x: centerX + (r * Math.cos(angleInRadians)),
            // NOT mathematical coordinate
            y: centerY - (r * Math.sin(angleInRadians))
        };
    },
    arcPath: function(centerX, centerY, r, start, duration) {
        let startPos = this.polarToRect(centerX, centerY, r, start);
        let endPos = this.polarToRect(centerX, centerY, r, start + duration);
        let rotation = Math.floor(Math.abs(duration) / 180) % 2 === 0 ? 0 : 1;
        return [
            "L", startPos.x, startPos.y,
            // A rx ry x-axis-rotation large-arc-flag sweep-flag x         y
            "A", r, r, 0, rotation, duration > 0 ? 0 : 1, endPos.x, endPos.y
        ].join(" ");
    },
    sweepPath: function(centerX, centerY, r, start, duration) {
        for (let i of [centerX, centerY, r, start, duration]) {
            if (!this.isNumeric(i)) {
                return "";
            }
        }
        return [
            "M", centerX, centerY,
            this.arcPath(centerX, centerY, r, start, duration),
            "L", centerX, centerY
        ].join(" ");
    }
};
