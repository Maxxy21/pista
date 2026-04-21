type LogLevel = "info" | "warn" | "error";

function log(level: LogLevel, module: string, message: string, ...args: unknown[]) {
    const prefix = `[pista:${module}]`;
    if (level === "error") {
        console.error(prefix, message, ...args);
    } else if (level === "warn") {
        console.warn(prefix, message, ...args);
    } else {
        console.log(prefix, message, ...args);
    }
}

export const logger = {
    info: (module: string, message: string, ...args: unknown[]) => log("info", module, message, ...args),
    warn: (module: string, message: string, ...args: unknown[]) => log("warn", module, message, ...args),
    error: (module: string, message: string, ...args: unknown[]) => log("error", module, message, ...args),
};
