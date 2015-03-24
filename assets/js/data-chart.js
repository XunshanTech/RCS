var getData = function(restaurantId) {
  Highcharts.setOptions({
    lang: {
      weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    }
  });

  var seriesOptions = [];
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
        labels: {
          formatter: function () {
            return this.value + '分钟';
          }
        },
        plotLines: [{
          value: 0,
          width: 2,
          color: 'silver'
        }]
      },

      plotOptions: {
        series: {
        }
      },

      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}分钟</b><br/>',
        valueDecimals: 2,
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
      seriesOptions = [{
        name: '原始服务时间',
        data: [
          /* Mar 2008 */
          [1206316800000,29.17],
          [1206403200000,29.14],
          [1206489600000,28.56],
          [1206576000000,28.05],
          [1206662400000,27.91],
          [1206921600000,28.38],
          /* Apr 2008 */
          [1207008000000,29.50],
          [1207094400000,29.16],
          [1207180800000,29.00],
          [1207267200000,29.16],
          [1207526400000,29.16],
          [1207612800000,28.75],
          [1207699200000,28.89],
          [1207785600000,29.11],
          [1207872000000,28.28],
          [1208131200000,28.06],
          [1208217600000,28.25],
          [1208304000000,28.95],
          [1208390400000,29.22],
          [1208476800000,30.00],
          [1208736000000,30.42],
          [1208822400000,30.25],
          [1208908800000,31.45],
          [1208995200000,31.80],
          [1209081600000,29.83],
          [1209340800000,28.99],
          [1209427200000,28.64],
          [1209513600000,28.52]]
      }, {
        name: '优化服务时间',
        data: [
          /* Mar 2008 */
          [1206316800000,19.93],
          [1206403200000,20.14],
          [1206489600000,20.72],
          [1206576000000,20.04],
          [1206662400000,20.43],
          [1206921600000,20.50],
          /* Apr 2008 */
          [1207008000000,21.36],
          [1207094400000,21.07],
          [1207180800000,21.66],
          [1207267200000,21.87],
          [1207526400000,22.27],
          [1207612800000,21.83],
          [1207699200000,21.63],
          [1207785600000,22.08],
          [1207872000000,21.02],
          [1208131200000,21.11],
          [1208217600000,21.20],
          [1208304000000,21.96],
          [1208390400000,22.07],
          [1208476800000,23.01],
          [1208736000000,24.02],
          [1208822400000,22.89],
          [1208908800000,23.27],
          [1208995200000,24.13],
          [1209081600000,24.25],
          [1209340800000,24.61],
          [1209427200000,25.01],
          [1209513600000,24.85]
        ]
      }]
      window.setTimeout(createChart, 0);
    }
  })
};