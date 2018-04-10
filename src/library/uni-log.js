/** logging server **/

export default class terminal {
    static lastLog = "[disconnected]";
    static log(typeOrContent, log = false) {
        if (["string", "number"].includes(typeof (typeOrContent))) {
            terminal.lastLog = `[${(new Date()).toLocaleTimeString()}] ${typeOrContent} ${(log ? (": " + log) : "")}`;
            if (typeOrContent === "Warning") {
                console.log("%c" + terminal.lastLog, "background: #ffc; color: #000; padding: 2px 0");
            } else if (typeOrContent === "Failed") {
                console.log("%c" + terminal.lastLog, "background: #fcc; color: #000; padding: 2px 0");
            } else if (typeOrContent === "Debug") {
                console.log("%c" + terminal.lastLog, "background: #6cf; color: #fff; padding: 2px 0");
            } else {
                console.log(terminal.lastLog);
            }
        } else {
            terminal.lastLog = `[${(new Date()).toLocaleTimeString()}] [typeOrContent]`;
        }
    }
}
