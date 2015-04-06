function mapZoom(){
    var pan = ol.animation.pan({
        duration: 2000,
        source: /** @type {ol.Coordinate} */ (view.getCenter())
    });
    map.beforeRender(pan);
    view.setCenter(autofocus);

    var zoom = ol.animation.zoom({
        duration: 2000,
        resolution: map.getView().getResolution()
    });
    map.beforeRender(zoom);
    map.getView().setZoom(autozoom);
}