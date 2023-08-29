# Web-GIS_for_Forestry_Application
## Table of contents
* [Project Overview](#project-overview)
* [Look at The Video to Know The User Experience](#look-at-the-video-to-know-the-user-experience)
* [Web-GIS Features](#web-gis-features)

![Web-GIS_v2](https://github.com/Damar-Code/Web-GIS_for_Forestry_Application/assets/60123331/5e02b8c0-3e77-4fa5-86de-faeccb53da1a)


## Project Overview
A portofolio to showcase Web-GIS development for Forestry Apllication. This Web-GIS are integrated opensource software and scripting lenguages such as QGIS, PostGIS, GeoServer, JavaScript, HTML, & CSS. 

![Flow Chart_Web-GIS_v2](https://github.com/Damar-Code/Web-GIS_for_Forestry_Application/assets/60123331/12a4e130-7520-40f0-95c5-fd41a3241df5)


### QGIS & PostGIS
QGIS needed for geospatial data preparation, such as for digitizing, feature styling (.SLD), and store it to Database Management System(PostgreSQL/PostGIS). A proper DBMS like PostGIS provides a structured and optimized way to store and retrieve this data. It allows for efficient querying, indexing, and searching of geospatial information, ensuring quick access to the required data for web applications.
### GeoServer
GeoServer is an open-source server software that allows us to share, process, and edit geospatial data across the web. It's a key component in Web-GIS development as it serves as a bridge between the geospatial data stored in a database (PostGIS) and the web applications that need to display and interact with that data. GeoServer provide a handy ways to styling layers inside of Web-GIS system. Combined with QGIS layer styling in GeoSever it's much easier to do by embedding the .SLD file in the associated layer on GeoServer.
### JavaScript and its Libraries
JavaScript is a crucial programming language in OpenSource Web-GIS development, serving various functions that enhance the interactivity, responsiveness, and user experience of Web-GIS applications. Openlayers Library is used in here for creating interactive map and providing geospatial functionality. Openlayers supports different map projections and provides tools for zooming, panning, and selecting map features. And for data visulization in Dahsboard is using Chart.js library. Chart.js is a widely-used JavaScript library for creating data visualizations, including charts and graphs. While not specifically designed for geospatial data, so we need jQuery library ($.getJSON) to guery each feature's values of the layer. Therefore, Chart.js plays a role in Web-GIS development by allowing to visualize non-spatial data associated with geospatial features.  


> [!IMPORTANT]  
> Look at The Video to Know The User Experience.

https://github.com/Damar-Code/Web-GIS_for_Forestry_Application/assets/60123331/64aa88fb-1341-4d10-a05c-33c3e70a5645


## Web-GIS Features
### Side Bar Content 
#### BU(Business Unit) Dashboard
1. Cumulative Sum Chart of Montly Harvesting Achievement
    - Inform the total of monthly harvesting achievement by the bar chart and all at once the monthly cumulative total tonnage by the line chart
    - The value shown is from Landuse layer extraction using $.getJSON query of ImageWMS from Geoserver
2. Landuse Pie Chart
   - Inform theeach total of Landuse categories i.e Plantation, Conservation, and Road.
   - The value shown is from Landuse layer extraction using $.getJSON query of ImageWMS from Geoserver.
4. Incident Line Chart
   - Inform the total of monthly Incident cases i.e Fire, Flood, and Fatalities.
   - The value shown is from Incident layer extraction using $.getJSON query of ImageWMS from Geoserver.
5. Bar Chart Rangking of Sector-wise Harvesting Achievement
   - Inform the total yield of sector's harvesting and its ranking compared to the rest of sector.  
   - The value shown is from Landuse layer extraction using $.getJSON query of ImageWMS from Geoserver.

#### Planting Simulation App (Under Development, Not yet published)
      
### Interactive Features 
   1. Search Engine of Layer Attribute: Zoom in to selected 'Farm ID' attribute on Landuse layer
   3. Basemap Options: There are two Basemap option, Streets and OpenStreetMap from [Map Tiler](https://www.maptiler.com/maps/basic/).
   5. Layers Activation: There are two layers toggle switch on-off, landuse & incident
   6. Base Layer Options: Applied radio button for choosing Map Baselayer (Streets Basemap & OpenStreetMap Basemap)
     
### Info Bar 
   1. Scalebar
   2. Coordinates Tracking
   3. Zoom Level
   4. Map Attribution

