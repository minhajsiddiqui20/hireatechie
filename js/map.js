(function() {
  var canvas = document.getElementById('mapCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var green = '#1D9E75';
  var greenDark = '#0F6E56';
  var dotColor = 'rgba(180,176,165,0.55)';
  var CYCLE = 3.6;
  var animFrame;
  var startTime = null;

  var markers = [
    { lon: 78.9,   lat: 20.6,  label: 'India',       sub: 'Talent source',   side: 'right' },
    { lon: 174.9,  lat: -40.9, label: 'New Zealand',  sub: 'Primary market',  side: 'left'  },
    { lon: 133.8,  lat: -25.3, label: 'Australia',    sub: 'Served market',   side: 'left'  }
  ];

  var particles = [
    { delay: 0,   route: 0 },
    { delay: 1.2, route: 0 },
    { delay: 2.4, route: 0 },
    { delay: 0.6, route: 1 },
    { delay: 1.8, route: 1 },
    { delay: 3.0, route: 1 }
  ];

  function isLand(lon, lat) {
    if (lat > 15  && lat < 70  && lon > 25  && lon < 145) return true;
    if (lat > -35 && lat < 15  && lon > 10  && lon < 52)  return true;
    if (lat > 35  && lat < 70  && lon > -10 && lon < 30)  return true;
    if (lat > 25  && lat < 50  && lon > -130 && lon < -60) return true;
    if (lat > 50  && lat < 70  && lon > -140 && lon < -60) return true;
    if (lat > -55 && lat < 12  && lon > -82 && lon < -34)  return true;
    if (lat > 10  && lat < 25  && lon > -90 && lon < -77)  return true;
    if (lat > -40 && lat < -10 && lon > 113 && lon < 154)  return true;
    if (lat > -46 && lat < -34 && lon > 166 && lon < 178)  return true;
    if (lat > -22 && lat < -10 && lon > 130 && lon < 148)  return true;
    return false;
  }

  var dots = [];
  for (var lat = -80; lat <= 80; lat += 2.5) {
    for (var lon = -180; lon <= 180; lon += 2.5) {
      if (isLand(lon, lat)) dots.push([lon, lat]);
    }
  }

  function toXY(lon, lat, w, h) {
    return [(lon + 180) / 360 * w, (90 - lat) / 180 * h];
  }

  function bezier(p0, p1, p2, t) {
    var mt = 1 - t;
    return [mt*mt*p0[0] + 2*mt*t*p1[0] + t*t*p2[0],
            mt*mt*p0[1] + 2*mt*t*p1[1] + t*t*p2[1]];
  }

  function getRoute(idx, w, h) {
    var india = toXY(78.9,  20.6,  w, h);
    var nz    = toXY(174.9, -40.9, w, h);
    var aus   = toXY(133.8, -25.3, w, h);
    if (idx === 0) {
      var ctrl = [(india[0]+nz[0])/2, Math.min(india[1],nz[1]) - h*0.2];
      return { p0:india, p1:ctrl, p2:nz };
    } else {
      var ctrl2 = [(india[0]+aus[0])/2, Math.min(india[1],aus[1]) - h*0.13];
      return { p0:india, p1:ctrl2, p2:aus };
    }
  }

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width  = rect.width  + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
  }

  function draw(ts) {
    if (!startTime) startTime = ts;
    var elapsed = (ts - startTime) / 1000;
    var w = canvas.width  / (window.devicePixelRatio || 1);
    var h = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);

    var india = toXY(78.9,  20.6,  w, h);
    var nz    = toXY(174.9, -40.9, w, h);
    var aus   = toXY(133.8, -25.3, w, h);

    var dotR = w < 600 ? 1.2 : 1.8;
    for (var i = 0; i < dots.length; i++) {
      var xy = toXY(dots[i][0], dots[i][1], w, h);
      var di = Math.hypot(xy[0]-india[0], xy[1]-india[1]);
      var dn = Math.hypot(xy[0]-nz[0],    xy[1]-nz[1]);
      var da = Math.hypot(xy[0]-aus[0],   xy[1]-aus[1]);
      var minD = Math.min(di, dn, da);
      var thresh = w * 0.07;
      if (minD < thresh) {
        var alpha = 0.2 + (1 - minD/thresh) * 0.6;
        ctx.fillStyle = 'rgba(29,158,117,' + alpha.toFixed(2) + ')';
      } else {
        ctx.fillStyle = dotColor;
      }
      ctx.beginPath();
      ctx.arc(xy[0], xy[1], dotR, 0, Math.PI*2);
      ctx.fill();
    }

    for (var r = 0; r < 2; r++) {
      var route = getRoute(r, w, h);
      ctx.beginPath();
      ctx.moveTo(route.p0[0], route.p0[1]);
      ctx.quadraticCurveTo(route.p1[0], route.p1[1], route.p2[0], route.p2[1]);
      ctx.strokeStyle = 'rgba(29,158,117,0.18)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (var p = 0; p < particles.length; p++) {
      var part = particles[p];
      var t = ((elapsed - part.delay) % CYCLE) / CYCLE;
      if (t < 0) continue;
      var fade = t < 0.1 ? t/0.1 : t > 0.85 ? (1-t)/0.15 : 1;
      var rt = getRoute(part.route, w, h);
      var pt = bezier([rt.p0[0],rt.p0[1]], [rt.p1[0],rt.p1[1]], [rt.p2[0],rt.p2[1]], t);
      ctx.beginPath();
      ctx.arc(pt[0], pt[1], 4, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(29,158,117,' + (fade*0.9).toFixed(2) + ')';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pt[0], pt[1], 8, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(29,158,117,' + (fade*0.2).toFixed(2) + ')';
      ctx.fill();
    }

    var pulse = (Math.sin(elapsed * 2.2) + 1) / 2;
    var mxy = [india, nz, aus];
    var mdata = markers;

    for (var m = 0; m < mdata.length; m++) {
      var mx = mxy[m][0], my = mxy[m][1];
      ctx.beginPath();
      ctx.arc(mx, my, 5 + pulse*7, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(29,158,117,' + (0.07 + pulse*0.08).toFixed(2) + ')';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mx, my, 6, 0, Math.PI*2);
      ctx.fillStyle = m === 0 ? green : greenDark;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(mx, my, 6, 0, Math.PI*2);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      var fs = w < 500 ? 10 : 12;
      var offset = mdata[m].side === 'left' ? -12 : 12;
      ctx.textAlign = mdata[m].side === 'left' ? 'right' : 'left';
      ctx.font = '500 ' + fs + 'px DM Sans, sans-serif';
      ctx.fillStyle = '#1a1a18';
      ctx.fillText(mdata[m].label, mx + offset, my - 2);
      ctx.font = '300 ' + (fs-1) + 'px DM Sans, sans-serif';
      ctx.fillStyle = green;
      ctx.fillText(mdata[m].sub, mx + offset, my + 13);
    }

    animFrame = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    if (animFrame) cancelAnimationFrame(animFrame);
    startTime = null;
    animFrame = requestAnimationFrame(draw);
  }

  init();

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 100);
  });
})();
