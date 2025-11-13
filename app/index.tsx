import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import SunCalc from 'suncalc';



export default function Index() {
  const [Startquery, setStartQuery] = useState('');
  const [Endquery, setEndQuery] = useState('');

  const [region, setRegion] = useState({ latitude: 49, longitude: 17, latitudeDelta: 0.05, longitudeDelta: 0.05 });
  const [regioncam, setRegioncam] = useState({latitude: 49, longitude: 17, latitudeDelta: 0.05, longitudeDelta: 0.05})
  const [region1, setRegion1] = useState({latitude: 49,longitude: 17,latitudeDelta: 0.05,longitudeDelta: 0.05,});  
  
  const [markerCoord, setMarkerCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [markerCoord1, setMarkerCoord1] = useState<{ latitude: number; longitude: number } | null>(null);


async function handleSearch() {
  const query = Startquery;
  const query1= Endquery;
  if(!query.trim() && !query1.trim()){
    return;
  }
  const encoded = encodeURIComponent(query.trim());
  const encoded1 = encodeURIComponent(query1.trim());

  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;
  const url1 = `https://nominatim.openstreetmap.org/search?q=${encoded1}&format=json&limit=1`;
try {
  const response = await fetch(url, {
    
    headers: {
      'User-Agent': 'myBlankApp/1.0 (https://example.com)',
    },
    
  });


  const response1 = await fetch(url1, {
        headers: {
      'User-Agent': 'myBlankApp/1.0 (https://example.com)',
    },

  })

  const data = await response.json();
  const data1 = await response1.json();

  if (!data.length ) {
    return;
  }

  
  if (!data1.length ) {
    return;
  }

  const match = data[0];
  const match1 = data1[0];
  const latitude = parseFloat(match.lat);
  const longitude = parseFloat(match.lon);
  const latitude1 = parseFloat(match1.lat);
  const longitude1 = parseFloat(match1.lon);
  

setRegion({
  latitude:latitude, longitude:longitude,latitudeDelta: 0.05, longitudeDelta: 0.05 
})

setRegion1({
  latitude:latitude1, longitude:longitude1,latitudeDelta: 0.05, longitudeDelta: 0.05 
})



setMarkerCoord({latitude, longitude});
setMarkerCoord1({ latitude: latitude1, longitude: longitude1 });

const midLat = (latitude + latitude1) / 2;
const midLon = (longitude + longitude1) / 2;

setRegioncam({ latitude: midLat, longitude: midLon,   latitudeDelta: Math.abs(latitude - latitude1)*1.2 || 0.05,
  longitudeDelta: Math.abs(longitude - longitude1)*1.4 || 0.05,});


} catch (error) {
  console.error(error);
}

} 


function computeBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaLambda = toRad(lon2 - lon1);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);

  return (toDeg(theta) + 360) % 360;
}

  const bearing =
    markerCoord && markerCoord1
      ? computeBearing(
          markerCoord.latitude,
          markerCoord.longitude,
          markerCoord1.latitude,
          markerCoord1.longitude,
        )
      : null;

  const sunAzimuth =
    markerCoord && markerCoord1
      ? computeSunAzimuth(
          (markerCoord.latitude + markerCoord1.latitude) / 2,
          (markerCoord.longitude + markerCoord1.longitude) / 2,
        )
      : null;

  const sunDelta =
    bearing !== null && sunAzimuth !== null
      ? ((sunAzimuth - bearing + 540) % 360) - 180
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>

   <TextInput
          value={Startquery}
          onChangeText={setStartQuery}
          placeholder="Start"
          placeholderTextColor="#8c929b"
          style={styles.input}
        />
      
         <TextInput
          value={Endquery}
          onChangeText={setEndQuery}
          placeholder="Cíl"
          placeholderTextColor="#8c929b"
          style={styles.input}
        />




        <Pressable style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Hledat</Text>
        </Pressable>

        <MapView
          style={styles.map}
          region={regioncam}>
    {markerCoord && (
      <Marker coordinate={markerCoord} title="Start" />
    )}
    {markerCoord1 && (
      <Marker coordinate={markerCoord1} title="Cíl" />
    )}
</MapView>
{bearing !== null && (
  <Text style={styles.bearingText}>Směr trasy: {bearing.toFixed(2)}°</Text>
)}
{sunDelta !== null && (
  <Text style={styles.bearingText}>
    Slunce je {sunDelta > 0 ? 'nalevo' : 'napravo'} ({Math.abs(sunDelta).toFixed(0)}°)
  </Text>
)}
      </View>
    </View>
  );
}

function computeSunAzimuth(lat: number, lon: number) {
  const position = SunCalc.getPosition(new Date(), lat, lon);
  const azimuthDeg = ((position.azimuth * 180) / Math.PI + 180) % 360;
  return azimuthDeg;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 96,
    paddingBottom: 24,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    gap: 16,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },

  map: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 420,
  },

  button: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#111827',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  input: {
    width: '90%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d5dae2',
    marginHorizontal: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#111827',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bearingText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
