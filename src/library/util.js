import Nicehash from "../library/nicehash";

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
    },
    checkAddress: async function(addr) {
        return new Promise(resolve => {
            if (
                typeof (addr) === "string" && addr.hasOwnProperty("length") &&
                (
                    (addr.length === 34 && addr.slice(0, 1) === "1") ||
                    (addr.length === 34 && addr.slice(0, 1) === "3") ||
                    (addr.length === 42 && addr.slice(0, 3) === "bc1")
                )
            ) {
                let nicehash = new Nicehash();
                nicehash.isValidAddress(addr)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(() => {
                        resolve("unknown");
                    });
            } else {
                resolve("false");
            }
        });
    },
    getUnixTimeStamp: function(offset = 0) {
        return Math.round((new Date()).getTime() / 1000 - offset);
    },
    jsonCheck: function(host, checkList, throwError = true) {
        /***
         *  checkList: [
         *      "attr1",
         *      "attr2.attr3",
         *      ...
         *  ]
         */
        if (typeof (host) !== "object") {
            if (throwError) {
                throw new Error("Not a valid json");
            } else {
                return false;
            }
        }
        for (let i of checkList) {
            // Here we check every variable provided. If not exist, throw error.
            let arrays = i.split(".");
            let workSpace = host;
            while (arrays.length > 0) {
                let attr = arrays.shift();
                if (workSpace.hasOwnProperty(attr)) {
                    workSpace = workSpace[attr];
                } else {
                    if (throwError) {
                        setTimeout(() => {
                            console.error("You may want to check this specified object:", host);
                        }, 10);
                        throw new ReferenceError(`${i} does not exist in the specified object.`);
                    } else {
                        return false;
                    }
                }
            }
        }
    },
    awaitTimeout: function(delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
    }
};
