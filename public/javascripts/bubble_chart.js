var config = { diameter: 720, margin: 50, dataUrl: "/json/user_bubble_chart_users.json" };

chart(config);

$('input[type="radio"]').change(function (e) {
    //filter chart
    visualizeIt($('input[name=options]:checked').val());
});