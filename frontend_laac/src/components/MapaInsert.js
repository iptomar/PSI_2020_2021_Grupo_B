import L from "leaflet";
import React, { Component, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Markers from "./VenueMarkers";
import Form from "./Form";
import axios from "axios";
import "./Mapa.css";

// MOUSE MARKER //

const MouseIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MouseLatLng() {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (!(position == null)) {
        console.log(position);
      }
    },
  });

  if (!(position == null)) {
    return (
      <>
        <Marker position={position} icon={MouseIcon}>
          <Popup>
            <div className="poup-text">
              <h6>Coordenadas</h6>
              Lat: {position.lat}
              <br />
              Lng: {position.lng}
            </div>
          </Popup>
        </Marker>
      </>
    );
  }
  return null;
}

export default class MapaInsert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: [39.23, -8.68],
      zoomLvl: 7,
      pontos: [],
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost/getAllLocations.php")
      .then((res) =>
        this.setState({ pontos: res.data }, () => console.log(this.state))
      )
      .catch((err) => console.error(err));
  }

  render() {
    const { center, zoomLvl, pontos } = this.state;

    return (
      <div className="zonaMapa">
        <div className="formulario">
          <Form />
        </div>
        <MapContainer
          center={center} // centro inicial do mapa
          zoom={zoomLvl} // nivel de zoom inicial do mapa
          minZoom={3} // m??ximo de zoom do mapa
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]} // limite do mapa
          doubleClickZoom={false} // o double click n??o faz mais zoom
          scrollWheelZoom={true} // o scroll est?? ligado, permitindo dar zoom in e zoom out atrav??s do mesmo
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MouseLatLng />
          <Markers venues={pontos} />
        </MapContainer>
      </div>
    );
  }
}
