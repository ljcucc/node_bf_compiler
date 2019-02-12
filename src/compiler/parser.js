module.exports = Parser;

console.log("Parser has been loaded.");

const keywordTypes = [
  "if","else","while","for","true","false","define","void","int","float"
];

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
      console.log(parenStack);
      
      
      index += parenParse(index,{
        type:"paren",
        head:"(",
        tail:")",
        finalType:"paren"
      });
      
      console.log("parenParse is runned");

      index += parenParse(index,{
        type:"areaParen",
        head:"{",
        tail:"}",
        finalType:"area",
        callback_tail:()=>{
          var popItem = parenStack.pop(); //move last node into upper node.
          pushLexerItem(popItem);
        }
      });
      index += parseCalc(index);
      index += parseElse(index);
      index += parseLineEnd(index);
      // index += methodCallParse(index);
      
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
      console.log(sourceList[index]);
      console.log(parenStack)
      throw "Some of paren may no complete with another end-paren";
    }
     
    parseList = parenStack[0]; //Because the stack will only left one item in it, so I just pick up the
    //first item that inside the stack into parenList which is a root node obeject.
  }
  
  this.getParsedList = function(){
    return parseList;
  }
  
  function parenParse(index,config){
    if(nullPointBreaker(index)) return 0;
    
    var item = sourceList[index];
    
    // console.log("parenParse is execute")
    // console.log(item);
    
    if(item.type == config.type){
      if(item.data == config.tail){
        console.log("Paren is end");
        
        pushAllToStack_untill(config.head);
        
        var popItem = parenStack.pop(); //move last node into upper node.
        popItem.type = config.finalType;
        pushLexerItem(popItem);
        
        if(config.callback_tail)config.callback_tail();
        return 1;
      }else if(item.data == config.head){
        console.log("Paren is start");
        parenStack.push({
          type:config.head,
          body:[]
        }); //push a paren level into parenStack
        
        return 1;
      }
    }else{
      console.log(item.type + " is different to "+config.type);
      
    }
    
    console.log(item)
    console.log(config);
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
      var forwardNode = parenStack[parenStack.length -1];
      if(forwardNode.data == "*" || forwardNode.data == "/"){ //If it is a equals-node
        console.log("*/ equals-node");
        var temp = parenStack.pop();
        parenStack.push({
          type:"calc",
          data:item.data,
          body:[temp]
        });
      }else{ //If not a equals-node, it must be a over-node
        console.log("*/ overnode");
        var lastItem = parenStack[parenStack.length -1].body.pop();
        parenStack.push({
          type:"calc",
          data:item.data,
          body:[]
        });
        pushLexerItem(lastItem);
      }
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
      case "areaParen":
      case "calc":
      case "lineEnd":
        return 0;
      default:
        // pushLexerItem(item);
        parenStack.push(item);
    }
    
    return 1;
  }
  
  function parseLineEnd(index){
    var item = sourceList[index];
    if(item.type != "lineEnd") return 0;
    try{
      if(item.type != "lineEnd") return 0;
    }catch(e){
      throw new SyntaxError("exception with ';'.");
    }
    console.log("parseLineEnd is execute");
    // pushAllToStack();
    pushAllToStack();
    return 1;
  }
  
  function pushAllToStack(){
    console.log("pushAllToStack is execute");
    while(parenStack[parenStack.length -1].type != "root"
    && parenStack[parenStack.length -1].type != "area"){
      console.log(parenStack[parenStack.length -1].type)
      // pushLexerItem(parenStack.pop());
      
      var item = parenStack.pop();
      if(typeof parenStack[parenStack.length - 1].body != "object"){
        parenStack[parenStack.length - 1].body = [item]
      }else{
        parenStack[parenStack.length - 1].body.push(item);
      }
    }
  }
  
  function pushAllToStack_untill(type){
    while(parenStack[parenStack.length -1].type != "root"
      && parenStack[parenStack.length -1].type != type){
      console.log(parenStack[parenStack.length -1].type)
      // pushLexerItem(parenStack.pop());
      
      var item = parenStack.pop();
      if(typeof parenStack[parenStack.length - 1].body != "object"){
        parenStack[parenStack.length - 1].body = [item]
      }else{
        parenStack[parenStack.length - 1].body.push(item);
      }
    }
  }
  
  function isValue(value){
    return value.type == "calc"
    || value.type == "numbe";
  }
  
  function pushLexerItem(item){ //push a unparsed node into item of parenStack
    // if(item == null) return;
    if(parenStack[parenStack.length-1].body == null){
      parenStack[parenStack.length-1].body = [];
    }
    
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

  function methodCallParse(index){
    
  }
}
