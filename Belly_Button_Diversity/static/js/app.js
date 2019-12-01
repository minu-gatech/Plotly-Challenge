function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  d3.json(`/samples/${sample}`).then(sampleData => {
    console.log(sampleData);
    console.log("Inside Function")

    var sample_values = sampleData.sample_values;
    sample_values_10 = sample_values.slice(0,10);
    console.log(sample_values_10);

    var sample_labels = sampleData.otu_ids;
    sample_labels_10 = sample_labels.slice(0,10);
    console.log(sample_labels_10);

   /*  var sample_hoverText = sampleData.otu_lables;
    sample_hoverText_10 = sample_hoverText.slice(0,10);
    console.log(sample_hoverText_10);
     */
    // @TODO: Build a Pie Chart
    var data = [{ values: sample_values_10,
                  labels : sample_labels_10,
                //hovertext : sample_hoverText,
                //hoverinfo:"text",
              type:"pie"}]

    var layout = {
      height: 500,
      width: 500
    };        
    
    Plotly.newPlot('pie', data, layout);



// @TODO: Build a Bubble Chart using the sample data
    var sample_hoverText = sampleData.otu_labels;
    console.log(sample_hoverText);

    var trace1 = {
      x: sample_labels,
      y: sample_values,
      text: sample_hoverText,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: sample_labels,

      }
    };
    
    var data1 = [trace1];
    
    var layout1 = {
      title: 'Bubble Chart',
      showlegend: false,
      height: 600,
      width: 1400,
      margin:{l:160,r:160}
    };
    
    Plotly.newPlot('bubble', data1, layout1);
   
  }
  )
       
  

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

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
