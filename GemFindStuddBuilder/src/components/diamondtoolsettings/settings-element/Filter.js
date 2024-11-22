import { elementAcceptingRef } from "@mui/utils";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Modal } from "react-responsive-modal";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { LoadingOverlay, Loader } from "react-overlay-loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Filter = (props) => {
  const location = useLocation();
  var productUrl = location.pathname;
  var part = productUrl.substring(productUrl.lastIndexOf("/") + 1);

  const [openFirsts, setOpenFirsts] = useState(false);
  const [openSeconds, setOpenSeconds] = useState(false);
  const [openThirds, setOpenThirds] = useState(false);
  const [openResetModal, setOpenResetModal] = React.useState(false);

  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);

  const [loaded, setLoaded] = useState(false);
  const [getTab, setTab] = useState("mined");
  const navigate = useNavigate();
  const [getcomparecookies, setcomparecookies] = useCookies([
    "_wpsavedcompareproductcookie",
  ]);
  const [skeletoncomparedata, setskeletoncomparedata] = useState(false);
  const [loadcomparedata, setloadcomparedata] = useState(false);
  const [getfinalcomparedata, setfinalcomparedata] = useState([]);
  const [showRetailerInfo, setshowRetailerInfo] = useState(false);
  const [getlabsetting, setlabsetting] = useState(props.getLabNavigation);
  const [getminedsetting, setminedsetting] = useState(props.getMinedNavigation);

  //console.log(cookies._wpsavediamondfiltercookie);
  const onChange = (e) => {
    e.preventDefault();
    props.callBack(false);
    //console.log(getTab);
    // console.log(props);
    if (getTab === "mined" || getTab === "") {
      setCookie("_wpsavediamondfiltercookie", props, {
        path: "/",
        maxAge: 604800,
      });
    }
    if (getTab === "labgrown") {
      setCookie("_wpsavedlabgowndiamondfiltercookie", props, {
        path: "/",
        maxAge: 604800,
      });
    }
  };

  const setOpenConfirm = (e) => {
    e.preventDefault();
    props.callBack(false);
    setLoaded(true);

    //console.log(getTab);
    removeCookie("shopify_diamondbackvalue", { path: "/" });
    removeCookie("_wpsaveringfiltercookie", { path: "/" });
    removeCookie("_wpsavediamondfiltercookie", { path: "/" });
    removeCookie("_wpsavedcompareproductcookie", { path: "/" });
    removeCookie("_shopify_diamondsetting", { path: "/" });
    removeCookie("shopify_ringbackvalue", { path: "/" });
    removeCookie("_shopify_ringsetting", { path: "/" });
    //if (getTab === "mined") {
    //console.log("mined selected");

    removeCookie("_wpsavedcompareproductcookie", { path: "/" });
    removeCookie("_wpsavediamondfiltercookie", { path: "/" });
    //}
    // if (getTab === "labgrown") {
    removeCookie("_wpsavedlabgowndiamondfiltercookie", { path: "/" });
    removeCookie("_wpsavedcompareproductcookie", { path: "/" });
    //}
    //if (getTab === "fancycolor") {
    removeCookie("_wpsavedcompareproductcookie", { path: "/" });
    removeCookie("_wpsavedfancydiamondfiltercookie", { path: "/" });
    removeCookie("compareproductcookie", { path: "/" });
    removeCookie("finalcompareproductcookie", { path: "/" });

    //}

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const handleresetpopup = (e) => {
    e.preventDefault();
    setLoaded(false);
    setOpenResetModal(true);
  };

  const handletab = (e) => {
    //e.preventDefault();

    if (e.target.id === "mined") {
      setTab(e.target.id);
      setLoaded(true);
      props.callbacktab(e.target.id);
      navigate(`${process.env.PUBLIC_URL}/diamonds`);
      window.location.reload();
    }
    if (e.target.id === "labgrown") {
      setTab(e.target.id);
      setLoaded(true);
      props.callbacktab(e.target.id);
      navigate(`${process.env.PUBLIC_URL}/navlabgrown`);
      window.location.reload();
    }
  };

  useEffect(() => {
    if (loaded === false) {
      //console.log(part);
      if (part === "navlabgrown") {
        setTab("labgrown");
        setLoaded(true);
      }
    }
  }, [getTab]);

  return (
    <>
      <style>
        {`.diamond-filter{
          background-color:${window.initData.data[0].header_colour}; 
        }
        .diamond-filter .navigation_filter_left .n_filter_left li.active a {
                color: ${window.initData.data[0].link_colour};
            }
            .diamond-filter .navigation_filter_left .n_filter_left li.active{
              background-color:${window.initData.data[0].hover_colour}; 
              color: ${window.initData.data[0].link_colour};
            }
            .diamond-filter .navigation_filter_left .n_filter_left li.active span i{
                color: ${window.initData.data[0].link_colour};
            }
            .diamond-filter .navigation_filter_left .n_filter_left li:hover a{
               background-color:${window.initData.data[0].hover_colour}; 
                color: ${window.initData.data[0].link_colour};
            }
            .diamond-filter .navigation_filter_left .n_filter_left li:hover span{
               background-color:${window.initData.data[0].hover_colour}; 
            }
            .diamond-filter .navigation_filter_left .n_filter_left li:hover span i{
              color: ${window.initData.data[0].link_colour};
            }
            .compareitems table tfoot tr td a{
              background-color:${window.initData.data[0].button_colour}; 
            }
             .compareitems table tfoot tr td a:hover{
              background-color:${window.initData.data[0].hover_colour}; 
              color: #fff;
            }
            .diamond-filter .save-reset-filter .navigation_right li a:hover{
              color: ${window.initData.data[0].hover_colour};
            }
            .diamond-filter .save-reset-filter .navigation_right li a{
              color:${window.initData.data[0].link_colour}; 
             }  
             .react-responsive-modal-root .react-responsive-modal-closeButton , .reset_popup-btn .btn{
              background-color:${window.initData.data[0].button_colour}; 
             }
             .react-responsive-modal-closeButton:hover{
              background-color: ${window.initData.data[0].hover_colour};
             }
            `}
      </style>
      <div className="navigation_filter_left ">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <ul className="n_filter_left">
          {getminedsetting !== "" && getminedsetting !== null && (
            <li className={`${getTab === "mined" ? "active" : ""}`}>
              <a href="javascript:;" onClick={handletab} id="mined">
                Mined
              </a>
              <span onClick={() => setOpenFirsts(true)}>
                <i className="fas fa-info-circle"></i>{" "}
              </span>
              <Modal
                open={openFirsts}
                onClose={() => setOpenFirsts(false)}
                center
                classNames={{
                  overlay: "popup_Overlay",
                  modal: "popup_Modal",
                }}
              >
                <div className="popup_content">
                  <p>
                    Formed over billions of years, natural diamonds are mined
                    from the earth. Diamonds are the hardest mineral on earth,
                    which makes them an ideal material for daily wear over a
                    lifetime. Our natural diamonds are conflict-free and GIA
                    certified.
                  </p>
                </div>
              </Modal>
            </li>
          )}
          {getlabsetting !== "" && getlabsetting !== null && (
            <li className={`${getTab === "labgrown" ? "active" : ""}`}>
              <a href="javascript:;" onClick={handletab} id="labgrown">
                Lab Grown
              </a>
              <span onClick={() => setOpenSeconds(true)}>
                <i className="fas fa-info-circle"></i>
              </span>
              <Modal
                open={openSeconds}
                onClose={() => setOpenSeconds(false)}
                center
                classNames={{
                  overlay: "popup_Overlay",
                  modal: "popup_Modal",
                }}
              >
                <div className="popup_content">
                  <p>
                    Lab-grown diamonds are created in a lab by replicating the
                    high heat and high pressure environment that causes a
                    natural diamond to form. They are compositionally identical
                    to natural mined diamonds (hardness, density, light
                    refraction, etc), and the two look exactly the same. A
                    lab-grown diamond is an attractive alternative for those
                    seeking a product with less environmental footprint.
                  </p>
                </div>
              </Modal>
            </li>
          )}
        </ul>
      </div>

      <div className="save-reset-filter">
        <ul className="navigation_right">
          <li>
            <a href="#!" onClick={onChange} className="save-icon">
              Save Search
            </a>
          </li>
          <li>
            <a href="#!" onClick={handleresetpopup} className="reset-icon">
              Reset
            </a>

            <Modal
              open={openResetModal}
              onClose={() => setOpenResetModal(false)}
              center
              classNames={{
                overlay: "popup_Overlay",
                modal: "popup__reset",
              }}
            >
              <LoadingOverlay className="_loading_overlay_wrapper">
                <Loader fullPage loading={loaded} />
              </LoadingOverlay>
              <p>Are you sure you want to reset data?</p>
              <div className="reset_popup-btn">
                <button
                  className="button btn btn_left"
                  onClick={setOpenConfirm}
                >
                  OK
                </button>
                <button
                  className="button btn"
                  onClick={() => setOpenResetModal(false)}
                >
                  CANCLE
                </button>
              </div>
            </Modal>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Filter;
