# jQuery UI Widget: Duration Picker

![Screenshot](image/screenshot.png?raw=true)

This widget aims to provide an interface from which users can easily set a duration in time.  It allows a single value in seconds to be retrieved.

If there is an interest or a need I'll modify this widget to have more types of units and some more configuration options.

# Getting Started

Include jQuery and jQuery UI in a HTML page, and add a div:
```html
<body>
    <div id="durationPicker"></div>
</body>
```
Initialize the durationPicker:
```javascript
$("#durationPicker").durationPicker()
```

# API

Get raw seconds:
```javascript
var seconds = $("#durationPicker").durationPicker("seconds");
```
Set raw seconds:
```javascript
$("#durationPicker").durationPicker("seconds", 123);
```
Get values by unit:
```javascript
$("#durationPicker").durationPicker("getUnitQty", "hour");
```
Set values by unit:
```javascript
$("#durationPicker").durationPicker("setUnitQty", "hour", 2);
```
