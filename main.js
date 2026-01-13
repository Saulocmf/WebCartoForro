import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { RegularShape, Fill, Stroke, Style } from 'ol/style';

// Creat a marker style
const starStyle = new Style({
  image: new RegularShape({
    fill: new Fill({ color: 'gold' }),
    stroke: new Stroke({ color: 'black', width: 2 }),
    points: 5, 
    radius: 9,     
    radius2: 5,     
  })
});

// Create a list of points
const listeForros = [
  {
    id: 1,
    name: "Baragones",
    geometry: new Point([537424.7867,5742889.4701]), // Coords en EPSG: 3857
    time: "20h",
    frequence: "1 fois par semaine",
    saison: "toute l'année",
  },{
    id: 2,
    name: "Place de Jacobins",
    geometry: new Point(fromLonLat([4.8327698,45.7605099])), // Coords en EPSG: 4326
    time: "19h",
    frequence: "1 fois par semaine",
    saison: "été"
  },{
    id: 3,
    name: "Toi Toi le zinc",
    geometry: new Point(fromLonLat([4.8769956,45.7798382])), // Coords en EPSG: 4326
    time: "21h",
    frequence:"1x /mois",
    saison: "hiver/printemps"
  },
  {
    id:4,
    name:"Livestation DIY",
    geometry: new Point(fromLonLat([ 4.839964187,45.753179459])),
    time: "21h30",
    frequence: "1x /mois",
    saison: "hiver"
  },
]

// map(loop) through the list to create a feature
const forroPtFeatures = listeForros.map(point => {
  return new Feature ({
    geometry: point.geometry,
    name: point.name,
    time: point.time,
    frequence: point.frequence,
    saison: point.saison
  })
})


// COnstruit un layer a partir des points 
const vectorSource = new VectorSource({
  features: forroPtFeatures,
});

// Construit la couche vectoriel pour la carte a partir du vector source et l'habille avec un style
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style:starStyle
});


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorLayer
  ],
  view: new View({
    center: fromLonLat([4.85, 45.77]),
    zoom: 13,
  })
});

// Returns event information when click on point
map.on('click',function (event) {
  const feature = map.forEachFeatureAtPixel(event.pixel, function(feat) {
    return feat;
  });
  // const feature = map.forEachFeatureAtPixel(event.pixel, feat => feat);
  if (feature) {
    const name = feature.get('name');
    const time = feature.get('time');
    const frequence = feature.get('frequence');
    const saison = feature.get('saison')
    
    let popup = document.getElementById("popup");
    popup.innerHTML = name + `</br>` + time + `</br>` + frequence + `</br>` + saison;
    popup.style.display = "block" //Opens the popup window
  } else {  // If clicks outside of a feature:
    if (popup.style.display === "block") {
    popup.style.display = "none"; //Closes the popup window if it is opened
    }
  }
  });

// change mouse cursor when over marker
map.on('pointermove', function (event) {
  const hit = map.hasFeatureAtPixel(event.pixel);
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

