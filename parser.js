function Parser(){
  var sourceList = [];//sourceList that come from Lexer
  var parseList;// the Node objects that parsed from sourceList
  
  var parenStack = []; //parenStack
  
  this.importList = (list)=>{ //Import the list source that come from Lexer
    sourceList = list;
  }
  
  this.parse = function(){
    parenStack.push({
      type:"root",
      body:[]
    });
    
    var index = 0;
    while(index < sourceList.length){
      console.log(index);
      index += parenParse(index);
      index += parseCalc(index);
      index += parseElse(index);
    }
    
    if(parenStack.length != 1){
      console.log(parenStack)
      throw "Some of paren may no complete with another end-paren";
    }
    
    parseList = parenStack[0]; //Because the stack will only left one item in it, so I just pick up the
    //first item that inside the stack into parenList which is a root node obeject.
  }
  
  this.getParsedList = function(){
    return parseList;
  }
  
  function parenParse(index){
    if(nullPointBreaker(index)) return 0;
    
    var item = sourceList[index];
    
    console.log("parsing Parens")
    console.log(item);
    
    if(item.type == "paren"){
      if(item.data == "("){
        console.log("pushing new item")
        parenStack.push({
          type:"paren",
          body:[]
        }); //push a paren level into parenStack
      }else if(item.data == ")"){
        var popItem = parenStack.pop(); //move last node into upper node.
        if(isValue(popItem)){
          console.log("is value");
          var lastItem = parenStack.pop();
        }else{
          console.log("not a value");
          console.log(popItem);
        }
        /*
          such like this:
          
          0:[3,"+""] <- then move to here
          1:[1,"+",2] <- first pop this
          
          then you'll get:
          
          [
            3,
            "+",
            [
              1,
              "+",
              2
            ]
          ]
        */
        pushLexerItem(popItem);
      }
      return 1;
    }
    return 0;
  }
  
  function parseCalc(index){
    if(nullPointBreaker(index)) return 0;
    
    var item = sourceList[index];
    
    if(item.type != "calc") return 0;
    
    if(item.data == "+" || item.data == "-"){
      var body = parenStack[parenStack.length-1].body
      parenStack[parenStack.length-1].body = [];
      parenStack.push({
        type:"calc",
        data:item.data,
        body
      });
    }
    
    return 1;
  }
  
  function parseElse(index){
    if(nullPointBreaker(index)) return 0;
    console.log("pushing...")
    
    var item = sourceList[index];
    
    console.log(item)
    
    switch(item.type){
      case "paren":
      case "calc":
        return 0;
      case "number":
        if(parenStack[parenStack.length - 1].type == "calc"){
          pushLexerItem(item);
          pushLexerItem(parenStack.pop());
          return 1;
        }
      default:
        pushLexerItem(item);
    }
    
    return 1;
  }
  
  function isValue(value){
    return value.type == "calc"
    || value.type == "numbe";
  }
  
  function pushLexerItem(item){ //push a unparsed node into item of parenStack
    parenStack[parenStack.length-1].body.push(item);
  }
  
  function nullPointBreaker(index){ //When the index bigger than the length of sourceList, this will return true make the program break;
    return index >= sourceList.length;
  }
  
  function createNode(type,data){
    return {
      data,
      type,
      body:[]
    };
  }
}