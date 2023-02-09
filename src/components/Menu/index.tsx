import MenuComponent, { MenuProps } from "./menu";
import MenuItemComponent from "./menuItem";

interface MenuInterface {
  (props: MenuProps): JSX.Element;
  Item: typeof MenuItemComponent;
}

const Menu = MenuComponent as MenuInterface;
Menu.Item = MenuItemComponent;

export default Menu;