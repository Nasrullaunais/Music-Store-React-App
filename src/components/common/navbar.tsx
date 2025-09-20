import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import {Tabs, Tab} from "@heroui/tabs";
import {Chip} from "@heroui/chip";
import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

import {Button} from "@heroui/react";
import SearchBar from "./SearchBar.tsx";
import {ThemeSwitch} from "./theme-switch.tsx";
import { useCart } from "../../context/CartContext";
import CartDrawer from "./CartDrawer";

export const Navbar = () => {
  const { totalAmount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <HeroUINavbar isBlurred={true} maxWidth="full" position="sticky" className="fixed top-2  left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-98% rounded-large bg-opacity-80 brightness-110">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand className="gap-3 max-w-fit">
            <Link
              className="flex justify-start items-center gap-1"
              color="foreground"
              href="/public"
            >
              <img alt="logo" className="h-6 w-6 mx-1" src="/logo-dark.svg" />
              <p className=" text-inherit font-extrabold">MUSIC LANE</p>
            </Link>
          </NavbarBrand>
        </NavbarContent>
          <NavbarContent className=" basis-1 pl-4" justify="center">
              <Tabs
                  aria-label="Options"
                  classNames={{
                      tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                      cursor: "w-full bg-[#22d3ee]",
                      tab: "max-w-fit px-0 h-12",
                      tabContent: "group-data-[selected=true]:text-[#06b6d4]",
                  }}
                  color="primary"
                  variant="underlined"
              >
                  <Tab
                      key="photos"
                      title={
                          <div className="flex items-center space-x-2">
                              <span>Photos</span>
                              <Chip size="sm" variant="faded">
                                  9
                              </Chip>
                          </div>
                      }
                  />
                  <Tab
                      key="music"
                      title={
                          <div className="flex items-center space-x-2">
                              <span>Music</span>
                              <Chip size="sm" variant="faded">
                                  3
                              </Chip>
                          </div>
                      }
                  />
                  <Tab
                      key="videos"
                      title={
                          <div className="flex items-center space-x-2">
                              <span>Videos</span>
                              <Chip size="sm" variant="faded">
                                  1
                              </Chip>
                          </div>
                      }
                  />
              </Tabs>
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
                    onPress={() => setIsCartOpen(true)}
                    variant="light"
                    className="relative text-indigo-950 hover:bg-indigo-100 hover:text-indigo-950 dark:hover:bg-indigo-900 dark:hover:text-indigo-50 rounded-lg"
                    size="md"
                    startContent={<FiShoppingCart size={20} />}
                >
                    Cart
                    {totalAmount > 0 && (
                        <Chip
                            size="sm"
                            color="danger"
                            variant="solid"
                            className="absolute -top-1 -right-1 min-w-5 h-5 text-xs"
                        >
                            {totalAmount}
                        </Chip>
                    )}
                </Button>
            </NavbarItem>
              <NavbarItem>
                  <Button
                      color="primary"
                      variant="light"
                      className="text-indigo-950 hover:bg-indigo-100 hover:text-indigo-950 dark:hover:bg-indigo-900 dark:hover:text-indigo-50 rounded-lg bg-indigo-400"
                      size="md">
                      Logout
                  </Button>
              </NavbarItem>
              <NavbarItem>
                  <ThemeSwitch className="hidden" />
              </NavbarItem>
        </NavbarContent>

      </HeroUINavbar>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};
