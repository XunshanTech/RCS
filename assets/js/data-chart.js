var Analytics = (function() {
  var dataFormat = function(s, homeShow) {
    homeShow = typeof homeShow === 'undefined' ? false : (homeShow && true);
    var spanLeft = homeShow ? '<span>' : '';
    var spanRight = homeShow ? '</span>' : '';
    var unit = {
      h: spanLeft + '小时' + spanRight,
      m: spanLeft + '分' + spanRight,
      s: spanLeft + '秒' + spanRight
    }
    var h = parseInt(s / 3600);
    var m = parseInt((s % 3600) / 60);
    var s = s % 60;
    var text = '';
    if(h > 0) {
      text += h + unit.h;
    }
    if(m > 0) {
      text += m + unit.m;
    }
    if((s > 0 || (s === 0 && m === 0 && h === 0)) && !homeShow) {
      text += s + unit.s;
    }
    return text;
  };

  var get30Person = function(restaurantId) {
    $.ajax({
      url: '/Restaurant/person30',
      dataType: 'json',
      data: {
        RestaurantId: restaurantId
      },
      method: 'post',
      success: function(result) {
        if(result && result.length > 0) {
          var resultIndex = result.length >= 2 ? 1 : 0;
          var newSecond = result[resultIndex].new;
          var oldSecond = (result.sort(function(a, b) {
            return b.old - a.old;
          }))[resultIndex].old;
          var second = oldSecond - newSecond;
          //4500 is one person get money / month
          var money = parseInt(second / 300 * 4500);
          $('#analytics-person-30').html(money + '<span>元</span>');
        }
      }
    })
  };

  var get30Data = function(restaurantId) {
    $.ajax({
      url: '/Restaurant/data30',
      dataType: 'json',
      data: {
        RestaurantId: restaurantId
      },
      method: 'post',
      success: function(result) {
        if(result.length > 0) {
          var ret = dataFormat(result[0].old - result[0].new, true);
          $('#analytics-data-30').html(ret);
        }
      }
    })
  };

  var getPersonData = function(restaurantId) {

    Highcharts.setOptions({
      lang: {
        weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      global: {
        useUTC: false //关闭UTC
      }
    });

    var seriesOptions = [{
      name: '原始需要服务员',
      type: 'column',
      data: []
    }, {
      name: '优化需要服务员',
      type: 'column',
      data: []
    }];
    // create the chart when all data is loaded
    var createChart = function () {
      $('#data-container').highcharts('StockChart', {
        title: {
          text: '餐厅所需服务员人数对比'
        },
        subtitle: {
          text: '使用系统前 vs 使用系统后'
        },
        rangeSelector: {
          enabled: false
        },
        credits: false,
        exporting: {
          enabled: false
        },
        legend: {
          enabled: true,
          align: 'right',
          backgroundColor: '#ffffff',
          borderWidth: 0,
          layout: 'vertical',
          verticalAlign: 'top',
          y: 100,
          shadow: false,
          itemMarginTop: 10
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
              return this.value + '人';
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
            var y = this.y + '人';
            return '<span style="color:' + seriesColor + '">' +
              seriesName + '</span>: <b>' + y + '</b><br/>';
          },
          valueDecimals: 0,
          dateTimeLabelFormats: {
            day:"%Y年%b%e日,%A",
            minute:"%A, %b%e日 %H:%M"
          }
        },
        series: seriesOptions
      });
    };

    $.ajax({
      url: '/Restaurant/personData',
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
          seriesOptions[0].data.push([date, Math.ceil(ret.old / 300)]);
          seriesOptions[1].data.push([date, Math.ceil(ret.new / 300)]);
        }
        window.setTimeout(createChart, 0);
      }
    })
  };

  var getData = function(restaurantId) {

    Highcharts.setOptions({
      lang: {
        weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      global: {
        useUTC: false //关闭UTC
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
        title: {
          text: '餐厅服务时间对比'
        },
        subtitle: {
          text: '使用系统前 vs 使用系统后'
        },
        rangeSelector: {
          enabled: false
        },
        credits: false,
        exporting: {
          enabled: false
        },
        legend: {
          enabled: true,
          align: 'right',
          backgroundColor: '#ffffff',
          borderWidth: 0,
          layout: 'vertical',
          verticalAlign: 'top',
          y: 100,
          shadow: false,
          itemMarginTop: 10
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
            day: '%b%e日',
            week: '%b%e日'
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
          var date = (new Date()).setTime(ret.date);
          seriesOptions[0].data.push([date, ret.old]);
          seriesOptions[1].data.push([date, ret.new]);
        }
        window.setTimeout(createChart, 0);
      }
    })
  };

  return {
    getData: getData,
    getPersonData: getPersonData,
    get30Data: get30Data,
    get30Person: get30Person
  }
}).call(this);