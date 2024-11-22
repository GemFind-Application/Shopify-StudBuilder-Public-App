import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import Skeleton from "react-loading-skeleton";

const ReangeSlider = (props) => {
  // Our States
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [loaded, setLoaded] = useState(false);
  const marks = props.pricerangeData;
  const [startValue, setstartValue] = useState(Number(marks[0].minPrice));
  const [lastValue, setlastValue] = useState(Number(marks[0].maxPrice));

  // Changing State when volume increases/decreases
  const rangeSelector = (newValue) => {
    setstartValue(Number(newValue[0]));
    setlastValue(Number(newValue[1]));
  };

  const startValueOnChange = (event) => {
    setstartValue(event.target.value);
  };

  const endValueOnChange = (event) => {
    setlastValue(event.target.value);
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (loaded === false) {
    return <Skeleton height={80} />;
  } else {
  
    return (
      <div className="range-slider_price">
        <div className="slider">
          <h4 className="f_heading">
            Price
            <span className="f_popup" onClick={onOpenModal}>
              <i className="fas fa-info-circle"></i>
            </span>
          </h4>
          <Modal
            open={open}
            onClose={onCloseModal}
            center
            classNames={{
              overlay: "popup_Overlay",
              modal: "popup_Modal",
            }}
          >
            <div className="popup_content">
              <p>
                This refer to different type of Price to filter and select the
                appropriate ring as per your requirements. Look for best suit
                price of your chosen ring.
              </p>
            </div>
          </Modal>
          <div>
            <Nouislider
              connect
              behaviour={"tap"}
              start={[startValue, lastValue]}
              step={1}
              range={{
                min: Number(marks[0].minPrice),
                max: Number(marks[0].maxPrice),
              }}
              onChange={rangeSelector}
            />
          </div>
        </div>
        <div className="input-value">
          <div className="input-value-left">
            <span className="icon">$</span>
            <input
              type="text"
              value={startValue}
              onChange={startValueOnChange}
            />{" "}
          </div>
          <div className="input-value-right">
            <span className="icon">$</span>
            <input type="text" value={lastValue} onChange={endValueOnChange} />
          </div>
        </div>
      </div>
    );
  }
};

export default ReangeSlider;
