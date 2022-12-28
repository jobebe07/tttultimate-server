import LogType from "./LogType.js";

export default class Logger {
    static prefix = " ~ WebSocketServer "
    static log(msg, type = LogType.INFO) {
        if(type === LogType.INFO) {
            console.log(this.prefix + "[INFO] " + msg)
        }
        if(type === LogType.WARN) {
            console.log(this.prefix + "[WARN] " + msg)
        }
        if(type === LogType.ERROR) {
            console.log(this.prefix + "[ERROR] " + msg)
        }
    }
}