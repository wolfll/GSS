var map = new BMap.Map("allmap");
// 创建地图实例
var point = new BMap.Point(116.404, 39.915);
// 创建点坐标
//map.centerAndZoom(point, 15);
map.centerAndZoom("哈尔滨", 19);

// 初始化地图，设置中心点坐标和地图级别
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
map.disableDoubleClickZoom();//禁用双击放大
map.enableKeyboard();//启用键盘控制
map.addControl(new BMap.NavigationControl());//方向 比例
map.addControl(new BMap.ScaleControl());//比例尺
//map.addControl(new BMap.GeolocationControl());//定位按钮
var p={anchor:BMAP_ANCHOR_TOP_RIGHT,isOpen:true}//位置 右上  默认打开
map.addControl(new BMap.OverviewMapControl(p));//小地图
//map.addControl(new BMap.MapTypeControl());//地图类型
map.setCurrentCity("哈尔滨"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
addAllOverLay_();
var marker = new BMap.Marker(point);        // 创建标注
map.addOverlay(marker);                     // 将标注添加到地图中
marker.addEventListener("click", function(){
    alert("您点击了标注");
});
///////////////////////////////////////////////////////////////////////////////
var addMarkerEvent=0;//////////////////////////////////////////标记按钮点击状态
function switchAddMarker_() {////////////////////////////////切换标记按钮点击状态
    if(addMarkerEvent==0){
        console.log('addEventListener');//打印服务端返回的数据(调试用)
        addEventListener_();
    }else{
        console.log('disaddEventListener');//打印服务端返回的数据(调试用)
        disaddmarker_();
    }
}
var event_a= function(e) {                                  ////////添加标注点
    var allOverlay = map.getOverlays();
    for (var i = 0; i < allOverlay.length; i++) {
        if (allOverlay[i].toString() == '[object Marker]'){
            if (allOverlay[i].getTitle() == "新建") {
                map.removeOverlay(allOverlay[i]);
            }
        }
    }
    var marker = new BMap.Marker(e.point);  // 创建标注
    marker.setTitle("新建");
    map.addOverlay(marker);               // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

    var sContent =
        "<div style='margin-top:10px; height: 500px;width: 300px;border:1px solid rgba(123, 123, 123, 0.7);background-color: rgba(123, 123, 123, 0.7); '><form  id='overlay' method='post' onsubmit='return false' action='##'><input  type='text'     name='point' id='point' style='display:none' /><input  type='text'     name='type' id='type' style='display:none' /><h3 style='color: aliceblue;margin-left:25px '>添加新标记点</h3> <div style='width:300px; margin:15px auto; text-align: center'> <textarea id='title' name='title' placeholder='标记点名称'   from='overlay'  style='width:250px; height:20px;padding:10px 10px; border:1px #999999 solid; font-size:16px; color:#fff; background-color:rgba(31,27,24,0.7);OVERFLOW:   hidden;'></textarea> </div> <div style='width:300px; margin:15px auto; text-align: center'> <textarea name='note' placeholder='备注信息'  cols='40'   from='overlay' style='width:250px; height:250px;padding:0px 10px; border:1px #999999 solid; font-size:14px; color:#fff; background-color:rgba(31,27,24,0.7);OVERFLOW:   hidden;'></textarea> </div> <div style='float: left;margin: 20px 20px 20px 140px;width: 40px;height: 25px;'> <input type='button' onclick='addmarker_()' from='overlay' style='background:#078be4; color:#FFF; font-size:14px; font-family:Microsoft YaHei;' value='添&nbsp;&nbsp;&nbsp;&nbsp;加'/> </div> <div style='float: left;margin: 20px 20px 20px 20px;width: 40px;height: 25px;'> <input type='button' onclick='disaddmarker_()'  style='background:#C2D8E4; color:#FFF; font-size:14px; font-family:Microsoft YaHei;' value='取&nbsp;&nbsp;&nbsp;&nbsp;消'/> </div> </form></div>";
    var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
    marker.openInfoWindow(infoWindow);
}
//添加、移除点击事件
function addEventListener_() {
    addMarkerEvent=1;
    document.getElementById('add_marker').style.background="#404040";
    map.addEventListener("click",event_a);
}
function removeEventListener_() {
    document.getElementById('add_marker').style.background="#8F8F8F";
    map.removeEventListener("click",event_a);

    addMarkerEvent=0;
}
function addmarker_(){/////////////////////////////////////////////添加marker
    var point;
    var marker;
    var title;
    var allOverlay = map.getOverlays();
    for (var i = 0; i < allOverlay.length; i++) {
        if (allOverlay[i].toString() == '[object Marker]') {
            if (allOverlay[i].getTitle() == "新建") {
                point = allOverlay[i].getPosition();
                marker = allOverlay[i];
            }
        }
    }
    title=document.getElementById('title').value;
    document.getElementById('point').value=point.lng+','+point.lat+'#';
    document.getElementById('type').value='marker';
    console.log(getRootPath()+"index/addOverLay");//打印服务端返回的数据(调试用)
    console.log($('#overlay').serialize());//打印服务端返回的数据(调试用)
    console.log(point.lng+','+point.lat+'#');//打印服务端返回的数据(调试用)
    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "text",//预期服务器返回的数据类型
        url: getRootPath()+"/index/addOverLay" ,//url
        data: $('#overlay').serialize(),
        contentType : "application/x-www-form-urlencoded",
        success: function (result) {
            console.log(result);//打印服务端返回的数据(调试用)
            if (result=="1") {
                marker.setTitle(title);
                marker.closeInfoWindow();
                removeEventListener_();
                addMarkerListener(marker);
                addOverLay_Li_(title);
            }else if(result=="0"){
                removeEventListener_();
                alert("添加失败，请检查名称是否重复");
            }
        },
        error : function(e) {
            removeEventListener_();
            alert("异常！");
        }
    });

}
function disaddmarker_(){//////////////////////////////////////////////删除 “ 新建 ”marker
    removeEventListener_();
    var allOverlay = map.getOverlays();
    for (var i = 0; i < allOverlay.length; i++) {
        if (allOverlay[i].toString() == '[object Marker]') {
            if (allOverlay[i].getTitle() == "新建") {
                map.removeOverlay(allOverlay[i]);
            }
        }
    }
}
function addMarkerListener(marker){///////////////////////////////////添加事件
    marker.addEventListener("click",marker_click);
}
var marker_click= function(e){///////////////////////////////////////事件-marker点击
    var marker=this;
    var note;
    var msg={"title":this.getTitle()};
    console.log("title:"+this.getTitle());//打印服务端返回的数据(调试用)
    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "text",//预期服务器返回的数据类型
        url: getRootPath()+"/index/getNote" ,//url
        data: msg,
        async:true,
        success: function (result) {
            console.log(result);//打印服务端返回的数据(调试用)
            note=result;
            var sContent =
                "<div style='margin-top:10px;height: 500px;width: 300px;border:1px solid rgba(223,223,223,0.7);background-color: rgba(206,206,206,0.7); '>    <h3 style='color: #9b9b9b;margin-left:25px '>标记点信息</h3>    <form  id='overlay' method='post' onsubmit='return false' action='##'>        <div style='width:300px; margin:15px auto; text-align: center'>            <input class='listinp' type='text'     name='point' id='point' style='display:none' />            <textarea name='title' id='title'   disabled  style='width:250px; height:20px;padding:10px 10px; border:1px #999999 solid; font-size:16px; color:#fff; background-color:rgba(31,27,24,0.7);OVERFLOW:   hidden;'>"+marker.getTitle()+"</textarea>        </div>        <div style='width:300px; margin:15px auto; text-align: center'>            <textarea name='note'  id='note' cols='40'  disabled style='width:250px; height:250px;padding:0px 10px; border:1px #999999 solid; font-size:14px; color:#fff; background-color:rgba(31,27,24,0.7);OVERFLOW:   hidden;'>"+note+"</textarea>        </div>        <div id='sub' style='float: left;margin: 10px 20px 10px 140px;width: 40px;height: 25px;display:none'>            <input type='button' onclick='update_note()' class='btn' value='提&nbsp;&nbsp;&nbsp;&nbsp;交'/>        </div>        <div id='canl' style='float: left;margin: 10px 20px 10px 20px;width: 40px;height: 25px;display:none'>            <input type='button' onclick='close_InfoWindow()' class='btn' value='取&nbsp;&nbsp;&nbsp;&nbsp;消'/>        </div>        <div id='change' style='float: left;margin: 10px 20px 10px 20px;width: 40px;height: 25px;'>            <input type='button' onclick='updata_InfoWindow()' class='btn' value='修&nbsp;&nbsp;&nbsp;&nbsp;改'/>        </div>    </form></div>";
            var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
            marker.openInfoWindow(infoWindow);
            temp_marker=marker;
        },
        error : function(e) {

        }
    });
}
function updata_InfoWindow(){//////////////////////////////////////修改窗口状态为可编辑
    $("#change").hide();
    $("#sub").show();
    $("#canl").show();
    $("#note").removeAttr("disabled");
}
var temp_marker;//////////////////////////////////////////////////当前打开窗口的宿主
function close_InfoWindow(){///////////////////////////////////////关闭窗口
    temp_marker.closeInfoWindow();
}
function update_note(){////////////////////////////////////////////修改note
    var title=document.getElementById('title').value;
    var note=document.getElementById('note').value;
    var msg={"title":title,"note":note};

    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "text",//预期服务器返回的数据类型
        url: getRootPath()+"/index/updataNote" ,//url
        data: msg,
        async:true,
        success: function (result) {
            console.log(result);//打印服务端返回的数据(调试用)
            if(result==1){
                close_InfoWindow();
            }else{
                alert("添加失败！");
                close_InfoWindow();
            }
        },
        error : function(e) {

        }
    });
}
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){                             //////树形菜单控制
    $(".sidebar_ul_2").hide();
    $(".sidebar_a_1").click(function(){
        $(".sidebar_ul_2").hide();
        $(this).next().show();
    });
});
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////初始化覆盖物
function addAllOverLay_(){///////////////////////////////////////////向地图中添加所有标记物-初始化
    console.log("addAllOverLay_");
    $.ajax({
        //几个参数需要注意一下
        type: "GET",//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: getRootPath()+"/index/getAllOverLay" ,//url
        success: function (result) {
            console.log(result);//打印服务端返回的数据(调试用)
            $.each(result,function (index, item) {
                addOverLay_(item);
            });
        },
        error : function(e) {
            alert("异常！");
        }
    });

}
function addOverLay_(item) {//////////////////////////////////添加标记物
    console.log("addOverLay_");
    var type=item.type;
    if(type=="marker"){
        addOverLay_Marker_(item)
    }
    addOverLay_Li_(item.title);
}
function addOverLay_Marker_(item) {///////////////////////////添加标记物-marker
    console.log("addOverLay_Marker_");
    var arr=item.point.split("#");
    var point_x=parseFloat(arr[0].split(",")[0]);
    var point_y=parseFloat(arr[0].split(",")[1]);
    var point = new BMap.Point(point_x, point_y);
    console.log(point.lng+" "+point.lat);
    var marker = new BMap.Marker(point);  // 创建标注
    marker.setTitle(item.title);
    map.addOverlay(marker);               // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    addMarkerListener(marker);
}
///////////////////////////////////////////////////////////////////////////////初始化列表
function del(n)
{
    var s=document.getElementById('s');
    var t=s.childNodes.length;
    s.removeChild(s.childNodes[n-1]);
}
function addOverLay_Li_(title)///////////////////////////////////////////////添加到列表
{
    $("#OverLay_List").append("<li id='li"+title+"' class='sidebar_li_2_1' onclick='gotoOverLayByTitle("+title+")'><a id='a"+title+"' class='sidebar_a_2_1'>&nbsp;<div id='show_title"+title+"'class='show_title'>"+title+"</div><div id='del_overlay_btn"+title+"'class='del_overlay_btn'onclick='delete_overlay("+title+")'>删除</div></a><div id='del_overlay'></div></li>");
    $("#li"+title).attr("class",'sidebar_li_2_1');
    $("#a"+title).attr("class",'sidebar_a_2_1');
    $("#show_title"+title).attr("class",'show_title');
    $("#del_overlay_btn"+title).attr("class",'del_overlay_btn');
}
function gotoOverLayByTitle(title) {////////////////////////////////////定位到覆盖物
    var allOverlay = map.getOverlays();
    for (var i = 0; i < allOverlay.length; i++) {
        if (allOverlay[i].toString() == '[object Marker]') {
            if (allOverlay[i].getTitle() == title) {
                map.panTo(allOverlay[i].point);
                //map.setZoom(15);
            }
        }
    }
    $(".del_overlay_btn").hide();
    $("#del_overlay_btn"+title).show();
}
function delete_overlay(title) {////////////////////////////////////////删除覆盖物
    var msg={"title":title};

    $.ajax({
        //几个参数需要注意一下
        type: "POST",//方法类型
        dataType: "text",//预期服务器返回的数据类型
        url: getRootPath()+"/index/deleteOverLay" ,//url
        data: msg,
        async:true,
        success: function (result) {
            console.log(result);//打印服务端返回的数据(调试用)
            if(result==1){
                $("#li"+title).hide();
                var allOverlay = map.getOverlays();
                for (var i = 0; i < allOverlay.length; i++) {
                    if (allOverlay[i].toString() == '[object Marker]') {
                        if (allOverlay[i].getTitle() == title) {
                            map.removeOverlay(allOverlay[i]);
                        }
                    }
                }
            }else{
                alert("删除失败！");
                return false;
            }
        },
        error : function(e) {
            return false;
        }
    });

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////添加覆盖物
var drawingManager;
var drawingManager_is_switch=0;
var overlays = [];
function drawingManager_switch(){
    if(drawingManager_is_switch==0){
        open_drawingManager()
    }else{
        close_drawingManager();
    }
}
function open_drawingManager(){
    var styleOptions = {
        strokeColor:"#068791",    //边线颜色。
        fillColor:"#851815",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    if(drawingManager==null){
        drawingManager = new BMapLib.DrawingManager(map, {
            isOpen: false,
            enableDrawingTool: true,
            enableCalculate: false,
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                offset: new BMap.Size(170, 5), //偏离值
                drawingModes : [ BMAP_DRAWING_POLYGON],
                drawingTypes : [
                    BMAP_DRAWING_POLYGON,
                ]
            },
            polygonOptions: styleOptions, //多边形的样式
        });
        drawingManager_is_switch=1;
    }else{
        $('.BMapLib_Drawing_panel').show();
        drawingManager_is_switch=1;
    }
    var overlaycomplete = function(e){
        var polygon=e.overlay;
        polygon.id="新建";
        overlays.push(e.overlay);
        console.log("over_drow");//打印服务端返回的数据(调试用)
        console.log(polygon);//打印服务端返回的数据(调试用)
    };
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    document.getElementById('add_overlay').style.background="#404040";
}
function close_drawingManager() {
    drawingManager.close();
    document.getElementById('add_overlay').style.background="#8F8F8F";
    $('.BMapLib_Drawing_panel').hide();
    drawingManager_is_switch=0;
}
function clearAll() {
    console.log(overlays.length);//打印服务端返回的数据(调试用)
}




//开启、关闭滚轮缩放
function enableScrollWheelZoom() {
    map.enableScrollWheelZoom(true);
}
function disableScrollWheelZoom() {
    map.disableScrollWheelZoom();
}
//开启、关闭双击放大
function enableDoubleClickZoom()
{
    map.enableDoubleClickZoom();
}
function disableDoubleClickZoom() {
    map.disableDoubleClickZoom();
}
//键盘操作
function  enableKeyboard () {
    map. enableKeyboard();
}
function  disableKeyboard () {
    map.disableKeyboard ();
}
//返回两点之间距离 point point 单位米
function  getDistance (point,point2) {
    return map. getDistance(point1,point2);
}
//根据提供的地理区域或坐标获得最佳的地图视野，返回的对象中包含center和zoom属性，分别表示地图的中心点和级别。
function   getViewport(point_arr,viewportOptions) {
    return map. getViewport(point_arr,viewportOptions);
}
//将地图的中心点更改为给定的点。b是否使用动画效果
function   panTo(point,b) {
    map. panTo(point,b);
}
//重新设置地图
function  reset () {
    map. reset();
}
//移动地图
function setViewport  (point,viewportOptions) {
    map. setViewport(point,viewportOptions);
}
// 设置缩放级别
function  setZoom (num) {
    map. setZoom(num);
}
// 添加、移除控件
function  addControl (control) {
    map. addControl(control);
}
function removeControl  (control) {
    map. removeControl(control);
}
// 右键菜单
function   addContextMenu() {
    var menu = new BMap.ContextMenu();
    var txtMenuItem = [
        {
            text:'放大',
            callback:function(){map.zoomIn()}
        },
        {
            text:'缩小',
            callback:function(){map.zoomOut()}
        }
    ];
    for(var i=0; i < txtMenuItem.length; i++){
        menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
    }
    map.addContextMenu(menu);
}
// 添加、移除覆盖物
function   addOverlay(overlay) {
    map. addOverlay(overlay);
}
function removeOverlay  (overlay) {
    map.removeOverlay (overlay);
}
function getPoint(){
    var point;
    map.addEventListener("click",function(e){
        point=e.point;
        // alert(e.point.lng + "," + e.point.lat);
    });
    return point;

}
//js获取项目根路径，如： http://localhost:8083/uimcardprj
function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht);
}
var myStyleJson=[{
"featureType": "land",
    "elementType": "geometry",
    "stylers": {
    "visibility": "on",
        "color": "#f5f5f5ff"
}
}, {
    "featureType": "water",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on",
            "color": "#bedbf9ff"
    }
}, {
    "featureType": "green",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on",
            "color": "#d0edccff"
    }
}, {
    "featureType": "building",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "building",
        "elementType": "geometry.fill",
        "stylers": {
        "color": "#3a3838b3"
    }
}, {
    "featureType": "building",
        "elementType": "geometry.stroke",
        "stylers": {
        "color": "#dadadab3"
    }
}, {
    "featureType": "subwaystation",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on",
            "color": "#b15454B2"
    }
}, {
    "featureType": "education",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on",
            "color": "#e4f1f1ff"
    }
}, {
    "featureType": "medical",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on",
            "color": "#f0dedeff"
    }
}, {
    "featureType": "scenicspots",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on",
            "color": "#e2efe5ff"
    }
}, {
    "featureType": "highway",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on",
            "weight": 4
    }
}, {
    "featureType": "highway",
        "elementType": "geometry.fill",
        "stylers": {
        "color": "#f7c54dff"
    }
}, {
    "featureType": "highway",
        "elementType": "geometry.stroke",
        "stylers": {
        "color": "#fed669ff"
    }
}, {
    "featureType": "highway",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "highway",
        "elementType": "labels.text.fill",
        "stylers": {
        "color": "#8f5a33ff"
    }
}, {
    "featureType": "highway",
        "elementType": "labels.text.stroke",
        "stylers": {
        "color": "#ffffffff"
    }
}, {
    "featureType": "highway",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "arterial",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on",
            "weight": 2
    }
}, {
    "featureType": "arterial",
        "elementType": "geometry.fill",
        "stylers": {
        "color": "#d8d8d8ff"
    }
}, {
    "featureType": "arterial",
        "elementType": "geometry.stroke",
        "stylers": {
        "color": "#ffeebbff"
    }
}, {
    "featureType": "arterial",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "arterial",
        "elementType": "labels.text.fill",
        "stylers": {
        "color": "#525355ff"
    }
}, {
    "featureType": "arterial",
        "elementType": "labels.text.stroke",
        "stylers": {
        "color": "#ffffffff"
    }
}, {
    "featureType": "local",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on",
            "weight": 1
    }
}, {
    "featureType": "local",
        "elementType": "geometry.fill",
        "stylers": {
        "color": "#d8d8d8ff"
    }
}, {
    "featureType": "local",
        "elementType": "geometry.stroke",
        "stylers": {
        "color": "#ffffffff"
    }
}, {
    "featureType": "local",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "local",
        "elementType": "labels.text.fill",
        "stylers": {
        "color": "#979c9aff"
    }
}, {
    "featureType": "local",
        "elementType": "labels.text.stroke",
        "stylers": {
        "color": "#ffffffff"
    }
}, {
    "featureType": "railway",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on",
            "weight": 1
    }
}, {
    "featureType": "railway",
        "elementType": "geometry.fill",
        "stylers": {
        "color": "#949494ff"
    }
}, {
    "featureType": "railway",
        "elementType": "geometry.stroke",
        "stylers": {
        "color": "#ffffffff"
    }
}, {
    "featureType": "subway",
        "elementType": "geometry",
        "stylers": {
        "visibility": "on",
            "weight": 1
    }
}, {
    "featureType": "subway",
        "elementType": "geometry.fill",
        "stylers": {
        "color": "#d8d8d8ff"
    }
}, {
    "featureType": "subway",
        "elementType": "geometry.stroke",
        "stylers": {
        "color": "#ffffffff"
    }
}, {
    "featureType": "subway",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "subway",
        "elementType": "labels.text.fill",
        "stylers": {
        "color": "#979c9aff"
    }
}, {
    "featureType": "subway",
        "elementType": "labels.text.stroke",
        "stylers": {
        "color": "#ffffffff"
    }
}, {
    "featureType": "continent",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "continent",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "continent",
        "elementType": "labels.text.fill",
        "stylers": {
        "color": "#333333ff"
    }
}, {
    "featureType": "continent",
        "elementType": "labels.text.stroke",
        "stylers": {
        "color": "#ffffffff"
    }
}, {
    "featureType": "city",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "city",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "city",
        "elementType": "labels.text.fill",
        "stylers": {
        "color": "#454d50ff"
    }
}, {
    "featureType": "city",
        "elementType": "labels.text.stroke",
        "stylers": {
        "color": "#ffffffff"
    }
}, {
    "featureType": "town",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "town",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "town",
        "elementType": "labels.text.fill",
        "stylers": {
        "color": "#454d50ff"
    }
}, {
    "featureType": "town",
        "elementType": "labels.text.stroke",
        "stylers": {
        "color": "#ffffffff"
    }
}, {
    "featureType": "scenicspotslabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "scenicspotslabel",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "entertainmentlabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "entertainmentlabel",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "restaurantlabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "restaurantlabel",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "shoppinglabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "shoppinglabel",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "lifeservicelabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "lifeservicelabel",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "carservicelabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "carservicelabel",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "transportationlabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "transportationlabel",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "financelabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "financelabel",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "educationlabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "educationlabel",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "medicallabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "governmentlabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "otherlabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "hotellabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "hotellabel",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "off"
    }
}, {
    "featureType": "businesstowerlabel",
        "elementType": "labels",
        "stylers": {
        "visibility": "on"
    }
}, {
    "featureType": "businesstowerlabel",
        "elementType": "labels.icon",
        "stylers": {
        "visibility": "on"
    }
}];
map.setMapStyle({styleJson: myStyleJson });