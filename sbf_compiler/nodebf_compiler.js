module.exports = Nodebf;

const Lexer = require("./lexer.js");
const Parser = require("./parser.js");

console.log("Compiler has been loaded.")

function Nodebf(){
  var compiledCode = "";
  var sourceCode = "";
  
  
  var defineDataType = [
    "byte",
    "int",
    "boolean"
  ];
  
  this.importCode = function(code){
    sourceCode = code;
    console.log("code imported");
  };
  
  this.compile = ()=>{
    var result;
    
    var lexer = new Lexer();
    lexer.importCode(sourceCode);
    lexer.analyze();
    
    var parser = new Parser();
    parser.importList(lexer.getAnalyzeList());
    parser.parse();
    
    console.log(parser.getParsedList())
    
    return parser.getParsedList();
  }
  
  
}
