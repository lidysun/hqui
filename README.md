# hqui
an awsome web ui jquery frame

## bugs
IE7下测试栅格列元素会因为百分比尺寸而四舍五入(1002*0.3=300.06,而IE7则直接设为301px)，导致在某些屏幕尺寸下（比如1113px）会异常换行；
