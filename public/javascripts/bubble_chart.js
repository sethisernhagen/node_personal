var config = { diameter: 720, margin: 50, dataUrl: "/javascripts/user_bubble_chart_users.js" };

chart(config);

$('input[type="radio"]').change(function (e) {
    //filter chart
    visualizeIt($('input[name=options]:checked').val());
});