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
import FileUploadSingle from "./FileUploadSingle.tsx";

const center = { lat: 40.97906099583216, lng: 29.110213592605717 };
const google = window.google;
function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [directionsResponse2, setDirectionsResponse2] = useState(null);
  const [directionsResponse3, setDirectionsResponse3] = useState(null);
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
      origin: new google.maps.LatLng(40.97906099583216, 29.110213592605717),
      destination: new google.maps.LatLng(
        40.97906099583216,
        29.110213592605717
      ),
      waypoints: [
        {
          location: new google.maps.LatLng(
            40.9341928534301,
            29.127845358669738
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.89573973663695,
            29.378704942949614
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.86204809981522,
            29.297982941807657
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.922497718164124,
            29.355389683873184
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.92276041855027,
            29.351267181586586
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.95673365295175,
            29.39085065571143
          ),
          stopover: true,
        },
      ],
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });

    const results2 = await directionsService.route({
      origin: new google.maps.LatLng(40.97906099583216, 29.110213592605717),
      destination: new google.maps.LatLng(
        40.97906099583216,
        29.110213592605717
      ),
      waypoints: [
        {
          location: new google.maps.LatLng(
            41.08252512422859,
            29.02055610131978
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(41.0439853329135, 29.07847544984874),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            41.022840229382716,
            29.020822049275058
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            41.021289164720024,
            29.044592862483224
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            41.04451019021357,
            29.002037714143253
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            41.04962652836571,
            29.026221256284906
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            41.09396491968674,
            29.028157012506508
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            41.06763032881699,
            29.008845885022897
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.959997798019515,
            29.081336340161723
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.967516067589195,
            29.086662503242763
          ),
          stopover: true,
        },
      ],
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    const results3 = await directionsService.route({
      origin: new google.maps.LatLng(40.97906099583216, 29.110213592605717),
      destination: new google.maps.LatLng(
        40.97906099583216,
        29.110213592605717
      ),
      waypoints: [
        {
          location: new google.maps.LatLng(
            41.00360489825688,
            29.055025496362934
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.974003230004264,
            29.056271501567718
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.99182393663204,
            29.085466193310513
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.955014801132876,
            29.12189179080731
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            41.09491858862192,
            29.02799972905536
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            41.05665465310689,
            29.034288669721278
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.97660923134072,
            29.085490544024317
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.98965915843983,
            29.119941216242307
          ),
          stopover: true,
        },
        {
          location: new google.maps.LatLng(
            40.94379084503687,
            29.11738012753533
          ),
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
    setDirectionsResponse2(results2);
    setDirectionsResponse3(results3);
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
          zoom={12}
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
              <DirectionsRenderer
                options={{
                  markerOptions: {
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  },
                  polylineOptions: { strokeColor: "blue", strokeOpacity: 0.5 },
                }}
                directions={directionsResponse}
              />
              <DirectionsRenderer
                options={{
                  markerOptions: {
                    icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  },
                  polylineOptions: { strokeColor: "red", strokeOpacity: 0.5 },
                }}
                directions={directionsResponse2}
              />
              <DirectionsRenderer
                options={{
                  markerOptions: {
                    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                  },
                  polylineOptions: { strokeColor: "green", strokeOpacity: 0.5 },
                }}
                directions={directionsResponse3}
              />
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
        width="55vw"
        zIndex="1"
      >
        <HStack spacing={2} mt={4} justifyContent="space-between">
          <ButtonGroup
            spacing={20}
            justifyContent="space-between"
            style={{ width: "100vw" }}
          >
            <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <FileUploadSingle />
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
