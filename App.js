/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
  NativeModules,
  NativeAppEventEmitter
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

class App extends React.Component {
  // 开始监听ios 端传过来的信息
  componentDidMount(){
    this.obj =  NativeAppEventEmitter.addListener(
        'iosToRn',
        (item) =>{ 
            console.log(item,'item')
        }
    );
  }
  componentWillUnmount(){
      this.obj && this.obj.remove()
  }
  
  
  render(){
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            <Button title="直接通信" onPress={this.toIos}/>
            <Button title="通信到ios callback返回到 rn" onPress={this.toIosCb}/>
            <Button title="通信到ios promise 返回到 rn" onPress={this.toIosPromise}/>

            <Button title="获取ios定义的常量" onPress={this.getIOSConst}/>

            <Button title="触发 ios端 通信到rn端" onPress={this.toReactnative}/>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
  // 向ios端直接通信  
  toIos = () =>{
     NativeModules.Connect.toIOS("name111")
  }

  // 通信到ios端 同步返回信息  
  toIosCb = () =>{
    NativeModules.Connect.toIOScb('myGirl',this.func)
  }
  func = (res) =>{
    console.log(res,'res')
  }

  // 通过异步操作  
  toIosPromise = async() =>{
    const res = await NativeModules.Connect.toIOSPromise('haha')
    console.log(res,'res2')
  }

    // 直接获取ios端 定义的常量  
  getIOSConst = () =>{
    console.log(NativeModules.Connect.ValueOne1)
  }

  // 触发到 ios端 然后 ios通信到rn
  toReactnative = () =>{
    NativeModules.Connect.startIOS("name111")
  }

};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});

export default App;
