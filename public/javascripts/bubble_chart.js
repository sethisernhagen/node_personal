var config = { diameter: 720, margin: 50, dataUrl: "/javascripts/user_bubble_chart_users.json" };

chart(config);

$('input[type="radio"]').change(function (e) {
    filterActive(!$('input[type="radio"]').prop("checked"));
});