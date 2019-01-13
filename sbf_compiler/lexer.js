module.exports = Lexer;

console.log("Lexer has been loaded.");

function Lexer(){
  var sourceCode = "";
  
  const activeNameChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
  const activeNameLetter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
  const activeByteNumberChar = "0123456789";
  
  var analyzeList = [];
  var analyzedNodes = [];
  
  var crashCount = 0;
  var lastIndex = 0;
  
  this.getAnalyzeList = function(){
    return analyzeList;
  }
  
  this.importCode = function(code){
    sourceCode = code;
  }
  
  this.analyze = function(){
    console.log("analyze code");
    
    analyzeCode()
    
    console.log(analyzeList);
    
    return analyzeList;
  }
  
  function analyzeCode(){
    var index = 0;
    
    while(index <= sourceCode.length-1){
      if(crashCount > 10){
        throw "Unknow analyze char at index: "+index;
      }
      
      index += analyzePart(analyzeParen(index,sourceCode,"(",")","paren"));
      index += analyzePart(analyzeParen(index,sourceCode,"{","}","areaParen"));
      index += analyzePart(analyzeParen(index,sourceCode,'"','"',"stringParen"))
      
      index += analyzePart(analyzeChar(index,sourceCode,"=","equals"));
      index += analyzePart(analyzeChar(index,sourceCode,";","lineEnd"));
      index += analyzePart(analyzeChar(index,sourceCode,".","point"));
      
      index += analyzePart(analyzeChar(index,sourceCode,"+","calc"));
      index += analyzePart(analyzeChar(index,sourceCode,"-","calc"));
      index += analyzePart(analyzeChar(index,sourceCode,"*","calc"));
      index += analyzePart(analyzeChar(index,sourceCode,"/","calc"));
      
      index += analyzePart(analyzeNumber(index,sourceCode));
      index += analyzePart(analyzeWord(index,sourceCode));
      
      index += analyzePart(analyzePassSpace(index,sourceCode));
      
      console.log(index);
      
      if(lastIndex != index){
        crashCount = 0;
        lastIndex = index;
      }else{
        console.log("counting: "+crashCount);
        crashCount ++;
      }
      
    }
  }
  
  function reanalyzeCode(){
    var index = 0;
  }
  
  function analyzePart(data){
    if(data[0] > 0){
      if(data[1] != null)
        analyzeList.push(data[1]);
    }
    return data[0];
  }
  
  function analyzeParen(index,code,parenFirst,parenLast,type){
    console.log("parsing paren")
    if(code[index] == parenFirst || code[index] == parenLast){
      return [1, {type, data:code[index]}];
    }
    return [0, null];
  }
  
  function analyzeChar(index,code,char,type){
    if(code[index] ==  char){
      return [1, {type, data:char}];
    }
    return [0,null];
  }
  
  function analyzeNumber(index,code){
    var count = 0;
    var stack = "";
    
    while(activeByteNumberChar.indexOf(code[index + count]) > -1){
      stack+= code[index + count];
      count ++;
    }
    
    if(activeNameLetter.indexOf(code[index + count])>-1 && count > 0){
      throw "Syntax error at index:"+String(index+count)+
      "\n Non number char can't between after numbers.";
    }
    
    return [count, {type:"number",data:stack}];
  }
  
  function analyzeWord(index,code){
    var count = 0;
    var stack = "";
    
    console.log("compiling words")
    
    while(activeNameChar.indexOf(code[index + count]) > -1){
      stack+= code[index + count];
      count ++;
    }
    
    return [count,{type:"word",data:stack}];
  }
  
  function analyzePassSpace(index,code){
    var count = 0;
    while(code[index+count] == " " || code[index+count] == "\t" || code[index+count] == "\n"){
      count ++;
    }
    
    return [count,null];
  }
}
