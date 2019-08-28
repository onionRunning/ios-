- 关键词: 
> 本文讲解 react-native 如何与 ios端进行通信
---

### react-native 与 ios 端通信
方式分为5种情况
- rn 端直接通知到ios端
- rn 端通信到ios端 ，ios端通过callback 返回到rn端 同步方式
- rn 端通信到ios端 ，ios端返回promise对象到rn端   异步方式 (使用场景最多)
- rn 端直接获取 ios端 常量
- ios 端通知到 rn 端

> react-native  ----  ios(object-c)

---
> 默认环境已经装好 ， 并且装有X-code 和 pod 安装完成
- react-native init ios_app
- cd ios_app && cd ios && pod install


#### 展示 5种通信方式

```Object-c

// KConnect.h
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface KConnect : NSObject<RCTBridgeModule>

@end

// KConnect.m

#import "KConnect.h"

@implementation KConnect
RCT_EXPORT_MODULE(Connect); // 指定对外开放的模块

// 1. reactnative 直接通知道到ios端
RCT_EXPORT_METHOD(toIOS:(NSString *)name){ // 对rn端 开放的方法
    NSLog(@"接收传过来的NSString+NSString: %@", name);
}

// 2. 通过第二个参数传入callback 并且执行 返回参数
RCT_EXPORT_METHOD(toIOScb:(NSString *)name callback:(RCTResponseSenderBlock)callback){
  NSArray *events = @[@"测试",@"demo",name]; // 回调数据
  callback(@[events]);
}

// 3. 通过异步方式返回结果 > 可以将resolve 进行储存 然后在其他函数内进行相应的返回结果
RCT_EXPORT_METHOD(toIOSPromise:(NSString *)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject ){
  if(name){
    resolve(@"success");
  }
}

// ios 定义常量
- (NSDictionary *)constantsToExport{
  return @{ @"ValueOne1": @"测试1" ,@"ValueOne2": @"测试2" };
}

// rn 触发 ios的事件
RCT_EXPORT_METHOD(startIOS:(NSString *)name){
  [self ToJS:@"name" values:name];
}

// ios 端向 rn 端发送信息
- (void)ToJS:(NSString *)name values:(NSString *)values{
  [self.bridge.eventDispatcher sendAppEventWithName:@"iosToRn"
                                               body:@{name: values}];
}

@end

```

react-native 端
```js
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
  componentWillUnmount(){ // 组件销毁时移除
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

```