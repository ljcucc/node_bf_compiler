(function(){

  const Nodebf = require("./compiler/nodebf_compiler.js");
  const $ = require("jquery");
  
  $("#compile").click(e=>{
    console.log("compiling")
    var compiler = new Nodebf();
    console.log(editor.getValue()/*$("#sourceCode").val()*/)
    compiler.importCode(editor.getValue()/*$("#sourceCode").val()*/)
    try{
      var result = compiler.compile();
    }catch(e){
      $("#compiledCode").val(e);
      console.error(e);
      compileErrorToast.open();
      return;
    }

    console.log(typeof result)
    $("#compiledCode").val(JSON.stringify(result,null,2));
    showList(result)

    codeCompiledToast.open();
  })

  function showList(list){
    for(var i = 0; i < list.length;i++){
      var item = list[i];
      console.log(JSON.stringify(item))
    }
  }

  console.log("index.js module is running...")
})();
