export = trace;
export as namespace trace;

declare namespace trace {
    function url(): string;
    function url(v: string): void;
    function sessionId(): string;
    function debug(d: boolean): void;
    function debug(): boolean;
    function event(category: string, action: string, label?: string, value?: any): void;
    function eventDeferred(delay: number,
                           category: string, action: string, label?: string, value?: any): number;
    function eentClear(ev: number): void;
    function sendMail(to: string, from: string, subject: string,
                      message?: string, cc_vistorian?: boolean,
                      blob_image?: any, blob_svg?: any): void;
    function registerUser(email: string): void;
}
