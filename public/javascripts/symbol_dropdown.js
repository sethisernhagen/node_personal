$("#symbol-ul li").click(function () {
    
    var timeValue = $(this).text() + '&nbsp<span class="caret"></span>';
    
    $("#symbol-button:first-child").html(timeValue);
    
    var tmpSelected = $(this).attr('data-value');
   
    getData(tmpSelected);
});