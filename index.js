(function(){
  window.addEventListener("load",e=>{
    $("#compile").click(e=>{
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
  });
  
  function showList(list){
    for(var i = 0; i < list.length;i++){
      var item = list[i];
      console.log(JSON.stringify(item))
    }
  }
})();
