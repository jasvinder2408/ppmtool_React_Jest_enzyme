import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dropdown, Menu } from "semantic-ui-react";

export class RecursiveMenu extends Component {
  render() {
    const { children, textToShow } = this.props;
    return (
      <Dropdown
        key={children.wbMenuId}
        text={textToShow}
        // pointing={children.childMenu ? true : false}
                pointing="left"

        className="link item"
      >
        <Dropdown.Menu>
          {children.map((child) => (
            <Dropdown.Item>{child.userMenuName}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

RecursiveMenu.propTypes = {
  children: PropTypes.array,
  textToShow: PropTypes.string,
};

export const MultiLevelMenuReact = () => (
  <Menu stackable>
    <Menu.Item>
      <Dropdown text="Marvel Comics" pointing className="link item">
        <Dropdown.Menu>
          <Dropdown.Item>
            <Dropdown text="Avengers">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Dropdown text="Tony Stark">
                    <Dropdown.Menu>
                      <Dropdown.Item>Pepper Pott</Dropdown.Item>
                      <Dropdown.Item>Jarvis</Dropdown.Item>
                      <Dropdown.Item>Howard Stark</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown text="Steve Rogers">
                    <Dropdown.Menu>
                      <Dropdown.Item>Bucky Barnes</Dropdown.Item>
                      <Dropdown.Item>Peggy Carter</Dropdown.Item>
                      <Dropdown.Item>Falcon</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
                <Dropdown.Item>Bruce Banner</Dropdown.Item>
                <Dropdown.Item>Thor</Dropdown.Item>
                <Dropdown.Item>Natasha Romanoff</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown text=" Inhumans  ">
              <Dropdown.Menu>
                <Dropdown.Item>Medusa</Dropdown.Item>
                <Dropdown.Item>Maximus</Dropdown.Item>
                <Dropdown.Item>Crystal</Dropdown.Item>
                <Dropdown.Item>Black Bolt</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
    <Menu.Item>
      <Dropdown text="DC Comics" pointing className="link item">
        <Dropdown.Menu>
          <Dropdown.Item>Natasha Romanoff</Dropdown.Item>
          <Dropdown.Item>
            <Dropdown text="Justice League">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Dropdown text="Bruce Wayne">
                    <Dropdown.Menu>
                      <Dropdown.Item>Jocker</Dropdown.Item>
                      <Dropdown.Item>Ben</Dropdown.Item>
                      <Dropdown.Item>Penguin</Dropdown.Item>
                      <Dropdown.Item>Ra's al Ghul</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown text="Clark Kent">
                    <Dropdown.Menu>
                      <Dropdown.Item>Lois Lane</Dropdown.Item>
                      <Dropdown.Item>Zod</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
                <Dropdown.Item>Bary Allen</Dropdown.Item>
                <Dropdown.Item>Diana Prince</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown text="Suicide Squad">
              <Dropdown.Menu>
                <Dropdown.Item>Harley Quinn</Dropdown.Item>
                <Dropdown.Item>Deadshot</Dropdown.Item>
                <Dropdown.Item>Enchantress</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
    <Menu.Item>Ex Dropdown Menu</Menu.Item>
  </Menu>
);
