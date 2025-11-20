import { Circle } from 'react-native-maps';

type Props = {
  coords: { latitude: number; longitude: number; accuracy?: number | null };
  pinColor?: string;
};

export default function UserKolecko({ coords, pinColor = '#2563eb' }: Props) {
  const { latitude, longitude, accuracy } = coords;
  const radius = Math.max(accuracy ?? 30, 30);

  return (
    <>
      <Circle
        center={{ latitude, longitude }}
        radius={radius}
        strokeColor="rgba(37, 99, 235, 0.9)"
        fillColor="rgba(37, 99, 235, 0.25)"
        strokeWidth={2}
      />
      <Circle
        center={{ latitude, longitude }}
        radius={6}
        strokeColor={pinColor}
        fillColor={pinColor}
        zIndex={2}
      />
    </>
  );
}
