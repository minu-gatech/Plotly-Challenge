

/*********************************************************************/
// Function to create display metdata
function buildMetadata(sample) {  // 1

  console.log(`Inside buildMetaData Function - ${sample}`)
  
  // Using `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(metaData => {   // 2
      
      console.log(metaData);

      // Selecting div elelment to append metadata into it
      metaData_panel = d3.select('#sample-metadata');

      // Clearing metaData panel
      metaData_panel.html("");

      // Fetching keys and values from metaData of sample
      Object.entries(metaData).forEach((key,value) => {

          console.log(key,value);
          
          // Appending ul and li tags to display metaData
          /* var ul = metaData_panel.append("ul");
          ul.attr("style","list-style-position: inside");
          ul.attr("style","padding-left: 0");
          var li = ul.append("li");
          li.text(`${key[0]} : ${key[1]}`); */
          metaData_panel.append("h6").text(`${key[0]}: ${key[1]}`)
        
      }
    )

  } // 2
  ) // then() ends
  
  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);

}   // 1




/*******************************************************/
// Function to plot charts 
function buildCharts(sample) {   // 1

  // Using `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(sampleData => {  // 2
      console.log(sampleData);
      console.log("Inside buildCharts Function")

      // Fetching first 10 samples data

      // sample values
      var sample_values = sampleData.sample_values;
      sample_values_10 = sample_values.slice(0,10);
      console.log(sample_values_10);

      // otu ids
      var sample_labels = sampleData.otu_ids;
      sample_labels_10 = sample_labels.slice(0,10);
      console.log(sample_labels_10);

      // var sample_hoverText = sampleData.otu_lables;
      // sample_hoverText_10 = sample_hoverText.slice(0,10);
      // console.log(sample_hoverText_10);
    

      //// Building a Pie Chart
      var pieData = [{ values: sample_values_10,
                    labels : sample_labels_10,
                    /* hovertext : sample_hoverText_10,
                    hoverinfo:"hovertext", */
                    type:"pie"}]

      var pieLayout = {
        height: 500,
        width: 500
      };        
      
      Plotly.newPlot("pie", pieData, pieLayout);



      //// Building a Bubble Chart using the sample data
      var otu_labels = sampleData.otu_labels;
      console.log(otu_labels);

      var trace1 = {
        x: sample_labels,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: sample_labels,
        colorscale:"Portland"  }
      };
        
      var bubbleData = [trace1];
      
      var bubbleLayout = {
        title: 'Diversity of cultured bacteria',
        showlegend: false,
        height: 600,
        width: 1400,
        margin:{l:160,r:160},
        xaxis:{title:"OTU ID"},
        hovermode: "closest"
      };
      
      Plotly.newPlot('bubble', bubbleData, bubbleLayout);
      
  }  // 2
  ) // then() ends
       
}  // 1


/******************************************************************/
// function to display default contents
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      console.log(sample);
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
