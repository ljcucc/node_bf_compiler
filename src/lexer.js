module.exports = Lexer;

console.log("Lexer has been loaded.");

function Lexer(){
  var sourceCode = "";
  
  const activeNameChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
  const activeNameLetter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
  const activeByteNumberChar = "0123456789";
  const keywords = [
    "if","else","while","for","true","false","define","void","int","float"
  ]
  
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
        console.log(analyzeList)
        throw "Unknow analyze char at index: "+index;
      }
      
      index += analyzePart(analyzeParen(index,sourceCode,"(",")","paren"));
      index += analyzePart(analyzeParen(index,sourceCode,"{","}","areaParen"));
      // index += analyzePart(analyzeParen(index,sourceCode,'"','"',"stringParen"))
      index += analyzePart(analyzeString(index,sourceCode));
      
      index += analyzePart(analyzeChar(index,sourceCode,"=","equals"));
      index += analyzePart(analyzeChar(index,sourceCode,";","lineEnd"));
      index += analyzePart(analyzeChar(index,sourceCode,".","point"));
      
      index += analyzePart(analyzeKeyword(index,sourceCode,"boolean","true"));
      index += analyzePart(analyzeKeyword(index,sourceCode,"boolean","false"));
      index += analyzePart(analyzeAreaFunction(index,sourceCode,"if"));
      index += analyzePart(analyzeAreaFunction(index,sourceCode,"else"));
      index += analyzePart(analyzeAreaFunction(index,sourceCode,"while"));

      index += analyzePart(analyzeCharAvoid(index,sourceCode,"+","calc","+-*/=.",
        new SyntaxError("Exception with the char after calc char")
      ));
      index += analyzePart(analyzeCharAvoid(index,sourceCode,"-","calc","+-*/=.",
        new SyntaxError("Exception with the char after calc char")
      ));
      index += analyzePart(analyzeCharAvoid(index,sourceCode,"*","calc","+-*/=.",
        new SyntaxError("Exception with the char after calc char")
      ));
      index += analyzePart(analyzeCharAvoid(index,sourceCode,"/","calc","+-*/=.",
        new SyntaxError("Exception with the char after calc char")
      ));

      // index += analyzePart(analyzeChar(index,sourceCode,"+","calc"));
      // index += analyzePart(analyzeChar(index,sourceCode,"-","calc"));
      // index += analyzePart(analyzeChar(index,sourceCode,"*","calc"));
      // index += analyzePart(analyzeChar(index,sourceCode,"/","calc"));
      
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
  
  function analyzeParen(index,code,parenFirst,parenLast,type){ //Analyze a paren like chars
    console.log("parsing paren")
    if(code[index] == parenFirst || code[index] == parenLast){
      return [1, {type, data:code[index]}];
    }
    return [0, null];
  }
  
  function analyzeChar(index,code,char,type){ //Analyze a char
    if(code[index] ==  char){
      return [1, {type, data:char}];
    }
    return [0,null];
  }

  function analyzeCharAvoid(index,code,char,type,list,error){ //This function will avoid connected char that include the list
    if(code[index] ==  char){
      if(list.indexOf(code[index+1]) > -1){
        throw error;
      }
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

  function analyzeString(index,code){
    if(code[index] != '"') return [0,null];

    console.log("entering string lexe");

    var temp = "", //temp is use to storage temp char that pick from code[index]
    count = 1,    
    specialChar = false;

    while(code[index + count] != '"' || specialChar){
      var item = code[index + count];

      if(item == '\\'){
        specialChar  = true;
        continue;
      }

      temp += item;
      console.log("char in string is :" +item);
      if(specialChar) specialChar = false;

      count ++;

      // if(index >= code.length) throw "over length error";

      if(typeof item == "undefined"){
        throw "The string have no tail."
      }
    }

    count ++;

    console.log("leaving string lexe, final result is:" + temp+"\n count length is:"+count);

    return [count,{
      type:"string",
      data:temp
    }]
  }
  
  function analyzeWord(index,code,first_call){
    if(first_call){
      var feedback = first_call();
      index = feedback;
    }

    var count = 0;
    var stack = "";    
    
    console.log("compiling words")
    
    while(activeNameChar.indexOf(code[index + count]) > -1){
      stack+= code[index + count];
      count ++;
    }

    if(keywords.indexOf(stack) > -1){
      console.log("this is keyboard, back out.")
      return [0, null];
    };
    
    return [count,{type:"word",data:stack}];
  }

  function analyzeKeyword(index,code,type,word){
    var count = 0,
    temp = "";
    while(
      code[index + count] == word[count] &&
      index + count < code.length - 1){

      temp += code[index+count];

      count ++;
    }
    if(count == word.length){
      return [count,{
        type,
        data:temp
      }];
    }

    return [0,null];
  }

  function analyzeAreaFunction(index,code,word){
    return analyzeKeyword(index,code,word,word);
  }
  
  function analyzePassSpace(index,code){
    var count = 0;
    while(code[index+count] == " " || code[index+count] == "\t" || code[index+count] == "\n"){
      count ++;
    }
    
    return [count,null];
  }
}
