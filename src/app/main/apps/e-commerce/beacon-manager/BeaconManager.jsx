import React from "react";
import "./BeaconManager.css";

import axios from "axios";

function BeaconManager() {
  const storeIDRef = React.useRef();
  const layoutIDRef = React.useRef();
  const beaconMACRef = React.useRef();
  const beaconXRef = React.useRef();
  const beaconYRef = React.useRef();

  const handleClick = () => {
    const data = {
      macAddress: beaconMACRef.current.value,
      coordinates: {
        x: beaconXRef.current.value,
        y: beaconYRef.current.value,
        z: 0,
      },
      layoutId: layoutIDRef.current.value,
      storeId: storeIDRef.current.value,
    };

    axios
      .post("https://apis.datcarts.com/beacon", data)
      .then((res) => {
        console.log(res);
        alert("Beacon created.")
        beaconMACRef.current.value = "";
        beaconXRef.current.value = "";
        beaconYRef.current.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  var url_string = window.location.href;
    var url = new URL(url_string);
    var storeId = url.searchParams.get("storeId");
    var layoutId = url.searchParams.get("layoutId");

  React.useEffect(() => {
    
    storeIDRef.current.value = storeId
    layoutIDRef.current.value = layoutId
  }, [])

  return (
    <div className="grid place-items-center h-[60vh]">
      <div className="flex flex-col gap-2 p-8 w-1/2">
        <div className="mb-4 text-2xl">Add new beacon</div>
        <input
          type="text"
          placeholder="Store ID"
          className="border-2 p-4"
          ref={storeIDRef}
        />
        <input
          type="text"
          placeholder="Layout ID"
          className="border-2 p-4"
          ref={layoutIDRef}
        />
        <input
          type="text"
          placeholder="Beacon MAC ID"
          className="border-2 p-4"
          ref={beaconMACRef}
        />
        <input
          type="text"
          placeholder="Beacon X coordinate"
          className="border-2 p-4"
          ref={beaconXRef}
        />
        <input
          type="text"
          placeholder="Beacon Y coordinate"
          className="border-2 p-4"
          ref={beaconYRef}
        />
        <button className="btn btn-primary p-4 border-2" onClick={handleClick}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default BeaconManager;
