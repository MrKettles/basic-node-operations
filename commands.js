const fs = require('fs');

function done(output){
  process.stdout.write(output);
  process.stdout.write('\nprompt > ');
}

function evaluateCmd(userInput){
  const userInputArray = userInput.split(' ');
  const command = userInputArray[0];

  switch (command) {
    case "echo":
      commandLibrary.echo(userInputArray.slice(1).join(' '));
      break;
    case "cat":
      commandLibrary.cat(userInputArray.slice(1));
      break;
    case "head":
      commandLibrary.head(userInputArray.slice(1));
      break;
    case "tail":
      commandLibrary.tail(userInputArray.slice(1));
      break;
    default:
      commandLibrary.errorHandler(userInputArray.slice(0, 1));
  }
}

const commandLibrary = {
  "echo": function(userInput){
    done(userInput);
  },
  "cat": function(fullPath){
    const fileName = fullPath[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;
      done(data);
    });
  },
  "head": function(userInput){
    let lineAmt = userInput[1] ? userInput[0] : 10, // Defaults to 10 lines 
        fileName = userInput[1] ? userInput[1] : userInput[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;
      let stringIndex = 0;
      for(let i = 0; i < lineAmt; i++){
        stringIndex = data.indexOf('\n', stringIndex + 1);
        if (stringIndex == -1){
          stringIndex = data.length - 1;
          break;
        }
      }
      let result = data.slice(0, stringIndex);
      done(result);
    })
  },
  "tail": function(userInput){
    let lineAmt = userInput[1] ? userInput[0] : 10,
        fileName = userInput[1] ? userInput[1] : userInput[0];
    fs.readFile(fileName, (err, data) => {
      if (err) throw err;
      let stringIndices = [];
      let position = 0;
      while(position !== -1){
        position = data.indexOf('\n', position + 1);
        stringIndices.push(position);
      }
      let lineIndex = stringIndices[stringIndices.length - lineAmt - 1] + 1;
      let result = data.slice(lineIndex);
      done(result);
    })
  },
  "errorHandler": function(userInput){
    done("Invalid command: " + userInput);
  }
};

module.exports.commandLibrary = commandLibrary;
module.exports.evaluateCmd = evaluateCmd;