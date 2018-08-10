#!/usr/local/bin/node
var execSync = require('child_process').execSync;
var process = require("process");
var fs = require("fs");
var CWD = process.cwd();
var args = process.argv;

args.shift(); // ignore the first parameter
args.shift(); // ignore the first parameter

if(args.length != 0) {
    //process file
    if (fs.existsSync(args[0])) {
        fs.readFile(args[0], 'utf8', function(err, contents) {
            var lines = contents.split("\n");
            for(var i=0;i<lines.length;i++){
                var line = lines[i];
                process_line(line);
            }
        });
    }else{
        console.error("Sorry, that file does not exist.");
    }
}else{
    // process the STDIN
    //
    process.stdout.write("INPUT>");        
    process.stdin.on('readable', () => {
        var line = process.stdin.read();
        if (line !== null) {
            line = (""+line).replace("\n","");
            
            process_line(""+line);
            process.stdout.write("INPUT>");        
        }
    });

}


function process_line(line){
    var ok = 0;
    if(line == null){
        console.log("oh no");
        return;
    }
    //console.log(typeof(line));
    if(line==""){
        return;
    }
    var parts = line.split(" ");
    if(parts[0] == "cd"){
        ok = 1;
        if(parts.length == 2){
            var folderName = parts[1];
            if(folderName == '..'){
                var parts = CWD.split("/");
                parts.pop();
                CWD = parts.join("/");
                return;
            
            }
            var destinationFolder = CWD + "/" + folderName;
            if(folderName[0] == "/"){
                destinationFolder = folderName;
            }
            if (fs.existsSync(destinationFolder)) {
                CWD = destinationFolder;
            }else{
                console.log("Sorry, that folder does not exist.");
            }
        }else{
            console.log("cd usage: \n  cd <directory>");
        }
        return;
    }
    if(parts[0] == "ls"){
        
        var testFolder = CWD;
        fs.readdir(testFolder, (err, files) => {
            files.forEach(file => {
                console.log(file);
            });
        });
        return;
    }
    if(parts[0] == "cat"){
        
        if(parts.length == 2){
            var fileName = parts[1];
            var fullPathName = CWD + "/" + fileName;
            if (fs.existsSync(fullPathName)) {
                fs.readFile(fullPathName, 'utf8', function(err, contents) {
                    console.log(contents);
                });
            }else{
                console.error("Sorry, that file does not exist.");
            }
        }else{
            console.error("cat usage: \n  cat <file>");
        }
        return;
    }
    if(parts[0] == "mkdir"){
        
        if(parts.length == 2){
            var fileName = parts[1];
            var fullPathName = CWD + "/" + fileName;
            if (fs.existsSync(fullPathName)) {
                console.error("Sorry, that folder already not exist.");
            }else{
                fs.mkdirSync(fullPathName);
            }
        }else{
            console.error("cat usage: \n  cat <file>");
        }
        return;
    }    
    if(parts[0] == "source" || parts[0] == "." ){
        
        if(parts.length == 2){
            var command = parts[1];
            var fullPathName = CWD + "/" + command;
            if (fs.existsSync(fullPathName)) {
                var out = execSync("/bin/bash " + command, {cwd:CWD});
                //function callback(error, stdout, stderr){
                //    console.log(stdout);
                //    console.error(stderr);
                //}
                console.log(out.toString('utf8'));
            }else{
                console.error("Sorry, that file does not exist.");
            }
        }else{
            console.error("source usage: \n  source executable-command");
        }
        return;
    }  
    if(parts[0] == "pwd" ){ // Print working directory
        console.log(CWD);   // Current working directory
        return;
    }
    //
    if(parts[0] == "cow"){
        
        let cow = `
    -----
  < Hello >
    -----
           \   ^__^ 
            \  (oo)\_______
               (__)\       )\/\
                   ||----w |
                   ||     ||`;
   
      console.log(cow);
        return;
    }
    //
    if(parts[0] == "js" ){ 
        
        if(parts.length == 2){
            parts.shift();
            var command = parts.join(" ");
            try {
                console.log(">" + eval(command));
            }catch(e){
                console.error(e);
            }
        }else{
            console.error("source usage: \n  source executable-command");
        }
        return;
    }      
    if(parts[0] == "exit" ||parts[0] == "quit" ){ 
        process.exit();
    }

    if(parts[0] == "help" ||parts[0] == "?"||parts[0] == "man"){ 
        ok = 1;
        if(parts.length != 1){
            var query = parts[1];
            var help_texts ={};
            help_texts["cd"]  = " cd a directory"
            help_texts["cow"]  = " prints picture of a cow to the console"

            help_texts["ls"]  = " lists directories"
            help_texts["pwd"]  = " Prints the current working directory"
            help_texts["cat"]  = " prints a file on the tty"
            help_texts["js"]  = " evaluates arbitary javascript (dangerous) "
            help_texts["source"]  = " run a program (even more dangerous than js)"
            help_texts["man"]  = " shows this help"
            help_texts["help"]  = " shows this help, also try help <command>"
            help_texts["mkdir"]  = " creates a directory"
            help_texts["exit"]  = " exits the intepreter "
            help_texts["quit"]  = " exits the intepreter"

            if(query in help_texts){
                console.log(help_texts[query]);
            }else{
                console.log("There is no help for:" + query);
            }
            return;
        }
        console.log("Welcome to dish");
        console.log("Commands:");
        console.log("cd");
        console.log("cow");
        console.log("ls");
        console.log("pwd");
        console.log("cat");
        console.log("js expression");
        console.log("source / .");
        console.log("mkdir");
        console.log("exit/quit");
        console.log("possibly more, read the source...");
    }    
    if(ok == 0){
        console.error("What?, type help for commands.");
    }
    // cd
}
