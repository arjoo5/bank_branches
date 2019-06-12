import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

class Bank extends React.Component {
  render() {
    const bankDetails = this.props.location.state.bankDetails;
    delete bankDetails.feedback;
    return (
      <div
        style={{
          width: "auto",
          borderRadius: "5px",
          backgroundColor: "#f2f2f2",
          padding: "20px"
        }}
      >
        <Paper>
          <Typography
            variant="h6"
            gutterBottom
            style={{ textAlign: "center", padding: "20px" }}
          >
            Bank Details
          </Typography>
          {Object.keys(bankDetails).map(function(key) {
            return (
              <div key={key} style={{ padding: "20px" }}>
                <span>
                  {" "}
                  {typeof bankDetails[key] === "boolean"
                    ? ""
                    : key + " :  " + bankDetails[key]}
                </span>
              </div>
            );
          })}
        </Paper>
      </div>
    );
  }
}
export default Bank;
