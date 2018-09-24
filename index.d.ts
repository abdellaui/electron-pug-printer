declare module "ElectronPugPrinter" {
    export interface Options {
        pugOptions: PugConfig;
        printOptions: Electron.PrintOptions | Electron.PrintToPDFOptions;
    };
    export interface PugConfig {
        filePath: string;
        locals: Object;
    };

    export function printPugToPdf(option: Options);
    export function printPug(option: Options);
}