var toolbar = null;

/*
    Интерфейс IColor для хранения цвета для отрисовки геометрических фигур.
*/
class IColor {
    constructor() {
    }

    get String() {
        throw "Not implemented!";
    }
}

class RGBColor extends IColor {
    constructor() {
        super();
        this.color = '000000';
    }

    get RGB() {
        return this.color;
    }

    set RGB(newValue) {
        if (newValue.length == 6) {
            this.color = newValue;
        }
        else {
            throw "Неизвестный формат цвета " + newValue;
        }
    }
    
    get String() {
        return '#' + this.color;
    }
}

class RGBAColor extends RGBColor {
    constructor() {
        super();
        this.alpha = '00';
    }

    get RGBA() {
        return this.String;
    }

    set RGBA(newValue) {
        if (newValue.length == 6)
        {
            super.RGB = newValue;
            this.alpha = 'ff';
        }
        else if (newValue.length == 8)
        {
            this.alpha = newValue.substring(0, 2);
            super.RGB = newValue.substring(2);
        }
        else 
        {
            throw "Неизвестный формат цвета " + newValue;
        }
    }

    get Alpha() {
        return this.alpha;
    }

    get AlphaFloat() {
        return parseInt('0x' + this.alpha) / 255;
    }

    set Alpha(newValue) {
        this.alpha = newValue;
    }

    get String() {
        return "#" + super.RGB + this.alpha;
    }
}

/*
    Интерфейс IBrush для хранения цвета линий и заливки для отрисовки геометрических фигур.
*/
class IBrush {
    constructor() {

    }

    getLineColor() {
        throw "Not implemented!";
    }

    getFillColor() {
        throw "Not implemented!";
    }
}

class Brush extends IBrush {
    constructor() {
        super();
        this.lineColor = new RGBColor();
        this.fillColor = new RGBAColor();
        this.weight = 1;
    }

    get LineColor() {
        return this.lineColor;
    }

    get FillColor() {
        return this.fillColor;
    }

    get Weight() {
        return this.weight;
    }

    set Weight(newValue) {
        this.weight = newValue;
    }
}

/*
    Интерфейс ICoordinates служит для унификации работы с разными типами координатных систем.
*/
class ICoordinates {
    get Lat() {
        throw "Not implemented!";
    }
    get Lng() {
        throw "Not implemented!";
    }
    get String() {
        throw "Not implemented!";
    }
    fromString(data) {
        throw "Not implemented!";
    }
}

class YandexCoordinates extends ICoordinates {
    constructor(value) {
        super();
        this.coordinates = value;
    }

    get Coordinates() {
        return this.coordinates;
    }

    get Lat() {
        return this.coordinates[0];
    }
    get Lng() {
        return this.coordinates[1];
    }
    get String() {
        throw "Not implemented!";
    }
    fromString(data) {
        throw "Not implemented!";
    }
}

class GoogleCoordinates extends ICoordinates {
    constructor(value) {
        super();
        this.coordinates = value;
    }

    get Coordinates() {
        return this.coordinates;
    }

    get Lat() {
        return this.coordinates.lat;
    }
    get Lng() {
        return this.coordinates.lng;
    }
    get String() {
        throw "Not implemented!";
    }
    fromString(data) {
        throw "Not implemented!";
    }
}

/*
    Интерфейс IObject представляет графический объект на карте.
*/
class IObject {
    constructor(object) {
        this.brush = null;
        if (Object.is(object, null) || Object.is(object, undefined))
        {
            throw "Null object!";
        }
        if (typeof object != 'object')
        {
            throw "Object has wrong type!";
        }
        this.object = object;
        this.objectIndex = 0;
    }

    set Brush(newValue) {
        this.brush = newValue;
    }

    get Brush() {
        return this.brush;
    }

    get Object() {
        return this.object;
    }

    get IsValid() {
        throw "Not implemented!";
    }

    // Максимальное количетсво вершин
    get MaxVerticies() {
        throw "Not implemented!";
    }

    // Количество вершин
    get VerticiesCount() {
        throw "Not implemented!";
    }

    // Добавляет новую вершину к объекту
    AddVertex(coords) {
        throw "Not implemented!";
    }

    // Устанавливает доп. параметры для объекта
    SetParamaters (params) {
        throw "Not implemented!";
    }

    get ObjectNumber() {
        return this.objectIndex;
    }

    SetObjectNumber(index) {
        this.objectIndex = index;
    }

    // Инициализирует объект
    Init() {
        throw "Not implemented!";
    }

    // Отрисовывает объект
    Draw() {
        throw "Not implemented!";
    }

    // Уничтожает объект
    Destroy() {
        throw "Not implemented!";
    }

    Edit() {
        throw "Not implemented!";
    }

    StopEditing() {
        throw "Not implemented!";
    }
}

/*
    Интерфейс ICompositeObject расширяет IObject для графических объектов имеющих множество координат
*/
class ICompositeObject extends IObject {
    constructor(object) {
        super(object);
        this.coordinates = new Array();
    }

    get Coordinates() {
        return this.coordinates;
    }

    get IsValid() {
        this.coordinates.length > 1;
    }

}

/*
    Класс реализующий замкнутый контур 
*/
class ClosedCompositeObject extends ICompositeObject {
    constructor(object) {
        super(object);
    }

    AddVertex(coords) {
        if (this.VerticiesCount < this.MaxVerticies) {
            this.coordinates.slice(this.VerticiesCount, 0, coords);
        } else {
            this.coordinates[this.VerticiesCount - 1] = coords;
        }
    }

    get VerticiesCount() {
        return this.Coordinates.length == 0 ? 0 : this.Coordinates.length + 1;
    }
}

/*
    Класс реализующий незамкнутый контур 
*/
class NonClosedCompositeObject extends ICompositeObject {
    constructor(object) {
        super(object);
    }

    AddVertex(coords) {
        if (this.VerticiesCount < this.MaxVerticies) {
            this.coordinates.push(coords);
        } else {
            this.coordinates[this.VerticiesCount - 1] = coords;
        }
    }

    get VerticiesCount() {
        return this.Coordinates.length;
    }
}

/*
    Интерфейс IPolyline расширяет ICompositeObject для представления ломанной
*/
class IPolyline extends NonClosedCompositeObject {
    constructor(object) {
        super(object);
    }
}

class Polyline extends IPolyline {
    constructor(object) {
        super(object);
    }

    Draw() {

    }

    get MaxVerticies() {
        return 15;
    }
}

class YandexPolyline extends Polyline {
    constructor(object) {
        super(object);
    }

    Init() {

    }

    AddVertex(coords) {
        var geometry = super.Object.geometry;
        geometry.insert(geometry.getLength(), coords.Coordinates);
    }

    Draw() {
        super.Object.options.set({
            strokeColor: super.Brush.LineColor.String,
            strokeWidth: super.Brush.Weight
        });
        super.Object.editor.startEditing();
    }

    Edit() {
        super.Object.editor.startEditing();
    }

    StopEditing() {
        super.Object.editor.stopEditing();
    }

    Destroy() {

    }
}

class GooglePolyline extends Polyline {
    constructor(object) {
        super(object);
    }

    Init() {

    }

    AddVertex(coords) {
        var path = super.Object.getPath();
        path.push(coords.Coordinates);
    }

    Draw() {
        super.Object.setOptions({
            strokeColor: super.Brush.LineColor.String,
            strokeWeight: super.Brush.Weight
        });
        super.Object.setEditable(true);
    }

    Edit() {
        super.Object.setEditable(true);
    }

    StopEditing() {
        super.Object.setEditable(false);
    }

    Destroy() {
        super.Object.setMap(null);
    }
}

/*
    Интерфейс IPolyline расширяет ICompositeObject для представления полигона (замкнутая линия с заливкой)
*/
class IPolygon extends ClosedCompositeObject {
    constructor(object) {
        super(object);
    }
}

class Polygon extends IPolygon {
    constructor(object) {
        super(object);
    }

    Draw() {

    }

    get MaxVerticies() {
        return 15;
    }
}

class YandexPolygon extends Polygon {
    constructor(object) {
        super(object);
    }

    Init() {

    }

    AddVertex(coords) {
        var geometry = super.Object.geometry;
        var path = geometry.get(0);
        if (path == null || path == undefined)
        {
            path = new Array();
        }
        if (path.length > 0)
        {
            path.splice(path.length - 1, 0, coords.Coordinates);
        }
        else
        {
            path.push(coords.Coordinates);
        }
        geometry.set(0, path);
    }

    Draw() {
        super.Object.options.set({
            strokeColor: super.Brush.LineColor.String,
            strokeWidth: super.Brush.Weight,
            fillColor: super.Brush.FillColor.String
        });
        this.Edit();
    }

    Edit() {
        super.Object.editor.startEditing();
    }

    StopEditing() {
        super.Object.editor.stopEditing();
    }

    Destroy() {

    }
}

class GooglePolygon extends Polygon {
    constructor(object) {
        super(object);
    }

    Init() {

    }

    AddVertex(coords) {
        var paths = super.Object.getPaths().getAt(0).push(coords.Coordinates);
    }

    Draw() {
        super.Object.setOptions({
            strokeColor: super.Brush.LineColor.String,
            strokeWeight: super.Brush.Weight,
            fillOpacity: super.Brush.FillColor.AlphaFloat,
            fillColor: super.Brush.FillColor.String
        });
        super.Object.setEditable(true);
    }

    Edit() {
        super.Object.setEditable(true);
    }

    StopEditing() {
        super.Object.setEditable(false);
    }

    Destroy() {
        super.Object.setMap(null);
    }
}

/*
    Интерфейс IPolyline расширяет ICompositeObject для линии
*/
class ILine extends NonClosedCompositeObject {
    constructor(object) {
        super(object);
    }
}

class Line extends ILine {
    constructor(object) {
        super(object);
    }

    Init() {

    }

    get MaxVerticies() {
        return 2;
    }
}

class YandexLine extends Line {
    constructor(object) {
        super(object);
    }

    AddVertex(coords) {
        var geometry = super.Object.geometry;
        if (geometry.getLength() < super.MaxVerticies)
        {
            geometry.insert(geometry.getLength(), coords.Coordinates);
        }
        else
        {
            geometry.set(geometry.getLength() - 1, coords.Coordinates);
        }
    }

    Draw() {
        super.Object.options.set({
            strokeColor: super.Brush.LineColor.String,
            strokeWidth: super.Brush.Weight
        });
        super.Object.editor.startEditing();
    }

    Edit() {
        super.Object.editor.startEditing();
    }

    StopEditing() {
        super.Object.editor.stopEditing();
    }

    Destroy() {

    }
}

class GoogleLine extends Line {
    constructor(object) {
        super(object);
    }

    AddVertex(coords) {
        var path = super.Object.getPath();
        if (path.length < super.MaxVerticies)
        {
            path.push(coords.Coordinates);
        }
        else
        {
            path.setAt(path.length - 1, coords.Coordinates);
        }
    }

    Draw() {
        super.Object.setOptions({
            strokeColor: super.Brush.LineColor.String,
            strokeWeight: super.Brush.Weight
        });
        super.Object.setEditable(true);
    }

    Edit() {
        super.Object.setEditable(true);
    }

    StopEditing() {
        super.Object.setEditable(false);
    }

    Destroy() {
        super.Object.setMap(null);
    }
}

/*
    Интерфейс IPolyline расширяет IObject для представления информационной метки
*/
class IInfo extends IObject {
    constructor(object) {
        super(object);
        this.coordinates = null;
    }

    get Coordinates() {
        return this.coordinates;
    }
}

class Info extends IInfo {
    constructor(object) {
        super(object);
    }

    Draw() {

    }

    get MaxVerticies() {
        return (this.coordinates == null) ? 0 : 1;
    }

    AddVertex(coords) {
        if (this.VerticiesCount < this.MaxVerticies) {
            this.coordinates.push(coords);
        } else {
            this.coordinates[this.VerticiesCount - 1] = coords;
        }
    }
}

class GoogleInfo extends Info {
    constructor(object) {
        super(object);
    }

    Init() {

    }

    AddVertex(coords) {
        super.Object.setPosition(coords.Coordinates);
        super.Object.setOptions({ label: super.ObjectNumber.toString() });
    }

    Draw() {
        
    }

    Edit() {

    }

    StopEditing() {
        
    }

    Destroy() {
        super.Object.setMap(null);
    }
}

class YandexInfo extends Info {
    constructor(object) {
        super(object);
    }

    Init() {

    }

    AddVertex(coords) {
        super.Object.geometry.setCoordinates(coords.Coordinates);
        super.Object.properties.set('iconContent ', 'dfdf');
    }

    Draw() {
        
    }

    Edit() {

    }

    StopEditing() {
        
    }

    Destroy() {

    }
}

/*
    Интерфейс для фабрики создания объектов
*/
class IObjectFactory {
    constructor(map) {
        this.map = map;
    }

    get Map() {
        return this.map;
    }

    CreateObject(type) {
        throw "Not implemented!";
    }
};

class YandexObjectFactory extends IObjectFactory {
    constructor(map) {
        super(map);
    }

    CreateObject(type) {
        switch (type) {
            case 'message': return new YandexInfo(new ymaps.Placemark([]));
            case 'line': return new YandexLine(new ymaps.Polyline([]));
            case 'polyline': return new YandexPolyline(new ymaps.Polyline([]));
            case 'polygon': return new YandexPolygon(new ymaps.Polygon([[]]));
            default: return null;
        }
    }
}

class GoogleObjectFactory extends IObjectFactory {
    constructor(map) {
        super(map);
        this.objIndexes = {};
    }

    CreateObject(type) {
        var obj = null;
        var num = (this.objIndexes[type] == null || this.objIndexes[type] == undefined) ? 1 : this.objIndexes[type] + 1;
        switch (type) {
            case 'message': obj = new GoogleInfo(new google.maps.Marker()); break;
            case 'line': obj = new GoogleLine(new google.maps.Polyline()); break;
            case 'polyline': obj = new GooglePolyline(new google.maps.Polyline()); break;
            case 'polygon': obj = new GooglePolygon(new google.maps.Polygon()); break;
            default: return null;
        }
        if (obj != null && obj != undefined)
        {
            obj.SetObjectNumber(num);
            this.objIndexes[type] = num;
        }
        return obj;
    }
}

/*
    Интерфейс IGeoCoder служит для унификации работы с разными службами геокодирования.
*/
class IGeoCoder {
    Find(address, callback) {
        throw "Not implemented!";
    }
}

class GeoCoderResultCollection {
    constructor() {
        this.array = new Array();
    }

    push(object) {
        this.array.push(object);
    }

    get Count() {
        return this.array.length;
    }

    get AddressList() {
        var ret = new Array();
        this.array.forEach(function (e) {
            ret.push(e.Address);
        });
        return ret;
    }

    get AutocompleteData() {
        var ret = new Array();
        this.array.forEach(function (e) {
            ret.push({
                label: e.Address,
                value: e.Address,
                longlat: e.Coordinates
            });
        });
        return ret;
    }
}

class GeoCoderResult {
    constructor(address, coordinates) {
        this.address = address;
        this.coordinates = coordinates;
    }
    
    get Address() {
        return this.address;
    }

    get Coordinates() {
        return this.coordinates;
    }
}

class GoogleGeoCoder extends IGeoCoder {
    Find(address, callback) {
        return null;
    }
}

class YandexGeoCoder extends IGeoCoder {
    constructor() {
        super();
    }

    Find(address, callback) {
        var results = ymaps.geocode(address, {
            json: true
        });

        var ret = new GeoCoderResultCollection();
        results.then(
            function (res) {
                res.GeoObjectCollection.featureMember.forEach(function (e) {
                    ret.push(
                        new GeoCoderResult(
                            e.GeoObject.name,
                            new YandexCoordinates(e.GeoObject.Point.pos)
                        )
                    );
                });
                console.log(res);
                callback(ret);
            },
            function (err) {
                console.log(err);
            }
        );
    }
}

/*
    Интерфейс IGeoCoder служит для унификации работы с разными службами карт
*/
class IMap {

    constructor(divName) {
        this.divName = divName;
        this.divElement = $(divName);
        this.selectedBrush = new Brush();
        this.selectedObject = null;
        this.isInit = false;
        this.objects = new Array();
        this.geocoder = null;
        this.factory = null;
    }

    get ActiveBrush() {
        return this.selectedBrush;
    }

    get ObjectFactory() {
        return this.factory;
    }

    get MapElement() {
        return this.divElement;
    };

    get ElementName() {
        return this.divName;
    }

    // Первоначальная инициализация карты
    Init() {
        this.isInit = true;

        this.ActiveBrush.LineColor.RGB = '880000';
        this.ActiveBrush.FillColor.RGB = '880000';
        this.ActiveBrush.FillColor.Alpha = '88';
        this.ActiveBrush.Weight = 1;
    }

    get IsInit() {
        return this.isInit;
    }

    // Вызывается каждый раз, когда карта загружается на страницу
    Load() {
        for (var i = 0; i < this.objects.length; i++)
        {
            this.objects[i].Draw();
        }
    }

    Unload() {
        throw "Not implemented!";
    }

    get GeoCoder() {
        return this.geocoder;
    }

    get SelectedObject() {
        return this.selectedObject;
    }

    SelectObject(object) {
        this.selectedObject = object;
        this.objects.forEach(function (e) {
            e.StopEditing();
        });
        if (object != null && object != undefined) {
            object.Edit();
        }
        var instance = this;
        $(document).on('keyup', function (e) {
            if (e.keyCode == 46) // delete
            {
                if (instance.SelectedObject != null && instance.SelectedObject != undefined) {
                    instance.SelectedObject.Destroy();
                }
                toolbar.flush();
                instance.EndDrawing();
            }
            else if (e.keyCode == 27) // escape
            {
                toolbar.flush();
                instance.EndDrawing();
            }
        });
    }

    CreateObject(object) {
        if (Object.is(object, null) || Object.is(object, undefined)) {
            throw "Null reference exception!";
        }
        object.Init();
        this.objects.push(object);
        this.SelectObject(object);
        object.Brush = this.selectedBrush;
    }

    BeginDrawing(type) {
        throw "Not implemented!";
    }

    EndDrawing() {
        this.SelectObject(null);
    }
};

class GoogleMap extends IMap {
    constructor(divName) {
        super(divName);

        this.instance = null;
        this.clickListener = null;
    }

    Init() {
        super.Init();
        this.geocoder = new GoogleGeoCoder();
        this.factory = new GoogleObjectFactory(this, this.instance);

    }

    Load() {
        if (!super.IsInit) {
            throw "Карты не были инициализированы!";
        }

        this.instance = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: { lat: 56.852379, lng: 53.202749 },
            disableDoubleClickZoom: false,
            fullscreenControl: false,
            minZoom: 16,
            maxZoom: 18,
            scrollwheel: false,
            scaleControl: false,
            rotateControl: false
        });

        this.instance.setOptions({ draggableCursor: 'arrow' });

        super.Load();
    }

    Unload() {

    }

    CreateObject(object) {
        super.CreateObject(object);
        var map = this;
        object.Object.addListener('click', function (e) {
            map.SelectObject(object);
        });
    }

    BeginDrawing(type) {
        this.EndDrawing();
        var map = this.instance;
        var instance = this;
        //try 
        {
            var obj = super.ObjectFactory.CreateObject(type);
            if (obj != null && obj != undefined) {
                this.CreateObject(obj);
                obj.Object.setMap(map);
                this.clickListener = map.addListener('click', function (e) {
                    var coords = new GoogleCoordinates(e.latLng);
                    if (instance.SelectedObject != null && instance.SelectedObject != undefined)
                    {
                        instance.SelectedObject.AddVertex(coords);
                        instance.SelectedObject.Draw();
                    }
                });
                map.setOptions({ draggableCursor: 'crosshair' });
            }
        }
    }

    EndDrawing() {
        super.EndDrawing();
        if (this.clickListener != null && this.clickListener != undefined) {
            this.clickListener.remove();
        }
        this.instance.setOptions({ draggableCursor: 'arrow' });
        $(document).off('keyup');
    }
}

class YandexMap extends IMap {
    constructor(divName) {
        super(divName);
        this.instance = null;
    }

    Init() {
        super.Init();
        this.geocoder = new YandexGeoCoder();
        this.factory = new YandexObjectFactory(this, this.instance);
    }

    Load() {
        if (!super.IsInit)
        {
            throw "Карты не были инициализированы!";
        }

        this.instance = new ymaps.Map(this.ElementName, {
            center: [56.852379, 53.202749],
            zoom: 16,
            minZoom: 16,
            avoidFractionalZoom: false
        });

        this.cursor = this.instance.cursors.push('arrow');

        this.instance.behaviors
            .disable('scrollZoom')
            .disable('dblClickZoom')
            .disable('rightMouseButtonMagnifier')
            .disable('leftMouseButtonMagnifier')
            .disable('ruler')
            .disable('routeEditor');

        this.instance.controls
            .remove('fullscreenControl')
            .remove('routeEditor')
            .remove('rulerControl')
            .remove('searchControl')
            .remove('trafficControl')
            .remove('zoomControl');
        super.Load();
    }

    Unload() {
        if (this.instance == null || this.instance == undefined)
            return;
        this.instance.destroy();
    }

    SetZoom(value) {
        this.instance.setZoom(value);
    }

    CreateObject(object) {
        super.CreateObject(object);
        var map = this;
        object.Object.events.add('click', function (e) {
            map.SelectObject(object);
        });
        this.instance.geoObjects.add(object.Object);
    }

    BeginDrawing(type) {
        this.EndDrawing();
        var map = this.instance;
        var instance = this;
        //try 
        {
            var obj = super.ObjectFactory.CreateObject(type);
            if (obj != null && obj != undefined)
            {
                this.CreateObject(obj);
                map.events.add('click', function (e) {
                    var coords = new YandexCoordinates(e.get('coords'));
                    instance.SelectedObject.AddVertex(coords);
                    instance.SelectedObject.Draw();
                });
                this.cursor.setKey('crosshair');
            }
        }
        /*
        catch (e)
        {
            console.log("Drawing failed! Exception: " + e.message);
        }
        */
    }

    EndDrawing() {
        super.EndDrawing();
        this.cursor.setKey('arrow');
        this.instance.events.remove('click');
        $(document).off('keyup');
    }
}

class MapProvider {
    constructor() {
        this.maps = {};
        this.active = null;
    }

    Add(key, map) {
        this.maps[key] = map;
    }

    Get(key) {
        return this.maps[key];
    }

    Select(key) {
        var maps = this.maps;
        Object.keys(this.maps).forEach(function (k) {
            maps[k].Unload();
        });
        this.active = this.maps[key];
        this.active.Load();
    }

    get ActiveMap() {
        if (this.active == null || this.active == undefined)
        {
            throw "Нет активной карты!";
        }
        return this.active;
    }

    GetAll() {
        return Object.values(this.maps);
    }
}

var mapProvider = new MapProvider();
mapProvider.Add('yandex', new YandexMap('map'));
mapProvider.Add('google', new GoogleMap('map'));

function InitGoogleMap() {
    mapProvider.Get('google').Init();
    mapProvider.Select('google');
}

ymaps.ready(function () {
    /*
    $('#autocomplete').keyup(function () {
        if ($(this).val().length >= 3) {
            map.GeoCoder.Find($(this).val(), function (result) {
                $('#autocomplete').autocomplete({
                    source: result.AutocompleteData,
                    select: function (e, ui) {
                        console.log(ui);
                    }
                });
            });
        }
    });

    $('#zoom').keyup(function () {
        map.SetZoom($('#zoom').val());
    });
    */

    (function ($) {
        $.fn.toolbar = function (options) {
            var settings = $.extend({
                controls: [],
                selected: function (selected, old) { }
            }, options);

            var instance = $(this);

            this.flush = function () {
                $(this).find('.toolbar-button-selected').removeClass('toolbar-button-selected');
            }

            return this.each(function () {
                instance.addClass('toolbar');
                settings.controls.forEach(function (e) {
                    var element = document.createElement('div');
                    if (e.image != null && e.image != undefined) {
                        $(element).html('<img src="/Content/Images/' + e.image + '" />')
                    }
                    $(element).html($(element).html() + ' ' + e.title);
                    $(element).addClass('toolbar-button');
                    $(element).attr('command', e.command);
                    if (e.tooltip != null && e.tooltip != undefined && e.tooltip != '') {
                        $(element).attr('title', e.tooltip)
                    }
                    $(element).click(function (e) {
                        var old = $(this).parent().find('.toolbar-button-selected').attr('command');
                        if ($(this).hasClass('toolbar-button-selected')) {
                            $(this).removeClass('toolbar-button-selected');
                            settings.selected(null, old);
                        } else {
                            $(this).parent().find('.toolbar-button').removeClass('toolbar-button-selected');
                            $(this).addClass('toolbar-button-selected');
                            settings.selected($(this).attr('command'), old);
                        }
                    });
                    instance.append(element);
                });
            });
        };

    }(jQuery));

    toolbar = $('#toolbar').toolbar({
        controls: [
            {
                title: "Сообщение",
                command: 'message',
                image: "x16/speech-bubble.png"
            },
            {
                title: "Отрезок",
                command: 'line',
                image: "x16/line.png",
                tooltip: "Простая линия"
            },
            {
                title: "Ломанная",
                command: 'polyline',
                image: "x16/polyline.png",
                tooltip: "Ломанная линия"
            },
            {
                title: "Полигон",
                command: 'polygon',
                image: "x16/hexagon.png",
                tooltip: "Заполненная цветом область"
            }
        ],
        selected: function (n, o) {
            if (n != null && n != undefined) {
                mapProvider.ActiveMap.BeginDrawing(n);
            } else {
                mapProvider.ActiveMap.EndDrawing();
            }
        }
    });

    $('#service_toolbar').toolbar({
        controls: [
            {
                title: "Яндекс.Карты",
                command: 'yandex',
                image: "x16/yandex.png"
            },
            {
                title: 'Google Maps',
                command: 'google',
                image: "x16/google.png"
            }
        ],
        selected: function (n, o) {
            toolbar.flush();
            mapProvider.Select(n);
        }
    });

    $("#lineColorPicker").spectrum({
        flat: false,
        showAlpha: false,
        showPalette: true,
        cancelText: 'Отмена',
        chooseText: 'Применить',
        color: "#880000",
        maxSelectionSize: 4,
        showButtons: false,
        move: function (color) {
            console.log('Color pick: ' + color.toHexString().substring(1));
            mapProvider.GetAll().forEach(function (e) {
                e.ActiveBrush.LineColor.RGB = color.toHexString().substring(1);
                if (e.SelectedObject != undefined && e.SelectedObject != null) {
                    e.SelectedObject.Draw();
                }
            });
        }
    });

    $("#fillColorPicker").spectrum({
        flat: false,
        showAlpha: true,
        showPalette: true,
        cancelText: 'Отмена',
        chooseText: 'Применить',
        color: "#88880000",
        maxSelectionSize: 4,
        showButtons: false,
        move: function (color) {
            mapProvider.GetAll().forEach(function (e) {
                e.ActiveBrush.FillColor.RGBA = color.toHex8String().substring(1);
                if (e.SelectedObject != undefined && e.SelectedObject != null)
                {
                    e.SelectedObject.Draw();
                }
            });
        }
    });

    $('#lineWeight').on('change', function (e) {
        var weight = this.value;
        mapProvider.GetAll().forEach(function (e) {
            e.ActiveBrush.Weight = weight;
            if (e.SelectedObject != undefined && e.SelectedObject != null) {
                e.SelectedObject.Draw();
            }
        });
    });

    mapProvider.Get('yandex').Init();
});

