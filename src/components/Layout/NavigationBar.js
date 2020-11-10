import React from "react";
import { Nav, Navbar, Form, FormControl } from "react-bootstrap";
import _ from "lodash";

import "./NavigationBar.css";
import {
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  Label,
} from "semantic-ui-react";
import { mainMenuData } from "./testMenuData";
import { MultiLevelMenuReact, RecursiveMenu } from "./MenuTrial";

class NavigationBar extends React.Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    console.log("*********")
    var masterMenu = _.map(mainMenuData, function (item) {
      return (
        <Menu.Item key={item.userMenuName}>
          <RecursiveMenu
            children={item.childMenu}
            textToShow={item.userMenuName}
          />
        </Menu.Item>
      );
    });
    return (
      <div class="sidenav">
      <div class="scrollbar" id="ex4">
          <div class="content">
            <div id="menuwrapper">
        {masterMenu}
        </div>
        </div>
        </div>
      </div>
    );
    // return (
    //   <div class="sidenav">
    //     <Menu.Item as="a">
    //       <Icon name="home" />
    //       Home
    //     </Menu.Item>
    //     <Menu.Item as="a">
    //       <Icon name="gamepad" />
    //       Games
    //     </Menu.Item>
    //     <Menu.Item as="a">
    //       <Icon name="camera" />
    //       Channels
    //     </Menu.Item>
    //   </div>
    // );
  }
}

export default NavigationBar;
