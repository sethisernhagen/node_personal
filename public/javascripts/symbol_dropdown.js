$("#symbol-ul li").click(function () {
    
    var timeValue = $(this).text() + '&nbsp<span class="caret"></span>';
    
    $("#symbol-button:first-child").html(timeValue);
    
    var tmpSelected = $(this).attr('data-value');
    
    //selected value changed, filter chart
    if (currentTimeOption != tmpSelected) {
        currentTimeOption = tmpSelected;
        
        //filter data using given time value
        FilterData(currentCopyNumberOption, getStartDate(currentTimeOption), getEndDate(currentTimeOption), currentBucketOption);
    }
});