/** logging server **/

export default class terminal {
    static lastStringLog = "[disconnected]";
    static log(typeOrContent, log = undefined) {
        let rawData = false;
        if (["string", "number"].includes(typeof (typeOrContent))) {
            terminal.lastStringLog = `[${(new Date()).toLocaleTimeString()}] ${typeOrContent}`;
        } else {
            terminal.lastStringLog = `[${(new Date()).toLocaleTimeString()}] [${typeof (typeOrContent)}]`;
            rawData = true;
        }

        if (["string", "number"].includes(typeof (log))) {
            terminal.lastStringLog += ": " + log;
        } else {
            throw new Error("terminal.log: type of argument \"log\" must be string or number.");
        }

        let style = "";
        if (typeOrContent === "Warning") {
            style = "background: #ffc; color: #000; padding: 2px 0";
        } else if (typeOrContent === "Failed") {
            style = "background: #fcc; color: #000; padding: 2px 0";
        } else if (typeOrContent === "Debug") {
            style = "background: #6cf; color: #fff; padding: 2px 0";
        }

        console.log(`%c${terminal.lastStringLog}`, style);
        if (rawData) {
            console.log(rawData);
        }
    }
}
