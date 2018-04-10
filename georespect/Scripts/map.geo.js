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

    Init() {
        throw "Not implemented!";
    }

    Draw() {
        throw "Not implemented!";
    }

    Destroy() {
        throw "Not implemented!";
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
    Интерфейс IPolyline расширяет ICompositeObject для представления ломанной
*/
class IPolyline extends ICompositeObject {
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
}

/*
    Интерфейс IPolyline расширяет ICompositeObject для представления полигона (замкнутая линия с заливкой)
*/
class IPolygon extends ICompositeObject {
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
}

/*
    Интерфейс IPolyline расширяет ICompositeObject для линии
*/
class ILine extends ICompositeObject {
    constructor(object) {
        super(object);
    }
}

class Line extends ILine {
    constructor(object) {
        super(object);
    }

    Draw() {
        console.log('Draw Line using line color ' + this.Brush.LineColor.String);
    }
}

/*
    Интерфейс IPolyline расширяет IObject для представления информационной метки
*/
class IInfo extends IObject {
    constructor(object) {
        super(object);
    }
}

class Info extends IInfo {
    constructor(object) {
        super(object);
    }

    Draw() {
        console.log('Draw Info');
    }
}


/*
    Интерфейс IGeoCoder служит для унификации работы с разными службами геокодирования.
*/
class IGeoCoder {
    Find(address) {
        throw "Not implemented!";
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
    Find(address) {
        return null;
    }
}

class YandexGeoCoder extends IGeoCoder {
    constructor() {
        super();
    }

    Find(address) {
        var results = ymaps.geocode(address, {
            json: true
        });

        var ret = new Array();
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
            },
            function (err) {
                console.log(err);
            }
        );
        return ret;
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
        return selectedObject;
    }

    CreateObject(object) {
        this.objects.push(object);
        this.selectedObject = object;
        object.Brush = this.selectedBrush;
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
        this.geocoder = new YandexGeoCoder();
    }

    Load() {
        this.instance = new ymaps.Map(this.ElementName, {
            center:[55.76, 37.64],
            zoom:2
        });
        super.Load();
    }
}


var map = new YandexMap('map');
map.CreateObject(new Line(new Array()));
map.CreateObject(new Line(new Array()));
map.CreateObject(new Polygon(new Array()));

console.log(map);

ymaps.ready(function () {
    map.Load();
    console.log(map.GeoCoder.Find("Ижевск"));
});

