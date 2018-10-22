import React, { Component } from "react";
import { AppRegistry, Text, View, StatusBar, Button } from "react-native";
import DrawerNav from "./main/Navigator";
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonText: "blink",
      ifBlink: false,
      showText: true,
      text: "I love blinking"
    };
    this.toggleBlinkState = this.toggleBlinkState.bind(this);
    this.handle;
  }
  toggleBlinkState() {
    if (this.state.buttonText === "blink") {
      this.handle = setInterval(() => {
        this.setState(previousState => {
          return { showText: !previousState.showText };
        });
      }, 1000);
      this.setState({
        buttonText: "Stop blinking"
      });
    } else {
      clearInterval(this.handle);
      this.setState({ buttonText: "blink", showText: true });
    }
  }
  render() {
    let display = this.state.showText ? this.state.text : " ";
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <DrawerNav />
        <StatusBar hidden={true} />
        <Text>{display} </Text>
        <Button onPress={this.toggleBlinkState} title={this.state.buttonText} />
      </View>
    );
  }
}
