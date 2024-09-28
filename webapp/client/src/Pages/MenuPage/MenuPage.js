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
    "Altoona - Port Sky Cafe": "/altoona_port_sky_cafe.png",
    "Behrend - Bruno's": "/behrend_bruno's.png",
    "Harrisburg - Stacks": "/harrisburg_stacks.png",
    "Behrend - Dobbins": "/behrend_dobbins.png",
    "Brandywine - Blue Apple Cafe": "/brandywine_blue_apple_cafe.png",
    "Mont Alto - The Mill Cafe": "/mont_alto_the_mill_cafe.png",
    "UP: Pollock Dining Commons": "/up_pollock_dining_commons.png",
    "Beaver - Brodhead Bistro": "/beaver_brodhead_bistro.png",
    "UP: West Food District @ Waring": "/up_west_food_district_at_waring.png",
    "UP: South Food District @ Redifer": "/up_south_food_district_at_redifer.png",
    "UP: East Food District @ Findlay": "/up_east_food_district_at_findlay.png",
    "UP: North Food District @ Warnock": "/up_north_food_district_at_warnock.png",
    "Hazleton - HighAcres Cafe": "/hazleton_highacres_cafe.png",
    "Berks - Tully's": "/berks_tully's.png"
  }

  const link_to_location = {
    'altoona_port_sky_cafe': 'Altoona - Port Sky Cafe',
    "behrend_brunos": "Behrend - Bruno's",
    'harrisburg_stacks': 'Harrisburg - Stacks',
    'behrend_dobbins': 'Behrend - Dobbins',
    'brandywine_blue_apple_cafe': 'Brandywine - Blue Apple Cafe',
    'mont_alto_the_mill_cafe': 'Mont Alto - The Mill Cafe',
    'up_pollock_dining_commons': 'UP: Pollock Dining Commons',
    'beaver_brodhead_bistro': 'Beaver - Brodhead Bistro',
    'up_west_food_district_at_waring': 'UP: West Food District @ Waring',
    'up_south_food_district_at_redifer': 'UP: South Food District @ Redifer',
    'up_east_food_district_at_findlay': 'UP: East Food District @ Findlay',
    'up_north_food_district_at_warnock': 'UP: North Food District @ Warnock',
    'hazleton_highacres_cafe': 'Hazleton - HighAcres Cafe',
    "berks_tullys": "Berks - Tully's"
  }

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [cartTotal, setCartTotal] = useState({ calories: 0, protein: 0, totalCarb: 0, totalFat: 0, sugars: 0, dietaryFiber: 0 })
  const [showExpanded, setShowExpanded] = useState(false);
  const [openedCart, setOpenedCart] = useState(false);

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
    console.log(itemName)

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

  console.log(cart)

  const handleViewCart = () => {
    setShowExpanded(!showExpanded);
    setOpenedCart(true)
  }

  const ItemCard = memo(({ item, index, cartCount, handleAdd, handleRemove }) => {
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
                  <div className='counter active'><p className='number'>{cartCount}</p></div>
              )
            }
            </div>
          </div> 
          <div className='info-area'>
          <div className='left'>
            <p>Calories: {item.calories}</p>
            <p>Protein: {item.protein === "n/a" ? "n/a" : item.protein + " g"}</p>
            <p>Carbs: {item.totalCarb === "n/a" ? "n/a" : item.totalCarb + " g"}</p>
          </div>
          <div className='right'>
            <p>Fat: {item.totalFat === "n/a" ? "n/a" : item.totalFat +" g"}</p>
            <p>Sugar: {item.sugars === "n/a" ? "n/a" : item.sugars + " g"}</p>
            <p>Fiber: {item.dietaryFiber === "n/a" ? "n/a" : item.dietaryFiber + " g"}</p>
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

  const calculateTotal = () => {
    const cartItems = menu.filter((item => cart[item.name] >= 1))

    let newTotal = { calories: 0, protein: 0, totalCarb: 0, totalFat: 0, sugars: 0, dietaryFiber: 0 }

    for (let i = 0; i < cartItems.length; i++) {
      newTotal = {
        calories: cartItems[i].calories * cart[cartItems[i].name],
        protein: cartItems[i].protein * cart[cartItems[i].name],
        totalCarb: cartItems[i].totalCarb * cart[cartItems[i].name],
        totalFat: cartItems[i].totalFat * cart[cartItems[i].name],
        sugars: cartItems[i].sugars * cart[cartItems[i].name],
        dietaryFiber: cartItems[i].dietaryFiber * cart[cartItems[i].name],        
    }
  }

    // console.log(newTotal)

    setCartTotal(newTotal)
  }

  useEffect(() => {
    calculateTotal()
  },[cart])

  return (
    <>
      {
        loading ? (
          <div className="loading-screen">
            <p>Retrieving the menu at <br /> {link_to_location[location]}</p>
            <Spinner className="spinner" animation="border" role="status"/>
          </div>
        ) : error ? (
          <div className="loading-screen">
            <p style={{color: "red"}}>Error retrieving menu: {error}</p>
            <p>Please try reloading</p>
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
                      handleAdd={handleAdd} 
                      handleRemove={handleRemove}
                    />
                  ))
                }
              </div>
            </div>

            {
              openedCart ? (
                <>
                  <div className={showExpanded ? 'black-background fade-in' : 'black-background fade-out'}/>

                  <div className={showExpanded ? 'expanded-shopping-cart grow' : 'expanded-shopping-cart shrink'}>
                    <div className='cart-area'>
                      <div className='selected-dishes-area' style={{ overflowY:"scroll" }}>
                        {
                          menu.map((item, originalIndex) => ({ ...item, originalIndex }))
                            .filter(item => cart[item.name] >= 1)
                            .map((item) => (
                              <ItemCard
                                key={`item-${item.originalIndex}`} 
                                index={item.originalIndex} // Use the original index
                                item={item} 
                                cartCount={cart[item.name] || 0} 
                                handleAdd={handleAdd} 
                                handleRemove={handleRemove}
                              />
                          ))
                        }
                      </div>
                      <div className='total-nutrients-area'>
                        <div className='title-area'>
                          <p className='title'>
                            Total <br /> Nutrients
                          </p>
                        </div>
                        <div className='info-area'>
                          <p className='nutrient-info'>Calories: {cartTotal.calories}</p>
                          <p className='nutrient-info'>Protein: {cartTotal.protein} g</p>
                          <p className='nutrient-info'>Carbs: {cartTotal.totalCarb} g</p>
                          <p className='nutrient-info'>Fat: {cartTotal.totalFat} g</p>
                          <p className='nutrient-info'>Sugar: {cartTotal.sugars} g</p>
                          <p className='nutrient-info'>Fiber: {cartTotal.dietaryFiber} g</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
                    handleViewCart();
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