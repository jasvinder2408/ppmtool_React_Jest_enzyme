import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import $ from "jquery";

import {
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
  Dropdown,
  ButtonGroup,
  Container,
  Button,
  Divider,
  Form,
  Grid,
} from "semantic-ui-react";
import DropdownButton from "react-bootstrap/DropdownButton";
import SplitButton from "react-bootstrap/SplitButton";

class Landing extends Component {
  componentDidMount() {
    if (this.props.security.validToken) {
      this.props.history.push("/dashboard");
    }
    // debugger;
    this.menuSubmenuPositionRelative();
  }

  menuSubmenuPositionRelative = () => {
    // whenever we hover over a menu item that has a submenu
    $("#menuwrapper ul")
      .children("li")
      .on("mouseover", function () {
        var $menuItem = $(this),
          $submenuWrapper = $("> ul", $menuItem);

        console.log($menuItem, $submenuWrapper);
        // debugger;
        // grab the menu item's position relative to its positioned parent
        var menuItemPos = $menuItem.position();

        // place the submenu in the correct position relevant to the menu item
        $submenuWrapper.css({
          top: menuItemPos.top,
          left: menuItemPos.left + Math.round($menuItem.outerWidth()),
        });
      });
  };
  sideBar = () => {
    return (
      <div>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation="overlay"
            icon="labeled"
            inverted
            vertical
            visible
            width="thin"
          >
            <div className="mb-2">
              {["right"].map((direction) => (
                <DropdownButton
                  as={ButtonGroup}
                  key={direction}
                  id={`dropdown-button-drop-${direction}`}
                  drop={direction}
                  variant="secondary"
                  title={` Drop ${direction} `}
                >
                  <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                  <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                  <Dropdown.Item eventKey="3">
                    Something else here
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                </DropdownButton>
              ))}
            </div>

            <div>
              {["up", "down", "left", "right"].map((direction) => (
                <SplitButton
                  key={direction}
                  id={`dropdown-button-drop-${direction}`}
                  drop={direction}
                  variant="secondary"
                  title={`Drop ${direction}`}
                >
                  <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                  <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                  <Dropdown.Item eventKey="3">
                    Something else here
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                </SplitButton>
              ))}
            </div>

            <Menu.Item as="a">
              <Icon name="home" />
              Home
            </Menu.Item>
            <Menu.Item as="a">
              <Icon name="gamepad" />
              Games
            </Menu.Item>
            <Menu.Item as="a">
              <Icon name="camera" />
              Channels
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher>{this.mainContent()}</Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  };
  mainContent = () => {
    return (
      <div className="light-overlay landing-inner text-dark">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="display-3 mb-4">
                Personal Project Management Tool
              </h1>
              <p className="lead">
                Create your account to join active projects or start your own
              </p>
              <hr />
              <Link className="btn btn-lg btn-primary mr-2" to="/register">
                Sign Up
              </Link>
              <Link className="btn btn-lg btn-secondary mr-2" to="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  sideNavWithMenuSubMenuScrollBar = () => {
    return (
      <div>
        <div class="scrollbar" id="ex4">
          <div class="content">
            <div id="menuwrapper">
              <ul>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Products</a>
                  <ul>
                    <li>
                      <a href="#">Product 1</a>
                      <ul>
                        <li>
                          <a href="#">Sub Product 1</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 2</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 3</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Product 2</a>
                    </li>
                    <li>
                      <a href="#">Product 3</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">About Us</a>
                  <ul>
                    <li>
                      <a href="#">Faqs</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                    <li>
                      <a href="#">Where are we?</a>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="#">Help</a>
                </li>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Products</a>
                  <ul>
                    <li>
                      <a href="#">Product 1</a>
                      <ul>
                        <li>
                          <a href="#">Sub Product 1</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 2</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 3</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Product 2</a>
                    </li>
                    <li>
                      <a href="#">Product 3</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">About Us</a>
                  <ul>
                    <li>
                      <a href="#">Faqs</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                    <li>
                      <a href="#">Where are we?</a>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="#">Help</a>
                </li>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Products</a>
                  <ul>
                    <li>
                      <a href="#">Product 1</a>
                      <ul>
                        <li>
                          <a href="#">Sub Product 1</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 2</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 3</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Product 2</a>
                    </li>
                    <li>
                      <a href="#">Product 3</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">About Us</a>
                  <ul>
                    <li>
                      <a href="#">Faqs</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                    <li>
                      <a href="#">Where are we?</a>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="#">Help</a>
                </li>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Products</a>
                  <ul>
                    <li>
                      <a href="#">Product 1</a>
                      <ul>
                        <li>
                          <a href="#">Sub Product 1</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 2</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 3</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Product 2</a>
                    </li>
                    <li>
                      <a href="#">Product 3</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">About Us</a>
                  <ul>
                    <li>
                      <a href="#">Faqs</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                    <li>
                      <a href="#">Where are we?</a>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="#">Help</a>
                </li>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Products</a>
                  <ul>
                    <li>
                      <a href="#">Product 1</a>
                      <ul>
                        <li>
                          <a href="#">Sub Product 1</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 2</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 3</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Product 2</a>
                    </li>
                    <li>
                      <a href="#">Product 3</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">About Us</a>
                  <ul>
                    <li>
                      <a href="#">Faqs</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                    <li>
                      <a href="#">Where are we?</a>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="#">Help</a>
                </li>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Products</a>
                  <ul>
                    <li>
                      <a href="#">Product 1</a>
                      <ul>
                        <li>
                          <a href="#">Sub Product 1</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 2</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 3</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Product 2</a>
                    </li>
                    <li>
                      <a href="#">Product 3</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">About Us</a>
                  <ul>
                    <li>
                      <a href="#">Faqs</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                    <li>
                      <a href="#">Where are we?</a>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="#">Help</a>
                </li>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">Products</a>
                  <ul>
                    <li>
                      <a href="#">Product 1</a>
                      <ul>
                        <li>
                          <a href="#">Sub Product 1</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 2</a>
                        </li>
                        <li>
                          <a href="#">Sub Product 3</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Product 2</a>
                    </li>
                    <li>
                      <a href="#">Product 3</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">About Us</a>
                  <ul>
                    <li>
                      <a href="#">Faqs</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                    <li>
                      <a href="#">Where are we?</a>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="#">Help</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
  loginform = () => {
    return (
      <Segment placeholder>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column>
            <Form>
              <Form.Input
                icon="user"
                iconPosition="left"
                label="Username"
                placeholder="Username"
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                label="Password"
                type="password"
              />

              <Button content="Login" primary />
            </Form>
          </Grid.Column>

          <Grid.Column verticalAlign="middle">
            <Button content="Sign up" icon="signup" size="big" />
          </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
      </Segment>
    );
  };
  render() {
    return <div>{this.sideNavWithMenuSubMenuScrollBar()}</div>;
    // <div>{this.sideBar()}</div>;
  }
}

Landing.propTypes = {
  security: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  security: state.security,
});

export default connect(mapStateToProps)(Landing);
