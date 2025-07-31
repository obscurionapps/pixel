$(function(){
$('#defect_image').bind('change', function () {
  var filename = $("#defect_image").val();
  if (/^\s*$/.test(filename)) {
    $(".file-upload").removeClass('active');
    $("#noFile").text("No file chosen...");
  } else
  {
    $(".file-upload").addClass('active');
    $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
  }
});
$("#btnremoveImage").bind("click", function(){
$(".file-upload").removeClass('active');
    $("#noFile").text("No file chosen...");
});
});
