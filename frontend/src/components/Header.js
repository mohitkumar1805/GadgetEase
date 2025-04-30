import React, { useContext, useState, useEffect, useRef } from 'react';
import { GrSearch } from "react-icons/gr";
import { FaUserAlt, FaShoppingCart, FaBars } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuDisplay(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  const toggleMenu = () => {
    setMenuDisplay(prevState => !prevState);
  };

  const handleMenuOptionClick = () => {
    setMenuDisplay(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenu(prevState => !prevState);
  };
  const handleMobileMenu=() =>{
    setMobileMenu(false);
  }

  return (
    <header className='h-16 shadow-md bg-[#FFC94A] fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
        <div className='flex items-center justify-between w-full lg:w-auto'>
          <Link to={"/"}>
            <span className='text-zinc-600 text-3xl font-bold'>G</span>
            <span className='font-bold text-2xl'>adget
              <span className='text-zinc-600 text-3xl font-bold'>E</span>
              ase Lease & Buy
            </span>
          </Link>
          <button className='lg:hidden text-3xl ml-4' onClick={toggleMobileMenu}>
            <FaBars />
          </button>
        </div>

        <div className='hidden lg:flex items-center w-full justify-between max-w-sm border-gray bg-white h-11 rounded-lg focus-within:shadow pl-2'>
          <input
            type='text'
            placeholder='search product here...'
            className='w-full outline-none px-3'
            onChange={handleSearch}
            value={search}
          />
          <div className='text-xl min-w-[50px] cursor-pointer bg-gray-900 flex items-center justify-center h-11 rounded-r-lg text-white font-bold'>
            <GrSearch />
          </div>
        </div>

        <div className='hidden lg:flex items-center gap-7'>
          <div ref={dropdownRef}>
            <div
              className='text-3xl cursor-pointer relative flex justify-center'
              onClick={toggleMenu}
            >
              {
                user?._id ? (
                  user?.profilePic ? (
                    <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                  ) : (
                    <span className='text-2xl'><FaUserAlt /></span>
                  )
                ) : null
              }
            </div>

            {
              menuDisplay && (
                <div className='absolute bg-white top-16 right-0 p-2 shadow-lg rounded w-48'>
                  <nav className='flex flex-col'>
                    {user?.role === ROLE.ADMIN && (
                      <Link to={"/admin-panel/all-products"} className='whitespace-nowrap font-semibold p-2 hover:bg-amber-500 hover:text-white rounded' onClick={handleMenuOptionClick}>
                        Admin Panel
                      </Link>
                    )}
                    <Link to={"/user-Order"} className='whitespace-nowrap font-semibold p-2 hover:bg-amber-500 hover:text-white rounded' onClick={handleMenuOptionClick}>
                      Orders
                    </Link>
                    <button onClick={() => {
                      handleLogout();
                      handleMenuOptionClick();
                    }} className='whitespace-nowrap font-semibold p-2 hover:bg-amber-500 hover:text-white rounded text-left'>
                      Logout
                    </button>
                  </nav>
                </div>
              )
            }
          </div>

          {
            user?._id && (
              <Link to={"/cart"} className='text-2xl relative'>
                <span><FaShoppingCart /></span>
                <div className='bg-gray-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                  <p className='text-sm font-bold'>{context?.cartProductCount}</p>
                </div>
              </Link>
            )
          }

          <div>
            {
              user?._id ? (
                <button onClick={handleLogout} className='py-1 text-lg font-bold px-4 rounded-lg text-white bg-gray-900 hover:bg-gray-700'>
                  Logout
                </button>
              ) : (
                <div className='flex gap-4'>
                  <Link to={"/login"} className='text-lg font-bold px-4 py-2 rounded-lg text-gray-900 hover:text-gray-700'>
                    Login
                  </Link>
                  <Link to={"/sign-up"} className='text-lg font-bold px-4 py-2 rounded-lg text-white bg-gray-900 hover:bg-gray-700'>
                    Signup
                  </Link>
                </div>
              )
            }
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {
        mobileMenu && (
          <div className='lg:hidden flex flex-col items-start bg-[#FFC94A] shadow-md fixed w-full z-40 top-16 left-0 p-4'>
            <div className='flex items-center w-full border-gray bg-white h-11 rounded-lg focus-within:shadow pl-2 mb-4'>
              <input
                type='text'
                placeholder='search product here...'
                className='w-full outline-none px-3'
                onChange={handleSearch}
                value={search}
              />
              <div className='text-xl min-w-[50px] cursor-pointer bg-gray-900 flex items-center justify-center h-11 rounded-r-lg text-white font-bold'>
                <GrSearch />
              </div>
            </div>

            <div className='flex w-full items-center justify-between mb-4'>
              {
                user?._id ? (
                  <div className='flex items-center'>
                    {
                      user?.profilePic ? (
                        <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                      ) : (
                        <span className='text-2xl'><FaUserAlt /></span>
                      )
                    }
                    <div className='ml-4' ref={dropdownRef}>
                      <button onClick={toggleMenu} className='text-lg  bg-gray-900 text-white rounded-lg px-2 font-semibold'>
                        {user?.name}
                      </button>
                      {
                        menuDisplay && (
                          <div className='bg-white p-2 shadow-lg rounded absolute'>
                            <nav className='flex flex-col'>
                              {user?.role === ROLE.ADMIN && (
                                <Link to={"/admin-panel/all-products"} className='whitespace-nowrap font-semibold p-2 hover:bg-amber-500 hover:text-white rounded' onClick={() => {
                                  handleMenuOptionClick();
                                  toggleMobileMenu();
                                }}>
                                  Admin Panel
                                </Link>
                              )}
                              <Link to={"/user-Order"} className='whitespace-nowrap font-semibold p-2 hover:bg-amber-500 hover:text-white rounded' onClick={() => {
                                handleMenuOptionClick();
                                toggleMobileMenu();
                              }}>
                                Orders
                              </Link>
                              <button onClick={() => {
                                handleLogout();
                                handleMenuOptionClick();
                                toggleMobileMenu();
                              }} className='whitespace-nowrap font-semibold p-2 hover:bg-amber-500 hover:text-white rounded text-left'>
                                Logout
                              </button>
                            </nav>
                          </div>
                        )
                      }
                    </div>
                  </div>
                ) : null
              }

              {
                user?._id && (
                  <Link to={"/cart"} onClick={() => {
                    handleMenuOptionClick();
                    toggleMobileMenu();
                  }} className='text-2xl relative'>
                    <span><FaShoppingCart /></span>
                    <div className='bg-gray-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                      <p className='text-sm font-bold'>{context?.cartProductCount}</p>
                    </div>
                  </Link>
                )
              }
            </div>

            <div className='w-full'>
              {
                user?._id ? (
                  <button onClick={() => {
                    handleLogout();
                    handleMenuOptionClick();
                    toggleMobileMenu();
                  }} className='w-full py-2 text-lg font-bold rounded-lg text-white bg-gray-900 hover:bg-gray-700'>
                    Logout
                  </button>
                ) : (
                  <div className='flex flex-col gap-4 w-full'>
                    <Link to={"/login"} onClick={toggleMobileMenu} className='w-full text-center text-lg font-bold py-2 rounded-lg text-gray-900 hover:text-gray-700 bg-white border border-gray-900'>
                      Login
                    </Link>
                    <Link to={"/sign-up"} onClick={toggleMobileMenu} className='w-full text-center text-lg font-bold py-2 rounded-lg text-white bg-gray-900 hover:bg-gray-700'>
                      Signup
                    </Link>
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </header>
  );
};

export default Header;
