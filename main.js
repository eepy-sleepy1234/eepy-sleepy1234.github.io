document.addEventListener('DOMContentLoaded', function() {
const buttonElement = document.getElementById('gameButton')
buttonElement.addEventListener('click', function(event) {
    console.log('button')
    window.location.href = 'game.html'
})
})