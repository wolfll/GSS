package pers.hzh.gss.model;

public class Point {
    public double lng;
    public double lat;

    public Point(String lng,String lat){
        this.lng=Double.parseDouble(lng);
        this.lat=Double.parseDouble(lat);
    }
    public Point(double lng,double lat){
        this.lng=lng;
        this.lat=lat;
    }
    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }
}
