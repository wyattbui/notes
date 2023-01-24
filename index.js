import inquirer from 'inquirer';
import fs from 'fs';
import { resolve } from 'path';

const NULL_DATA = -1;

function isEmptyArray(array){
  return !(Array.isArray(array) && array.length);
}

function showNote(dataObj){
  dataObj.forEach(element => {
    console.log('[',element.title,']','--',element.content);
  });
}

function readNotes(){
  try{
    let data = fs.readFileSync('data.json', 'utf8');
    data = JSON.parse(data);
    if(isEmptyArray(data)){
      console.log('Data is not available');
    }
    return data;
  }catch(e){
    return(NULL_DATA);
  }
}

function writeNotes(dataObj){
  let dataString = JSON.stringify(dataObj);
  fs.writeFile("data.json", dataString, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("Notes have been saved");
  });
}

function addNote(note){
  let notes = readNotes();
  notes.push(note);
  console.log(notes);
  writeNotes(notes);
}

function setNoteContent(){
  return new Promise((resolve, reject)=>{
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
        },
        {
          type: 'input',
          name: 'content'
        }
      ])
      .then(answers => {
        resolve(answers);
      });
  }) 
}

function main(){
  inquirer
    .prompt([
      {
        type: 'rawlist',
        name: 'mode',
        message:'NOTES',
        choices: ['Show', 'Add', 'Edit', 'Remove'],
      },
    ])
    .then(answers => {
      // console.info(answers.mode);
      switch(answers.mode){
        case 'Show': 
          showNote(readNotes()); 
          // main(); 
          break;
        case 'Add':  
          setNoteContent().then(r => addNote(r));
          // main();
          break;
        case 'Edit': 
          console.log('Edit notes'); 
          // main();
          break;
        case 'Remove': 
          console.log('Remove notes'); 
          // main();
          break;
      }
    });
}

main();


