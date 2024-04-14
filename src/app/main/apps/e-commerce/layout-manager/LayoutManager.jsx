import React from "react";
import "./LayoutManager.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

function LayoutManager() {
  const routeParams = useParams();
  const { storeId } = routeParams;

  const [layouts, setLayouts] = React.useState([]);
  const navigate = useNavigate();
  const { info, setInfo } = React.useState("");

  React.useEffect(() => {
    axios
      .get(process.env.REACT_APP_PRODUCTION_KEY+"/layout/" + storeId)
      .then((res) => {
        const layout = res.data.data.layouts;
        setLayouts(layout);
        if (layout.length == 0) {
          setInfo("No layouts available.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="grid place-items-center h-[60vh]">
      <div className="text-3xl font-bold mt-32 mb-28">Layouts</div>
      <a
        onClick={() => {
          navigate(
            `/apps/region-mapper/${storeId}/${(Math.random() + 1)
              .toString(36)
              .substring(12)}/new`
          );
        }}
        className="btn btn-primary p-20 mt-3 text-left border-2 w-2/3 bg-white hover:cursor-pointer"
      >
        Add new
      </a>
      <div className="flex flex-col gap-2 w-2/3 h-[60vh] overflow-scroll bg-white p-20 mt-10">
        {layouts.length == 0 ? <div>{info}</div> : <div></div>}
        {layouts.map((val, i) => {
          return (
            <div
              key={i}
              className="flex flex-row gap-4 p-6 w-100 place-items-center border-2 hover:bg-grey-300 hover:cursor-pointer"
              onClick={() => {
                navigate(
                  `/apps/region-mapper/${storeId}/${val.layoutId}/load`
                );
              }}
            >
              <img
                src="https://th.bing.com/th/id/OIP.KKZCLxNF2jLBlLqJ8BNDFgHaEy?pid=ImgDet&rs=1"
                alt=""
                className="w-[100px]"
              />
              <div className="flex flex-col gap-2 pl-5">
                <div>{val.layoutName}</div>
                <div>ID: {val.layoutId}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LayoutManager;
