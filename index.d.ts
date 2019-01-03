declare module "electron-pug-printer" {
    export interface Options {
        pugOptions?: PugConfig;
        printOptions?: Electron.PrintOptions | Electron.PrintToPDFOptions;
    }
    export interface PugConfig {
        filePath?: string;
        locals?: Object;
    }

    /**
     * prints pug to pdf by given `pugOptions.filePath` with `pugOptions.locals`
     * @param {Object} options `{pugOptions: {filePath: string, locals: string}, printOptions?: Electron.PrintToPDFOptions}`
     * @returns {Promise} returns Promise<Buffer>
     */
    export function printPugToPdf(option: Options);
    /**
     * prints pug by given `pugOptions.filePath` with `pugOptions.locals`
     * @param {Object} options `{pugOptions: {filePath: string, locals: string}, printOptions?: Electron.PrintOption}`
     * @returns {Promise} returns Promise<void> 
     */
    export function printPug(option: Options);

    export function fromPugToHtml(filePath: string, locals: Object);
}