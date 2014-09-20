function newSnowFlower() {
  var canvas = document.getElementById('canvas');
  for (var i=0; i<20; i++) {
    setTimeout(function() {
      var newSnow = document.createElement('div'); 
      newSnow.style['left'] = Math.random() * canvas.clientWidth + 'px';
      newSnow.className = 'snow small';
      canvas.appendChild(newSnow);
      newSnow.addEventListener("click", function() {
        this.className = 'snow large';
        var e = this;
      });
    }, i * 3500 * Math.random());
  }
}

newSnowFlower();
