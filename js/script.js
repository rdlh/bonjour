window.addEvent('domready',function() {
  var searchBox = $('search-box'), searchLoaded = false, searchFn = function() {
    if(!searchLoaded) {
      searchLoaded = true;

      var container = new Element('div',{ id: 'search-results', position: 'relative' }).inject($('search-area-custom'),'after');
      var wrapper = new Element('div',{
        styles: {
          position: 'relative'
        }
      }).inject(container);
      new Element('div',{ id: 'search-results-pointer' }).inject(wrapper);
      var contentContainer = new Element('div',{ id: 'search-results-content' }).inject(wrapper);

      var search  = new google.search.WebSearch(),
          control = new google.search.SearchControl(),
          options = new google.search.DrawOptions();

      options.setDrawMode(google.search.SearchControl.DRAW_MODE_TABBED);
      options.setInput(searchBox);

      control.addSearcher(search);
      control.draw(contentContainer,options);
      control.setNoResultsString('Aucun resultat :( ...');

      searchBox.addEvents({
        keyup: function(e) {
          if(searchBox.value && searchBox.value != searchBox.get('placeholder')) {
            container.fade(0.9);
            control.execute(searchBox.value);
          }
          else {
            container.fade(0);
          }
        }
      });
      searchBox.removeEvent('focus',searchFn);
    }
  };
  searchBox.addEvent('focus',searchFn);
})

window.addEvent('onload', initialize())

// GEOLOCALISATION

  var geocoder;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  }
  function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    codeLatLng(lat, lng)
  }

  function errorFunction(){
    alert("Geocoder failed");
  }

  function initialize() {
    geocoder = new google.maps.Geocoder();
  }

  function codeLatLng(lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      console.log(results)
        if (results[1]) {
          for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {
              if (results[0].address_components[i].types[b] == "locality") {
                city = results[0].address_components[i];
                break;
              }
            }
          }
          new Element('span',{ text: 'What\'s up in ' + city.short_name + ' ?' }).inject($('logo-bjr'),'after');
        }
      }
    });
  }
