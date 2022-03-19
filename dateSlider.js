

var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
d = new Date(),
diff = d.getDate() - d.getDay(),
nextSunday = new Date(d.setDate(diff + 7)),
slider = document.getElementById('slider'),
nextWeek = {};

function setText(d) {
document.querySelector('.md-date').innerHTML = monthNames[d.getMonth()] + " " + d.getDate();
}

slider
.addEventListener('change', function (ev) {
    setText(nextWeek[Math.round(this.value)]);
});


mobiscroll.form('#demo', {
theme: 'ios',
themeVariant: 'light'
});

mobiscroll.slider('#slider', {
theme: 'ios',
themeVariant: 'light',
onInit: function (event, inst) {
    var labels = slider.parentNode.querySelectorAll('.mbsc-progress-step-label');

    for (var i = 0; i < labels.length; ++i) {
        nextWeek[Math.round(labels[i].innerHTML)] = new Date(nextSunday.getFullYear(), nextSunday.getMonth(), nextSunday.getDate() + i); // generate nextWeek object
        labels[i].innerHTML = dayNames[i];
    }
    setText(nextSunday);
}
});

