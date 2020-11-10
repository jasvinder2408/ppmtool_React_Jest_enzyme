import React, { Component } from "react";

import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import { Icon, Label, Menu, Table, Cell, Checkbox } from 'semantic-ui-react'


import withFixedColumns from "react-table-hoc-fixed-columns";

// important: this line must be placed after react-table css import
import "react-table-hoc-fixed-columns/lib/styles.css";
import "../../components/style.css";

import {
  getFirstName,
  getLastName,
  getAge,
  getEmail,
  getStreet,
  getCity,
  // mathsRandomInt,
} from "./FakeData.js";

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class ReactTableHocDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testCheckbox: []
    }
  }
  componentDidMount() {
    this.getData();
    this.setState({
      testCheckbox: [
        { key: "101", flag: true },
        { key: "102", flag: false },
        { key: "103", flag: true }
      ]
    })
  }
  checkboxChangeHandler = (event) => {
    let name = event.target.name;
    console.log(name); // It is giving undefined here
    if (name === "cb1") {
      this.setState({ cb1: !this.state.cb1 });
    }
    if (name === "cb2") {
      this.setState({ cb2: !this.state.cb2 });
    }
  };
  filterArrayElementByEdit = (array, val) => {
    return array.filter((element) => {
      return element.key === val;
    })
  }
  handleChange = (e, data) => {
    console.log('it works')
    let shallowCopyTemp = [...this.state.testCheckbox];
    let ans = this.filterArrayElementByEdit(shallowCopyTemp, data.name)
    ans.key = data.checked
    this.setState({

    })
    // debugger
    //console.log(data.value);
  }
  render() {
    return (
      <div>

        {this.state.testCheckbox.map(item => {
          return (
            <Checkbox name={item.key} value={item.flag} checked={item.flag} onChange={this.handleChange} />
            // onChange={(e, data) => this.handleChange(item.key, data)}
          )

        })}

      </div>

    );
  }
  showCheckbox = () => {
    let ans = this.state.testCheckbox.map((item) => {
      console.log("test" + item.key)
      return (
        <Checkbox />
      )
    })
    return ans;


  }
  getData = () => {
    const data = [];
    for (let i = 0; i < 120; i += 1) {
      // const lastNameCount = mathsRandomInt(1, 3);
      // let lastName = Array.apply(null, Array(lastNameCount)); // eslint-disable-line
      // lastName = lastName.map((_, index) => ({
      //   id: index,
      //   value: getLastName(),
      // }));

      data.push({
        firstName: getFirstName(),
        lastName: getLastName(),
        age: getAge(),
        email: getEmail(),
        proEmail: getEmail(),
        street: getStreet(),
        streetBis: getStreet(),
        city: getCity(),
      });
    }
    return data;
  };

  createHocTable = () => {
    console.log(this.getData());
    return (
      <React.Fragment>
        <div className="container">
          <div className="table">
            <ReactTableFixedColumns
              data={this.getData()}
              getTdProps={() => ({ style: { textAlign: "center" } })}
              filterable
              columns={[
                {
                  Header: "First Name",
                  accessor: "firstName",
                  fixed: "left",
                },
                {
                  Header: "Last Name",
                  accessor: "lastName",
                  fixed: "left",
                },
                {
                  Header: "Age",
                  accessor: "age",
                  fixed: "left",
                },
                {
                  Header: "Email",
                  accessor: "email",
                },
                {
                  Header: "Professional Email",
                  accessor: "proEmail",
                },
                {
                  Header: "Street",
                  accessor: "street",
                  width: 300,
                },
                {
                  Header: "Street bis",
                  accessor: "streetBis",
                  width: 300,
                },
                {
                  Header: "City",
                  accessor: "city",
                },
              ]}
              defaultPageSize={10}
              className="-striped -highlight"
            />
          </div>
        </div>
      </React.Fragment>
    );
  };
}

export default ReactTableHocDemo;
