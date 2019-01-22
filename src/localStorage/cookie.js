module.exports = {
  getCookie,
  setCookie
};

function getCookie(key){
  if (document.cookie.length>0){
    var head=document.cookie.indexOf(key + "=");
    if (head>-1){
      head=head + key.length+1;
      var tail=document.cookie.indexOf(";",head);
      if (tail==-1){
        tail=document.cookie.length;
        return unescape(document.cookie.substring(head,tail));
      }
    }
  }
  return "";
}

function setCookie(key,value,expiredays){
  var exdate=new Date();
  exdate.setDate(exdate.getDate()+expiredays);
  document.cookie=key+ "=" +escape(value)+
  ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}