import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import ImageLoader from "react-load-image";
import { Modal } from "react-responsive-modal";

const CompleteRingGallary = (props) => {
  const [getVideo, setVideo] = useState(true);
  const [getImage, setImage] = useState(false);
  const [getDefaultImage, setDefaultImage] = useState("");
  const [selectedImage, setselectedImage] = useState("");
  const [open, setOpen] = useState(false);
  const onCloseModal = () => setOpen(false);

  const [openVideo, setOpenVideo] = useState(false);

  const onOpenModalVideo = () => setOpenVideo(true);
  const onCloseModalVideo = () => {
    console.log("close");
    setOpenVideo(false);
  };

  const onOpenVideo = (e) => {
    e.preventDefault();
    setVideo(true);
    setImage(false);
  };

  const changeimage = (e) => {
    e.preventDefault();
    setselectedImage(e.target.id);
    setDefaultImage(e.target.src);
    setVideo(false);
    setImage(true);
  };

  const onOpenimage = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  useEffect(() => {
    if (props.productDetailsData.videoURL) {
      setVideo(true);
      setImage(false);
    } else {
      setVideo(false);
      setImage(true);
    }
    setDefaultImage(props.productDetailsData.imagePath);
  }, []);
  var imagesGallery = [];
  if (props.productDetailsData && props.productDetailsData.extraImage) {
    props.productDetailsData.extraImage.map((val) =>
      imagesGallery.push({ original: val, thumbnail: val })
    );
  }
  if (props.productDetailsData.imagePath) {
    imagesGallery.push({
      original: props.productDetailsData.imagePath,
      thumbnail: props.productDetailsData.imagePath,
    });
  }
  function PreloaderImage(props) {
    return (
      <img
        className="preloaderr"
        alt="spinner"
        src={
          window.initData.data[0].server_url +
          process.env.PUBLIC_URL +
          "/images/spinner.gif"
        }
        style={{ width: "21px", height: "24px" }}
      />
    );
  }

  return (
    <div className="product-image-gallary">
      <div className="top-icons">
        <span className="zoom-icon" onClick={onOpenimage}>
          <i className="fas fa-search-plus"></i>
        </span>
      </div>
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        classNames={{
          overlay: "popup_Overlay",
          modal: "popup_product",
        }}
      >
        <div className="popup_image">
          <ImageLoader src={getDefaultImage}>
            <img alt="product-gallery" />
            <div>Error!</div>
            <div className="image_loaader">
              {" "}
              <PreloaderImage />{" "}
            </div>
          </ImageLoader>
        </div>
      </Modal>
      {/* <div
        className={`ring-diamond-video ${getVideo === true ? "active" : ""} `}
      >
        <video
          width="100%"
          autoPlay={true}
          loop={true}
          muted={true}
          playsInline={true}
          draggable="true"
        >
          <source src={props.productDetailsData.videoURL} type="video/mp4" />
        </video>
      </div> */}
      <div className={`ring-diamond-image active`}>
        <ImageLoader src={getDefaultImage}>
          <img alt="product-gallery" />
          <div>Error!</div>
          <div className="image_loaader">
            <PreloaderImage />
          </div>
        </ImageLoader>
      </div>
      <div className="product-skus">
        <h2 className="gf-stylenumber">
          {" "}
          StyleNumber# {props.productDetailsData.styleNumber}
        </h2>
      </div>
      {/* <div className={`thumbnailimage image-thumb-image`}>
        <ul className="image-gallary-box">
          {imagesGallery.map((val, index) => (
            <li
              key={index}
              onClick={changeimage}
              className={`image-gallary-list ${
                selectedImage === index.toString() ? "active" : ""
              }`}
            >
              <ImageLoader src={val.original}>
                <img id={index} alt="product-gallery" />
                <div>Error!</div>
                <div className="image_loaader">
                  {" "}
                  <PreloaderImage />{" "}
                </div>
              </ImageLoader>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default CompleteRingGallary;
