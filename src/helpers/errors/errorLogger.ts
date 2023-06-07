import { errorLoggerOptions } from "../../types/interfaces/error";

function errorLogger (options: errorLoggerOptions, valuesToPrint: string | {[key: string]: any}[]) {
  let terminalWidth = process.stdout.columns;
  let {
    title = 'ERROR',
    startEmptyLine = true,
    endEmptyLine = true,
    printTime = true,
  } = options;
  let dashQuantity = title.length > terminalWidth ? 0 : Math.floor((terminalWidth - title.length) / 2) - 2;

  if (startEmptyLine) {
    console.log('\n');
  }

  // print title
  console.log(
    "\x1b[31m",
    '-'.repeat(dashQuantity),
    title, 
    '-'.repeat(dashQuantity),
    "\x1b[0m"
  );

  if (printTime) {
    let date = new Date();
    console.log("\x1b[34m%s\x1b[0m", `${date.toDateString()} - ${date.toTimeString()}`);
  }

  if (Array.isArray(valuesToPrint)) {
    for (let value of valuesToPrint) {
      console.log(value);
    }
  }
  else {
    console.log(valuesToPrint);
  }

  if (endEmptyLine) {
    console.log('\n');
  }
}

export { errorLogger };
