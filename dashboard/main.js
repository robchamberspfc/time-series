function createNode(element) {
  return document.createElement(element); // Create the type of element you pass in the parameters
}

function append(parent, el) {
  return parent.appendChild(el); // Append the second parameter(element) to the first one
}

function getParamsNew() {
  //urlLower = url.toLowerCase()
  queryString = url.split('?')[1]
  if (queryString != null) {
  queryString = queryString.split('#')[0];
  id = queryString.split('&');
  for (var i = 0; i < id.length; i++) {
    cdid = id[i].split('=');
    if (cdid[0] == "id") {
      newId = cdid[1]
      parameters[i] = newId;
    } else {
      if (cdid[0] == "title") {
        title = cdid[1]
        title = decodeURIComponent(title)
      }
      else {
        if (cdid[0] == "embed" && cdid[1] == "true") {
          // embed = cdid[1]
          // console.log (embed)
          nav.style.display = 'none';
          menu.style.display = 'none';
          searchBar.style.display = 'none';
          breadcrumb.style.display = 'none';
          footer.style.display = 'none';
        }

      }

      //future - allow users to decide if only want month/year/quarter for each series
      //console.log(cdid)
    }
    pagetitle.innerHTML = title
  }

  calcDataUri(parameters)
}
  else {
    charts.innerHTML = "<h2>No paramaters found, try this <a href='index.html?id=abmi&amp;id=chaw&amp;id=ukpop&amp;id=d7g7&amp;id=ewpop&amp;id=wapop&amp;title=Dashboard'>example</a></h2><h2>Or to see an option for embedding, try this <a href='index.html?id=abmi&amp;id=chaw&amp;id=ukpop&amp;id=d7g7&amp;id=ewpop&amp;id=wapop&amp;title=Dashboard&amp;embed=true'>example</a></h2>";
    anchors.innerHTML = "";
    breadcrumb.style.display = 'none';
  }
}

function blocks(data, latestUri) {
  fetch(latestUri, {
    mode: 'cors'
  }).then(data => data.json()).then(function(data) {
    var rand = Math.floor((Math.random() * 10000000) + 1);
    let timeSeriesDataMonths = data.months;
    let timeSeriesDataQuarters = data.quarters;
    let timeSeriesDataYears = data.years;
    if (data.months.length > 0) {
      if (data.quarters.length > 0) {
        if (data.years.length > 0) {
          var columns = "col col--md-one-third col--lg-one-third"
        } else {
          var columns = "col col--md-one-half col--lg-one-half"
        }
      } else {
        if (data.years.length > 0) {
          var columns = "col col--md-half col--lg-half"
        } else {
          var columns = "col col--md-full col--lg-full"
        }
      }
    } else {
      if (data.quarters.length > 0) {
        if (data.years.length > 0) {
          var columns = "col col--md-half col--lg-half"
        } else {
          var columns = "col col--md-full col--lg-full"
        }
      } else if (data.years.length > 0) {
        var columns = "col col--md-full col--lg-full"
      }
    }
    let divcol = createNode('div');
    let li = createNode('li');
    let timeSeriesData = data.description;
    charts.appendChild(divcol);
    series.append(li);
    divcol.classList.add("col-wrap");
    li.classList.add("nav-secondary__item");
    divcol.innerHTML = "<div class='col'><h2 id = '" + timeSeriesData.cdid + "'>" + timeSeriesData.title + "</h2></div><div class = 'wrapper'><div class = 'col-wrap'><div id='Months" + rand + "' class='" + columns + "'></div><div id='Quarters" + rand + "' class='" + columns + "'></div><div id='Years" + rand + "' class='" + columns + "'></div></div></div>";
    li.innerHTML = "<a href='#" + timeSeriesData.cdid + "' class='js-scroll'>&nbsp;&nbsp;" + timeSeriesData.cdid + "</a>";
    if (data.months.length > 0) {
      block = "Months"
      dataArrayMonths = []
      eval("timeSeriesData" + block).map(function(data) {
        date = data.date
        value = data.value
        chartdata = [date, parseFloat(value)]
        eval("dataArray" + block).push(chartdata)
      })
      chart(timeSeriesData, block, rand)
    }
    if (data.quarters.length > 0) {
      block = "Quarters"
      dataArrayQuarters = []
      eval("timeSeriesData" + block).map(function(data) {
        date = data.date
        value = data.value
        chartdata = [date, parseFloat(value)]
        eval("dataArray" + block).push(chartdata)
      })
      chart(timeSeriesData, block, rand)
    }
    if (data.years.length > 0) {
      block = "Years"
      dataArrayYears = []
      eval("timeSeriesData" + block).map(function(data) {
        date = data.date
        value = data.value
        chartdata = [date, parseFloat(value)]
        eval("dataArray" + block).push(chartdata)
      })
      chart(timeSeriesData, block, rand)
    }
  })

}

function chart(timeSeriesData, block, rand) {
  Highcharts.chart(block + rand, {
    chart: {
      height: 200,
      spacingBottom: 30,
      zoomType: 'x',
      resetZoomButton: {
        position: {
          align: 'left',
          verticalAlign: 'bottom',
          x: 0,
          y: 0
        },
        theme: {
          fill: '#ffffff',
          stroke: '#0F8243',
          r: 0,
          states: {
            hover: {
              fill: '#0F8243',
              style: {
                color: '#ffffff'
              }
            }
          }
        }
      }
    },
    series: [{
      data: eval("dataArray" + block),
      name: timeSeriesData.cdid + ": " + block
    }],
    title: {
      text: timeSeriesData.cdid + ": " + block,
      verticalAlign: 'bottom',
      y: 20
    },
    yAxis: {
      opposite: true,
      labels: {
        enabled: false
      },
      title: {
        enabled: false
      }
    },
    xAxis: {
      type: "category",
      crosshair: true,
      showLastLabel: true,
      showFirstLabel: false,
      labels: {
        autoRotationLimit: 0,
        step: (eval("dataArray" + block).length) - 1,
        align: 'right'
      },
      minorTickLength: 0,
      tickLength: 0
    },
    tooltip: {
      formatter: function() {
        return '<b>' + this.key + '</b><br>' + timeSeriesData.preUnit + this.y + ' ' + timeSeriesData.unit + '';
      },
      shadow: false,
      borderColor: '#0F8243'
    },
    plotOptions: {
      series: {
        lineColor: '#0F8243',
        marker: {
          enabled: false,
          states: {
            hover: {
              fillColor: '#ffffff',
              lineColor: '#0F8243',
              lineWidth: 1,
              radius: 3
            }
          }
        }
      }
    },
    navigation: {
      buttonOptions: {
        enabled: false
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    }
  });
}

function calcDataUri(parameters) {

  for (var i = 0; i < parameters.length; i++) {
    fetch(api + parameters[i], {
      mode: 'cors'
    }).then(data => data.json()).then(function(data) {
      let variations = data.items;
      let getLatest = data.totalItems;
      //work out if there is more than one variation and generate website (rather than API) URL
      if (getLatest > 1) {
        variations.map(function(variations, index) {
          //calculate uri for current website by using the first item in the array
          if (index == 0) {
            let uriFirst = variations.uri;
            let stripDataset = uriFirst.substr(0, uriFirst.lastIndexOf("/"));
            var latestUri = website + stripDataset + "/data"
            blocks(data, latestUri)
          }
        })
      } else {
        //if only one item then use this to get uri for website
        variations.map(function(variations) {
          let uri = variations.uri;
          let stripDataset = uri.substr(0, uri.lastIndexOf("/"));
          var latestUri = website + stripDataset + "/data"
          blocks(data, latestUri)
        })
      }
    });
  }
}
