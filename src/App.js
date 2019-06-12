import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import "./App.css";

var style = {
  input: {
    padding: "12px 20px",
    marginLeft: "20px",
    display: "inline-block",
    border: "1px solid #ccc",
    borderRadius: " 4px",
    boxSizing: "border-box"
  }
};
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      banks: JSON.parse(localStorage.getItem("banks")) || [],
      search: "",
      selCity: "Mumbai",
      city: ["Mumbai", "Kolkata", "Pune", "Bangalore", "Hyderabad", "Chennai"],
      banksPerPage: 5,
      curPage: 1
    };
  }

  componentDidMount() {
    if (this.state.banks.length == 0) this.fetchbankList();
  }

  handleChangeCity = event => {
    this.setState({ selCity: event.target.value });
  };

  fetchbankList() {
    fetch("https://vast-shore-74260.herokuapp.com/banks?city=MUMBAI")
      .then(results => {
        return results.json();
      })
      .then(data => {
        data.map(bank => {
          bank.favorite = false;
          return bank;
        });
        this.setState({ banks: data }, () => {
          localStorage.setItem("banks", JSON.stringify(this.state.banks));
        });
      });
  }

  handleBankClicked = bank => {
    this.props.history.push({
      pathname: `banks/${bank.bank_id}`,
      state: { bankDetails: bank }
    });
  };

  handleFavorite = (event, SelBank) => {
    let banks = this.state.banks;
    let index = banks.findIndex(bank => SelBank.ifsc == bank.ifsc);
    banks[index].favorite = !banks[index].favorite;
    this.setState({ bank: banks }, () => {
      localStorage.setItem("banks", JSON.stringify(this.state.banks));
    });
  };

  handleSearch = event => {
    this.setState({ search: event.target.value.toUpperCase() });
  };

  handleNext = () => {
    let currentPage = this.state.curPage;
    if (currentPage * this.state.banksPerPage <= this.state.banks.length)
      this.setState({ curPage: currentPage + 1 });
  };

  handlePrev = () => {
    let currentPage = this.state.curPage;
    if (currentPage > 1) this.setState({ curPage: currentPage - 1 });
  };

  handleBanksPerPage = event => {
    if (event.target.value >= 0)
      this.setState({ banksPerPage: event.target.value });
  };

  render() {
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
            Bank Branches
          </Typography>
          <select
            style={style.input}
            value={this.state.selCity}
            onChange={this.handleChangeCity}
          >
            {this.state.city.map(item => {
              return <option value={item}>{item}</option>;
            })}
          </select>
          <input
            type="number"
            name="b"
            value={this.state.banksPerPage}
            onChange={this.handleBanksPerPage}
            style={style.input}
            placeholder="Enter Banks Per Page"
          />
          <div style={{ marginRight: "20px", float: "right" }}>
            <input
              type="text"
              name="a"
              value={this.state.search}
              onChange={this.handleSearch}
              style={style.input}
            />
          </div>
          <br />
          <br />
          <div>
            {this.state.banks
              .filter(bank => bank.city == this.state.selCity.toUpperCase())
              .filter(bank => {
                let search = this.state.search;
                let returnVal = false;
                Object.keys(bank).forEach(function(key) {
                  if (
                    bank[key]
                      .toString()
                      .toUpperCase()
                      .indexOf(search) !== -1
                  )
                    returnVal = true;
                });
                return returnVal;
              })
              .filter(
                (bank, index) =>
                  index >= (this.state.curPage - 1) * this.state.banksPerPage &&
                  index < this.state.curPage * this.state.banksPerPage
              )
              .map(bank => {
                return (
                  <div
                    style={{
                      cursor: "pointer",
                      fontWeight: "700",
                      padding: "5px"
                    }}
                    key={bank.ifsc}
                  >
                    <span onClick={() => this.handleBankClicked(bank)}>
                      {bank.bank_name} ( {bank.address} )
                    </span>
                    <span
                      style={{ float: "right" }}
                      onClick={event => {
                        this.handleFavorite(event, bank);
                      }}
                    >
                      <i class="material-icons">
                        {bank.favorite ? "favorite" : "favorite_border"}
                      </i>
                    </span>
                  </div>
                );
              })}
          </div>
        </Paper>
        <br />
        <Paper style={{ padding: "20px", textAlign: "center" }}>
          <span style={{ cursor: "pointer" }} onClick={this.handlePrev}>
            <i class="material-icons">chevron_left</i>
          </span>
          <span>{this.state.curPage}</span>
          <span style={{ cursor: "pointer" }} onClick={this.handleNext}>
            <i class="material-icons">chevron_right</i>
          </span>
        </Paper>
      </div>
    );
  }
}

export default App;
