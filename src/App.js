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

const routes = [
  [
    ["40.97906099583216", "29.110213592605717"],
    ["40.9341928534301", "29.127845358669738"],
    ["40.89573973663695", "29.378704942949614"],
    ["40.86204809981522", "29.297982941807657"],
    ["40.922497718164124", "29.355389683873184"],
    ["40.92276041855027", "29.351267181586586"],
    ["40.95673365295175", "29.39085065571143"],
    ["40.97906099583216", "29.110213592605717"],
  ],

  [
    ["40.99906099583216", "29.110213592605717"],
    ["41.08252512422859", "29.02055610131978"],
    ["41.0439853329135", "29.07847544984874"],
    ["41.022840229382716", "29.020822049275058"],
    ["41.021289164720024", "29.044592862483224"],
    ["40.959997798019515", "29.081336340161723"],
    ["40.967516067589195", "29.086662503242763"],
    ["40.97906099583216", "29.110213592605717"],
  ],
];
const center = { lat: 40.97906099583216, lng: 29.110213592605717 };
const google = window.google;
function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  let [directionsResponse, setDirectionsResponse] = useState([]);
  const [routeIndex, setRouteIndex] = useState(0);
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
    setDirectionsResponse([]);
    const directionsService = new google.maps.DirectionsService();
    const myarr = [];
    console.log(routes);
    let routePromises = routes.map(async (route, index) => {
      if (routeIndex === index) {
        let org = route[0];
        let dest = route[route.length - 1];
        console.log(route);
        const waypts = [];

        for (let i = 1; i < route.length - 1; i++) {
          waypts.push({
            location: new google.maps.LatLng(route[i][0], route[i][1]),
            stopover: true,
          });
        }
        console.log(waypts);
        let resp = await directionsService.route({
          origin: new google.maps.LatLng(org[0], org[1]),
          destination: new google.maps.LatLng(dest[0], dest[1]),
          waypoints: waypts,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        });
        console.log(resp);
        myarr.push(resp);
        console.log(myarr);
        setDirectionsResponse((prevDirections) => [...prevDirections, resp]);
        console.log(directionsResponse);
      }
    });
    debugger;
    console.log(myarr);
  }

  function clearRoute() {
    setDirectionsResponse([]);
    setDistance("");
    setDuration("");
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
          {routes.map((route, index) => {
            if (index !== routeIndex) {
              console.log(index);
              return route.map((loc, locindex) => (
                <Marker
                  key={locindex}
                  label={locindex.toString()}
                  position={
                    new google.maps.LatLng(
                      parseFloat(loc[0]),
                      parseFloat(loc[1])
                    )
                  }
                />
              ));
            } else {
              return route.map((loc, locindex) => {
                if (locindex !== route.length - 1) {
                  return (
                    <Marker
                      key={locindex}
                      icon={{ scaledSize: new google.maps.Size(60, 60) }}
                      label={{
                        text: locindex.toString(),
                        color: "white",
                        fontSize: "20px",
                      }}
                      options={{ suppressMarkers: "true" }}
                      zIndex={Infinity}
                      position={
                        new google.maps.LatLng(
                          parseFloat(loc[0]),
                          parseFloat(loc[1])
                        )
                      }
                    />
                  );
                }
              });
            }
          })}
          {directionsResponse &&
            directionsResponse.map((response, index) => (
              <DirectionsRenderer
                key={index}
                options={{ suppressMarkers: "false" }}
                directions={response}
              />
            ))}
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
