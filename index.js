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
/**
 * prints pug to pdf by given `pugOptions.filePath` with `pugOptions.locals`
 * @param {Object} options `{pugOptions: {filePath: string, locals: string}, printOptions?: Electron.PrintToPDFOptions}`
 * @returns {Promise} returns Promise<Buffer>
 */
const printPugToPdf = async (options) => {
    return await internPrint(true, options);
}

const fromPugToHtml = (filePath, locals) => {
    const pugFile = filePath || (__dirname + '/template.pug');
    const pugLocals = locals || {};
    return pug.renderFile(pugFile, pugLocals);
}

const internPrint = (toPdf, options) => {

    const _pugOptions = options.pugOptions || {};
    const _printOptions = options.printOptions || {};
    const printOption = _printOptions || {};

    return new Promise((resolve, reject) => {
        // if (!app.isReady()) reject({ errorDescription: 'electron app is not ready!' });
        try {

            const html = fromPugToHtml(_pugOptions.filePath, _pugOptions.locals);
            let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(html);
            let backgroundWindow = new BrowserWindow({ show: false });
            backgroundWindow.loadURL(file);
            backgroundWindow.webContents.once('did-finish-load', () => {

                if (!toPdf) {

                    backgroundWindow.webContents.print(printOption, (success) => {
                        if (success) {
                            resolve();
                            backgroundWindow.close();
                            backgroundWindow = null;
                        } else {
                            reject({ errorDescription: 'could not print!' });
                            backgroundWindow.close();
                            backgroundWindow = null;
                        }
                    });
                } else {
                    backgroundWindow.webContents.printToPDF(printOption, (error, data) => {
                        if (error) reject({ errorDescription: error });
                        resolve(data);
                        backgroundWindow.close();
                        backgroundWindow = null;
                    });
                }

            });



            backgroundWindow.webContents.once('did-fail-load', (event, _errorCode, _errorDescription) => {
                reject({ errorDescription: _errorDescription });
                backgroundWindow.close();
                backgroundWindow = null;
            });


        }
        catch (error) {
            reject({ errorDescription: error });
        }

    });

}


module.exports = {
    printPug,
    printPugToPdf,
    fromPugToHtml
}