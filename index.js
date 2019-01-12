(function(){
  const Nodebf = require("./sbf_compiler/nodebf_compiler.js");
  
  $("#compile").click(e=>{
    console.log("compiling")
    var compiler = new Nodebf();
    console.log($("#sourceCode").val())
    compiler.importCode($("#sourceCode").val())
    try{
      var result = compiler.compile();
    }catch(e){
      $("#compiledCode").val(e);
      return;
    }

    console.log(typeof result)
    $("#compiledCode").val(JSON.stringify(result,null,2));
    showList(result)
  })

  function showList(list){
    for(var i = 0; i < list.length;i++){
      var item = list[i];
      console.log(JSON.stringify(item))
    }
  }

  console.log("index.js module is running...")
})();
