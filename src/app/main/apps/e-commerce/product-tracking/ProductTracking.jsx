import React, { useState } from "react";
import axios from "axios";

function ProductTracking() {
  const [processedVideoLink, setProcessedVideoLink] = useState(null); // State to hold processed video link
  const [loading, setLoading] = useState(false); // Loading state
  const fileInputRef = React.useRef(); // Reference for the file input element

  const handleClick = () => {
    setLoading(true); // Set loading to true when starting the API call

    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]); // Appending the selected file to form data

    axios
      .post("http://localhost:4000/image-processing", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // Assuming the API returns the processed video link in the response
        const { data } = res;
        setProcessedVideoLink(data.response.Location); // Set the processed video link in state
       
        setLoading(false); // Set loading to false after receiving the response
        alert("Video processed.");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Set loading to false on API error
        alert("Error processing video.");
      });
  };

  return (
    <div className="grid place-items-center h-[60vh]">
      <div className="flex flex-col gap-2 p-8 w-1/2">
        <div className="mb-4 text-2xl">Add Cart Video</div>
        <input
          type="file"
          className="border-2 p-4"
          ref={fileInputRef}
          accept="video/*" 
        />
        <button className="btn btn-primary p-4 border-2" onClick={handleClick}>
          Submit
        </button>
        {loading && <p>Loading...</p>} {/* Display loading message or spinner while loading */}
        {processedVideoLink && (
          <div className="mt-4">
            <video controls className="w-full" style={{ maxWidth: "100%" }}>
              <source src={processedVideoLink} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductTracking;
