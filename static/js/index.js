const lineGraph = () => {

  const margin = {top: 20, right: 30, bottom: 30, left: 60};
  const width = 500 - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom;

  // append svg object to page
  const line_graph = d3.select("#graphs")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // read data
  const loadedData = JSON.parse(document.querySelector("#context").textContent)
  const allWeatherData = loadedData.feeds;

  // format data
  const parseTime  = d3.utcParse("%Y-%m-%dT%H:%M:%S%Z");
  const data = allWeatherData.map(weatherData => {
    const time = parseTime(weatherData.created_at);
    return { date: time, value: {
      humidityData: weatherData.field3,
      windData : weatherData.field2,
      tempData : weatherData.field4,
      rainData: weatherData.field5,
      pressureData: weatherData.field6,
      powerData: weatherData.field7,
      lightData: weatherData.field8
    }}
  })

  // Add x-axis
  const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => { return d.date; }))
      .range([ 0, width ]);

  line_graph.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add Y axis
  const yTemp = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => { return +d.value.tempData; })])
      .range([ height, 0 ]);

  line_graph.append("g")
    .call(d3.axisLeft(yTemp));

  // Add the line
  line_graph.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(d  => x(d.date) )
      .y(d => yTemp(d.value.tempData) )
  )

  line_graph.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "green")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(d  => x(d.date) )
    .y(d => yTemp(d.value.windData) )
  )

  line_graph.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "orange")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(d  => x(d.date) )
    .y(d => yTemp(d.value.humidityData) )
  )

  line_graph.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "purple")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(d  => x(d.date) )
    .y(d => yTemp(d.value.rainData) )
  )

  line_graph.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "maroon")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(d  => x(d.date) )
    .y(d => yTemp(d.value.pressureData) )
  )

  line_graph.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "skyblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(d  => x(d.date) )
    .y(d => yTemp(d.value.powerData) )
  )

  line_graph.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "yellow")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(d  => x(d.date) )
    .y(d => yTemp(d.value.lightData) )
  )
}

const svgToPdf = (callback) => {

  const svg = document.querySelector( "svg" );
  const svgData = new XMLSerializer().serializeToString(svg);

  const canvas = document.createElement( "canvas" );
  const svgSize = svg.getBoundingClientRect();
  canvas.width = svgSize.width;
  canvas.height = svgSize.height;
  const ctx = canvas.getContext( "2d" );
  const doc = new jsPDF('potrait', 'pt')

  const img = document.createElement( "img" );

  img.onload = () => {
      ctx.drawImage( img, 0, 0 );

      const canvasdata = canvas.toDataURL("image/png");

      doc.addImage(canvasdata, 'PNG', 0, 0, canvas.width, canvas.height)

      callback(doc);
    };

  img.setAttribute( "src", "data:image/svg+xml;base64," + btoa( svgData ) );
}

window.onload = (event) => {
  lineGraph();

  const downloadPdf = (name, dataUriString) => {
    var link = document.createElement('a');
    link.addEventListener('click', (event) => {
      link.href = dataUriString;
      link.download = name;
    }, false);
    document.body.appendChild(link);
    link.click();
  }

  document.querySelector("#save_as_pdf").addEventListener("click", () => {
    return svgToPdf((pdf) => {
        downloadPdf('SVG.pdf', pdf.output('dataurlstring'));
      });
  });
}