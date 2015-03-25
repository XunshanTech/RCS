var getData = function(restaurantId) {
  var dataFormat = function(s) {
    var m = parseInt(s / 60);
    var s = (s % 60);
    var text = '';
    if(m > 0) {
      text += m + '分';
    }
    if(s > 0 || (s === 0 && m === 0)) {
      text += s + '秒';
    }
    return text;
  };

  Highcharts.setOptions({
    lang: {
      weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }
  });

  var seriesOptions = [{
    name: '原始服务时间',
    type: 'area',
    data: []
  }, {
    name: '优化服务时间',
    type: 'area',
    data: []
  }];
  // create the chart when all data is loaded
  var createChart = function () {
    $('#data-container').highcharts('StockChart', {

      rangeSelector: {
        enabled: false
      },

      credits: false,

      exporting: {
        enabled: false
      },

      chart: {
        width: $('#data-container').width()
      },

      navigator: {
        xAxis: {
          dateTimeLabelFormats: {
            day: '%b%e日',
            week: '%b%e日',
            month: '%b%e日',
            year: '%Y'
          }
        }
      },

      xAxis: {
        dateTimeLabelFormats: {
          day: '%b%e日'
        }
      },

      yAxis: {
        min: 0,
        labels: {
          formatter: function () {
            return dataFormat(this.value);
          }
        },
        plotLines: [{
          value: 0,
          width: 2
        }]
      },

      tooltip: {
        pointFormatter: function() {
          var seriesColor = this.series.color;
          var seriesName = this.series.name;
          var y = dataFormat(this.y);
          return '<span style="color:' + seriesColor + '">' +
            seriesName + '</span>: <b>' + y + '</b><br/>';
        },
        valueDecimals: 0,
        dateTimeLabelFormats: {
          day:"%Y年%b%e日,%A"
        }
      },

      series: seriesOptions
    });
  };

  $.ajax({
    url: '/Restaurant/data',
    dataType: 'json',
    data: {
      RestaurantId: restaurantId
    },
    method: 'post',
    success: function(result) {
      console.log(result);
      for(var i = 0; i < result.length; i++) {
        var ret = result[i];
        var date = (new Date(ret.date)).getTime();
        seriesOptions[0].data.push([date, ret.old]);
        seriesOptions[1].data.push([date, ret.new]);
      }
      window.setTimeout(createChart, 0);
    }
  })
};