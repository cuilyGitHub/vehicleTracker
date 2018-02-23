//下方播放插件
L.Playback = L.Playback || {};
L.Playback.Control = L.Control.extend({
    /*_html1: '<footer class="lp" style="display:none">' +
    '  <div class="transport">' +
    '    <div class="navbar">' +
    '      <div class="navbar-inner">' +
    '        <ul class="nav">' +
    '          <li class="ctrl">' +
    '            <a id="play-pause" href="#"><i id="play-pause-icon" class="fa fa-play fa-lg"></i></a>' +
    '          </li>' +
    '          <li class="ctrl dropup">' +
    '            <a id="clock-btn" class="clock" href="#">' +
    '              <span id="cursor-date"></span><br/>' +
    '              <span id="cursor-time"></span>' +
    '            </a>' +
    '          </li>' +
    '        </ul>' +
    '        <ul class="nav pull-right">' +
    '          <li>' +
    '            <div id="time-slider"></div>' +
    '          </li>' +
    '          <li class="ctrl dropup" style="display: none">' +
    '            <a id="speed-btn" data-toggle="dropdown" href="#">' +
    '                 <i class="fa fa-dashboard fa-lg"></i> ' +
    '                 <span id="speed-icon-val" class="speed" style="font-size: 8px">1</span>' +
    '            </a>' +
    '            <div class="speed-menu dropdown-menu" role="menu" aria-labelledby="speed-btn">' +
    '              <label>播放速度</label>' +
    '              <div id="speed-slider"></div>' +
    '            </div>' +
    '          </li>' +
    '          <li class="ctrl">' +
    '            <a id="display-tracks-btn" href="#"></a>' +
    '          </li>' +
    '        </ul>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</footer>',*/

    _html:'<div class="tool-bar">' +
    '  <div id="playRate" class="play-rate">' +
    '    <span class="rate">1x</span>' +
    '    <span class="rate">10x</span>' +
    '    <span class="rate">20x</span>' +
    '    <span class="rate">50x</span>' +
    '    <span class="rate">100x</span>' +
    '    <span class="rate">1000x</span>' +
    '  </div>' +
    '  <div id="Demo">' +
    '    <div id="Main" class="main">' +
    '     <div id="play-pause" class="play-btn"><i id="play-pause-icon" class="fa fa-play fa-lg"></i></div>' +
    '     <div id="scrollBar" class="scroll-bar">' +
    '       <div id="scroll_Track" class="scroll-track"></div>' +
    '       <div id="scroll_Thumb" class="scroll-thumb"></div>' +
    '     </div>' +
    '    </div>' +
    '  </div>' +
    '  <div class="info">' +
    '    <span id="cursor-date"></span>' +
    '    <span id="cursor-time" class="time"></span>' +
    '    <span id="direct" class="direction">方向：无</span>' +
    '  </div>' +
    '</div>',

    initialize: function (playback) {
        this.playback = playback;
        playback.addCallback(this._clockCallback);
    },

    onAdd: function (map) {
        var html = this._html;
        $('#track').after(html);
        this._setup();
        return L.DomUtil.create('div');
    },

    _setup: function () {
      var self = this;
      var playback = this.playback;
      playback._tracksLayer.displayAll(); //显示轨迹

      $('#play-pause').click(function () {
            if (playback.isPlaying() === false) {
                playback.start();
                $('#play-pause-icon').removeClass('fa-play');
                $('#play-pause-icon').addClass('fa-pause');
            } else {
                playback.stop();
                $('#play-pause-icon').removeClass('fa-pause');
                $('#play-pause-icon').addClass('fa-play');
            }
        });

        var startTime = playback.getStartTime();
        var endTime = playback.getEndTime();
        this.initIimeGap = endTime - startTime;
        $('#cursor-date').html(L.Playback.Util.DateStr(startTime));
        $('#cursor-time').html(L.Playback.Util.TimeStr(startTime));

        /*$('#time-slider').slider({
            min: playback.getStartTime(),
            max: playback.getEndTime(),
            step: playback.getTickLen(),
            value: playback.getTime(),
            slide: function (event, ui) {
                playback.setCursor(ui.value);
                $('#cursor-time').val(ui.value.toString());
                $('#cursor-time-txt').html(new Date(ui.value).toString());
            }
        });*/

        //拖拽进度条
        this._setScrollBar(startTime,'Initialize');

        //播放速度
        $('#playRate span').click(function () {
          $("#playRate span").eq($(this).index()).addClass("rate-active").siblings().removeClass('rate-active');
          var value = parseInt($(this).html());
          var speed = self._sliderValToSpeed(parseFloat(value));
          playback.setSpeed(speed);
        })

        /*$('#speed-slider').slider({
            min: 0,
            max: 19,
            step: 1,
            value: self._speedToSliderVal(this.playback.getSpeed()),
            orientation: 'vertical',
            slide: function (event, ui) {
                var speed = self._sliderValToSpeed(parseFloat(ui.value));
                playback.setSpeed(speed);
                $('.speed').html(speed).val(speed);
            }
        });*/

        /*$('#speed-input').on('keyup', function (e) {
            var speed = parseFloat($('#speed-input').val());
            if (!speed) return;
            playback.setSpeed(speed);
            //$('#speed-slider').slider('value', speedToSliderVal(speed));
            $('#speed-icon-val').html(speed);
            if (e.keyCode === 13) {
                $('.speed-menu').dropdown('toggle');
            }
        });*/


        $('#date-input').on('keyup', function (e) {
            $('#calendar').datepicker('setDate', $('#date-input').val());
        });

        $('.dropdown-menu').on('click', function (e) {
            e.stopPropagation();
        });


        $('#load-tracks-save').on('click', function (e) {
            var file = $('#load-tracks-file').get(0).files[0];
            self._loadTracksFromFile(file);
        });
        /*$('#display-tracks-btn')[0].innerHTML = '<i class="fa fa-map-marker fa-lg"></i>显示轨迹';
        var isDisplay = false;
        $('#display-tracks-btn').click(function () {
            if (!isDisplay) {
                isDisplay = true;
                playback._tracksLayer.displayAll();
                $('#display-tracks-btn')[0].innerHTML = '<i class="fa fa-map-marker fa-lg"></i>隐藏轨迹';
            } else {
                isDisplay = false;
                playback._tracksLayer.displayNone();
                $('#display-tracks-btn')[0].innerHTML = '<i class="fa fa-map-marker fa-lg"></i>显示轨迹';
            }
        });*/

    },

    _setScrollBar:function (startTime,endTime) {
    var currentX = 0;
    console.log(new Date(startTime));
    console.log(new Date(endTime));
    var playback = this.playback;
    var Initialize = function() {
      if (startTime > endTime) {
        alert("给定当前值大于了最大值");
        return;
      }
      $("#scroll_Track").css("width", currentX + 2 + "px");
      $("#scroll_Thumb").css("margin-left", currentX + "px");
      Value();
    };
    var Value = function() {
        var valite = false;
        var currentValue;//移动多少个像素
        var oldX = 0;
        var moveEndX,startX;
        $("#scroll_Thumb").on('touchstart',function(event) {
          valite = true;
          startX = event.originalEvent.changedTouches[0].pageX;
        });
        $(document.body).on('touchmove',function(event) {
          if (valite == false) return;
          moveEndX = event.originalEvent.changedTouches[0].pageX;
          X = moveEndX - startX ;
          if ( X > oldX ) {
            startTime += 1000;
            oldX = X;
          }
          else if ( X < oldX ) {
            startTime -= 1000;
            oldX = X;
          }
          var changeX = event.originalEvent.changedTouches[0].clientX - currentX;
          currentValue = changeX - currentX-$("#Demo").offset().left;
          $("#scroll_Thumb").css("margin-left", currentValue + "px");
          $("#scroll_Track").css("width", currentValue + 2 + "px");
          if(currentValue <= 0){
            $("#scroll_Thumb").css("margin-left", "0px");
            $("#scroll_Track").css("width", "0px");
            return;
          }else if(currentValue >= $('#scrollBar').width()){
            startTime = endTime;
            $("#scroll_Thumb").css("margin-left", $('#scrollBar').width() - 15 + 'px');
            $("#scroll_Track").css("width", $('#scrollBar').width() + 'px');
            return
          }
          playback.setCursor(startTime);
          //$('#cursor-date').html(L.Playback.Util.DateStr(startTime));
          //$('#cursor-time').html(L.Playback.Util.TimeStr(startTime));
        });
        $(document.body).on('touchend',function() {
          this.value = Math.round(100 * (currentValue / $("#scrollBar").width()));
          valite = false;
        });
      }
      Initialize();
    },

    /*currentX:0,
    _setScrollBar:function (startTime,init) {
      var self = this;
      var playback = this.playback;
      var endTime = playback.getEndTime();
      var scrollWidth = $('.scroll-bar').width();
      var timeGap = parseInt(endTime - startTime);
      var timeGapPercent = self.initIimeGap/timeGap/100/1000;

      console.log('开始时间：'+new Date(startTime));
      console.log('结束时间：'+new Date(endTime));
      console.log('开始时间：'+startTime);
      console.log('结束时间：'+endTime);
      console.log('经过的时间/时间差:'+self.initIimeGap/timeGap/100/1000);
      console.log('时间差:'+timeGap); //会越来越小
      console.log('进度条长度：'+$('.scroll-bar').width());


      var Initialize = function() {  //初始化
        if (startTime > endTime) {
          alert("给定当前值大于了最大值");
          return;
        }
        Value();
        playProgress(timeGap);
      };
      console.log(this.currentX);
      var playProgress = function (timeGap) {
        //console.log(parseInt(timeGap / 1000 / 60)/100);
        console.log(scrollWidth * timeGapPercent);
        if(!init){
          self.currentX += scrollWidth * timeGapPercent;
        }
        if(self.currentX >= scrollWidth){
          self.currentX = scrollWidth;
        }
        $("#scroll_Track").css("width", self.currentX + 2 + "px");
        $("#scroll_Thumb").css("margin-left", self.currentX + "px");
      }


      var Value = function() {
        var valite = false;
        var currentValue;
        var oldX = 0;
        var moveEndX,startX;
        /!*$("#scroll_Thumb").on('touchstart',function(event) {
          valite = true;
          startX = event.originalEvent.changedTouches[0].pageX;
        });*!/

        /!*$(document.body).on('touchmove',function(event) {
          if (valite == false) return;
          moveEndX = event.originalEvent.changedTouches[0].pageX;
          X = moveEndX - startX ;
          if ( X > oldX ) {
            startTime += 40000;
            oldX = X;
          }
          else if ( X < oldX ) {
            startTime -= 40000;
            oldX = X;
          }
          var changeX = event.originalEvent.changedTouches[0].clientX - currentX;
          currentValue = changeX - currentX-$("#Demo").offset().left;
          $("#scroll_Thumb").css("margin-left", currentValue + "px");
          $("#scroll_Track").css("width", currentValue + 2 + "px");
          if(currentValue <= 0){
            $("#scroll_Thumb").css("margin-left", "0px");
            $("#scroll_Track").css("width", "0px");
            return;
          }else if(currentValue >= $('#scrollBar').width()){
            startTime = endTime;
            $("#scroll_Thumb").css("margin-left", $('#scrollBar').width() - 15 + 'px');
            $("#scroll_Track").css("width", $('#scrollBar').width() + 'px');
            return
          }
          playback.setCursor(startTime);
          //$('#cursor-date').html(L.Playback.Util.DateStr(startTime));
          //$('#cursor-time').html(L.Playback.Util.TimeStr(startTime));
        });*!/

        /!*$(document.body).on('touchend',function() {
          this.value = Math.round(100 * (currentValue / $("#scrollBar").width()));
          valite = false;
        });*!/

      }
      Initialize();
    },*/

    _clockCallback: function (ms) {
      $('#cursor-date').html(L.Playback.Util.DateStr(ms));
      $('#cursor-time').html(L.Playback.Util.TimeStr(ms));
      //control._setScrollBar(ms);
      //持续更新进度条
      //$('#time-slider').slider('value', ms);
    },

    _speedToSliderVal: function (speed) {
        if (speed < 1) return -10 + speed * 10;
        return speed - 1;
    },

    _sliderValToSpeed: function (val) {
        if (val < 0) return parseFloat((1 + val / 10).toFixed(2));
        return val + 1;
    },

    _combineDateAndTime: function (date, time) {
        var yr = date.getFullYear();
        var mo = date.getMonth();
        var dy = date.getDate();
        var hr = time.hours || time.hour;
        if (time.meridian === 'PM' && hr !== 12) hr += 12;
        var min = time.minutes || time.minute;
        var sec = time.seconds || time.second;
        return new Date(yr, mo, dy, hr, min, sec).getTime();
    }
});


L.Playback.MoveableMarker = {
    create: function (startLatLng, options, feature) {
        var lng = startLatLng.lng;
        var lat = startLatLng.lat;
        var point = new BMap.Point(lng, lat);
        var marker = null;
        if (feature.icon) {
            let icon=new BMap.Icon(feature.icon,new BMap.Size(30, 53),{
                anchor:new BMap.Size(20, 20),
                imageSize:new BMap.Size(30, 53)
            });
            marker = new BMap.Marker(point, {icon: icon});
        } else {
            marker = new BMap.Marker(point);
        }
        bMap.addOverlay(marker);
        return marker
    },
};

L.Playback.Track.include({
    initialize : function (geoJSON, options) {
        options = options || {};
        var tickLen = options.tickLen || 250;
        this._staleTime = options.staleTime || 60*60*1000;
        this._fadeMarkersWhenStale = options.fadeMarkersWhenStale || false;

        this._geoJSON = geoJSON;
        this.options=options;
        this._tickLen = tickLen;
        this._ticks = [];
        this._marker = null;
        this._orientations = [];

        var sampleTimes = geoJSON.properties.time;

        this._orientIcon = options.orientIcons;
        var previousOrientation;

        var samples = geoJSON.geometry.coordinates;
        var currSample = samples[0];
        var nextSample = samples[1];

        var currSampleTime = sampleTimes[0];
        var t = currSampleTime;  // t is used to iterate through tick times
        var nextSampleTime = sampleTimes[1];
        var tmod = t % tickLen; // ms past a tick time
        var rem,
            ratio;

        // handle edge case of only one t sample
        if (sampleTimes.length === 1) {
            if (tmod !== 0)
                t += tickLen - tmod;
            this._ticks[t] = samples[0];
            this._orientations[t] = 0;
            this._startTime = t;
            this._endTime = t;
            return;
        }

        // interpolate first tick if t not a tick time
        if (tmod !== 0) {
            rem = tickLen - tmod;
            ratio = rem / (nextSampleTime - currSampleTime);
            t += rem;
            this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
            this._orientations[t] = this._directionOfPoint(currSample,nextSample);
            previousOrientation = this._orientations[t];
        } else {
            this._ticks[t] = currSample;
            this._orientations[t] = this._directionOfPoint(currSample,nextSample);
            previousOrientation = this._orientations[t];
        }

        this._startTime = t;
        t += tickLen;
        while (t < nextSampleTime) {
            ratio = (t - currSampleTime) / (nextSampleTime - currSampleTime);
            this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
            this._orientations[t] = this._directionOfPoint(currSample,nextSample);
            previousOrientation = this._orientations[t];
            t += tickLen;
        }

        // iterating through the rest of the samples
        for (var i = 1, len = samples.length; i < len; i++) {
            currSample = samples[i];
            nextSample = samples[i + 1];
            t = currSampleTime = sampleTimes[i];
            nextSampleTime = sampleTimes[i + 1];

            tmod = t % tickLen;
            if (tmod !== 0 && nextSampleTime) {
                rem = tickLen - tmod;
                ratio = rem / (nextSampleTime - currSampleTime);
                t += rem;
                this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
                if(nextSample){
                    this._orientations[t] = this._directionOfPoint(currSample,nextSample);
                    previousOrientation = this._orientations[t];
                } else {
                    this._orientations[t] = previousOrientation;
                }
            } else {
                this._ticks[t] = currSample;
                if(nextSample){
                    this._orientations[t] = this._directionOfPoint(currSample,nextSample);
                    previousOrientation = this._orientations[t];
                } else {
                    this._orientations[t] = previousOrientation;
                }
            }

            t += tickLen;
            while (t < nextSampleTime) {
                ratio = (t - currSampleTime) / (nextSampleTime - currSampleTime);

                if (nextSampleTime - currSampleTime > options.maxInterpolationTime){
                    this._ticks[t] = currSample;

                    if(nextSample){
                        this._orientations[t] = this._directionOfPoint(currSample,nextSample);
                        previousOrientation = this._orientations[t];
                    } else {
                        this._orientations[t] = previousOrientation;
                    }
                }
                else {
                    this._ticks[t] = this._interpolatePoint(currSample, nextSample, ratio);
                    if(nextSample) {
                        this._orientations[t] = this._directionOfPoint(currSample,nextSample);
                        previousOrientation = this._orientations[t];
                    } else {
                        this._orientations[t] = previousOrientation;
                    }
                }

                t += tickLen;
            }
        }

        // the last t in the while would be past bounds
        this._endTime = t - tickLen;
        this._lastTick = this._ticks[this._endTime];

    },
    setMarker: function (timestamp, options) {
        var lngLat = null;

        // if time stamp is not set, then get first tick
        if (timestamp) {
            lngLat = this.tick(timestamp);
        }
        else {
            lngLat = this.getFirstTick();
        }

        if (lngLat) {
            var latLng = new L.LatLng(lngLat[1], lngLat[0]);
            this._marker = new L.Playback.MoveableMarker.create(latLng, options, this._geoJSON);
            if (options.mouseOverCallback) {
                this._marker.on('mouseover', options.mouseOverCallback);
            }
            if (options.clickCallback) {
                this._marker.on('click', options.clickCallback);
            }

            //hide the marker if its not present yet and fadeMarkersWhenStale is true
            if (this._fadeMarkersWhenStale && !this.trackPresentAtTick(timestamp)) {
                this._marker.setOpacity(0);
            }
        }

        return this._marker;
    },
    moveMarker: function (point, transitionTime, timestamp) {
        if (this._marker) {
            if (this._fadeMarkersWhenStale) {
                //show the marker if its now present
                if (this.trackPresentAtTick(timestamp)) {
                    this._marker.setOpacity(1);
                } else {
                    this._marker.setOpacity(0);
                }

                if (this.trackStaleAtTick(timestamp)) {
                    this._marker.setOpacity(0.25);
                }
            }

            if (this._orientIcon) {
                this.setIconAngle(this.courseAtTime(timestamp));
            }
            this.move(point, transitionTime);
        }
    },
    move: function (point, transitionTime) {
        // Only if CSS3 transitions are supported

        if (L.DomUtil.TRANSITION) {
            if (this._marker.V) {
                this._marker.V.style[L.DomUtil.TRANSITION] = 'all ' + transitionTime + 'ms linear';
            }
        }
        this._marker.setPosition(point);
        if (this.options.iconAngle) {
          //var deviceSpeed = this._geoJSON.deviceSpeeds
          var direct = getDirct(this.options.iconAngle);
            $("#direct").html('方向：'+direct);
            if(this._marker.V){
                // var a = this.options.icon.options.iconAnchor;
                // var s = this.options.icon.options.iconSize;
                var marker=this._marker;
                this._updateImg(marker);
            }
        }
    },
    _updateImg: function (marker) {
        marker.setRotation(this.options.iconAngle)
    },
    setIconAngle: function (iconAngle) {
        this.options.iconAngle = iconAngle;
    },
});


L.Playback.TrackController.include({
    // add single track
    addTrack: function (track, timestamp) {
        // return if nothing is set
        if (!track) {
            return;
        }

        var marker = track.setMarker(timestamp, this.options);

        if (marker) {
            // marker.addTo(this._map);

            this._tracks.push(track);
        }
    },
    tock: function (timestamp, transitionTime) {
      for (var i = 0, len = this._tracks.length; i < len; i++) {
            var lngLat = this._tracks[i].tick(timestamp);
            var point = new BMap.Point(lngLat[0], lngLat[1]);
            this._tracks[i].moveMarker(point, transitionTime, timestamp);
        }
    },
});

L.Playback.TracksLayer.include({
    initialize: function(map, options) {
        this.polyline = [];
        this._options = options;
    },

    // clear all geoJSON layers
    clearLayer: function() {
        this.polyline = [];
    },

    // add new geoJSON layer
    addLayer: function(geoJSON) {
        var lineArray = [];
        for (var i = 0, l =geoJSON.geometry.coordinates.length; i < l; i++) {
            var lnglat = geoJSON.geometry.coordinates[i];
            lineArray.push(new BMap.Point(lnglat[0], lnglat[1]));
        }
        this.polyline.push(new BMap.Polyline(lineArray),{strokeColor:"blue"});
    },
    displayAll: function() {
        for (let i = 0; i < this.polyline.length; i++) {
            bMap.addOverlay(this.polyline[i]);
        }
    },
    displayNone: function() {
        for (let i = 0; i < this.polyline.length; i++) {
            bMap.removeOverlay(this.polyline[i]);
        }
    }

});

var gDirect = "";
function getDirct(direct) {
  if(direct<=15 || direct >= 345) {
    dir = "正北";
  } else if(direct>=15 && direct<=75) {
    dir = "东北";
  } else if(direct>=75 && direct <= 105) {
    dir= "正东";
  } else if(direct >= 105 && direct <= 165) {
    dir = "东南";
  } else if(direct>= 165 && direct <= 195 ) {
    dir = "正南";
  } else if(direct>= 195 && direct <= 255 ) {
    dir = "西南";
  } else if(direct>= 255 && direct <= 285 ) {
    dir = "正西";
  } else if(direct>= 285 && direct <= 345 ) {
    dir = "西北";
  }
  gDirect = dir;
  return dir ;
}

