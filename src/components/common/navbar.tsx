import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import {Chip} from "@heroui/chip";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {Button} from "@heroui/react";
import SearchBar from "./SearchBar.tsx";
import {ThemeSwitch} from "./theme-switch.tsx";
import { useCart } from "../../context/CartContext";
import {useAuth} from "../../context/AuthContext";

export const Navbar = () => {
  const { itemCount } = useCart();
  const AuthContext = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthContext.logout();
  }

  const handleCartClick = () => {
    navigate('/cart');
  }

  return (
    <>
      <HeroUINavbar isBlurred={true} maxWidth="full" position="sticky" className="fixed top-2  left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-98% rounded-large bg-opacity-80 brightness-110">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand className="gap-3 max-w-fit">
            <Link
              className="flex justify-start items-center gap-1"
              color="foreground"
              href="/"
            >
              <img alt="logo" className="h-6 w-6 mx-1" src="/logo-dark.svg" />
              <p className=" text-inherit font-extrabold mr-2">MUSIC LANE</p>
            </Link>
          </NavbarBrand>
            <NavbarItem>
                <p className="text-md text-gray-800 font-bold" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
                    Home
                </p>
            </NavbarItem>
            <NavbarItem>
                <p className="text-md text-gray-800 font-bold" onClick={() => navigate('/my-music')} style={{cursor: 'pointer'}}>
                    My Music
                </p>
            </NavbarItem>
            <NavbarItem>
                <p className="text-md text-gray-800 font-bold" onClick={() => navigate('/support')} style={{cursor: 'pointer'}}>
                    Support
                </p>
            </NavbarItem>

        </NavbarContent>
          <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
            <NavbarItem>
                <SearchBar></SearchBar>
            </NavbarItem>
            <NavbarItem>
                <Button
                    onPress={handleCartClick}
                    variant="light"
                    className="relative text-indigo-950 hover:bg-indigo-100 hover:text-indigo-950 dark:hover:bg-indigo-900 dark:hover:text-indigo-50 rounded-lg"
                    size="md"
                    startContent={<FiShoppingCart size={20} />}
                >
                    Cart
                    {itemCount > 0 && (
                        <Chip
                            size="sm"
                            color="danger"
                            variant="solid"
                            className="absolute -top-1 -right-1 min-w-5 h-5 text-xs"
                        >
                            {itemCount}
                        </Chip>
                    )}
                </Button>
            </NavbarItem>
              <NavbarItem>
                  <Button
                      color="primary"
                      variant="light"
                      className="text-indigo-950 hover:bg-indigo-100 hover:text-indigo-950 dark:hover:bg-indigo-900 dark:hover:text-indigo-50 rounded-lg bg-indigo-400"
                      size="md"
                        onPress={() => {
                            handleLogout();
                        }}>
                      Logout
                  </Button>
              </NavbarItem>
              <NavbarItem>
                  <ThemeSwitch className="hidden" />
              </NavbarItem>
        </NavbarContent>

      </HeroUINavbar>
    </>
  );
};
