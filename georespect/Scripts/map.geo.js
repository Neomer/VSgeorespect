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
        this.color = newValue;
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

    get Alpha() {
        return this.alpha;
    }

    set Alpha(newValue) {
        this.alpha = newValue;
    }

    get String() {
        return super.String + this.alpha;
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
    }

    get LineColor() {
        return this.lineColor;
    }

    get FillColor() {
        return this.fillColor;
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
        return this.constructor[0];
    }
    get Lng() {
        return this.constructor[1];
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
        console.log('Draw Polyline using line color ' + this.Brush.LineColor.String);
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
        super.Object.editor.startEditing();
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
        console.log('Draw Polygon using line color ' + this.Brush.LineColor.String + ' and fill color ' + this.Brush.FillColor.String);
    }

    get MaxVerticies() {
        return 15;
    }
}

class YandexPolygon extends Polygon {
    constructor(object) {
        super(object);
    }

    AddVertex(coords) {
        var geometry = super.Object.geometry;
        geometry.insert(geometry.getLength(), coords.Coordinates);
    }

    Draw() {
        super.Object.editor.startEditing();
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
        super.Object.editor.startEditing();
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
        console.log('Draw Info');
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
            case 'info': return new YandexLine(null);
            case 'line': return new YandexLine(new ymaps.Polyline([]));
            case 'polyline': return new YandexPolyline(new ymaps.Polyline([]));
            case 'polygon': return new YandexPolygon(null);
            default: return null;
        }
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

    get GeoCoder() {
        return this.geocoder;
    }

    get SelectedObject() {
        return this.selectedObject;
    }

    CreateObject(object) {
        if (Object.is(object, null) || Object.is(object, undefined)) {
            throw "Null reference exception!";
        }
        object.Init();
        this.objects.push(object);
        this.selectedObject = object;
        object.Brush = this.selectedBrush;
    }

    BeginDrawing() {
        throw "Not implemented!";
    }

    EndDrawing() {
        throw "Not implemented!";
    }
};

class GoogleMap extends IMap {
    constructor(divName) {
        super(divName);
        this.geocoder = new GoogleGeoCoder();
    }
}

class YandexMap extends IMap {
    constructor(divName) {
        super(divName);
        this.instance = null;

        this.geocoder = new YandexGeoCoder();
        this.factory = new YandexObjectFactory(this, this.instance);
    }

    Load() {
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

    SetZoom(value) {
        this.instance.setZoom(value);
    }

    CreateObject(object) {
        super.CreateObject(object);
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
        this.cursor.setKey('arrow');
        this.instance.events.remove('click');
    }
}


var map = new YandexMap('map');
console.log(map);


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

            return this.each(function () {
                instance.addClass('toolbar');
                settings.controls.forEach(function (e) {
                    var element = document.createElement('div');
                    if (e.image != null && e.image != undefined)
                    {
                        $(element).html('<img src="/Content/Images/' + e.image + '" />')
                    }
                    $(element).addClass('toolbar-button');
                    $(element).attr('command', e.command);
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

    $('#toolbar').toolbar({
        controls: [
            {
                title: "Сообщение",
                command: 'message',
                image: "x16/speech-bubble.png"
            },
            {
                title: "Линия",
                command: 'line',
                image: "x16/line.png"
            },
            {
                title: "Ломанная",
                command: 'polyline',
                image: "x16/polyline.png"
            },
            {
                title: "Полигон",
                command: 'polygon',
                image: "x16/hexagon.png"
            }
        ],
        selected: function (n, o) {
            console.log('Tool changed from ' + o + ' to ' + n);
            if (n != null && n != undefined) {
                map.BeginDrawing(n);
            } else {
                map.EndDrawing();
            }
        }
    });

    map.Load();
});

