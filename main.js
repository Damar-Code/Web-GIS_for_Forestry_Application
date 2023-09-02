
/////// I. SETUP MAP WITH OPENLAYERS ///////
// Define a projection
// To use other projections, you have to register the projection in OpenLayers.
// This can easily be done with [http://proj4js.org/](proj4)
proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.1561605555556 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.4171,50.3319,465.5524,1.9342,-1.6677,9.1019,4.0725 +units=m +no_defs +type=crs");

ol.proj.proj4.register(proj4)

const NetherlandsProjection = ol.proj.get("EPSG:28992")

// Define a view
var view_target = new ol.View({
    projection : NetherlandsProjection, //'EPSG:4326',
    center : [199007, 451903], //Coordinates of center
    zoom : 14.4, //zoom level of map
    minZoom: 12.5
})

const container = document.getElementById('popup');
// const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
const overlay = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};


/////// I. FEATURES SECTION ///////
// Read GeoJSON from Geoserver
const geoJsonUrl = 'http://localhost:8080/geoserver/Forestry/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=Forestry:landuse_jul2023&outputFormat=application/json';
const geoJsonUrlInc = 'http://localhost:8080/geoserver/Forestry/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=Forestry:Incident_record&outputFormat=application/json';


// 01. FEATURES SECTION - SearchEngine
// a. Search button event listener
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', function() {
  const searchInput = document.getElementById('searchInput').value;
  zoomToFeatureByFarmId(searchInput);
});

// b. Search input keydown event listener
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const searchInputValue = searchInput.value;
    zoomToFeatureByFarmId(searchInputValue);
    event.preventDefault(); // Prevent form submission
  }
});

// c. Function to zoom to feature by 'farm_id'
function zoomToFeatureByFarmId(farmId) {
  $.getJSON(geoJsonUrl, function(data) {
    const features = data.features;

    for (const feature of features) {
      const properties = feature.properties;
      if (properties.farm_id === farmId) {
        const geometry = new ol.format.GeoJSON().readGeometry(feature.geometry);
        map.getView().fit(geometry, { padding: [10, 10, 10, 10] });
        break; // Exit loop once found
      }
    }
  });
}

// 02. FEATURES SECTION - Basemap
// a. Add basemap layers from Openlayers-MapTiler
var base_maps = new ol.layer.Group({
  'title': 'Base maps',
  layers: [
      new ol.layer.Tile({
          title: 'Satellite',
          type: 'base',
          visible: false,
          source: new ol.source.TileJSON({
              url:'https://api.maptiler.com/maps/satellite/tiles.json?key=wbITdyRU47uj8Wplab8L'
          })
      }),
      new ol.layer.Tile({
        title: 'Streets',
        type: 'base',
        visible: true,
        source: new ol.source.TileJSON({
            url: 'https://api.maptiler.com/maps/streets-v2/tiles.json?key=wbITdyRU47uj8Wplab8L',
        })
    }),
  ],
  
});
// b. Create view target
var map = new ol.Map({
  target: 'map',
  view: view_target,
  overlays: [overlay],
  controls: [] 
  // ol.control.defaults({ zoom: false }).extend([
  //   new ol.control.Attribution()])
  // The Control Setting: Incase for add the Attribution
});

map.addLayer(base_maps);

// c. Layer Switcher Logic for BaseLayers
// Get the basemap options element
var basemapOptions = document.getElementById('basemapOptions');
// Add event listener to the basemap options
basemapOptions.addEventListener('change', function (event) {
var selectedBasemap = event.target.value;
// Find the selected basemap layer and make it visible, hide others
base_maps.getLayers().forEach(function (layer) {
  if (layer.get('title') === selectedBasemap) {
    layer.setVisible(true);
  } else {
    layer.setVisible(false);
  }
});
});

// 03. FEATURES SECTION - Overlays
// a. Load layers from GeoServer as WMS
var Hillshade = new ol.layer.Image({
  title: 'Hillshade',
  visible: false,
  source:  new ol.source.ImageWMS({
    url:'http://localhost:8080/geoserver/Forestry/wms',
    params:{'LAYERS':'Forestry:Hillshade_aug2023'},
    serverType:'geoserver'
  })
})
map.addLayer(Hillshade)
var Elevation = new ol.layer.Image({
  title: 'Elevation',
  visible: false,
  source:  new ol.source.ImageWMS({
    url:'http://localhost:8080/geoserver/Forestry/wms',
    params:{'LAYERS':'Forestry:dtm3m_aug2023'},
    serverType:'geoserver'
  })
})
map.addLayer(Elevation)


// b. layer option switcher
var AllLayerOptions = new ol.layer.Group({
  'title': 'All of Layer Option',
  layers: [Hillshade , Elevation],
});

// c. Layer Switcher Logic for BaseLayers
// Get the basemap options element
var OverlayOptions = document.getElementById('OverlayOptions'); // Correct the variable name here
// Add event listener to the basemap options
OverlayOptions.addEventListener('change', function (event) {
  var selectedLayers = event.target.value;

  // Find the selected basemap layer and make it visible, hide others
  AllLayerOptions.getLayers().forEach(function (layer) {
    if (layer.get('title') === selectedLayers) {
      layer.setVisible(true);
      updateLegendImage(selectedLayers); // Update the legend for the selected layer
    } else {
      layer.setVisible(false);
    }
  });
});

// 04. FEATURES SECTION - Layers
// 04.01 Landsue 
// a. Load layers from GeoServer as WMS
var Landuse = new ol.layer.Image({
  title:'Landuse',
  visible: true,
  source: new ol.source.ImageWMS({
    url:'http://localhost:8080/geoserver/Forestry/wms',
    params:{'LAYERS':'Forestry:landuse_jul2023'},
    serverType:'geoserver'
  })  
})
map.addLayer(Landuse);

// b. Define a variable to track the toggle switch state
var isLanduseLayerActive = true; // Initially set it to true or false based on your initial configuration

// c. Add event listener to the toggle switch for Incident layer
const LUToggle = document.querySelector('.layer-toggle[value="Landuse"]');
LUToggle.addEventListener('change', function() {
  // Set the visibility of the Incident layer based on the toggle switch state
  Landuse.setVisible(this.checked);
  isLanduseLayerActive = this.checked;

  // Update the legend image based on the toggle switch state
  if (this.checked) {
    LULegendImage('Landuse');
  } else {
    // Clear the legend container when the layer is unchecked
    var legendContainer = document.getElementById('LUlegend');
    legendContainer.innerHTML = ''; // Remove existing legend image
  }
});


// d. Function to update the legend image
function LULegendImage(LUcactived) {
  var legendImage = document.createElement('img');
  // Use the selected overlay value to construct the image path
  legendImage.src = 'F:/Web-GIS/Portofolio/Vendors/Web-GIS Env/layers_legend/' + LUcactived + '_legend.png';

  // Add the legend image to a container element (e.g., a <div> with id 'legend')
  var legendContainer = document.getElementById('LUlegend');
  // Clear existing legend images before adding the new one
  legendContainer.innerHTML = '';
  legendContainer.appendChild(legendImage);
}

// e. Call the function initially to show the legend for the "Incident" layer
LULegendImage('Landuse');

// f. Landuse popup feature
var jsonSourceLU = new ol.source.ImageWMS({
  url:'http://localhost:8080/geoserver/Forestry/wms',
  params:{'LAYERS':'Forestry:landuse_jul2023'},
  serverType:'geoserver'
})

// g. Popup Function from WMS Landuse Layer
map.on('click', function (evt) {
   // Check if the Landuse layer is active
  if (isLanduseLayerActive) {
    var ViewResolution = view_target.getResolution();
    var ClickedCoordinates = evt.coordinate;
    var porjection = 'EPSG:28992';
    var param = {'INFO_FORMAT':'application/json'};
  
    var ClickedURL = jsonSourceLU.getFeatureInfoUrl(ClickedCoordinates, ViewResolution, porjection, param)
  
    var vectorSource = new ol.source.Vector({
      format: new ol.format.GeoJSON,
      url: ClickedURL
    })

  $.getJSON(ClickedURL,function(data){
    var arrayofFeatures = data.features
    if (arrayofFeatures.length > 0){
      const coordinate = evt.coordinate;
      
      // Retrieve the properties from the clicked feature
      var propertiesObj = arrayofFeatures[0].properties;

      // Build the content of the popup
      var content_variable = `
          <div>
            <h2 class="popup-header">Landuse</h2>
            <p class="popup-contet"><strong>Farm ID:</strong> ${propertiesObj['farm_id']} </p>
            <p class="popup-contet"><strong>Sector:</strong>  ${propertiesObj['sector']}  </p>
            <p class="popup-contet"><strong>Landcover:</strong>  ${propertiesObj['landcover']}  </p>
            <p class="popup-contet"><strong>HA:</strong> ${propertiesObj['ha']} </p>
            <p class="popup-contet"><strong>Harvest:</strong> ${propertiesObj['harvest']} </p>
            <p class="popup-contet"><strong>Yield(ton):</strong> ${propertiesObj['tonnage']} </p>
          </div>
        `;
      var content = content_variable

      // Set the content of the popup
      $('#popup-content').html(content);

      // Position and display the popup
      overlay.setPosition(coordinate);

    } else {
      // const coordinate = evt.coordinate;

      // Build the content of the popup
      // var content = '<p2 style="color: red; font-weight: bold;">Click on layer!</p2>';
      
      // Set the content of the popup
      // $('#popup-content').html(content);

      // Position and display the popup
      // overlay.setPosition(coordinate);
      console.log('Click on layer!')
    }
  
  })
  }
});

// 04.02 Incident
// a. Load layers from GeoServer as WMS
var Incident = new ol.layer.Image({
  title:'Incident',
  visible: true,
  source: new ol.source.ImageWMS({
    url:'http://localhost:8080/geoserver/Forestry/wms',
    params:{'LAYERS':'Forestry:Incident_record'},
    serverType:'geoserver'
  })  
})
map.addLayer(Incident);

// b. Define a variable to track the toggle switch state
var isIncidentLayerActive = true; // Initially set it to true or false based on your initial configuration


// c. Add event listener to the toggle switch for Incident layer
const IncidentToggle = document.querySelector('.layer-toggle[value="Incident"]');
IncidentToggle.addEventListener('change', function() {
  // Set the visibility of the Incident layer based on the toggle switch state
  Incident.setVisible(this.checked);
  isIncidentLayerActive = this.checked;
  
  // Update the legend image based on the toggle switch state
  if (this.checked) {
    IncLegendImage('Incident');
  } else {
    // Clear the legend container when the layer is unchecked
    var legendContainer = document.getElementById('Inclegend');
    legendContainer.innerHTML = ''; // Remove existing legend image
  }
});


// d. Function to update the legend image
function IncLegendImage(Incactived) {
  var legendImage = document.createElement('img');
  // Use the selected overlay value to construct the image path
  legendImage.src = 'F:/Web-GIS/Portofolio/Vendors/Web-GIS Env/layers_legend/' + Incactived + '_legend.png';

  // Add the legend image to a container element (e.g., a <div> with id 'legend')
  var legendContainer = document.getElementById('Inclegend');
  // Clear existing legend images before adding the new one
  legendContainer.innerHTML = '';
  legendContainer.appendChild(legendImage);
}

// e. Call the function initially to show the legend for the "Incident" layer
IncLegendImage('Incident');

// f. Function to update the legend based on the currently selected layer
function updateLegendImage(selectedOverlays) {
  var legendImage = document.createElement('img');
  if (selectedOverlays === 'None') {
    // Set a default image path for the "None" option
    legendImage.src =  'F:/Web-GIS/Portofolio/Vendors/Web-GIS Env/layers_legend/None_legend.png'; // Replace with the actual image path
    legendImage.alt = 'None Legend';
  } else {
    // Use the selected overlay value to construct the image path
    legendImage.src = 'F:/Web-GIS/Portofolio/Vendors/Web-GIS Env/layers_legend/' + selectedOverlays + '_legend.png';
    legendImage.alt = selectedOverlays + ' Legend';
  }

  // Add the legend image to a container element (e.g., a <div> with id 'legend')
  var legendContainer = document.getElementById('legend');
  legendContainer.innerHTML = ''; // Clear existing content
  legendContainer.appendChild(legendImage);
}

// g. Get references to the overlay radio buttons
const overlayRadioButtons = document.querySelectorAll('input[name="BaseOptions"]');

// h. Add event listeners to handle changes in overlay selection
overlayRadioButtons.forEach(function(radioButton) {
  radioButton.addEventListener('change', function() {
    const selectedOverlay = this.value;
    updateLegendImage(selectedOverlay);
  });
});

// i. Call the function with 'None' to show the initial legend
updateLegendImage('None');

// j. Load Incident layers as WMS from GeoServer
var jsonSourceInc = new ol.source.ImageWMS({
  url:'http://localhost:8080/geoserver/Forestry/wms',
  params:{'LAYERS':'Forestry:Incident_record'},
  serverType:'geoserver'
})

// k. Popup Function from WMS Incident Layer
map.on('click', function (evt) {

  if (isIncidentLayerActive){
    var ViewResolution = view_target.getResolution();
    var ClickedCoordinates = evt.coordinate;
    var porjection = 'EPSG:28992';
    var param = {'INFO_FORMAT':'application/json'};
  
    var ClickedURL = jsonSourceInc.getFeatureInfoUrl(ClickedCoordinates,ViewResolution,porjection,param)
  
    var vectorSource = new ol.source.Vector({
      format: new ol.format.GeoJSON,
      url: ClickedURL
    }) 

  $.getJSON(ClickedURL,function(data){
    var arrayofFeatures = data.features
    if (arrayofFeatures.length > 0){
      const coordinate = evt.coordinate;
      
      // Retrieve the properties from the clicked feature
      var propertiesObj = arrayofFeatures[0].properties;

      // Build the content of the popup
      var content_variable = `
          <div>
            <h2 class="popup-header">Incident</h2>
            <p class="popup-contet"><strong>Incident</strong>: ${propertiesObj['incident']} </p>
            <p class="popup-contet"><strong>Month:</strong>  ${propertiesObj['month']}  </p>
            <p class="popup-contet"><strong>Coordinate:</strong><br> ${propertiesObj['xcoord'].toFixed(3)}, ${propertiesObj['ycoord'].toFixed(3)} </p>
          </div>
        `;
      var content = content_variable

      // Set the content of the popup
      $('#popup-content').html(content);

      // Position and display the popup
      overlay.setPosition(coordinate);

    } else {
      console.log('Click on layer!')
    }
  
  })
  }
});

// 05. FEATURES SECTION - Enable the Popup Option of Features Section
// Function to toggle the pop-up feature
function togglePopup(popupId) {
  const popup = document.getElementById(popupId);
  const otherPopupIds = ["basemapOptions", "OverlayOptions", "LayerOptions"].filter(id => id !== popupId);

  // Close other active pop-ups
  otherPopupIds.forEach(otherPopupId => {
    const otherPopup = document.getElementById(otherPopupId);
    if (otherPopup.classList.contains("active")) {
      otherPopup.classList.remove("active");
    }
  });

  // Toggle the current pop-up
  popup.classList.toggle("active");
}



/////// II. INFOBAR ///////
// 01. INFOBAR - Scale bar
var scale_line = new ol.control.ScaleLine({
    units: 'metric',
    bar: false,
    steps: 6,
    text: true,
    maxWidth: 200,
    minWidth: 140,
    target: 'scale_bar'
});
map.addControl(scale_line);

// 02. INFOBAR - Coordinates Tracking
// a. Event function to get the xy coordinates from cursor
function updateCoordinates(event) {
  var x = event.clientX;
  var y = event.clientY;
  // Convert screen coordinates to map coordinates using the map's view
  var mapCoordinate = map.getCoordinateFromPixel([x, y]);
  // Display the transformed coordinates
  document.getElementById("coordinates").innerText = mapCoordinate[0].toFixed(3) + " X, " + mapCoordinate[1].toFixed(3) + " Y";
}
// b. Get the map container element (replace "map-container" with the ID or class of your map container)
var mapContainer = document.getElementById("map");

// c. Add event listener to the map container for mousemove
mapContainer.addEventListener("mousemove", updateCoordinates);

// 03. INFOBAR - Zoom Level
// a. Function to update the zoom information
function updateZoomInfo() {
  var zoomLevel = map.getView().getZoom(); // Assuming "map" is your map object
  var roundedZoomLevel = Math.floor(zoomLevel); // Use Math.round() Math.floor() for rounding to the nearest integer
  document.getElementById("zoom-level").innerText = roundedZoomLevel;
}

// b. Add event listener to the map object for "moveend" event
map.on("moveend", updateZoomInfo);


/////// III. BU DASHBOARD ///////
// 01. Dasbhoard Open & Closing Function
let activeUI = null;

function toggleDashboardUI(UIoption) {
  var uiElement = document.getElementById(UIoption);

  if (activeUI === uiElement) {
      // Clicked the active UI, hide it
      uiElement.classList.remove("visible");
      activeUI = null;
  } else {
      // Hide the currently active UI if any
      if (activeUI) {
          activeUI.classList.remove("visible");
      }

      // Show the clicked UI
      uiElement.classList.add("visible");
      activeUI = uiElement;
  }
}

// 02. CHART - CUMULATIVE SUM CHART OF MONTHLY HARVESTING ACHIEVEMENT
// a. Define Chart ID
const ctx = document.getElementById('Harvesting-Chart').getContext('2d');

// b. Define month variable
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// console.log('Months:',months);

// c. Setup Monthly Achievement Chart value using jQuery
$.getJSON(geoJsonUrl, function(data) {
  const features = data.features;
  // Calculate cumulative monthly yield
  const monthlyYield = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
    Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
  };

  features.forEach(function(feature) {
    const month = feature.properties.harvest;
    const ton = feature.properties.tonnage;

    if (monthlyYield.hasOwnProperty(month)) {
      monthlyYield[month] += ton;
    }
  });

  // Convert cumulative monthly yield to an array
  const monthlyTon = Object.values(monthlyYield).map(value => parseFloat(value).toFixed(2));
  // console.log('monthlyTon:', monthlyTon);

  // Display the total Total Tonnage of Monthly Harvesting
  // Calculate cumulative data
  var cumulativeTon = [];
  var cumulativeTotal = 0;

  for (var i = 0; i < monthlyTon.length; i++) {
    cumulativeTotal += parseFloat(monthlyTon[i]);
    cumulativeTon.push(cumulativeTotal.toFixed(2));
  }

  // console.log("Cumulative data:", cumulativeData);
  // console.log(`Cumulative Tonnogae: `,cumulativeTon);

  setupCummulativeChart(monthlyTon,cumulativeTon);
});

// d. Create Monthly Achievement Chart using Chart.js
function setupCummulativeChart(monthlyTon,cumulativeTon){
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets:[{
        label: 'Cumulative Tonnage',
        data: cumulativeTon,    
        backgroundColor: 'rgba(30,144,255, 1)',
        borderColor: 'rgba(30,144,255, 1)',
        yAxisID: 'Cumulative'
      }, {
        label: 'Monthly Tonnage',
        data: monthlyTon,    
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        type: 'bar',
      }]
    },
    options:{
      responsive: true,
      maintainAspectRatio: false,
      scales:{
        x:{
          title:{
            display:true,
            text:'Month (2022)'
          }
        },
        y:{
          beginAtZero:true,
          grid:{
            display: false
          },
          title:{
            display:true,
            text:'Monthly Tonnage'
          }
        },
        Cumulative:{
          type:'linear',
          position: 'right',
          beginAtZero: true,
          min:0,
          max:  Math.round(Math.max(...cumulativeTon) + (Math.max(...cumulativeTon)*0.1)),
          ticks:{
            callback:function(value){
              return value + ' ton'
            }
          },
          title: {
            display: true,
            text: 'Cumulative Tonnage'
          }
        }
      }
    }
  }); 

}


// 02. CHART - LANDUSE PIE-CHART
// a. Define Chart ID
const LUChart = document.getElementById('Landuse-Chart').getContext('2d');

// b. Setup Landuse Pie Chart value using jQuery
$.getJSON(geoJsonUrl, function(data) {
  const features = data.features;
  const LU = features.map(feature => feature.properties.landcover);
  const uniqueLandcoverCategories = [...new Set(LU)];
  const uniqueLandcoverCategories_v2 = uniqueLandcoverCategories.filter(value => value !== "");

  // console.log("uniqueLandcoverCategories_v2:",uniqueLandcoverCategories_v2)

  // Calculate total HA for 'Plantation' category
  let totalHAForPlantation = 0;
  let totalHAForConservation = 0;
  let totalHAForRoad = 0;
  features.forEach(function(feature) {
    const category = feature.properties.landcover;
    const HA = feature.properties.ha;

    if (category === 'Plantation') {
      totalHAForPlantation += HA;
    }
    if (category === 'Conservation') {
      totalHAForConservation += HA;
    }
    if (category === 'Road') {
      totalHAForRoad += HA;
    }
  });

  var TotalHA = [parseFloat(totalHAForPlantation).toFixed(2), parseFloat(totalHAForConservation).toFixed(2), parseFloat(totalHAForRoad).toFixed(2)]

  // Display the total HA for 'Plantation' category
  // console.log(`Total HA for 'Plantation' category: `,TotalHA);

  setupLUChart(uniqueLandcoverCategories_v2,TotalHA);
});

// c. Create Landuse Pie Chart using Chart.js
function setupLUChart(uniqueLandcoverCategories_v2,TotalHA) {
  new Chart(LUChart, {
    type: 'pie',
    data: {
      labels: uniqueLandcoverCategories_v2,
      datasets: [
        {
          label: 'Coverage (HA)',
          data: TotalHA,
          backgroundColor: [
            'rgb(178, 223, 138)',
            'rgb(51, 160, 44)',
            'rgb(255, 4, 0)'
          ],
          hoverOffset: 4
        }
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend:{
          position:'right',
          align: 'right',
          labels:{
            boxWidth: 15,
            padding: 15,
          }
        }
      },
      radius: '80%', // Set the size of the pie chart
    }
  });
}

// 03. CHART - INCIDENT LINE CHART
// a. Define Chart ID
const IncChart = document.getElementById('Incident-Chart').getContext('2d');

// b. Setup Incident Line Chart value using jQuery
$.getJSON(geoJsonUrlInc, function(data) {
  // Initialize separate variables for each incident category
  var Fire = {};
  var Fatalities = {};
  var Flood = {};

  // Define an array of all months
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize incident variables for all months with a count of 0
  months.forEach(function(month) {
    Fire[month] = 0;
    Fatalities[month] = 0;
    Flood[month] = 0;
  });

  // Loop through each feature in the GeoJSON data
  data.features.forEach(function(feature) {
    // Extract the incident category and month from the properties
    var category = feature.properties.incident;
    var month = feature.properties.month;

    // Choose the appropriate variable based on the incident category
    var incidentVariable;
    if (category === 'Fire') {
      incidentVariable = Fire;
    } else if (category === 'Fatalities') {
      incidentVariable = Fatalities;
    } else if (category === 'Flood') {
      incidentVariable = Flood;
    }

    // Increment the count for the month and category
    incidentVariable[month]++;
  });

  // Now the variables Fire, Fatalities, and Flood contain the frequency data for all months
  // console.log('Fire:', Fire);
  // console.log('Fatalities:', Fatalities);
  // console.log('Flood:', Flood);

  // Get arrays of values for each incident category
  var arrFire = Object.values(Fire);
  var arrFatalities = Object.values(Fatalities);
  var arrFlood = Object.values(Flood);

  // console.log('Array of Fire values:', arrFire);
  // console.log('Array of Fatalities values:', arrFatalities);
  // console.log('Array of Flood values:', arrFlood);

  setupIncidentChart(arrFire,arrFatalities,arrFlood)
});


// c. Create Incident Line Chart using Chart.js
function setupIncidentChart(arrFire,arrFatalities,arrFlood){
  new Chart(IncChart, {
    type: 'line',
    data: {
      labels: months,
      datasets:[{
        label: 'Fire',
        data: arrFire,    
        backgroundColor: 'rgba(255, 26, 104, 0.1)',
        borderColor: 'rgba(255, 26, 104, 1)',
        tension:0.4,
        fill: true
      },{
        label: 'Flood',
        data: arrFlood,    
        backgroundColor: 'rgba(0,191,255, 0.1)',
        borderColor: 'rgba(0,191,255, 1)',
        tension:0.4,
        fill: true
      },{
        label: 'Fatalities',
        data: arrFatalities,    
        backgroundColor: 'rgba(255,255,0, 0.1)',
        borderColor: 'rgba(255,255,0, 1)',
        tension:0.4,
        fill: true
      }
    ]
    },
    options:{
      responsive: true,
      maintainAspectRatio: false,
      plugins:{
        legend:{
          position: 'bottom'
        }
      },
      scales:{
        x:{
          title:{
            display:true,
            text:'Month (2022)'
          }
        },
        y:{
          beginAtZero:true,
          grid:{
            display: true
          },
          title:{
            display:true,
            text:'Frequncy'
          }
        }
      }
    }
  });

}


// 03. CHART - BAR CHART RANKING OF SECTOR-WISE HARVESTING ACHIEVEMENT
// a. Define Chart ID
const SecChart = document.getElementById('Sector-Chart').getContext('2d');

// b. Setup Incident Line Chart value using jQuery
$.getJSON(geoJsonUrl, function(data) {
  const features = data.features;

  // Calculate total 'ton' for each 'sector'
  const sectorTotals = {};

  features.forEach(function(feature) {
    const sector = feature.properties.sector;
    const ton = parseFloat(feature.properties.tonnage);

    if (!isNaN(ton)) {
      if (!sectorTotals[sector]) {
        sectorTotals[sector] = 0;
      }
      sectorTotals[sector] += ton;
    }
  });

  // Sort sectors based on total 'ha' from highest to lowest
  const sortedSectors = Object.keys(sectorTotals).sort((a, b) => sectorTotals[b] - sectorTotals[a]);

  // Create a list of sectors with total 'ha'
  const sectorList = sortedSectors.map(sector => ({
    sector: sector,
    totalTonnage: sectorTotals[sector].toFixed(2) // Format 'ton' value to two decimal places
  }));

  var sector_name = sectorList.map(item => item.sector);
  var sector_tonnage = sectorList.map(item => item.totalTonnage);

  // Log the list of sectors
  console.log('List of sectors with total ton:', sectorList);
  console.log('List of sectors with total ton:', sector_name);
  console.log('List of sectors with total ton:', sector_tonnage);

  setupSectorTonnageChart(sector_name,sector_tonnage)
});

// c. Create sector-wised tonnage Chart using Chart.js
function setupSectorTonnageChart(sector_name,sector_tonnage){
  new Chart(SecChart, {
    type: 'bar',
    data: {
      labels: sector_name,
      datasets: [{
        label: 'Tonnage',
        data: sector_tonnage,
        backgroundColor: 'rgba(196, 180, 84, 1)',
        borderColor: 'rgba(196, 180, 84, 1)',
        borderWidth: 1,
        type: 'bar'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins:{
        legend:{
          display:false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Current Update (2022)'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false
          },
          title: {
            display: true,
            text: 'Tonnage'
          }
        }
      }
    }
  });

}


/////// IV. POPUP ICON OPTION ///////
function showPopup(popupId) {
  var popup = document.getElementById(popupId);
  popup.style.display = "block";
}

function hidePopup(popupId) {
  var popup = document.getElementById(popupId);
  popup.style.display = "none";
}
