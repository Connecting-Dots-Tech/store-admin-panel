import React, { useState, useEffect, useRef } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import "./RegionMapper.css";

const ReactGridLayout = WidthProvider(RGL);

const RegionMapper = (props) => {
  const [layout, setLayout] = useState([]);
  const [beacon, setBeacon] = useState([]);
  const [widthFix, setWidthFix] = useState(0);
  const gridContainerRef = useRef();

  useEffect(() => {
    const layoutData = loadLayout();
    const beaconData = loadBeacon();
    setLayout(layoutData);
    setBeacon(beaconData);
    setWidthFix(gridContainerRef.current.clientWidth);
  }, []);

  const loadLayout = () => {
    return [
      { i: "A", x: 0, y: 0, w: 200, h: 200 },
      { i: "B", x: 200, y: 200, w: 50, h: 50 },
    ];
  };

  const loadBeacon = () => {
    return [
      { i: "C", x: 56, y: 34, w: 30, h: 30, static: true },
      { i: "D", x: 400, y: 200, w: 50, h: 50, static: true },
    ];
  };

  const onLayoutChange = (newLayout) => {
    console.log(newLayout);
  };
  const onBeaconChange = (newBeacon) => {
    console.log(newBeacon);
  };

  return (
    <div className="parent">
      <div className="border-2 border-grey-500 m-10" ref={gridContainerRef}>
        <ReactGridLayout
          layout={layout}
          onLayoutChange={onLayoutChange}
          margin={[0, 0]}
          cols={widthFix}
          rowHeight={1}
          preventCollision={true}
          compactType={null}
          className="w-100"
          containerPadding={[0, 0]}
        >
          <div key="A" className="border-2 border-green-400">
            A
          </div>
          <div key="B" className="border-2 border-green-400">
            B
          </div>
        </ReactGridLayout>
      </div>
      <div className="border-2 border-red-500 m-10">
        <ReactGridLayout
          layout={beacon}
          onLayoutChange={onBeaconChange}
          margin={[0, 0]}
          cols={widthFix}
          rowHeight={1}
          preventCollision={true}
          compactType={null}
          className="w-100 bg-transparent"
          containerPadding={[0, 0]}
        >
          <div key="D" className="border-2 border-green-400">
            D
          </div>
          <span className="loader z-10 tooltip" key="C">
            <span class="tooltiptext">
              <div>Tooltip text</div>
              <button className="border-2 p-2">Delete</button>
            </span>
          </span>
        </ReactGridLayout>
      </div>
    </div>
  );
};

export default RegionMapper;
