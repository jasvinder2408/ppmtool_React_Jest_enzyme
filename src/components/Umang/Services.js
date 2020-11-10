import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllServices } from "./actions/servicesActions";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import { Button } from "semantic-ui-react";
import CreateServiceButton from "./CreateServiceButton";
import CreateUpdateButton from "./CreateUpdateButton";

import withFixedColumns from "react-table-hoc-fixed-columns";

// important: this line must be placed after react-table css import
import "react-table-hoc-fixed-columns/lib/styles.css";
import "../../components/style.css";

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class Services extends Component {
  componentDidMount() {
    console.log("Services : componentDidMount");
    this.props.getAllServices();
  }

  render() {
    const { serviceMasterList, categoryDtoList } = this.props.serviceList;
    console.log(serviceMasterList);
    return (
      <div>
        <div>
          <CreateServiceButton />
        </div>

        <div>{this.createHocTable(serviceMasterList)}</div>
        <div>{this.showCategoryHocTable(categoryDtoList)}</div>
      </div>
    );
  }
  createHocTable = (serviceMasterList) => {
    return (
      <div className="container">
        <div>
          <div className="table">
            <ReactTableFixedColumns
              data={serviceMasterList}
              getTdProps={() => ({ style: { textAlign: "center" } })}
              filterable
              columns={[
                {
                  Header: "Fixed Group",
                  fixed: "left",
                  columns: [
                    {
                      Header: "Update",
                      filterable: false,
                      sortable: false,
                      resizable: false,

                      width: 100,
                      maxWidth: 100,
                      minWidth: 100,
                      Cell: (props) => {
                        return <CreateUpdateButton {...props} />;
                      },
                    },

                    {
                      Header: "Language",
                      accessor: "language",
                    },
                    {
                      Header: "Service Id",
                      accessor: "serviceId",
                    },
                    {
                      Header: "Service Name",
                      accessor: "serviceName",
                    },
                  ],
                },
                {
                  Header: "Other group",
                  width: 300,
                  columns: [
                    {
                      Header: "Long Description",
                      accessor: "longDescription",
                      width: 300,
                    },
                    {
                      Header: "Short Description",
                      accessor: "shortDescription  ",
                      width: 300,
                    },
                    {
                      Header: "Alises",
                      accessor: "alises",
                      width: 300,
                    },
                    {
                      Header: "Status",
                      accessor: "status",
                      width: 300,
                    },
                  ],
                },
              ]}
              defaultPageSize={10}
              className="-striped -highlight"
            />
          </div>
        </div>
      </div>
    );
  };

  showCategoryHocTable = (categoryMasterList) => {
    return (
      <div className="container">
        <div>
          <div className="table">
            <ReactTableFixedColumns
              data={categoryMasterList}
              getTdProps={() => ({ style: { textAlign: "center" } })}
              filterable
              columns={[
                {
                  Header: "Fixed Group",
                  fixed: "left",
                  columns: [
                    {
                      Header: "Update",
                      filterable: false,
                      sortable: false,
                      resizable: false,

                      width: 100,
                      maxWidth: 100,
                      minWidth: 100,
                      Cell: (props) => {
                        return <CreateUpdateButton {...props} />;
                      },
                    },

                    {
                      Header: "Language",
                      accessor: "language",
                    },
                    {
                      Header: "Category Id",
                      accessor: "categoryId",
                    },
                    {
                      Header: "Category Name",
                      accessor: "categoryName",
                    },
                  ],
                },
                {
                  Header: "Other group",
                  width: 300,
                  columns: [
                    {
                      Header: "Long Description",
                      accessor: "longDescription",
                      width: 300,
                    },
                    {
                      Header: "Short Description",
                      accessor: "shortDescription  ",
                      width: 300,
                    },
                    {
                      Header: "Alises",
                      accessor: "alises",
                      width: 300,
                    },
                    {
                      Header: "Status",
                      accessor: "status",
                      width: 300,
                    },
                  ],
                },
              ]}
              defaultPageSize={10}
              className="-striped -highlight"
            />
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => ({
  serviceList: state.service.services,
});

export default connect(mapStateToProps, {
  getAllServices,
})(Services);
