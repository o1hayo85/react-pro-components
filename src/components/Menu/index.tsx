import MenuComponent, { MenuProps } from "./menu";
import MenuItemComponent from "./menuItem";
import SubMenuComponent from "./subMenu";

interface MenuInterface {
  (props: MenuProps): JSX.Element;
  SubMenu: typeof SubMenuComponent;
  Item: typeof MenuItemComponent;
}

const Menu = MenuComponent as MenuInterface;
Menu.Item = MenuItemComponent;
Menu.SubMenu = SubMenuComponent;

export * from './subMenu';
export * from './menuItem';
export * from './menu';
export default Menu;
