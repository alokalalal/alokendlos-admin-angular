$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});
$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('.wrapper').toggleClass('active');
    });
});
$(document).ready(function () {
    $('#searchIcon').on('click', function () {
        $('.searchBoxCon').toggleClass('open');
    });
});

$('.tabBoxUl li a').click(function() {
    $('.tabBoxUl li a').removeClass('active');
    $(this).addClass('active');
});

$('.listGridBtn').click(function() {
    $('.listGridShow').toggle('1000');
    $("i", this).toggleClass("active");
});

$(document).ready(function(){
    $('.custom-file-input input[type="file"]').change(function(e){
        $(this).siblings('input[type="text"]').val(e.target.files[0].name);
    });
});

$(document).ready(function(){
    $(".editBoxOpenIcon").click(function(){
        $(".editBoxDataCon").addClass("active");
    });
    $(".editBoxClose").click(function(){
        $(".editBoxDataCon").removeClass("active");
    });
});