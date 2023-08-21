# Web-GIS_for_Forestry_Application


![Web-GIS](https://github.com/Damar-Code/Web-GIS_for_Forestry_Application/assets/60123331/0030b214-a781-4e72-a980-1b7609e96fc4)

### Project Overview
A portofolio to showcase Web-GIS development for Forestry Apllication. This Web-GIS are integrated opensource software and scripting lenguages such as QGIS, PostGIS, GeoServer, JavaScript, HTML, & CSS.
#### QGIS & PostGIS
QGIS needed for geospatial data preparation, such as for digitizing, feature styling (.SLD), and store it to Database Management System(PostgreSQL/PostGIS). A proper DBMS like PostGIS provides a structured and optimized way to store and retrieve this data. It allows for efficient querying, indexing, and searching of geospatial information, ensuring quick access to the required data for web applications.
#### GeoServer
GeoServer is an open-source server software that allows us to share, process, and edit geospatial data across the web. It's a key component in Web-GIS development as it serves as a bridge between the geospatial data stored in a database (PostGIS) and the web applications that need to display and interact with that data. GeoServer provide a handy ways to styling layers inside of Web-GIS system. Combined with QGIS layer styling in GeoSever it's much easier to do by embedding the .SLD file in the associated layer on GeoServer.
#### JavaScript and its Libraries
JavaScript is a crucial programming language in Web-GIS development, serving various functions that enhance the interactivity, responsiveness, and user experience of GIS applications on the web. Openlayers Library is used in this Web-GIS development for creating interactive maps and providing geospatial functionality. Openlayers supports different map projections and provides tools for zooming, panning, and selecting map features. And for data visulization in Dahsboard is using Chart.js library. Chart.js is a widely-used JavaScript library for creating data visualizations, including charts and graphs. While not specifically designed for geospatial data, so we need jQuery library ($.getJSON) to guery each feature's values of the layer. Therefore, Chart.js plays a role in Web-GIS development by allowing you to visualize non-spatial data associated with geospatial features.  

### Look at this video to know the User Experience!!
> ### Dashboard & Info Bar
https://github.com/Damar-Code/Web-GIS_for_Forestry_Application/assets/60123331/dbb02770-8e0d-417e-85c8-101d95b5cd6e

> ### Interactive Features
https://github.com/Damar-Code/Web-GIS_for_Forestry_Application/assets/60123331/d156e0a6-6cf8-48bc-b246-3535817768dc
### Side Bar Content 
   1. BU(Business Unit) Dashboard
      * Cumulative Sum Chart of Montly Harvesting Achievement
        - Inform the total of monthly harvesting achievement by the bar chart and all at once the monthly cumulative total tonnage by the line chart
        - The value shown is from Landuse layer extraction using $.getJSON query of ImageWMS from Geoserver.
      * Landuse Pie Chart
        - Inform the total of monthly harvesting achievement by the bar chart and all at once the monthly cumulative total tonnage by the line chart
        - The value shown is from Landuse layer extraction using $.getJSON query of ImageWMS from Geoserver.
      * Incident Line Chart
        - Inform the total of monthly harvesting achievement by the bar chart and all at once the monthly cumulative total tonnage by the line chart
        - The value shown is from Landuse layer extraction using $.getJSON query of ImageWMS from Geoserver.
      * Bar Chart Rangking of Sector-wise Harvesting Achievement
        - Inform the total of monthly harvesting achievement by the bar chart and all at once the monthly cumulative total tonnage by the line chart
        - The value shown is from Landuse layer extraction using $.getJSON query of ImageWMS from Geoserver.

   2. Planting Simulation App (Under Development, Not yet published)
      
### Interactive Features 
   1. Search Engine of Layer Attribute
   2. Basemap Options
   3. layer activation
   4. Base Layer Options
      * Cumulative Sum Chart of Montly Harvesting Achievement
        - Inform the total of monthly harvesting achievement by the bar chart and all at once the monthly cumulative total tonnage by the line chart
        - The value shown is from Landuse layer extraction using $.getJSON query of ImageWMS from Geoserver.
      * Landuse Pie Chart
        - Inform the total of monthly harvesting achievement by the bar chart and all at once the monthly cumulative total tonnage by the line chart
        - The value shown is from Landuse layer extraction using $.getJSON query of ImageWMS from Geoserver.
      * Incident Line Chart
        - Inform the total of monthly harvesting achievement by the bar chart and all at once the monthly cumulative total tonnage by the line chart
        - The value shown is from Landuse layer extraction using $.getJSON query of ImageWMS from Geoserver.
      * Bar Chart Rangking of Sector-wise Harvesting Achievement
        - Inform the total of monthly harvesting achievement by the bar chart and all at once the monthly cumulative total tonnage by the line chart
        - The value shown is from Landuse layer extraction using $.getJSON query of ImageWMS from Geoserver.
   

### Info Bar 

