document.getElementById('date').innerHTML = new Date().toLocaleString(lg)
setInterval(function(){
    document.getElementById('date').innerHTML = new Date().toLocaleString(lg)
}, 100)

const query = (new URLSearchParams((new URL(window.location.href)).search))