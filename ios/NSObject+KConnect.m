//
//  NSObject+KConnect.m
//  ios
//
//  Created by 王聪 on 2019/8/28.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "NSObject+KConnect.h"

@interface KConnect()
@property (nonatomic, strong)  RCTPromiseResolveBlock resolve; // 定义promise 成功返回对象

@end

@implementation KConnect
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(Connect); // 指定对外开放的模块

RCT_EXPORT_METHOD(toIOS:(NSString *)name){
  NSLog(@"接收传过来的NSString+NSString: %@", name);
}

RCT_EXPORT_METHOD(toIOScb:(NSString *)name callback:(RCTResponseSenderBlock)callback){
  NSArray *events = @[@"测试",@"demo",name]; // 回调数据
  callback(@[events]);
}

RCT_EXPORT_METHOD(toIOSPromise:(NSString *)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject ){
  if(name){
    resolve(@"success");
  }
}

// ios 定义常量
- (NSDictionary *)constantsToExport{
  return @{ @"ValueOne1": @"测试1" ,@"ValueOne2": @"测试2" };
}

RCT_EXPORT_METHOD(startIOS:(NSString *)name){
  [self ToJS:@"name" values:name];
}

- (void)ToJS:(NSString *)name values:(NSString *)values{
  [self.bridge.eventDispatcher sendAppEventWithName:@"iosToRn"
                                               body:@{name: values}];
}

@end
