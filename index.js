const { app, BrowserWindow } = require('electron')
const pug = require('pug');

/**
 * prints pug by given `pugOptions.filePath` with `pugOptions.locals`
 * @param {Object} options `{pugOptions: {filePath: string, locals: string}, printOptions?: Electron.PrintOption}`
 * @returns {Promise} returns Promise<void> 
 */

const printPug = async (options) => {
    return await internPrint(false, options);
}
printPug
/**
 * prints pug to pdf by given `pugOptions.filePath` with `pugOptions.locals`
 * @param {Object} options `{pugOptions: {filePath: string, locals: string}, printOptions?: Electron.PrintToPDFOptions}`
 * @returns {Promise} returns Promise<Buffer>
 */
const printPugToPdf = async (options) => {
    return await internPrint(true, options);
}


const internPrint = (toPdf, options) => {
    const pugFile = options.pugOptions.filePath || 'template.pug';
    const pugLocals = options.pugOptions.locals || {};
    const printOption = options.printOptions || {};

    return new Promise((resolve, reject) => {
        // if (!app.isReady()) reject({ errorDescription: 'electron app is not ready!' });
        try {

            const html = pug.renderFile(pugFile, pugLocals);
            let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(html);
            let backgroundWindow = new BrowserWindow({ show: false });
            backgroundWindow.loadURL(file);
            backgroundWindow.webContents.once('did-finish-load', () => {

                if (!toPdf) {

                    backgroundWindow.webContents.print(printOption, (success) => {
                        if (success) {
                            resolve();
                            backgroundWindow.close();
                        } else {
                            reject({ errorDescription: 'could not print!' });
                            backgroundWindow.close();
                        }
                    });
                } else {
                    backgroundWindow.webContents.printToPDF(printOption, (error, data) => {
                        if (error) reject({ errorDescription: error });
                        resolve(data);
                        backgroundWindow.close();
                    });
                }

            });


            backgroundWindow.once('closed', () => {
                reject({ errorDescription: 'could not print!' });
                backgroundWindow = null;
            });

            backgroundWindow.webContents.once('did-fail-load', (event, _errorCode, _errorDescription) => {
                reject({ errorDescription: _errorDescription });
                backgroundWindow.close();
            });


        }
        catch (error) {
            reject({ errorDescription: error });
        }

    });

}


module.exports = {
    printPug,
    printPugToPdf
}