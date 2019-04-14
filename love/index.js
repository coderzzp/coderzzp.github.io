$("#button").on("click",function(){
  $("#button").fadeOut()
  $("#xinfeng").fadeOut("slow",function(){
    
    $("#code").show().typewriter()

  });
})