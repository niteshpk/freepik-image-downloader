import React, { useState } from "react";

const qualityOptions = {
  small: { width: "600", label: "small" },
  medium: { width: "1000", label: "medium" },
  large: { width: "2000", label: "large" },
  xLarge: { width: "4000", label: "xLarge" },
};

function ImageDownloader() {
  const [imageUrl, setImageUrl] = useState("");
  const [imageQuality, setImageQuality] = useState("xLarge");
  const [downloadAllSizes, setDownloadAllSizes] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleInputChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleQualityChange = (event) => {
    setImageQuality(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (downloadAllSizes) {
      downloadAllImageSizes();
    } else {
      const result = modifyImageUrl(imageUrl, imageQuality);
      downloadImage(result.url, result.label);
    }
  };

  const modifyImageUrl = (url, quality) => {
    const params = new URLSearchParams(url.split("?")[1]);
    params.set("w", qualityOptions[quality].width);
    const modifiedUrl = url.split("?")[0] + "?" + params.toString();

    return { url: modifiedUrl, label: qualityOptions[quality].label };
  };

  const handleDownloadAllSizesChange = (event) => {
    setDownloadAllSizes(event.target.checked);
  };

  const downloadImage = async (url, qualityLabel) => {
    try {
      setDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = getFilenameFromUrl(url, qualityLabel);
      link.click();

      URL.revokeObjectURL(objectUrl);
      setImageUrl("");
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed! Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const downloadAllImageSizes = () => {
    Object.values(qualityOptions).forEach((quality) => {
      const { url, label } = modifyImageUrl(imageUrl, quality.label);
      downloadImage(url, label);
    });
  };

  const getFilenameFromUrl = (url, qualityLabel) => {
    const parts = url.split("/");
    const filenameWithExtension = parts[parts.length - 1].split("?")[0];
    const filename = filenameWithExtension.split(".")[0];
    const extension = filenameWithExtension.split(".")[1];
    return `${filename}_${qualityLabel}.${extension}`;
  };

  const isUrlValid = () => {
    // Regular expression for URL validation
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(imageUrl);
  };

  const isDownloadButtonDisabled = !isUrlValid() || imageUrl === "";

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="my-5 mx-2">
        <div className="mb-3 mt-5 row">
          <div className="col-md-3">
            <label htmlFor="imageUrl" className="col-form-label">
              Freepik Image URL :
            </label>
          </div>

          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              id="imageUrl"
              value={imageUrl}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="my-3 row">
          <div className="col-md-3">
            <label htmlFor="downloadAllSizes">Download All Sizes? :</label>
          </div>

          <div className="col-md-9 text-start ">
            <input
              type="checkbox"
              className="form-check-input"
              id="downloadAllSizes"
              checked={downloadAllSizes}
              onChange={handleDownloadAllSizesChange}
            />
          </div>
        </div>

        {!downloadAllSizes && (
          <div className="my-3 row">
            <div className="col-md-3">
              <label htmlFor="imageQuality">Image Quality :</label>
            </div>

            <div className="col-md-4 ">
              <select
                className="form-control"
                id="imageQuality"
                value={imageQuality}
                onChange={handleQualityChange}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xLarge">Extra Large</option>
              </select>
            </div>
          </div>
        )}

        <div className="my-3 row mx-1">
          <div className="col-md-8 offset-md-3">
            <div className="row">
              <button
                type="submit"
                className="btn btn-primary my-5  btn-block"
                disabled={isDownloadButtonDisabled || downloading}
              >
                {downloading && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {`Download${downloading ? "ing" : ""} Image(s)`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ImageDownloader;
