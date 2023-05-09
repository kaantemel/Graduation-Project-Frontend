import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const center = { lat: 48.8584, lng: 2.2945 };
const google = window.google;
function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: new google.maps.LatLng(40.8911872, 29.3830656),
      destination: new google.maps.LatLng(40.9669, 29.0658),
      waypoints: [
        {
          location: new google.maps.LatLng(40.8207728, 29.3193615),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(40.967381, 29.218309),
          stopover: true,
        },
      ],
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    console.log(results);
    let myDist = [
      parseInt(results.routes[0].legs[0].distance.text.split(" ")),
      parseInt(results.routes[0].legs[1].distance.text.split(" ")),
      parseInt(results.routes[0].legs[2].distance.text.split(" ")),
    ];
    let distance = myDist.reduce((a, b) => {
      return a + b;
    }, 10);
    let myTime = [
      parseInt(results.routes[0].legs[0].duration.text.split(" ")),
      parseInt(results.routes[0].legs[1].duration.text.split(" ")),
      parseInt(results.routes[0].legs[2].duration.text.split(" ")),
    ];
    let time = myDist.reduce((a, b) => {
      return a + b;
    }, 10);
    console.log(myDist);
    console.log(myTime);
    setDirectionsResponse(results);
    setDistance(distance + " km");
    setDuration(time + " min");
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <>
              <DirectionsRenderer directions={directionsResponse} />
            </>
          )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgColor="white"
        shadow="base"
        width="30vw"
        zIndex="1"
      >
        <HStack spacing={2} justifyContent="space-between">
          <ButtonGroup>
            <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
          />
        </HStack>
      </Box>
    </Flex>
  );
}

export default App;
