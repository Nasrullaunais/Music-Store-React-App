import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import {
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from "@heroui/react";
import { FiShoppingCart, FiUser, FiLogIn, FiLogOut, FiSettings } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import CartOverlay from "./CartOverlay.tsx";

import SearchBar from "./SearchBar.tsx";
import { ThemeSwitch } from "./theme-switch.tsx";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

interface NavItemProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ isActive, onClick, children, className = "" }) => (
  <div
    onClick={onClick}
    className={`
      relative px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 font-medium text-sm
      ${isActive 
        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'
      }
      ${className}
    `}
  >
    {children}
    {isActive && (
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
    )}
  </div>
);

export const Navbar = () => {
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Navigation items based on user role and authentication
  const getNavigationItems = () => {
    const baseItems = [
      { path: '/', label: 'Home', show: true },
    ];

    if (isAuthenticated) {
      const items = [
        ...baseItems,
        { path: '/my-music', label: 'My Music', show: user?.role === 'CUSTOMER' },
        { path: '/artist', label: 'Artist Dashboard', show: user?.role === 'ARTIST' },
        { path: '/staff', label: 'Staff Dashboard', show: user?.role === 'STAFF' || user?.role === 'ADMIN' },
        { path: '/support', label: 'Support', show: true },
      ];
      return items.filter(item => item.show);
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <HeroUINavbar
      isBlurred={!isCartOpen}
      maxWidth="full"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="fixed top-0 mt-3 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-1rem)] lg:w-[calc(100%-2rem)] max-w-7xl rounded-xl bg-white/90 dark:bg-gray-900/90 border border-indigo-200/50 dark:border-indigo-800/50 shadow"
      classNames={{
        wrapper: "px-3 sm:px-4",
        brand: "flex-grow-0",
        content: "gap-3",
      }}
    >
      {/* Mobile Menu Toggle */}
      <NavbarContent className="lg:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-indigo-600 dark:text-indigo-400"
        />
      </NavbarContent>

      {/* Brand */}
      <NavbarBrand className="flex-grow mr-6">
        <div
          className="flex justify-start items-center gap-2 cursor-pointer"
          onClick={() => handleNavigation('/')}
        >
          <img alt="logo" className="h-7 w-7" src="/logo-dark.svg" />
          <p className="font-bold text-base bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            MUSIC LANE
          </p>
        </div>
      </NavbarBrand>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden lg:flex gap-1" justify="start">
        {navigationItems.map((item) => (
          <NavbarItem key={item.path}>
            <NavItem
              isActive={isActivePath(item.path)}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </NavItem>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Search Bar - Hidden on mobile, shown on tablet+ */}
      <NavbarContent className="hidden md:flex flex-1" justify="center">
        <NavbarItem className="w-full max-w-md">
          <SearchBar />
        </NavbarItem>
      </NavbarContent>

      {/* Right Side Actions */}
      <NavbarContent className="gap-2" justify="end">
        {/* Theme Switch */}
        <NavbarItem className="hidden sm:flex">
          <ThemeSwitch />
        </NavbarItem>

        {/* Cart (for customers only) */}
        {isAuthenticated && user?.role === 'CUSTOMER' && (
          <NavbarItem className="overflow-visible">
            <Button
              onPress={handleCartClick}
              variant="light"
              isIconOnly
              className="relative overflow-visible text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors p-0.5"
              size="sm"
            >
              <FiShoppingCart size={16} />
              {itemCount > 0 && (
                <Chip
                  size="sm"
                  color="danger"
                  variant="solid"
                  className="absolute -top-0.5 -right-0.5 min-w-5 h-4 text-[10px] flex items-center justify-center rounded-full px-1"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </Chip>
              )}
            </Button>
          </NavbarItem>
        )}

        {/* User Actions */}
        {isAuthenticated ? (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="p-1 h-auto min-w-unit-10"
                >
                  <Avatar
                    size="sm"
                    name={user?.username || 'User'}
                    className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                    fallback={<FiUser size={18} />}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu" className="min-w-48">
                <DropdownItem
                  key="profile"
                  startContent={<FiUser size={16} />}
                  className="text-indigo-950 dark:text-indigo-50"
                  textValue={`${user?.username ?? 'User'} ${user?.role ?? ''}`}
                >
                  <div>
                    <p className="font-semibold">{user?.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  startContent={<FiSettings size={16} />}
                  onPress={() => handleNavigation('/profile')}
                >
                  Profile Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<FiLogOut size={16} />}
                  onPress={handleLogout}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button
              color="primary"
              variant="flat"
              onPress={handleLogin}
              startContent={<FiLogIn size={16} />}
              className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 font-medium"
              size="sm"
            >
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md pt-6">
        {/* Mobile Search */}
        <NavbarMenuItem className="mb-4">
          <SearchBar />
        </NavbarMenuItem>

        {/* Mobile Navigation Items */}
        {navigationItems.map((item) => (
          <NavbarMenuItem key={item.path}>
            <NavItem
              isActive={isActivePath(item.path)}
              onClick={() => handleNavigation(item.path)}
              className="w-full justify-start text-base py-3"
            >
              {item.label}
            </NavItem>
          </NavbarMenuItem>
        ))}

        {/* Mobile User Actions */}
        {isAuthenticated ? (
          <>
            <NavbarMenuItem className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar
                  size="sm"
                  name={user?.username || 'User'}
                  className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                  fallback={<FiUser size={16} />}
                />
                <div>
                  <p className="font-semibold text-indigo-950 dark:text-indigo-50">{user?.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              </div>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                variant="light"
                onPress={() => handleNavigation('/profile')}
                startContent={<FiSettings size={16} />}
                className="w-full justify-start text-indigo-950 dark:text-indigo-50"
              >
                Profile Settings
              </Button>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                color="danger"
                variant="light"
                onPress={handleLogout}
                startContent={<FiLogOut size={16} />}
                className="w-full justify-start"
              >
                Logout
              </Button>
            </NavbarMenuItem>
          </>
        ) : (
          <NavbarMenuItem className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800">
            <Button
              color="primary"
              onPress={handleLogin}
              startContent={<FiLogIn size={16} />}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Login
            </Button>
          </NavbarMenuItem>
        )}

        {/* Mobile Theme Switch */}
        <NavbarMenuItem className="mt-4">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-indigo-950 dark:text-indigo-50 font-medium">Theme</span>
            <ThemeSwitch />
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
      {/* Cart Overlay (renders above everything when open) */}
      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </HeroUINavbar>
  );
};
