import { AgmMarker } from '@agm/core';
/*
source code set hover to emit object { coord:{..}}
this code modify the prototype of AgmMarker._addEventListeners function
the modification is to emit the marker itself along with coord so we can
have access to props of 'marker' such as marker.infoWindow
*/

AgmMarker.prototype._addEventListeners = function () {
        var _this = this;
        var cs = this._markerManager.createEventObservable('click', this).subscribe(function () {
            if (_this.openInfoWindow) {
                _this.infoWindow.forEach(function (infoWindow) { return infoWindow.open(); });
            }
            _this.markerClick.emit(null);
        });
        this._observableSubscriptions.push(cs);
        var ds = this._markerManager.createEventObservable('dragend', this)
            .subscribe(function (e) {
            _this.dragEnd.emit({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() } });
        });
        this._observableSubscriptions.push(ds);
        var mover = this._markerManager.createEventObservable('mouseover', this)
            .subscribe(function (e) {
            //added target: _this to be emitted when hover
            _this.mouseOver.emit({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() }, target: _this });
        });
        this._observableSubscriptions.push(mover);
        var mout = this._markerManager.createEventObservable('mouseout', this)
            .subscribe(function (e) {
            //added target: _this to be emitted when hover
            _this.mouseOut.emit({ coords: { lat: e.latLng.lat(), lng: e.latLng.lng() }, target: _this });
        });
        this._observableSubscriptions.push(mout);
    };
