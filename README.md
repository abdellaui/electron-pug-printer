## how to use
**please** just use `printPug` or  `printPugToPdf` only after `app.on('ready')`, where `app` is imported from `electron`-package

## notice 
if you are **not** using `silent mode` promise will never resolve on cancelling the print-operation, because callback will not triggered beside `Electron.webContent.print(option, callback)`

## api

```javascript
interface PugConfig {
    filePath: string;
    locals: Object;
};

interface Options {
    pugOptions: PugConfig;
    printOptions: Electron.PrintOptions | Electron.PrintToPDFOptions;
};

/*
// catch will response with __error__
interface __error__{
    errorDescription: any
}
*/

function printPugToPdf(option: Options): Promise<Buffer>;
function printPug(option: Options): Promise<void>;
```

## example
```javascript
const { app } from 'electron';
const { printPug, printPugToPdf } from 'electron-pug-printer';

app.on('ready', ()=>{


    printPug({
        pugOptions: {
            filePath: 'template.pug',
            locals: {}
        },
        printOptions: {
            silent: false, 
            printBackground: false, 
            deviceName: ''
        }
    }).then(() => {

    }).catch(error => {
        console.log('printPug', error);
    });


    printPugToPdf({
        pugOptions: {
            filePath: 'template.pug',
            locals: {}
        },
        printOptions: {
            marginsType: 0, 
            printBackground: false, 
            printSelectionOnly: false, 
            landscape: false 
        }
    }).then((data) => {
        /*
        fs.writeFile('/tmp/print.pdf', data, (error) => { 
            if (error) throw error;
            console.log('Write PDF successfully.');
        });
        */
       console.log(data);
    }).catch(error => {
        console.log('printPug', error);
    });
    

});
```
