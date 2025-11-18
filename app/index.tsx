import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import SunCalc from 'suncalc';

export default function Index() {
  const [Startquery, setStartQuery] = useState('');
  const [Endquery, setEndQuery] = useState('');

  const [region, setRegion] = useState({
    latitude: 49,
    longitude: 17,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [regioncam, setRegioncam] = useState({
    latitude: 49,
    longitude: 17,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [region1, setRegion1] = useState({
    latitude: 49,
    longitude: 17,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [markerCoord, setMarkerCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [markerCoord1, setMarkerCoord1] = useState<{ latitude: number; longitude: number } | null>(null);

  const [StartSuggestion, setStartSuggestion] = useState<any[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<any[]>([]);
  const startSelectionRef = useRef(false);
  const endSelectionRef = useRef(false);


 



  useEffect(() => {
    const query = Startquery.trim();

    if (startSelectionRef.current) {
      startSelectionRef.current = false;
      setStartSuggestion([]);
      return;
    }

    if (query.length < 3) {
      setStartSuggestion([]);
      return;
    }

    let isActive = true;

    const handle = setTimeout(async () => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query,
          )}&format=json&limit=5`,
          {
            headers: {
              'User-Agent': 'myBlankApp/1.0 (https://example.com)',
            },
          },
        );

        const data = await resp.json();
        if (!isActive || query !== Startquery.trim()) {
          return;
        }

        setStartSuggestion(data);
      } catch (error) {
        console.error('Start auto-complete failed', error);
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(handle);
    };
  }, [Startquery]);


  useEffect(() => {
    const query = Endquery.trim();

    if (endSelectionRef.current) {
      endSelectionRef.current = false;
      setEndSuggestions([]);
      return;
    }

    if (query.length < 3) {
      setEndSuggestions([]);
      return;
    }

    let isActive = true;

    const handle = setTimeout(async () => {
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query,
          )}&format=json&limit=5`,
          {
            headers: {
              'User-Agent': 'myBlankApp/1.0 (https://example.com)',
            },
          },
        );

        const data = await resp.json();
        if (!isActive || query !== Endquery.trim()) {
          return;
        }

        setEndSuggestions(data);
      } catch (error) {
        console.error('End auto-complete failed', error);
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(handle);
    };
  }, [Endquery]);


  async function GPSbuttonHandler(){
            const { status } = await Location.requestForegroundPermissionsAsync();
            
        if (status !== 'granted') {
          return;
        }
        
        const position = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = position.coords;
        setStartQuery("Moje poloha")
        setMarkerCoord({ latitude, longitude});

  }

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }

        const position = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = position.coords;

        setRegioncam({ latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
      } catch (error) {
        console.error('chyba nacteni');
      }
    })();
  }, []);

  async function handleSearch() {
    const query = Startquery;
    const query1 = Endquery;
    if (!query.trim() && !query1.trim()) {
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
      });

      const data = await response.json();
      const data1 = await response1.json();

      if (!data.length) {
        return;
      }

      if (!data1.length) {
        return;
      }

      const match = data[0];
      const match1 = data1[0];
      const latitude = parseFloat(match.lat);
      const longitude = parseFloat(match.lon);
      const latitude1 = parseFloat(match1.lat);
      const longitude1 = parseFloat(match1.lon);

      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      setRegion1({
        latitude: latitude1,
        longitude: longitude1,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      setMarkerCoord({ latitude, longitude });
      setMarkerCoord1({ latitude: latitude1, longitude: longitude1 });

      const midLat = (latitude + latitude1) / 2;
      const midLon = (longitude + longitude1) / 2;

      setRegioncam({
        latitude: midLat,
        longitude: midLon,
        latitudeDelta: Math.abs(latitude - latitude1) * 1.2 || 0.05,
        longitudeDelta: Math.abs(longitude - longitude1) * 1.4 || 0.05,
      });
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
    const x =
      Math.cos(phi1) * Math.sin(phi2) -
      Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
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


  const isDay = useMemo(() => {
    const coords =
      markerCoord && markerCoord1
        ? {
            latitude: (markerCoord.latitude + markerCoord1.latitude) / 2,
            longitude: (markerCoord.longitude + markerCoord1.longitude) / 2,
          }
        : regioncam;

    const times = SunCalc.getTimes(new Date(), coords.latitude, coords.longitude);
    const now = new Date();
    return now >= times.sunrise && now < times.sunset;
  }, [markerCoord, markerCoord1, regioncam]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inputRow}>
          <TextInput
            value={Startquery}
            onChangeText={(text) => {
              startSelectionRef.current = false;
              setStartQuery(text);
            }}
            onBlur={() => setStartSuggestion([])}
            placeholder="Start"
            placeholderTextColor="#8c929b"
            style={[styles.input, styles.inputFlex]}
          />
          <Pressable style={styles.gpsButton} onPress={() => {GPSbuttonHandler()}}>
            <Text style={styles.gpsButtonText}>GPS</Text>
          </Pressable>
        </View>
      
        {StartSuggestion.length > 0 && (
          <View style={styles.suggestionList}>
            {StartSuggestion.map((item: any) => (
              <Pressable
                key={item.place_id}
                onPress={() => {
                  startSelectionRef.current = true;
                  setStartQuery(item.display_name);
                  setMarkerCoord({
                    latitude: parseFloat(item.lat),
                    longitude: parseFloat(item.lon),
                  });
                  setStartSuggestion([]);
                }}
                style={styles.suggestionItem}
              >
                <Text style={styles.suggestionText}>{item.display_name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <TextInput
          value={Endquery}
          onChangeText={(text) => {
            endSelectionRef.current = false;
            setEndQuery(text);
          }}
          onBlur={() => setEndSuggestions([])}
          placeholder="Cl"
          placeholderTextColor="#8c929b"
          style={styles.input}
        />

         {endSuggestions.length > 0 && (
          <View style={styles.suggestionList}>
            {endSuggestions.map((item: any) => (
              <Pressable
                key={item.place_id}
                onPress={() => {
                  endSelectionRef.current = true;
                  setEndQuery(item.display_name);
                  setMarkerCoord1({
                    latitude: parseFloat(item.lat),
                    longitude: parseFloat(item.lon),
                  });
                  setEndSuggestions([]);
                }}
                style={styles.suggestionItem}
              >
                <Text style={styles.suggestionText}>{item.display_name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Hledat</Text>
        </Pressable>

        <MapView style={styles.map} region={regioncam}>
          {markerCoord && <Marker coordinate={markerCoord} title="Start" />}
          {markerCoord1 && <Marker coordinate={markerCoord1} title="Cíl" />}
          {markerCoord && markerCoord1 && (
            <Polyline
              coordinates={[markerCoord, markerCoord1]}
              strokeColor="#ea1010ff"
              strokeWidth={4}
            />
          )}
        </MapView>

        {bearing !== null && (
          <Text style={styles.bearingText}>
            Směr trasy: {bearing.toFixed(2)}°
          </Text>
        )}
        {sunDelta !== null && (
          <Text style={styles.bearingText}>
            Slunce je {sunDelta > 0 ? 'napravo' : 'nalevo'} (
            {Math.abs(sunDelta).toFixed(0)}°)
          </Text>
        )}
      <Text style={styles.bearingText}>
        Je {isDay ? 'den' : 'noc'}
      </Text>
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
  suggestionList: {
    width: '90%',
    marginHorizontal: 20,
    marginTop: 6,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    gap: 4,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  suggestionText: {
    color: '#111827',
    fontSize: 14,
  },
  bearingText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '90%',
    marginHorizontal: 20,
  },
  inputFlex: {
    flex: 1,
    marginHorizontal: 0,
  },
  gpsButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#111827',
  },
  gpsButtonText: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
