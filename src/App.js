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
  Select, // import Select here
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import FileUploadSingle from "./FileUploadSingle.tsx";
import SplitButton from "./SplitButton.js";
import { clear } from "@testing-library/user-event/dist/clear.js";

const center = { lat: 40.97906099583216, lng: 29.110213592605717 };
const google = window.google;
function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const constSolverOptions = ["Tabu", "Gurobi"];
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  let [directionsResponse, setDirectionsResponse] = useState([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [dispRoutes, setDispRoutes] = useState([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [data, setData] = useState([{}]);
  const [options, setOptions] = useState("");
  const [solverOptions, setSolverOptions] = useState([]);
  useEffect(async () => {
    await fetch("http://localhost:5000/members")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setDispRoutes(data["route"]);
      });
  }, []);
  useEffect(() => {
    arrangeOptions();
  }, [dispRoutes]); // Dependency array

  function arrangeOptions() {
    let iter = dispRoutes ? dispRoutes.length : 0;
    let tempOptions = [];
    for (let i = 0; i < iter; i++) {
      tempOptions.push("Route" + i);
    }
    setOptions(tempOptions);
  }

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
    let routePromises = dispRoutes.map(async (route, index) => {
      if (routeIndex === index) {
        let org = route[0];
        let dest = route[route.length - 1];
        const waypts = [];

        for (let i = 1; i < route.length - 1; i++) {
          waypts.push({
            location: new google.maps.LatLng(route[i][0], route[i][1]),
            stopover: true,
          });
        }
        let resp = await directionsService.route({
          origin: new google.maps.LatLng(org[0], org[1]),
          destination: new google.maps.LatLng(dest[0], dest[1]),
          waypoints: waypts,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        });
        myarr.push(resp);
        setDirectionsResponse((prevDirections) => [...prevDirections, resp]);
      }
    });
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
          {dispRoutes.map((route, index) => {
            if (index !== routeIndex) {
              return route.map((loc, locindex) => {
                if (locindex !== route.length - 1) {
                  return (
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
                  );
                }
              });
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
            spacing={10}
            justifyContent="space-between"
            style={{ width: "100vw" }}
          >
            <Button
              style={{ width: "20vw" }}
              colorScheme="pink"
              type="submit"
              onClick={calculateRoute}
            >
              Calculate Route
            </Button>
            <FileUploadSingle
              option={solverOptions}
              setRoutes={setDispRoutes}
              clearRoute={clearRoute}
            ></FileUploadSingle>
            <Select
              placeholder="Select Route"
              onChange={(e) => setRouteIndex(parseInt(e.target.value))}
            >
              {options.map((option, index) => (
                <option key={index} value={index}>
                  {option}
                </option>
              ))}
            </Select>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="flex-end">
          <Select
            placeholder="Select Solver"
            onChange={(e) =>
              setSolverOptions(constSolverOptions[e.target.value])
            }
          >
            {constSolverOptions.map((option, index) => (
              <option key={index} value={index}>
                {option}
              </option>
            ))}
          </Select>
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
