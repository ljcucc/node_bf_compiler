module.exports = Parser;

console.log("Parser has been loaded.");

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
    
    var index = 0,lastIndex = 0;
    var count = 0;
    while(index < sourceList.length){
      console.log(index);
      index += parenParse(index);
      index += parseCalc(index);
      index += parseElse(index);
      index += parseLineEnd(index);
      
      if(index != lastIndex){
        lastIndex = index;
        count = 0;
      }else{
        count ++;
      }
      
      if(count > 10){
        throw new InternalError("The parse cannot be solved.");
      }
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
    
    // console.log("parenParse is execute")
    // console.log(item);
    
    if(item.type == "paren"){
      if(item.data == "("){
        // console.log("( is execute")
        parenStack.push({
          type:"paren",
          body:[]
        }); //push a paren level into parenStack
      }else if(item.data == ")"){
        var popItem = parenStack.pop(); //move last node into upper node.
        if(isValue(popItem)){
          // console.log("is value");
          var lastItem = parenStack.pop();
        }else{
          // console.log("not a value");
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
      var forwardNode = parenStack[parenStack.length -1];
      if(forwardNode.data == "+" || forwardNode.data == "-"){
        //pull-out and...

        //push-back
        //If there have a unpriority that push to stack before. we can use push-back to push
        //The node back into father node which is the body of the last node.

        console.log("pull-out and push-back");
        var temp = parenStack.pop();
        parenStack.push({
          type:"calc",
          data:item.data,
          body:[]
        });
        pushLexerItem(temp);
      }
      
      //Overnode
      //Overnode meaning one of new node that priority right is over than last node in stack,
      //then new node can steal the last item of last node to the body of new node.
      else if(forwardNode.data != "*" && forwardNode.data != "/"){ //Overnode is happend
        console.log("Overnode is happend");
        var lastItem = parenStack[parenStack.length -1].body.pop();
        parenStack.push({  //Steal then push to the body of new ndoe
          type:"calc",
          data:item.data,
          body:[]
        });
        pushLexerItem(lastItem);
      }
    }else if(item.data == "*" || item.data == "/"){
      
    }else return 0;
    
    return 1;
  }
  
  function parseElse(index){
    if(nullPointBreaker(index)) return 0;
    console.log("parseElse is execute")
    
    var item = sourceList[index];
    
    console.log(item)
    
    switch(item.type){
      case "paren":
      case "calc":
      case "lineEnd":
        return 0;
      case "number":
        // if(parenStack[parenStack.length - 1].type == "calc"){
        //   pushLexerItem(item);
        //   pushLexerItem(parenStack.pop());
        //   return 1;
        // }
      default:
        pushLexerItem(item);
    }
    
    return 1;
  }
  
  function parseLineEnd(index){
    var item = sourceList[index];
    try{
      if(item.type != "lineEnd") return 0;
    }catch(e){
      throw new SyntaxError("exception with ';'.");
    }
    console.log("parseLineEnd is execute");
    pushAllToStack();
    return 1;
  }
  
  function pushAllToStack(){
    console.log("pushAllToStack is execute");
    while(parenStack[parenStack.length -1].type != "root"
    &&parenStack[parenStack.length -1].type != "areaParen"){
      pushLexerItem(parenStack.pop());
    }
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
