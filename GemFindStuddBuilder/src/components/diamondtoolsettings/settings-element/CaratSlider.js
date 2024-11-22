import React, { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import Skeleton from "react-loading-skeleton";
import { useCookies } from "react-cookie";
const CaratSlider = (props) => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [loaded, setLoaded] = useState(false);
  const marks = props.caratSliderData;
  const [startValue, setStartValue] = useState(Number(props.minCarat));
  const [lastValue, setLastValue] = useState(Number(props.maxCarat));
  const [tempStartValue, setTempStartValue] = useState(startValue.toString());
  const [tempLastValue, setTempLastValue] = useState(lastValue.toString());
  const [getMinValue, setMinValue] = useState();
  const [getMaxValue, setMaxValue] = useState();

  const [getsettingcookies, setsettingcookies] = useCookies([
    "_shopify_ringsetting",
  ]);
  const [getdiamondcookies, setdiamondcookies] = useCookies([
    "_wpsavediamondfiltercookie",
  ]);
  const [getlabcookies, setlabcookies] = useCookies([
    "_wpsavedlabgowndiamondfiltercookie",
  ]);

  const rangeSelectorProps = (newValue) => {
    setStartValue(Number(newValue[0]));
    setLastValue(Number(newValue[1]));
    setTempStartValue(newValue[0].toString());
    setTempLastValue(newValue[1].toString());
    let sliderSelection = [];
    sliderSelection.push(Number(newValue[0]));
    sliderSelection.push(Number(newValue[1]));
    props.callBack(sliderSelection);
  };

  const handleStartValueChange = (event) => {
    setTempStartValue(event.target.value);
  };

  const handleEndValueChange = (event) => {
    setTempLastValue(event.target.value);
  };

  const validateAndSetValues = () => {
    let newStartValue = parseFloat(tempStartValue);
    let newLastValue = parseFloat(tempLastValue);

    if (isNaN(newStartValue) || newStartValue < getMinValue) {
      newStartValue = getMinValue;
    } else if (newStartValue > lastValue) {
      newStartValue = lastValue;
    }

    if (isNaN(newLastValue) || newLastValue > getMaxValue) {
      newLastValue = getMaxValue;
    } else if (newLastValue < startValue) {
      newLastValue = startValue;
    }

    setStartValue(newStartValue);
    setLastValue(newLastValue);
    setTempStartValue(newStartValue.toString());
    setTempLastValue(newLastValue.toString());

    let sliderSelection = [];
    sliderSelection.push(newStartValue);
    sliderSelection.push(newLastValue);
    props.callBack(sliderSelection);
  };

  const handleBlur = () => {
    validateAndSetValues();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      validateAndSetValues();
    }
  };

  useEffect(() => {
    setLoaded(true);

    if (props.minCarat === "" && props.maxCarat === "") {
      setStartValue(Number(props.caratSliderData[0].minCarat));
      setLastValue(Number(props.caratSliderData[0].maxCarat));
    }

    if (props.callbacktab === "mined") {
      if (
        getdiamondcookies._wpsavediamondfiltercookie &&
        getdiamondcookies._wpsavediamondfiltercookie.caratmin &&
        getdiamondcookies._wpsavediamondfiltercookie.caratmax
      ) {
        setStartValue(Number(props.minCarat));
        setLastValue(Number(props.maxCarat));
      }
    }

    if (props.callbacktab === "labgrown") {
      if (
        getlabcookies._wpsavedlabgowndiamondfiltercookie &&
        getlabcookies._wpsavedlabgowndiamondfiltercookie.caratmin &&
        getlabcookies._wpsavedlabgowndiamondfiltercookie.caratmax
      ) {
        setStartValue(Number(props.minCarat));
        setLastValue(Number(props.maxCarat));
      }
    }

    if (getsettingcookies._shopify_ringsetting) {
      setMinValue(
        Number(getsettingcookies._shopify_ringsetting[0].ringmincarat)
      );
      setMaxValue(
        Number(getsettingcookies._shopify_ringsetting[0].ringmaxcarat)
      );
    }
  }, [props]);

  useEffect(() => {
    setTempStartValue(startValue.toString());
    setTempLastValue(lastValue.toString());
  }, [startValue, lastValue]);

  if (loaded === false) {
    return <Skeleton height={80} />;
  } else {
    const minValue = getMinValue ? getMinValue : Number(marks[0].minCarat);
    const maxValue = getMaxValue ? getMaxValue : Number(marks[0].maxCarat);

    return (
      <div className="range-slider_diamond">
        <div className="slider">
          <h4 className="f_heading diamond_heading">
            CARAT
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
                Carat is a unit of measurement to determine a diamond’s weight.
                Typically, a higher carat weight means a larger looking diamond,
                but that is not always the case. Look for the mm measurements of
                the diamond to determine its visible size.
              </p>
              <img
                src={
                  window.initData.data[0].server_url +
                  process.env.PUBLIC_URL +
                  "/images/carat.jpg"
                }
                alt="Carat"
                className="popup-image"
              ></img>
            </div>
          </Modal>

          <div className="diamond-ui-slider diamond-small-slider">
            <Nouislider
              connect
              behaviour={"tap"}
              start={[startValue, lastValue]}
              range={{
                min: minValue,
                max: maxValue,
              }}
              tooltips={true}
              onChange={rangeSelectorProps}
            />
          </div>
        </div>
        <div className="input-value dia-input-value">
          <div className="input-value-left">
            <input
              type="text"
              value={tempStartValue}
              onChange={handleStartValueChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />{" "}
          </div>
          <div className="input-value-right">
            <input
              type="text"
              value={tempLastValue}
              onChange={handleEndValueChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default CaratSlider;
