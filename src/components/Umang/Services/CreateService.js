import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { createService } from "../actions/servicesActions";
import { Dropdown, Label, Form, Input } from "semantic-ui-react";
import { getAllServices } from "../actions/servicesActions";

class CreateService extends React.Component {
  constructor() {
    super();
    this.state = {
      language: "",
      categoryId: "",
      subCategoryId: "",
      serviceName: "",
      shortDescription: "",
      aliases: "",
      imageUrl: "",
      websiteUrl: "",
      contact: "",
      responseMsg: "",
      serviceList: "",
      categoryDtoList: [],

      errors: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    // this.setState({
    //   serviceList: this.state.serviceList,
    // });
    this.props.getAllServices();
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    // console.log(e.target.value);
  }
  handleOnChange = (e, data) => {
    console.log(data.value);
    this.setState({
      [data.name]: data.value,
    });
  };
  fetchLanguageList() {
    const languageOptions = [
      { key: "en", value: "en", flag: "en", text: "English" },
      { key: "hi", value: "hi", flag: "hi", text: "Hindi" },
      { key: "pa", value: "pa", flag: "pa", text: "Punjabi" },
    ];
    return languageOptions;
  }
  fetchDepartmentIdAndName() {
    const { serviceMasterList } = this.props.serviceList;
    if (serviceMasterList != undefined) {
      let serviceIdAndNameList = [];
      serviceMasterList.map((item) => {
        serviceIdAndNameList.push({
          key: item.serviceId,
          value: item.serviceId,
          text: item.serviceName,
        });
      });
      serviceIdAndNameList.push({
        key: -1,
        value: -1,
        text: "No Department Selected",
      });
      return serviceIdAndNameList;
    }
  }
  fetchCategoryList() {
    const { categoryDtoList } = this.props.serviceList;

    if (categoryDtoList != undefined) {
      let myCat = [];
      categoryDtoList.map((item) => {
        myCat.push({
          key: item.categoryId,
          value: item.categoryId,
          flag: item.categoryId,
          text: item.categoryName,
        });
      });
      //  console.log(categoryDtoList);
      return myCat;
    }
  }
  onSubmit(e) {
    e.preventDefault();
    // console.log(e.target.name);
    const newService = {
      serviceName: this.state.serviceName,
      language: this.state.language,
      categoryId: this.state.categoryId,
      subCategoryId: null,
    };
    this.props.createService(newService, this.props.history);
  }
  // addInput = () => {
  //   debugger;
  //   var countBox = 1;
  //   var boxName = 0;
  //   var boxName = "textBox" + countBox;
  //   document.getElementById("responce").innerHTML +=
  //     '<br/><input type="text" id="' +
  //     boxName +
  //     '" value="' +
  //     boxName +
  //     '" "  /><br/>';
  //   countBox += 1;
  // };
  render() {
    const { errors } = this.state;

    return (
      <div>
        <div className="project">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h5 className="display-4 text-center">
                  Create New Department(i.e. Service)
                </h5>
                <span id="responce"></span>

                <hr />

                <Form>
                  <Form.group>
                    <Form.Field
                      id="form-input-control-first-name"
                      control={Input}
                      label="First name"
                      placeholder="First name"
                    />
                    <Form.Field
                      id="form-input-control-last-name"
                      control={Input}
                      label="Last name"
                      placeholder="Last name"
                    />
                  </Form.group>
                </Form>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <Label>Please select department</Label>

                    <Dropdown
                      placeholder="Select Language"
                      fluid
                      search
                      selection
                      name=""
                      onChange={this.handleOnChange}
                      options={this.fetchDepartmentIdAndName()}
                      defaultValue={-1}
                    />
                    {errors.language && (
                      <div className="invalid-feedback">{errors.language}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className={classnames("form-control form-control-lg", {
                        "is-invalid": errors.serviceName,
                      })}
                      placeholder="Service Name"
                      name="serviceName"
                      value={this.state.serviceName}
                      onChange={this.onChange}
                    />
                    {errors.serviceName && (
                      <div className="invalid-feedback">
                        {errors.serviceName}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <Dropdown
                      placeholder="Select Language"
                      fluid
                      search
                      selection
                      name="language"
                      onChange={this.handleOnChange}
                      options={this.fetchLanguageList()}
                    />
                    {errors.language && (
                      <div className="invalid-feedback">{errors.language}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <Dropdown
                      placeholder="category"
                      fluid
                      search
                      selection
                      name="categoryId"
                      onChange={this.handleOnChange}
                      options={this.fetchCategoryList()}
                    />
                    {errors.language && (
                      <div className="invalid-feedback">{errors.category}</div>
                    )}
                  </div>

                  <input
                    type="submit"
                    className="btn btn-primary btn-block mt-4"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  serviceList: state.service.services,
});
export default connect(mapStateToProps, { createService, getAllServices })(
  CreateService
);
