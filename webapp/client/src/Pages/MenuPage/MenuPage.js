import './MenuPage.css'
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Spinner } from 'react-bootstrap';

import { useEffect, useState, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'

function MenuPage() {
  const { location } = useParams();
  const navigate = useNavigate();

  const locationImages = {
    "Behrend - Bruno's": "/behrend_bruno's.png",
    "Harrisburg - Stacks": "/harrisburg_stacks.png",
    "Harrisburg - The Outpost": "/harrisburg_outpost.png",
    "Berks - Tully's": "/berks_tully's.png",
    "Altoona - Port Sky Cafe": "/altoona_port_sky_cafe.png",
    "Hazleton - HighAcres Cafe": "/hazleton_high_acres.png",
    "Hazleton - Higher Grounds": "/hazleton_higher_grounds.png",
    "UP: Pollock Dining Commons": "/UP_pollock_dining_commons.png",
    "UP: East Food District @ Findlay": "/UP_east_food_district_resized2.png"
  }
  const link_to_location = {
    "behrend_brunos": "Behrend - Bruno's",
    "harrisburg_stacks": "Harrisburg - Stacks",
    "harrisburg_outpost": "Harrisburg - The Outpost",
    "berks_tullys": "Berks - Tully's",
    "altoona_port_sky_cafe": "Altoona - Port Sky Cafe",
    "hazleton_high_acres": "Hazleton - HighAcres Cafe",
    "hazleton_higher_grounds": "Hazleton - Higher Grounds",
    "UP_pollock_dining_commons": "UP: Pollock Dining Commons",
    "UP_east_food_district": "UP: East Food District @ Findlay"
  }

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [prevCart, setPrevCart] = useState({});
  const [showExpanded, setShowExpanded] = useState(false);
  const [openedCart, setOpenedCart] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEasternTime = () => {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  };
  const time = new Date(getEasternTime());
  const morning = new Date(getEasternTime().setHours(11, 0, 0, 0));
  const noon = new Date(getEasternTime().setHours(16, 0, 0, 0));
  const evening = new Date(getEasternTime().setHours(23, 59, 59, 999));

  const getLocationMenu = async (locationName) => {
    try {
      let meal = ""
      if (time <= morning) meal = "Breakfast"
      else if (time > morning && time <= noon) meal = "Lunch"
      else if (time > noon && time <= evening) meal = "Dinner"

      const response = await axios.get('http://localhost:5000/data/getLocationMenu', 
        {
          params: {locationName: link_to_location[locationName], mealType: meal},
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )

      // console.log(response.data)
      
      setMenu(Object.values(response.data)[0])
      setLoading(false)
    } catch (e) {
      setError(e)
      console.error(e)
    }
  }

  // const getRecMenu = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/getRecMenu',
  //       {
  //         params: {locationMenu: menu, dietType: {}, userData: {}}, // not complete, missing dietType and userData
  //         headers: {'Content-Type': 'application/json'},
  //         withCredentials: true
  //       }
  //     )
  //     console.log(response)
  //   } catch (e) {
  //     setError(e)
  //     console.error(e)
  //   }
  // }

  // console.log('MenuPage re-rendered');

  useEffect(() => {
    getLocationMenu(location)
  }, [])

  const handleAdd = (index) => {

    let itemName = menu[index].name
    // console.log(itemName)

    setPrevCart(cart)

    setCart((curr) => {
      if (curr[itemName]) {
        // console.log(curr[itemName])  
        return {
          ...curr,
          [itemName]: curr[itemName] + 1
        };
      } else {
        return {
          ...curr,
          [itemName]: 1
        }
      }
    });

  }

  const handleRemove = (index) => {

    let itemName = menu[index].name

    setPrevCart(cart)

    setCart((curr) => {
      if (curr[itemName] > 1) {
        return {
          ...curr,
          [itemName]: curr[itemName] - 1
        };
      } else if (curr[itemName] === 1) {
        return {
          ...curr,
          [itemName]: 0
        }
      } else {
        return curr
      }
    });

  }

  const handleViewCart = (scrollPos1, scrollPos2) => {
    const appElement = document.querySelector('.App');

    if (appElement) {

      // console.log(`scrollPos1: ${scrollPos1}`)
      // console.log(`scrollPos2: ${scrollPos2}`)
  
      if (!showExpanded) {

        // Hide the scrollbar while maintaining scroll functionality
        appElement.style.overflow = 'scroll';
        appElement.style.scrollbarWidth = 'none';  // For Firefox
        appElement.style.msOverflowStyle = 'none';  // For Internet Explorer and Edge
  
        // For Webkit browsers (Chrome, Safari, etc.)
        appElement.style.setProperty('::-webkit-scrollbar', 'width: 0px');
        appElement.style.setProperty('::-webkit-scrollbar-thumb', 'display: none');

        // Restore the scroll position
        // console.log('open')
        appElement.scrollTop = scrollPos1;
      } else {
        // Revert to visible overflow
        appElement.style.overflow = 'visible';

        // console.log('close')
        window.scrollTo({
          top: scrollPos2,
          left: 0,
          behavior: 'instant',
        });
      }

    } else {
      console.log("Element with class 'App' not found.");
    }

    setShowExpanded(!showExpanded);
    setOpenedCart(true)
  }

  const ItemCard = memo(({ item, index, prevCartCount, cartCount, handleAdd, handleRemove }) => {
    // console.log(`Rendering ItemCard for ${item.name}`);
    return (
      <div className='item-card'>
        <div className='content-area'>
          <div className='title-area'>
            <p className='name'>{item.name}</p>
            <div className='counter-area'>
            {
              cartCount < 1 ? (
                <div className='counter inactive' />
              ) : (
                prevCartCount === cartCount ? (
                  <div className='counter active'><p className='number'>{cartCount}</p></div>
                ) : (
                  <div className='counter active jump'><p className='number'>{cartCount}</p></div>
                )
              )
            }
            </div>
          </div> 
          <div className='info-area'>
            <div className='left'>
              <p>Calories: {item.calories}</p>
              <p>Protein: {item.protein}</p>
              <p>Carbs: {item.carbs}</p>
            </div>
            <div className='right'>
              <p>Fat: {item.fat}</p>
              <p>Sugar: {item.sugars} </p>
              <p>Fiber: {item.fiber}</p>
            </div>
            <div className='end'>
              <div className='button-area'>
                <div className='button active' onClick={() => handleAdd(index)}><p className='icon'>+</p></div>
                {
                  cartCount >= 1 ? 
                  <div className='button active' onClick={() => handleRemove(index)}><p className='icon'>-</p></div> :
                  <div className='button inactive'><p className='icon'>-</p></div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  });

  return (
    <>
      {
        loading ? (
          <div className="mobile-box">
            <div className="flex-center">
              <p className="fs-5 title" style={{ color: "#FFFFFF", whiteSpace: "pre"}}>
                Retrieving the menu at <br />
                {link_to_location[location]}
              </p>
              <Spinner className="spinner" style={{ color: "#FFFFFF" }} animation="border" role="status" />
            </div>
          </div>
        ) : error ? (
          <div className="mobile-box">
            <div className="flex-center">
              <p className="fs-5 title text-danger">Error retrieving menu: {error}</p>
              <p className="fs-5 title text-danger">Please try reloading</p>
            </div>
          </div>
        ) : (
          <div className="intro-fade">

            <div className="logo" onClick={() => navigate('/halls')}>
              <img alt="" src="/pennState_logo.png" style={{ width: '100px', height: 'auto' }}/>
              <div className='logo-text'>
                <p className="logo-title">PennMeal</p>
                <p className='logo-subtitle'>For growing boys and girls</p>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <img className='banner' alt="" src={locationImages[link_to_location[location]] || "/penn_state_logo"} />
              <p className='location-name'>{link_to_location[location]}</p>
              <div className='menu-content'>
                {
                  menu.map((item, index) => (
                    <ItemCard 
                      key={`item-${index}`} 
                      index={index} 
                      item={item} 
                      cartCount={cart[item.name] || 0} 
                      prevCartCount={prevCart[item.name] || 0} 
                      handleAdd={handleAdd} 
                      handleRemove={handleRemove}
                    />
                  ))
                }
              </div>
            </div>

            {
              showExpanded ? (
                <>
                  <div className='expanded-shopping-cart grow'>
                    <div className='cart-area'></div>
                  </div>
                </>
              ) : !showExpanded && openedCart ? (
                <>
                  <div className='expanded-shopping-cart shrink'></div>
                </>
              ) : (
                <></>
              )
            }

            <div className='view-cart-wrapper'>
              <div className='view-cart-area'>
                <div 
                  className='view-cart' 
                  onClick={() => {
                    const scrollPos = window.scrollY;
                    setScrollPosition(scrollPos);
                    // console.log(scrollPosition);
                    handleViewCart(scrollPos, scrollPosition);
                  }}
                >
                  <div className='content-area'>
                    <div className='text-area'>
                      <p className='cart'>
                        {
                          !showExpanded ? (
                          `View Cart (${Object.values(cart).reduce((sum, value) => sum + value, 0)})`
                          ) : (
                          "View Menu"
                          )
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )
      }
    </>
  );
}

export default MenuPage;