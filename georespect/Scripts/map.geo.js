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
    getLat() {
        throw "Not implemented!";
    }
    getLng() {
        throw "Not implemented!";
    }
    toString() {
        throw "Not implemented!";
    }
    fromString() {
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

/*
    Интерфейс IGeoCoder служит для унификации работы с разными службами геокодирования.
*/
class IGeoCoder {
    Find(address) {
        throw "Not implemented!";
    }
}

/*
    Интерфейс IGeoCoder служит для унификации работы с разными службами карт
*/
class IMap {

    constructor(divName) {
        this.divElement = $(divName);
        this.selectedBrush = new Brush();
        this.selectedObject = null;
        this.isInit = false;
        this.objects = new Array();
    }

    get MapElement() {
        return this.divElement;
    };

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

    get SelectedObject() {
        return selectedObject;
    }

    CreateObject(object) {
        this.objects.push(object);
        this.selectedObject = object;
        object.Brush = this.selectedBrush;
    }

};

var map = new IMap('map');
map.CreateObject(new ILine(new Array()));
map.CreateObject(new ILine(new Array()));
map.CreateObject(new IPolygon(new Array()));

console.log(map);

map.Load();

