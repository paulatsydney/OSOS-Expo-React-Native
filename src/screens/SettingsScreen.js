import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { loadSettings, saveSettings } from "../storage/settingsStorage";
import axios from "axios";

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = { name: "", customerRef: "", result: "" };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleRefChange = this.handleRefChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSendToSAP = this.handleSendToSAP.bind(this);
  }

  async componentDidMount() {
    const initialState = await loadSettings();

    this.setState(initialState);
  }

  handleNameChange(name) {
    this.setState({ name });
  }

  handleRefChange(customerRef) {
    this.setState({ customerRef });
  }

  handleSubmit() {
    this.setState({
      result: "",
    });
    saveSettings(this.state);
  }

  async handleSendToSAP() {
    console.log("start posting customer name: " + this.state.name);
    console.log("start posting customer ref: " + this.state.customerRef);
    let response = await axios.post(
      "http://10.0.2.2:5000/sap/create",
      {
        name: this.state.name,
        customerRef: this.state.customerRef,
      },
      {
        headers: {
          Authorization: "Basic V0FOR1BBVTpJbmZ5QDEyMw==",
        },
      }
    );
    this.setState({
      result:
        "Sales order created, ID: " + response.data.salesOrder.d.SalesOrder,
    });
    console.log("Sales order created");
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Sales Order Creation</Text>
        </View>
        <ScrollView>
          <View style={styles.inputContainer}>
            <Text style={styles.labelText}>Customer Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Your name"
              maxLength={20}
              onBlur={Keyboard.dismiss}
              value={this.state.name}
              onChangeText={this.handleNameChange}
            />
            <Text style={styles.labelText}>Input Field Sample</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Sample input for testing"
              maxLength={20}
              onBlur={Keyboard.dismiss}
              value={this.state.customerRef}
              onChangeText={this.handleRefChange}
            />
          </View>
          <Text style={styles.labelText}>{this.state.result}</Text>
        </ScrollView>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={this.handleSubmit}
          >
            <Text style={styles.saveButtonText}>Save Locally</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={this.handleSendToSAP}
          >
            <Text style={styles.saveButtonText}>Submit to SAP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: "#F5FCFF",
  },
  header: {
    fontSize: 25,
    textAlign: "center",
    margin: 10,
    fontWeight: "bold",
  },
  inputContainer: {
    paddingTop: 15,
  },
  textInput: {
    borderColor: "#CCCCCC",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 20,
    paddingRight: 20,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 15,
    margin: 5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
  },
  labelText: {
    color: "black",
    fontSize: 20,
    textAlign: "left",
    margin: 10,
  },
});
